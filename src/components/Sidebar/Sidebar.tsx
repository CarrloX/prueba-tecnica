import { useState, useRef, useEffect, useMemo } from "react";
import { LogOut } from "lucide-react";
import {
  HomeIcon,
  ImpactSocialIcon,
  CommunityIcon,
  SponsorsIcon,
  MarketplaceIcon,
  BalancesIcon,
  ContentIcon,
  ActionCategoriesIcon,
} from "./icons";
import BackgroundImages from "../BackgroundImages/BackgroundImages";
import logo from "../../assets/logo.png";
import "./Sidebar.css";

interface SidebarProps {
  topbarHeight?: number;
  currentPage?: string;
  onNavigate?: (section: string) => void;
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({
  topbarHeight = 60,
  currentPage = "home",
  onNavigate,
  onLogout,
  isOpen = false,
}: SidebarProps) => {
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [animatingIcon, setAnimatingIcon] = useState<string | null>(null);
  const sidebarRef = useRef<HTMLElement>(null);

  const colorPalette = useMemo(() => [
    "#FF9AA2",
    "#FFB7B2",
    "#FFDAC1",
    "#E2F0CB",
    "#B5EAD7",
    "#C7CEEA",
  ], []);

  const menuItems = [
    { name: "Home", icon: <HomeIcon size={20} isAnimating={animatingIcon === "Home"} />, implemented: true },
    {
      name: "Impacto Social",
      icon: <ImpactSocialIcon size={20} isAnimating={animatingIcon === "Impacto Social"} />,
      implemented: true,
    },
    { name: "Comunidad", icon: <CommunityIcon size={20} isAnimating={animatingIcon === "Comunidad"} />, implemented: true },
    { name: "Sponsors", icon: <SponsorsIcon size={20} isAnimating={animatingIcon === "Sponsors"} />, implemented: true },
    { name: "Marketplace", icon: <MarketplaceIcon size={20} isAnimating={animatingIcon === "Marketplace"} />, implemented: true },
    { name: "Bakanes", icon: <BalancesIcon size={20} isAnimating={animatingIcon === "Bakanes"} />, implemented: true },
    { name: "Contenidos", icon: <ContentIcon size={20} isAnimating={animatingIcon === "Contenidos"} />, implemented: true },
    {
      name: "Categorias de acciones",
      icon: <ActionCategoriesIcon size={20} isAnimating={animatingIcon === "Categorias de acciones"} />,
      implemented: true,
    },
  ].map((item) => ({
    ...item,
    active: item.name.toLowerCase().replace(/\s+/g, "-") === currentPage,
  }));

  useEffect(() => {
    if (sidebarRef.current) {
      sidebarRef.current.style.setProperty('--sidebar-top', `${topbarHeight}px`);
      sidebarRef.current.style.setProperty('--sidebar-height', `calc(100vh - ${topbarHeight}px)`);
    }
  }, [topbarHeight]);

  const handleMenuClick = (item: {
    name: string;
    implemented: boolean;
    active: boolean;
  }) => {
    if (item.implemented) {
      setShowComingSoon(null);
      // Activar animación del ícono
      setAnimatingIcon(item.name);
      // Desactivar animación después de 2 segundos
      setTimeout(() => setAnimatingIcon(null), 2000);

      onNavigate?.(item.name.toLowerCase().replace(/\s+/g, "-"));
    } else {
      setShowComingSoon(item.name);
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => setShowComingSoon(null), 3000);
    }
  };

  return (
    <aside
      ref={sidebarRef}
      className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}
    >
      {/* --- CABECERA (IMAGEN PNG) --- */}
      <div className="sidebar-header">
        <BackgroundImages
          applyBlur={false}
          applyOverlay={false}
          backgroundColor="transparent"
          colorPalette={colorPalette}
          enableMorphing={false}
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
