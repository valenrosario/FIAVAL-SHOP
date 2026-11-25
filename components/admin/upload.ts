// Achica la foto en el navegador (máx. 1600 px) antes de subirla, así carga rápido en la tienda.
export async function shrink(file: File, max = 1600): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const w = Math.round(bmp.width * scale);
  const h = Math.round(bmp.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, w, h);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("No se pudo procesar la foto"))), "image/webp", 0.86));
}

export async function uploadFile(file: File): Promise<string> {
  let blob: Blob = file;
  try {
    blob = await shrink(file);
  } catch {}
  const fd = new FormData();
  fd.append("file", new File([blob], "foto.webp", { type: blob.type || file.type }));
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "No se pudo subir la foto");
  return json.url as string;
}
