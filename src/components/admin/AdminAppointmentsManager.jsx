import { useState } from 'react'
import { apiFetch } from '../../api/client'

const statusOptions = ['pending', 'confirmed', 'completed', 'cancelled']

function AdminAppointmentsManager({ appointments, setAppointments }) {
  const [error, setError] = useState('')

  const handleStatusChange = async (appointment, status) => {
    setError('')
    try {
      const result = await apiFetch(`/api/appointments/${appointment.id}/`, {
        method: 'PATCH',
        body: { status },
      })
      setAppointments((prev) =>
        prev.map((item) => (item.id === appointment.id ? result : item)),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section
      id="appointments"
      className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            записи
          </p>
          <h3 className="mt-2 font-display text-2xl">Онлайн-записи</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {appointments.length} заявок
        </span>
      </div>

      {error ? <p className="mt-4 text-sm text-red-500">{error}</p> : null}

      <div className="mt-6 space-y-3">
        {appointments.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">
                Запись #{item.id}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                Врач #{item.doctor} · Услуга #{item.service}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.appointment_date}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={item.status}
                onChange={(event) => handleStatusChange(item, event.target.value)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminAppointmentsManager
