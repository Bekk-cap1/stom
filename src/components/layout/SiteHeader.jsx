import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Tooth } from '../ui/Icons'

const navLinks = [
  { label: 'О враче', href: '#about' },
  { label: 'Услуги', href: '#services' },
  { label: 'Работы', href: '#works' },
  { label: 'Фото и акции', href: '#videos' },
  { label: 'Отзывы', href: '#reviews' },
  { label: 'Контакты', href: '#contact' },
]

function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="relative z-20">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 sm:px-6 sm:py-6">
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
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="inline-flex items-center rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5 lg:hidden"
          >
            Меню
          </button>
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

      {isOpen ? (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            id="mobile-menu"
            className="absolute right-4 top-20 w-[min(320px,calc(100vw-2rem))] rounded-3xl border border-white/70 bg-white/95 p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                навигация
              </p>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Закрыть
              </button>
            </div>
            <nav className="mt-4 space-y-2 text-sm font-semibold text-[color:var(--muted)]">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3"
                >
                  {link.label}
                  <span className="text-xs text-[color:var(--muted)]">{'>'}</span>
                </a>
              ))}
            </nav>
            <div className="mt-5 grid gap-3">
              <a
                href="tel:+998901112233"
                className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-center text-xs font-semibold text-[color:var(--muted)]"
              >
                +998 90 111 22 33
              </a>
              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="rounded-full bg-[color:var(--sky)] px-4 py-2 text-center text-xs font-semibold text-white"
              >
                Записаться
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

export default SiteHeader
