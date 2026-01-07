import { Link } from 'react-router-dom'
import { Tooth } from '../ui/Icons'

const navLinks = [
  { label: 'О враче', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Работы', href: '#works' },
  { label: 'Видео и акции', href: '#videos' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contact' },
]

function SiteHeader() {
  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-soft ring-1 ring-white/70">
            <Tooth className="h-6 w-6 text-[color:var(--sky)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
              стоматолог
            </p>
            <p className="font-display text-lg">Чарос</p>
          </div>
        </div>
        <nav className="hidden items-center gap-7 text-sm font-medium text-[color:var(--muted)] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              className="transition hover:text-[color:var(--ink)]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="tel:+998901112233"
            className="hidden rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5 sm:inline-flex"
          >
            +998 90 111 22 33
          </a>
          {/* <Link
            to="/admin"
            className="hidden rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5 md:inline-flex"
          >
            Админ
          </Link> */}
          <a
            href="#contact"
            className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Записаться
          </a>
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
