export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="mt-20 border-t border-[var(--line)] px-4 pb-14 pt-10 text-[var(--sea-ink-soft)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <div>
          <p className="m-0 text-sm font-semibold text-[var(--sea-ink)]">
            DesaAI — AI-Powered Operating System for Smart Villages
          </p>
          <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
            Karya Tim Undiknas Denpasar • APTIKOM Hackathon {year}
          </p>
        </div>
        <p className="island-kicker m-0 text-xs">
          Built with TanStack Start & Prisma PostgreSQL
        </p>
      </div>
    </footer>
  )
}
