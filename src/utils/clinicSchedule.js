const HOURS_STORAGE_KEY = 'stom_clinic_hours'
const BUSY_STORAGE_KEY = 'stom_doctor_busy_blocks'

const safeParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const safeStringify = (value) => {
  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

export const getClinicHours = () => {
  if (typeof window === 'undefined') {
    return { defaultStart: '09:00', defaultEnd: '20:00', overrides: {} }
  }

  const stored = safeParse(localStorage.getItem(HOURS_STORAGE_KEY), null)
  const defaultStart = stored?.defaultStart || '09:00'
  const defaultEnd = stored?.defaultEnd || '20:00'
  const overrides = stored?.overrides && typeof stored.overrides === 'object' ? stored.overrides : {}
  return { defaultStart, defaultEnd, overrides }
}

export const setClinicHours = (next) => {
  if (typeof window === 'undefined') return
  const payload = {
    defaultStart: next?.defaultStart || '09:00',
    defaultEnd: next?.defaultEnd || '20:00',
    overrides: next?.overrides && typeof next.overrides === 'object' ? next.overrides : {},
  }
  localStorage.setItem(HOURS_STORAGE_KEY, safeStringify(payload))
}

const toDateKey = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const toMinutes = (hhmm) => {
  const [h, m] = String(hhmm || '').split(':')
  const hours = Number(h)
  const minutes = Number(m)
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return null
  return hours * 60 + minutes
}

export const getWorkingHoursForDate = (date) => {
  const key = toDateKey(date)
  const { defaultStart, defaultEnd, overrides } = getClinicHours()
  const override = key && overrides ? overrides[key] : null
  const start = override?.start || defaultStart
  const end = override?.end || defaultEnd

  const startMinutes = toMinutes(start)
  const endMinutes = toMinutes(end)
  if (startMinutes == null || endMinutes == null || endMinutes <= startMinutes) {
    return {
      start: '09:00',
      end: '20:00',
      key,
      defaultStart,
      defaultEnd,
      isOverride: Boolean(override),
    }
  }

  return { start, end, key, defaultStart, defaultEnd, isOverride: Boolean(override) }
}

export const upsertWorkingHoursOverride = ({ date, start, end }) => {
  const { defaultStart, defaultEnd, overrides } = getClinicHours()
  const key = toDateKey(date)
  if (!key) return
  const nextOverrides = { ...(overrides || {}) }
  nextOverrides[key] = { start, end }
  setClinicHours({ defaultStart, defaultEnd, overrides: nextOverrides })
}

export const removeWorkingHoursOverride = (date) => {
  const { defaultStart, defaultEnd, overrides } = getClinicHours()
  const key = toDateKey(date)
  if (!key) return
  const nextOverrides = { ...(overrides || {}) }
  delete nextOverrides[key]
  setClinicHours({ defaultStart, defaultEnd, overrides: nextOverrides })
}

export const getDoctorBusyBlocks = () => {
  if (typeof window === 'undefined') return []
  const stored = safeParse(localStorage.getItem(BUSY_STORAGE_KEY), [])
  return Array.isArray(stored) ? stored : []
}

export const setDoctorBusyBlocks = (blocks) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(BUSY_STORAGE_KEY, safeStringify(Array.isArray(blocks) ? blocks : []))
}

export const addDoctorBusyBlock = ({ doctorId, startISO, endISO, title }) => {
  const start = new Date(startISO)
  const end = new Date(endISO)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) return null
  const id = `busy-${Date.now()}`
  const next = [
    {
      id,
      doctorId: doctorId != null ? String(doctorId) : '',
      startISO: start.toISOString(),
      endISO: end.toISOString(),
      title: String(title || '').trim(),
    },
    ...getDoctorBusyBlocks(),
  ]
  setDoctorBusyBlocks(next)
  return id
}

export const removeDoctorBusyBlock = (id) => {
  const next = getDoctorBusyBlocks().filter((item) => item.id !== id)
  setDoctorBusyBlocks(next)
}
