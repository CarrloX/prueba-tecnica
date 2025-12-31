import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import { useAuthContext } from '../../contexts/AuthContext'
import TopBar from '../../components/TopBar/TopBar'
import Sidebar from '../../components/Sidebar/Sidebar'
import ComingSoon from '../ComingSoon'
import Bakanes from '../Bakanes'

export default function Backends() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useAuthContext()

  const topbarHeight = 65

  const handleNavigate = (section: string) => {
    const path = section === 'home' ? '/backends' : `/backends/${section}`
    navigate(path)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/') // Redirigir al login
  }

  const getCurrentPage = () => {
    const path = location.pathname
    if (path === '/backends') return 'home'
    return path.split('/').pop() || 'home'
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

      <Sidebar
        topbarHeight={topbarHeight}
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Contenido principal */}
      <div style={{
        position: 'absolute',
        top: `${topbarHeight}px`,
        left: '300px',
        width: 'calc(100% - 300px)',
        height: `calc(100% - ${topbarHeight}px)`,
        backgroundColor: 'white'
      }}>
        <Routes>
          <Route index element={<ComingSoon />} />
          <Route path="impacto-social" element={<ComingSoon />} />
          <Route path="comunidad" element={<ComingSoon />} />
          <Route path="sponsors" element={<ComingSoon />} />
          <Route path="marketplace" element={<ComingSoon />} />
          <Route path="bakanes" element={<Bakanes />} />
          <Route path="contenidos" element={<ComingSoon />} />
          <Route path="categorias-de-acciones" element={<ComingSoon />} />
        </Routes>
      </div>
    </div>
  )
}
