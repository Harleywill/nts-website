/**
 * Floating contact-info cards — phone, email, address.
 * Designed to overlap the bottom edge of the hero by ~56px via negative
 * margin (the parent page sets the offset). Engineering watermark shows
 * between/behind them on the gap below.
 */
export default function ContactInfoCards() {
  const cards: Array<{
    icon: React.ReactNode;
    label: string;
    value: string;
    sub: string;
    href: string;
  }> = [
    {
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4caf50"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      label: "Phone",
      value: "01482 838080",
      sub: "Mon–Fri · 8am–5pm",
      href: "tel:01482838080",
    },
    {
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4caf50"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      label: "Email",
      value: "info@ntsltd.com",
      sub: "Replies within 24 hours",
      href: "mailto:info@ntsltd.com",
    },
    {
      icon: (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#4caf50"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      label: "Visit",
      value: "Unit F2 Rotterdam Park",
      sub: "Sutton Fields, Hull HU7 0AN",
      href: "https://maps.google.com/?q=Sutton+Fields+Hull+HU7+0AN",
    },
  ];

  return (
    <div className="relative z-20 mx-auto -mt-14 grid max-w-6xl grid-cols-1 gap-5 px-6 sm:grid-cols-3 lg:px-8">
      {cards.map((c) => (
        <a
          key={c.label}
          href={c.href}
          target={c.href.startsWith("http") ? "_blank" : undefined}
          rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
          className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-white p-6 shadow-[0_10px_40px_rgba(13,21,48,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_50px_rgba(13,21,48,0.16)]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#4caf50]/10">
            {c.icon}
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-gray-500">
              {c.label}
            </div>
            <div className="mt-1 text-base font-bold text-[#1a2f6e]">
              {c.value}
            </div>
            <div className="mt-0.5 text-xs text-gray-500">{c.sub}</div>
          </div>
        </a>
      ))}
    </div>
  );
}
