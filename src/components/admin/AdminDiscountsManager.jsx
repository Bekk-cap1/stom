import { useState } from 'react'
import { apiFetch } from '../../api/client'
import { formatNumberWithSpaces, stripNonDigits } from '../../utils/formatNumbers'

const initialForm = {
  title: '',
  description: '',
  discount_percent: '',
  discount_price: '',
  start_date: '',
  end_date: '',
  is_active: true,
  service_ids: [],
}

function AdminDiscountsManager({ discounts, setDiscounts, services }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }))
      return
    }

    if (name === 'discount_price') {
      setForm((prev) => ({ ...prev, discount_price: formatNumberWithSpaces(value) }))
      return
    }

    if (name === 'discount_percent') {
      setForm((prev) => ({ ...prev, discount_percent: value.replace(/\D/g, '') }))
      return
    }

    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceChange = (event) => {
    const selected = Array.from(event.target.selectedOptions).map((opt) =>
      Number(opt.value),
    )
    setForm((prev) => ({ ...prev, service_ids: selected }))
  }

  const buildPayload = () => {
    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      start_date: form.start_date,
      end_date: form.end_date,
      is_active: form.is_active,
      service_ids: form.service_ids,
    }

    if (form.discount_percent) {
      payload.discount_percent = Number(form.discount_percent)
    }

    if (form.discount_price) {
      payload.discount_price = stripNonDigits(form.discount_price)
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.start_date || !form.end_date) {
      setError('Заполните название и даты акции')
      return
    }

    try {
      const payload = buildPayload()
      const result = await apiFetch(
        editingId ? `/api/discounts/${editingId}/` : '/api/discounts/',
        { method: editingId ? 'PATCH' : 'POST', body: payload },
      )

      setDiscounts((prev) => {
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
      discount_percent: item.discount_percent ?? '',
      discount_price: formatNumberWithSpaces(item.discount_price) ?? '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
      is_active: item.is_active !== false,
      service_ids: item.services ? item.services.map((service) => service.id) : [],
    })
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/discounts/${id}/`, { method: 'DELETE' })
      setDiscounts((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="discounts" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            акции
          </p>
          <h3 className="mt-2 font-display text-2xl">Скидки и спецпредложения</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {discounts.length} предложений
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
              placeholder="Гигиена + AirFlow"
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
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Скидка (%)
              </label>
              <input
                inputMode="numeric"
                name="discount_percent"
                value={form.discount_percent}
                onChange={handleChange}
                placeholder="15"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Цена со скидкой
              </label>
              <input
                inputMode="numeric"
                name="discount_price"
                value={form.discount_price}
                onChange={handleChange}
                placeholder="150000"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Старт
              </label>
              <input
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Финиш
              </label>
              <input
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Услуги
            </label>
            <select
              multiple
              value={form.service_ids.map(String)}
              onChange={handleServiceChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-[color:var(--muted)]">
              Удерживайте Ctrl или Cmd для выбора нескольких услуг.
            </p>
          </div>
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
              {editingId ? 'Сохранить' : 'Добавить акцию'}
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
        {discounts.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.start_date} - {item.end_date}
              </p>
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

export default AdminDiscountsManager
