import { Link } from "@tanstack/react-router";
import { ShoppingCart, LogOut, LogIn, UserPlus } from "lucide-react";
import { useShop } from "@/lib/shop-context";

export function Header() {
  const { cartCount, cartTotal, user, logout } = useShop();
  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" data-testid="logo-link" className="text-xl font-semibold tracking-tight">
          OAKLINE
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span data-testid="user-name" className="hidden text-sm text-muted-foreground sm:inline">
                {user.name}
              </span>
              <button
                data-testid="logout-btn"
                onClick={logout}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                data-testid="nav-login"
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
              >
                <LogIn size={16} /> Login
              </Link>
              <Link
                to="/register"
                data-testid="nav-register"
                className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
              >
                <UserPlus size={16} /> Sign up
              </Link>
            </>
          )}
          <Link
            to="/cart"
            data-testid="cart-link"
            className="relative inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
          >
            <ShoppingCart size={16} />
            <span data-testid="cart-count">{cartCount}</span>
            <span data-testid="cart-total" className="text-muted-foreground">
              ${cartTotal.toFixed(2)}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
