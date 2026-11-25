"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  key: string;
  product_id: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  color: string | null;
  size: string | null;
  qty: number;
};

type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  add: (l: Omit<CartLine, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartCtx = createContext<Ctx | null>(null);
const KEY = "fiaval-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((l: Omit<CartLine, "key">) => {
    const key = [l.product_id, l.color ?? "", l.size ?? ""].join("|");
    setLines((prev) => {
      const found = prev.find((x) => x.key === key);
      if (found) return prev.map((x) => (x.key === key ? { ...x, qty: Math.min(99, x.qty + l.qty) } : x));
      return [...prev, { ...l, key }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((prev) => prev.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(99, qty)) } : x)));
  }, []);

  const remove = useCallback((key: string) => setLines((prev) => prev.filter((x) => x.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      ready,
      count: lines.reduce((a, b) => a + b.qty, 0),
      total: lines.reduce((a, b) => a + b.qty * b.price, 0),
      add,
      setQty,
      remove,
      clear,
    }),
    [lines, ready, add, setQty, remove, clear]
  );

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart fuera de CartProvider");
  return c;
}

export function CartCount() {
  const { count, ready } = useCart();
  if (!ready || count === 0) return null;
  return <span className="badge">{count}</span>;
}
