import Link from "next/link";
import type { Category } from "@/lib/types";
import Icon from "./Icon";
import { CartCount } from "./cart";
import MenuButton from "./MenuButton";

export default function Header({ categories, announcement }: { categories: Category[]; announcement: string }) {
  return (
    <>
      {announcement ? <div className="ann">{announcement}</div> : null}
      <header className="hdr">
        <div className="wrap hdr-in">
          <div className="hdr-l">
            <MenuButton categories={categories} />
            <nav className="hdr-nav">
              <Link href="/productos">Tienda</Link>
              {categories.slice(0, 4).map((c) => (
                <Link key={c.id} href={`/categoria/${c.slug}`}>
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
          <Link href="/" className="hdr-logo" aria-label="fiaval shop, inicio">
            <img src="/logo.png" alt="fiaval shop" width={176} height={44} />
          </Link>
          <div className="hdr-r">
            <Link href="/productos?buscar=1" className="icon-btn" aria-label="Buscar">
              <Icon name="search" />
            </Link>
            <Link href="/carrito" className="icon-btn" aria-label="Carrito">
              <Icon name="bag" />
              <CartCount />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
