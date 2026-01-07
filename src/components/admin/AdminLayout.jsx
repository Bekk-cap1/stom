import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'

const navItems = [
  { id: 'overview', label: 'Обзор' },
  { id: 'doctors', label: 'Врачи' },
  { id: 'services', label: 'Услуги' },
  { id: 'works', label: 'Работы' },
  { id: 'banners', label: 'Баннеры' },
  { id: 'discounts', label: 'Акции' },
  { id: 'reviews', label: 'Отзывы' },
  { id: 'seo', label: 'SEO' },
  { id: 'appointments', label: 'Записи' },
  { id: 'contacts', label: 'Контакты' },
]

function AdminLayout({ children }) {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-[color:var(--surface)] text-[color:var(--ink)]">
      <div className="mx-auto flex w-full max-w-7xl gap-6 px-6 pb-16 pt-10">
        <aside className="hidden w-64 shrink-0 flex-col gap-4 lg:flex">
          <div className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
              admin
            </p>
            <h1 className="mt-3 font-display text-2xl">Панель управления</h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">
              Пользователь: {user?.username || 'admin'}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/"
                className="inline-flex items-center text-sm font-semibold text-[color:var(--sky)]"
              >
                ← На сайт
              </Link>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-semibold text-[color:var(--muted)]"
              >
                Выйти
              </button>
            </div>
          </div>
          <nav className="rounded-3xl border border-white/70 bg-white/85 p-4 shadow-soft">
            <ul className="space-y-2 text-sm font-medium text-[color:var(--muted)]">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="flex items-center justify-between rounded-2xl border border-transparent px-3 py-2 transition hover:border-white/70 hover:bg-white/70 hover:text-[color:var(--ink)]"
                  >
                    {item.label}
                    <span className="text-xs">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div className="flex-1 space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/70 bg-white/85 px-6 py-4 shadow-soft">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted)]">
                Админ-панель
              </p>
              <h2 className="mt-1 font-display text-2xl">Контент и настройки</h2>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)] shadow-soft transition hover:-translate-y-0.5"
              >
                Вернуться на сайт
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-full bg-[color:var(--sky)] px-4 py-2 text-xs font-semibold text-white shadow-soft"
              >
                Выйти
              </button>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
