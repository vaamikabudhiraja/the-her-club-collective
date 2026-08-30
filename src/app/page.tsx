// Homepage — bold & playful hero + a punchy, responsive product grid driven by
// live Shopify data. Runs on the server, so the Storefront token stays server-side.
import Link from "next/link";
import { getProducts } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";

const VALUE_PROPS = [
  { label: "Tarnish-free", className: "bg-blush-soft" },
  { label: "Made to actually last", className: "bg-mint-soft" },
  { label: "Everyone’s invited", className: "bg-turquoise-soft" },
];

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
        {/* Playful decorative shapes — cheap CSS, no images. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-20 h-72 w-72 rounded-full bg-blush-soft blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-10%] top-4 h-80 w-80 rounded-full bg-turquoise-soft blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-10 top-24 hidden h-16 w-16 rotate-12 rounded-3xl bg-butter sm:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[42%] top-16 hidden h-6 w-6 rounded-full bg-blush lg:block"
        />

        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-16 sm:pb-20 sm:pt-24">
          <div className="max-w-3xl">
            <Reveal>
              <span className="chip bg-mint-soft">
                <span aria-hidden="true">✦</span> New drop energy
              </span>
            </Reveal>

            <Reveal delay={90}>
              <h1 className="font-display mt-6 text-5xl leading-[0.98] text-ink sm:text-7xl">
                Jewellery that just gets{" "}
                <span className="marker whitespace-nowrap">you.</span>
              </h1>
            </Reveal>

            <Reveal delay={190}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl">
                Dainty everyday, bold going-out, and the funky little extras in
                between — carefully chosen, tarnish-free, and made to last.
              </p>
            </Reveal>

            <Reveal delay={280}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link href="#products" className="btn btn-primary">
                  Come find your piece
                </Link>
                <Link href="/about" className="btn btn-outline">
                  Our story
                </Link>
              </div>
            </Reveal>

            <Reveal delay={360}>
              <ul className="mt-9 flex flex-wrap gap-2.5">
                {VALUE_PROPS.map((prop) => (
                  <li key={prop.label} className={`chip ${prop.className}`}>
                    <span aria-hidden="true">✦</span> {prop.label}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Products ─────────────────────────────────────────── */}
      <section
        id="products"
        className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-10"
      >
        <Reveal>
          <div className="mb-9 flex items-end justify-between gap-4">
            <h2 className="font-display text-3xl text-ink sm:text-4xl">
              Shop the collection
            </h2>
            <span className="hidden h-3 w-16 rounded-full bg-gradient-to-r from-blush via-turquoise to-butter sm:block" />
          </div>
        </Reveal>

        {error && (
          <div className="rounded-2xl border border-blush bg-blush-soft px-5 py-4 text-sm text-ink">
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
