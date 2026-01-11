import { useEffect, useMemo, useState } from 'react'
import { getSiteSettings, setSiteSettings } from '../../utils/siteSettings'

const ensureLocationId = (value) => {
  const base = String(value || '').trim().toLowerCase().replace(/[^a-z0-9-]+/g, '-')
  return base || `loc-${Date.now()}`
}

function AdminSettingsForm() {
  const [settings, setSettingsState] = useState(() => getSiteSettings())
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    setSettingsState(getSiteSettings())
  }, [])

  const locations = useMemo(() => {
    return Array.isArray(settings?.locations) ? settings.locations : []
  }, [settings?.locations])

  const documents = useMemo(() => {
    return settings?.documents && typeof settings.documents === 'object' ? settings.documents : {}
  }, [settings?.documents])

  const certificates = useMemo(() => {
    return Array.isArray(documents?.certificates) ? documents.certificates : []
  }, [documents?.certificates])

  const handleChange = (event) => {
    const { name, value } = event.target
    setSettingsState((prev) => ({ ...prev, [name]: value }))
  }

  const updateDocuments = (patch) => {
    setSettingsState((prev) => {
      const nextDocuments =
        prev?.documents && typeof prev.documents === 'object' ? prev.documents : {}
      return { ...prev, documents: { ...nextDocuments, ...patch } }
    })
  }

  const updateCertificate = (index, value) => {
    updateDocuments({
      certificates: certificates.map((item, idx) => (idx === index ? value : item)),
    })
  }

  const addCertificate = () => {
    updateDocuments({ certificates: [...certificates, ''] })
  }

  const removeCertificate = (index) => {
    updateDocuments({ certificates: certificates.filter((_, idx) => idx !== index) })
  }

  const updateLocation = (id, patch) => {
    setSettingsState((prev) => {
      const list = Array.isArray(prev?.locations) ? prev.locations : []
      return {
        ...prev,
        locations: list.map((loc) => (loc.id === id ? { ...loc, ...patch } : loc)),
      }
    })
  }

  const addLocation = () => {
    setSettingsState((prev) => {
      const list = Array.isArray(prev?.locations) ? prev.locations : []
      const id = ensureLocationId(`loc-${list.length + 1}`)
      return {
        ...prev,
        locations: [
          ...list,
          {
            id,
            city: '',
            name: '',
            address: '',
            landmark: '',
            phones: [''],
            mapQuery: '',
          },
        ],
        primaryLocationId: prev?.primaryLocationId || id,
      }
    })
  }

  const removeLocation = (id) => {
    setSettingsState((prev) => {
      const list = Array.isArray(prev?.locations) ? prev.locations : []
      const nextLocations = list.filter((loc) => loc.id !== id)
      const nextPrimary =
        prev?.primaryLocationId === id ? nextLocations[0]?.id || '' : prev?.primaryLocationId
      return { ...prev, locations: nextLocations, primaryLocationId: nextPrimary }
    })
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
          Hozircha sozlamalar brauzerda saqlanadi (endpoint bo'lsa keyin API'ga ulab beramiz).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-10">
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
                value={settings.heroBadge || ''}
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
                value={settings.heroTitle || ''}
                onChange={handleChange}
                placeholder="Doktor Charos"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Bo'sh qoldirilsa shifokor ma'lumotidan olinadi.
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Subtitle (ixtiyoriy)
              </label>
              <input
                name="heroSubtitle"
                value={settings.heroSubtitle || ''}
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
                value={settings.heroDescription || ''}
                onChange={handleChange}
                rows={3}
                placeholder="Qisqacha matn..."
                className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Ijtimoiy tarmoqlar
            </p>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Klinika nomi
              </label>
              <input
                name="clinicName"
                value={settings.clinicName || ''}
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
                  value={settings.whatsapp || ''}
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
                  value={settings.telegram || ''}
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
                  value={settings.instagram || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              SEO
            </p>
            <p className="text-sm text-[color:var(--muted)]">
              Bu yerda yozilgan qiymatlar `Home` sahifadagi meta-teglarga fallback bo'ladi.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                SEO sarlavha
              </label>
              <input
                name="seoTitle"
                value={settings.seoTitle || ''}
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
                value={settings.seoDescription || ''}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                OG rasm (OpenGraph) URL
              </label>
              <input
                name="ogImageUrl"
                value={settings.ogImageUrl || ''}
                onChange={handleChange}
                placeholder="/IMG_6187.JPG"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Ijtimoiy tarmoqlarda link tashlanganda chiqadigan rasm. Eng yaxshi o'lcham: 1200×630.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Hujjatlar
            </p>
            <p className="text-sm text-[color:var(--muted)]">
              Rezyume va sertifikatlarni ko'rsatish uchun URL kiriting. Agar fayl kompyuteringizda
              bo'lsa, uni `public/docs` papkaga qo'yib, URL ni `/docs/...` ko'rinishida yozing.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Rezyume (PDF) URL
              </label>
              <input
                value={documents?.resumeUrl || ''}
                onChange={(event) => updateDocuments({ resumeUrl: event.target.value })}
                placeholder="/docs/rezume-charos-vohidova.pdf"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/70 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Sertifikatlar (URL)
                </p>
                <button
                  type="button"
                  onClick={addCertificate}
                  className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--ink)] shadow-soft"
                >
                  Qo'shish
                </button>
              </div>

              {certificates.length ? (
                <div className="mt-4 space-y-3">
                  {certificates.map((item, index) => (
                    <div
                      key={`${index}-${item}`}
                      className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/70 bg-white/80 p-3"
                    >
                      <input
                        value={item}
                        onChange={(event) => updateCertificate(index, event.target.value)}
                        placeholder="/docs/certificates/sertifikat-1.jpg"
                        className="min-w-[200px] flex-1 bg-transparent text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => removeCertificate(index)}
                        className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
                      >
                        O'chirish
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-[color:var(--muted)]">
                  Hozircha sertifikat qo'shilmagan.
                </p>
              )}
            </div>
          </div>
        </div>

        <section className="rounded-3xl border border-white/70 bg-white/70 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                lokatsiyalar
              </p>
              <h4 className="mt-2 font-display text-xl">3 ta manzil (tanlash bilan)</h4>
              <p className="mt-1 text-sm text-[color:var(--muted)]">
                Contact bo'limida foydalanuvchi lokatsiyani tanlay oladi.
              </p>
            </div>
            <button
              type="button"
              onClick={addLocation}
              className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-soft"
            >
              Lokatsiya qo‘shish
            </button>
          </div>

          {locations.length ? (
            <div className="mt-6 space-y-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Asosiy lokatsiya (header telefoni uchun)
                </label>
                <select
                  name="primaryLocationId"
                  value={settings.primaryLocationId || ''}
                  onChange={handleChange}
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm outline-none"
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {(loc.city ? `${loc.city} — ` : '') + (loc.name || loc.address || loc.id)}
                    </option>
                  ))}
                </select>
              </div>

              {locations.map((loc, index) => (
                <div
                  key={loc.id}
                  className="rounded-3xl border border-white/70 bg-white/80 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                      Lokatsiya {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeLocation(loc.id)}
                      className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
                    >
                      O‘chirish
                    </button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        Shahar
                      </label>
                      <input
                        value={loc.city || ''}
                        onChange={(e) => updateLocation(loc.id, { city: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        Nomi (klinika)
                      </label>
                      <input
                        value={loc.name || ''}
                        onChange={(e) => updateLocation(loc.id, { name: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        Manzil
                      </label>
                      <input
                        value={loc.address || ''}
                        onChange={(e) => updateLocation(loc.id, { address: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        Mo'ljal (ixtiyoriy)
                      </label>
                      <input
                        value={loc.landmark || ''}
                        onChange={(e) => updateLocation(loc.id, { landmark: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        Xarita uchun so'rov (ixtiyoriy)
                      </label>
                      <input
                        value={loc.mapQuery || ''}
                        onChange={(e) => updateLocation(loc.id, { mapQuery: e.target.value })}
                        className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                      />
                      <p className="mt-2 text-xs text-[color:var(--muted)]">
                        Bo‘sh bo‘lsa manzil avtomatik ishlatiladi.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      Telefonlar
                    </p>
                    <div className="mt-2 space-y-2">
                      {(Array.isArray(loc.phones) ? loc.phones : ['']).map((phone, phoneIndex) => (
                        <div key={`${loc.id}-phone-${phoneIndex}`} className="flex gap-2">
                          <input
                            value={phone || ''}
                            onChange={(e) => {
                              const next = Array.isArray(loc.phones) ? [...loc.phones] : []
                              next[phoneIndex] = e.target.value
                              updateLocation(loc.id, { phones: next })
                            }}
                            placeholder="+998 94 198 11 18"
                            className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const next = (Array.isArray(loc.phones) ? loc.phones : []).filter(
                                (_, idx) => idx !== phoneIndex,
                              )
                              updateLocation(loc.id, { phones: next.length ? next : [''] })
                            }}
                            className="rounded-2xl border border-white/70 bg-white/80 px-3 text-xs font-semibold text-[color:var(--muted)]"
                          >
                            –
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => {
                          const next = Array.isArray(loc.phones) ? [...loc.phones, ''] : ['']
                          updateLocation(loc.id, { phones: next })
                        }}
                        className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
                      >
                        Telefon qo‘shish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-sm text-[color:var(--muted)]">Lokatsiyalar yo‘q.</p>
          )}
        </section>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
          >
            Saqlash
          </button>
          <span className="text-sm text-[color:var(--muted)]">{status === 'saved' ? 'Saqlangan' : null}</span>
        </div>
      </form>
    </section>
  )
}

export default AdminSettingsForm
