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
import {
  stats,
  advantages,
  promos,
  services,
  works,
  videoPosts,
  testimonials,
  certificates,
  education,
  seoDefaults,
} from '../data/siteData'

function Home() {
  const [activeWork, setActiveWork] = useState(null)
  const [seoPage, setSeoPage] = useState(null)

  useEffect(() => {
    let isActive = true

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

    return () => {
      isActive = false
    }
  }, [])

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
        <HeroSection stats={stats} />
        <FeaturedWorks works={works} onOpenWork={setActiveWork} />
        <AdvantagesSection advantages={advantages} stats={stats} />
        <ServicesSection services={services} />
        <PromosSection promos={promos} />
        <WorksSection works={works} onOpenWork={setActiveWork} />
        <VideosSection videoPosts={videoPosts} />
        <AboutSection education={education} certificates={certificates} />
        <ReviewsSection testimonials={testimonials} />
        <ContactSection />
      </main>
      <SiteFooter />
      <WorkModal work={activeWork} onClose={() => setActiveWork(null)} />
    </div>
  )
}

export default Home
