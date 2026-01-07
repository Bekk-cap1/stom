import { useState } from 'react'

const initialForm = {
  first_name: '',
  last_name: '',
  age: '',
  visit_date: '',
  disease: '',
  amount_paid: '',
  payment_method: '',
  notes: '',
}

function AdminPatientsManager({ patients, setPatients }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')

    if (!form.first_name.trim() || !form.last_name.trim() || !form.visit_date) {
      setError('Заполните имя, фамилию и дату визита')
      return
    }

    const nextItem = {
      id: editingId || `patient-${Date.now()}`,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      age: form.age ? Number(form.age) : '',
      visit_date: form.visit_date,
      disease: form.disease.trim(),
      amount_paid: form.amount_paid ? Number(form.amount_paid) : 0,
      payment_method: form.payment_method.trim(),
      notes: form.notes.trim(),
    }

    setPatients((prev) => {
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
      first_name: item.first_name || '',
      last_name: item.last_name || '',
      age: item.age || '',
      visit_date: item.visit_date || '',
      disease: item.disease || '',
      amount_paid: item.amount_paid || '',
      payment_method: item.payment_method || '',
      notes: item.notes || '',
    })
  }

  const handleDelete = (id) => {
    setPatients((prev) => prev.filter((item) => item.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setForm(initialForm)
    }
  }

  return (
    <section className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            приемы
          </p>
          <h3 className="mt-2 font-display text-2xl">Карточки пациентов</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {patients.length} пациентов
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Имя
              </label>
              <input
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                placeholder="Имя"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Фамилия
              </label>
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                placeholder="Фамилия"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Возраст
              </label>
            <input
              type="number"
              name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="30"
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Дата визита
              </label>
              <input
                type="date"
                name="visit_date"
                value={form.visit_date}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Диагноз / жалоба
            </label>
            <input
              name="disease"
              value={form.disease}
              onChange={handleChange}
              placeholder="Например: кариес"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Примечание
            </label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Дополнительная информация"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Оплата (сум)
            </label>
            <input
              type="number"
              name="amount_paid"
              value={form.amount_paid}
              onChange={handleChange}
              placeholder="350000"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Способ оплаты
            </label>
            <input
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              placeholder="Наличные / карта"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft"
            >
              {editingId ? 'Сохранить' : 'Добавить пациента'}
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
        {patients.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">
                {item.first_name} {item.last_name}
              </p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.age ? `${item.age} лет` : 'Возраст не указан'} · {item.visit_date}
              </p>
              {item.disease ? (
                <p className="text-xs text-[color:var(--muted)]">{item.disease}</p>
              ) : null}
              {item.payment_method ? (
                <p className="text-xs text-[color:var(--muted)]">
                  Оплата: {item.payment_method}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[color:var(--sea)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sea)]">
                {item.amount_paid ? `${item.amount_paid} сум` : 'оплата не указана'}
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

export default AdminPatientsManager
