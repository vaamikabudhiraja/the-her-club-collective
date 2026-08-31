import { ProductCard } from "@/components/ProductCard";
import { Reveal } from "@/components/Reveal";
import type { Product } from "@/lib/shopify";

// Shared responsive product grid with staggered scroll reveals.
// Used by the homepage and every browse (collection / type) page.
export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-4">
      {products.map((product, index) => (
        <Reveal key={product.id} delay={(index % 4) * 70}>
          <ProductCard product={product} />
        </Reveal>
      ))}
    </div>
  );
}
