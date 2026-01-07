function WorkModal({ work, onClose }) {
  if (!work) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-6 py-10"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-3xl border border-white/30 bg-white/95 p-6 shadow-soft"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-[color:var(--muted)]">
              {work.type} · {work.date}
            </p>
            <h3 className="mt-2 text-2xl font-semibold">{work.title}</h3>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{work.note}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]"
          >
            Закрыть
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {['до', 'после'].map((label, index) => (
            <div
              key={label}
              className={`relative h-44 overflow-hidden rounded-2xl bg-gradient-to-br ${
                index === 0 ? work.beforeClass : work.afterClass
              }`}
            >
              <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                {label}
              </span>
            </div>
          ))}
        </div>
        {work.mediaType === 'video' ? (
          <div className="mt-5 overflow-hidden rounded-2xl bg-slate-900">
            <video className="h-52 w-full object-cover" controls preload="metadata">
              <source src="/video/case.mp4" type="video/mp4" />
              <source src="/video/case.webm" type="video/webm" />
            </video>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default WorkModal
