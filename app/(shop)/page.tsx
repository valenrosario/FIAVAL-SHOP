import Link from "next/link";
import Icon from "@/components/Icon";
import ProductCard from "@/components/ProductCard";
import { getCategories, getProducts, getSettings } from "@/lib/data";
import { waNumber } from "@/lib/format";

export default async function Home() {
  const [settings, categories, products] = await Promise.all([getSettings(), getCategories(), getProducts({ featured: true, limit: 12 })]);
  const b = settings.banner;
  const band = settings.print_band;
  const wa = settings.whatsapp ? `https://wa.me/${waNumber(settings.whatsapp)}?text=${encodeURIComponent("Hola! Quiero pedir un presupuesto de impresión.")}` : "/productos";
  // Si no hay foto cargada, mostramos los dibujos de ejemplo.
  const photo = b.image_url;

  return (
    <>
      <section className={"hero" + (photo ? " has-photo" : "")}>
        {photo ? <img className="hero-img" src={photo} alt="" /> : <img className="hero-img" src="/demo/hero.svg" alt="" />}
        <div className="wrap hero-in">
          <div className="hero-text">
            {b.kicker ? <div className="kicker">{b.kicker}</div> : null}
            <h1>{b.title}</h1>
            {b.subtitle ? <p>{b.subtitle}</p> : null}
          </div>
          {b.cta_text ? (
            <Link href={b.cta_link || "/productos"} className="btn">
              {b.cta_text} <Icon name="arrow" size={18} />
            </Link>
          ) : null}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-h">
          <h2>Categorías</h2>
        </div>
        <div className="chips scroll">
          <Link href="/productos" className="chip on">
            Todo
          </Link>
          {categories.map((c) => (
            <Link key={c.id} href={`/categoria/${c.slug}`} className="chip">
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="wrap sec">
        <div className="sec-h">
          <h2>Destacados</h2>
          <Link href="/productos" className="link">
            Ver todo
          </Link>
        </div>
        {products.length ? (
          <div className="grid">
            {products.map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
          </div>
        ) : (
          <p className="empty">Pronto vas a ver productos acá.</p>
        )}
      </section>

      {band.enabled ? (
        <section className="band">
          <div className="wrap band-in">
            <div className="kicker">{band.kicker}</div>
            <h2>{band.title}</h2>
            <p>{band.subtitle}</p>
            <a className="btn btn-light" href={wa} target="_blank" rel="noopener">
              {band.cta_text || "Pedir presupuesto"}
            </a>
          </div>
        </section>
      ) : null}

      <section className="wrap">
        <div className="perks">
          <div className="perk">
            <Icon name="truck" size={26} />
            <div>
              <b>Envíos y retiro</b>
              <span>{settings.shipping_text}</span>
            </div>
          </div>
          <div className="perk">
            <Icon name="chat" size={26} />
            <div>
              <b>Pedí por WhatsApp</b>
              <span>Armá tu carrito y lo confirmamos por chat.</span>
            </div>
          </div>
          <div className="perk">
            <Icon name="print" size={26} />
            <div>
              <b>Impresiones a medida</b>
              <span>Tarjetas, stickers, flyers y fotos.</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
