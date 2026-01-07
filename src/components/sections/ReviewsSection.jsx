import { Star } from '../ui/Icons'

function ReviewsSection({ testimonials, loading }) {
  const isLoading = loading && !(testimonials?.length > 0)

  return (
    <section id="reviews" className="px-6 pb-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              отзывы
            </p>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl">
              Пациенты делятся впечатлениями
            </h2>
          </div>
          <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
            Отзывы модерируются администратором
          </span>
        </div>
        {isLoading ? (
          <p className="mt-6 text-sm text-[color:var(--muted)]">Загружаем отзывы...</p>
        ) : null}
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {testimonials?.map((review) => (
            <div
              key={review.id || review.name}
              className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-soft"
            >
              <div className="flex items-center justify-between">
                {review.city ? (
                  <p className="text-sm font-semibold text-[color:var(--muted)]">
                    {review.city}
                  </p>
                ) : (
                  <span />
                )}
                <div className="flex gap-1 text-[color:var(--sun)]">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <Star key={index} className="h-4 w-4" />
                  ))}
                </div>
              </div>
              <p className="mt-4 text-base text-[color:var(--muted)]">{review.text}</p>
              <p className="mt-5 text-sm font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ReviewsSection
