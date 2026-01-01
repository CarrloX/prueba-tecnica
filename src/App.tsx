import './App.css'
import './styles/variables.css'
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import LoginModal from './components/LoginModal/LoginModal'
import BackgroundImages from './components/BackgroundImages/BackgroundImages'
import Backends from './pages/Backends'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { useAuthContext } from './hooks/useAuthContext'

function AppContent() {
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/backends')
  }

  return (
    <div>
      <Routes>
        <Route path="/login" element={
          <div>
            <BackgroundImages />
            <LoginModal onLogin={handleLogin} />
          </div>
        } />
        <Route path="/" element={isAuthenticated ? <Backends /> : <Navigate to="/login" />} />
        <Route path="/backends/*" element={isAuthenticated ? <Backends /> : <Navigate to="/login" />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
