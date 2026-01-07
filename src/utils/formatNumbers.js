export const stripNonDigits = (value) => String(value ?? '').replace(/\D/g, '')

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
