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
import AdminReviewsManager from '../components/admin/AdminReviewsManager'
import AdminSeoPagesManager from '../components/admin/AdminSeoPagesManager'
import AdminServicesManager from '../components/admin/AdminServicesManager'
import AdminWorksManager from '../components/admin/AdminWorksManager'

function Admin() {
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [works, setWorks] = useState([])
  const [banners, setBanners] = useState([])
  const [discounts, setDiscounts] = useState([])
  const [reviews, setReviews] = useState([])
  const [seoPages, setSeoPages] = useState([])
  const [appointments, setAppointments] = useState([])
  const [contactRequests, setContactRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')

    try {
      const [
        doctorsData,
        servicesData,
        worksData,
        bannersData,
        discountsData,
        reviewsData,
        seoPagesData,
        appointmentsData,
        contactRequestsData,
      ] = await Promise.all([
        apiFetch('/api/doctors/'),
        apiFetch('/api/services/'),
        apiFetch('/api/works/'),
        apiFetch('/api/banners/'),
        apiFetch('/api/discounts/'),
        apiFetch('/api/reviews/'),
        apiFetch('/api/seo-pages/'),
        apiFetch('/api/appointments/'),
        apiFetch('/api/contact-requests/'),
      ])

      setDoctors(doctorsData || [])
      setServices(servicesData || [])
      setWorks(worksData || [])
      setBanners(bannersData || [])
      setDiscounts(discountsData || [])
      setReviews(reviewsData || [])
      setSeoPages(seoPagesData || [])
      setAppointments(appointmentsData || [])
      setContactRequests(contactRequestsData || [])
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

  return (
    <>
      <SeoHead
        title="Админ-панель стоматологической клиники"
        description="Управление контентом, услугами и заявками клиники."
        robots="noindex, nofollow"
        ogType="website"
      />
      <AdminLayout>
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
        <AdminDoctorsManager doctors={doctors} setDoctors={setDoctors} />
        <AdminServicesManager services={services} setServices={setServices} />
        <AdminWorksManager
          works={works}
          setWorks={setWorks}
          doctors={doctors}
          services={services}
        />
        <AdminBannersManager banners={banners} setBanners={setBanners} />
        <AdminDiscountsManager
          discounts={discounts}
          setDiscounts={setDiscounts}
          services={services}
        />
        <AdminReviewsManager
          reviews={reviews}
          setReviews={setReviews}
          doctors={doctors}
          works={works}
        />
        <AdminSeoPagesManager seoPages={seoPages} setSeoPages={setSeoPages} />
        <AdminAppointmentsManager
          appointments={appointments}
          setAppointments={setAppointments}
        />
        <AdminContactRequestsManager
          requests={contactRequests}
          setRequests={setContactRequests}
        />
      </AdminLayout>
    </>
  )
}

export default Admin
