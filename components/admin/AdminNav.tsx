"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  ["/admin", "Inicio"],
  ["/admin/pedidos", "Compras"],
  ["/admin/productos", "Productos"],
  ["/admin/categorias", "Categorías"],
  ["/admin/banner", "Banner"],
  ["/admin/ajustes", "Ajustes"],
] as const;

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav className="adm-nav">
      <div className="wrap">
        {items.map(([href, label]) => {
          const on = href === "/admin" ? path === "/admin" : path.startsWith(href);
          return (
            <Link key={href} href={href} className={on ? "on" : ""}>
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
