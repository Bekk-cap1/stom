function AdvantagesSection({ advantages, stats, loading }) {
  const hasAdvantages = advantages.length > 0
  const hasStats = stats.length > 0

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              преимущества
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Сервис клиники + личный подход врача
            </h2>
            <p className="mt-4 text-base text-[color:var(--muted)]">
              От первичной консультации до финальной фотосессии улыбки вы
              получаете прозрачный план, точные сроки и поддержку на каждом
              шаге.
            </p>
            {loading && !hasAdvantages ? (
              <p className="mt-4 text-sm text-[color:var(--muted)]">Загружаем преимущества...</p>
            ) : null}
            <div className="mt-6 space-y-3 text-sm text-[color:var(--muted)]">
              {advantages.map((advantage) => (
                <div
                  key={advantage.title}
                  className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3"
                >
                  <p className="font-semibold text-[color:var(--ink)]">
                    {advantage.title}
                  </p>
                  <p className="mt-1">{advantage.description}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {loading && !hasStats ? (
              <div className="rounded-3xl border border-white/70 bg-white/75 p-6 text-sm text-[color:var(--muted)]">
                Загружаем статистику...
              </div>
            ) : null}
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/70 bg-gradient-to-br from-white/90 to-white/70 p-6 shadow-soft"
              >
                <p className="font-display text-3xl">{stat.value}</p>
                <p className="mt-3 text-sm text-[color:var(--muted)]">{stat.label}</p>
              </div>
            ))}
            <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-sky-100/80 via-white to-emerald-100/60 p-6 shadow-soft">
              <p className="text-sm font-semibold text-[color:var(--muted)]">
                Онлайн-консультация
              </p>
              <p className="mt-3 text-lg font-semibold">
                Подбор плана лечения в мессенджере
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Отправьте снимки и получите предварительный план и смету в
                течение 24 часов.
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
              >
                Получить консультацию
              </a>
            </div>
            <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-emerald-100/80 via-white to-sky-100/70 p-6 shadow-soft">
              <p className="text-sm font-semibold text-[color:var(--muted)]">
                Контроль качества
              </p>
              <p className="mt-3 text-lg font-semibold">
                Фото и видеоотчет после приема
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Все этапы фиксируются, чтобы вы видели результат лечения.
              </p>
              <a
                href="#works"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
              >
                Смотреть отчеты
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdvantagesSection
