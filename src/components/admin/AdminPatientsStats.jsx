import { useMemo } from 'react'

const formatCurrency = (value) =>
  new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'UZS',
    maximumFractionDigits: 0,
  }).format(value || 0)

function AdminPatientsStats({ patients }) {
  const totals = useMemo(() => {
    const totalRevenue = patients.reduce(
      (sum, item) => sum + (Number(item.amount_paid) || 0),
      0,
    )
    const avgCheck = patients.length ? totalRevenue / patients.length : 0
    const diseaseSet = new Set(
      patients.map((item) => item.disease?.trim()).filter(Boolean),
    )

    return {
      totalPatients: patients.length,
      totalRevenue,
      avgCheck,
      diseaseCount: diseaseSet.size,
    }
  }, [patients])

  const diseaseStats = useMemo(() => {
    const counts = patients.reduce((acc, item) => {
      const disease = item.disease?.trim()
      if (!disease) return acc
      acc[disease] = (acc[disease] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
  }, [patients])

  const monthStats = useMemo(() => {
    const now = new Date()
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const label = new Intl.DateTimeFormat('ru-RU', { month: 'short' }).format(date)
      return { key, label }
    })

    const revenueByMonth = months.reduce((acc, month) => {
      acc[month.key] = 0
      return acc
    }, {})

    patients.forEach((item) => {
      if (!item.visit_date) return
      const date = new Date(item.visit_date)
      if (Number.isNaN(date.getTime())) return
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      if (key in revenueByMonth) {
        revenueByMonth[key] += Number(item.amount_paid) || 0
      }
    })

    return months.map((month) => ({
      ...month,
      revenue: revenueByMonth[month.key] || 0,
    }))
  }, [patients])

  const maxDisease = Math.max(...diseaseStats.map((item) => item[1]), 1)
  const maxRevenue = Math.max(...monthStats.map((item) => item.revenue), 1)

  return (
    <section id="patients" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            пациенты
          </p>
          <h3 className="mt-2 font-display text-2xl">Статистика приема</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {patients.length} записей
        </span>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Пациенты
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {totals.totalPatients}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Выручка
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {formatCurrency(totals.totalRevenue)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Средний чек
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {formatCurrency(Math.round(totals.avgCheck))}
          </p>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            Диагнозы
          </p>
          <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
            {totals.diseaseCount}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
          <p className="text-sm font-semibold text-[color:var(--muted)]">Топ диагнозов</p>
          <div className="mt-4 flex items-end gap-4">
            {diseaseStats.length ? (
              diseaseStats.map(([disease, count], index) => (
                <div key={disease} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end rounded-full bg-slate-100">
                    <div
                      className="w-full rounded-full"
                      style={{
                        height: `${(count / maxDisease) * 100}%`,
                        backgroundColor: index % 2 === 0 ? '#3da9fc' : '#2ec4b6',
                      }}
                    />
                  </div>
                  <span className="text-center text-[10px] font-semibold text-[color:var(--muted)]">
                    {disease}
                  </span>
                  <span className="text-xs font-semibold text-[color:var(--ink)]">
                    {count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-[color:var(--muted)]">
                Добавьте пациентов, чтобы увидеть статистику.
              </p>
            )}
          </div>
        </div>
        <div className="rounded-2xl border border-white/70 bg-white/75 p-4">
          <p className="text-sm font-semibold text-[color:var(--muted)]">Выручка по месяцам</p>
          <div className="mt-4 flex items-end gap-4">
            {monthStats.map((month, index) => (
              <div key={month.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end rounded-full bg-slate-100">
                  <div
                    className="w-full rounded-full"
                    style={{
                      height: `${(month.revenue / maxRevenue) * 100}%`,
                      backgroundColor: index % 2 === 0 ? '#f4b561' : '#3da9fc',
                    }}
                  />
                </div>
                <span className="text-xs font-semibold text-[color:var(--muted)]">
                  {month.label}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-[color:var(--muted)]">
            Используются данные по полю "дата визита".
          </p>
        </div>
      </div>
    </section>
  )
}

export default AdminPatientsStats
