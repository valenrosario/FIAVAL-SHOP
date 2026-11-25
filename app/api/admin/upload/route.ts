import { NextResponse } from "next/server";
import { DemoError, uploadImage } from "@/lib/data";
import { isAdmin } from "@/lib/session";

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const fd = await req.formData();
  const file = fd.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Falta la imagen" }, { status: 400 });
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return NextResponse.json({ error: "Usá fotos JPG, PNG o WEBP" }, { status: 400 });
  if (file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "La foto es muy pesada (máx. 4 MB)" }, { status: 400 });
  try {
    const url = await uploadImage(file);
    return NextResponse.json({ url });
  } catch (e) {
    if (e instanceof DemoError) return NextResponse.json({ error: e.message }, { status: 400 });
    console.error(e);
    return NextResponse.json({ error: "No se pudo subir la foto" }, { status: 500 });
  }
}
