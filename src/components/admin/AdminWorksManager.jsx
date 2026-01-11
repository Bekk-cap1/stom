import { useState } from 'react'
import { apiFetch } from '../../api/client'

const initialForm = {
  doctor_id: '',
  service_id: '',
  title: '',
  description: '',
}

function AdminWorksManager({ works, setWorks, doctors, services }) {
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState('')
  const [beforeImages, setBeforeImages] = useState([])
  const [afterImages, setAfterImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [fileResetKey, setFileResetKey] = useState(0)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files || [])
    if (event.target.name === 'before_images') {
      setBeforeImages(files)
    } else {
      setAfterImages(files)
    }
  }

  const uploadImages = async (workId) => {
    const uploads = []

    const enqueueUploads = (files, type) => {
      files.forEach((file) => {
        const formData = new FormData()
        formData.append('image', file)
        formData.append('type', type)
        formData.append('work', String(workId))
        formData.append('work_id', String(workId))
        uploads.push(apiFetch('/api/work-images/', { method: 'POST', body: formData }))
      })
    }

    enqueueUploads(beforeImages, 'before')
    enqueueUploads(afterImages, 'after')

    if (!uploads.length) return false

    setIsUploading(true)
    try {
      await Promise.all(uploads)
      return true
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!form.title.trim() || !form.doctor_id || !form.service_id) {
      setError('Sarlavha, shifokor va xizmatni to‘ldiring')
      return
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      doctor_id: Number(form.doctor_id),
      service_id: Number(form.service_id),
    }

    try {
      const result = await apiFetch(
        editingId ? `/api/works/${editingId}/` : '/api/works/',
        { method: editingId ? 'PATCH' : 'POST', body: payload },
      )

      const workId = result?.id || editingId
      let finalResult = result

      if (workId) {
        try {
          const didUpload = await uploadImages(workId)
          if (didUpload) {
            finalResult = await apiFetch(`/api/works/${workId}/`)
          }
        } catch (uploadError) {
          setError(uploadError.message)
        }
      }

      setWorks((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? finalResult : item))
        }
        return [finalResult, ...prev]
      })

      setEditingId(null)
      setForm(initialForm)
      setBeforeImages([])
      setAfterImages([])
      setFileResetKey((prev) => prev + 1)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      doctor_id: item.doctor?.id || '',
      service_id: item.service?.id || '',
      title: item.title || '',
      description: item.description || '',
    })
    setBeforeImages([])
    setAfterImages([])
    setFileResetKey((prev) => prev + 1)
  }

  const handleDelete = async (id) => {
    setError('')
    try {
      await apiFetch(`/api/works/${id}/`, { method: 'DELETE' })
      setWorks((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        setForm(initialForm)
        setBeforeImages([])
        setAfterImages([])
        setFileResetKey((prev) => prev + 1)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section id="works" className="rounded-3xl border border-white/70 bg-white/85 p-6 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
            ishlar
          </p>
          <h3 className="mt-2 font-display text-2xl">Oldin / keyin portfeli</h3>
        </div>
        <span className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--muted)]">
          {works.length} keys
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Sarlavha
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Keys nomi"
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Shifokor
              </label>
              <select
                name="doctor_id"
                value={form.doctor_id}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              >
                <option value="">Shifokorni tanlang</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.user?.full_name || doctor.user?.username || doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
                Xizmat
              </label>
              <select
                name="service_id"
                value={form.service_id}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
              >
                <option value="">Xizmatni tanlang</option>
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.title}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Tavsif
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              placeholder="Qisqacha tavsif"
              className="mt-2 w-full resize-none rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Foto (oldin)
            </label>
            <input
              key={`before-${fileResetKey}`}
              type="file"
              name="before_images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
            />
            {beforeImages.length ? (
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Tanlangan: {beforeImages.length}
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              Foto (keyin)
            </label>
            <input
              key={`after-${fileResetKey}`}
              type="file"
              name="after_images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="mt-2 w-full rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
            />
            {afterImages.length ? (
              <p className="mt-2 text-xs text-[color:var(--muted)]">
                Tanlangan: {afterImages.length}
              </p>
            ) : null}
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          {isUploading ? (
            <p className="text-sm text-[color:var(--muted)]">Rasmlar yuklanmoqda...</p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isUploading}
              className="rounded-full bg-[color:var(--sky)] px-5 py-2 text-sm font-semibold text-white shadow-soft disabled:opacity-70"
            >
              {editingId ? 'Saqlash' : 'Ish qo‘shish'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(initialForm)
                setError('')
                setBeforeImages([])
                setAfterImages([])
                setFileResetKey((prev) => prev + 1)
              }}
              className="rounded-full border border-white/70 bg-white/80 px-5 py-2 text-sm font-semibold text-[color:var(--muted)]"
            >
              Tozalash
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 space-y-3">
        {works.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm"
          >
            <div>
              <p className="font-semibold text-[color:var(--ink)]">{item.title}</p>
              <p className="text-xs text-[color:var(--muted)]">
                {item.service?.title || `Xizmat #${item.service_id || '-'}`} ·{' '}
                {item.doctor?.user?.full_name || item.doctor?.user?.username || 'Shifokor'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                Tahrirlash
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="rounded-full border border-white/70 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--muted)]"
              >
                O‘chirish
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default AdminWorksManager
