import Link from "next/link";
import { notFound } from "next/navigation";
import Flash from "@/components/admin/Flash";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories, getProductById } from "@/lib/data";

export default async function Editar({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const [p, categories] = await Promise.all([getProductById(id), getCategories()]);
  if (!p) notFound();
  return (
    <>
      <p style={{ marginBottom: 10 }}>
        <Link href="/admin/productos" className="link">
          ← Productos
        </Link>
      </p>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>{p.name}</h1>
        {p.active ? (
          <Link href={`/producto/${p.slug}`} target="_blank" className="link">
            Ver en la tienda ↗
          </Link>
        ) : null}
      </div>
      <ProductForm key={p.id + (sp.ok ?? "")} p={p} categories={categories} />
    </>
  );
}
