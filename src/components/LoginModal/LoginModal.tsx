import React, { useState, useEffect } from 'react'
import './LoginModal.css'
import LoginForm from '../LoginForm/LoginForm'

interface LoginModalProps {
  onLogin: () => void
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  useEffect(() => {
    // Después de que termine la animación inicial (0.3s), habilitar scroll
    const timer = setTimeout(() => {
      setIsAnimated(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  const handleModeChange = (newMode: 'login' | 'register') => {
    setMode(newMode)
  }

  return (
    <div className="bk-overlay" role="dialog" aria-modal="true">
      <div className={`bk-modal ${isAnimated ? 'animated' : ''} ${mode === 'register' ? 'register-mode' : 'login-mode'}`}>
        <LoginForm onLogin={onLogin} onModeChange={handleModeChange} />
      </div>
    </div>
  )
}
