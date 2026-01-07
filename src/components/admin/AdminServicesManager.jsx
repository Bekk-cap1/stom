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
  duration_minutes: '',
  is_active: true,
}

function AdminServicesManager({ services, setServices }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

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
      price: stripNonDigits(form.price),
      is_active: form.is_active,
    }

    if (form.duration_minutes) {
      payload.duration_minutes = Number(form.duration_minutes)
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.price.trim()) {
      setError('Заполните название и цену услуги')
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
    setForm({
      title: item.title || '',
      description: item.description || '',
      price: formatNumberWithSpaces(item.price) || '',
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
    if (/[^\d\s.,]/.test(text) || text.toLowerCase().includes('сум')) {
      return formatted
    }
    return `${formatted} сум`
  }

  return (
    <section id="services" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            услуги
          </p>
          <h3 className="mt-2 font-display text-2xl">Каталог услуг</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {services.length} услуг
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Название
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Например: имплантация"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Описание
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Краткое описание направления"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Цена
              </label>
              <input
                inputMode="numeric"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="от 500 000 сум"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Длительность (мин)
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
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Активно
          </label>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Сохранить' : 'Добавить услугу'}
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
              Сбросить
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
              <p className="text-xs text-[color:var(--muted)]">{renderPrice(item.price)}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.is_active !== false
                    ? 'bg-[color:var(--sea)]/15 text-[color:var(--sea)]'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {item.is_active !== false ? 'активно' : 'выключено'}
              </span>
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Редактировать
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminServicesManager
