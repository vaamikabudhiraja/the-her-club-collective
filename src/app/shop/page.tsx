import type { Metadata } from "next";
import { getAllProducts } from "@/lib/shopify";
import { ProductFilters } from "@/components/ProductFilters";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Shop All — Her Club Collective",
  description: "Browse the full collection — filter by type, collection, and price.",
};

export default async function ShopPage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let error: string | null = null;

  try {
    products = await getAllProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow text-gold">Shop</p>
          <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">
            All pieces
          </h1>
        </div>
      </Reveal>

      {error && (
        <p className="text-center text-sm text-muted">
          Couldn’t load products: {error}
        </p>
      )}

      {!error && products.length === 0 && (
        <p className="text-center text-sm text-muted">
          No products yet — they’ll appear here as soon as they’re published.
        </p>
      )}

      {products.length > 0 && <ProductFilters products={products} />}
    </div>
  );
}
