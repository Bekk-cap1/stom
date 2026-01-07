function ContactSection() {
  return (
    <section id="contact" className="px-6 pb-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              контакты
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Запишитесь удобным способом
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/998901112233"
              className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              href="https://t.me/clinic"
              className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
              target="_blank"
              rel="noreferrer"
            >
              Telegram
            </a>
          </div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <form className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Имя
                </label>
                <input
                  type="text"
                  placeholder="Ваше имя"
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                  Телефон
                </label>
                <input
                  type="tel"
                  placeholder="+998"
                  className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Сообщение
              </label>
              <textarea
                rows="4"
                placeholder="Опишите запрос или желаемое время"
                className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
              />
            </div>
            <button
              type="submit"
              className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--sky)] px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
            >
              Отправить заявку
            </button>
            <p className="mt-3 text-xs text-[color:var(--muted)]">
              Нажимая кнопку, вы соглашаетесь с обработкой персональных данных.
            </p>
          </form>
          <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft">
            <div className="space-y-4 text-sm text-[color:var(--muted)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Адрес</p>
                <p className="mt-2 text-base text-[color:var(--ink)]">
                  Ташкент, ул. Навои, 12
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">Телефон</p>
                <p className="mt-2 text-base text-[color:var(--ink)]">
                  +998 90 111 22 33
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em]">График</p>
                <p className="mt-2 text-base text-[color:var(--ink)]">
                  Пн–Сб: 09:00–20:00
                </p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl">
              <iframe
                title="Карта клиники"
                src="https://maps.google.com/maps?q=Tashkent&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="h-48 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ContactSection
