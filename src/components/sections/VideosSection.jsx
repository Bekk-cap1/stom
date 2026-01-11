function VideosSection({ videoPosts, image, loading }) {
  const isLoading = loading && !videoPosts.length

  return (
    <section id="videos" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              foto va aksiyalar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Foto e'lonlar va arxiv
            </h2>
          </div>
          <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
            Tugash sanasiga ko‘ra arxivlaymiz
          </span>
        </div>
        {isLoading ? (
          <p className="mt-6 text-sm text-[color:var(--muted)]">E'lonlar yuklanmoqda...</p>
        ) : null}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {videoPosts.map((video) => {
            const imageSrc = video.image || image

            return (
              <div
                key={video.id || video.title}
                className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt="Aksiya fotosi"
                      className="h-40 w-full object-cover"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                {video.valid ? (
                  <p className="mt-4 text-sm font-semibold text-[color:var(--muted)]">
                    {video.valid}
                  </p>
                ) : null}
                <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
                <p className="mt-3 text-sm text-[color:var(--muted)]">
                  {video.description}
                </p>
                <a
                  href="#contact"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
                >
                  Qabulga yozilish
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default VideosSection
