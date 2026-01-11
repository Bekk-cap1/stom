function AdvantagesSection({ advantages, stats, loading }) {
  const hasAdvantages = advantages.length > 0
  const hasStats = stats.length > 0

  return (
    <section className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              afzalliklar
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Klinika xizmati + shaxsiy yondashuv
            </h2>
            <p className="mt-4 text-base text-[color:var(--muted)]">
              Birinchi konsultatsiyadan boshlab yakuniy “tabassum fotosessiyasi”gacha siz
              aniq reja, tushunarli muddatlar va har bir bosqichda qo‘llab-quvvatlash olasiz.
            </p>
            {loading && !hasAdvantages ? (
              <p className="mt-4 text-sm text-[color:var(--muted)]">Afzalliklar yuklanmoqda...</p>
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
                Statistika yuklanmoqda...
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
                Onlayn konsultatsiya
              </p>
              <p className="mt-3 text-lg font-semibold">
                Messendjerda davolash rejasini tanlash
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Suratlarni yuboring va 24 soat ichida dastlabki reja hamda smetani oling.
              </p>
              <a
                href="#contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
              >
                Konsultatsiya olish
              </a>
            </div>
            <div className="rounded-3xl border border-white/70 bg-gradient-to-br from-emerald-100/80 via-white to-sky-100/70 p-6 shadow-soft">
              <p className="text-sm font-semibold text-[color:var(--muted)]">
                Sifat nazorati
              </p>
              <p className="mt-3 text-lg font-semibold">
                Qabuldan keyin foto va video hisobot
              </p>
              <p className="mt-3 text-sm text-[color:var(--muted)]">
                Davolash natijasini ko‘rishingiz uchun barcha bosqichlar qayd etiladi.
              </p>
              <a
                href="#works"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[color:var(--sky)]"
              >
                Hisobotlarni ko‘rish
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdvantagesSection
