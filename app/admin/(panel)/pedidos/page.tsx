import Link from "next/link";
import { listOrders } from "@/lib/data";
import { dateTime, money } from "@/lib/format";
import { ORDER_STATUSES } from "@/lib/types";

export default async function Pedidos({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  const { estado } = await searchParams;
  const status = ORDER_STATUSES.find((s) => s === estado);
  const orders = await listOrders(status);
  return (
    <>
      <div className="adm-h">
        <h1>Compras</h1>
      </div>
      <div className="filters">
        <Link href="/admin/pedidos" className={!status ? "on" : ""}>
          Todas
        </Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={`/admin/pedidos?estado=${s}`} className={status === s ? "on" : ""} style={{ textTransform: "capitalize" }}>
            {s}
          </Link>
        ))}
      </div>
      <div className="rows">
        {orders.map((o) => (
          <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="row">
            <div className="row-main">
              <b>
                #{o.number} · {o.customer_name}
              </b>
              <small>
                {dateTime(o.created_at)} · {o.delivery === "envio" ? "Envío" : "Retiro"} · {o.items.reduce((a, i) => a + i.qty, 0)} productos
              </small>
            </div>
            <div className="row-r">
              {money(Number(o.total))}
              <div>
                <span className={"pill " + o.status}>{o.status}</span>
              </div>
            </div>
          </Link>
        ))}
        {!orders.length ? <p className="empty">No hay compras {status ? `con estado “${status}”` : "todavía"}.</p> : null}
      </div>
    </>
  );
}
