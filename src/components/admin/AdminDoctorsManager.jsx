import { useState } from 'react'
import { apiFetch } from '../../api/client'

const initialForm = {
  user_id: '',
  specialization: '',
  experience_years: '',
  bio: '',
  is_active: true,
}

function AdminDoctorsManager({ doctors, setDoctors, users }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.user_id) {
      setError('Shifokor uchun foydalanuvchini tanlang')
      return
    }

    if (!form.specialization.trim()) {
      setError('Shifokor mutaxassisligini kiriting')
      return
    }

    const payload = {
      user_id: Number(form.user_id),
      specialization: form.specialization.trim(),
      bio: form.bio.trim(),
      is_active: form.is_active,
    }

    if (form.experience_years) {
      payload.experience_years = Number(form.experience_years)
    }

    try {
      const result = await apiFetch(
        editingId ? `/api/doctors/${editingId}/` : '/api/doctors/',
        { method: editingId ? 'PATCH' : 'POST', body: payload },
      )

      setDoctors((prev) => {
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
      user_id: item.user?.id || item.user_id || '',
      specialization: item.specialization || '',
      experience_years: item.experience_years || '',
      bio: item.bio || '',
      is_active: item.is_active !== false,
    })
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/doctors/${id}/`, { method: 'DELETE' })
      setDoctors((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="doctors" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            shifokorlar
          </p>
          <h3 className="mt-2 font-display text-2xl">Shifokorlar jamoasi</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {doctors.length} mutaxassis
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Foydalanuvchi
            </label>
            <select
              name="user_id"
              value={form.user_id}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            >
              <option value="">Foydalanuvchini tanlang</option>
              {users.map((user) => (
                <option key={user.id || user.username} value={user.id || ''} disabled={!user.id}>
                  {user.full_name || user.username || user.email || 'Foydalanuvchi'}
                </option>
              ))}
            </select>
            {!users.length ? (
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Avval foydalanuvchini «Foydalanuvchilar» bo‘limida qo‘shing.
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Mutaxassislik
            </label>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              placeholder="Terapevt, ortoped"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Tajriba (yil)
            </label>
            <input
              name="experience_years"
              value={form.experience_years}
              onChange={handleChange}
              placeholder="10"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Biografiya
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows="3"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
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
              {editingId ? 'Saqlash' : 'Shifokor qo‘shish'}
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
        {doctors.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.specialization}</p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.user?.full_name || item.user?.username || 'Foydalanuvchi'}
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

export default AdminDoctorsManager


