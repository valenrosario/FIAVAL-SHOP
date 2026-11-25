import Flash from "@/components/admin/Flash";
import ImagesField from "@/components/admin/ImagesField";
import { getSettings } from "@/lib/data";
import { saveBanner } from "../../actions";

export default async function BannerPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const s = await getSettings();
  const b = s.banner;
  const band = s.print_band;
  return (
    <>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>Banner principal</h1>
      </div>
      <form action={saveBanner} className="af">
        <div className="card af">
          <div className="field">
            <label>Foto del banner (opcional)</label>
            <ImagesField name="image_url" initial={b.image_url ? [b.image_url] : []} single />
            <p className="hint">Si no subís foto, se muestra la ilustración de cuadernos. Ideal: foto horizontal con espacio libre a la izquierda para el texto.</p>
          </div>
          <div className="field">
            <label htmlFor="kicker">Texto chico de arriba</label>
            <input id="kicker" name="kicker" defaultValue={b.kicker} placeholder="COLECCIÓN 2027" />
          </div>
          <div className="field">
            <label htmlFor="title">Título</label>
            <input id="title" name="title" required defaultValue={b.title} />
          </div>
          <div className="field">
            <label htmlFor="subtitle">Bajada</label>
            <textarea id="subtitle" name="subtitle" rows={2} defaultValue={b.subtitle} />
          </div>
          <div className="two">
            <div className="field">
              <label htmlFor="cta_text">Texto del botón</label>
              <input id="cta_text" name="cta_text" defaultValue={b.cta_text} />
            </div>
            <div className="field">
              <label htmlFor="cta_link">Link del botón</label>
              <input id="cta_link" name="cta_link" defaultValue={b.cta_link} placeholder="/categoria/agendas" />
            </div>
          </div>
        </div>

        <div className="card af">
          <h2 style={{ margin: 0 }}>Franja azul de impresiones</h2>
          <label className="check">
            <input type="checkbox" name="band_enabled" defaultChecked={band.enabled} /> Mostrar en el inicio
          </label>
          <div className="field">
            <label htmlFor="band_kicker">Texto chico</label>
            <input id="band_kicker" name="band_kicker" defaultValue={band.kicker} />
          </div>
          <div className="field">
            <label htmlFor="band_title">Título</label>
            <input id="band_title" name="band_title" defaultValue={band.title} />
          </div>
          <div className="field">
            <label htmlFor="band_subtitle">Bajada</label>
            <input id="band_subtitle" name="band_subtitle" defaultValue={band.subtitle} />
          </div>
          <div className="field">
            <label htmlFor="band_cta">Texto del botón (abre WhatsApp)</label>
            <input id="band_cta" name="band_cta" defaultValue={band.cta_text} />
          </div>
        </div>
        <div className="save-bar">
          <button className="btn" style={{ flex: 1 }}>
            Guardar banner
          </button>
        </div>
      </form>
    </>
  );
}
