import { useEffect } from 'react'

const upsertMeta = (attribute, key, content) => {
  if (!content) return
  let element = document.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

const upsertLink = (rel, href) => {
  if (!href) return
  let element = document.querySelector(`link[rel="${rel}"]`)
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

const upsertJsonLd = (value) => {
  const existing = document.querySelector('script[type="application/ld+json"][data-seo="jsonld"]')
  if (!value) {
    if (existing) existing.remove()
    return
  }

  const text = typeof value === 'string' ? value : JSON.stringify(value)
  if (!text) return

  const element = existing || document.createElement('script')
  element.setAttribute('type', 'application/ld+json')
  element.setAttribute('data-seo', 'jsonld')
  element.textContent = text
  if (!existing) document.head.appendChild(element)
}

function SeoHead({
  title,
  description,
  robots,
  canonical,
  ogTitle,
  ogDescription,
  ogType,
  ogUrl,
  ogImage,
  twitterCard,
  jsonLd,
}) {
  useEffect(() => {
    if (title) document.title = title
    upsertMeta('name', 'description', description)
    upsertMeta('name', 'robots', robots)

    upsertLink('canonical', canonical)

    upsertMeta('property', 'og:type', ogType)
    upsertMeta('property', 'og:title', ogTitle || title)
    upsertMeta('property', 'og:description', ogDescription || description)
    upsertMeta('property', 'og:url', ogUrl || canonical)
    upsertMeta('property', 'og:image', ogImage)

    upsertMeta('name', 'twitter:card', twitterCard)
    upsertMeta('name', 'twitter:title', ogTitle || title)
    upsertMeta('name', 'twitter:description', ogDescription || description)
    upsertMeta('name', 'twitter:image', ogImage)

    upsertJsonLd(jsonLd)
  }, [
    canonical,
    description,
    jsonLd,
    ogDescription,
    ogImage,
    ogTitle,
    ogType,
    ogUrl,
    robots,
    title,
    twitterCard,
  ])

  return null
}

export default SeoHead

