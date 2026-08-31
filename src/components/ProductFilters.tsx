"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import type { ShopProduct } from "@/lib/shopify";

type SortKey = "newest" | "price-asc" | "price-desc";

type Bucket = { min: number; max: number };
const BUCKETS: Bucket[] = [
  { min: 0, max: 25 },
  { min: 25, max: 50 },
  { min: 50, max: 100 },
  { min: 100, max: Infinity },
];

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

function bucketLabel(b: Bucket, sym: string): string {
  if (b.max === Infinity) return `${sym}${b.min}+`;
  if (b.min === 0) return `Under ${sym}${b.max}`;
  return `${sym}${b.min}–${sym}${b.max}`;
}

// One reusable block of checkbox filters, rendered in both the desktop
// sidebar and the mobile drawer.
function FilterControls({
  types,
  collections,
  buckets,
  sym,
  selectedTypes,
  selectedCollections,
  selectedBuckets,
  toggle,
}: {
  types: string[];
  collections: { handle: string; title: string }[];
  buckets: number[];
  sym: string;
  selectedTypes: string[];
  selectedCollections: string[];
  selectedBuckets: number[];
  toggle: (group: "type" | "collection" | "bucket", value: string | number) => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      {types.length > 0 && (
        <fieldset>
          <legend className="eyebrow mb-3 text-muted">Type</legend>
          <div className="flex flex-col gap-2.5">
            {types.map((t) => (
              <label
                key={t}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(t)}
                  onChange={() => toggle("type", t)}
                  className="h-4 w-4 accent-burgundy"
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {collections.length > 0 && (
        <fieldset>
          <legend className="eyebrow mb-3 text-muted">Collection</legend>
          <div className="flex flex-col gap-2.5">
            {collections.map((c) => (
              <label
                key={c.handle}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedCollections.includes(c.handle)}
                  onChange={() => toggle("collection", c.handle)}
                  className="h-4 w-4 accent-burgundy"
                />
                {c.title}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      {buckets.length > 0 && (
        <fieldset>
          <legend className="eyebrow mb-3 text-muted">Price</legend>
          <div className="flex flex-col gap-2.5">
            {buckets.map((i) => (
              <label
                key={i}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  checked={selectedBuckets.includes(i)}
                  onChange={() => toggle("bucket", i)}
                  className="h-4 w-4 accent-burgundy"
                />
                {bucketLabel(BUCKETS[i], sym)}
              </label>
            ))}
          </div>
        </fieldset>
      )}
    </div>
  );
}

export function ProductFilters({ products }: { products: ShopProduct[] }) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCollections, setSelectedCollections] = useState<string[]>([]);
  const [selectedBuckets, setSelectedBuckets] = useState<number[]>([]);
  const [sort, setSort] = useState<SortKey>("newest");
  const [mobileOpen, setMobileOpen] = useState(false);

  const sym = currencySymbol(
    products[0]?.priceRange.minVariantPrice.currencyCode ?? "EUR"
  );

  // Filter options derived live from the catalogue.
  const typeOptions = useMemo(
    () =>
      Array.from(new Set(products.map((p) => p.productType).filter(Boolean))).sort(),
    [products]
  );
  const collectionOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const p of products) {
      for (const c of p.collections) map.set(c.handle, c.title);
    }
    return Array.from(map, ([handle, title]) => ({ handle, title })).sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  }, [products]);
  const bucketOptions = useMemo(
    () =>
      BUCKETS.map((_, i) => i).filter((i) =>
        products.some((p) => p.price >= BUCKETS[i].min && p.price < BUCKETS[i].max)
      ),
    [products]
  );

  function toggle(group: "type" | "collection" | "bucket", value: string | number) {
    if (group === "type") {
      const t = value as string;
      setSelectedTypes((prev) =>
        prev.includes(t) ? prev.filter((v) => v !== t) : [...prev, t]
      );
    } else if (group === "collection") {
      const h = value as string;
      setSelectedCollections((prev) =>
        prev.includes(h) ? prev.filter((v) => v !== h) : [...prev, h]
      );
    } else {
      const i = value as number;
      setSelectedBuckets((prev) =>
        prev.includes(i) ? prev.filter((v) => v !== i) : [...prev, i]
      );
    }
  }

  function clearAll() {
    setSelectedTypes([]);
    setSelectedCollections([]);
    setSelectedBuckets([]);
  }

  const activeCount =
    selectedTypes.length + selectedCollections.length + selectedBuckets.length;

  const results = useMemo(() => {
    let list = products.filter((p) => {
      if (selectedTypes.length && !selectedTypes.includes(p.productType))
        return false;
      if (
        selectedCollections.length &&
        !p.collections.some((c) => selectedCollections.includes(c.handle))
      )
        return false;
      if (
        selectedBuckets.length &&
        !selectedBuckets.some(
          (i) => p.price >= BUCKETS[i].min && p.price < BUCKETS[i].max
        )
      )
        return false;
      return true;
    });

    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc")
      list = [...list].sort((a, b) => b.price - a.price);
    else list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

    return list;
  }, [products, selectedTypes, selectedCollections, selectedBuckets, sort]);

  const controls = (
    <FilterControls
      types={typeOptions}
      collections={collectionOptions}
      buckets={bucketOptions}
      sym={sym}
      selectedTypes={selectedTypes}
      selectedCollections={selectedCollections}
      selectedBuckets={selectedBuckets}
      toggle={toggle}
    />
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-28">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-display text-lg text-ink">Filters</p>
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-burgundy"
              >
                Clear
              </button>
            )}
          </div>
          {controls}
        </div>
      </aside>

      {/* Results column */}
      <div className="flex-1">
        <div className="mb-8 flex items-center justify-between gap-4 border-b border-line pb-4">
          <p className="text-sm text-muted">
            {results.length} {results.length === 1 ? "piece" : "pieces"}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center gap-2 text-sm text-ink lg:hidden"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M3 6h18M6 12h12M10 18h4" />
              </svg>
              Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </button>
            <label className="flex items-center gap-2 text-sm text-muted">
              <span className="hidden sm:inline">Sort</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold"
              >
                <option value="newest">Newest</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
              </select>
            </label>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8">
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <p className="text-sm text-muted">No pieces match these filters.</p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-3 text-sm text-burgundy underline underline-offset-2"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* Mobile filter drawer */}
      <div
        aria-hidden={!mobileOpen}
        className={`fixed inset-0 z-50 lg:hidden ${
          mobileOpen ? "" : "pointer-events-none"
        }`}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-ink/30 [transition:opacity_0.4s_var(--ease-out)] ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-xs flex-col bg-bone [transition:transform_0.4s_var(--ease-out)] ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <p className="font-display text-lg text-ink">Filters</p>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close filters"
              className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-6">{controls}</div>
          <div className="flex gap-3 border-t border-line px-6 py-4">
            <button
              type="button"
              onClick={clearAll}
              className="flex-1 rounded-md border border-line py-3 text-sm text-ink"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="flex-1 rounded-md bg-burgundy py-3 text-sm text-bone"
            >
              Show {results.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
