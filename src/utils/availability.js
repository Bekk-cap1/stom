import { getDoctorBusyBlocks, getWorkingHoursForDate } from './clinicSchedule'

const toValidDate = (value) => {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null
  return date
}

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm || '').split(':')
  const hours = Number(h)
  const minutes = Number(m)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 60 + minutes
}

const addMinutes = (date, minutes) => new Date(date.getTime() + minutes * 60 * 1000)

const isOverlapping = (startA, endA, startB, endB) => startA < endB && endA > startB

const toDayStart = (date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)

const formatDayKey = (date) => {
  const d = toDayStart(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const computeAvailability = ({
  doctorId,
  appointments = [],
  servicesById = {},
  durationMinutes = 30,
  stepMinutes = 30,
  days = 7,
  includeBusyBlocks = true,
} = {}) => {
  const now = new Date()
  const selectedDoctor = doctorId != null ? String(doctorId) : ''
  const normalizedDuration = Math.max(15, Number(durationMinutes) || 30)
  const normalizedStep = Math.max(5, Number(stepMinutes) || 30)
  const lookaheadDays = Math.min(31, Math.max(1, Number(days) || 7))

  const allowedStatuses = new Set(['pending', 'confirmed'])

  const busyFromAppointments = (appointments || [])
    .map((item) => {
      const start = toValidDate(item?.appointment_date)
      if (!start) return null
      const appointmentDoctorId = item?.doctor?.id ?? item?.doctor
      if (selectedDoctor && String(appointmentDoctorId) !== selectedDoctor) return null
      if (!allowedStatuses.has(item?.status)) return null

      const serviceId = item?.service?.id ?? item?.service
      const durationFromService = Number(servicesById?.[serviceId]?.duration_minutes) || 0
      const duration = durationFromService > 0 ? durationFromService : 30
      const end = addMinutes(start, duration)
      return { start, end, title: servicesById?.[serviceId]?.title || 'Qabul' }
    })
    .filter(Boolean)

  const busyBlocks = includeBusyBlocks ? getDoctorBusyBlocks() : []
  const busyFromBlocks = (busyBlocks || [])
    .map((item) => {
      if (selectedDoctor && String(item?.doctorId) !== selectedDoctor) return null
      const start = toValidDate(item?.startISO)
      const end = toValidDate(item?.endISO)
      if (!start || !end || end <= start) return null
      return { start, end, title: item?.title || 'Band' }
    })
    .filter(Boolean)

  const busy = [...busyFromAppointments, ...busyFromBlocks]

  const daysOut = []
  for (let dayIndex = 0; dayIndex < lookaheadDays; dayIndex += 1) {
    const dayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + dayIndex)
    const {
      start: startHHMM,
      end: endHHMM,
      key,
      defaultStart,
      defaultEnd,
      isOverride,
    } = getWorkingHoursForDate(dayDate)

    const startMinutes = toMinutes(startHHMM)
    const endMinutes = toMinutes(endHHMM)
    if (startMinutes == null || endMinutes == null || endMinutes <= startMinutes) {
      daysOut.push({ key: key || formatDayKey(dayDate), date: dayDate, workStart: startHHMM, workEnd: endHHMM, slots: [] })
      continue
    }

    const workStart = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), 0, 0, 0, 0)
    const windowStart = addMinutes(workStart, startMinutes)
    const windowEnd = addMinutes(workStart, endMinutes)

    const slots = []
    for (
      let slotStart = windowStart;
      addMinutes(slotStart, normalizedDuration) <= windowEnd;
      slotStart = addMinutes(slotStart, normalizedStep)
    ) {
      if (slotStart < now) continue
      const slotEnd = addMinutes(slotStart, normalizedDuration)
      const busyItem = busy.find((item) => isOverlapping(slotStart, slotEnd, item.start, item.end))
      if (busyItem) {
        slots.push({
          start: slotStart,
          end: slotEnd,
          status: 'busy',
          title: busyItem.title || 'Band',
        })
      } else {
        slots.push({ start: slotStart, end: slotEnd, status: 'free', title: '' })
      }
    }

    daysOut.push({
      key: key || formatDayKey(dayDate),
      date: dayDate,
      workStart: startHHMM,
      workEnd: endHHMM,
      defaultStart,
      defaultEnd,
      isOverride,
      slots,
    })
  }

  return daysOut
}
