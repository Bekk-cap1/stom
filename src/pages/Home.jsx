import { useState } from 'react'
import SiteHeader from '../components/layout/SiteHeader'
import SiteFooter from '../components/layout/SiteFooter'
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
} from '../data/siteData'

function Home() {
  const [activeWork, setActiveWork] = useState(null)

  return (
    <div className="text-[color:var(--ink)]">
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
