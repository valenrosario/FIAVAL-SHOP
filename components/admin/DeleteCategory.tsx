"use client";

import { removeCategory } from "@/app/admin/actions";
import Icon from "@/components/Icon";

export default function DeleteCategory({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="icon-btn"
      aria-label="Eliminar categoría"
      onClick={() => {
        if (confirm("¿Eliminar esta categoría?")) removeCategory(id);
      }}
    >
      <Icon name="trash" size={18} />
    </button>
  );
}
