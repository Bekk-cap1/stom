import { useEffect, useMemo, useState } from 'react'
import {
  getTelegramSettings,
  sendTelegramMessage,
  setTelegramSettings,
} from '../../utils/telegram'

function AdminTelegramBotManager() {
  const [form, setForm] = useState(() => getTelegramSettings())
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const chatIdHint = useMemo(() => {
    const value = String(form.chatId || '').trim()
    if (!value) return ''
    const isNumeric = /^-?\d+$/.test(value)
    const isChannel = value.startsWith('@') || /^[A-Za-z0-9_]{5,}$/.test(value)
    if (isNumeric) return ''
    if (isChannel) {
      return "Agar kanal/guruh bo'lsa: @kanal_nomi ko'rinishida yozing (yoki shunchaki kanal nomi — avtomatik @ qo‘shiladi)."
    }
    return "Chat ID raqam bo‘lishi kerak yoki @kanal_nomi bo‘lishi kerak."
  }, [form.chatId])

  useEffect(() => {
    setForm(getTelegramSettings())
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSave = (event) => {
    event.preventDefault()
    setError('')
    setTelegramSettings(form)
    setStatus('saved')
    window.setTimeout(() => setStatus('idle'), 1200)
  }

  const handleTest = async () => {
    setError('')
    setStatus('testing')
    try {
      await sendTelegramMessage({
        botToken: form.botToken,
        chatId: form.chatId,
        text: '<b>Test xabar</b>\nTelegram bot sozlamalari ishlayapti.',
      })
      setStatus('test-ok')
      window.setTimeout(() => setStatus('idle'), 1500)
    } catch (err) {
      setError(err?.message || 'Telegram test xabari yuborilmadi')
      setStatus('idle')
    }
  }

  return (
    <section id="telegram" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
          telegram bot
        </p>
        <h3 className="mt-2 font-display text-2xl">So‘rovlarni Telegramga yuborish</h3>
        <p className="mt-2 text-sm text-[color:var(--muted)]">
          Bu sozlama faqat admin panelga kirgandan keyin mavjud bo‘ladi. Token va chat ID
          brauzerda saqlanadi.
        </p>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-4">
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3">
          <span className="text-sm font-semibold text-[color:var(--ink)]">
            Telegramga yuborishni yoqish
          </span>
          <input
            type="checkbox"
            name="enabled"
            checked={form.enabled}
            onChange={handleChange}
            className="h-5 w-5"
          />
        </label>

        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Bot token
            </label>
            <input
              name="botToken"
              value={form.botToken}
              onChange={handleChange}
              placeholder="123456:ABC-DEF..."
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Chat ID (yoki @kanal)
            </label>
            <input
              name="chatId"
              value={form.chatId}
              onChange={handleChange}
              placeholder="123456789 yoki @mychannel"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--sky)]"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5"
          >
            Saqlash
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={!form.botToken.trim() || !form.chatId.trim()}
            className="rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--ink)] shadow-soft transition hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            Test xabar yuborish
          </button>
          <span className="text-sm text-[color:var(--muted)]">
            {status === 'saved' ? 'Saqlangan' : null}
            {status === 'testing' ? 'Yuborilmoqda...' : null}
            {status === 'test-ok' ? 'Test yuborildi (Telegramdan tekshiring)' : null}
          </span>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="rounded-2xl border border-white/70 bg-white/70 p-4 text-xs text-[color:var(--muted)]">
          <p className="font-semibold text-[color:var(--ink)]">Eslatma</p>
          <p className="mt-2">
            1) Bot token’ni @BotFather orqali oling.
            <br />
            2) Bot sizga yozishi uchun avval botga Telegram’da <b>/start</b> yozing.
            <br />
            3) Eng oson yo‘l: yopiq kanal oching, botni admin qiling va bu yerga <b>@kanal_nomi</b>{' '}
            kiriting.
            <br />
            4) O‘zingizga yuborish uchun: <b>chat ID</b> raqamini topib (masalan, @userinfobot’dan)
            shu yerga yozing. Username (masalan, <b>bekk_cap1</b>) bilan private chatga yuborib
            bo‘lmaydi.
          </p>
        </div>
      </form>

      {chatIdHint ? (
        <p className="mt-4 text-sm text-amber-600">{chatIdHint}</p>
      ) : null}
    </section>
  )
}

export default AdminTelegramBotManager
