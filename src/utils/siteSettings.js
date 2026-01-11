const SETTINGS_STORAGE_KEY = 'stom_site_settings'

const safeParse = (value, fallback) => {
  if (!value) return fallback
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const safeStringify = (value) => {
  try {
    return JSON.stringify(value)
  } catch {
    return ''
  }
}

export const getDefaultSiteSettings = () => ({
  clinicName: 'Charos',
  heroBadge: 'Charos Karabekovna',
  heroTitle: 'Doktor Charos Karabekovna',
  heroSubtitle: 'Stomatolog',
  heroDescription:
    "Stomatolog uchun zamonaviy vitrina-sayt: haqiqiy ishlar, aksiyalar va qabulga yozilish.",
  seoTitle: 'Doktor Charos - stomatologning shaxsiy sayti',
  seoDescription:
    "Stomatolog uchun zamonaviy vitrina-sayt: haqiqiy ishlar, aksiyalar va qabulga yozilish.",

  primaryLocationId: 'jizzax-1',
  locations: [
    {
      id: 'jizzax-1',
      city: 'Jizzax',
      name: 'Navoi ko‘cha 5A',
      address: "Navoi ko'cha 5A uy",
      landmark: "Mo'ljal: Davlat xizmatlar markazi",
      phones: ['+998915963599', '+998722269469'],
      mapQuery: "Jizzax Navoi ko'cha 5A uy Davlat xizmatlar markazi",
    },
    {
      id: 'toshkent-ius',
      city: 'Toshkent',
      name: 'I&Us dental clinic',
      address: 'I&Us dental clinic',
      landmark: '',
      phones: ['+998941981118'],
      mapQuery: 'Toshkent I&Us dental clinic',
    },
    {
      id: 'toshkent-ident',
      city: 'Toshkent',
      name: 'IDent dental clinic',
      address: 'IDent dental clinic',
      landmark: '',
      phones: ['+998941981118'],
      mapQuery: 'Toshkent IDent dental clinic',
    },
  ],

  // legacy (fallback) fields
  address: "Navoi ko'cha 5A uy, Jizzax",
  phone: '+998 91 596 35 99',
  whatsapp: 'https://wa.me/998915963599',
  telegram: 'https://t.me/bekk_cap1',
  instagram: 'https://instagram.com/clinic',
})

export const getSiteSettings = () => {
  const defaults = getDefaultSiteSettings()
  if (typeof window === 'undefined') return defaults

  const stored = safeParse(localStorage.getItem(SETTINGS_STORAGE_KEY), null)
  if (!stored || typeof stored !== 'object') return defaults
  return { ...defaults, ...stored }
}

export const setSiteSettings = (next) => {
  if (typeof window === 'undefined') return
  const defaults = getDefaultSiteSettings()
  const payload = { ...defaults, ...(next || {}) }

  if (payload?.locations && Array.isArray(payload.locations)) {
    payload.locations = payload.locations
      .map((loc) => ({
        id: String(loc?.id || '').trim(),
        city: String(loc?.city || '').trim(),
        name: String(loc?.name || '').trim(),
        address: String(loc?.address || '').trim(),
        landmark: String(loc?.landmark || '').trim(),
        mapQuery: String(loc?.mapQuery || '').trim(),
        phones: Array.isArray(loc?.phones)
          ? loc.phones.map((p) => String(p || '').trim()).filter(Boolean)
          : [],
      }))
      .filter((loc) => loc.id)
  }

  localStorage.setItem(SETTINGS_STORAGE_KEY, safeStringify(payload))
  window.dispatchEvent(new Event('stom:settings'))
}

export const getPrimaryLocation = (settings) => {
  const locations = Array.isArray(settings?.locations) ? settings.locations : []
  const primaryId = String(settings?.primaryLocationId || '').trim()
  if (primaryId) {
    const found = locations.find((loc) => loc?.id === primaryId)
    if (found) return found
  }
  return locations[0] || null
}

