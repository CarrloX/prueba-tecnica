import React, { useState } from 'react'
import './LoginForm.css'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import logo from '../../assets/logo.png'
import logoWhite from '../../assets/logo white.png'

interface LoginFormProps {
  onLogin: () => void
  onModeChange?: (mode: 'login' | 'register') => void
}

export default function LoginForm({ onLogin, onModeChange }: LoginFormProps) {
  const { login, register } = useAuthContext()
  const { theme } = useTheme()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentLogo = theme === 'dark' ? logoWhite : logo

  const isValid = mode === 'login'
    ? email.length > 0 && password.length > 0
    : email.length > 0 && password.length > 0 && password === confirmPassword

  function handleModeChange(newMode: 'login' | 'register') {
    setMode(newMode)
    onModeChange?.(newMode)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    setLoading(true)
    setError(null)
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, password)
      }
      onLogin() // Navigate to backends page
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="bk-form" onSubmit={handleSubmit} noValidate>
      <div className="bk-logo">
        <img src={currentLogo} alt="Logo" className="bk-logo-image" />
      </div>
      <h3 className="bk-title">¡Empieza a conectar tu comunidad ante buenas acciones!</h3>

      <label className="bk-label">Correo Electrónico*</label>
      <div className="bk-input-row">
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="bk-icon">
          <path d="M13.3333 1.33333C13.3333 0.6 12.7333 0 12 0H1.33333C0.6 0 0 0.6 0 1.33333V9.33333C0 10.0667 0.6 10.6667 1.33333 10.6667H12C12.7333 10.6667 13.3333 10.0667 13.3333 9.33333V1.33333ZM12 1.33333L6.66667 4.66L1.33333 1.33333H12ZM12 9.33333H1.33333V2.66667L6.66667 6L12 2.66667V9.33333Z" fill="#1840B2"/>
        </svg>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresar correo"
          required
        />
      </div>

      <label className="bk-label">Contraseña*</label>
      <div className="bk-input-row">
        <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="bk-icon">
          <path d="M9.33333 4.66667H8.66667V3.33333C8.66667 1.49333 7.17333 0 5.33333 0C3.49333 0 2 1.49333 2 3.33333V4.66667H1.33333C0.6 4.66667 0 5.26667 0 6V12.6667C0 13.4 0.6 14 1.33333 14H9.33333C10.0667 14 10.6667 13.4 10.6667 12.6667V6C10.6667 5.26667 10.0667 4.66667 9.33333 4.66667ZM3.33333 3.33333C3.33333 2.22667 4.22667 1.33333 5.33333 1.33333C6.44 1.33333 7.33333 2.22667 7.33333 3.33333V4.66667H3.33333V3.33333ZM9.33333 12.6667H1.33333V6H9.33333V12.6667ZM5.33333 10.6667C6.06667 10.6667 6.66667 10.0667 6.66667 9.33333C6.66667 8.6 6.06667 8 5.33333 8C4.6 8 4 8.6 4 9.33333C4 10.0667 4.6 10.6667 5.33333 10.6667Z" fill="#1840B2"/>
        </svg>
        <input
          type={show ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
        <button type="button" className="bk-icon-btn" onClick={() => setShow((s) => !s)} aria-label="Mostrar contraseña">
          {show ? <FiEyeOff /> : <FiEye />}
        </button>
      </div>

      {mode === 'register' && (
        <>
          <label className="bk-label">Confirmar Contraseña*</label>
          <div className="bk-input-row">
            <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="bk-icon">
              <path d="M9.33333 4.66667H8.66667V3.33333C8.66667 1.49333 7.17333 0 5.33333 0C3.49333 0 2 1.49333 2 3.33333V4.66667H1.33333C0.6 4.66667 0 5.26667 0 6V12.6667C0 13.4 0.6 14 1.33333 14H9.33333C10.0667 14 10.6667 13.4 10.6667 12.6667V6C10.6667 5.26667 10.0667 4.66667 9.33333 4.66667ZM3.33333 3.33333C3.33333 2.22667 4.22667 1.33333 5.33333 1.33333C6.44 1.33333 7.33333 2.22667 7.33333 3.33333V4.66667H3.33333V3.33333ZM9.33333 12.6667H1.33333V6H9.33333V12.6667ZM5.33333 10.6667C6.06667 10.6667 6.66667 10.0667 6.66667 9.33333C6.66667 8.6 6.06667 8 5.33333 8C4.6 8 4 8.6 4 9.33333C4 10.0667 4.6 10.6667 5.33333 10.6667Z" fill="#1840B2"/>
            </svg>
            <input
              type={show ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma tu contraseña"
              required
            />
          </div>
        </>
      )}

      <div className="bk-helper">
        {mode === 'login' ? (
          <a href="#" onClick={(e) => { e.preventDefault(); handleModeChange('register'); }}>¿No tienes cuenta? Regístrate</a>
        ) : (
          <a href="#" onClick={(e) => { e.preventDefault(); handleModeChange('login'); }}>¿Ya tienes cuenta? Inicia sesión</a>
        )}
      </div>

      {error && <div className="bk-error">{error}</div>}

      <button className={`bk-submit ${loading ? 'loading' : ''}`} type="submit" disabled={!isValid || loading}>
        {loading ? (mode === 'login' ? 'Ingresando...' : 'Registrando...') : (mode === 'login' ? 'Ingresar' : 'Registrar')}
      </button>
    </form>
  )
}
