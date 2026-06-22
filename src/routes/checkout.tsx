import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { useShop } from "@/lib/shop-context";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Oakline" }] }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", address: "", city: "", zip: "", card: "", expiry: "", cvv: "",
  });

  const tax = cartTotal * 0.1;
  const total = cartTotal + tax;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    clearCart();
    navigate({ to: "/confirmation" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <form data-testid="checkout-form" onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <section data-testid="shipping-section" className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Shipping Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" full>
                  <input data-testid="ship-fullname-input" required value={form.fullName} onChange={set("fullName")} className={inp} />
                </Field>
                <Field label="Address" full>
                  <input data-testid="ship-address-input" required value={form.address} onChange={set("address")} className={inp} />
                </Field>
                <Field label="City">
                  <input data-testid="ship-city-input" required value={form.city} onChange={set("city")} className={inp} />
                </Field>
                <Field label="Zip Code">
                  <input data-testid="ship-zip-input" required value={form.zip} onChange={set("zip")} className={inp} />
                </Field>
              </div>
            </section>

            <section data-testid="payment-section" className="rounded-lg border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Payment Information</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Card Number" full>
                  <input data-testid="payment-card-input" required value={form.card} onChange={set("card")} className={inp} placeholder="4242 4242 4242 4242" />
                </Field>
                <Field label="Expiry">
                  <input data-testid="payment-expiry-input" required value={form.expiry} onChange={set("expiry")} className={inp} placeholder="MM/YY" />
                </Field>
                <Field label="CVV">
                  <input data-testid="payment-cvv-input" required value={form.cvv} onChange={set("cvv")} className={inp} placeholder="123" />
                </Field>
              </div>
            </section>
          </div>

          <aside data-testid="checkout-summary" className="h-fit rounded-lg border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {cart.map(({ product, quantity }) => (
                <li key={product.id} data-testid={`checkout-line-${product.id}`} className="flex justify-between">
                  <span className="text-muted-foreground">{product.name} × {quantity}</span>
                  <span>${(product.price * quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>${cartTotal.toFixed(2)}</dd></div>
              <div className="flex justify-between"><dt className="text-muted-foreground">Tax</dt><dd>${tax.toFixed(2)}</dd></div>
              <div className="flex justify-between border-t border-border pt-3 text-base font-semibold"><dt>Total</dt><dd data-testid="checkout-total">${total.toFixed(2)}</dd></div>
            </dl>
            <button data-testid="place-order-btn" type="submit" className="mt-6 w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
              Place Order
            </button>
          </aside>
        </form>
      </main>
    </div>
  );
}

const inp = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
