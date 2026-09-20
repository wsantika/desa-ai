export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-[var(--line)] px-4 pb-28 pt-10 text-[var(--sea-ink-soft)] sm:pb-12">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
            DesaAI — Sistem Operasi Desa Cerdas Mandara
          </p>
          <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
            Pemerintah Desa Mandara, Kuta Selatan, Badung, Bali • APTIKOM Hackathon {year}
          </p>
        </div>
        <p className="island-kicker m-0 text-xs">
          Terhubung Tertutup (Closed-Loop) Warga &amp; Pemerintah Desa
        </p>
      </div>
    </footer>
  )
}
