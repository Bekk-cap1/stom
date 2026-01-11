import { useEffect, useMemo, useRef, useState } from 'react'
import { getSiteSettings } from '../../utils/siteSettings'

const formatDayLabel = (date, index) => {
  const day = new Date(date)
  if (Number.isNaN(day.getTime())) return ''
  if (index === 0) return 'Bugun'
  if (index === 1) return 'Ertaga'
  return new Intl.DateTimeFormat('uz-UZ', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(day)
}

const formatTime = (date) => {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('uz-UZ', { hour: '2-digit', minute: '2-digit' }).format(d)
}

function HeroSection({
  stats = [],
  image,
  doctor,
  availabilityDays,
  loadingAvailability,
  loading,
}) {
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

  const doctorName = doctor?.user?.full_name || doctor?.user?.username || ''
  const heroTitle =
    siteSettings?.heroTitle?.trim() ||
    (doctorName ? `Doktor ${doctorName}` : 'Stomatologning shaxsiy sayti')
  const heroSubtitle =
    siteSettings?.heroSubtitle?.trim() || doctor?.specialization || 'haqiqiy oldin/keyin keyslar bilan'
  const heroDescription =
    siteSettings?.heroDescription?.trim() ||
    doctor?.bio ||
    "Zamonaviy yondashuv, davolash fotoprotokollari va har bir bemorga ehtiyotkor g'amxo'rlik."

  const placeholderStats = [
    { value: '-', label: "Ma'lumotlar yuklanmoqda" },
    { value: '-', label: 'Iltimos, kuting' },
    { value: '-', label: 'Statistika yangilanmoqda' },
  ]

  const statsToRender = stats.length ? stats : loading ? placeholderStats : []

  const defaultHours = useMemo(() => {
    const first = availabilityDays?.[0]
    const start = first?.defaultStart || first?.workStart || '09:00'
    const end = first?.defaultEnd || first?.workEnd || '20:00'
    return { start, end }
  }, [availabilityDays])

  const hasOverrides = useMemo(() => {
    return (availabilityDays || []).some(
      (day) =>
        Boolean(day?.isOverride) &&
        (day?.defaultStart !== day?.workStart || day?.defaultEnd !== day?.workEnd),
    )
  }, [availabilityDays])

  const [activeDayIndex, setActiveDayIndex] = useState(0)

  useEffect(() => {
    if (!availabilityDays?.length) return
    setActiveDayIndex((prev) => Math.min(prev, availabilityDays.length - 1))
  }, [availabilityDays?.length])

  const canPrev = activeDayIndex > 0
  const canNext = availabilityDays?.length ? activeDayIndex < availabilityDays.length - 1 : false

  const goPrev = () => setActiveDayIndex((prev) => Math.max(0, prev - 1))
  const goNext = () =>
    setActiveDayIndex((prev) => (availabilityDays?.length ? Math.min(prev + 1, availabilityDays.length - 1) : prev))

  const touchStartXRef = useRef(null)
  const onTouchStart = (event) => {
    const x = event.touches?.[0]?.clientX
    touchStartXRef.current = typeof x === 'number' ? x : null
  }
  const onTouchEnd = (event) => {
    const startX = touchStartXRef.current
    touchStartXRef.current = null
    if (typeof startX !== 'number') return
    const endX = event.changedTouches?.[0]?.clientX
    if (typeof endX !== 'number') return
    const delta = endX - startX
    if (Math.abs(delta) < 40) return
    if (delta < 0) goNext()
    else goPrev()
  }

  const activeDay = availabilityDays?.[activeDayIndex]
  const activeSlots = activeDay?.slots || []
  const isChanged =
    Boolean(activeDay?.isOverride) &&
    (activeDay?.defaultStart !== activeDay?.workStart || activeDay?.defaultEnd !== activeDay?.workEnd)

  return (
    <section id="home" className="relative overflow-hidden px-6 pb-16 pt-6 sm:pt-10">
      <div className="absolute right-8 top-14 hidden h-32 w-32 rounded-full bg-[color:var(--sea)]/20 blur-2xl lg:block animate-float" />
      <div className="absolute left-10 top-24 hidden h-20 w-20 rounded-full bg-[color:var(--sky)]/30 blur-xl lg:block animate-pulse-soft" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] shadow-soft">
            {siteSettings?.heroBadge?.trim() || doctorName || siteSettings?.clinicName || 'stomatologiya'}
            <span className="h-2 w-2 rounded-full bg-[color:var(--sea)] animate-pulse-soft" />
          </div>
          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {heroTitle}
            <span className="block text-[color:var(--sky)]">{heroSubtitle}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">{heroDescription}</p>
          <div className="mt-8 block flex-wrap items-center gap-4 sm:flex">
            <button className='cursor-pointer'><a
              href="#contact"
              className="cursor-help rounded-full bg-[color:var(--sky)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Konsultatsiyaga yozilish
            </a></button>
            <button className='cursor-pointer mt-10 sm:mt-0'><a
              href="#works"
              className="cursor-help rounded-full border border-white/70 bg-white/80 px-6 py-3 text-sm font-semibold text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5"
            >
              Ishlarni ko'rish
            </a></button>
          </div>
          {statsToRender.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {statsToRender.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-soft"
                >
                  <p className="font-display text-2xl">{item.value}</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[color:var(--muted)]">Charos Karabekovna</p>
              <span className="rounded-full bg-[color:var(--sea)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sea)]">
                yangilanmoqda
              </span>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100">
              <img
                src={image}
                alt="Klinika"
                className="h-full w-full object-cover sm:h-[40rem]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[color:var(--ink)]">Bo'sh vaqtlar</p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Odatdagi ish vaqti: {defaultHours.start}-{defaultHours.end}
                </p>
                {hasOverrides ? (
                  <p className="mt-1 text-xs text-[color:var(--muted)]">
                    Ba'zi kunlarda jadval o'zgargan (kartochkada ko'rsatiladi).
                  </p>
                ) : null}
              </div>

              {availabilityDays?.length ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goPrev}
                    disabled={!canPrev}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-sm font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                    aria-label="Oldingi kun"
                  >
                    <span aria-hidden="true">&lsaquo;</span>
                  </button>
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={!canNext}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-white/80 text-sm font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                    aria-label="Keyingi kun"
                  >
                    <span aria-hidden="true">&rsaquo;</span>
                  </button>
                </div>
              ) : null}
            </div>

            {availabilityDays?.length ? (
              <>
                <div className="mt-4 flex items-center justify-between gap-3 sm:hidden">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                    {formatDayLabel(activeDay?.date, activeDayIndex)}
                  </p>
                  <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-[10px] font-semibold text-[color:var(--muted)]">
                    {activeDayIndex + 1}/{availabilityDays.length}
                  </span>
                </div>

                <div className="mt-4 hidden gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:flex">
                  {availabilityDays.map((day, index) => (
                    <button
                      key={day.key || index}
                      type="button"
                      onClick={() => setActiveDayIndex(index)}
                      className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] transition ${
                        index === activeDayIndex
                          ? 'bg-[color:var(--sky)] text-white'
                          : 'border border-white/70 bg-white/80 text-[color:var(--muted)]'
                      }`}
                    >
                      {formatDayLabel(day.date, index)}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            <div
              className="mt-4 rounded-2xl border border-white/70 bg-white/70 p-4"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {activeDay ? (
                <>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {formatDayLabel(activeDay.date, activeDayIndex)}
                    </p>
                    <span className="rounded-full bg-[color:var(--sea)]/15 px-3 py-1 text-[10px] font-semibold text-[color:var(--sea)]">
                      {activeDay.workStart}-{activeDay.workEnd}
                    </span>
                  </div>

                  {isChanged ? (
                    <p className="mt-2 text-xs text-[color:var(--muted)]">
                      Jadval o'zgargan (odatda: {activeDay.defaultStart}-{activeDay.defaultEnd})
                    </p>
                  ) : null}

                  <div className="mt-3 max-h-60 space-y-2 overflow-y-auto pr-1">
                    {loadingAvailability ? (
                      <p className="text-sm text-[color:var(--muted)]">Yuklanmoqda...</p>
                    ) : activeSlots.length ? (
                      activeSlots.map((slot) => {
                        const timeLabel = formatTime(slot.start)
                        const isBusy = slot.status === 'busy'
                        const statusText = isBusy ? 'Band' : "Bo'sh"
                        const details = isBusy ? String(slot.title || 'Band').trim() : ''
                        const detailText =
                          isBusy && details && details !== 'Band' ? ` - ${details}` : ''

                        return (
                          <div
                            key={`${activeDay.key}-${timeLabel}`}
                            title={details || statusText}
                            className={`flex items-center justify-between gap-2 rounded-2xl px-3 py-2 text-xs font-semibold ${
                              isBusy
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-[color:var(--sky)]/15 text-[color:var(--sky)]'
                            }`}
                          >
                            <span className="tabular-nums">{timeLabel}</span>
                            <span className="max-w-[200px] truncate text-[10px] font-semibold uppercase tracking-[0.2em]">
                              {statusText}
                              {detailText}
                            </span>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-[color:var(--muted)]">Bo'sh vaqt yo'q</p>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-sm text-[color:var(--muted)]">Bo'sh vaqt yo'q</div>
              )}
            </div>

            <a
              href="#contact"
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
            >
              Vaqtni bron qilish
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
