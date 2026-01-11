import { useState } from 'react'

const initialSettings = {
  clinicName: 'Charos Karabekovna stomatologiyasi',
  address: 'Toshkent, Navoiy ko‘chasi, 12',
  phone: '+998 91 596 35 99',
  whatsapp: 'https://wa.me/998915963599',
  telegram: 'https://t.me/bekk_cap1',
  instagram: 'https://instagram.com/clinic',
  seoTitle: 'Doktor Charos — stomatologning shaxsiy sayti',
  seoDescription:
    'Stomatolog uchun zamonaviy vitrina-sayt: haqiqiy ishlar, aksiyalar va qabulga yozilish.',
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
          sozlamalar
        </p>
        <h3 className="mt-2 font-display text-2xl">Kontaktlar va SEO</h3>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
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
    </section>
  )
}

export default AdminSettingsForm
