import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--surface)] px-6 text-center">
      <div className="max-w-md rounded-3xl border border-white/70 bg-white/85 p-10 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
          404
        </p>
        <h1 className="mt-3 font-display text-3xl">Страница не найдена</h1>
        <p className="mt-3 text-sm text-[color:var(--muted)]">
          Похоже, вы перешли по неверной ссылке.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-[color:var(--sky)] px-6 py-2 text-sm font-semibold text-white shadow-soft"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}

export default NotFound
