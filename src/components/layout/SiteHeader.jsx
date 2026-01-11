import { useEffect, useMemo, useState } from 'react'
import { Instagram, Telegram, Tooth } from '../ui/Icons'
import { getSiteSettings } from '../../utils/siteSettings'

const navLinks = [
  { label: 'Shifokor haqida', href: '#about' },
  { label: 'Xizmatlar', href: '#services' },
  { label: 'Ishlar', href: '#works' },
  { label: 'Foto va aksiyalar', href: '#videos' },
  { label: 'Fikrlar', href: '#reviews' },
  { label: 'Kontaktlar', href: '#contact' },
]

function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)
  const [siteSettings, setSiteSettings] = useState(() => getSiteSettings())

  useEffect(() => {
    const syncSettings = () => setSiteSettings(getSiteSettings())
    window.addEventListener('stom:settings', syncSettings)
    window.addEventListener('storage', syncSettings)
    return () => {
      window.removeEventListener('stom:settings', syncSettings)
      window.removeEventListener('storage', syncSettings)
    }
  }, [])

  useEffect(() => {
    if (typeof document === 'undefined') return
    const previous = document.body.style.overflow
    if (isOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const telegramUrl =
    siteSettings?.telegram || import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/bekk_cap1'
  const instagramUrl =
    siteSettings?.instagram ||
    import.meta.env.VITE_INSTAGRAM_URL ||
    'https://instagram.com/clinic'

  const phoneDisplay = siteSettings?.phone || '+998 91 596 35 99'
  const phoneHref = useMemo(() => {
    const digits = String(phoneDisplay || '').replace(/\D/g, '')
    return digits ? `tel:+${digits}` : 'tel:+998915963599'
  }, [phoneDisplay])

  const brandName = siteSettings?.clinicName || 'Charos'

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 shadow-soft ring-1 ring-white/70">
              <Tooth className="h-6 w-6 text-[color:var(--sky)]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted)]">
                stomatolog
              </p>
              <p className="max-w-[140px] truncate font-display text-base sm:max-w-none sm:text-lg">
                {brandName}
              </p>
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

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <a
                href={telegramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Telegram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5 hover:text-[color:var(--ink)]"
              >
                <Telegram className="h-4 w-4" />
              </a>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5 hover:text-[color:var(--ink)]"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="inline-flex items-center whitespace-nowrap rounded-full border border-white/70 bg-white/80 px-3 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5 lg:hidden"
            >
              Menyu
            </button>

            <a
              href={phoneHref}
              className="hidden whitespace-nowrap rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-medium text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5 sm:inline-flex"
            >
              {phoneDisplay}
            </a>

            <a
              href="#contact"
              className="whitespace-nowrap rounded-full bg-[color:var(--sky)] px-4 py-2 text-xs font-semibold text-white shadow-soft transition hover:-translate-y-0.5 sm:px-5 sm:text-sm"
            >
              <span className="sm:hidden">Yozilish</span>
              <span className="hidden sm:inline">Qabulga yozilish</span>
            </a>
          </div>
        </div>
      </header>

      {isOpen ? (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px] lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            className="mx-auto mt-20 w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex max-h-[calc(100vh-6rem)] flex-col">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    navigatsiya
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
                  >
                    Yopish
                  </button>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto px-6 pb-4 text-sm font-semibold text-[color:var(--muted)]">
                <div className="space-y-2">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 py-3"
                    >
                      {link.label}
                      <span className="text-xs text-[color:var(--muted)]">{'›'}</span>
                    </a>
                  ))}
                </div>
              </nav>

              <div className="border-t border-white/70 bg-white/90 p-6">
                <div className="grid gap-3">
                  <a
                    href={phoneHref}
                    className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-center text-xs font-semibold text-[color:var(--muted)]"
                  >
                    {phoneDisplay}
                  </a>
                  <div className="flex items-center justify-center gap-2">
                    <a
                      href={telegramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Telegram"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[color:var(--muted)]"
                    >
                      <Telegram className="h-5 w-5" />
                    </a>
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Instagram"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/70 bg-white/80 text-[color:var(--muted)]"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  </div>
                  <a
                    href="#contact"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-[color:var(--sky)] px-4 py-2 text-center text-xs font-semibold text-white"
                  >
                    Qabulga yozilish
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}

export default SiteHeader

