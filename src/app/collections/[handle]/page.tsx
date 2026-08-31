import type { Metadata } from "next";
import { getCollection, type Product } from "@/lib/shopify";
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

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let title = prettify(handle);
  let description = "";
  let products: Product[] = [];
  let notReady = false;

  try {
    const collection = await getCollection(handle);
    if (collection) {
      title = collection.title;
      description = collection.description;
      products = collection.products;
    } else {
      notReady = true; // collection doesn't exist in Shopify yet
    }
  } catch {
    notReady = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <Reveal>
        <div className="mb-12 text-center">
          <p className="eyebrow text-gold">Collection</p>
          <h1 className="font-display mt-3 text-4xl text-ink sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted">
              {description}
            </p>
          )}
        </div>
      </Reveal>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <p className="py-16 text-center text-sm text-muted">
          {notReady
            ? "This collection is coming soon."
            : "No pieces here just yet — check back shortly."}
        </p>
      )}
    </div>
  );
}
