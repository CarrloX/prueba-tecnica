import React, { useState } from 'react';
import {
  Home,
  TrendingUp,
  Users,
  DollarSign,
  Store,
  Award,
  Files,
  Shapes,
  LogOut
} from 'lucide-react';
import './Sidebar.css';

interface SidebarProps {
  onNavigate?: (section: string) => void
  onLogout?: () => void
}

const Sidebar = ({ onNavigate, onLogout }: SidebarProps) => {
  const menuItems = [
    { name: 'Home', icon: <Home size={20} />, active: false },
    { name: 'Impacto Social', icon: <TrendingUp size={20} />, active: false },
    { name: 'Comunidad', icon: <Users size={20} />, active: false },
    { name: 'Sponsors', icon: <DollarSign size={20} />, active: false },
    { name: 'Marketplace', icon: <Store size={20} />, active: false },
    { name: 'Bakanes', icon: <Award size={20} />, active: false },
    { name: 'Contenidos', icon: <Files size={20} />, active: false },
    { name: 'Categorias de acciones', icon: <Shapes size={20} />, active: false },
  ];

  const [showComingSoon, setShowComingSoon] = useState<string | null>(null)

  const handleMenuClick = (item: { name: string; active: boolean }) => {
    if (item.active) {
      setShowComingSoon(null)
      onNavigate?.(item.name.toLowerCase().replace(/\s+/g, '-'))
    } else {
      setShowComingSoon(item.name)
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setShowComingSoon(null), 3000)
    }
  }

  return (
    <aside className="sidebar">
      {/* --- CABECERA (IMAGEN PNG) --- */}
      <div className="sidebar-header">
        <img
          src="/background-assets/image.png"
          alt="Be Kind Network Banner"
        />
      </div>

      {/* --- LISTA DE NAVEGACIÓN --- */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <button
              onClick={() => handleMenuClick(item)}
              className={`menu-item-button ${item.active ? 'active' : ''}`}
            >
              <span className="menu-icon">
                {item.icon}
              </span>
              <span>
                {item.name}
              </span>
            </button>

            {/* Coming soon message */}
            {showComingSoon === item.name && !item.active && (
              <div className="coming-soon-tooltip">
                Próximamente
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* --- PIE DE PÁGINA --- */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={onLogout}>
          <span className="logout-icon">
            <LogOut size={20} />
          </span>
          <span>Cerrar sesión</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
