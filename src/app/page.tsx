// Homepage — quiet-luxury hero + a calm, refined product grid driven by live
// Shopify data. Runs on the server, so the Storefront token stays server-side.
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { ProductGrid } from "@/components/ProductGrid";
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
      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow text-gold">Modern fine jewellery</p>
          </Reveal>

          <Reveal delay={120}>
            <h1 className="font-display mx-auto mt-6 max-w-2xl text-5xl leading-[1.08] text-ink sm:text-6xl">
              Jewellery that just gets you.
            </h1>
          </Reveal>

          <Reveal delay={220}>
            <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              Dainty everyday pieces, considered going-out styles, and the quiet
              extras in between — carefully chosen, tarnish-free, and made to
              last.
            </p>
          </Reveal>

          <Reveal delay={320}>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <Link href="#products" className="btn btn-primary">
                Shop the collection
              </Link>
              <Link href="/about" className="link-underline text-sm">
                Our story
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section
        id="products"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24"
      >
        <Reveal>
          <div className="mb-12 text-center">
            <p className="eyebrow text-gold">The collection</p>
            <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
              Chosen with care
            </h2>
          </div>
        </Reveal>

        {error && (
          <div className="mx-auto max-w-xl rounded-lg border border-line bg-surface px-5 py-4 text-center text-sm text-muted">
            Couldn’t load products: {error}
          </div>
        )}

        {!error && products.length === 0 && (
          <p className="text-center text-sm text-muted">
            No products yet — they’ll appear here as soon as they’re published.
          </p>
        )}

        {products.length > 0 && <ProductGrid products={products} />}
      </section>

      {/* ── Deep "promise" band — a moment of richness ───────── */}
      <section className="bg-burgundy px-6 py-24 text-center text-bone">
        <Reveal>
          <p className="eyebrow text-gold">The Her Club promise</p>
          <p className="font-display mx-auto mt-5 max-w-2xl text-3xl leading-snug sm:text-4xl">
            Carefully chosen. Tarnish-free. Made to last.
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-bone/70">
            No endless scroll of pieces that fade by Tuesday — just a considered
            edit you’ll reach for long past the trend cycle.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
