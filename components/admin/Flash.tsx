export default function Flash({ sp }: { sp: { ok?: string; error?: string; deleted?: string } }) {
  if (sp.error === "demo") return <div className="demo-note">No se guardó: la tienda está en modo demo. Conectá Supabase para guardar cambios.</div>;
  if (sp.error === "dup") return <div className="err" style={{ marginBottom: 14 }}>Ya existe una categoría con ese nombre.</div>;
  if (sp.error === "name") return <div className="err" style={{ marginBottom: 14 }}>Falta el nombre.</div>;
  if (sp.deleted) return <div className="flash">Eliminado.</div>;
  if (sp.ok) return <div className="flash">Cambios guardados ✓</div>;
  return null;
}
