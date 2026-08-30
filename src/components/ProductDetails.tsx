"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { formatMoney } from "@/lib/money";
import type { ProductDetail } from "@/lib/shopify";

// Shopify represents a product with no real variants as a single option named
// "Title" with the value "Default Title". We hide those so we don't render a
// pointless selector.
function hasRealOptions(product: ProductDetail) {
  return !(
    product.options.length === 1 &&
    product.options[0].name === "Title" &&
    product.options[0].values.length === 1 &&
    product.options[0].values[0] === "Default Title"
  );
}

export function ProductDetails({ product }: { product: ProductDetail }) {
  const showOptions = hasRealOptions(product);

  // Gallery: fall back to the featured image if the images list is empty.
  const galleryImages =
    product.images.length > 0
      ? product.images
      : product.featuredImage
        ? [product.featuredImage]
        : [];
  const [activeImage, setActiveImage] = useState(galleryImages[0]?.url ?? null);

  // Start with the options of the first available variant (or the first variant).
  const initialVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialVariant?.selectedOptions.forEach((o) => {
      map[o.name] = o.value;
    });
    return map;
  });

  // The variant whose options exactly match the current selection.
  const selectedVariant = useMemo(
    () =>
      product.variants.find((v) =>
        v.selectedOptions.every((o) => selected[o.name] === o.value)
      ),
    [product.variants, selected]
  );

  // Would choosing `value` for `optionName` (keeping other picks) be in stock?
  function isAvailable(optionName: string, value: string) {
    const candidate = { ...selected, [optionName]: value };
    return product.variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.every((o) => candidate[o.name] === o.value)
    );
  }

  function chooseOption(optionName: string, value: string) {
    const next = { ...selected, [optionName]: value };
    setSelected(next);
    // If the resulting variant has its own image, jump the gallery to it.
    const match = product.variants.find((v) =>
      v.selectedOptions.every((o) => next[o.name] === o.value)
    );
    if (match?.image?.url) setActiveImage(match.image.url);
  }

  const price = selectedVariant
    ? formatMoney(
        selectedVariant.price.amount,
        selectedVariant.price.currencyCode
      )
    : formatMoney(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode
      );

  const canAdd = Boolean(selectedVariant?.availableForSale);

  // Placeholder until Step 3 wires the real Shopify cart.
  const [note, setNote] = useState<string | null>(null);
  function handleAddToCart() {
    if (!canAdd) return;
    setNote("Cart connects in the next step ✨");
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      {/* Gallery */}
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-blush-soft ring-1 ring-line">
          {activeImage ? (
            <Image
              src={activeImage}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-serif text-muted">
                Her Club Collective
              </span>
            </div>
          )}
        </div>

        {galleryImages.length > 1 && (
          <div className="flex flex-wrap gap-3">
            {galleryImages.map((img) => {
              const isActive = img.url === activeImage;
              return (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setActiveImage(img.url)}
                  aria-label="View image"
                  className={`relative h-20 w-20 overflow-hidden rounded-xl ring-1 transition ${
                    isActive
                      ? "ring-2 ring-turquoise"
                      : "ring-line hover:ring-blush"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.altText ?? product.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col">
        <h1 className="font-serif text-3xl leading-tight text-ink sm:text-4xl">
          {product.title}
        </h1>
        <p className="mt-3 text-xl text-ink">{price}</p>

        {/* Options */}
        {showOptions && (
          <div className="mt-8 flex flex-col gap-6">
            {product.options.map((option) => (
              <div key={option.id}>
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.15em] text-muted">
                  {option.name}
                </p>
                <div className="flex flex-wrap gap-2">
                  {option.values.map((value) => {
                    const isSelected = selected[option.name] === value;
                    const available = isAvailable(option.name, value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => chooseOption(option.name, value)}
                        className={`rounded-full border px-4 py-2 text-sm transition ${
                          isSelected
                            ? "border-ink bg-ink text-cream"
                            : available
                              ? "border-line bg-white text-ink hover:border-turquoise hover:bg-turquoise-soft"
                              : "border-line bg-white text-muted line-through opacity-60"
                        }`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add to cart */}
        <div className="mt-8">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={`w-full rounded-full px-6 py-4 text-sm font-medium tracking-wide transition sm:w-auto sm:min-w-64 ${
              canAdd
                ? "bg-ink text-cream hover:bg-ink/90"
                : "cursor-not-allowed bg-line text-muted"
            }`}
          >
            {canAdd ? "Add to cart" : "Sold out"}
          </button>
          {note && <p className="mt-3 text-sm text-turquoise">{note}</p>}
        </div>

        {/* Description */}
        {product.descriptionHtml ? (
          <div
            className="rich-text mt-10 border-t border-line pt-8 text-sm leading-relaxed text-muted"
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />
        ) : product.description ? (
          <p className="mt-10 border-t border-line pt-8 text-sm leading-relaxed text-muted">
            {product.description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
