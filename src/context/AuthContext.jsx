import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('rf_user')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [cookieAccepted, setCookieAccepted] = useState(() => {
    return sessionStorage.getItem('rf_cookie') !== null
  })

  function login(role, name, email, provider = 'email') {
    const userData = {
      role,
      name: name || (role === 'admin' ? 'Enterprise Admin' : 'User Account'),
      email: email || (role === 'admin' ? 'admin@reportforge.com' : 'user@reportforge.com'),
      provider,
      initials: (name || (role === 'admin' ? 'EA' : 'US')).split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      loginAt: new Date().toISOString(),
    }
    setUser(userData)
    sessionStorage.setItem('rf_user', JSON.stringify(userData))
    return userData
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('rf_user')
  }

  function saveCookiePrefs(prefs) {
    const data = { accepted: true, prefs, at: new Date().toISOString() }
    sessionStorage.setItem('rf_cookie', JSON.stringify(data))
    setCookieAccepted(true)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, cookieAccepted, saveCookiePrefs }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
