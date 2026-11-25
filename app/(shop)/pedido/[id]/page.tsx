import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { getOrder, getSettings } from "@/lib/data";
import { money } from "@/lib/format";
import { orderMessage, waLink } from "@/lib/whatsapp";
import AutoOpen from "./AutoOpen";

export const metadata = { title: "Tu pedido", robots: { index: false } };

export default async function Pedido({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, settings] = await Promise.all([getOrder(id), getSettings()]);
  if (!order) notFound();
  const url = waLink(settings.whatsapp, orderMessage(order));

  return (
    <div className="wrap" style={{ maxWidth: 640 }}>
      <div className="ok-box">
        <div className="kicker">PEDIDO #{order.number}</div>
        <h1>¡Listo, {order.customer_name.split(" ")[0]}! Falta un paso.</h1>
        <p>Mandanos el pedido por WhatsApp para confirmarlo. Ahí coordinamos el pago y la entrega.</p>
        <a className="btn btn-wa btn-block" href={url} target="_blank" rel="noopener" style={{ marginTop: 20 }}>
          <Icon name="chat" size={20} /> Enviar pedido por WhatsApp
        </a>
        <AutoOpen url={url} />
      </div>
      <div className="sum" style={{ marginTop: 24 }}>
        {order.items.map((i, k) => (
          <div className="sum-row" key={k}>
            <span>
              {i.qty} x {i.name}
              {i.color || i.size ? <small style={{ color: "var(--muted)" }}> ({[i.color, i.size].filter(Boolean).join(", ")})</small> : null}
            </span>
            <span>{money(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="sum-row tot">
          <span>Total</span>
          <span>{money(order.total)}</span>
        </div>
      </div>
      <p style={{ marginTop: 24 }}>
        <Link href="/" className="link">
          Volver a la tienda
        </Link>
      </p>
    </div>
  );
}
