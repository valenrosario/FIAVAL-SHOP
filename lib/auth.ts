// Acceso al panel con una contraseña (variable ADMIN_PASSWORD en Vercel).
// La cookie guarda una firma HMAC de la contraseña, nunca la contraseña.

export const ADMIN_COOKIE = "fiaval_admin";

export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  // Sin Supabase (modo demo) se puede entrar con "demo" para mirar el panel.
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) return "demo";
  return null;
}

export async function adminToken(password: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", enc.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode("fiaval-shop-admin-v1"));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function isValidAdminCookie(value: string | undefined) {
  const pw = adminPassword();
  if (!pw || !value) return false;
  const expected = await adminToken(pw);
  if (expected.length !== value.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ value.charCodeAt(i);
  return diff === 0;
}
