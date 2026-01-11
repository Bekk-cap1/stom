const normalizeText = (value) => String(value || '').trim()

const truncate = (value, maxLength) => {
  const text = normalizeText(value)
  if (!text) return ''
  if (!maxLength) return text
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}

export const buildHomeSeo = ({
  doctor,
  services,
  clinicName,
  cities,
  defaultName = 'Charos',
  defaultExperienceYears = 15,
  maxDescriptionLength = 170,
} = {}) => {
  const doctorName =
    normalizeText(doctor?.user?.full_name) || normalizeText(doctor?.user?.username) || defaultName

  const experienceYearsRaw = doctor?.experience_years
  const experienceYears =
    Number.isFinite(Number(experienceYearsRaw)) && Number(experienceYearsRaw) > 0
      ? Number(experienceYearsRaw)
      : defaultExperienceYears

  const serviceTitles = Array.isArray(services)
    ? services
        .filter((service) => service && service.is_active !== false)
        .map((service) => normalizeText(service.title))
        .filter(Boolean)
    : []
  const topServices = serviceTitles.slice(0, 4).join(', ')

  const cityPart = Array.isArray(cities)
    ? cities.map((c) => normalizeText(c)).filter(Boolean).slice(0, 2).join(', ')
    : ''

  const suffix = normalizeText(clinicName) ? ` | ${normalizeText(clinicName)}` : ''
  const titleBase = `Doktor ${doctorName} — ${experienceYears} yillik tajribaga ega stomatolog`
  const title = truncate(cityPart ? `${titleBase} (${cityPart})${suffix}` : `${titleBase}${suffix}`, 70)

  const descriptionBase = `Doktor ${doctorName} (${experienceYears} yil tajriba).`
  const servicesPart = topServices ? ` Xizmatlar: ${topServices}.` : ''
  const cityHint = cityPart ? ` Manzillar: ${cityPart}.` : ''
  const ctaPart = " Konsultatsiya va qabulga yozilish uchun bog'laning."

  const description = truncate(
    `${descriptionBase}${servicesPart}${cityHint}${ctaPart}`,
    maxDescriptionLength,
  )

  return { title, description }
}

