const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

const ACCESS_TOKEN_KEY = 'stom_access_token'
const REFRESH_TOKEN_KEY = 'stom_refresh_token'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setTokens = ({ access, refresh }) => {
  if (access) localStorage.setItem(ACCESS_TOKEN_KEY, access)
  if (refresh) localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const parseResponse = async (response) => {
  if (response.status === 204) return null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return response.json()
  }
  const text = await response.text()
  return text ? { detail: text } : null
}

const refreshAccessToken = async () => {
  const refresh = getRefreshToken()
  if (!refresh) return null

  const response = await fetch(`${API_BASE_URL}/api/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!response.ok) {
    clearTokens()
    return null
  }

  const data = await response.json()
  if (data?.access) {
    setTokens({ access: data.access, refresh })
    return data.access
  }

  clearTokens()
  return null
}

export const apiFetch = async (path, options = {}) => {
  const { method = 'GET', body, auth = true } = options
  const isFormData = body instanceof FormData

  const headers = new Headers(options.headers || {})
  headers.set('Accept', 'application/json')

  if (auth) {
    const token = getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  if (body && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body && !isFormData ? JSON.stringify(body) : body,
  })

  if (response.status === 401 && auth) {
    const refreshedToken = await refreshAccessToken()
    if (refreshedToken) {
      const retryHeaders = new Headers(headers)
      retryHeaders.set('Authorization', `Bearer ${refreshedToken}`)

      const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: retryHeaders,
        body: body && !isFormData ? JSON.stringify(body) : body,
      })

      if (!retryResponse.ok) {
        const errorBody = await parseResponse(retryResponse)
        const error = new Error(errorBody?.detail || 'So‘rov xatolik bilan yakunlandi')
        error.status = retryResponse.status
        error.body = errorBody
        throw error
      }

      return parseResponse(retryResponse)
    }
  }

  if (!response.ok) {
    const errorBody = await parseResponse(response)
    const error = new Error(errorBody?.detail || 'So‘rov xatolik bilan yakunlandi')
    error.status = response.status
    error.body = errorBody
    throw error
  }

  return parseResponse(response)
}

export const login = async ({ username, password }) => {
  const data = await apiFetch('/api/auth/login/', {
    method: 'POST',
    auth: false,
    body: { username, password },
  })

  if (data?.access) {
    setTokens({ access: data.access, refresh: data.refresh })
  }

  return data
}
