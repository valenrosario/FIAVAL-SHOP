import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import ProductView from "@/components/ProductView";
import { getCategories, getProductBySlug, getProducts, getSettings } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "Producto" };
  return { title: p.name, description: p.description.slice(0, 160), openGraph: { images: p.images.slice(0, 1) } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) notFound();
  const [categories, settings, related] = await Promise.all([
    getCategories(),
    getSettings(),
    p.category_id ? getProducts({ category: p.category_id, limit: 5 }) : Promise.resolve([]),
  ]);
  const cat = categories.find((c) => c.id === p.category_id);
  const more = related.filter((r) => r.id !== p.id).slice(0, 4);

  return (
    <div className="wrap pd-page">
      <div className="crumbs">
        <Link href="/">Inicio</Link> / {cat ? <Link href={`/categoria/${cat.slug}`}>{cat.name}</Link> : "Productos"} / {p.name}
      </div>
      <ProductView p={p} categoryName={cat?.name}>
        <div className="note">
          <Icon name="truck" size={20} />
          {settings.shipping_text}
        </div>
        <div className="acc">
          {p.description ? (
            <details open>
              <summary>Descripción</summary>
              <div className="acc-b">{p.description}</div>
            </details>
          ) : null}
          <details>
            <summary>Cómo comprar</summary>
            <div className="acc-b">
              Agregá los productos al carrito y tocá “Enviar pedido por WhatsApp”. Te respondemos para confirmar stock, forma de pago y entrega.
            </div>
          </details>
          <details>
            <summary>Envíos y retiros</summary>
            <div className="acc-b">{settings.shipping_text}</div>
          </details>
        </div>
      </ProductView>

      {more.length ? (
        <section className="sec">
          <div className="sec-h">
            <h2>También te puede gustar</h2>
          </div>
          <div className="grid">
            {more.map((r) => (
              <ProductCard key={r.id} p={r} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
