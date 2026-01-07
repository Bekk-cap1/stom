import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../api/client'
import SeoHead from '../components/SeoHead'
import AdminAppointmentsManager from '../components/admin/AdminAppointmentsManager'
import AdminBannersManager from '../components/admin/AdminBannersManager'
import AdminContactRequestsManager from '../components/admin/AdminContactRequestsManager'
import AdminDiscountsManager from '../components/admin/AdminDiscountsManager'
import AdminDoctorsManager from '../components/admin/AdminDoctorsManager'
import AdminLayout from '../components/admin/AdminLayout'
import AdminOverview from '../components/admin/AdminOverview'
import AdminPatientsManager from '../components/admin/AdminPatientsManager'
import AdminPatientsStats from '../components/admin/AdminPatientsStats'
import AdminReviewsManager from '../components/admin/AdminReviewsManager'
import AdminSeoPagesManager from '../components/admin/AdminSeoPagesManager'
import AdminServicesManager from '../components/admin/AdminServicesManager'
import AdminUsersManager from '../components/admin/AdminUsersManager'
import AdminWorksManager from '../components/admin/AdminWorksManager'

function Admin() {
  const usersStorageKey = 'stom_users'
  const patientStorageKey = 'stom_patients'
  const [users, setUsers] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(usersStorageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [works, setWorks] = useState([])
  const [banners, setBanners] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [reviews, setReviews] = useState([])
  const [seoPages, setSeoPages] = useState([])
  const [appointments, setAppointments] = useState([])
  const [contactRequests, setContactRequests] = useState([])
  const [patients, setPatients] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(patientStorageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [sectionAccess, setSectionAccess] = useState({
    users: true,
    doctors: true,
    services: true,
    works: true,
    banners: true,
    discounts: true,
    reviews: true,
    seo: true,
    appointments: true,
    contacts: true,
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(usersStorageKey, JSON.stringify(users))
  }, [usersStorageKey, users])

  useEffect(() => {
    if (typeof window === 'undefined') return
    localStorage.setItem(patientStorageKey, JSON.stringify(patients))
  }, [patientStorageKey, patients])

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const endpoints = [
        { key: 'doctors', path: '/api/doctors/', setter: setDoctors },
        { key: 'services', path: '/api/services/', setter: setServices },
        { key: 'works', path: '/api/works/', setter: setWorks },
        { key: 'banners', path: '/api/banners/', setter: setBanners },
        { key: 'discounts', path: '/api/discounts/', setter: setDiscounts },
        { key: 'reviews', path: '/api/reviews/', setter: setReviews },
        { key: 'seo', path: '/api/seo-pages/', setter: setSeoPages },
        { key: 'appointments', path: '/api/appointments/', setter: setAppointments },
        { key: 'contacts', path: '/api/contact-requests/', setter: setContactRequests },
      ]

      await Promise.all(
        endpoints.map(async ({ key, path, setter }) => {
          try {
            const data = await apiFetch(path)
            setter(Array.isArray(data) ? data : [])
            setSectionAccess((prev) => ({ ...prev, [key]: true }))
          } catch (err) {
            setter([])
            if ([401, 403, 404].includes(err?.status)) {
              setSectionAccess((prev) => ({ ...prev, [key]: false }))
            } else {
              setError(err.message)
            }
          }
        }),
      )
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const overviewStats = useMemo(() => {
    return [
      { label: 'Работы', value: works.length, note: 'кейсов' },
      {
        label: 'Услуги',
        value: services.filter((item) => item.is_active !== false).length,
        note: 'активных',
      },
      {
        label: 'Акции',
        value: discounts.filter((item) => item.is_active !== false).length,
        note: 'в эфире',
      },
      {
        label: 'Отзывы',
        value: reviews.filter((item) => item.is_approved).length,
        note: 'одобрено',
      },
    ]
  }, [discounts, reviews, services, works])

  const navItems = useMemo(() => {
    const items = [
      { id: 'overview', label: 'Обзор' },
      { id: 'patients', label: 'Пациенты' },
      { id: 'users', label: 'Пользователи' },
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

    return items.filter((item) => sectionAccess[item.id] !== false)
  }, [sectionAccess])

  return (
    <>
      <SeoHead
        title="Админ-панель стоматологической клиники"
        description="Управление контентом, услугами и заявками клиники."
        robots="noindex, nofollow"
        ogType="website"
      />
      <AdminLayout navItems={navItems}>
        <AdminOverview stats={overviewStats} />
        {error ? (
          <div className="rounded-3xl border border-red-100 bg-red-50/80 p-4 text-sm text-red-500">
            {error}
          </div>
        ) : null}
        {loading ? (
          <div className="rounded-3xl border border-white/70 bg-white/85 p-6 text-sm text-[color:var(--muted)]">
            Загружаем данные из API...
          </div>
        ) : null}
        <AdminPatientsStats patients={patients} />
        <AdminPatientsManager patients={patients} setPatients={setPatients} />
        {sectionAccess.users !== false ? (
          <AdminUsersManager users={users} setUsers={setUsers} />
        ) : null}
        {sectionAccess.doctors !== false ? (
          <AdminDoctorsManager doctors={doctors} setDoctors={setDoctors} users={users} />
        ) : null}
        {sectionAccess.services !== false ? (
          <AdminServicesManager services={services} setServices={setServices} />
        ) : null}
        {sectionAccess.works !== false ? (
          <AdminWorksManager
            works={works}
            setWorks={setWorks}
            doctors={doctors}
            services={services}
          />
        ) : null}
        {sectionAccess.banners !== false ? (
          <AdminBannersManager banners={banners} setBanners={setBanners} />
        ) : null}
        {sectionAccess.discounts !== false ? (
          <AdminDiscountsManager
            discounts={discounts}
            setDiscounts={setDiscounts}
            services={services}
          />
        ) : null}
        {sectionAccess.reviews !== false ? (
          <AdminReviewsManager
            reviews={reviews}
            setReviews={setReviews}
            doctors={doctors}
            works={works}
          />
        ) : null}
        {sectionAccess.seo !== false ? (
          <AdminSeoPagesManager seoPages={seoPages} setSeoPages={setSeoPages} />
        ) : null}
        {sectionAccess.appointments !== false ? (
          <AdminAppointmentsManager
            appointments={appointments}
            setAppointments={setAppointments}
          />
        ) : null}
        {sectionAccess.contacts !== false ? (
          <AdminContactRequestsManager
            requests={contactRequests}
            setRequests={setContactRequests}
          />
        ) : null}
      </AdminLayout>
    </>
  )
}

export default Admin
