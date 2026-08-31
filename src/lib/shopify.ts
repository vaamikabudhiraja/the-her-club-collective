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

// ── Cart ─────────────────────────────────────────────────────
export type CartLine = {
  id: string; // the cart line id (used to update/remove)
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string; // the variant id (merchandiseId)
    title: string; // variant title, e.g. "Gold / Small"
    image: ProductImage | null;
    price: Money;
    product: { title: string; handle: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
  lines: CartLine[];
};

// Raw shape as returned by GraphQL (lines wrapped in edges/nodes).
type CartApi = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: { edges: { node: CartLine }[] };
};

type CartQueryResponse = {
  data?: { cart: CartApi | null };
  errors?: { message: string }[];
};

type CartMutationPayload = {
  cart: CartApi | null;
  userErrors: { message: string }[];
};

type CartMutationResponse = {
  data?: Record<string, CartMutationPayload>;
  errors?: { message: string }[];
};

export type CartLineInput = { merchandiseId: string; quantity: number };

// Shared selection of cart fields, reused by every cart query/mutation.
const CART_FRAGMENT = `
  fragment CartParts on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount { amount currencyCode }
      totalAmount { amount currencyCode }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost { totalAmount { amount currencyCode } }
          merchandise {
            ... on ProductVariant {
              id
              title
              image { url altText width height }
              price { amount currencyCode }
              product { title handle }
            }
          }
        }
      }
    }
  }
`;

// Flatten the GraphQL edges/nodes into a plain, easy-to-use Cart.
function normalizeCart(cart: CartApi | null): Cart | null {
  if (!cart) return null;
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    cost: cart.cost,
    lines: cart.lines.edges.map((edge) => edge.node),
  };
}

// Runs a cart mutation, surfaces user errors, and returns the updated cart.
// `field` is the mutation name (e.g. "cartLinesAdd") to read from the response.
async function runCartMutation(
  field: string,
  query: string,
  variables: Record<string, unknown>
): Promise<Cart | null> {
  const json = await shopifyFetch<CartMutationResponse>(query, variables);
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }
  const payload = json.data?.[field];
  if (payload?.userErrors?.length) {
    throw new Error(payload.userErrors[0].message);
  }
  return normalizeCart(payload?.cart ?? null);
}

// Fetch an existing cart by id. Returns null if it no longer exists (expired).
export async function getCart(cartId: string): Promise<Cart | null> {
  const query = `
    query Cart($id: ID!) {
      cart(id: $id) { ...CartParts }
    }
    ${CART_FRAGMENT}
  `;
  const json = await shopifyFetch<CartQueryResponse>(query, { id: cartId });
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }
  return normalizeCart(json.data?.cart ?? null);
}

// Create a brand-new cart seeded with the given lines.
export async function cartCreate(lines: CartLineInput[]): Promise<Cart> {
  const query = `
    mutation CartCreate($lines: [CartLineInput!]) {
      cartCreate(input: { lines: $lines }) {
        cart { ...CartParts }
        userErrors { message }
      }
    }
    ${CART_FRAGMENT}
  `;
  const cart = await runCartMutation("cartCreate", query, { lines });
  if (!cart) throw new Error("Failed to create cart");
  return cart;
}

// Add lines to an existing cart. Returns null if the cart id is invalid.
export async function cartLinesAdd(
  cartId: string,
  lines: CartLineInput[]
): Promise<Cart | null> {
  const query = `
    mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart { ...CartParts }
        userErrors { message }
      }
    }
    ${CART_FRAGMENT}
  `;
  return runCartMutation("cartLinesAdd", query, { cartId, lines });
}

// Update the quantity of specific cart lines.
export async function cartLinesUpdate(
  cartId: string,
  lines: { id: string; quantity: number }[]
): Promise<Cart | null> {
  const query = `
    mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart { ...CartParts }
        userErrors { message }
      }
    }
    ${CART_FRAGMENT}
  `;
  return runCartMutation("cartLinesUpdate", query, { cartId, lines });
}

// Remove lines from a cart entirely.
export async function cartLinesRemove(
  cartId: string,
  lineIds: string[]
): Promise<Cart | null> {
  const query = `
    mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart { ...CartParts }
        userErrors { message }
      }
    }
    ${CART_FRAGMENT}
  `;
  return runCartMutation("cartLinesRemove", query, { cartId, lineIds });
}

// ── Browse: collections & product types ──────────────────────
// Shared product fields for grid listings.
const PRODUCT_CARD_FIELDS = `
  id
  handle
  title
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } }
`;

export type Collection = {
  title: string;
  description: string;
  products: Product[];
};

type CollectionResponse = {
  data?: {
    collection: {
      title: string;
      description: string;
      products: { edges: { node: Product }[] };
    } | null;
  };
  errors?: { message: string }[];
};

// Fetch a Shopify collection by handle with its products. Null if not found.
export async function getCollection(
  handle: string,
  first = 50
): Promise<Collection | null> {
  const query = `
    query Collection($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        title
        description
        products(first: $first, sortKey: CREATED_AT, reverse: true) {
          edges { node { ${PRODUCT_CARD_FIELDS} } }
        }
      }
    }
  `;

  const json = await shopifyFetch<CollectionResponse>(query, { handle, first });
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  const collection = json.data?.collection;
  if (!collection) return null;

  return {
    title: collection.title,
    description: collection.description,
    products: collection.products.edges.map((edge) => edge.node),
  };
}

// Fetch products by their Shopify "product type" (e.g. Necklaces, Earrings).
// Dynamic — no product handles are hard-coded.
export async function getProductsByType(
  type: string,
  first = 50
): Promise<Product[]> {
  const query = `
    query ProductsByType($query: String!, $first: Int!) {
      products(first: $first, query: $query, sortKey: CREATED_AT, reverse: true) {
        edges { node { ${PRODUCT_CARD_FIELDS} } }
      }
    }
  `;

  // Match the product_type field case-insensitively; quote to allow spaces.
  const search = `product_type:"${type.replace(/"/g, '')}"`;
  const json = await shopifyFetch<ProductsResponse>(query, {
    query: search,
    first,
  });
  if (json.errors?.length) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data?.products.edges.map((edge) => edge.node) ?? [];
}
