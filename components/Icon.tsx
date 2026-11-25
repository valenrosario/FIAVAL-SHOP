const paths: Record<string, string> = {
  menu: "M4 7h16M4 12h16M4 17h10",
  bag: "M5 8h14l-1 12H6z M9 8V6a3 3 0 016 0v2",
  search: "M11 17.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z M20 20l-4-4",
  back: "M15 5l-7 7 7 7",
  close: "M6 6l12 12M18 6L6 18",
  truck: "M3 6h11v10H3z M14 10h4l3 3v3h-7 M7 19a2 2 0 100-4 2 2 0 000 4z M17 19a2 2 0 100-4 2 2 0 000 4z",
  store: "M4 10v10h16V10 M3 10l2-6h14l2 6z M9 20v-6h6v6",
  chat: "M4 20l1.3-4A8 8 0 1112 20a8 8 0 01-4-1z",
  print: "M6 9V3h12v6 M6 18H4v-7h16v7h-2 M7 14h10v7H7z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  ig: "M7 3h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7a4 4 0 014-4z M12 16a4 4 0 100-8 4 4 0 000 8z M17.5 6.5h.01",
  trash: "M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13",
  plus: "M12 5v14M5 12h14",
};

export default function Icon({ name, size = 22, stroke = 1.9 }: { name: keyof typeof paths | string; size?: number; stroke?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  );
}
