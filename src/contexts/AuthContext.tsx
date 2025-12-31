import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './authStore'
import type { User } from './authStore'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error('Error en el login')
    }
    // Respuesta incluye id y email del usuario
    const userData = await response.json()
    setUser({ id: userData.id, email: userData.email })
  }

  const register = async (email: string, password: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error('Error en el registro')
    }
    // Respuesta incluye id y email del usuario
    const userData = await response.json()
    setUser({ id: userData.id, email: userData.email })
  }

  const logout = () => {
    setUser(null)
  }

  const isAuthenticated = user !== null

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
