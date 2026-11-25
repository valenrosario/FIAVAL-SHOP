"use client";

import { useTransition } from "react";
import { toggleProduct } from "@/app/admin/actions";

export default function ToggleActive({ id, active }: { id: string; active: boolean }) {
  const [pending, start] = useTransition();
  return (
    <button
      className={"pill " + (active ? "listo" : "off")}
      style={{ padding: "6px 10px", opacity: pending ? 0.5 : 1 }}
      title={active ? "Tocá para ocultarlo de la tienda" : "Tocá para publicarlo"}
      onClick={() => start(() => toggleProduct(id, !active))}
    >
      {active ? "Publicado" : "Oculto"}
    </button>
  );
}
