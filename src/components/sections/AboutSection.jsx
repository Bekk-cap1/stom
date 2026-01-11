function AboutSection({ education = [], certificates = [], image, doctor, loading }) {
  const doctorName = doctor?.user?.full_name || doctor?.user?.username || ''
  const aboutDescription =
    doctor?.bio ||
    'Estetika va funksionallikka urg‘u beradigan amaliyotchi stomatolog. Klinik protokollar va zamonaviy servisni uyg‘unlashtirgan holda isbotlangan tibbiyotga amal qiladi.'
  const experienceItem =
    doctor?.experience_years != null
      ? `Ish tajribasi: ${doctor.experience_years} yil`
      : null
  const educationItems = education.length
    ? education
    : experienceItem
      ? [experienceItem]
      : []
  const isLoading = loading && !doctor && !educationItems.length

  return (
    <section id="about" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl rounded-[36px] border border-white/70 bg-white/80 p-8 shadow-soft sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              shifokor haqida
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Oilalar ishonadigan tajriba
            </h2>
            <p className="mt-4 text-base text-[color:var(--muted)]">
              {aboutDescription}
            </p>
            {isLoading ? (
              <p className="mt-4 text-sm text-[color:var(--muted)]">Shifokor ma'lumotlari yuklanmoqda...</p>
            ) : null}
            {educationItems.length ? (
              <div className="mt-6 space-y-3 text-sm text-[color:var(--muted)]">
                {educationItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3"
                  >
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
            <blockquote className="mt-6 rounded-3xl border border-white/70 bg-white/70 p-6 text-base text-[color:var(--muted)]">
              {doctorName
                ? `"${doctorName} har bir keys va natija sifati uchun shaxsan javob beradi."`
                : '"Har bir keys — bemorning hikoyasi. Vazifam — ishonchli tabassumni qaytarish va sog‘liqni yillar davomida saqlash."'}
            </blockquote>
          </div>
          <div>
            {certificates.length ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {certificates.map((certificate) => (
                  <div
                    key={certificate}
                    className="rounded-2xl border border-white/70 bg-gradient-to-br from-white/90 to-white/70 p-4 text-sm text-[color:var(--muted)] shadow-soft"
                  >
                    <p className="font-semibold text-[color:var(--ink)]">
                      {certificate}
                    </p>
                    <p className="mt-2 text-xs">Tekshirilgan va dolzarb</p>
                  </div>
                ))}
              </div>
            ) : null}
            {image ? (
              <div className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
                <p className="text-sm font-semibold text-[color:var(--muted)]">Shifokor fotosi</p>
                <div className="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-100 via-white to-emerald-100">
                  <img
                    src={image}
                    alt="Shifokor fotosi"
                    className="h-40 w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <p className="mt-3 text-sm text-[color:var(--muted)]">
                  Yaqin tanishuv — o‘zingizni xotirjam his qilishingiz uchun.
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
