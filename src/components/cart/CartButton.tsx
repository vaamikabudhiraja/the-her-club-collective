"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

// Header cart trigger: a bag icon with a live item-count badge. When the count
// increases, the icon gives a gentle, rewarding pulse.
export function CartButton() {
  const { count, openCart } = useCart();
  const [pulsing, setPulsing] = useState(false);
  const prevCount = useRef(count);

  useEffect(() => {
    if (count > prevCount.current) {
      setPulsing(true);
      const t = setTimeout(() => setPulsing(false), 550);
      prevCount.current = count;
      return () => clearTimeout(t);
    }
    prevCount.current = count;
  }, [count]);

  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
      className="relative rounded-full p-2 text-ink transition-colors duration-300 hover:bg-surface"
    >
      <span className={`block ${pulsing ? "cart-pulse" : ""}`}>
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
          <path d="M3 6h18" />
          <path d="M16 10a4 4 0 0 1-8 0" />
        </svg>
      </span>

      {count > 0 && (
        <span
          className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-burgundy px-1 text-xs font-medium text-bone ${
            pulsing ? "cart-pulse" : ""
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}
