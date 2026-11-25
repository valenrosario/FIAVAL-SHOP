import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Category, Product } from "@/lib/types";

export default function ProductList({
  title,
  categories,
  products,
  active,
  q,
  showSearch,
}: {
  title: string;
  categories: Category[];
  products: Product[];
  active?: string;
  q?: string;
  showSearch?: boolean;
}) {
  return (
    <div className="wrap">
      <h1 className="page-h">{title}</h1>
      {showSearch || q ? (
        <form className="search-bar" action="/productos">
          <input name="q" defaultValue={q} placeholder="Buscar cuadernos, agendas, stickers…" autoFocus={showSearch && !q} aria-label="Buscar" />
          <button className="btn">Buscar</button>
        </form>
      ) : null}
      <div className="chips scroll" style={{ marginTop: 16 }}>
        <Link href="/productos" className={"chip" + (!active ? " on" : "")}>
          Todo
        </Link>
        {categories.map((c) => (
          <Link key={c.id} href={`/categoria/${c.slug}`} className={"chip" + (active === c.id ? " on" : "")}>
            {c.name}
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 22 }}>
        {products.length ? (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="empty">{q ? `No encontramos productos para “${q}”.` : "Todavía no hay productos en esta categoría."}</p>
        )}
      </div>
    </div>
  );
}
