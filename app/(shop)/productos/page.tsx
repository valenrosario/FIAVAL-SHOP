import ProductList from "@/components/ProductList";
import { getCategories, getProducts } from "@/lib/data";

export const metadata = { title: "Productos" };

export default async function Productos({ searchParams }: { searchParams: Promise<{ q?: string; buscar?: string }> }) {
  const { q, buscar } = await searchParams;
  const [categories, products] = await Promise.all([getCategories(), getProducts({ q: q?.trim() || undefined })]);
  return <ProductList title={q ? "Resultados" : "Todos los productos"} categories={categories} products={products} q={q} showSearch={!!buscar} />;
}
