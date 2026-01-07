import { useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../api/client'
import SiteHeader from '../components/layout/SiteHeader'
import SiteFooter from '../components/layout/SiteFooter'
import SeoHead from '../components/SeoHead'
import HeroSection from '../components/sections/HeroSection'
import FeaturedWorks from '../components/sections/FeaturedWorks'
import AdvantagesSection from '../components/sections/AdvantagesSection'
import ServicesSection from '../components/sections/ServicesSection'
import PromosSection from '../components/sections/PromosSection'
import WorksSection from '../components/sections/WorksSection'
import VideosSection from '../components/sections/VideosSection'
import AboutSection from '../components/sections/AboutSection'
import ReviewsSection from '../components/sections/ReviewsSection'
import ContactSection from '../components/sections/ContactSection'
import WorkModal from '../components/sections/WorkModal'
import { workGradientPairs, seoDefaults, mediaPlaceholders } from '../data/siteData'

const normalizeImageList = (value) => {
  if (!value) return []
  const normalizeItem = (item) => {
    if (!item) return null
    if (typeof item === 'string') return item
    if (typeof item === 'object') return item.image || item.image_url || null
    return null
  }
  if (Array.isArray(value)) {
    return value.map(normalizeItem).filter(Boolean)
  }
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed) return []
    if (trimmed.startsWith('[')) {
      try {
        const parsed = JSON.parse(trimmed)
        if (Array.isArray(parsed)) return parsed.filter(Boolean)
      } catch {
        // ignore json parse errors
      }
    }
    return [trimmed]
  }
  if (typeof value === 'object') {
    const normalized = normalizeItem(value)
    return normalized ? [normalized] : []
  }
  return []
}

const toAbsoluteUrl = (value, apiBaseUrl) => {
  if (!value) return ''
  if (typeof value !== 'string') return ''
  if (/^https?:\/\//i.test(value)) return value
  if (!apiBaseUrl) return value
  const normalized = value.startsWith('/') ? value : `/${value}`
  return `${apiBaseUrl}${normalized}`
}

const getYearLabel = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  if (!Number.isNaN(date.getTime())) return String(date.getFullYear())
  const match = String(value).match(/\d{4}/)
  return match ? match[0] : '—'
}

const truncateText = (text, max = 90) => {
  const trimmed = text?.trim() || ''
  if (!trimmed) return ''
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max).trim()}...`
}

const formatMoney = (value) => {
  if (!value && value !== 0) return 'по запросу'
  return `${value} сум`
}

const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return ''
  return `${minutes} мин`
}

const formatDiscountValue = (item) => {
  if (item.discount_percent != null) return `-${item.discount_percent}%`
  if (item.discount_price) return `-${item.discount_price} сум`
  return ''
}

const formatDateRange = (start, end) => {
  const formatDate = (value) => {
    const date = new Date(value)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
    }
    return value
  }

  if (start && end) return `${formatDate(start)} - ${formatDate(end)}`
  if (end) return `до ${formatDate(end)}`
  if (start) return `с ${formatDate(start)}`
  return ''
}

const mapServicesFromApi = (items) =>
  items
    .filter((item) => item.is_active !== false)
    .map((item, index) => ({
      id: item.id,
      title: item.title,
      description: item.description || '',
      price: formatMoney(item.price),
      duration: formatDuration(item.duration_minutes),
      tag: item.is_active === false ? 'неактивно' : 'доступно',
      icon: item.title?.[0]?.toUpperCase() || String(index + 1),
    }))

const mapPromosFromApi = (items) =>
  items
    .filter((item) => item.is_active !== false)
    .map((item) => ({
      id: item.id,
      title: item.title || 'Акция',
      description: item.description || '',
      discount: formatDiscountValue(item) || 'спецусловия',
      valid: formatDateRange(item.start_date, item.end_date),
    }))

const mapReviewsFromApi = (items) =>
  items
    .filter((item) => item.is_approved !== false)
    .map((item) => ({
      id: item.id,
      name: item.user?.full_name || item.user?.username || 'Пациент',
      text: item.comment || '',
      rating: item.rating || 5,
      city: item.user?.city || '',
    }))

const mapBannersToVideos = (items, apiBaseUrl) => {
  const offers = items.filter((item) => item.position === 'offers')
  const source = offers.length ? offers : items

  return source.map((item) => ({
    id: item.id,
    title: item.title || 'Акция',
    description: item.link_url || '',
    valid: item.position_display || item.position || '',
    image: toAbsoluteUrl(item.image, apiBaseUrl),
  }))
}

const mapWorksFromApi = (apiWorks, workImages, apiBaseUrl) => {
  const imagesByWork = {}

  if (Array.isArray(workImages)) {
    workImages.forEach((item) => {
      const workId = item.work || item.work_id || item.work?.id
      if (!workId) return

      const type = item.type || item.type_display
      const imageUrl = toAbsoluteUrl(item.image || item.image_url, apiBaseUrl)
      if (!imageUrl) return

      if (!imagesByWork[workId]) {
        imagesByWork[workId] = { before: [], after: [] }
      }

      if (type === 'before' || type === 'Before') {
        imagesByWork[workId].before.push(imageUrl)
      } else if (type === 'after' || type === 'After') {
        imagesByWork[workId].after.push(imageUrl)
      }
    })
  }

  return apiWorks.map((work, index) => {
    const pair = workGradientPairs[index % workGradientPairs.length] || {
      beforeClass: 'from-slate-200/80 to-slate-100',
      afterClass: 'from-emerald-100 to-sky-100',
    }

    const serviceTitle =
      work.service?.title || work.service_title || work.service_name || 'Работа'
    const beforeFromWork = normalizeImageList(work.before_images).map((item) =>
      toAbsoluteUrl(item, apiBaseUrl),
    )
    const afterFromWork = normalizeImageList(work.after_images).map((item) =>
      toAbsoluteUrl(item, apiBaseUrl),
    )

    const imagesFromApi = imagesByWork[work.id] || { before: [], after: [] }
    const beforeImages = [...beforeFromWork, ...imagesFromApi.before].filter(Boolean)
    const afterImages = [...afterFromWork, ...imagesFromApi.after].filter(Boolean)

    return {
      id: work.id,
      title: work.title || 'Кейс',
      type: serviceTitle,
      date: getYearLabel(work.created_at),
      note: truncateText(work.description || ''),
      description: work.description || '',
      beforeImages,
      afterImages,
      beforeClass: pair.beforeClass,
      afterClass: pair.afterClass,
    }
  })
}

function Home() {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ''
  const [activeWork, setActiveWork] = useState(null)
  const [seoPage, setSeoPage] = useState(null)
  const [workItems, setWorkItems] = useState([])
  const [serviceItems, setServiceItems] = useState([])
  const [promoItems, setPromoItems] = useState([])
  const [reviewItems, setReviewItems] = useState([])
  const [doctorItems, setDoctorItems] = useState([])
  const [bannerItems, setBannerItems] = useState([])
  const [loadingSeo, setLoadingSeo] = useState(true)
  const [loadingServices, setLoadingServices] = useState(true)
  const [loadingPromos, setLoadingPromos] = useState(true)
  const [loadingReviews, setLoadingReviews] = useState(true)
  const [loadingDoctors, setLoadingDoctors] = useState(true)
  const [loadingBanners, setLoadingBanners] = useState(true)
  const [loadingWorks, setLoadingWorks] = useState(true)

  useEffect(() => {
    let isActive = true

    setLoadingSeo(true)
    apiFetch('/api/seo-pages/', { auth: false })
      .then((data) => {
        if (!isActive || !Array.isArray(data)) return
        const pageMeta =
          data.find((item) => item.page === 'home') ||
          data.find((item) => item.page === '/') ||
          null
        setSeoPage(pageMeta)
      })
      .catch(() => {})
      .finally(() => {
        if (isActive) setLoadingSeo(false)
      })

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadContent = async () => {
      setLoadingServices(true)
      setLoadingPromos(true)
      setLoadingReviews(true)
      setLoadingDoctors(true)
      setLoadingBanners(true)
      const results = await Promise.allSettled([
        apiFetch('/api/services/', { auth: false }),
        apiFetch('/api/discounts/', { auth: false }),
        apiFetch('/api/reviews/', { auth: false }),
        apiFetch('/api/doctors/', { auth: false }),
        apiFetch('/api/banners/', { auth: false }),
      ])

      if (!isActive) return

      const [servicesRes, promosRes, reviewsRes, doctorsRes, bannersRes] = results

      if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)) {
        setServiceItems(mapServicesFromApi(servicesRes.value))
      }
      if (promosRes.status === 'fulfilled' && Array.isArray(promosRes.value)) {
        setPromoItems(mapPromosFromApi(promosRes.value))
      }
      if (reviewsRes.status === 'fulfilled' && Array.isArray(reviewsRes.value)) {
        setReviewItems(mapReviewsFromApi(reviewsRes.value))
      }
      if (doctorsRes.status === 'fulfilled' && Array.isArray(doctorsRes.value)) {
        setDoctorItems(doctorsRes.value)
      }
      if (bannersRes.status === 'fulfilled' && Array.isArray(bannersRes.value)) {
        setBannerItems(bannersRes.value)
      }

      setLoadingServices(false)
      setLoadingPromos(false)
      setLoadingReviews(false)
      setLoadingDoctors(false)
      setLoadingBanners(false)
    }

    loadContent()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    let isActive = true

    const loadWorks = async () => {
      setLoadingWorks(true)
      try {
        const worksData = await apiFetch('/api/works/', { auth: false })
        if (!Array.isArray(worksData) || !worksData.length) return

        let workImagesData = []
        try {
          const imagesData = await apiFetch('/api/work-images/', { auth: false })
          if (Array.isArray(imagesData)) {
            workImagesData = imagesData
          }
        } catch {
          // Work images may require auth; keep works without photos.
        }

        const mapped = mapWorksFromApi(worksData, workImagesData, apiBaseUrl)
        if (isActive && mapped.length) {
          setWorkItems(mapped)
        }
      } catch {
        // Keep empty if API is unavailable.
      } finally {
        if (isActive) setLoadingWorks(false)
      }
    }

    loadWorks()

    return () => {
      isActive = false
    }
  }, [apiBaseUrl])

  const primaryDoctor = useMemo(() => {
    return doctorItems.find((item) => item.is_active !== false) || doctorItems[0] || null
  }, [doctorItems])

  const heroImage = useMemo(() => {
    const homeBanner =
      bannerItems.find((item) => item.position === 'home') || bannerItems[0]
    const bannerUrl = toAbsoluteUrl(homeBanner?.image, apiBaseUrl)
    return bannerUrl || mediaPlaceholders.clinic
  }, [apiBaseUrl, bannerItems])

  const doctorImage = useMemo(() => {
    const avatarUrl = toAbsoluteUrl(primaryDoctor?.user?.avatar, apiBaseUrl)
    return avatarUrl || mediaPlaceholders.doctor
  }, [apiBaseUrl, primaryDoctor])

  const videoPosts = useMemo(() => {
    const fromBanners = mapBannersToVideos(bannerItems, apiBaseUrl)
    if (fromBanners.length) return fromBanners
    return promoItems.map((promo) => ({
      ...promo,
      image: heroImage || mediaPlaceholders.announcement,
    }))
  }, [apiBaseUrl, bannerItems, heroImage, promoItems])

  const statsItems = useMemo(() => {
    const items = []
    if (doctorItems.length) {
      items.push({ value: String(doctorItems.length), label: 'врачей в команде' })
    }
    if (serviceItems.length) {
      items.push({ value: String(serviceItems.length), label: 'направлений лечения' })
    }
    if (workItems.length) {
      items.push({ value: String(workItems.length), label: 'клинических кейсов' })
    }
    if (reviewItems.length) {
      items.push({ value: String(reviewItems.length), label: 'отзывов пациентов' })
    }
    return items.slice(0, 3)
  }, [doctorItems.length, reviewItems.length, serviceItems.length, workItems.length])

  const loadingStats = useMemo(() => {
    return (
      (loadingDoctors || loadingServices || loadingWorks || loadingReviews) &&
      !statsItems.length
    )
  }, [loadingDoctors, loadingReviews, loadingServices, loadingWorks, statsItems.length])

  const isWorksLoading = loadingWorks && !workItems.length
  const isServicesLoading = loadingServices && !serviceItems.length
  const isPromosLoading = loadingPromos && !promoItems.length
  const isReviewsLoading = loadingReviews && !reviewItems.length
  const isDoctorsLoading = loadingDoctors && !doctorItems.length
  const isBannersLoading = loadingBanners && !bannerItems.length && !promoItems.length

  const advantagesItems = useMemo(() => {
    return serviceItems.slice(0, 4).map((service) => ({
      title: service.title,
      description: service.description,
    }))
  }, [serviceItems])

  const { title, description } = useMemo(() => {
    return {
      title: seoPage?.meta_title || seoDefaults.title,
      description: seoPage?.meta_description || seoDefaults.description,
    }
  }, [seoPage])

  const siteUrl =
    import.meta.env.VITE_SITE_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  const canonical = siteUrl ? `${siteUrl}/` : undefined
  const ogImage = import.meta.env.VITE_OG_IMAGE || ''

  return (
    <div className="text-[color:var(--ink)]">
      <SeoHead
        title={title}
        description={description}
        robots={seoDefaults.robots}
        canonical={canonical}
        ogType="website"
        ogUrl={canonical}
        ogImage={ogImage}
        twitterCard="summary_large_image"
      />
      <SiteHeader />
      <main>
        <HeroSection
          stats={statsItems}
          image={heroImage}
          doctor={primaryDoctor}
          loading={loadingStats}
        />
        <FeaturedWorks works={workItems} onOpenWork={setActiveWork} loading={isWorksLoading} />
        <AdvantagesSection
          advantages={advantagesItems}
          stats={statsItems}
          loading={loadingServices}
        />
        <ServicesSection services={serviceItems} loading={isServicesLoading} />
        <PromosSection promos={promoItems} loading={isPromosLoading} />
        <WorksSection works={workItems} onOpenWork={setActiveWork} loading={isWorksLoading} />
        <VideosSection
          videoPosts={videoPosts}
          image={mediaPlaceholders.announcement}
          loading={isBannersLoading}
        />
        <AboutSection image={doctorImage} doctor={primaryDoctor} loading={isDoctorsLoading} />
        <ReviewsSection testimonials={reviewItems} loading={isReviewsLoading} />
        <ContactSection />
      </main>
      <SiteFooter />
      <WorkModal work={activeWork} onClose={() => setActiveWork(null)} />
    </div>
  )
}

export default Home
