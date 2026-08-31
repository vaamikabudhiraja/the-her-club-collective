import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, type ShopProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import { OCCASION_LINKS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "What To Get Her — Her Club Collective",
  description:
    "A little gift guide. Find the perfect piece by budget or occasion — tarnish free, made to last, and gift ready.",
};

// ── Helpers ──────────────────────────────────────────────────
function currencySymbol(code: string): string {
  try {
    return (0)
      .toLocaleString("en", {
        style: "currency",
        currency: code,
        minimumFractionDigits: 0,
      })
      .replace(/[\d.,\s]/g, "");
  } catch {
    return `${code} `;
  }
}

type Budget = { label: string; min: number; max: number };

// A horizontal, swipeable row of products (great for browsing on a phone).
function GiftRow({ products }: { products: ShopProduct[] }) {
  return (
    <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {products.map((product) => (
        <div key={product.id} className="w-40 shrink-0 snap-start sm:w-52">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}

export default async function WhatToGetHerPage() {
  let products: ShopProduct[] = [];
  let error: string | null = null;

  try {
    products = await getAllProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  const sym = currencySymbol(
    products[0]?.priceRange.minVariantPrice.currencyCode ?? "EUR"
  );

  const budgets: Budget[] = [
    { label: `Under ${sym}25`, min: 0, max: 25 },
    { label: `${sym}25 to ${sym}50`, min: 25, max: 50 },
    { label: `${sym}50 to ${sym}100`, min: 50, max: 100 },
    { label: `${sym}100+`, min: 100, max: Infinity },
  ];

  // Group products into budget bands (skip empty bands), cap each row.
  const byBudget = budgets
    .map((b) => ({
      ...b,
      items: products
        .filter((p) => p.price >= b.min && p.price < b.max)
        .slice(0, 12),
    }))
    .filter((b) => b.items.length > 0);

  // Bundles auto-populate from a "Bundle" product type, a "bundle" tag, or a
  // "bundles" collection — whichever you use in Shopify.
  const bundles = products.filter(
    (p) =>
      p.productType.toLowerCase() === "bundle" ||
      p.tags.some((t) => t.toLowerCase() === "bundle") ||
      p.collections.some((c) => c.handle === "bundles")
  );

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold-soft blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl px-6 py-20 text-center sm:py-28">
          <Reveal>
            <p className="eyebrow text-gold">The gift guide</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="font-display mt-4 text-4xl leading-tight text-ink sm:text-6xl">
              What To Get Her
            </h1>
          </Reveal>
          <Reveal delay={220}>
            <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Not sure where to start? Narrow it down by budget or occasion, and
              find a piece she’ll actually keep.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p className="eyebrow mt-8 text-muted">
              Tarnish free · Made to last · Gift ready
            </p>
          </Reveal>
        </div>
      </section>

      {error && (
        <p className="mx-auto max-w-2xl px-6 pb-16 text-center text-sm text-muted">
          Couldn’t load gifts right now: {error}
        </p>
      )}

      {/* ── Shop by budget ───────────────────────────────────── */}
      {byBudget.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-8">
          <Reveal>
            <div className="mb-10 text-center">
              <p className="eyebrow text-gold">By budget</p>
              <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
                Shop by budget
              </h2>
            </div>
          </Reveal>

          <div className="flex flex-col gap-14">
            {byBudget.map((b) => (
              <Reveal key={b.label}>
                <div>
                  <div className="mb-5 flex items-baseline justify-between">
                    <h3 className="font-display text-xl text-ink sm:text-2xl">
                      {b.label}
                    </h3>
                    <Link
                      href="/shop"
                      className="link-underline text-sm text-muted"
                    >
                      See all
                    </Link>
                  </div>
                  <GiftRow products={b.items} />
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ── Shop by occasion ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="eyebrow text-gold">By occasion</p>
            <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
              Shop by occasion
            </h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {OCCASION_LINKS.map((o) => (
              <Link
                key={o.href}
                href={o.href}
                className="group flex aspect-[4/3] flex-col items-center justify-center rounded-xl border border-line bg-surface p-4 text-center [transition:transform_0.4s_var(--ease-out),box-shadow_0.4s_var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_20px_40px_-24px_rgba(36,31,27,0.4)]"
              >
                <span className="font-display text-lg text-ink transition-colors group-hover:text-burgundy sm:text-xl">
                  {o.label}
                </span>
              </Link>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ── Gift bundles ─────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="mb-10 text-center">
            <p className="eyebrow text-gold">Ready to gift</p>
            <h2 className="font-display mt-3 text-3xl text-ink sm:text-4xl">
              Gift bundles
            </h2>
          </div>
        </Reveal>

        {bundles.length > 0 ? (
          <Reveal>
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
              {bundles.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Reveal>
        ) : (
          <Reveal>
            <div className="rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <p className="font-display text-xl text-ink">Coming soon</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Curated sets, beautifully boxed. Bundles will appear here as soon
                as they’re added.
              </p>
            </div>
          </Reveal>
        )}
      </section>
    </div>
  );
}
