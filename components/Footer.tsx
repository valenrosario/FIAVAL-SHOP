import Link from "next/link";
import type { Category, Settings } from "@/lib/types";
import { waNumber } from "@/lib/format";

export default function Footer({ settings, categories }: { settings: Settings; categories: Category[] }) {
  return (
    <footer className="ftr">
      <div className="wrap">
        <img className="ftr-logo" src="/logo.png" alt="fiaval shop" width={176} height={44} />
        <p>Papelería, librería e impresiones.</p>
        <div className="ftr-cols">
          <div>
            <h4>TIENDA</h4>
            <Link href="/productos">Todos los productos</Link>
            {categories.slice(0, 5).map((c) => (
              <Link key={c.id} href={`/categoria/${c.slug}`}>
                {c.name}
              </Link>
            ))}
          </div>
          <div>
            <h4>CONTACTO</h4>
            {settings.whatsapp ? (
              <a href={`https://wa.me/${waNumber(settings.whatsapp)}`} target="_blank" rel="noopener">
                WhatsApp
              </a>
            ) : null}
            {settings.instagram ? (
              <a href={`https://instagram.com/${settings.instagram.replace("@", "")}`} target="_blank" rel="noopener">
                Instagram
              </a>
            ) : null}
            <Link href="/carrito">Mi carrito</Link>
          </div>
        </div>
        <small>© {new Date().getFullYear()} fiaval shop</small>
      </div>
    </footer>
  );
}
