"use client";

import { useTransition } from "react";
import { setStoreOpen } from "@/app/admin/actions";

export default function StoreSwitch({ open }: { open: boolean }) {
  const [pending, start] = useTransition();
  return (
    <div className="card switch-card">
      <div>
        <h2 style={{ margin: 0 }}>
          <span className="dot" style={{ background: open ? "#1f8a4c" : "var(--red)" }} />
          Tienda {open ? "encendida" : "apagada"}
        </h2>
        <p>{open ? "Los clientes pueden ver la tienda y hacer pedidos." : "Los clientes ven un cartel de “volvemos pronto”."}</p>
      </div>
      <button
        className={"btn btn-sm " + (open ? "btn-red" : "btn-green")}
        disabled={pending}
        onClick={() => {
          if (open && !confirm("¿Apagar la tienda? Los clientes no van a poder entrar.")) return;
          start(() => setStoreOpen(!open));
        }}
      >
        {pending ? "…" : open ? "Apagar" : "Encender"}
      </button>
    </div>
  );
}
