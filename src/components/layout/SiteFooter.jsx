import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="border-t border-white/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
        <p>© 2026 Charos stomatologning shaxsiy sayti</p>
        <div className="flex flex-wrap gap-4">
          <Link className="transition hover:text-[color:var(--ink)]" to="/admin">
            Admin panel
          </Link>
          <a className="transition hover:text-[color:var(--ink)]" href="#works">
            Ishlar
          </a>
          <a className="transition hover:text-[color:var(--ink)]" href="#contact">
            Qabulga yozilish
          </a>
        </div>
      </div>
      <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-[color:var(--muted)]">
        <span>Sayt yaratildi: </span>
        <a
          className="font-semibold text-[color:var(--ink)] transition hover:text-[color:var(--sky)]"
          href="https://t.me/bekk_cap1"
          target="_blank"
          rel="noreferrer"
        >
          @bekk_cap1
        </a>
      </div>
    </footer>
  )
}

export default SiteFooter
