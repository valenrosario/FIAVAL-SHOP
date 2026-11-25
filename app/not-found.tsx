import Link from "next/link";

export default function NotFound() {
  return (
    <main className="closed">
      <img src="/logo.png" alt="fiaval shop" />
      <h1>No encontramos esta página.</h1>
      <Link href="/" className="btn">
        Ir a la tienda
      </Link>
    </main>
  );
}
