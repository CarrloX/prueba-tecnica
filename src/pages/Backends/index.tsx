import { useNavigate, useLocation, Routes, Route } from 'react-router-dom'
import { useAuthContext } from '../../hooks/useAuthContext'
import TopBar from '../../components/TopBar/TopBar'
import Sidebar from '../../components/Sidebar/Sidebar'
import ComingSoon from '../ComingSoon'
import Bakanes from '../Bakanes'
import './index.css'

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
    <div className="container">
      <TopBar height={topbarHeight} />

      <Sidebar
        topbarHeight={topbarHeight}
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      {/* Contenido principal */}
      <div className="main-content">
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
