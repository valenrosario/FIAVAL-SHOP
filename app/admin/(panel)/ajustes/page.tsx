import Flash from "@/components/admin/Flash";
import { getSettings } from "@/lib/data";
import { saveSettingsForm } from "../../actions";

export default async function Ajustes({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const s = await getSettings();
  return (
    <>
      <Flash sp={sp} />
      <div className="adm-h">
        <h1>Ajustes</h1>
      </div>
      <form action={saveSettingsForm} className="af">
        <div className="card af">
          <h2 style={{ margin: 0 }}>Tienda encendida / apagada</h2>
          <label className="check">
            <input type="checkbox" name="store_open" defaultChecked={s.store_open} /> Tienda encendida
          </label>
          <div className="field">
            <label htmlFor="closed_message">Mensaje cuando está apagada</label>
            <input id="closed_message" name="closed_message" defaultValue={s.closed_message} />
          </div>
        </div>
        <div className="card af">
          <h2 style={{ margin: 0 }}>Contacto y avisos</h2>
          <div className="field">
            <label htmlFor="whatsapp">WhatsApp donde llegan los pedidos</label>
            <input id="whatsapp" name="whatsapp" inputMode="tel" defaultValue={s.whatsapp} placeholder="5491122334455" />
            <p className="hint">Con código de país y sin el 15. Ej. Argentina: 549 + característica + número.</p>
          </div>
          <div className="field">
            <label htmlFor="instagram">Instagram</label>
            <input id="instagram" name="instagram" defaultValue={s.instagram} placeholder="fiaval.shop" />
          </div>
          <div className="field">
            <label htmlFor="announcement">Barra negra de arriba</label>
            <input id="announcement" name="announcement" defaultValue={s.announcement} placeholder="Vacío = no se muestra" />
          </div>
          <div className="field">
            <label htmlFor="shipping_text">Texto de envíos</label>
            <textarea id="shipping_text" name="shipping_text" rows={2} defaultValue={s.shipping_text} />
          </div>
        </div>
        <div className="save-bar">
          <button className="btn" style={{ flex: 1 }}>
            Guardar ajustes
          </button>
        </div>
      </form>
    </>
  );
}
