import { useEffect, useMemo, useState } from 'react'
import { getSiteSettings } from '../../utils/siteSettings'

const isLikelyImageUrl = (value) => /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(String(value || ''))
const isLikelyPdfUrl = (value) => /\.pdf(\?.*)?$/i.test(String(value || ''))

const getFileLabel = (value) => {
  const url = String(value || '').trim()
  if (!url) return 'Hujjat'
  const sanitized = url.split('#')[0].split('?')[0]
  const parts = sanitized.split('/').filter(Boolean)
  return parts[parts.length - 1] || 'Hujjat'
}

function DocumentsSection() {
  const [settings, setSettings] = useState(() => getSiteSettings())

  useEffect(() => {
    const sync = () => setSettings(getSiteSettings())
    window.addEventListener('stom:settings', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('stom:settings', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const documents = useMemo(() => {
    return settings?.documents && typeof settings.documents === 'object' ? settings.documents : {}
  }, [settings?.documents])

  const resumeUrl = String(documents?.resumeUrl || '').trim()
  const certificates = Array.isArray(documents?.certificates) ? documents.certificates : []

  if (!resumeUrl && !certificates.length) return null

  const resumeIsPdf = isLikelyPdfUrl(resumeUrl)

  return (
    <section id="documents" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              hujjatlar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">Rezyume va sertifikatlar</h2>
            <p className="mt-4 text-base text-[color:var(--muted)]">
              Shifokorning tajribasi va malakasini tasdiqlovchi hujjatlar. Istasangiz PDF rezyumeni
              yuklab olib ko'rishingiz mumkin.
            </p>
          </div>

          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-[color:var(--sky)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Rezyumeni ochish
            </a>
          ) : null}
        </div>

        {resumeUrl ? (
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-soft">
              {resumeIsPdf ? (
                <div className="relative aspect-[4/3] bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                  <iframe
                    title="Rezyume (PDF)"
                    src={`${resumeUrl}#page=1&view=FitH`}
                    loading="lazy"
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-6 text-center text-sm font-semibold text-[color:var(--ink)]">
                  {getFileLabel(resumeUrl)}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
              <p className="text-sm font-semibold text-[color:var(--ink)]">Rezyume</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{getFileLabel(resumeUrl)}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/80 px-5 py-2 text-xs font-semibold text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5"
                >
                  Ochish
                </a>
                <a
                  href={resumeUrl}
                  download
                  className="inline-flex items-center justify-center rounded-full bg-[color:var(--sky)] px-5 py-2 text-xs font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
                >
                  Yuklab olish
                </a>
              </div>
              <p className="mt-4 text-xs text-[color:var(--muted)]">
                PDF bo'lsa birinchi sahifa preview ko'rinadi.
              </p>
            </div>
          </div>
        ) : null}

        {certificates.length ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((item, index) => {
              const url = String(item || '').trim()
              if (!url) return null
              const label = getFileLabel(url)
              const isImage = isLikelyImageUrl(url)
              const isPdf = isLikelyPdfUrl(url)
              return (
                <a
                  key={`${index}-${url}`}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-soft transition hover:-translate-y-1"
                >
                  {isImage ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                      <img
                        src={url}
                        alt="Sertifikat"
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  ) : isPdf ? (
                    <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                      <iframe
                        title="Sertifikat (PDF)"
                        src={`${url}#page=1&view=FitH`}
                        loading="lazy"
                        className="h-full w-full"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-6 text-center text-sm font-semibold text-[color:var(--ink)]">
                      {label}
                    </div>
                  )}
                  <div className="p-5">
                    <p className="text-sm font-semibold text-[color:var(--ink)]">
                      {isImage || isPdf ? 'Sertifikat' : 'Hujjat'}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">{label}</p>
                  </div>
                </a>
              )
            })}
          </div>
        ) : (
          <p className="mt-8 text-sm text-[color:var(--muted)]">Sertifikatlar hozircha qo'shilmagan.</p>
        )}
      </div>
    </section>
  )
}

export default DocumentsSection
