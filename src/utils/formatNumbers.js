export const stripNonDigits = (value) => {
  const raw = String(value ?? '').trim()
  if (!raw) return ''

  const cleaned = raw.replace(/[^\d.,]/g, '')
  const lastDot = cleaned.lastIndexOf('.')
  const lastComma = cleaned.lastIndexOf(',')
  const lastSepIndex = Math.max(lastDot, lastComma)

  if (lastSepIndex > -1) {
    const fraction = cleaned.slice(lastSepIndex + 1)
    if (/^\d{1,2}$/.test(fraction)) {
      const integerPart = cleaned.slice(0, lastSepIndex)
      return integerPart.replace(/\D/g, '')
    }
  }

  return raw.replace(/\D/g, '')
}

export const formatNumberWithSpaces = (value) => {
  const digits = stripNonDigits(value)
  if (!digits) return ''
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export const formatDigitsInText = (value) => {
  if (value == null) return ''
  const text = String(value)
  return text.replace(/\d{4,}/g, (match) => formatNumberWithSpaces(match))
}
