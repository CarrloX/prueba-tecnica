import './LoginModal.css'
import LoginForm from '../LoginForm/LoginForm'

export default function LoginModal() {
  return (
    <div className="bk-overlay" role="dialog" aria-modal="true">
      <div className="bk-modal">
        <LoginForm />
      </div>
    </div>
  )
}
