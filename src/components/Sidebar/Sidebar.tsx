import React, { useState } from "react";
import {
  Home,
  TrendingUp,
  Users,
  DollarSign,
  Store,
  Award,
  Files,
  Shapes,
  LogOut,
} from "lucide-react";
import BackgroundImages from "../BackgroundImages/BackgroundImages";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

interface SidebarProps {
  topbarHeight?: number;
  currentPage?: string;
  onNavigate?: (section: string) => void;
  onLogout?: () => void;
}

const Sidebar = ({
  topbarHeight = 60,
  currentPage = "home",
  onNavigate,
  onLogout,
}: SidebarProps) => {
  const menuItems = [
    { name: "Home", icon: <Home size={20} />, implemented: true },
    {
      name: "Impacto Social",
      icon: <TrendingUp size={20} />,
      implemented: true,
    },
    { name: "Comunidad", icon: <Users size={20} />, implemented: true },
    { name: "Sponsors", icon: <DollarSign size={20} />, implemented: true },
    { name: "Marketplace", icon: <Store size={20} />, implemented: true },
    { name: "Bakanes", icon: <Award size={20} />, implemented: true },
    { name: "Contenidos", icon: <Files size={20} />, implemented: true },
    {
      name: "Categorias de acciones",
      icon: <Shapes size={20} />,
      implemented: true,
    },
  ].map((item) => ({
    ...item,
    active: item.name.toLowerCase().replace(/\s+/g, "-") === currentPage,
  }));

  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);

  const handleMenuClick = (item: {
    name: string;
    implemented: boolean;
    active: boolean;
  }) => {
    if (item.implemented) {
      setShowComingSoon(null);
      onNavigate?.(item.name.toLowerCase().replace(/\s+/g, "-"));
    } else {
      setShowComingSoon(item.name);
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setShowComingSoon(null), 3000);
    }
  };

  return (
    <aside
      className="sidebar"
      style={{
        top: `${topbarHeight}px`,
        height: `calc(100vh - ${topbarHeight}px)`,
      }}
    >
      {/* --- CABECERA (IMAGEN PNG) --- */}
      <div className="sidebar-header">
        <BackgroundImages
          applyBlur={false}
          applyOverlay={false}
          backgroundColor="transparent"
          colorPalette={[
            "#FF9AA2",
            "#FFB7B2",
            "#FFDAC1",
            "#E2F0CB",
            "#B5EAD7",
            "#C7CEEA",
          ]}
        />
        <img src={logo} alt="Logo" className="sidebar-logo" />
      </div>

      {/* --- LISTA DE NAVEGACIÓN --- */}
      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div key={index} className="menu-item">
            <button
              onClick={() => handleMenuClick(item)}
              className={`menu-item-button ${item.active ? "active" : ""}`}
            >
              <span className="menu-icon">{item.icon}</span>
              <span>{item.name}</span>
            </button>

            {/* Coming soon message */}
            {showComingSoon === item.name && !item.implemented && (
              <div className="coming-soon-tooltip">Próximamente</div>
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
