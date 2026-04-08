import { createContext, useContext, useState, useCallback } from 'react'

interface User {
  email: string
  name: string
}

interface AuthContextValue {
  isLoggedIn: boolean
  user: User | null
  login: (email: string, name?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  isLoggedIn: false,
  user: null,
  login: () => {},
  logout: () => {},
})

const STORAGE_KEY = 'keepbiz-auth'

function loadFromStorage(): { isLoggedIn: boolean; user: User | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { isLoggedIn: false, user: null }
    const parsed = JSON.parse(raw)
    if (parsed.isLoggedIn && parsed.user) return parsed
  } catch {}
  return { isLoggedIn: false, user: null }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ isLoggedIn: boolean; user: User | null }>(loadFromStorage)

  const login = useCallback((email: string, name = 'Usuário') => {
    const user: User = { email, name }
    const next = { isLoggedIn: true, user }
    setState(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  }, [])

  const logout = useCallback(() => {
    setState({ isLoggedIn: false, user: null })
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ isLoggedIn: state.isLoggedIn, user: state.user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
