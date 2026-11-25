import { notFound } from "next/navigation";
import ProductList from "@/components/ProductList";
import { getCategories, getProducts } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = (await getCategories()).find((x) => x.slug === slug);
  return { title: c?.name ?? "Categoría" };
}

export default async function Categoria({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();
  const products = await getProducts({ category: cat.id });
  return <ProductList title={cat.name} categories={categories} products={products} active={cat.id} />;
}
