import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProduct } from "@/lib/shopify";
import { ProductDetails } from "@/components/ProductDetails";

// Memoize per request so generateMetadata and the page don't each fetch Shopify.
const loadProduct = cache((handle: string) => getProduct(handle));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = await loadProduct(handle);

  if (!product) {
    return { title: "Product not found — Her Club Collective" };
  }

  return {
    title: `${product.title} — Her Club Collective`,
    description: product.description?.slice(0, 155) || undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await loadProduct(handle);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-turquoise"
      >
        <span aria-hidden="true">←</span> Back to shop
      </Link>

      <div className="mt-8">
        <ProductDetails product={product} />
      </div>
    </div>
  );
}
