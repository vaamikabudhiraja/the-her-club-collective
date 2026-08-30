// Homepage — a polished, responsive product grid driven by live Shopify data.
// Runs on the server, so the Storefront token stays server-side.
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      {/* Intro */}
      <section className="mb-12 max-w-2xl">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-turquoise">
          Her Club Collective
        </p>
        <h1 className="font-serif text-4xl leading-tight text-ink sm:text-5xl">
          Jewellery for every version of you
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          From dainty everyday pieces to going-out sparkle — pieces made to be
          layered, gifted, and lived in.
        </p>
      </section>

      {/* States */}
      {error && (
        <div className="rounded-xl border border-blush bg-blush-soft px-5 py-4 text-sm text-ink">
          Couldn’t load products: {error}
        </div>
      )}

      {!error && products.length === 0 && (
        <p className="text-sm text-muted">
          No products yet — they’ll appear here as soon as they’re published.
        </p>
      )}

      {/* Grid */}
      {products.length > 0 && (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
