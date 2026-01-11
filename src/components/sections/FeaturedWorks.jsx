function FeaturedWorks({ works, onOpenWork, loading }) {
  const isLoading = loading && !works.length

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              so‘nggi ishlar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Amaliyotdan haqiqiy keyslar
            </h2>
          </div>
          <a
            href="#works"
            className="rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5"
          >
            Barcha arxivni ko‘rish
          </a>
        </div>
        {isLoading ? (
          <p className="mt-6 text-sm text-[color:var(--muted)]">Ishlar yuklanmoqda...</p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {works.slice(0, 3).map((work) => (
            <button
              type="button"
              key={work.id}
              onClick={() => onOpenWork(work)}
              className="group rounded-3xl border border-white/70 bg-white/80 p-5 text-left shadow-soft transition hover:-translate-y-1"
            >
              <div className="grid grid-cols-2 gap-3">
                {['oldin', 'keyin'].map((label, index) => {
                  const imageUrl =
                    index === 0 ? work.beforeImages?.[0] : work.afterImages?.[0]
                  const fallbackClass =
                    index === 0 ? work.beforeClass : work.afterClass

                  return (
                    <div
                      key={label}
                      className={`relative h-24 overflow-hidden rounded-2xl ${
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
                <p className="text-sm font-semibold text-[color:var(--muted)]">
                  {work.type}
                </p>
                <p className="mt-1 text-lg font-semibold">{work.title}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{work.note}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedWorks
