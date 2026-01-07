import { useState } from 'react'
import { apiFetch } from '../../api/client'

const initialForm = {
  doctor: '',
  work: '',
  rating: 5,
  comment: '',
}

function AdminReviewsManager({ reviews, setReviews, doctors, works }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const buildPayload = () => {
    const payload = {
      doctor: Number(form.doctor),
      rating: Number(form.rating),
      comment: form.comment.trim(),
    }

    if (form.work) {
      payload.work = Number(form.work)
    }

    return payload
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.doctor || !form.comment.trim()) {
      setError('Выберите врача и заполните комментарий')
      return
    }

    try {
      const result = await apiFetch(
        editingId ? `/api/reviews/${editingId}/` : '/api/reviews/',
        { method: editingId ? 'PATCH' : 'POST', body: buildPayload() },
      )

      setReviews((prev) => {
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
      doctor: item.doctor || '',
      work: item.work || '',
      rating: item.rating || 5,
      comment: item.comment || '',
    })
  }

  const handleApprove = async (id) => {
    setError('')
    try {
      const result = await apiFetch(`/api/reviews/${id}/approve/`, {
        method: 'PATCH',
        body: {},
      })

      setReviews((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item
          if (result && typeof result === 'object') {
            return { ...item, ...result, is_approved: result.is_approved ?? true }
          }
          return { ...item, is_approved: true }
        }),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/reviews/${id}/`, { method: 'DELETE' })
      setReviews((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="reviews" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            отзывы
          </p>
          <h3 className="mt-2 font-display text-2xl">Модерация отзывов</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {reviews.length} отзывов
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Врач
              </label>
              <select
                name="doctor"
                value={form.doctor}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              >
                <option value="">Выберите врача</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.user?.full_name || doctor.user?.username || doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Работа (опционально)
              </label>
              <select
                name="work"
                value={form.work}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              >
                <option value="">Без привязки</option>
                {works.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Комментарий
            </label>
            <textarea
              name="comment"
              value={form.comment}
              onChange={handleChange}
              rows="3"
              placeholder="Текст отзыва"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Рейтинг
            </label>
            <select
              name="rating"
              value={form.rating}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} звезд
                </option>
              ))}
            </select>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Сохранить' : 'Добавить отзыв'}
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
        {reviews.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.comment}</p>
              <p className="text-xs text-[color:var(--muted)]">
                Рейтинг: {item.rating} · ID врача: {item.doctor}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.is_approved
                    ? 'bg-[color:var(--sea)]/15 text-[color:var(--sea)]'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {item.is_approved ? 'одобрено' : 'на модерации'}
              </span>
              <button
                type="button"
                onClick={() => handleApprove(item.id)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Одобрить
              </button>
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

export default AdminReviewsManager
