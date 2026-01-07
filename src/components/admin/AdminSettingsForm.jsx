import { useState } from 'react'

const initialSettings = {
  clinicName: 'Стоматология Айши Салимовой',
  address: 'Ташкент, ул. Навои, 12',
  phone: '+998 90 111 22 33',
  whatsapp: 'https://wa.me/998901112233',
  telegram: 'https://t.me/clinic',
  instagram: 'https://instagram.com/clinic',
  seoTitle: 'Доктор Салимова — персональный сайт стоматолога',
  seoDescription:
    'Современный сайт-витрина стоматолога с реальными работами, акциями и записью.',
}

function AdminSettingsForm() {
  const [settings, setSettings] = useState(initialSettings)

  const handleChange = (event) => {
    const { name, value } = event.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <section id="settings" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          настройки
        </p>
        <h3 className="mt-2 font-display text-2xl">Контакты и SEO</h3>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Название клиники
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
              Адрес
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
              Телефон
            </label>
            <input
              name="phone"
              value={settings.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
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
          <div>
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
        <div className="space-y-4 lg:col-span-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              SEO Title
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
              SEO Description
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
    </section>
  )
}

export default AdminSettingsForm
