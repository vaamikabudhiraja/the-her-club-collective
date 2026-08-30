"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartProvider";
import { formatMoney } from "@/lib/money";

// Slide-over cart panel. Opened from the header cart button. Shows every line
// with quantity steppers, remove buttons, a subtotal, and a checkout hand-off.
export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, busy } = useCart();

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeCart();
    }
    if (isOpen) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const lines = cart?.lines ?? [];
  const isEmpty = lines.length === 0;

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
    >
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="font-serif text-xl text-ink">Your bag</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-muted transition-colors hover:bg-blush-soft hover:text-ink"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-serif text-lg text-ink">Your bag is empty</p>
            <p className="max-w-xs text-sm text-muted">
              Add a piece you love and it’ll appear here.
            </p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-2 rounded-full border border-ink px-5 py-2.5 text-sm text-ink transition hover:bg-ink hover:text-cream"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
            {lines.map((line) => (
              <li key={line.id} className="flex gap-4 py-5">
                <Link
                  href={`/products/${line.merchandise.product.handle}`}
                  onClick={closeCart}
                  className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-blush-soft ring-1 ring-line"
                >
                  {line.merchandise.image ? (
                    <Image
                      src={line.merchandise.image.url}
                      alt={line.merchandise.image.altText ?? line.merchandise.product.title}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : null}
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link
                        href={`/products/${line.merchandise.product.handle}`}
                        onClick={closeCart}
                        className="font-serif text-sm text-ink hover:text-turquoise"
                      >
                        {line.merchandise.product.title}
                      </Link>
                      {line.merchandise.title !== "Default Title" && (
                        <p className="mt-0.5 text-xs text-muted">
                          {line.merchandise.title}
                        </p>
                      )}
                    </div>
                    <p className="text-sm text-ink">
                      {formatMoney(
                        line.cost.totalAmount.amount,
                        line.cost.totalAmount.currencyCode
                      )}
                    </p>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    {/* Quantity stepper */}
                    <div className="flex items-center rounded-full border border-line">
                      <button
                        type="button"
                        onClick={() => updateItem(line.id, line.quantity - 1)}
                        disabled={busy}
                        aria-label="Decrease quantity"
                        className="px-3 py-1.5 text-ink transition-colors hover:text-turquoise disabled:opacity-40"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm text-ink">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateItem(line.id, line.quantity + 1)}
                        disabled={busy}
                        aria-label="Increase quantity"
                        className="px-3 py-1.5 text-ink transition-colors hover:text-turquoise disabled:opacity-40"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(line.id)}
                      disabled={busy}
                      className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-ink disabled:opacity-40"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {!isEmpty && cart && (
          <div className="border-t border-line px-6 py-5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Subtotal</span>
              <span className="text-ink">
                {formatMoney(
                  cart.cost.subtotalAmount.amount,
                  cart.cost.subtotalAmount.currencyCode
                )}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted">
              Taxes and shipping calculated at checkout.
            </p>
            <a
              href={cart.checkoutUrl}
              className="mt-4 block rounded-full bg-ink px-6 py-4 text-center text-sm font-medium tracking-wide text-cream transition hover:bg-ink/90"
            >
              Checkout
            </a>
          </div>
        )}
      </aside>
    </div>
  );
}
