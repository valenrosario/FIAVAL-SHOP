import { money, waNumber } from "./format";
import type { Order } from "./types";

export function orderMessage(o: Order) {
  const lines = o.items.map((i) => {
    const extra = [i.color, i.size].filter(Boolean).join(", ");
    return `• ${i.qty} x ${i.name}${extra ? ` (${extra})` : ""} — ${money(i.price * i.qty)}`;
  });
  return [
    `¡Hola! Quiero hacer este pedido en fiaval shop 🛍️`,
    `Pedido #${o.number}`,
    ``,
    ...lines,
    ``,
    `Total: ${money(o.total)}`,
    `Entrega: ${o.delivery === "envio" ? `Envío a ${o.address}` : "Retiro en el local"}`,
    `Nombre: ${o.customer_name}`,
    o.notes ? `Nota: ${o.notes}` : "",
  ]
    .filter((l, i, a) => !(l === "" && a[i - 1] === ""))
    .join("\n")
    .trim();
}

export function waLink(phone: string, text: string) {
  return `https://wa.me/${waNumber(phone)}?text=${encodeURIComponent(text)}`;
}
