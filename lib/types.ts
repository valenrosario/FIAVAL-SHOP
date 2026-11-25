export type Color = { name: string; hex: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  position: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  colors: Color[];
  sizes: string[];
  stock: number | null;
  is_new: boolean;
  featured: boolean;
  active: boolean;
  position: number;
  created_at: string;
};

export type Banner = {
  kicker: string;
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  image_url: string;
};

export type PrintBand = {
  enabled: boolean;
  kicker: string;
  title: string;
  subtitle: string;
  cta_text: string;
};

export type Settings = {
  store_open: boolean;
  closed_message: string;
  announcement: string;
  whatsapp: string;
  instagram: string;
  shipping_text: string;
  banner: Banner;
  print_band: PrintBand;
};

export type OrderItem = {
  product_id: string;
  name: string;
  price: number;
  qty: number;
  color: string | null;
  size: string | null;
  image: string | null;
};

export const ORDER_STATUSES = [
  "nuevo",
  "confirmado",
  "preparando",
  "listo",
  "entregado",
  "cancelado",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  number: number;
  created_at: string;
  customer_name: string;
  phone: string;
  delivery: "retiro" | "envio";
  address: string;
  notes: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
};
