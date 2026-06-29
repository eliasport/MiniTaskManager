import { useCallback, useMemo, useState } from 'react'
import AuthContext from './AuthContext'
import { TOKEN_KEY, USER_KEY } from '../services/api'
import * as authService from '../services/auth.service'

function readStoredUser() {
  const storedUser = localStorage.getItem(USER_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(USER_KEY)
    return null
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState(readStoredUser)

  const isAuthenticated = Boolean(token && user)

  const persistSession = useCallback((authData) => {
    localStorage.setItem(TOKEN_KEY, authData.token)
    localStorage.setItem(USER_KEY, JSON.stringify(authData.user))
    setToken(authData.token)
    setUser(authData.user)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const authData = await authService.login(credentials)
      persistSession(authData)
      return authData
    },
    [persistSession],
  )

  const register = useCallback(
    async (payload) => {
      const authData = await authService.register(payload)
      persistSession(authData)
      return authData
    },
    [persistSession],
  )

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authService.logout()
      }
    } finally {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_KEY)
      setToken(null)
      setUser(null)
    }
  }, [token])

  const value = useMemo(
    () => ({
      isAuthenticated,
      login,
      logout,
      register,
      token,
      user,
    }),
    [isAuthenticated, login, logout, register, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
