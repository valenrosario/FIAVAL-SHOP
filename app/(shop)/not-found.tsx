import Link from "next/link";

export default function NotFound() {
  return (
    <div className="wrap" style={{ minHeight: "50vh" }}>
      <div className="ok-box">
        <h1>No encontramos esta página.</h1>
        <Link href="/productos" className="btn">
          Ver productos
        </Link>
      </div>
    </div>
  );
}
