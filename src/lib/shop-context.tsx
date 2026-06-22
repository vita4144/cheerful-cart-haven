import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
};

export type CartItem = { product: Product; quantity: number };
export type User = { name: string; email: string; password: string };

const IMG = (seed: string) =>
  `https://images.unsplash.com/photo-${seed}?auto=format&fit=crop&w=800&q=80`;

const IMAGES = [
  "1672137233327-37b0c1049e77",
  "1690310588492-fc8f92bff323",
  "1593430980369-68efc5a5eb34",
  "1516455207990-7a41ce80f7ee",
  "1618236444721-4a8dba415c15",
  "1540574163026-643ea20ade25",
  "1538688525198-9b88f6f53126",
  "1616627561950-9f746e330187",
  "1567016432779-094069958ea5",
  "1595428774223-ef52624120d2",
  "1631679706909-1844bbd07221",
  "1532323544230-7191fd51bc1b",
];

const CATEGORIES = ["Wardrobe", "Drawer", "Bookshelf", "Mudroom", "Walk-in Closet", "Cabinet"];

export const PRODUCTS: Product[] = Array.from({ length: 24 }, (_, i) => {
  const category = CATEGORIES[i % CATEGORIES.length];
  return {
    id: i + 1,
    name: `${category} ${["Aurora", "Vienna", "Nordic", "Oslo", "Madrid", "Kyoto", "Lisbon", "Berlin"][i % 8]} ${Math.floor(i / 8) + 1}`,
    category,
    price: Math.round((199 + i * 47.5) * 100) / 100,
    description: `A finely crafted ${category.toLowerCase()} blending modern design with timeless utility. Built with solid oak, soft-close hinges, and adjustable shelving to fit your space and lifestyle.`,
    image: IMG(IMAGES[i % IMAGES.length]),
  };
});

type ShopContextValue = {
  user: User | null;
  users: User[];
  register: (u: User) => string | null;
  login: (email: string, password: string) => string | null;
  logout: () => void;
  cart: CartItem[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const ShopContext = createContext<ShopContextValue | null>(null);

const LS_USERS = "shop_users";
const LS_USER = "shop_user";
const LS_CART = "shop_cart";

function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUsers(load<User[]>(LS_USERS, []));
    setUser(load<User | null>(LS_USER, null));
    setCart(load<CartItem[]>(LS_CART, []));
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(LS_USERS, JSON.stringify(users));
  }, [users, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(LS_USER, JSON.stringify(user));
  }, [user, ready]);
  useEffect(() => {
    if (ready) localStorage.setItem(LS_CART, JSON.stringify(cart));
  }, [cart, ready]);

  const register = (u: User) => {
    if (users.some((x) => x.email === u.email)) return "Email already registered";
    setUsers([...users, u]);
    setUser(u);
    return null;
  };

  const login = (email: string, password: string) => {
    const existing = load<User[]>(LS_USERS, []);
    const found = existing.find((u) => u.email === email && u.password === password);
    if (!found) return "Invalid credentials";
    setUser(found);
    return null;
  };

  const logout = () => setUser(null);

  const addToCart = (p: Product, qty = 1) => {
    setCart((c) => {
      const existing = c.find((i) => i.product.id === p.id);
      if (existing) return c.map((i) => (i.product.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      return [...c, { product: p, quantity: qty }];
    });
  };
  const removeFromCart = (id: number) => setCart((c) => c.filter((i) => i.product.id !== id));
  const updateQty = (id: number, qty: number) =>
    setCart((c) => c.map((i) => (i.product.id === id ? { ...i, quantity: Math.max(1, qty) } : i)));
  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.quantity * i.product.price, 0);

  return (
    <ShopContext.Provider
      value={{
        user,
        users,
        register,
        login,
        logout,
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be inside ShopProvider");
  return ctx;
}
