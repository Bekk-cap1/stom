import { useState } from 'react'
import { useMemo } from 'react'
import { apiFetch } from '../../api/client'
import { getDoctorBusyBlocks, getWorkingHoursForDate } from '../../utils/clinicSchedule'

const statusOptions = [
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'confirmed', label: 'Tasdiqlangan' },
  { value: 'completed', label: 'Yakunlangan' },
  { value: 'cancelled', label: 'Bekor qilingan' },
]

const SLOT_STEP_MINUTES = 30
const DEFAULT_DURATION_MINUTES = 30
const DEFAULT_LOOKAHEAD_DAYS = 7

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000)

const isOverlapping = (startA, endA, startB, endB) => startA < endB && endA > startB

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm || '').split(':')
  const hours = Number(h)
  const minutes = Number(m)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 60 + minutes
}

const toValidDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const formatDateTime = (value) => {
  const date = toValidDate(value)
  if (!date) return String(value || '')

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

function AdminAppointmentsManager({ appointments, setAppointments, doctors = [], services = [] }) {
  const [error, setError] = useState('')
  const [selectedDoctorId, setSelectedDoctorId] = useState('')
  const [durationMinutes, setDurationMinutes] = useState(DEFAULT_DURATION_MINUTES)
  const [lookaheadDays, setLookaheadDays] = useState(DEFAULT_LOOKAHEAD_DAYS)

  const handleStatusChange = async (appointment, status) => {
    setError('')
    try {
      const result = await apiFetch(`/api/appointments/${appointment.id}/`, {
        method: 'PATCH',
        body: { status },
      })
      setAppointments((prev) =>
        prev.map((item) => (item.id === appointment.id ? result : item)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const servicesById = useMemo(() => {
    return services.reduce((acc, item) => {
      if (!item?.id) return acc
      acc[item.id] = item
      return acc
    }, {})
  }, [services])

  const doctorsById = useMemo(() => {
    return doctors.reduce((acc, item) => {
      if (!item?.id) return acc
      acc[item.id] = item
      return acc
    }, {})
  }, [doctors])

  const getDoctorLabel = (value) => {
    const doctorId = value?.id ?? value
    const doctor = doctorsById[doctorId]
    if (doctor) {
      return (
        doctor.user?.full_name ||
        doctor.user?.username ||
        doctor.specialization ||
        `#${doctor.id}`
      )
    }
    return doctorId != null && doctorId !== '' ? `#${doctorId}` : '-'
  }

  const getServiceLabel = (value) => {
    const serviceId = value?.id ?? value
    const service = servicesById[serviceId]
    return service?.title || (serviceId != null && serviceId !== '' ? `#${serviceId}` : '-')
  }

  const availabilitySlots = useMemo(() => {
    const now = new Date()
    const normalizedDuration = Math.max(15, Number(durationMinutes) || DEFAULT_DURATION_MINUTES)
    const days = Math.min(31, Math.max(1, Number(lookaheadDays) || DEFAULT_LOOKAHEAD_DAYS))

    const allowedStatuses = new Set(['pending', 'confirmed'])
    const relevantAppointments = (appointments || [])
      .map((item) => {
        const start = toValidDate(item?.appointment_date)
        if (!start) return null
        if (start < now) return null
        if (!allowedStatuses.has(item?.status)) return null

        const doctorId = item?.doctor?.id ?? item?.doctor
        const serviceId = item?.service?.id ?? item?.service
        const serviceDuration = Number(servicesById[serviceId]?.duration_minutes) || 0
        const duration = serviceDuration > 0 ? serviceDuration : DEFAULT_DURATION_MINUTES
        const end = addMinutes(start, duration)

        return {
          id: item?.id,
          doctorId: doctorId != null ? String(doctorId) : '',
          start,
          end,
        }
      })
      .filter(Boolean)

    const selected = selectedDoctorId ? String(selectedDoctorId) : ''
    const busyAppointments = selected
      ? relevantAppointments.filter((item) => item.doctorId === selected)
      : relevantAppointments

    const busyBlocks = getDoctorBusyBlocks()
      .map((item) => {
        const blockDoctorId = item?.doctorId != null ? String(item.doctorId) : ''
        if (selected && blockDoctorId !== selected) return null
        const start = toValidDate(item?.startISO)
        const end = toValidDate(item?.endISO)
        if (!start || !end || end <= start) return null
        return { start, end }
      })
      .filter(Boolean)

    const busy = [...busyAppointments, ...busyBlocks]

    const slots = []
    for (let dayIndex = 0; dayIndex < days; dayIndex += 1) {
      const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayIndex)
      const { start: startHHMM, end: endHHMM } = getWorkingHoursForDate(dayStart)
      const startMinutes = toMinutes(startHHMM)
      const endMinutes = toMinutes(endHHMM)
      if (startMinutes == null || endMinutes == null || endMinutes <= startMinutes) continue

      const dayBase = new Date(
        dayStart.getFullYear(),
        dayStart.getMonth(),
        dayStart.getDate(),
        0,
        0,
        0,
        0,
      )
      const workStart = addMinutes(dayBase, startMinutes)
      const workEnd = addMinutes(dayBase, endMinutes)

      for (
        let slotStart = workStart;
        addMinutes(slotStart, normalizedDuration) <= workEnd;
        slotStart = addMinutes(slotStart, SLOT_STEP_MINUTES)
      ) {
        if (slotStart < now) continue
        const slotEnd = addMinutes(slotStart, normalizedDuration)
        const intersects = busy.some((busyItem) =>
          isOverlapping(slotStart, slotEnd, busyItem.start, busyItem.end),
        )
        if (!intersects) {
          slots.push({ start: slotStart, end: slotEnd })
        }
      }
    }

    return slots.slice(0, 24)
  }, [appointments, durationMinutes, lookaheadDays, selectedDoctorId, servicesById])

  return (
    <section
      id="appointments"
      className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            qabullar
          </p>
          <h3 className="mt-2 font-display text-2xl">Onlayn qabul yozuvlari</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {appointments.length} so‘rov
        </span>
      </div>

      <div className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              bo‘sh vaqtlar
            </p>
            <h4 className="mt-2 text-lg font-semibold text-[color:var(--ink)]">
              Shifokor qachon bo‘sh?
            </h4>
          </div>
          <p className="text-xs text-[color:var(--muted)]">
            Band deb hisoblanadi: “Kutilmoqda” va “Tasdiqlangan”
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Shifokor
            </label>
            <select
              value={selectedDoctorId}
              onChange={(event) => setSelectedDoctorId(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              <option value="">Barchasi</option>
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
              Davomiylik (daq)
            </label>
            <select
              value={String(durationMinutes)}
              onChange={(event) => setDurationMinutes(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              {[30, 45, 60, 90].map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Qancha kunga (kun)
            </label>
            <select
              value={String(lookaheadDays)}
              onChange={(event) => setLookaheadDays(Number(event.target.value))}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              {[3, 7, 14, 21, 30].map((value) => (
                <option key={value} value={String(value)}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {availabilitySlots.length ? (
            availabilitySlots.map((slot) => (
              <span
                key={slot.start.toISOString()}
                className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                {formatDateTime(slot.start)}
              </span>
            ))
          ) : (
            <p className="text-sm text-[color:var(--muted)]">Bo‘sh vaqt topilmadi.</p>
          )}
        </div>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {appointments.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">
                Qabul #{item.id}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                Shifokor: {getDoctorLabel(item.doctor)} · Xizmat: {getServiceLabel(item.service)}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                {formatDateTime(item.appointment_date)}
              </p>
              {item.notes ? (
                <p className="text-xs text-[color:var(--muted)]">{item.notes}</p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.status}
                onChange={(event) => handleStatusChange(item, event.target.value)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                {statusOptions.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminAppointmentsManager
