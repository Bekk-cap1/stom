const normalizeText = (value) => String(value || '').trim()

const uniq = (items) => Array.from(new Set(items.filter(Boolean)))

const toGoogleMapsSearchUrl = (query) => {
  const q = normalizeText(query)
  if (!q) return ''
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
}

const toPostalAddress = (loc) => {
  if (!loc) return null
  const city = normalizeText(loc.city)
  const street = normalizeText(loc.address) || normalizeText(loc.name)
  const landmark = normalizeText(loc.landmark)

  const addressLocality = city || undefined
  const streetAddress = street || undefined

  if (!addressLocality && !streetAddress && !landmark) return null

  const postal = {
    '@type': 'PostalAddress',
    addressCountry: 'UZ',
  }
  if (addressLocality) postal.addressLocality = addressLocality
  if (streetAddress) postal.streetAddress = streetAddress
  if (landmark) postal.description = landmark

  return postal
}

export const buildDentistJsonLd = ({
  siteUrl,
  canonical,
  title,
  description,
  clinicName,
  doctorName,
  experienceYears,
  locations,
  socials,
  phones,
  ogImage,
  defaultStart = '09:00',
  defaultEnd = '20:00',
  services,
} = {}) => {
  const url = canonical || siteUrl || ''
  const idBase = siteUrl || url || ''

  const name =
    normalizeText(clinicName) ||
    (normalizeText(doctorName) ? `Doktor ${normalizeText(doctorName)}` : 'Stomatologiya')

  const cleanLocations = Array.isArray(locations) ? locations.filter(Boolean) : []
  const addresses = cleanLocations.map(toPostalAddress).filter(Boolean)
  const mapUrls = cleanLocations
    .map((loc) => toGoogleMapsSearchUrl(loc.mapQuery || loc.address || loc.name))
    .filter(Boolean)

  const cleanPhones = uniq(
    (Array.isArray(phones) ? phones : [])
      .map((p) => normalizeText(p))
      .map((p) => (p.startsWith('+') ? p : p ? `+${p.replace(/\D/g, '')}` : '')),
  )

  const sameAs = uniq(
    (Array.isArray(socials) ? socials : [])
      .map((u) => normalizeText(u))
      .filter((u) => /^https?:\/\//i.test(u)),
  )

  const cityList = uniq(cleanLocations.map((loc) => normalizeText(loc.city)).filter(Boolean))

  const offerItems = Array.isArray(services)
    ? services
        .map((s) => normalizeText(s?.title || s?.name))
        .filter(Boolean)
        .slice(0, 10)
        .map((serviceTitle) => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: serviceTitle },
        }))
    : []

  const openingHours = defaultStart && defaultEnd ? [`Mo-Su ${defaultStart}-${defaultEnd}`] : []

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Dentist',
        '@id': idBase ? `${idBase}#clinic` : undefined,
        name,
        url: url || undefined,
        description: normalizeText(description) || undefined,
        image: normalizeText(ogImage) || undefined,
        telephone: cleanPhones.length ? cleanPhones : undefined,
        address: addresses.length === 1 ? addresses[0] : addresses.length ? addresses : undefined,
        areaServed: cityList.length ? cityList : undefined,
        hasMap: mapUrls[0] || undefined,
        sameAs: sameAs.length ? sameAs : undefined,
        openingHours: openingHours.length ? openingHours : undefined,
        makesOffer: offerItems.length ? offerItems : undefined,
      },
      normalizeText(doctorName)
        ? {
            '@type': 'Person',
            '@id': idBase ? `${idBase}#doctor` : undefined,
            name: normalizeText(doctorName),
            jobTitle: 'Stomatolog',
            description:
              typeof experienceYears === 'number' && experienceYears > 0
                ? `${experienceYears} yillik tajribaga ega stomatolog.`
                : undefined,
            url: url || undefined,
            worksFor: idBase ? { '@id': `${idBase}#clinic` } : undefined,
            sameAs: sameAs.length ? sameAs : undefined,
          }
        : null,
    ].filter(Boolean),
  }
}

