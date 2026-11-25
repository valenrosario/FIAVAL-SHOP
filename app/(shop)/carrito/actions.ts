"use server";

import { createOrder, getProductsByIds, getSettings } from "@/lib/data";
import type { OrderItem } from "@/lib/types";

type Line = { product_id: string; qty: number; color: string | null; size: string | null };

export async function placeOrder(input: {
  lines: Line[];
  customer_name: string;
  phone: string;
  delivery: "retiro" | "envio";
  address: string;
  notes: string;
}): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const settings = await getSettings();
  if (!settings.store_open) return { ok: false, error: "La tienda está cerrada en este momento." };

  const name = String(input.customer_name ?? "").trim().slice(0, 120);
  const phone = String(input.phone ?? "").trim().slice(0, 40);
  const delivery = input.delivery === "envio" ? "envio" : "retiro";
  const address = String(input.address ?? "").trim().slice(0, 300);
  const notes = String(input.notes ?? "").trim().slice(0, 500);
  if (!name) return { ok: false, error: "Escribí tu nombre." };
  if (phone.replace(/\D/g, "").length < 6) return { ok: false, error: "Escribí un teléfono válido." };
  if (delivery === "envio" && !address) return { ok: false, error: "Escribí la dirección de envío." };
  if (!Array.isArray(input.lines) || !input.lines.length) return { ok: false, error: "Tu carrito está vacío." };

  // Los precios se toman de la base, no del navegador.
  const products = await getProductsByIds([...new Set(input.lines.map((l) => String(l.product_id)))]);
  const items: OrderItem[] = [];
  for (const l of input.lines.slice(0, 50)) {
    const p = products.find((x) => x.id === l.product_id);
    if (!p || !p.active) return { ok: false, error: "Un producto de tu carrito ya no está disponible. Sacalo y probá de nuevo." };
    if (p.stock === 0) return { ok: false, error: `“${p.name}” está sin stock.` };
    const qty = Math.max(1, Math.min(99, Math.floor(Number(l.qty) || 1)));
    const color = p.colors.some((c) => c.name === l.color) ? l.color : null;
    const size = p.sizes.includes(l.size ?? "") ? l.size : null;
    const ci = p.colors.findIndex((c) => c.name === color);
    items.push({
      product_id: p.id,
      name: p.name,
      price: Number(p.price),
      qty,
      color,
      size,
      image: p.images[p.images.length === p.colors.length && ci >= 0 ? ci : 0] ?? null,
    });
  }
  const total = items.reduce((a, b) => a + b.price * b.qty, 0);

  try {
    const order = await createOrder({ customer_name: name, phone, delivery, address: delivery === "envio" ? address : "", notes, items, total });
    return { ok: true, id: order.id };
  } catch (e) {
    console.error(e);
    return { ok: false, error: "No pudimos guardar tu pedido. Probá de nuevo en un momento." };
  }
}
