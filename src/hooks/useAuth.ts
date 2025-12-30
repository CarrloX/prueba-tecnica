type Creds = { email: string; password: string }

export default function useAuth() {
  async function login(creds: Creds) {
    // Mock: acepta cualquier credential con password length >=6
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (creds.password.length >= 6) resolve()
        else reject(new Error('Contraseña demasiado corta'))
      }, 900)
    })
  }

  return { login }
}
