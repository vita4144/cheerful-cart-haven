import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { useShop } from "@/lib/shop-context";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Register — Oakline" }] }),
  component: RegisterPage,
});

function RegisterPage() {
  const { register } = useShop();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (form.password.length < 4) return setError("Password too short");
    const err = register({ name: form.name, email: form.email, password: form.password });
    if (err) return setError(err);
    navigate({ to: "/" });
  };

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-md px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">Join Oakline to start shopping.</p>
        <form data-testid="register-form" onSubmit={submit} className="mt-8 space-y-4">
          <Field label="Full name">
            <input data-testid="register-name-input" required value={form.name} onChange={set("name")} className={inputCls} />
          </Field>
          <Field label="Email">
            <input data-testid="register-email-input" type="email" required value={form.email} onChange={set("email")} className={inputCls} />
          </Field>
          <Field label="Password">
            <input data-testid="register-password-input" type="password" required value={form.password} onChange={set("password")} className={inputCls} />
          </Field>
          <Field label="Confirm password">
            <input data-testid="register-confirm-input" type="password" required value={form.confirm} onChange={set("confirm")} className={inputCls} />
          </Field>
          {error && <p data-testid="register-error" className="text-sm text-destructive">{error}</p>}
          <button data-testid="register-submit-btn" type="submit" className="w-full rounded-md bg-primary py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
            Create account
          </button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-foreground underline">Sign in</Link>
          </p>
        </form>
      </main>
    </div>
  );
}

const inputCls = "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}
