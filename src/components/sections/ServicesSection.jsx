function ServicesSection({ services, loading }) {
  const isLoading = loading && !services.length

  return (
    <section id="services" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              xizmatlar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Davolash va estetika yo‘nalishlari
            </h2>
          </div>
          <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-sm text-[color:var(--muted)]">
            Narxlar har oy yangilanadi
          </span>
        </div>
        {isLoading ? (
          <p className="mt-6 text-sm text-[color:var(--muted)]">Xizmatlar yuklanmoqda...</p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id || service.title}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft transition hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--sky)]/15 text-base font-bold text-[color:var(--sky)]">
                  {service.icon || service.title?.[0] || 'S'}
                </div>
                {service.tag ? (
                  <span className="rounded-full bg-[color:var(--sea)]/15 px-3 py-1 text-xs font-semibold text-[color:var(--sea)]">
                    {service.tag}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {service.description}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="font-semibold text-[color:var(--ink)]">
                  {service.price} dan boshlab
                </span>
                {service.duration ? (
                  <span className="rounded-full border border-white/70 bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                    {service.duration}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
