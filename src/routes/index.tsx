import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: DesaAIHome })

function DesaAIHome() {
  return (
    <main className="page-wrap px-4 pb-16 pt-10">
      {/* HERO SECTION */}
      <section className="island-shell rise-in relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-12 sm:py-16">
        <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(79,184,178,0.25),transparent_70%)]" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(47,106,74,0.18),transparent_70%)]" />

        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <span>🏆 APTIKOM Hackathon 2026</span>
          <span>•</span>
          <span>Smart Village Technology</span>
        </div>

        <h1 className="display-title mb-4 mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
          Transformasi Pelayanan Desa Cerdas Berbasis AI Terpadu
        </h1>
        <p className="mb-8 max-w-2xl text-base leading-relaxed text-[var(--sea-ink-soft)] sm:text-lg">
          <strong>DesaAI</strong> menghubungkan masyarakat dengan pemerintah desa
          dalam satu sistem kerja tertutup (*closed-loop*): konsultasi AI berbasis
          SOP resmi, pengajuan surat mandiri, dan pengaduan cerdas dengan
          otomatisasi prioritas.
        </p>

        <div className="flex flex-wrap gap-3">
          <div className="rounded-full border border-emerald-600/30 bg-emerald-600/10 px-5 py-2.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            Citizen Platform & Government Dashboard
          </div>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <article className="island-shell feature-card rise-in rounded-2xl p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-xl text-blue-600 dark:text-blue-400">
            🤖
          </div>
          <h2 className="mb-2 text-lg font-bold text-[var(--sea-ink)]">
            AI Village Assistant (RAG)
          </h2>
          <p className="m-0 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
            Warga bertanya persyaratan surat dan jam pelayanan dengan bahasa
            alami. Jawaban divalidasi langsung dari dokumen SOP & Perdes resmi
            desa tanpa halusinasi.
          </p>
        </article>

        <article className="island-shell feature-card rise-in rounded-2xl p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-xl text-emerald-600 dark:text-emerald-400">
            📝
          </div>
          <h2 className="mb-2 text-lg font-bold text-[var(--sea-ink)]">
            Digital Service Request
          </h2>
          <p className="m-0 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
            Pengajuan Surat Domisili, SKU, Pengantar SKCK, dan SKTM secara
            online dengan upload berkas mandiri serta pelacakan nomor tiket
            transparan.
          </p>
        </article>

        <article className="island-shell feature-card rise-in rounded-2xl p-6">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-xl text-rose-600 dark:text-rose-400">
            🚨
          </div>
          <h2 className="mb-2 text-lg font-bold text-[var(--sea-ink)]">
            AI Complaint Intelligence
          </h2>
          <p className="m-0 text-sm leading-relaxed text-[var(--sea-ink-soft)]">
            Laporan kerusakan fasilitas warga otomatis dianalisis kategori dan
            urgensi prioritasnya (Emergency, High, Medium, Low) untuk mempermudah
            triage staf desa.
          </p>
        </article>
      </section>

      {/* CLOSED LOOP WORKFLOW */}
      <section className="island-shell mt-10 rounded-2xl p-6 sm:p-8">
        <p className="island-kicker mb-2">Alur Kerja Sistem</p>
        <h3 className="mb-6 text-xl font-bold text-[var(--sea-ink)]">
          Citizen-to-Government Closed Loop Workflow
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--header-bg)] p-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Langkah 1
            </span>
            <h4 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">
              Input Mandiri Warga
            </h4>
            <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
              Warga bertanya atau mengajukan permohonan surat & pengaduan via
              Web/PWA.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--header-bg)] p-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Langkah 2
            </span>
            <h4 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">
              Evaluasi Cerdas AI
            </h4>
            <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
              Model mengekstrak lokasi, kategori, level urgensi, dan membuat
              ringkasan eksekutif.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--header-bg)] p-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Langkah 3
            </span>
            <h4 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">
              Triage Perangkat Desa
            </h4>
            <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
              Petugas memverifikasi berkas atau mendisposisikan laporan darurat
              ke lapangan.
            </p>
          </div>
          <div className="rounded-xl border border-[var(--line)] bg-[var(--header-bg)] p-4">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Langkah 4
            </span>
            <h4 className="mb-1 text-sm font-semibold text-[var(--sea-ink)]">
              Status Real-Time
            </h4>
            <p className="m-0 text-xs text-[var(--sea-ink-soft)]">
              Status ter-update transparan ke warga lengkap dengan catatan
              petugas.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
