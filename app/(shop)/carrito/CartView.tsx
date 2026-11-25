"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useCart } from "@/components/cart";
import Icon from "@/components/Icon";
import { money } from "@/lib/format";
import { placeOrder } from "./actions";

export default function CartView({ shippingText }: { shippingText: string }) {
  const { lines, total, setQty, remove, clear, ready } = useCart();
  const router = useRouter();
  const [delivery, setDelivery] = useState<"retiro" | "envio">("retiro");
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  if (!ready) return <div className="wrap" style={{ minHeight: "50vh" }} />;

  if (!lines.length) {
    return (
      <div className="wrap" style={{ minHeight: "50vh" }}>
        <h1 className="page-h">Tu carrito</h1>
        <div className="ok-box">
          <p style={{ marginBottom: 16 }}>Tu carrito está vacío.</p>
          <Link href="/productos" className="btn">
            Ver productos <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
    );
  }

  const submit = (fd: FormData) => {
    setError("");
    start(async () => {
      const res = await placeOrder({
        lines: lines.map((l) => ({ product_id: l.product_id, qty: l.qty, color: l.color, size: l.size })),
        customer_name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        delivery,
        address: String(fd.get("address") ?? ""),
        notes: String(fd.get("notes") ?? ""),
      });
      if (!res.ok) {
        setError(res.error);
        return;
      }
      clear();
      router.push(`/pedido/${res.id}`);
    });
  };

  return (
    <div className="wrap">
      <h1 className="page-h">Tu carrito</h1>
      <div className="cart">
        <div>
          {lines.map((l) => (
            <div className="ci" key={l.key}>
              <Link href={`/producto/${l.slug}`} className="ci-img">
                {l.image ? <img src={l.image} alt="" /> : null}
              </Link>
              <div>
                <h3>{l.name}</h3>
                {l.color || l.size ? <small>{[l.color, l.size].filter(Boolean).join(" · ")}</small> : null}
                <small>{money(l.price)} c/u</small>
                <div className="qty">
                  <button aria-label="Menos" onClick={() => setQty(l.key, l.qty - 1)}>
                    −
                  </button>
                  <span>{l.qty}</span>
                  <button aria-label="Más" onClick={() => setQty(l.key, l.qty + 1)}>
                    +
                  </button>
                </div>
              </div>
              <div className="ci-r">
                {money(l.price * l.qty)}
                <button onClick={() => remove(l.key)}>Quitar</button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="sum">
            <div className="sum-row">
              <span>Subtotal</span>
              <span>{money(total)}</span>
            </div>
            <div className="sum-row">
              <span>Envío</span>
              <span>{delivery === "retiro" ? "Gratis" : "A coordinar"}</span>
            </div>
            <div className="sum-row tot">
              <span>Total</span>
              <span>{money(total)}</span>
            </div>
          </div>

          <form className="form" action={submit}>
            <div className="field">
              <label htmlFor="name">Tu nombre</label>
              <input id="name" name="name" required autoComplete="name" />
            </div>
            <div className="field">
              <label htmlFor="phone">Teléfono / WhatsApp</label>
              <input id="phone" name="phone" required inputMode="tel" autoComplete="tel" />
            </div>
            <div className="field">
              <label>Entrega</label>
              <div className="seg">
                <label>
                  <input type="radio" name="delivery" checked={delivery === "retiro"} onChange={() => setDelivery("retiro")} />
                  <span>Retiro en local</span>
                </label>
                <label>
                  <input type="radio" name="delivery" checked={delivery === "envio"} onChange={() => setDelivery("envio")} />
                  <span>Envío</span>
                </label>
              </div>
            </div>
            {delivery === "envio" ? (
              <div className="field">
                <label htmlFor="address">Dirección y localidad</label>
                <input id="address" name="address" required autoComplete="street-address" />
              </div>
            ) : null}
            <div className="field">
              <label htmlFor="notes">Nota (opcional)</label>
              <textarea id="notes" name="notes" rows={2} placeholder="Ej: nombre para personalizar, horario de retiro…" />
            </div>
            {error ? <div className="err">{error}</div> : null}
            <button className="btn btn-wa btn-block" disabled={pending}>
              <Icon name="chat" size={20} /> {pending ? "Enviando…" : "Hacer pedido por WhatsApp"}
            </button>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>
              Guardamos tu pedido y abrimos WhatsApp con el detalle. Ahí coordinamos el pago y la entrega. {shippingText}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
