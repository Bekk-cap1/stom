import { useMemo, useState } from 'react'
import { Play } from '../ui/Icons'

function WorksSection({ works, onOpenWork }) {
  const [activeType, setActiveType] = useState('Все')
  const [activeDate, setActiveDate] = useState('Все')

  const workTypes = ['Все', ...new Set(works.map((work) => work.type))]
  const workDates = ['Все', ...new Set(works.map((work) => work.date))]

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const typeMatch = activeType === 'Все' || work.type === activeType
      const dateMatch = activeDate === 'Все' || work.date === activeDate
      return typeMatch && dateMatch
    })
  }, [activeDate, activeType, works])

  return (
    <section id="works" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              наши работы
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Галерея «до / после»
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
                {['до', 'после'].map((label, index) => (
                  <div
                    key={label}
                    className={`relative h-28 overflow-hidden rounded-2xl bg-gradient-to-br ${
                      index === 0 ? work.beforeClass : work.afterClass
                    }`}
                  >
                    <span className="absolute left-3 top-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold">{work.title}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted)]">
                    {work.note}
                  </p>
                </div>
                {work.mediaType === 'video' ? (
                  <span className="flex items-center gap-2 rounded-full bg-[color:var(--sky)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sky)]">
                    <Play className="h-4 w-4" />
                    видео
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorksSection
