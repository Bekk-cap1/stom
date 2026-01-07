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
      <div className="mx-auto mt-4 flex max-w-6xl flex-wrap items-center justify-between gap-2 text-xs text-[color:var(--muted)]">
        <span>Сайт создан: </span>
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
