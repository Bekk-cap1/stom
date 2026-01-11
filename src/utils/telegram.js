const TELEGRAM_SETTINGS_KEY = 'stom_telegram_settings'

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

export const getTelegramSettings = () => {
  if (typeof window === 'undefined') {
    return { enabled: false, botToken: '', chatId: '' }
  }

  const stored = safeParse(localStorage.getItem(TELEGRAM_SETTINGS_KEY), null)
  return {
    enabled: Boolean(stored?.enabled),
    botToken: String(stored?.botToken || ''),
    chatId: String(stored?.chatId || ''),
  }
}

export const setTelegramSettings = (next) => {
  if (typeof window === 'undefined') return
  const payload = {
    enabled: Boolean(next?.enabled),
    botToken: String(next?.botToken || '').trim(),
    chatId: String(next?.chatId || '').trim(),
  }
  localStorage.setItem(TELEGRAM_SETTINGS_KEY, safeStringify(payload))
}

const buildTelegramApiUrl = (botToken, method) => {
  const token = String(botToken || '').trim()
  if (!token) return ''
  return `https://api.telegram.org/bot${token}/${method}`
}

const normalizeChatId = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return ''
  if (/^-?\d+$/.test(raw)) return raw
  if (raw.startsWith('@')) return raw
  return `@${raw}`
}

export const sendTelegramMessage = async ({ botToken, chatId, text }) => {
  const url = buildTelegramApiUrl(botToken, 'sendMessage')
  if (!url) throw new Error('Telegram bot token yo‘q')

  const normalizedChatId = normalizeChatId(chatId)
  if (!normalizedChatId) throw new Error('Chat ID yo‘q')

  // Telegram Bot API odatda brauzerda CORS bermaydi.
  // Shuning uchun brauzerda "no-cors" GET orqali yuboramiz (javobni o‘qib bo‘lmaydi, lekin xabar ketadi).
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams()
    params.set('chat_id', normalizedChatId)
    params.set('text', String(text || ''))
    params.set('parse_mode', 'HTML')
    params.set('disable_web_page_preview', 'true')

    await fetch(`${url}?${params.toString()}`, { method: 'GET', mode: 'no-cors' })
    return { ok: true, mode: 'no-cors' }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: normalizedChatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  })

  const data = await response.json().catch(() => null)
  if (!response.ok || data?.ok === false) {
    const message = data?.description || 'Telegramga yuborib bo‘lmadi'
    const error = new Error(message)
    error.status = response.status
    error.body = data
    throw error
  }

  return data
}

const escapeHtml = (value) =>
  String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')

export const sendTelegramLead = async ({ name, phone, message, sourceUrl }) => {
  const { enabled, botToken, chatId } = getTelegramSettings()
  if (!enabled) return null
  if (!botToken || !chatId) return null

  const now = new Date()
  const timestamp = now.toLocaleString('uz-UZ', { hour12: false })

  const textParts = [
    '<b>Yangi so‘rov</b>',
    `🕒 ${escapeHtml(timestamp)}`,
    `👤 Ism: <b>${escapeHtml(name)}</b>`,
    `📞 Telefon: <b>${escapeHtml(phone)}</b>`,
  ]

  const cleanMessage = String(message || '').trim()
  if (cleanMessage) {
    textParts.push(`🩺 Shikoyat / xabar: ${escapeHtml(cleanMessage)}`)
  }

  return sendTelegramMessage({
    botToken,
    chatId,
    text: textParts.join('\n'),
  })
}
