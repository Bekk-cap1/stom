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
  clinicName: 'Charos Karabekovna stomatologiyasi',
  heroBadge: 'Charos Karabekovna',
  heroTitle: 'Doktor Charos Karabekovna',
  heroSubtitle: 'Stomatolog',
  heroDescription: 'Stomatolog uchun zamonaviy vitrina-sayt: haqiqiy ishlar, aksiyalar va qabulga yozilish.',
  seoTitle: "Doktor Charos - stomatologning shaxsiy sayti",
  seoDescription:
    "Stomatolog uchun zamonaviy vitrina-sayt: haqiqiy ishlar, aksiyalar va qabulga yozilish.",
  address: "Toshkent, Navoiy ko'chasi, 12",
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
  localStorage.setItem(SETTINGS_STORAGE_KEY, safeStringify(payload))
  window.dispatchEvent(new Event('stom:settings'))
}
