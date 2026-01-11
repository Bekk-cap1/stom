function PromosSection({ promos, loading }) {
  const isLoading = loading && !promos.length

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              amaldagi aksiyalar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Chegirmalar va maxsus takliflar
            </h2>
          </div>
          <a
            href="#contact"
            className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Chegirmani olish
          </a>
        </div>
        {isLoading ? (
          <p className="mt-6 text-sm text-[color:var(--muted)]">Aksiyalar yuklanmoqda...</p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {promos.map((promo) => (
            <div
              key={promo.id || promo.title}
              className="rounded-3xl border border-white/70 bg-gradient-to-br from-white/90 to-white/70 p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-[color:var(--sun)]/20 px-3 py-1 text-xs font-semibold text-[color:var(--sun)]">
                  {promo.valid}
                </span>
                <span className="text-2xl font-display text-[color:var(--sea)]">
                  {promo.discount}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{promo.title}</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {promo.description}
              </p>
              <a
                href="#contact"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
              >
                Qabulga yozilish
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PromosSection
