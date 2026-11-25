import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { unstable_noStore as noStore } from "next/cache";
import { demoCategories, demoOrders, demoProducts, demoSettings } from "./demo";
import type { Category, Order, OrderItem, OrderStatus, Product, Settings } from "./types";

// Todo el acceso a datos pasa por el servidor con la clave de servicio de Supabase.
// Si Supabase no está configurado, la tienda funciona en "modo demo" con datos de ejemplo.

let client: SupabaseClient | null = null;

export function isDemo() {
  return !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY;
}

function db() {
  if (isDemo()) throw new Error("DEMO");
  if (!client) {
    client = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export class DemoError extends Error {
  constructor() {
    super("La tienda está en modo demo: conectá Supabase para guardar cambios.");
  }
}

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

/* ---------- Ajustes ---------- */

export async function getSettings(): Promise<Settings> {
  noStore();
  if (isDemo()) return demoSettings;
  const { data, error } = await db().from("settings").select("data").eq("id", 1).maybeSingle();
  if (error) throw new Error(error.message);
  const saved = (data?.data ?? {}) as Partial<Settings>;
  return {
    ...demoSettings,
    ...saved,
    banner: { ...demoSettings.banner, ...(saved.banner ?? {}) },
    print_band: { ...demoSettings.print_band, ...(saved.print_band ?? {}) },
  };
}

export async function saveSettings(patch: Partial<Settings>) {
  if (isDemo()) throw new DemoError();
  const current = await getSettings();
  const next = { ...current, ...patch };
  must(await db().from("settings").upsert({ id: 1, data: next }));
}

/* ---------- Categorías ---------- */

export async function getCategories(): Promise<Category[]> {
  noStore();
  if (isDemo()) return demoCategories;
  return must(await db().from("categories").select("*").order("position").order("name"));
}

export async function saveCategory(c: Partial<Category> & { name: string; slug: string }) {
  if (isDemo()) throw new DemoError();
  if (c.id) must(await db().from("categories").update({ name: c.name, slug: c.slug, position: c.position ?? 0 }).eq("id", c.id));
  else must(await db().from("categories").insert({ name: c.name, slug: c.slug, position: c.position ?? 0 }));
}

export async function deleteCategory(id: string) {
  if (isDemo()) throw new DemoError();
  must(await db().from("categories").delete().eq("id", id));
}

/* ---------- Productos ---------- */

type ProductQuery = { category?: string; q?: string; featured?: boolean; all?: boolean; limit?: number };

export async function getProducts(opts: ProductQuery = {}): Promise<Product[]> {
  noStore();
  if (isDemo()) {
    let list = demoProducts.filter((p) => opts.all || p.active);
    if (opts.category) list = list.filter((p) => p.category_id === opts.category);
    if (opts.featured) list = list.filter((p) => p.featured);
    if (opts.q) {
      const q = opts.q.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }
    return opts.limit ? list.slice(0, opts.limit) : list;
  }
  let query = db().from("products").select("*");
  if (!opts.all) query = query.eq("active", true);
  if (opts.category) query = query.eq("category_id", opts.category);
  if (opts.featured) query = query.eq("featured", true);
  if (opts.q) query = query.ilike("name", `%${opts.q.replace(/[%_,()]/g, " ")}%`);
  query = query.order("position").order("created_at", { ascending: false });
  if (opts.limit) query = query.limit(opts.limit);
  return must(await query);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  noStore();
  if (isDemo()) return demoProducts.find((p) => p.slug === slug && p.active) ?? null;
  return must(await db().from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle());
}

export async function getProductById(id: string): Promise<Product | null> {
  noStore();
  if (isDemo()) return demoProducts.find((p) => p.id === id) ?? null;
  return must(await db().from("products").select("*").eq("id", id).maybeSingle());
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (isDemo()) return demoProducts.filter((p) => ids.includes(p.id));
  if (!ids.length) return [];
  return must(await db().from("products").select("*").in("id", ids));
}

export async function saveProduct(p: Omit<Product, "id" | "created_at"> & { id?: string }): Promise<string> {
  if (isDemo()) throw new DemoError();
  const { id, ...row } = p;
  if (id) {
    must(await db().from("products").update(row).eq("id", id));
    return id;
  }
  const created = must(await db().from("products").insert(row).select("id").single()) as { id: string };
  return created.id;
}

export async function setProductActive(id: string, active: boolean) {
  if (isDemo()) throw new DemoError();
  must(await db().from("products").update({ active }).eq("id", id));
}

export async function deleteProduct(id: string) {
  if (isDemo()) throw new DemoError();
  must(await db().from("products").delete().eq("id", id));
}

export async function slugTaken(slug: string, exceptId?: string) {
  if (isDemo()) return false;
  let q = db().from("products").select("id").eq("slug", slug);
  if (exceptId) q = q.neq("id", exceptId);
  const rows = must(await q) as { id: string }[];
  return rows.length > 0;
}

/* ---------- Pedidos ---------- */

export async function createOrder(o: {
  customer_name: string;
  phone: string;
  delivery: "retiro" | "envio";
  address: string;
  notes: string;
  items: OrderItem[];
  total: number;
}): Promise<Order> {
  if (isDemo()) {
    const order: Order = {
      ...o,
      id: crypto.randomUUID(),
      number: 1000 + demoOrders.length + 1,
      created_at: new Date().toISOString(),
      status: "nuevo",
    };
    demoOrders.unshift(order);
    return order;
  }
  return must(await db().from("orders").insert({ ...o, status: "nuevo" }).select("*").single());
}

export async function getOrder(id: string): Promise<Order | null> {
  noStore();
  if (!/^[0-9a-f-]{36}$/i.test(id)) return null;
  if (isDemo()) return demoOrders.find((o) => o.id === id) ?? null;
  return must(await db().from("orders").select("*").eq("id", id).maybeSingle());
}

export async function listOrders(status?: string): Promise<Order[]> {
  noStore();
  if (isDemo()) return status ? demoOrders.filter((o) => o.status === status) : demoOrders;
  let q = db().from("orders").select("*").order("created_at", { ascending: false }).limit(300);
  if (status) q = q.eq("status", status);
  return must(await q);
}

export async function setOrderStatus(id: string, status: OrderStatus) {
  if (isDemo()) {
    const o = demoOrders.find((x) => x.id === id);
    if (o) o.status = status;
    return;
  }
  must(await db().from("orders").update({ status }).eq("id", id));
}

/* ---------- Imágenes ---------- */

export async function uploadImage(file: File): Promise<string> {
  if (isDemo()) throw new DemoError();
  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error } = await db().storage.from("imagenes").upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    cacheControl: "31536000",
  });
  if (error) throw new Error(error.message);
  return db().storage.from("imagenes").getPublicUrl(path).data.publicUrl;
}
