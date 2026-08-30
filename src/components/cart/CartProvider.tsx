"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Cart } from "@/lib/shopify";
import {
  getCartAction,
  addToCartAction,
  updateLineAction,
  removeLineAction,
} from "@/lib/cartActions";
import { CartDrawer } from "@/components/cart/CartDrawer";

type CartContextValue = {
  cart: Cart | null;
  count: number;
  busy: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (merchandiseId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // Load any existing cart (from the cookie) once on mount.
  useEffect(() => {
    getCartAction()
      .then(setCart)
      .catch(() => {
        /* no cart yet — that's fine */
      });
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  // Wrap a cart action so we always track "busy" and store the fresh cart.
  const run = useCallback(async (action: () => Promise<Cart>) => {
    setBusy(true);
    try {
      const next = await action();
      setCart(next);
    } finally {
      setBusy(false);
    }
  }, []);

  const addItem = useCallback(
    async (merchandiseId: string, quantity = 1) => {
      await run(() => addToCartAction(merchandiseId, quantity));
    },
    [run]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      await run(() => updateLineAction(lineId, quantity));
    },
    [run]
  );

  const removeItem = useCallback(
    async (lineId: string) => {
      await run(() => removeLineAction(lineId));
    },
    [run]
  );

  const value: CartContextValue = {
    cart,
    count: cart?.totalQuantity ?? 0,
    busy,
    isOpen,
    openCart,
    closeCart,
    addItem,
    updateItem,
    removeItem,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
    </CartContext.Provider>
  );
}
