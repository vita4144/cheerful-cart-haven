import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Header } from "@/components/Header";
import { useShop } from "@/lib/shop-context";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Oakline" }] }),
  component: CartPage,
});

function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useShop();
  const navigate = useNavigate();
  const tax = cartTotal * 0.1;
  const total = cartTotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div data-testid="empty-cart" className="mt-10 rounded-lg border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Link to="/" className="mt-4 inline-block rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90">
              Browse catalogue
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
            <div data-testid="cart-items" className="overflow-hidden rounded-lg border border-border">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} data-testid={`cart-item-${product.id}`} className="flex items-center gap-4 border-b border-border p-4 last:border-b-0">
                  <img src={product.image} alt={product.name} className="h-20 w-20 rounded object-cover" />
                  <div className="flex-1">
                    <div data-testid={`cart-name-${product.id}`} className="font-medium">{product.name}</div>
                    <div data-testid={`cart-price-${product.id}`} className="text-sm text-muted-foreground">${product.price.toFixed(2)}</div>
                  </div>
                  <div className="inline-flex items-center rounded-md border border-border">
                    <button data-testid={`cart-qty-decrease-${product.id}`} onClick={() => updateQty(product.id, quantity - 1)} className="px-2 py-1.5 hover:bg-accent">
                      <Minus size={14} />
                    </button>
                    <span data-testid={`cart-qty-${product.id}`} className="min-w-10 text-center text-sm">{quantity}</span>
                    <button data-testid={`cart-qty-increase-${product.id}`} onClick={() => updateQty(product.id, quantity + 1)} className="px-2 py-1.5 hover:bg-accent">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div data-testid={`cart-line-total-${product.id}`} className="w-24 text-right font-medium">
                    ${(product.price * quantity).toFixed(2)}
                  </div>
                  <button
                    data-testid={`cart-remove-${product.id}`}
                    onClick={() => removeFromCart(product.id)}
                    className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <aside data-testid="order-summary" className="h-fit rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Order Summary</h2>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd data-testid="summary-subtotal">${cartTotal.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax (10%)</dt>
                  <dd data-testid="summary-tax">${tax.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
                  <dt>Total</dt>
                  <dd data-testid="summary-total">${total.toFixed(2)}</dd>
                </div>
              </dl>
              <button
                data-testid="checkout-btn"
                onClick={() => navigate({ to: "/checkout" })}
                className="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
