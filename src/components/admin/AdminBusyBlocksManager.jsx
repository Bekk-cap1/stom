import { useMemo, useState } from 'react'
import {
  addDoctorBusyBlock,
  getDoctorBusyBlocks,
  removeDoctorBusyBlock,
} from '../../utils/clinicSchedule'

const toISOForLocalDateTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return ''
  const [hh, mm] = String(timeStr).split(':')
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  date.setHours(Number(hh) || 0, Number(mm) || 0, 0, 0)
  return date.toISOString()
}

const formatDateTime = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value || '')
  const datePart = new Intl.DateTimeFormat('uz-UZ', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat('uz-UZ', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
  return `${datePart} ${timePart}`
}

function AdminBusyBlocksManager({ doctors = [] }) {
  const [version, setVersion] = useState(0)
  const [doctorId, setDoctorId] = useState('')
  const [date, setDate] = useState('')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [title, setTitle] = useState('')

  const doctorsById = useMemo(() => {
    return doctors.reduce((acc, item) => {
      if (!item?.id) return acc
      acc[String(item.id)] = item
      return acc
    }, {})
  }, [doctors])

  const blocks = useMemo(() => {
    return getDoctorBusyBlocks()
      .slice()
      .sort((a, b) => String(a.startISO).localeCompare(String(b.startISO)))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [version])

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!doctorId || !date) return
    const startISO = toISOForLocalDateTime(date, startTime)
    const endISO = toISOForLocalDateTime(date, endTime)
    if (!startISO || !endISO) return

    addDoctorBusyBlock({
      doctorId,
      startISO,
      endISO,
      title: title.trim(),
    })

    setTitle('')
    setVersion((prev) => prev + 1)
  }

  const getDoctorLabel = (id) => {
    const doctor = doctorsById[String(id)]
    if (!doctor) return `#${id}`
    return doctor.user?.full_name || doctor.user?.username || doctor.specialization || `#${doctor.id}`
  }

  return (
    <section id="busy" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            band vaqt
          </p>
          <h3 className="mt-2 font-display text-2xl">Shifokor nimani qilmoqda?</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {blocks.length} blok
        </span>
      </div>

      <p className="mt-3 text-xs text-[color:var(--muted)]">
        Bu bloklar lokal (brauzer) saqlanadi va shifokor band bo‘lgan vaqtni belgilaydi (masalan:
        “Operatsiya”, “Majlis”, “Tushlik”).
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Shifokor
          </label>
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
          >
            <option value="">Tanlang</option>
            {doctors.map((doctor) => {
              const label =
                doctor?.user?.full_name ||
                doctor?.user?.username ||
                (doctor?.id ? `#${doctor.id}` : '')
              const specialization = doctor?.specialization ? ` — ${doctor.specialization}` : ''
              return (
                <option key={doctor.id} value={doctor?.id ? String(doctor.id) : ''}>
                  {label}
                  {specialization}
                </option>
              )
            })}
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Sana
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Boshlanish
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Tugash
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
          />
        </div>
        <div className="lg:col-span-4">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Nima qilyapti (ixtiyoriy)
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Masalan: Operatsiya"
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

      <div className="mt-6 space-y-3">
        {blocks.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">
                {getDoctorLabel(item.doctorId)}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                {formatDateTime(item.startISO)} – {formatDateTime(item.endISO)}
              </p>
              {item.title ? (
                <p className="text-xs text-[color:var(--muted)]">{item.title}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => {
                removeDoctorBusyBlock(item.id)
                setVersion((prev) => prev + 1)
              }}
              className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
            >
              O‘chirish
            </button>
          </div>
        ))}
        {!blocks.length ? (
          <p className="text-sm text-[color:var(--muted)]">Hozircha bloklar yo‘q.</p>
        ) : null}
      </div>
    </section>
  )
}

export default AdminBusyBlocksManager

