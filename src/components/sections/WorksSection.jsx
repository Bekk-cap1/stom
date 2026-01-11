import { useMemo, useState } from 'react'

function WorksSection({ works, onOpenWork, loading }) {
  const [activeType, setActiveType] = useState('Barchasi')
  const [activeDate, setActiveDate] = useState('Barchasi')

  const workTypes = ['Barchasi', ...new Set(works.map((work) => work.type).filter(Boolean))]
  const workDates = ['Barchasi', ...new Set(works.map((work) => work.date).filter(Boolean))]

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const typeMatch = activeType === 'Barchasi' || work.type === activeType
      const dateMatch = activeDate === 'Barchasi' || work.date === activeDate
      return typeMatch && dateMatch
    })
  }, [activeDate, activeType, works])

  return (
    <section id="works" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              bizning ishlar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Galereya {'<'}oldin / keyin{'>'}
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {workTypes.map((type) => (
              <button
                type="button"
                key={`type-${type}`}
                onClick={() => setActiveType(type)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeType === type
                    ? 'bg-[color:var(--sky)] text-white shadow-soft'
                    : 'border border-white/70 bg-white/80 text-[color:var(--muted)]'
                }`}
              >
                {type}
              </button>
            ))}
            {workDates.map((date) => (
              <button
                type="button"
                key={`date-${date}`}
                onClick={() => setActiveDate(date)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeDate === date
                    ? 'bg-[color:var(--sea)] text-white shadow-soft'
                    : 'border border-white/70 bg-white/80 text-[color:var(--muted)]'
                }`}
              >
                {date}
              </button>
            ))}
          </div>
        </div>
        {loading && !works.length ? (
          <p className="mt-6 text-sm text-[color:var(--muted)]">Galereya yuklanmoqda...</p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredWorks.map((work) => (
            <button
              type="button"
              key={work.id}
              onClick={() => onOpenWork(work)}
              className="group rounded-3xl border border-white/70 bg-white/80 p-6 text-left shadow-soft transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                  {work.type}
                </span>
                <span className="text-xs font-semibold text-[color:var(--muted)]">
                  {work.date}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {['oldin', 'keyin'].map((label, index) => {
                  const imageUrl =
                    index === 0 ? work.beforeImages?.[0] : work.afterImages?.[0]
                  const fallbackClass =
                    index === 0 ? work.beforeClass : work.afterClass

                  return (
                    <div
                      key={label}
                      className={`relative h-28 overflow-hidden rounded-2xl ${
                        imageUrl ? 'bg-slate-100' : `bg-gradient-to-br ${fallbackClass}`
                      }`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={`Foto ${label}`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : null}
                      <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                        {label}
                      </span>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4">
                <p className="text-lg font-semibold">{work.title}</p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">{work.note}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorksSection
