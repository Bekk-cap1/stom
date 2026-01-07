import { Play } from '../ui/Icons'

function AboutSection({ education, certificates }) {
  return (
    <section id="about" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              о враче
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Опыт, которому доверяют семьи
            </h2>
            <p className="mt-4 text-base text-[color:var(--muted)]">
              Айша Салимова — практикующий стоматолог с фокусом на эстетике и
              функциональности. Придерживается доказательной медицины, сочетая
              клинические протоколы и современный сервис.
            </p>
            <div className="mt-6 space-y-3 text-sm text-[color:var(--muted)]">
              {education.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3"
                >
                  {item}
                </div>
              ))}
            </div>
            <blockquote className="mt-6 rounded-3xl border border-white/70 bg-white/70 p-6 text-base text-[color:var(--muted)]">
              “Каждый кейс — это история пациента. Моя задача — вернуть уверенную
              улыбку и сохранить здоровье на годы вперед.”
            </blockquote>
          </div>
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {certificates.map((certificate) => (
                <div
                  key={certificate}
                  className="rounded-2xl border border-white/70 bg-gradient-to-br from-white/90 to-white/70 p-4 text-sm text-[color:var(--muted)] shadow-soft"
                >
                  <p className="font-semibold text-[color:var(--ink)]">
                    {certificate}
                  </p>
                  <p className="mt-2 text-xs">Проверено и актуально</p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
              <p className="text-sm font-semibold text-[color:var(--muted)]">
                Видео-обращение
              </p>
              <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                <video
                  className="h-40 w-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                >
                  <source src="/video/doctor.mp4" type="video/mp4" />
                  <source src="/video/doctor.webm" type="video/webm" />
                </video>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-[color:var(--sky)] shadow-soft">
                    <Play className="h-5 w-5" />
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Тёплое знакомство, чтобы вы чувствовали себя спокойнее.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
