# Prueba Técnica - Gestión de Categorías

Aplicación web para gestión de categorías con autenticación de usuarios, desarrollada con React, TypeScript y Vite.

## 🌐 URLs de Producción

- **Frontend:** [https://prueba-tecnica-drab.vercel.app/login](https://prueba-tecnica-8vhnzhgt2-carloxs-projects-1b55f0fd.vercel.app/)
- **API Documentation (Swagger):** https://tekniko-latest.onrender.com/api/v1/swagger-ui/index.html#/

> ⚠️ **Nota importante:** La API en Render puede tardar aproximadamente 5 minutos en activarse después de periodos de inactividad.

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (versión 18 o superior)
- npm o yarn
- API backend corriendo (localmente o en Render)

### Instalación y Configuración

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/CarrloX/prueba-tecnica.git
   cd prueba-tecnica
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` y configura:
   ```env
   # Para desarrollo local
   VITE_API_BASE_URL=http://localhost:8080

   # Para producción (cuando uses la API en Render)
   # VITE_API_BASE_URL=https://tekniko-latest.onrender.com
   ```

4. **Ejecuta la aplicación en modo desarrollo:**
   ```bash
   npm run dev
   ```

   La aplicación estará disponible en `http://localhost:5173`

## 📜 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta ESLint para verificar código

## 🏗️ Arquitectura y Tecnologías

### Stack Tecnológico Completo

#### Frontend
- **Framework:** React 19 con TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** React Icons y Lucide React
- **Routing:** React Router DOM
- **State Management:** React Context API

#### Backend
- **Framework:** Spring Boot (Java)
- **Contenedor:** Docker
- **Despliegue:** Render
- **API:** RESTful con documentación Swagger

### Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── LoginForm/      # Formulario de login
│   ├── Sidebar/        # Navegación lateral
│   ├── TopBar/         # Barra superior
│   └── ...
├── contexts/           # Context API para estado global
│   └── AuthContext.tsx # Gestión de autenticación
├── pages/              # Páginas principales
│   ├── Home/          # Página de inicio
│   ├── Bakanes/       # Gestión de categorías
│   └── ...
├── services/           # Servicios para llamadas a API
│   └── categoriesService.ts
└── utils/              # Utilidades
```

## 🔧 Configuración de Producción

### Despliegue en Vercel

1. **Conecta tu repositorio de GitHub a Vercel**
2. **Configura las variables de entorno:**
   - Ve a Settings → Environment Variables
   - Agrega: `VITE_API_BASE_URL=https://tekniko-latest.onrender.com`
3. **Deploy automático:** Vercel detectará cambios en el repositorio y redeployeará automáticamente

### Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API backend | `https://tekniko-latest.onrender.com` |

## 🤔 Decisiones Técnicas y Supuestos

### Arquitectura
- **Separación de responsabilidades:** Servicios dedicados para llamadas a API, Context API para estado global
- **TypeScript estricto:** Para mayor robustez y mejor experiencia de desarrollo
- **Componentes modulares:** Estructura organizada por funcionalidad

### UI/UX
- **Tailwind CSS:** Para desarrollo rápido de estilos consistentes
- **Responsive Design:** Optimizado para desktop y mobile
- **Accesibilidad:** Cumple con estándares WCAG (botones con títulos descriptivos, navegación por teclado)

### Autenticación
- **JWT-based:** Sistema de autenticación stateless
- **Context API:** Gestión centralizada del estado de autenticación
- **Protección de rutas:** Redirección automática para usuarios no autenticados

### API Integration
- **Fetch API nativo:** Sin librerías adicionales para HTTP requests
- **Error handling:** Manejo robusto de errores de red y respuestas de API
- **Headers personalizados:** Envío de user ID en requests de categorías

### Supuestos
- La API backend está disponible y sigue el contrato definido
- Los usuarios tienen conexión a internet estable
- El navegador soporta ES6+ features modernos
- Las credenciales de usuario son válidas en el backend

## 📝 Notas Adicionales

- La aplicación está optimizada para rendimiento con Vite
- ESLint está configurado para mantener calidad de código
- Los archivos `.env` están ignorados por git por seguridad
- El proyecto usa TypeScript para type safety
