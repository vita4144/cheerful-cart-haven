import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Check, Grid3x3, List } from "lucide-react";
import { Header } from "@/components/Header";
import { PRODUCTS, useShop } from "@/lib/shop-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Catalogue — Oakline Furniture" },
      { name: "description", content: "Browse modern wardrobes, drawers, bookshelves, mudrooms and walk-in closets." },
    ],
  }),
  component: Catalogue,
});

const PAGE_SIZE = 12;

type SortKey = "featured" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const CATEGORIES = Array.from(new Set(PRODUCTS.map((p) => p.category))).sort();

function Catalogue() {
  const { addToCart, cart } = useShop();
  const inCart = (id: number) => cart.some((i) => i.product.id === id);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("featured");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = PRODUCTS.slice();
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc": list.sort((a, b) => a.price - b.price); break;
      case "price-desc": list.sort((a, b) => b.price - a.price); break;
      case "name-asc": list.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc": list.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return list;
  }, [category, sort, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const rangeEnd = start + visible.length;

  // Reset to page 1 when filters change the result count below current page
  if (safePage !== page) setTimeout(() => setPage(safePage), 0);

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Catalogue</h1>
            <p data-testid="results-summary" className="mt-1 text-sm text-muted-foreground">
              {filtered.length === 0
                ? "No items match your filters"
                : `Showing ${start + 1}–${rangeEnd} of ${filtered.length} ${filtered.length === 1 ? "item" : "items"}`}
            </p>
          </div>
          <div className="flex gap-2" data-testid="view-toggle">
            <button
              data-testid="view-toggle-grid"
              onClick={() => setView("grid")}
              aria-pressed={view === "grid"}
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${view === "grid" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
            >
              <Grid3x3 size={16} /> Grid
            </button>
            <button
              data-testid="view-toggle-list"
              onClick={() => setView("list")}
              aria-pressed={view === "list"}
              className={`inline-flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm ${view === "list" ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
            >
              <List size={16} /> List
            </button>
          </div>
        </div>

        <div data-testid="filters" className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <input
            data-testid="filter-search"
            type="search"
            placeholder="Search by name or category…"
            value={search}
            onChange={(e) => resetPage(setSearch)(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          />
          <select
            data-testid="filter-category"
            value={category}
            onChange={(e) => resetPage(setCategory)(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            data-testid="filter-sort"
            value={sort}
            onChange={(e) => resetPage(setSort)(e.target.value as SortKey)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
          >
            <option value="featured">Sort: Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A–Z</option>
            <option value="name-desc">Name: Z–A</option>
          </select>
        </div>



        {view === "grid" ? (
          <div data-testid="product-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((p) => (
              <div
                key={p.id}
                data-testid={`product-card-${p.id}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition hover:shadow-lg"
              >
                <Link to="/product/$id" params={{ id: String(p.id) }} className="block overflow-hidden">
                  <img src={p.image} alt={p.name} className="aspect-square w-full object-cover transition group-hover:scale-105" />
                </Link>
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">{p.category}</span>
                  <Link to="/product/$id" params={{ id: String(p.id) }} data-testid={`product-title-${p.id}`} className="mt-1 font-medium hover:underline">
                    {p.name}
                  </Link>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span data-testid={`product-price-${p.id}`} className="text-lg font-semibold">${p.price.toFixed(2)}</span>
                    <button
                      data-testid={`add-to-cart-${p.id}`}
                      onClick={() => addToCart(p)}
                      className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:opacity-90"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div data-testid="product-list" className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-secondary text-secondary-foreground">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {visible.map((p) => (
                  <tr key={p.id} data-testid={`product-card-${p.id}`} className="border-t border-border">
                    <td className="px-4 py-3">
                      <Link to="/product/$id" params={{ id: String(p.id) }} className="flex items-center gap-3 hover:underline">
                        <img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover" />
                        <span data-testid={`product-title-${p.id}`}>{p.name}</span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                    <td className="px-4 py-3" data-testid={`product-price-${p.id}`}>${p.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        data-testid={`add-to-cart-${p.id}`}
                        onClick={() => addToCart(p)}
                        className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90"
                      >
                        Add to Cart
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div data-testid="pagination" className="mt-10 flex items-center justify-center gap-2">
          <button
            data-testid="pagination-prev"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-accent"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              data-testid={`pagination-page-${n}`}
              onClick={() => setPage(n)}
              aria-current={page === n}
              className={`min-w-9 rounded-md border px-3 py-1.5 text-sm ${page === n ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-accent"}`}
            >
              Page {n}
            </button>
          ))}
          <button
            data-testid="pagination-next"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-40 hover:bg-accent"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
