import Flash from "@/components/admin/Flash";
import DeleteCategory from "@/components/admin/DeleteCategory";
import { getCategories } from "@/lib/data";
import { saveCategoryForm } from "../../actions";

export default async function Categorias({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const cats = await getCategories();
  return (
    <>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>Categorías</h1>
      </div>
      <div className="card">
        <h2>Nueva categoría</h2>
        <form action={saveCategoryForm} style={{ display: "flex", gap: 8 }}>
          <div className="field" style={{ flex: 1 }}>
            <input name="name" required placeholder="Ej: Mochilas" aria-label="Nombre" />
          </div>
          <input type="hidden" name="position" value={cats.length + 1} />
          <button className="btn btn-sm">Agregar</button>
        </form>
      </div>
      <div className="rows">
        {cats.map((c) => (
          <form key={c.id} action={saveCategoryForm} className="row" style={{ flexWrap: "wrap" }}>
            <input type="hidden" name="id" value={c.id} />
            <div className="field" style={{ width: 64 }}>
              <input name="position" defaultValue={c.position} inputMode="numeric" aria-label="Orden" />
            </div>
            <div className="field" style={{ flex: 1, minWidth: 140 }}>
              <input name="name" defaultValue={c.name} aria-label="Nombre" />
            </div>
            <button className="btn btn-sm btn-ghost">Guardar</button>
            <DeleteCategory id={c.id} />
          </form>
        ))}
      </div>
      <p className="hint" style={{ fontSize: 13, color: "var(--muted)", marginTop: 10 }}>
        El número de la izquierda es el orden en la tienda. Si borrás una categoría, sus productos quedan “sin categoría”.
      </p>
    </>
  );
}
