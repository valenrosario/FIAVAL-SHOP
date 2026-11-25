"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { Category } from "@/lib/types";
import Icon from "./Icon";

export default function MenuButton({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <button className="icon-btn hdr-menu" aria-label="Abrir menú" onClick={() => setOpen(true)}>
        <Icon name="menu" size={24} />
      </button>
      {open ? (
        <>
          <div className="drawer-bg" onClick={() => setOpen(false)} />
          <aside className="drawer" aria-label="Menú">
            <div className="drawer-top">
              <img src="/logo.png" alt="fiaval shop" style={{ height: 34, width: "auto" }} />
              <button className="icon-btn" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
                <Icon name="close" />
              </button>
            </div>
            <Link className="dl" href="/">Inicio <span>→</span></Link>
            <Link className="dl" href="/productos">Todos los productos <span>→</span></Link>
            <span className="kicker">Categorías</span>
            {categories.map((c) => (
              <Link className="dl" key={c.id} href={`/categoria/${c.slug}`}>
                {c.name} <span>→</span>
              </Link>
            ))}
            <Link className="dl" href="/carrito" style={{ marginTop: 18 }}>Mi carrito <span>→</span></Link>
          </aside>
        </>
      ) : null}
    </>
  );
}
