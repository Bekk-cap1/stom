import { useState } from 'react'
import { apiFetch } from '../../api/client'
import {
  formatDigitsInText,
  formatNumberWithSpaces,
  stripNonDigits,
} from '../../utils/formatNumbers'

const initialForm = {
  title: '',
  description: '',
  price: '',
  price_from: '',
  price_to: '',
  price_type: 'single',
  duration_minutes: '',
  is_active: true,
}

function AdminServicesManager({ services, setServices }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const previewPrice = (() => {
    if (form.price_type === 'range') {
      const from = stripNonDigits(form.price_from)
      const to = stripNonDigits(form.price_to)
      const fromText = from ? formatDigitsInText(String(from)) : ''
      const toText = to ? formatDigitsInText(String(to)) : ''
      if (fromText && toText && fromText !== toText) return `${fromText}-${toText} so'm`
      if (fromText) return `${fromText} so'mdan`
      if (toText) return `${toText} so'mgacha`
      return ''
    }

    const raw = stripNonDigits(form.price)
    const digits = raw ? formatDigitsInText(String(raw)) : ''
    return digits ? `${digits} so'm` : ''
  })()

  const previewDuration = form.duration_minutes ? `${form.duration_minutes} daq` : ''
  const previewTitle = form.title.trim() || 'Xizmat nomi'
  const previewDescription = form.description.trim() || 'Qisqacha tavsif...'
  const previewIcon = (form.title?.trim()?.[0] || 'X').toUpperCase()

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }))
      return
    }

    if (name === 'price') {
      setForm((prev) => ({ ...prev, price: formatNumberWithSpaces(value) }))
      return
    }

    if (name === 'price_from') {
      setForm((prev) => ({ ...prev, price_from: formatNumberWithSpaces(value) }))
      return
    }

    if (name === 'price_to') {
      setForm((prev) => ({ ...prev, price_to: formatNumberWithSpaces(value) }))
      return
    }

    if (name === 'duration_minutes') {
      setForm((prev) => ({ ...prev, duration_minutes: value.replace(/\D/g, '') }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const buildPayload = () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      is_active: form.is_active,
    }

    if (form.price_type === 'range') {
      const from = stripNonDigits(form.price_from)
      const to = stripNonDigits(form.price_to)

      if (from && to && from !== to) payload.price = `${from}-${to}`
      else if (from) payload.price = from
      else if (to) payload.price = `-${to}`
      else payload.price = ''
    } else {
      payload.price = stripNonDigits(form.price)
    }

    if (form.duration_minutes) {
      payload.duration_minutes = Number(form.duration_minutes)
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError("Xizmat nomini to'ldiring")
      return
    }

    if (form.price_type === 'range') {
      const from = stripNonDigits(form.price_from)
      const to = stripNonDigits(form.price_to)
      if (!from && !to) {
        setError("Narx uchun kamida 'dan' yoki 'gacha' qiymatini kiriting")
        return
      }
      if (from && to && Number(from) > Number(to)) {
        setError("'Dan' narxi 'gacha' narxidan katta bo'lmasligi kerak")
        return
      }
    } else if (!form.price.trim()) {
      setError("Xizmat narxini to'ldiring")
      return
    }

    try {
      const payload = buildPayload()
      const result = await apiFetch(
        editingId ? `/api/services/${editingId}/` : '/api/services/',
        {
          method: editingId ? 'PATCH' : 'POST',
          body: payload,
        },
      )

      setServices((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? result : item))
        }
        return [result, ...prev]
      })

      setEditingId(null)
      setForm(initialForm)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)

    const parseRangeFromPrice = (priceValue) => {
      if (priceValue == null) return null
      const text = String(priceValue).trim()
      if (!text) return null
      const match = text.match(/^(.+?)\s*[-–—]\s*(.+)$/)
      if (!match) return null
      const from = stripNonDigits(match[1])
      const to = stripNonDigits(match[2])
      if (!from && !to) return null
      return { from, to }
    }

    const fallbackRange = parseRangeFromPrice(item?.price)
    const fromValue = item?.price_from ?? fallbackRange?.from ?? ''
    const toValue = item?.price_to ?? fallbackRange?.to ?? ''
    const hasRange =
      fromValue !== '' ||
      toValue !== '' ||
      (item?.price_from != null || item?.price_to != null)

    setForm({
      title: item.title || '',
      description: item.description || '',
      price: formatNumberWithSpaces(item.price) || '',
      price_from: formatNumberWithSpaces(fromValue) || '',
      price_to: formatNumberWithSpaces(toValue) || '',
      price_type: hasRange ? 'range' : 'single',
      duration_minutes: item.duration_minutes || '',
      is_active: item.is_active !== false,
    })
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/services/${id}/`, { method: 'DELETE' })
      setServices((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const renderPrice = (value) => {
    if (value == null || value === '') return ''
    const text = String(value)
    const formatted = formatDigitsInText(text)
    if (
      /[^\d\s.,]/.test(text) ||
      text.toLowerCase().includes("so'm") ||
      text.toLowerCase().includes('so‘m')
    ) {
      return formatted
    }
    return `${formatted} so'm`
  }

  const renderServicePrice = (service) => {
    const from = service?.price_from
    const to = service?.price_to

    if (from != null || to != null) {
      const fromText = from != null && from !== '' ? formatDigitsInText(String(from)) : ''
      const toText = to != null && to !== '' ? formatDigitsInText(String(to)) : ''

      if (fromText && toText) return `${fromText}–${toText} so'm`
      if (fromText) return `${fromText} so'mdan`
      if (toText) return `${toText} so'mgacha`
    }

    const raw = service?.price
    const parsed = (() => {
      if (raw == null) return null
      const text = String(raw).trim()
      if (!text) return null
      const match = text.match(/^(.+?)\s*[-–—]\s*(.+)$/)
      if (!match) return null
      const fromDigits = stripNonDigits(match[1])
      const toDigits = stripNonDigits(match[2])
      if (!fromDigits && !toDigits) return null
      return { fromDigits, toDigits }
    })()

    if (parsed) {
      const fromText = parsed.fromDigits ? formatDigitsInText(String(parsed.fromDigits)) : ''
      const toText = parsed.toDigits ? formatDigitsInText(String(parsed.toDigits)) : ''
      if (fromText && toText) return `${fromText}–${toText} so'm`
      if (fromText) return `${fromText} so'mdan`
      if (toText) return `${toText} so'mgacha`
    }

    return renderPrice(raw)
  }

  return (
    <section id="services" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            xizmatlar
          </p>
          <h3 className="mt-2 font-display text-2xl">Xizmatlar katalogi</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/#services"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
          >
            Saytda ko'rish
          </a>
          <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
            {services.length} xizmat
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Nomi
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masalan: implantatsiya"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Tavsif
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Yo‘nalishning qisqacha tavsifi"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Narx
              </label>
              {form.price_type === 'range' ? (
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  <input
                    inputMode="numeric"
                    name="price_from"
                    value={form.price_from}
                    onChange={handleChange}
                    placeholder="dan: 500 000"
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                  />
                  <input
                    inputMode="numeric"
                    name="price_to"
                    value={form.price_to}
                    onChange={handleChange}
                    placeholder="gacha: 900 000"
                    className="w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                  />
                </div>
              ) : (
                <input
                  inputMode="numeric"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="500 000"
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
                />
              )}
              <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold text-[color:var(--muted)]">
                <label className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1">
                  <input
                    type="radio"
                    name="price_type"
                    value="single"
                    checked={form.price_type === 'single'}
                    onChange={handleChange}
                  />
                  Bitta
                </label>
                {/* <label className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-3 py-1">
                  <input
                    type="radio"
                    name="price_type"
                    value="range"
                    checked={form.price_type === 'range'}
                    onChange={handleChange}
                  />
                  Dan - gacha
                </label> */}
              </div>


            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Davomiyligi (daq)
              </label>
              <input
                inputMode="numeric"
                name="duration_minutes"
                value={form.duration_minutes}
                onChange={handleChange}
                placeholder="60"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Saytda qanday ko'rinadi
            </p>
            <div className="mt-4 rounded-3xl border border-white/70 bg-white/80 p-5 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[color:var(--sky)]/15 text-sm font-bold text-[color:var(--sky)]">
                  {previewIcon}
                </span>
                <span className="rounded-full bg-[color:var(--sea)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sea)]">
                  mavjud
                </span>
              </div>
              <p className="mt-4 text-lg font-semibold text-[color:var(--ink)]">{previewTitle}</p>
              <p className="mt-2 text-sm text-[color:var(--muted)]">{previewDescription}</p>
              <p className="mt-3 text-xs font-semibold text-[color:var(--muted)]">
                {previewPrice || "Narx so'rov bo'yicha"}
                {previewDuration ? ` · ${previewDuration}` : ''}
              </p>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Faol
          </label>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Saqlash' : 'Xizmat qo‘shish'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
                setError('')
              }}
              className="rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--muted)]"
            >
              Tozalash
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {services.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
              <p className="text-xs text-[color:var(--muted)]">{renderServicePrice(item)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${item.is_active !== false
                    ? 'bg-[color:var(--sea)]/15 text-[color:var(--sea)]'
                    : 'bg-slate-200 text-slate-500'
                  }`}
              >
                {item.is_active !== false ? 'faol' : 'o‘chirilgan'}
              </span>
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Tahrirlash
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                O‘chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminServicesManager
