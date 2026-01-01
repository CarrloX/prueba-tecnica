import { useTheme } from '../../contexts/ThemeContext';
import './index.css';

export default function ComingSoon() {
  const { theme } = useTheme();

  return (
    <div className={`coming-soon-container ${theme === 'dark' ? 'dark' : ''}`}>
      <h1 className="coming-soon-title">
        Próximamente
      </h1>
      <p className="coming-soon-text">
        Esta sección estará disponible próximamente.
      </p>
    </div>
  )
}
