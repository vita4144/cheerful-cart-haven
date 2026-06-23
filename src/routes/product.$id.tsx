import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { Header } from "@/components/Header";
import { PRODUCTS, useShop } from "@/lib/shop-context";

export const Route = createFileRoute("/product/$id")({
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Link to="/" className="mt-4 inline-block text-sm underline">Back to catalogue</Link>
      </main>
    </div>
  ),
});

function ProductPage() {
  const { id } = Route.useParams();
  const product = PRODUCTS.find((p) => p.id === Number(id));
  const { addToCart, cart } = useShop();
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-md px-6 py-20 text-center">
          <h1 className="text-2xl font-semibold">Product not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm underline">Back to catalogue</Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link to="/" data-testid="back-to-catalogue" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={16} /> Back to Catalogue
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <img data-testid="product-detail-image" src={product.image} alt={product.name} className="aspect-square w-full rounded-lg object-cover" />
          <div>
            <span className="text-xs uppercase tracking-wide text-muted-foreground" data-testid="product-detail-category">{product.category}</span>
            <h1 data-testid="product-detail-title" className="mt-2 text-4xl font-semibold tracking-tight">{product.name}</h1>
            <p data-testid="product-detail-price" className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p>
            <p data-testid="product-detail-description" className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div className="mt-8 flex items-center gap-4">
              <div className="inline-flex items-center rounded-md border border-border">
                <button data-testid="qty-decrease" onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-accent">
                  <Minus size={14} />
                </button>
                <span data-testid="qty-value" className="min-w-10 text-center text-sm">{qty}</span>
                <button data-testid="qty-increase" onClick={() => setQty((q) => q + 1)} className="px-3 py-2 hover:bg-accent">
                  <Plus size={14} />
                </button>
              </div>
              <button
                data-testid="detail-add-to-cart-btn"
                onClick={() => addToCart(product, qty)}
                className={`inline-flex items-center gap-2 rounded-md px-6 py-2.5 text-sm font-medium transition-colors ${
                  cart.some((i) => i.product.id === product.id)
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-primary text-primary-foreground hover:opacity-90"
                }`}
              >
                {cart.some((i) => i.product.id === product.id) ? (
                  <>
                    <Check size={16} />
                    <span>In your cart</span>
                  </>
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
