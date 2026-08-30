// This is a Server Component (no "use client"), so it runs on the server.
// That means calling Shopify here is safe — the private token never reaches the browser.
import { getFirstProducts } from "@/lib/shopify";

export default async function Home() {
  let products: Awaited<ReturnType<typeof getFirstProducts>> = [];
  let error: string | null = null;

  try {
    products = await getFirstProducts();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unknown error";
  }

  // Intentionally ugly and minimal — the only goal is to confirm real products appear.
  return (
    <main style={{ padding: 24, fontFamily: "monospace" }}>
      <h1>Shopify connection test</h1>

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {!error && products.length === 0 && <p>No products returned.</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.title} — {product.priceRange.minVariantPrice.amount}{" "}
            {product.priceRange.minVariantPrice.currencyCode}
          </li>
        ))}
      </ul>
    </main>
  );
}
