"use client";

import { useState } from "react";
import { removeProduct, saveProductForm } from "@/app/admin/actions";
import Icon from "@/components/Icon";
import type { Category, Color, Product } from "@/lib/types";
import ImagesField from "./ImagesField";

export default function ProductForm({ p, categories }: { p: Product | null; categories: Category[] }) {
  const [colors, setColors] = useState<Color[]>(p?.colors ?? []);
  return (
    <form action={saveProductForm} className="af">
      {p ? <input type="hidden" name="id" value={p.id} /> : null}
      <input type="hidden" name="colors" value={JSON.stringify(colors)} />

      <div className="card">
        <h2>Fotos</h2>
        <ImagesField name="images" initial={p?.images ?? []} />
        <p className="hint">La primera es la principal. Usá fotos con fondo claro, con el producto entero y derecho.</p>
      </div>

      <div className="card af">
        <div className="field">
          <label htmlFor="name">Nombre</label>
          <input id="name" name="name" required defaultValue={p?.name} placeholder="Ej: Cuaderno A5 tapa dura" />
        </div>
        <div className="two">
          <div className="field">
            <label htmlFor="price">Precio</label>
            <input id="price" name="price" inputMode="decimal" required defaultValue={p?.price ?? ""} placeholder="8900" />
          </div>
          <div className="field">
            <label htmlFor="compare_at_price">Precio antes (opcional)</label>
            <input id="compare_at_price" name="compare_at_price" inputMode="decimal" defaultValue={p?.compare_at_price ?? ""} placeholder="10500" />
          </div>
        </div>
        <div className="two">
          <div className="field">
            <label htmlFor="category_id">Categoría</label>
            <select id="category_id" name="category_id" defaultValue={p?.category_id ?? ""}>
              <option value="">Sin categoría</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="stock">Stock (opcional)</label>
            <input id="stock" name="stock" inputMode="numeric" defaultValue={p?.stock ?? ""} placeholder="Sin límite" />
          </div>
        </div>
        <div className="field">
          <label htmlFor="description">Descripción</label>
          <textarea id="description" name="description" rows={5} defaultValue={p?.description} placeholder="Medidas, materiales, cantidad de hojas…" />
        </div>
      </div>

      <div className="card af">
        <h2 style={{ margin: 0 }}>Variantes</h2>
        <div className="field">
          <label>Colores</label>
          {colors.map((c, i) => (
            <div className="color-row" key={i}>
              <input type="color" value={c.hex} aria-label="Color" onChange={(e) => setColors((a) => a.map((x, k) => (k === i ? { ...x, hex: e.target.value } : x)))} />
              <input value={c.name} placeholder="Nombre del color" onChange={(e) => setColors((a) => a.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} />
              <button type="button" className="icon-btn" aria-label="Quitar color" onClick={() => setColors((a) => a.filter((_, k) => k !== i))}>
                <Icon name="trash" size={18} />
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => setColors((a) => [...a, { name: "", hex: "#2f3b8f" }])}>
            + Agregar color
          </button>
          <p className="hint">Si cargás una foto por color en el mismo orden, al elegir el color se muestra su foto.</p>
        </div>
        <div className="field">
          <label htmlFor="sizes">Opciones (separadas por coma)</label>
          <input id="sizes" name="sizes" defaultValue={p?.sizes.join(", ")} placeholder="Ej: A5, A4  o  Lisas, Rayadas" />
        </div>
      </div>

      <div className="card af">
        <label className="check">
          <input type="checkbox" name="active" defaultChecked={p ? p.active : true} /> Publicado en la tienda
        </label>
        <label className="check">
          <input type="checkbox" name="featured" defaultChecked={p ? p.featured : true} /> Mostrar en el inicio (destacados)
        </label>
        <label className="check">
          <input type="checkbox" name="is_new" defaultChecked={p?.is_new} /> Etiqueta “NUEVO”
        </label>
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="position">Orden</label>
          <input id="position" name="position" inputMode="numeric" defaultValue={p?.position ?? 0} />
          <p className="hint">Los números más bajos aparecen primero.</p>
        </div>
      </div>

      <div className="save-bar">
        <button className="btn" style={{ flex: 1 }}>
          Guardar producto
        </button>
        {p ? (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              if (confirm("¿Eliminar este producto? No se puede deshacer.")) removeProduct(p.id);
            }}
          >
            Eliminar
          </button>
        ) : null}
      </div>
    </form>
  );
}
