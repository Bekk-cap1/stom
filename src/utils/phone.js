const onlyDigits = (value) => String(value || '').replace(/\D/g, '')

export const normalizeUzPhone = (value) => {
  const digits = onlyDigits(value)

  let national = digits
  if (digits.startsWith('998')) {
    national = digits.slice(3)
  } else if (digits.startsWith('8') && digits.length >= 10) {
    // ba'zan 8 bilan boshlanib qolishi mumkin, olib tashlaymiz
    national = digits.slice(1)
  }

  national = national.slice(0, 9)
  if (!national) return ''
  if (national.length < 2) return `+998${national}`
  return `+998${national}`
}

export const formatUzPhone = (value) => {
  const digits = onlyDigits(value)

  let national = digits
  if (digits.startsWith('998')) {
    national = digits.slice(3)
  } else if (digits.startsWith('8') && digits.length >= 10) {
    national = digits.slice(1)
  }

  national = national.slice(0, 9)

  const parts = []
  const aa = national.slice(0, 2)
  const bbb = national.slice(2, 5)
  const cc = national.slice(5, 7)
  const dd = national.slice(7, 9)

  if (aa) parts.push(aa)
  if (bbb) parts.push(bbb)
  if (cc) parts.push(cc)
  if (dd) parts.push(dd)

  return parts.length ? `+998 ${parts.join(' ')}` : '+998 '
}

export const isValidUzPhone = (value) => {
  const normalized = normalizeUzPhone(value)
  return /^\+998\d{9}$/.test(normalized)
}

