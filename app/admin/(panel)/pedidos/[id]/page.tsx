import Link from "next/link";
import { notFound } from "next/navigation";
import StatusPicker from "@/components/admin/StatusPicker";
import { getOrder } from "@/lib/data";
import { dateTime, money, waNumber } from "@/lib/format";

export default async function PedidoAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = await getOrder(id);
  if (!o) notFound();
  const wa = `https://wa.me/${waNumber(o.phone)}?text=${encodeURIComponent(`¡Hola ${o.customer_name.split(" ")[0]}! Te escribimos de fiaval shop por tu pedido #${o.number}.`)}`;

  return (
    <>
      <p style={{ marginBottom: 10 }}>
        <Link href="/admin/pedidos" className="link">
          ← Compras
        </Link>
      </p>
      <div className="adm-h">
        <h1>Pedido #{o.number}</h1>
        <span className={"pill " + o.status}>{o.status}</span>
      </div>
      <div className="card">
        <h2>Estado</h2>
        <StatusPicker id={o.id} status={o.status} />
      </div>
      <div className="card">
        <h2>Cliente</h2>
        <p>
          <b>{o.customer_name}</b>
        </p>
        <p>{o.phone}</p>
        <p>{o.delivery === "envio" ? `Envío a: ${o.address}` : "Retira en el local"}</p>
        {o.notes ? <p style={{ marginTop: 8, color: "var(--muted)" }}>Nota: {o.notes}</p> : null}
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 8 }}>{dateTime(o.created_at)}</p>
        <a href={wa} target="_blank" rel="noopener" className="btn btn-wa btn-sm" style={{ marginTop: 14 }}>
          Escribirle por WhatsApp
        </a>
      </div>
      <div className="card">
        <h2>Productos</h2>
        {o.items.map((i, k) => (
          <div className="row" key={k} style={{ padding: "10px 0" }}>
            <div className="row-img">{i.image ? <img src={i.image} alt="" /> : null}</div>
            <div className="row-main">
              <b>
                {i.qty} x {i.name}
              </b>
              <small>
                {[i.color, i.size].filter(Boolean).join(" · ")} {money(i.price)} c/u
              </small>
            </div>
            <div className="row-r">{money(i.price * i.qty)}</div>
          </div>
        ))}
        <div className="sum-row tot">
          <span>Total</span>
          <span>{money(Number(o.total))}</span>
        </div>
      </div>
    </>
  );
}
