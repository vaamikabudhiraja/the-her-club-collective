// Homepage — hero + a polished, responsive product grid driven by live Shopify
// data. Runs on the server, so the Storefront token stays server-side.
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getProducts>> = [];
  let error: string | null = null;

  try {
    products = await getProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Soft decorative palette washes (cheap CSS, no images). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blush-soft blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 top-10 h-64 w-64 rounded-full bg-turquoise-soft blur-3xl"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <Reveal>
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-turquoise">
                Her Club Collective
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="font-serif text-5xl leading-[1.05] text-ink sm:text-6xl">
                Jewellery that just gets you.
              </h1>
            </Reveal>
            <Reveal delay={190}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                Dainty everyday, bold going-out, and the funky little extras in
                between — carefully chosen, tarnish-free, and made to actually
                last.
              </p>
            </Reveal>
            <Reveal delay={290}>
              <Link
                href="#products"
                className="mt-9 inline-flex items-center rounded-full bg-ink px-8 py-4 text-sm font-medium tracking-wide text-cream transition hover:bg-ink/90"
              >
                Come find your piece
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section
        id="products"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-8"
      >
        <Reveal>
          <h2 className="mb-8 font-serif text-2xl text-ink">Shop the collection</h2>
        </Reveal>

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

        {products.length > 0 && (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
            {products.map((product, index) => (
              // Stagger by column so each row cascades left-to-right.
              <Reveal key={product.id} delay={(index % 4) * 80}>
                <ProductCard product={product} index={index} />
              </Reveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
