function HeroSection({ stats = [], image, doctor, slots, loading }) {
  const doctorName = doctor?.user?.full_name || doctor?.user?.username || ''
  const heroTitle = doctorName ? `Доктор ${doctorName}` : 'Персональный сайт стоматолога'
  const heroSubtitle = doctor?.specialization || 'с реальными кейсами до и после'
  const heroDescription =
    doctor?.bio ||
    'Современный подход, фотопротоколы лечения и бережная забота о каждом пациенте.'
  const slotItems =
    slots && slots.length
      ? slots
      : ['Сегодня, 17:30', 'Завтра, 12:00', 'Пятница, 10:15']
  const placeholderStats = [
    { value: '—', label: 'Загрузка данных' },
    { value: '—', label: 'Пожалуйста, подождите' },
    { value: '—', label: 'Обновляем статистику' },
  ]
  const statsToRender = stats.length ? stats : loading ? placeholderStats : []

  return (
    <section id="home" className="relative overflow-hidden px-6 pb-16 pt-6 sm:pt-10">
      <div className="absolute right-8 top-14 hidden h-32 w-32 rounded-full bg-[color:var(--sea)]/20 blur-2xl lg:block animate-float" />
      <div className="absolute left-10 top-24 hidden h-20 w-20 rounded-full bg-[color:var(--sky)]/30 blur-xl lg:block animate-pulse-soft" />
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)] shadow-soft">
            клинический формат
            <span className="h-2 w-2 rounded-full bg-[color:var(--sea)] animate-pulse-soft" />
          </div>
          <h1 className="mt-6 font-display text-4xl leading-tight sm:text-5xl lg:text-6xl">
            {heroTitle}
            <span className="block text-[color:var(--sky)]">{heroSubtitle}</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted)]">{heroDescription}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="rounded-full bg-[color:var(--sky)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Записаться на консультацию
            </a>
            <a
              href="#works"
              className="rounded-full border border-white/70 bg-white/80 px-6 py-3 text-sm font-semibold text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5"
            >
              Смотреть работы
            </a>
          </div>
          {statsToRender.length ? (
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {statsToRender.map((item, index) => (
                <div
                  key={`${item.label}-${index}`}
                  className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-soft"
                >
                  <p className="font-display text-2xl">{item.value}</p>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{item.label}</p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
        <div className="grid gap-6">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[color:var(--muted)]">Фото клиники</p>
              <span className="rounded-full bg-[color:var(--sea)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sea)]">
                обновляется
              </span>
            </div>
            {image ? (
              <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                <img
                  src={image}
                  alt="Фото клиники"
                  className="h-52 w-full object-cover"
                  loading="lazy"
                />
              </div>
            ) : null}
            {image ? (
              <p className="mt-4 text-sm text-[color:var(--muted)]">
                Фотографии кабинета и оборудования.
              </p>
            ) : null}
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <p className="text-sm font-semibold text-[color:var(--muted)]">Ближайшие окна</p>
            <div className="mt-4 grid gap-3">
              {slotItems.map((slot) => (
                <div
                  key={slot}
                  className="flex items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
                >
                  <span className="font-medium">{slot}</span>
                  <span className="rounded-full bg-[color:var(--sky)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sky)]">
                    свободно
                  </span>
                </div>
              ))}
            </div>
            <a
              href="#contact"
              className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition hover:-translate-y-0.5"
            >
              Забронировать время
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
