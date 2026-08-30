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

// ── Single product (detail page) ─────────────────────────────
export type SelectedOption = {
  name: string;
  value: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  price: Money;
  image: ProductImage | null;
};

export type ProductDetail = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  featuredImage: ProductImage | null;
  images: ProductImage[];
  options: ProductOption[];
  variants: ProductVariant[];
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
};

type ProductResponse = {
  data?: {
    product: {
      id: string;
      handle: string;
      title: string;
      description: string;
      descriptionHtml: string;
      featuredImage: ProductImage | null;
      images: { edges: { node: ProductImage }[] };
      options: ProductOption[];
      variants: { edges: { node: ProductVariant }[] };
      priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
    } | null;
  };
  errors?: { message: string }[];
};

// Fetch one product by its handle, with everything a detail page needs.
// Returns null when no product matches (so the page can render a 404).
export async function getProduct(handle: string): Promise<ProductDetail | null> {
  const query = `
    query Product($handle: String!) {
      product(handle: $handle) {
        id
        handle
        title
        description
        descriptionHtml
        featuredImage {
          url
          altText
          width
          height
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        options {
          id
          name
          values
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  const json = await shopifyFetch<ProductResponse>(query, { handle });

  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  const product = json.data?.product;
  if (!product) return null;

  // Flatten the GraphQL edges/nodes into plain arrays for easy use in UI.
  return {
    id: product.id,
    handle: product.handle,
    title: product.title,
    description: product.description,
    descriptionHtml: product.descriptionHtml,
    featuredImage: product.featuredImage,
    images: product.images.edges.map((edge) => edge.node),
    options: product.options,
    variants: product.variants.edges.map((edge) => edge.node),
    priceRange: product.priceRange,
  };
}
