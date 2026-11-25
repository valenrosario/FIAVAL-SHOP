import Link from "next/link";
import Flash from "@/components/admin/Flash";
import ToggleActive from "@/components/admin/ToggleActive";
import { getCategories, getProducts } from "@/lib/data";
import { money } from "@/lib/format";

export default async function ProductosAdmin({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const [products, categories] = await Promise.all([getProducts({ all: true, q: sp.q?.trim() || undefined }), getCategories()]);
  return (
    <>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>Productos</h1>
        <Link href="/admin/productos/nuevo" className="btn btn-sm">
          + Nuevo producto
        </Link>
      </div>
      <form className="search-bar" style={{ marginTop: 0, marginBottom: 12 }}>
        <input name="q" defaultValue={sp.q} placeholder="Buscar producto" aria-label="Buscar producto" />
      </form>
      <div className="rows">
        {products.map((p) => (
          <div key={p.id} className="row">
            <Link href={`/admin/productos/${p.id}`} className="row-img">
              {p.images[0] ? <img src={p.images[0]} alt="" /> : null}
            </Link>
            <Link href={`/admin/productos/${p.id}`} className="row-main">
              <b>{p.name}</b>
              <small>
                {money(Number(p.price))} · {categories.find((c) => c.id === p.category_id)?.name ?? "Sin categoría"}
                {p.stock === 0 ? " · Sin stock" : p.stock !== null ? ` · Stock ${p.stock}` : ""}
              </small>
            </Link>
            <ToggleActive id={p.id} active={p.active} />
          </div>
        ))}
        {!products.length ? <p className="empty">No hay productos. Cargá el primero con “Nuevo producto”.</p> : null}
      </div>
    </>
  );
}
