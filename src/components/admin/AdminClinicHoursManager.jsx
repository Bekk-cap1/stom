import { useMemo, useState } from 'react'
import {
  getClinicHours,
  removeWorkingHoursOverride,
  upsertWorkingHoursOverride,
  setClinicHours,
} from '../../utils/clinicSchedule'

const normalizeTime = (value, fallback) => {
  const text = String(value || '').trim()
  if (/^\d{2}:\d{2}$/.test(text)) return text
  return fallback
}

const formatDateLabel = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value || '')
  return new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function AdminClinicHoursManager() {
  const [version, setVersion] = useState(0)
  const [overrideDate, setOverrideDate] = useState('')
  const [overrideStart, setOverrideStart] = useState('09:00')
  const [overrideEnd, setOverrideEnd] = useState('20:00')

  const { defaultStart, defaultEnd, overrides } = useMemo(() => {
    return getClinicHours()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  const sortedOverrides = useMemo(() => {
    return Object.entries(overrides || {})
      .map(([key, value]) => ({ key, start: value?.start, end: value?.end }))
      .sort((a, b) => a.key.localeCompare(b.key))
  }, [overrides])

  const handleSaveDefaults = (event) => {
    event.preventDefault()
    setClinicHours({
      defaultStart: normalizeTime(defaultStart, '09:00'),
      defaultEnd: normalizeTime(defaultEnd, '20:00'),
      overrides,
    })
    setVersion((prev) => prev + 1)
  }

  const handleAddOverride = (event) => {
    event.preventDefault()
    if (!overrideDate) return
    upsertWorkingHoursOverride({
      date: overrideDate,
      start: normalizeTime(overrideStart, '09:00'),
      end: normalizeTime(overrideEnd, '20:00'),
    })
    setOverrideDate('')
    setVersion((prev) => prev + 1)
  }

  return (
    <section id="schedule" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            jadval
          </p>
          <h3 className="mt-2 font-display text-2xl">Klinika ish vaqti</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          Default: {defaultStart}–{defaultEnd}
        </span>
      </div>

      <form onSubmit={handleSaveDefaults} className="mt-6 grid gap-4 lg:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Default boshlanish
          </label>
          <input
            type="time"
            value={defaultStart}
            onChange={(e) => {
              setClinicHours({ defaultStart: e.target.value, defaultEnd, overrides })
              setVersion((prev) => prev + 1)
            }}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Default tugash
          </label>
          <input
            type="time"
            value={defaultEnd}
            onChange={(e) => {
              setClinicHours({ defaultStart, defaultEnd: e.target.value, overrides })
              setVersion((prev) => prev + 1)
            }}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-2xl bg-[color:var(--sky)] px-5 py-3 text-sm font-semibold text-white shadow-soft"
          >
            Saqlash
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-3xl border border-white/70 bg-white/80 p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              kun bo‘yicha
            </p>
            <h4 className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
              Maxsus ish vaqti (masalan: ertaga 09:00–15:00)
            </h4>
          </div>
        </div>

        <form onSubmit={handleAddOverride} className="mt-4 grid gap-4 lg:grid-cols-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Sana
            </label>
            <input
              type="date"
              value={overrideDate}
              onChange={(e) => setOverrideDate(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Boshlanish
            </label>
            <input
              type="time"
              value={overrideStart}
              onChange={(e) => setOverrideStart(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Tugash
            </label>
            <input
              type="time"
              value={overrideEnd}
              onChange={(e) => setOverrideEnd(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[color:var(--sky)] px-5 py-3 text-sm font-semibold text-white shadow-soft"
            >
              Qo‘shish
            </button>
          </div>
        </form>

        <div className="mt-5 space-y-2">
          {sortedOverrides.length ? (
            sortedOverrides.map((item) => (
              <div
                key={item.key}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
              >
                <div>
                  <p className="font-semibold text-[color:var(--ink)]">
                    {formatDateLabel(item.key)}
                  </p>
                  <p className="text-xs text-[color:var(--muted)]">
                    {item.start}–{item.end}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    removeWorkingHoursOverride(item.key)
                    setVersion((prev) => prev + 1)
                  }}
                  className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
                >
                  O‘chirish
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-[color:var(--muted)]">
              Hozircha maxsus kunlik ish vaqti yo‘q.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default AdminClinicHoursManager

