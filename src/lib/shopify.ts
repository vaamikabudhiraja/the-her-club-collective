// Server-only Shopify Storefront API helper.
// `server-only` makes the build FAIL if this file is ever imported into a
// client component — a guardrail so the private token can never leak to the browser.
import "server-only";

const API_VERSION = "2024-10";

// ── Shared types ─────────────────────────────────────────────
export type Money = {
  amount: string;
  currencyCode: string;
};

export type ProductImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  featuredImage: ProductImage | null;
  priceRange: {
    minVariantPrice: Money;
  };
};

type ProductsResponse = {
  data?: {
    products: {
      edges: { node: Product }[];
    };
  };
  errors?: { message: string }[];
};

// ── Low-level fetch ──────────────────────────────────────────
// Runs a GraphQL query against the Storefront API using the private token
// from .env.local. This only ever executes on the server.
async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!domain || !token) {
    throw new Error(
      "Missing SHOPIFY_STORE_DOMAIN or SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local"
    );
  }

  const res = await fetch(`https://${domain}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    // Always fetch fresh product data while we're actively building.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// ── Queries ──────────────────────────────────────────────────
// Fetch a page of products with the fields the grid needs. Newest first.
export async function getProducts(first = 24): Promise<Product[]> {
  const query = `
    query Products($first: Int!) {
      products(first: $first, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            id
            handle
            title
            featuredImage {
              url
              altText
              width
              height
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const json = await shopifyFetch<ProductsResponse>(query, { first });

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data?.products.edges.map((edge) => edge.node) ?? [];
}
