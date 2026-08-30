// Server-only Shopify Storefront API helper.
// `server-only` makes the build FAIL if this file is ever imported into a
// client component — a guardrail so the private token can never leak to the browser.
import "server-only";

const API_VERSION = "2024-10";

type ShopifyProduct = {
  id: string;
  title: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
};

type ProductsResponse = {
  data?: {
    products: {
      edges: { node: ShopifyProduct }[];
    };
  };
  errors?: { message: string }[];
};

// Runs a GraphQL query against the Storefront API using the private token
// from .env.local. This only ever executes on the server.
async function shopifyFetch<T>(query: string): Promise<T> {
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
    body: JSON.stringify({ query }),
    // Don't cache while we're verifying the connection.
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shopify request failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// Fetch the first few products with just their titles and prices.
export async function getFirstProducts() {
  const query = `
    {
      products(first: 5) {
        edges {
          node {
            id
            title
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

  const json = await shopifyFetch<ProductsResponse>(query);

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data?.products.edges.map((edge) => edge.node) ?? [];
}
