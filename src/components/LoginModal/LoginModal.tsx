import './LoginModal.css'
import LoginForm from '../LoginForm/LoginForm'

interface LoginModalProps {
  onLogin: () => void
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  return (
    <div className="bk-overlay" role="dialog" aria-modal="true">
      <div className="bk-modal">
        <LoginForm onLogin={onLogin} />
      </div>
    </div>
  )
}
