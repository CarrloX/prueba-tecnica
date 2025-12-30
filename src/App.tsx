import './App.css'
import './styles/variables.css'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import LoginModal from './components/LoginModal/LoginModal'
import BackgroundImages from './components/BackgroundImages/BackgroundImages'
import Backends from './pages/Backends'
import { AuthProvider, useAuthContext } from './contexts/AuthContext'

function AppContent() {
  const { isAuthenticated } = useAuthContext()
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/backends')
  }

  return (
    <div>
      {!isAuthenticated && <BackgroundImages />}
      {isAuthenticated ? (
        <Routes>
          <Route path="/backends" element={<Backends />} />
          <Route path="/" element={<div />} /> {/* Default route */}
        </Routes>
      ) : (
        <LoginModal onLogin={handleLogin} />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  )
}

export default App
