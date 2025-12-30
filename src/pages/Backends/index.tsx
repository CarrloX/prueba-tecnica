import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import TopBar from '../../components/TopBar/TopBar'
import Sidebar from '../../components/Sidebar/Sidebar'

export default function Backends() {
  const navigate = useNavigate()
  const { logout } = useAuthContext()

  const topbarHeight = 65

  const handleNavigate = (section: string) => {
    console.log('Navigate to:', section)
    // Aquí puedes agregar la lógica de navegación más adelante
  }

  const handleLogout = async () => {
    await logout()
    navigate('/') // Redirigir al login
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      <TopBar height={topbarHeight} />

      <Sidebar topbarHeight={topbarHeight} onNavigate={handleNavigate} onLogout={handleLogout} />

      {/* Contenido principal - espacio blanco ajustado para sidebar */}
      <div style={{
        position: 'absolute',
        top: `${topbarHeight}px`,
        left: '300px',
        width: 'calc(100% - 300px)',
        height: `calc(100% - ${topbarHeight}px)`,
        backgroundColor: 'white'
      }} />
    </div>
  )
}
