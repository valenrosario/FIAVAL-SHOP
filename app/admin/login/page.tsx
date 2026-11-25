import { adminPassword } from "@/lib/auth";
import { isDemo } from "@/lib/data";
import { login } from "../actions";

export const metadata = { title: "Entrar al panel", robots: { index: false } };

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const configured = adminPassword() !== null;
  return (
    <main className="login">
      <form action={login}>
        <img src="/logo.png" alt="fiaval shop" />
        <h1 style={{ fontSize: 20, textAlign: "center" }}>Panel de la tienda</h1>
        {!configured ? (
          <div className="err">Falta configurar la variable ADMIN_PASSWORD en Vercel.</div>
        ) : (
          <>
            {isDemo() ? <div className="demo-note">Modo demo: la contraseña es “demo”.</div> : null}
            <div className="field">
              <label htmlFor="pw">Contraseña</label>
              <input id="pw" name="password" type="password" required autoFocus autoComplete="current-password" />
            </div>
            {error ? <div className="err">Contraseña incorrecta.</div> : null}
            <button className="btn btn-block">Entrar</button>
          </>
        )}
      </form>
    </main>
  );
}
