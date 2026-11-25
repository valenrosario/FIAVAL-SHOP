import Link from "next/link";
import StoreSwitch from "@/components/admin/StoreSwitch";
import Flash from "@/components/admin/Flash";
import { getProducts, getSettings, listOrders } from "@/lib/data";
import { dateTime, money } from "@/lib/format";

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const [settings, orders, products] = await Promise.all([getSettings(), listOrders(), getProducts({ all: true })]);
  const now = new Date();
  const month = orders.filter((o) => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && o.status !== "cancelado";
  });
  const nuevos = orders.filter((o) => o.status === "nuevo").length;

  return (
    <>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>Hola 👋</h1>
        <Link href="/admin/productos/nuevo" className="btn btn-sm">
          + Nuevo producto
        </Link>
      </div>
      <StoreSwitch open={settings.store_open} />
      <div className="stats">
        <Link href="/admin/pedidos?estado=nuevo" className="stat">
          <b>{nuevos}</b>
          <span>Pedidos nuevos</span>
        </Link>
        <div className="stat">
          <b>{month.length}</b>
          <span>Pedidos este mes</span>
        </div>
        <div className="stat">
          <b>{money(month.reduce((a, o) => a + Number(o.total), 0))}</b>
          <span>Vendido este mes</span>
        </div>
        <Link href="/admin/productos" className="stat">
          <b>{products.filter((p) => p.active).length}</b>
          <span>Productos publicados</span>
        </Link>
      </div>
      <div className="adm-h" style={{ marginTop: 22 }}>
        <h2 style={{ fontSize: 17 }}>Últimas compras</h2>
        <Link href="/admin/pedidos" className="link">
          Ver todas
        </Link>
      </div>
      <div className="rows">
        {orders.slice(0, 6).map((o) => (
          <Link key={o.id} href={`/admin/pedidos/${o.id}`} className="row">
            <div className="row-main">
              <b>
                #{o.number} · {o.customer_name}
              </b>
              <small>
                {dateTime(o.created_at)} · {o.items.reduce((a, i) => a + i.qty, 0)} productos
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
        {!orders.length ? <p className="empty">Todavía no hay compras.</p> : null}
      </div>
    </>
  );
}
