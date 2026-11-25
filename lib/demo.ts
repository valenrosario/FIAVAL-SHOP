import type { Category, Order, Product, Settings } from "./types";

// Datos de ejemplo: se usan solo mientras Supabase no está configurado.
export const demoSettings: Settings = {
  store_open: true,
  closed_message: "Estamos renovando la tienda. Volvemos muy pronto.",
  announcement: "Envíos a todo el país · Retiro gratis en el local",
  whatsapp: "5491100000000",
  instagram: "fiaval.shop",
  shipping_text: "Coordinamos el envío por WhatsApp después de tu pedido.",
  banner: {
    kicker: "COLECCIÓN 2027",
    title: "Papelería que da ganas de usar.",
    subtitle: "Agendas, cuadernos e impresiones hechas con cuidado.",
    cta_text: "Comprar ahora",
    cta_link: "/productos",
    image_url: "",
  },
  print_band: {
    enabled: true,
    kicker: "SERVICIO DE IMPRESIÓN",
    title: "Imprimí tus ideas en el día.",
    subtitle: "Tarjetas, flyers, stickers y más. Mandanos tu archivo por WhatsApp.",
    cta_text: "Pedir presupuesto",
  },
};

const cat = (id: string, name: string, position: number): Category => ({
  id,
  name,
  slug: id,
  position,
});

export const demoCategories: Category[] = [
  cat("cuadernos", "Cuadernos", 1),
  cat("agendas", "Agendas", 2),
  cat("escolar", "Escolar", 3),
  cat("oficina", "Oficina", 4),
  cat("arte", "Arte", 5),
  cat("stickers", "Stickers", 6),
  cat("impresiones", "Impresiones", 7),
  cat("tarjetas", "Tarjetas", 8),
];

let n = 0;
const p = (x: Partial<Product> & Pick<Product, "name" | "price" | "category_id" | "images">): Product => {
  n++;
  return {
    id: "demo-" + n,
    slug: x.name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, ""),
    description: "",
    compare_at_price: null,
    colors: [],
    sizes: [],
    stock: null,
    is_new: false,
    featured: true,
    active: true,
    position: n,
    created_at: new Date(2026, 10, 25 - n).toISOString(),
    ...x,
  };
};

export const demoProducts: Product[] = [
  p({
    name: "Agenda 2027 semanal tapa dura",
    price: 15900,
    category_id: "agendas",
    images: ["/demo/agenda-indigo.svg", "/demo/agenda-roja.svg", "/demo/agenda-amarilla.svg"],
    colors: [
      { name: "Azul índigo", hex: "#2F3B8F" },
      { name: "Rojo", hex: "#E4572E" },
      { name: "Amarillo", hex: "#F2B705" },
    ],
    sizes: ["A6", "A5", "A4"],
    is_new: true,
    description:
      "Agenda semanal 2027 con tapa dura laminada mate, elástico de cierre y cinta señaladora. 160 páginas de 90 g, planificador mensual y hojas de notas al final.",
  }),
  p({
    name: "Cuaderno A5 tapa dura",
    price: 8900,
    compare_at_price: 10500,
    category_id: "cuadernos",
    images: ["/demo/cuaderno-azul.svg", "/demo/cuaderno-rojo.svg", "/demo/cuaderno-verde.svg"],
    colors: [
      { name: "Azul", hex: "#2F3B8F" },
      { name: "Rojo", hex: "#E4572E" },
      { name: "Verde", hex: "#3E8E6E" },
    ],
    sizes: ["Lisas", "Rayadas", "Cuadriculadas"],
    is_new: true,
    description: "Cuaderno A5 de 96 hojas de 90 g, tapa dura laminada mate y espiral metálico.",
  }),
  p({
    name: "Set lapiceras gel x3",
    price: 4500,
    category_id: "escolar",
    images: ["/demo/lapiceras.svg"],
    description: "Tres lapiceras de gel de trazo 0,7 mm con tinta de secado rápido.",
  }),
  p({
    name: "Plancha de stickers",
    price: 2800,
    category_id: "stickers",
    images: ["/demo/stickers.svg"],
    sizes: ["x1", "x3", "x5"],
    description: "Stickers troquelados en vinilo mate resistente al agua. Tamaño A5.",
  }),
  p({
    name: "Tarjetas personales x100",
    price: 12000,
    category_id: "tarjetas",
    images: ["/demo/tarjetas.svg"],
    description: "100 tarjetas de 9 x 5 cm impresas a color en papel ilustración de 350 g. Mandanos tu diseño o te lo armamos.",
  }),
  p({
    name: "Washi tape x3",
    price: 3600,
    category_id: "arte",
    images: ["/demo/washi.svg"],
    description: "Tres cintas decorativas de 15 mm x 10 m.",
  }),
  p({
    name: "Impresión de fotos y documentos",
    price: 300,
    category_id: "impresiones",
    images: ["/demo/impresion.svg"],
    sizes: ["A4 B/N", "A4 color", "Foto 10x15"],
    description: "Precio por unidad. Mandanos tus archivos por WhatsApp después de hacer el pedido.",
  }),
  p({
    name: "Cuaderno A4 universitario",
    price: 9900,
    category_id: "oficina",
    images: ["/demo/cuaderno-verde.svg"],
    description: "Cuaderno A4 de 120 hojas cuadriculadas con espiral.",
  }),
];

// En modo demo los pedidos viven en memoria (se borran al reiniciar el servidor).
const g = globalThis as unknown as { __fiavalDemoOrders?: Order[] };
export const demoOrders: Order[] = (g.__fiavalDemoOrders ??= []);
