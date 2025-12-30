import React, { useMemo } from 'react'
import { useAuthContext } from '../../contexts/AuthContext'
import logo from '../../assets/logo.png'

interface TopBarProps {
  height?: number
  backgroundColor?: string
}

export default function TopBar({
  height = 60,
  backgroundColor = '#1E1B4D'
}: TopBarProps) {
  const { user } = useAuthContext()

  // Generar color aleatorio para el avatar (se mantiene consistente por email)
  const avatarColor = useMemo(() => {
    if (!user?.email) return '#6B46C1'
    // Usar el email como seed para generar color consistente
    let hash = 0
    for (let i = 0; i < user.email.length; i++) {
      hash = user.email.charCodeAt(i) + ((hash << 5) - hash)
    }
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
      '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
      '#C44569', '#40407A', '#706FD3', '#F8EFBA', '#1289A7',
      '#D980FA', '#B53471', '#FFC312', '#6C5CE7'
    ]
    return colors[Math.abs(hash) % colors.length]
  }, [user?.email])

  // Obtener primera letra del email
  const firstLetter = user?.email?.charAt(0)?.toUpperCase() || '?'

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: `${height}px`,
      backgroundColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 10px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      zIndex: 10
    }}>
      {/* Logo del lado izquierdo */}
      <img
        src={logo}
        alt="Logo"
        style={{
          height: '40px',
          width: 'auto',
          marginLeft: '10px'
        }}
      />

      {/* Avatar del lado derecho */}
      {user && (
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: avatarColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '18px',
          cursor: 'pointer',
          border: '2px solid rgba(255,255,255,0.3)',
          marginRight: '50px',
          flexShrink: 0
        }}>
          {firstLetter}
        </div>
      )}
    </div>
  )
}
