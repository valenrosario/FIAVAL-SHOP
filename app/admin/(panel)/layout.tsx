import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { isDemo } from "@/lib/data";
import { requireAdmin } from "@/lib/session";
import { logout } from "../actions";

export const metadata = { title: "Panel", robots: { index: false } };

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="adm">
      <header className="adm-top">
        <div className="wrap adm-top-in">
          <Link href="/admin">
            <img src="/logo.png" alt="fiaval shop" />
          </Link>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Link href="/" className="view" target="_blank">
              Ver tienda ↗
            </Link>
            <form action={logout}>
              <button style={{ color: "#bbb", fontSize: 13, padding: "8px 4px" }}>Salir</button>
            </form>
          </div>
        </div>
      </header>
      <AdminNav />
      <div className="wrap adm-main">
        {isDemo() ? (
          <div className="demo-note">
            <b>Modo demo.</b> Estás viendo datos de ejemplo. Para guardar productos, fotos y compras de verdad, conectá Supabase siguiendo el README.
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
