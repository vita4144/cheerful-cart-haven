import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { Header } from "@/components/Header";

export const Route = createFileRoute("/confirmation")({
  head: () => ({ meta: [{ title: "Order Confirmed — Oakline" }] }),
  component: ConfirmationPage,
});

function ConfirmationPage() {
  const [orderNumber] = useState(
    () => "OAK-" + Math.floor(100000 + Math.random() * 900000).toString()
  );
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <CheckCircle2 className="mx-auto text-primary" size={64} />
        <h1 data-testid="confirmation-message" className="mt-6 text-3xl font-semibold tracking-tight">
          Thank you for your order!
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          A confirmation email is on its way. Your order reference:
        </p>
        <p data-testid="order-number" className="mt-4 text-lg font-mono font-semibold">
          {orderNumber}
        </p>
        <Link
          to="/"
          data-testid="continue-shopping-btn"
          className="mt-10 inline-block rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Continue Shopping
        </Link>
      </main>
    </div>
  );
}
