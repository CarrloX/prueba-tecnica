export default function useAuth() {
  async function login() {
    // Mock: acepta cualquier credential (sin validación)
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve() // Siempre acepta
      }, 900)
    })
  }

  return { login }
}
