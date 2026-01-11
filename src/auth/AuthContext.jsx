import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { clearTokens, getAccessToken, getRefreshToken, login, setTokens } from '../api/client'

const AuthContext = createContext(null)

const decodeToken = (token) => {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

const buildUserFromToken = (token) => {
  const payload = decodeToken(token)
  if (!payload) return { username: 'admin' }
  return {
    username: payload.username || payload.email || 'admin',
    userId: payload.user_id || payload.sub || null,
    role: payload.role || null,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const accessToken = getAccessToken()
    if (!accessToken) {
      setLoading(false)
      return
    }

    const payload = decodeToken(accessToken)
    const isExpired = payload?.exp ? payload.exp * 1000 < Date.now() : false
    if (isExpired) {
      const refresh = getRefreshToken()
      if (!refresh) {
        clearTokens()
        setLoading(false)
        return
      }
    }

    setUser(buildUserFromToken(accessToken))
    setLoading(false)
  }, [])

  const handleLogin = async (credentials) => {
    const data = await login(credentials)
    if (data?.access) {
      setTokens({ access: data.access, refresh: data.refresh })
      setUser(buildUserFromToken(data.access))
    }
    return data
  }

  const handleLogout = () => {
    clearTokens()
    setUser(null)
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      login: handleLogin,
      logout: handleLogout,
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth AuthProvider ichida ishlatilishi kerak')
  }
  return context
}
