function AdminOverview({ stats }) {
  return (
    <section id="overview" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            umumiy
          </p>
          <h3 className="mt-2 font-display text-2xl">Kontent holati</h3>
        </div>
        <p className="text-sm text-[color:var(--muted)]">
          Oxirgi yangilanish: bugun
        </p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/70 bg-white/75 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {item.label}
            </p>
            <p className="mt-3 text-2xl font-semibold text-[color:var(--ink)]">
              {item.value}
            </p>
            <p className="mt-2 text-xs text-[color:var(--muted)]">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminOverview
