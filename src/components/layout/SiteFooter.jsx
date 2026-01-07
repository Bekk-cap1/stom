import { Link } from 'react-router-dom'

function SiteFooter() {
  return (
    <footer className="border-t border-white/60 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 text-sm text-[color:var(--muted)]">
        <p>© 2026 Персональный сайт стоматолога Чароса</p>
        <div className="flex flex-wrap gap-4">
          <Link className="transition hover:text-[color:var(--ink)]" to="/admin">
            Админ-панель
          </Link>
          <a className="transition hover:text-[color:var(--ink)]" href="#works">
            Работы
          </a>
          <a className="transition hover:text-[color:var(--ink)]" href="#contact">
            Запись
          </a>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
