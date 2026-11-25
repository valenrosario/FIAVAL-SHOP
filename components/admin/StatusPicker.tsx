"use client";

import { useTransition } from "react";
import { changeOrderStatus } from "@/app/admin/actions";
import { ORDER_STATUSES } from "@/lib/types";

export default function StatusPicker({ id, status }: { id: string; status: string }) {
  const [pending, start] = useTransition();
  return (
    <div className="filters" style={{ flexWrap: "wrap", margin: 0 }}>
      {ORDER_STATUSES.map((s) => (
        <a
          key={s}
          href="#"
          className={s === status ? "on" : ""}
          style={{ textTransform: "capitalize", opacity: pending ? 0.5 : 1 }}
          onClick={(e) => {
            e.preventDefault();
            if (s !== status) start(() => changeOrderStatus(id, s));
          }}
        >
          {s}
        </a>
      ))}
    </div>
  );
}
