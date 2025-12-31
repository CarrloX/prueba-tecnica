import React, { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'

interface User {
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:8080/api/v1/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error('Error en el login')
    }
    // Asumimos que devuelve UserBasicResponse con email
    const userData = await response.json()
    setUser({ email: userData.email })
  }

  const register = async (email: string, password: string) => {
    const response = await fetch('http://localhost:8080/api/v1/user/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    if (!response.ok) {
      throw new Error('Error en el registro')
    }
    // Asumimos que UserBasicResponse tiene email
    const userData = await response.json()
    setUser({ email: userData.email })
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

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
