import { useMemo } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import logo from "../../assets/logo white.png";
import "./TopBar.css";

interface TopBarProps {
  height?: number;
  backgroundColor?: string;
}

export default function TopBar({
  height = 60,
  backgroundColor = "#1E1B4D",
}: TopBarProps) {
  const { user } = useAuthContext();

  // Generar color aleatorio para el avatar (se mantiene consistente por email)
  const avatarColor = useMemo(() => {
    if (!user?.email) return "#6B46C1";
    // Usar el email como seed para generar color consistente
    let hash = 0;
    for (let i = 0; i < user.email.length; i++) {
      hash = user.email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#96CEB4",
      "#FECA57",
      "#FF9FF3",
      "#54A0FF",
      "#5F27CD",
      "#00D2D3",
      "#FF9F43",
      "#C44569",
      "#40407A",
      "#706FD3",
      "#F8EFBA",
      "#1289A7",
      "#D980FA",
      "#B53471",
      "#FFC312",
      "#6C5CE7",
    ];
    return colors[Math.abs(hash) % colors.length];
  }, [user?.email]);

  // Obtener primera letra del email
  const firstLetter = user?.email?.charAt(0)?.toUpperCase() || "?";

  const dynamicClass = useMemo(() => {
    const sanitize = (s: string) => s.replace(/[^a-z0-9_-]/gi, "");
    return `topbar-${sanitize(String(height))}-${sanitize(String(backgroundColor))}-${sanitize(String(avatarColor))}`;
  }, [height, backgroundColor, avatarColor]);

  return (
    <>
      <style>{`.${dynamicClass} { height: ${height}px; background-color: ${backgroundColor}; } .${dynamicClass} .topbar__avatar { background-color: ${avatarColor}; }`}</style>
      <div className={`topbar ${dynamicClass}`}>
      {/* Logo del lado izquierdo */}
      <img src={logo} alt="Logo" className="topbar__logo" />

      {/* Avatar del lado derecho */}
      {user && (
        <div className="topbar__avatar">
          {firstLetter}
        </div>
      )}
    </div>
    </>
  );
}
