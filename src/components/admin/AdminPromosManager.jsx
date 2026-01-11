import { useState } from 'react'

const initialForm = {
  title: '',
  discount: '',
  valid: '',
  description: '',
  enabled: true,
}

function AdminPromosManager({ promos, setPromos }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return

    const nextItem = {
      id: editingId || `promo-${Date.now()}`,
      title: form.title.trim(),
      discount: form.discount.trim() || '-10%',
      valid: form.valid.trim() || 'kelishuv bo‘yicha',
      description: form.description.trim(),
      enabled: form.enabled,
    }

    setPromos((prev) => {
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
      discount: item.discount,
      valid: item.valid,
      description: item.description,
      enabled: item.enabled !== false,
    })
  }

  const handleDelete = (id) => {
    setPromos((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm(initialForm)
    }
  }

  return (
    <section id="promos" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            aksiyalar
          </p>
          <h3 className="mt-2 font-display text-2xl">Chegirmalar va maxsus takliflar</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {promos.length} taklif
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Aksiya nomi
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Masalan: gigiyena + AirFlow"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Chegirma
              </label>
              <input
                name="discount"
                value={form.discount}
                onChange={handleChange}
                placeholder="-15%"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Amal qilish muddati
              </label>
              <input
              name="valid"
              value={form.valid}
              onChange={handleChange}
              placeholder="30 aprelgacha"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Tavsif
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Aksiyaga nimalar kiradi"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            <input
              type="checkbox"
              name="enabled"
              checked={form.enabled}
              onChange={handleChange}
            />
            Faol
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Saqlash' : 'Aksiya qo‘shish'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
              }}
              className="rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--muted)]"
            >
              Tozalash
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {promos.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.discount} · {item.valid}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  item.enabled !== false
                    ? 'bg-[color:var(--sea)]/15 text-[color:var(--sea)]'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                {item.enabled !== false ? 'faol' : 'o‘chirilgan'}
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

export default AdminPromosManager
