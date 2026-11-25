"use client";

import { useRef, useState } from "react";
import Icon from "@/components/Icon";
import { uploadFile } from "./upload";

export default function ImagesField({ name, initial, max = 12, single = false }: { name: string; initial: string[]; max?: number; single?: boolean }) {
  const [imgs, setImgs] = useState<string[]>(initial);
  const [busy, setBusy] = useState(0);
  const [err, setErr] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const limit = single ? 1 : max;

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setErr("");
    const list = Array.from(files).slice(0, limit - (single ? 0 : imgs.length));
    setBusy(list.length);
    for (const f of list) {
      try {
        const url = await uploadFile(f);
        setImgs((prev) => (single ? [url] : [...prev, url]));
      } catch (e) {
        setErr(e instanceof Error ? e.message : "Error al subir");
      }
      setBusy((b) => b - 1);
    }
    if (input.current) input.current.value = "";
  };

  const move = (i: number, d: number) =>
    setImgs((prev) => {
      const a = [...prev];
      const j = i + d;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });

  return (
    <div>
      <input type="hidden" name={name} value={single ? imgs[0] ?? "" : JSON.stringify(imgs)} />
      <div className="imgs">
        {imgs.map((src, i) => (
          <div className="im" key={src + i}>
            <img src={src} alt="" />
            {!single && i === 0 ? <span className="first">PRINCIPAL</span> : null}
            <button type="button" className="x" aria-label="Quitar foto" onClick={() => setImgs((p) => p.filter((_, k) => k !== i))}>
              <Icon name="close" size={14} />
            </button>
            {!single && imgs.length > 1 ? (
              <div className="mv">
                <button type="button" aria-label="Mover a la izquierda" onClick={() => move(i, -1)}>
                  ←
                </button>
                <button type="button" aria-label="Mover a la derecha" onClick={() => move(i, 1)}>
                  →
                </button>
              </div>
            ) : null}
          </div>
        ))}
        {imgs.length < limit || single ? (
          <label className="add">
            <Icon name="plus" />
            {busy ? `Subiendo ${busy}…` : single && imgs.length ? "Cambiar" : "Agregar foto"}
            <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple={!single} hidden onChange={(e) => onFiles(e.target.files)} />
          </label>
        ) : null}
      </div>
      {err ? <div className="err" style={{ marginTop: 8 }}>{err}</div> : null}
    </div>
  );
}
