# fiaval shop

Tienda online de papelería e impresiones, pensada primero para celular.
Hecha con Next.js, guarda los datos y las fotos en Supabase y se publica en Vercel.

## Qué tiene

**Tienda**
- Inicio con banner principal editable, categorías, productos destacados y franja de impresiones.
- Página de producto con galería de fotos, colores, opciones (tamaño, tipo de hoja, etc.) y cantidad.
- Carrito que se guarda en el celular del cliente.
- Pedido por WhatsApp: el cliente completa nombre, teléfono y entrega, el pedido queda guardado y se abre WhatsApp con el detalle.
- Si apagás la tienda, los clientes ven un cartel de “volvemos pronto”.

**Panel (`/admin`)**
- Inicio: encender o apagar la tienda, pedidos nuevos y ventas del mes.
- Compras: lista de pedidos con filtros y estados (nuevo, confirmado, preparando, listo, entregado, cancelado) y botón para escribirle al cliente.
- Productos: crear, editar, ocultar y borrar, con fotos (se achican solas antes de subir), colores, opciones, stock, etiqueta “NUEVO” y destacados.
- Categorías: crear, renombrar, ordenar y borrar.
- Banner: foto, textos y botón del banner principal, y la franja de impresiones.
- Ajustes: WhatsApp donde llegan los pedidos, Instagram, barra de avisos y texto de envíos.

## Puesta en marcha (una sola vez)

1. **Supabase** (gratis): creá un proyecto en https://supabase.com.
   Abrí **SQL Editor**, pegá todo el archivo [`supabase/schema.sql`](supabase/schema.sql) y tocá **Run**.
   Eso crea las tablas, la carpeta de fotos y las categorías de inicio.
2. En Supabase andá a **Project Settings > API** y copiá la **Project URL** y la clave **service_role**.
3. **Vercel**: importá este repositorio (Add New > Project). En **Environment Variables** cargá:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD` (la contraseña para entrar al panel)
4. Deploy. Entrá a `tu-dominio/admin`, poné la contraseña y en **Ajustes** cargá tu número de WhatsApp.

La clave service_role solo vive en el servidor de Vercel; nunca llega al navegador.

## Modo demo

Si todavía no cargaste las variables de Supabase, la tienda muestra productos de ejemplo
y el panel se abre con la contraseña `demo`. En ese modo no se guardan cambios.

## Para programar

```bash
npm install
cp .env.example .env.local   # opcional, sin esto corre en modo demo
npm run dev
```
