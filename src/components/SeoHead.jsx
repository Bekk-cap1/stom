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
  }, [
    canonical,
    description,
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
