"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";
import { useCart } from "./cart";
import Icon from "./Icon";

export default function ProductView({ p, categoryName, children }: { p: Product; categoryName?: string; children?: React.ReactNode }) {
  const { add } = useCart();
  const track = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [color, setColor] = useState(p.colors[0]?.name ?? null);
  const [size, setSize] = useState<string | null>(p.sizes.length === 1 ? p.sizes[0] : null);
  const [qty, setQty] = useState(1);
  const [toast, setToast] = useState(false);
  const [needSize, setNeedSize] = useState(false);
  const images = p.images.length ? p.images : [];
  const out = p.stock === 0;
  const off = p.compare_at_price && p.compare_at_price > p.price;

  const go = (i: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * i, behavior: "smooth" });
  };

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const on = () => setSlide(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", on, { passive: true });
    return () => el.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(false), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  const pickColor = (name: string, i: number) => {
    setColor(name);
    // Si hay una foto por color (en el mismo orden), mostramos esa.
    if (images.length === p.colors.length) go(i);
  };

  const onAdd = () => {
    if (p.sizes.length && !size) {
      setNeedSize(true);
      return;
    }
    const ci = p.colors.findIndex((c) => c.name === color);
    add({
      product_id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: images[images.length === p.colors.length && ci >= 0 ? ci : 0] ?? null,
      color,
      size,
      qty,
    });
    setQty(1);
    setToast(true);
  };

  return (
    <div className="pd">
      <div>
        <div className="gal">
          <div className="gal-track" ref={track}>
            {images.map((src, i) => (
              <div className="gal-slide" key={src + i}>
                <img src={src} alt={`${p.name}, foto ${i + 1}`} loading={i ? "lazy" : "eager"} />
              </div>
            ))}
            {!images.length ? <div className="gal-slide" /> : null}
          </div>
          {images.length > 1 ? (
            <span className="gal-cnt">
              {slide + 1} / {images.length}
            </span>
          ) : null}
        </div>
        {images.length > 1 ? (
          <>
            <div className="gal-bars">
              {images.map((_, i) => (
                <button key={i} className={i === slide ? "on" : ""} aria-label={`Foto ${i + 1}`} onClick={() => go(i)} />
              ))}
            </div>
            <div className="gal-thumbs">
              {images.map((src, i) => (
                <button key={i} className={i === slide ? "on" : ""} aria-label={`Foto ${i + 1}`} onClick={() => go(i)}>
                  <img src={src} alt="" />
                </button>
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="pd-info">
        {categoryName ? <div className="kicker">{categoryName}</div> : null}
        <h1>{p.name}</h1>
        <div className="pd-price">
          {money(p.price)}
          {off ? <s>{money(p.compare_at_price!)}</s> : null}
        </div>

        {p.colors.length ? (
          <div className="opt">
            <div className="opt-l">Color — {color}</div>
            <div className="sw">
              {p.colors.map((c, i) => (
                <button key={c.name} title={c.name} aria-label={c.name} className={c.name === color ? "on" : ""} style={{ background: c.hex }} onClick={() => pickColor(c.name, i)} />
              ))}
            </div>
          </div>
        ) : null}

        {p.sizes.length ? (
          <div className="opt">
            <div className="opt-l" style={needSize && !size ? { color: "var(--red)" } : undefined}>
              {needSize && !size ? "Elegí una opción" : "Opción"}
            </div>
            <div className="sizes">
              {p.sizes.map((s) => (
                <button key={s} className={s === size ? "on" : ""} onClick={() => setSize(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <div className="buybar">
          <div className="qty">
            <button aria-label="Menos" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span>{qty}</span>
            <button aria-label="Más" onClick={() => setQty((q) => Math.min(99, q + 1))}>
              +
            </button>
          </div>
          <button className="btn" disabled={out} onClick={onAdd}>
            {out ? "Sin stock" : "Agregar al carrito"}
          </button>
        </div>

        {children}
      </div>

      {toast ? (
        <div className="toast" role="status">
          Agregado al carrito <Link href="/carrito">Ver carrito</Link>
        </div>
      ) : null}
    </div>
  );
}
