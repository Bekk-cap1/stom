import { useState } from 'react'
import { apiFetch } from '../../api/client'

function AdminContactRequestsManager({ requests, setRequests }) {
  const [error, setError] = useState('')

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/contact-requests/${id}/`, { method: 'DELETE' })
      setRequests((prev) => prev.filter((item) => item.id !== id))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section
      id="contacts"
      className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            контакты
          </p>
          <h3 className="mt-2 font-display text-2xl">Заявки с сайта</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {requests.length} обращений
        </span>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {requests.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.name}</p>
              <p className="text-xs text-[color:var(--muted)]">{item.phone}</p>
              {item.message ? (
                <p className="text-xs text-[color:var(--muted)]">{item.message}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
            >
              Удалить
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminContactRequestsManager
