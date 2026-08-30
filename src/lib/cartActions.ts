"use server";

// Server Actions for the cart. These run only on the server, so the Storefront
// token stays private. The cart's id lives in an httpOnly cookie the browser
// can't read — the client only ever sees the resulting Cart object.
import { cookies } from "next/headers";
import {
  getCart,
  cartCreate,
  cartLinesAdd,
  cartLinesUpdate,
  cartLinesRemove,
  type Cart,
} from "@/lib/shopify";

const CART_COOKIE = "cartId";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function readCartId(): Promise<string | undefined> {
  return (await cookies()).get(CART_COOKIE)?.value;
}

async function writeCartId(id: string): Promise<void> {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
}

// Read the current cart (or null if none / expired).
export async function getCartAction(): Promise<Cart | null> {
  const id = await readCartId();
  if (!id) return null;
  return getCart(id);
}

// Add a variant to the cart, creating the cart on first add.
export async function addToCartAction(
  merchandiseId: string,
  quantity = 1
): Promise<Cart> {
  const id = await readCartId();

  let cart: Cart | null = null;
  if (id) {
    // Existing cart — try to add to it. Returns null if the id has expired.
    cart = await cartLinesAdd(id, [{ merchandiseId, quantity }]);
  }
  if (!cart) {
    // No cart yet (or it expired) — start a fresh one.
    cart = await cartCreate([{ merchandiseId, quantity }]);
  }

  await writeCartId(cart.id);
  return cart;
}

// Change a line's quantity. A quantity of 0 (or less) removes the line.
export async function updateLineAction(
  lineId: string,
  quantity: number
): Promise<Cart> {
  const id = await readCartId();
  if (!id) throw new Error("No cart to update");

  const cart =
    quantity <= 0
      ? await cartLinesRemove(id, [lineId])
      : await cartLinesUpdate(id, [{ id: lineId, quantity }]);

  if (!cart) throw new Error("Cart not found");
  return cart;
}

// Remove a line from the cart.
export async function removeLineAction(lineId: string): Promise<Cart> {
  const id = await readCartId();
  if (!id) throw new Error("No cart to update");

  const cart = await cartLinesRemove(id, [lineId]);
  if (!cart) throw new Error("Cart not found");
  return cart;
}
