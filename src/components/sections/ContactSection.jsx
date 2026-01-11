import { useMemo, useState } from 'react'
import { apiFetch } from '../../api/client'
import { sendTelegramLead } from '../../utils/telegram'
import { formatUzPhone, isValidUzPhone, normalizeUzPhone } from '../../utils/phone'
import { getPrimaryLocation, getSiteSettings } from '../../utils/siteSettings'

const initialForm = {
  name: '',
  phone: '',
  message: '',
}

function ContactSection() {
  const siteSettings = getSiteSettings()
  const locations = Array.isArray(siteSettings?.locations) ? siteSettings.locations : []
  const defaultLocation = getPrimaryLocation(siteSettings)

  const [activeLocationId, setActiveLocationId] = useState(
    defaultLocation?.id || locations[0]?.id || '',
  )

  const activeLocation = useMemo(() => {
    return (
      locations.find((loc) => loc.id === activeLocationId) ||
      defaultLocation ||
      locations[0] ||
      null
    )
  }, [activeLocationId, defaultLocation, locations])

  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    if (name === 'phone') {
      setForm((prev) => ({ ...prev, phone: formatUzPhone(value) }))
      return
    }
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.name.trim() || !form.phone.trim()) {
      setError("Bog'lanish uchun ism va telefonni kiriting")
      return
    }

    if (!isValidUzPhone(form.phone)) {
      setError("Telefon raqamni to'g'ri kiriting: +998 94 100 20 30")
      return
    }

    setStatus('sending')
    try {
      const phoneNormalized = normalizeUzPhone(form.phone)
      const phoneDisplay = formatUzPhone(form.phone).trim()

      const payload = {
        name: form.name.trim(),
        phone: phoneNormalized || phoneDisplay,
        message: form.message.trim(),
      }

      await apiFetch('/api/contact-requests/', {
        method: 'POST',
        auth: false,
        body: payload,
      })

      try {
        const sourceUrl = typeof window !== 'undefined' ? window.location.href : ''
        await sendTelegramLead({ ...payload, phone: phoneDisplay || payload.phone, sourceUrl })
      } catch {
        // Telegram xabari yuborilmasa ham so'rov saqlanadi
      }

      setStatus('success')
      setForm(initialForm)
    } catch (err) {
      setError(err.message)
      setStatus('idle')
    }
  }

  const whatsappUrl = siteSettings?.whatsapp || 'https://wa.me/998915963599'
  const telegramUrl = siteSettings?.telegram || 'https://t.me/bekk_cap1'

  const phonesToShow = useMemo(() => {
    const list = activeLocation?.phones?.length ? activeLocation.phones : []
    if (list.length) return list
    return siteSettings?.phone ? [siteSettings.phone] : []
  }, [activeLocation?.phones, siteSettings?.phone])

  const mapQuery =
    activeLocation?.mapQuery || activeLocation?.address || siteSettings?.address || 'Uzbekistan'

  return (
    <section id="contact" className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              kontaktlar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              O'zingizga qulay usulda yoziling
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={whatsappUrl}
              className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              href={telegramUrl}
              className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form
            className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft"
            onSubmit={handleSubmit}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Ism
                </label>
                <input
                  type="text"
                  placeholder="Ismingiz"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Telefon
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  placeholder="+998 94 100 20 30"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  onFocus={() => {
                    if (!form.phone) setForm((prev) => ({ ...prev, phone: '+998 ' }))
                  }}
                  autoComplete="tel"
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Shikoyat / xabar
              </label>
              <textarea
                rows="4"
                placeholder="Nima bezovta qilyapti? (yoki qulay vaqtni yozing)"
                name="message"
                value={form.message}
                onChange={handleChange}
                className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--sky)] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 disabled:opacity-70"
            >
              {status === 'sending' ? 'Yuborilmoqda...' : "So'rov yuborish"}
            </button>

            {error ? <p className="mt-3 text-xs text-red-500">{error}</p> : null}
            {status === 'success' ? (
              <p className="mt-3 text-xs text-[color:var(--muted)]">
                So'rov yuborildi. Tez orada siz bilan bog'lanamiz.
              </p>
            ) : null}
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              Tugmani bosish orqali shaxsiy ma'lumotlaringizni qayta ishlashga rozilik bildirasiz.
            </p>
          </form>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            {locations.length > 1 ? (
              <div className="flex flex-wrap gap-2">
                {locations.map((loc) => (
                  <button
                    key={loc.id}
                    type="button"
                    onClick={() => setActiveLocationId(loc.id)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                      loc.id === activeLocationId
                        ? 'bg-[color:var(--sky)] text-white'
                        : 'border border-white/70 bg-white/80 text-[color:var(--muted)]'
                    }`}
                  >
                    {loc.city ? `${loc.city}: ` : ''}
                    {loc.name || loc.address || 'Lokatsiya'}
                  </button>
                ))}
              </div>
            ) : null}

            <div className="mt-4 space-y-4 text-sm text-[color:var(--muted)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Manzil</p>
                <p className="mt-2 text-base text-[color:var(--ink)]">
                  {activeLocation?.city ? `${activeLocation.city}, ` : ''}
                  {activeLocation?.address || siteSettings?.address || ''}
                </p>
                {activeLocation?.landmark ? (
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    {activeLocation.landmark}
                  </p>
                ) : null}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Telefon</p>
                <div className="mt-2 space-y-1">
                  {phonesToShow.map((phone) => {
                    const formatted = formatUzPhone(phone).trim()
                    const normalized = normalizeUzPhone(phone)
                    const digits = normalized
                      ? normalized.replace(/\D/g, '')
                      : String(phone).replace(/\D/g, '')
                    const href = digits ? `tel:+${digits}` : '#'
                    return (
                      <a
                        key={`${activeLocation?.id || 'main'}-${phone}`}
                        href={href}
                        className="block text-base font-semibold text-[color:var(--ink)]"
                      >
                        {formatted}
                      </a>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Ish vaqti</p>
                <p className="mt-2 text-base text-[color:var(--ink)]">
                  Dush-Shan: 09:00-20:00
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl">
              <iframe
                title="Klinika xaritasi"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(
                  mapQuery,
                )}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                className="h-48 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection

