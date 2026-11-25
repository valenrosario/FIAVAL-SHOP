"use server";

import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, adminPassword, adminToken } from "@/lib/auth";
import * as data from "@/lib/data";
import { slugify } from "@/lib/format";
import { requireAdmin } from "@/lib/session";
import { ORDER_STATUSES, type Color, type OrderStatus, type Settings } from "@/lib/types";

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? "").trim().slice(0, max);
const bool = (fd: FormData, k: string) => fd.get(k) === "on" || fd.get(k) === "true";
const num = (fd: FormData, k: string) => {
  const v = String(fd.get(k) ?? "").replace(/\./g, "").replace(",", ".").trim();
  if (!v) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

async function fail(e: unknown): Promise<never> {
  if (e instanceof data.DemoError) {
    const ref = (await headers()).get("referer") || "/admin";
    const u = new URL(ref, "http://x");
    u.searchParams.delete("ok");
    u.searchParams.set("error", "demo");
    redirect(u.pathname + u.search);
  }
  throw e;
}

/* ---------- Sesión ---------- */

export async function login(fd: FormData) {
  const pw = adminPassword();
  const given = String(fd.get("password") ?? "");
  if (!pw || given !== pw) redirect("/admin/login?error=1");
  (await cookies()).set(ADMIN_COOKIE, await adminToken(pw), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

/* ---------- Tienda encendida / apagada y ajustes ---------- */

export async function setStoreOpen(open: boolean) {
  await requireAdmin();
  try {
    await data.saveSettings({ store_open: open });
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
}

export async function saveSettingsForm(fd: FormData) {
  await requireAdmin();
  const patch: Partial<Settings> = {
    store_open: bool(fd, "store_open"),
    closed_message: str(fd, "closed_message", 300),
    announcement: str(fd, "announcement", 160),
    whatsapp: str(fd, "whatsapp", 30),
    instagram: str(fd, "instagram", 60).replace(/^@/, ""),
    shipping_text: str(fd, "shipping_text", 400),
  };
  try {
    await data.saveSettings(patch);
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/ajustes?ok=1");
}

export async function saveBanner(fd: FormData) {
  await requireAdmin();
  try {
    await data.saveSettings({
      banner: {
        kicker: str(fd, "kicker", 60),
        title: str(fd, "title", 120),
        subtitle: str(fd, "subtitle", 240),
        cta_text: str(fd, "cta_text", 40),
        cta_link: str(fd, "cta_link", 300) || "/productos",
        image_url: str(fd, "image_url", 600),
      },
      print_band: {
        enabled: bool(fd, "band_enabled"),
        kicker: str(fd, "band_kicker", 60),
        title: str(fd, "band_title", 120),
        subtitle: str(fd, "band_subtitle", 240),
        cta_text: str(fd, "band_cta", 40),
      },
    });
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/banner?ok=1");
}

/* ---------- Productos ---------- */

export async function saveProductForm(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id", 60) || undefined;
  const name = str(fd, "name", 140);
  if (!name) redirect(id ? `/admin/productos/${id}?error=name` : "/admin/productos/nuevo?error=name");

  let slug = slugify(str(fd, "slug", 140) || name) || "producto";
  try {
    let n = 2;
    const base = slug;
    while (await data.slugTaken(slug, id)) slug = `${base}-${n++}`;
  } catch (e) {
    await fail(e);
  }

  let images: string[] = [];
  let colors: Color[] = [];
  try {
    images = (JSON.parse(str(fd, "images", 20000) || "[]") as string[]).filter((x) => typeof x === "string").slice(0, 12);
    colors = (JSON.parse(str(fd, "colors", 5000) || "[]") as Color[])
      .filter((c) => c && c.name?.trim())
      .map((c) => ({ name: c.name.trim().slice(0, 40), hex: /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex : "#141414" }))
      .slice(0, 20);
  } catch {}

  const stockRaw = num(fd, "stock");
  const product = {
    id,
    name,
    slug,
    description: str(fd, "description", 5000),
    price: num(fd, "price") ?? 0,
    compare_at_price: num(fd, "compare_at_price"),
    category_id: str(fd, "category_id", 60) || null,
    images,
    colors,
    sizes: str(fd, "sizes", 500)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20),
    stock: stockRaw === null ? null : Math.max(0, Math.floor(stockRaw)),
    is_new: bool(fd, "is_new"),
    featured: bool(fd, "featured"),
    active: bool(fd, "active"),
    position: num(fd, "position") ?? 0,
  };

  let savedId = id;
  try {
    savedId = await data.saveProduct(product);
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
  redirect(`/admin/productos/${savedId}?ok=1`);
}

export async function toggleProduct(id: string, active: boolean) {
  await requireAdmin();
  try {
    await data.setProductActive(id, active);
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
}

export async function removeProduct(id: string) {
  await requireAdmin();
  try {
    await data.deleteProduct(id);
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/productos?deleted=1");
}

/* ---------- Categorías ---------- */

export async function saveCategoryForm(fd: FormData) {
  await requireAdmin();
  const name = str(fd, "name", 60);
  if (!name) redirect("/admin/categorias");
  try {
    await data.saveCategory({
      id: str(fd, "id", 60) || undefined,
      name,
      slug: slugify(str(fd, "slug", 60) || name),
      position: num(fd, "position") ?? 0,
    });
  } catch (e) {
    if (e instanceof Error && /duplicate|unique/i.test(e.message)) redirect("/admin/categorias?error=dup");
    await fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/categorias?ok=1");
}

export async function removeCategory(id: string) {
  await requireAdmin();
  try {
    await data.deleteCategory(id);
  } catch (e) {
    await fail(e);
  }
  revalidatePath("/", "layout");
  redirect("/admin/categorias?ok=1");
}

/* ---------- Pedidos ---------- */

export async function changeOrderStatus(id: string, status: string) {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(status as OrderStatus)) return;
  await data.setOrderStatus(id, status as OrderStatus);
  revalidatePath("/admin", "layout");
}
