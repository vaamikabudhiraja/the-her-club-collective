import Image from "next/image";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/shopify";

// A soft brand tint sits behind each image. We rotate through the four
// palette colours by position so the grid feels lightly, tastefully coloured
// without painting every card. The tint shows through transparent PNGs and
// stands in as the backdrop when a product has no image yet.
const TINTS = [
  "bg-blush-soft",
  "bg-mint-soft",
  "bg-turquoise-soft",
  "bg-butter-soft",
] as const;

export function ProductCard({
  product,
  index = 0,
}: {
  product: Product;
  index?: number;
}) {
  const { title, featuredImage, priceRange } = product;
  const price = formatMoney(
    priceRange.minVariantPrice.amount,
    priceRange.minVariantPrice.currencyCode
  );
  const tint = TINTS[index % TINTS.length];

  return (
    <Link
      href={`/products/${product.handle}`}
      className="group flex flex-col transition-transform duration-300 ease-out hover:-translate-y-1 focus:outline-none"
    >
      <div
        className={`relative aspect-square w-full overflow-hidden rounded-2xl ${tint} ring-1 ring-line transition-shadow duration-300 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-turquoise`}
      >
        {featuredImage ? (
          <Image
            src={featuredImage.url}
            alt={featuredImage.altText ?? title}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-6 text-center">
            <span className="font-serif text-sm tracking-wide text-muted">
              Her Club Collective
            </span>
          </div>
        )}
      </div>

      <div className="mt-3.5 flex flex-col gap-1">
        <h3 className="font-serif text-base leading-snug text-ink transition-colors group-hover:text-turquoise">
          {title}
        </h3>
        <p className="text-sm text-muted">{price}</p>
      </div>
    </Link>
  );
}
