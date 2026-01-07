import { Play } from '../ui/Icons'

function VideosSection({ videoPosts }) {
  return (
    <section id="videos" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              видео и акции
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Видео-объявления и архив
            </h2>
          </div>
          <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
            Архивируем по дате окончания
          </span>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {videoPosts.map((video) => (
            <div
              key={video.title}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                <video
                  className="h-40 w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/video/announcement.mp4" type="video/mp4" />
                  <source src="/video/announcement.webm" type="video/webm" />
                </video>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[color:var(--sky)] shadow-soft">
                    <Play className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <p className="mt-4 text-sm font-semibold text-[color:var(--muted)]">
                {video.valid}
              </p>
              <h3 className="mt-2 text-lg font-semibold">{video.title}</h3>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                {video.description}
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
              >
                Записаться →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default VideosSection
