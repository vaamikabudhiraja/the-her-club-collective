import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/shopify";

// Quiet-luxury product card: a calm neutral surface, understated hover, and
// the product left to be the hero. No loud colour — just a refined frame.
export function ProductCard({ product }: { product: Product }) {
  const { title, featuredImage, priceRange } = product;
  const price = formatMoney(
    priceRange.minVariantPrice.amount,
    priceRange.minVariantPrice.currencyCode
  );

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col focus:outline-none [transition:transform_0.5s_var(--ease-out)] hover:-translate-y-1.5"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[10px] bg-surface ring-1 ring-line [transition:box-shadow_0.6s_var(--ease-out)] group-hover:shadow-[0_28px_60px_-28px_rgba(36,31,27,0.45)] group-focus-visible:ring-2 group-focus-visible:ring-gold">
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover [transition:transform_0.7s_var(--ease-out)] will-change-transform group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <span className="font-display text-sm tracking-wide text-muted">
              Her Club Collective
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <h3 className="font-display text-lg leading-snug text-ink transition-colors group-hover:text-burgundy">
          {title}
        </h3>
        <p className="text-sm text-muted">{price}</p>
      </div>
    </Link>
  );
}
