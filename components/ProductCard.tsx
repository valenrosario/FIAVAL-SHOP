import Link from "next/link";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductCard({ p }: { p: Product }) {
  const off = p.compare_at_price && p.compare_at_price > p.price ? Math.round((1 - p.price / p.compare_at_price) * 100) : 0;
  const out = p.stock === 0;
  return (
    <Link href={`/producto/${p.slug}`} className="pc">
      <div className="pc-img">
        {p.images[0] ? <img src={p.images[0]} alt={p.name} loading="lazy" /> : null}
        {out ? <span className="tag out">SIN STOCK</span> : p.is_new ? <span className="tag">NUEVO</span> : null}
        {off ? <span className="tag off">-{off}%</span> : null}
      </div>
      <h3>{p.name}</h3>
      <div className="pr">
        {money(p.price)}
        {off ? <s>{money(p.compare_at_price!)}</s> : null}
      </div>
    </Link>
  );
}
