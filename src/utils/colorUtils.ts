// Función para generar colores aleatorios claros (excluyendo colores oscuros)
export function generateLightColor(): string {
  const colors = [
    '#FF6B6B', // Rojo claro
    '#4ECDC4', // Turquesa
    '#45B7D1', // Azul claro
    '#96CEB4', // Verde menta
    '#FECA57', // Amarillo
    '#FF9FF3', // Rosa
    '#54A0FF', // Azul
    '#5F27CD', // Morado
    '#00D2D3', // Cian
    '#FF9F43', // Naranja
    '#C44569', // Rojo rosado
    '#40407A', // Azul oscuro claro
    '#706FD3', // Lila
    '#F8EFBA', // Crema
    '#1289A7', // Azul marino claro
    '#D980FA', // Lila claro
    '#B53471', // Rosa oscuro
    '#FFC312', // Amarillo dorado
    '#C44569', // Rojo vino
    '#6C5CE7', // Azul púrpura
  ]

  return colors[Math.floor(Math.random() * colors.length)]
}
