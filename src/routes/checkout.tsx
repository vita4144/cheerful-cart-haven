import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { useShop } from "@/lib/shop-context";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Oakline" }] }),
  component: CheckoutPage,
});

type Errors = Partial<Record<"card" | "expiry" | "cvv", string>>;

function validateCard(card: string): string | null {
  if (!/^\d{16}$/.test(card)) return "Card number must be exactly 16 digits";
  return null;
}

function validateExpiry(expiry: string): string | null {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return "Expiry must be in MM/YY format";
  const [mm, yy] = expiry.split("/").map(Number);
  // End of expiry month
  const expDate = new Date(2000 + yy, mm, 0, 23, 59, 59);
  if (expDate.getTime() < Date.now()) return "Expiry date cannot be in the past";
  return null;
}

function validateCvv(cvv: string): string | null {
  if (!/^\d{3}$/.test(cvv)) return "CVV must be exactly 3 digits";
  return null;
}

function CheckoutPage() {
  const { cart, cartTotal, clearCart, user } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: "", address: "", city: "", zip: "", card: "", expiry: "", cvv: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    if (!user) navigate({ to: "/login", search: { redirect: "/checkout" }, replace: true });
  }, [user, navigate]);

  if (!user) return null;

  const tax = cartTotal * 0.1;
  const total = cartTotal + tax;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {
      card: validateCard(form.card) || undefined,
      expiry: validateExpiry(form.expiry) || undefined,
      cvv: validateCvv(form.cvv) || undefined,
    };
    const cleaned: Errors = {};
    (Object.keys(next) as (keyof Errors)[]).forEach((k) => {
      if (next[k]) cleaned[k] = next[k];
    });
    setErrors(cleaned);
    if (Object.keys(cleaned).length > 0) return;
    clearCart();
    navigate({ to: "/confirmation" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-semibold tracking-tight">Checkout</h1>
        <form data-testid="checkout-form" onSubmit={submit} noValidate className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
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
                <Field label="Card Number" full error={errors.card} errorTestId="payment-card-error">
                  <input
                    data-testid="payment-card-input"
                    required
                    value={form.card}
                    onChange={(e) => setForm({ ...form, card: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                    className={inp}
                    placeholder="4242424242424242"
                    inputMode="numeric"
                    maxLength={16}
                  />
                </Field>
                <Field label="Expiry" error={errors.expiry} errorTestId="payment-expiry-error">
                  <input
                    data-testid="payment-expiry-input"
                    required
                    value={form.expiry}
                    onChange={(e) => {
                      const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                      const formatted = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
                      setForm({ ...form, expiry: formatted });
                    }}
                    className={inp}
                    placeholder="MM/YY"
                    inputMode="numeric"
                    maxLength={5}
                  />
                </Field>
                <Field label="CVV" error={errors.cvv} errorTestId="payment-cvv-error">
                  <input
                    data-testid="payment-cvv-input"
                    required
                    value={form.cvv}
                    onChange={(e) => setForm({ ...form, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                    className={inp}
                    placeholder="123"
                    inputMode="numeric"
                    maxLength={3}
                  />
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

function Field({
  label,
  children,
  full,
  error,
  errorTestId,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
  error?: string;
  errorTestId?: string;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
      {error && (
        <span data-testid={errorTestId} className="mt-1 block text-xs text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}
