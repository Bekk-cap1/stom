import { useState } from 'react'
import { apiFetch } from '../../api/client'

const initialForm = {
  username: '',
  full_name: '',
  email: '',
  phone: '',
  password: '',
}

function AdminUsersManager({ users, setUsers }) {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.username.trim() || !form.password.trim()) {
      setError('Укажите логин и пароль пользователя')
      return
    }

    const payload = {
      username: form.username.trim(),
      password: form.password.trim(),
    }

    if (form.full_name.trim()) payload.full_name = form.full_name.trim()
    if (form.email.trim()) payload.email = form.email.trim()
    if (form.phone.trim()) payload.phone = form.phone.trim()

    try {
      setIsSubmitting(true)
      const result = await apiFetch('/api/auth/register/', {
        method: 'POST',
        body: payload,
      })

      const fallbackUser = {
        id: result?.id ?? Date.now(),
        username: result?.username || payload.username,
        full_name: result?.full_name || payload.full_name || '',
        email: result?.email || payload.email || '',
        phone: result?.phone || payload.phone || '',
        role: result?.role || result?.role_display || '',
      }

      setUsers((prev) => [fallbackUser, ...prev.filter((item) => item.id !== fallbackUser.id)])
      setForm(initialForm)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="users" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            пользователи
          </p>
          <h3 className="mt-2 font-display text-2xl">База пользователей</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {users.length} пользователей
        </span>
      </div>

      <p className="mt-4 text-xs text-[color:var(--muted)]">
        Добавьте пользователя, чтобы затем выбрать его при создании врача. Список хранится локально в браузере.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Логин
            </label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="dr.makarenko"
              autoComplete="username"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Полное имя
            </label>
            <input
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Айман Макаренко"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="mail@clinic.uz"
              type="email"
              autoComplete="email"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Телефон
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+998 90 000 00 00"
              autoComplete="tel"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Пароль
            </label>
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••"
              type="password"
              autoComplete="new-password"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft disabled:opacity-70"
            >
              {isSubmitting ? 'Создаем...' : 'Добавить пользователя'}
            </button>
            <button
              type="button"
              onClick={() => {
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
        {users.map((user) => (
          <div
            key={user.id || user.username}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">
                {user.full_name || user.username || 'Пользователь'}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                {user.username || user.email || 'без логина'}
                {user.role_display || user.role ? ` · ${user.role_display || user.role}` : ''}
              </p>
            </div>
            <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
              ID: {user.id ?? '—'}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminUsersManager
