import { useState } from 'react'
import { apiFetch } from '../../api/client'

const positionOptions = [
  { value: 'home', label: 'Bosh sahifa' },
  { value: 'services', label: 'Xizmatlar' },
  { value: 'offers', label: 'Aksiyalar' },
]

const initialForm = {
  title: '',
  position: 'home',
  link_url: '',
  image: null,
}

function AdminBannersManager({ banners, setBanners }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0]
    setForm((prev) => ({ ...prev, image: file || null }))
  }

  const buildFormData = () => {
    const data = new FormData()
    data.append('title', form.title.trim())
    data.append('position', form.position)
    if (form.link_url) data.append('link_url', form.link_url)
    if (form.image) data.append('image', form.image)
    return data
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || (!editingId && !form.image)) {
      setError('Sarlavhani to‘ldiring va rasm tanlang')
      return
    }

    try {
      const result = await apiFetch(
        editingId ? `/api/banners/${editingId}/` : '/api/banners/',
        {
          method: editingId ? 'PATCH' : 'POST',
          body: buildFormData(),
        },
      )

      setBanners((prev) => {
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
      position: item.position || 'home',
      link_url: item.link_url || '',
      image: null,
    })
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/banners/${id}/`, { method: 'DELETE' })
      setBanners((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="banners" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            bannerlar
          </p>
          <h3 className="mt-2 font-display text-2xl">Hero va promo bannerlar</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a
            href="/#videos"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
          >
            Saytda ko'rish
          </a>
          <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
            {banners.length} banner
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Sarlavha
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Banner nomi"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Joylashuv
            </label>
            <select
              name="position"
              value={form.position}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              {positionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Havola
            </label>
            <input
              name="link_url"
              value={form.link_url}
              onChange={handleChange}
              placeholder="https://"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Rasm
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Saqlash' : 'Banner qo‘shish'}
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
        {banners.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.position_display || item.position}
              </p>
            </div>
            <div className="flex items-center gap-2">
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

export default AdminBannersManager
