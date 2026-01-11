import { useEffect, useState } from 'react'
import { getSiteSettings, setSiteSettings } from '../../utils/siteSettings'

function AdminSettingsForm() {
  const [settings, setSettingsState] = useState(() => getSiteSettings())
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    setSettingsState(getSiteSettings())
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setSettingsState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setSiteSettings(settings)
    setStatus('saved')
    window.setTimeout(() => setStatus('idle'), 1200)
  }

  return (
    <section id="settings" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          sozlamalar
        </p>
        <h3 className="mt-2 font-display text-2xl">Bosh sahifa va kontaktlar</h3>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Sozlamalar brauzerda saqlanadi (endpoint bo‘lsa keyin API’ga ulab beramiz).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Bosh sahifa (Hero)
            </p>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Badge (yuqoridagi kichik yozuv)
              </label>
              <input
                name="heroBadge"
                value={settings.heroBadge}
                onChange={handleChange}
                placeholder="Charos Karabekovna"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Sarlavha (ixtiyoriy)
              </label>
              <input
                name="heroTitle"
                value={settings.heroTitle}
                onChange={handleChange}
                placeholder="Doktor Charos"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Bo‘sh qoldirilsa shifokor ma’lumotidan olinadi.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Subtitle (ixtiyoriy)
              </label>
              <input
                name="heroSubtitle"
                value={settings.heroSubtitle}
                onChange={handleChange}
                placeholder="Stomatologiya"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Tavsif (ixtiyoriy)
              </label>
              <textarea
                name="heroDescription"
                value={settings.heroDescription}
                onChange={handleChange}
                rows="3"
                placeholder="Qisqacha matn..."
                className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Kontaktlar
            </p>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Klinika nomi
              </label>
              <input
                name="clinicName"
                value={settings.clinicName}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Manzil
              </label>
              <input
                name="address"
                value={settings.address}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Telefon
              </label>
              <input
                name="phone"
                value={settings.phone}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  WhatsApp
                </label>
                <input
                  name="whatsapp"
                  value={settings.whatsapp}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Telegram
                </label>
                <input
                  name="telegram"
                  value={settings.telegram}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Instagram
                </label>
                <input
                  name="instagram"
                  value={settings.instagram}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">SEO</p>
            <p className="text-sm text-[color:var(--muted)]">
              Bu yerda yozilgan qiymatlar Home’dagi meta-teglarga fallback bo‘ladi.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                SEO sarlavha
              </label>
              <input
                name="seoTitle"
                value={settings.seoTitle}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                SEO tavsif
              </label>
              <textarea
                name="seoDescription"
                value={settings.seoDescription}
                onChange={handleChange}
                rows="3"
                className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
          >
            Saqlash
          </button>
          <span className="text-sm text-[color:var(--muted)]">
            {status === 'saved' ? 'Saqlangan' : null}
          </span>
        </div>
      </form>
    </section>
  )
}

export default AdminSettingsForm
