import Link from "next/link";
import { CartProvider } from "@/components/cart";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { getCategories, getSettings } from "@/lib/data";
import { isAdmin } from "@/lib/session";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const [settings, categories, admin] = await Promise.all([getSettings(), getCategories(), isAdmin()]);

  if (!settings.store_open && !admin) {
    return (
      <main className="closed">
        <img src="/logo.png" alt="fiaval shop" />
        <h1>{settings.closed_message || "Volvemos pronto."}</h1>
        {settings.instagram ? (
          <a className="btn" href={`https://instagram.com/${settings.instagram.replace("@", "")}`} target="_blank" rel="noopener">
            Seguinos en Instagram
          </a>
        ) : null}
      </main>
    );
  }

  return (
    <CartProvider>
      {!settings.store_open ? (
        <div className="admin-strip">
          La tienda está apagada: solo vos la ves porque entraste al panel. <Link href="/admin/ajustes">Encenderla</Link>
        </div>
      ) : null}
      <Header categories={categories} announcement={settings.announcement} />
      <main>{children}</main>
      <Footer settings={settings} categories={categories} />
    </CartProvider>
  );
}
