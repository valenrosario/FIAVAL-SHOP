import CartView from "./CartView";
import { getSettings } from "@/lib/data";

export const metadata = { title: "Carrito" };

export default async function Carrito() {
  const s = await getSettings();
  return <CartView shippingText={s.shipping_text} />;
}
