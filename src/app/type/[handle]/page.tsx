import type { Metadata } from "next";
import { getProductsByType } from "@/lib/shopify";
import { ProductGrid } from "@/components/ProductGrid";
import { Reveal } from "@/components/Reveal";

function prettify(handle: string): string {
  return handle
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  return { title: `${prettify(handle)} — Her Club Collective` };
}

export default async function TypePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const title = prettify(handle);

  let products: Awaited<ReturnType<typeof getProductsByType>> = [];
  let failed = false;

  try {
    products = await getProductsByType(title);
  } catch {
    failed = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow text-gold">Shop by type</p>
          <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">
            {title}
          </h1>
        </div>
      </Reveal>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="py-16 text-center text-sm text-muted">
          {failed
            ? "Couldn’t load these right now — please try again."
            : `No ${title.toLowerCase()} yet — they’ll appear here once they’re published.`}
        </p>
      )}
    </div>
  );
}
