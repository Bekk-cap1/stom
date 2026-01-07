import { useState } from 'react'

const initialForm = {
  title: '',
  valid: '',
  description: '',
  videoAsset: '',
  enabled: true,
}

function AdminVideosManager({ videoPosts, setVideoPosts }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleFileChange = (event) => {
    const { files } = event.target
    const fileName = files && files[0] ? files[0].name : ''
    setForm((prev) => ({ ...prev, videoAsset: fileName }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    const nextItem = {
      id: editingId || `video-${Date.now()}`,
      title: form.title.trim(),
      valid: form.valid.trim() || 'по расписанию',
      description: form.description.trim(),
      videoAsset: form.videoAsset,
      enabled: form.enabled,
    }

    setVideoPosts((prev) => {
      if (editingId) {
        return prev.map((item) => (item.id === editingId ? nextItem : item))
      }
      return [nextItem, ...prev]
    })

    setEditingId(null)
    setForm(initialForm)
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title,
      valid: item.valid,
      description: item.description,
      videoAsset: item.videoAsset || '',
      enabled: item.enabled !== false,
    })
  }

  const handleDelete = (id) => {
    setVideoPosts((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm(initialForm)
    }
  }

  return (
    <section id="videos" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            видео-объявления
          </p>
          <h3 className="mt-2 font-display text-2xl">Видео и новости</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {videoPosts.length} видео
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Заголовок
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Например: Весеннее отбеливание"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Срок действия
            </label>
            <input
              name="valid"
              value={form.valid}
              onChange={handleChange}
              placeholder="до 20 апреля"
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
              placeholder="Краткий текст объявления"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Видео файл
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
            />
            {form.videoAsset ? (
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Выбран: {form.videoAsset}
              </p>
            ) : null}
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <input
              type="checkbox"
              name="enabled"
              checked={form.enabled}
              onChange={handleChange}
            />
            Активно
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Сохранить' : 'Добавить видео'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
              }}
              className="rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--muted)]"
            >
              Сбросить
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {videoPosts.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
              <p className="text-xs text-[color:var(--muted)]">{item.valid}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.enabled !== false
                    ? 'bg-[color:var(--sea)]/15 text-[color:var(--sea)]'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {item.enabled !== false ? 'активно' : 'выключено'}
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

export default AdminVideosManager
