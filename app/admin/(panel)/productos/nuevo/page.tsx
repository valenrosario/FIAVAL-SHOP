import Link from "next/link";
import Flash from "@/components/admin/Flash";
import ProductForm from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/data";

export default async function Nuevo({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  return (
    <>
      <p style={{ marginBottom: 10 }}>
        <Link href="/admin/productos" className="link">
          ← Productos
        </Link>
      </p>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>Nuevo producto</h1>
      </div>
      <ProductForm p={null} categories={await getCategories()} />
    </>
  );
}
