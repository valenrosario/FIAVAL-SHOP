"use client";

import { useEffect } from "react";

// Abre WhatsApp automáticamente solo la primera vez que se muestra el pedido.
export default function AutoOpen({ url }: { url: string }) {
  useEffect(() => {
    const key = "wa-opened:" + location.pathname;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      return;
    }
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(key, "1");
      } catch {}
      window.location.href = url;
    }, 900);
    return () => clearTimeout(t);
  }, [url]);
  return null;
}
