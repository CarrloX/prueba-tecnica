# Prueba Técnica - Frontend

Aplicación React + TypeScript + Vite para gestión de categorías y autenticación.

## 🚀 Despliegue en Vercel

### Variables de Entorno

La aplicación requiere la siguiente variable de entorno en Vercel:

- `VITE_API_BASE_URL`: URL base de la API (ej: `https://tu-api-en-produccion.com`)

### Configuración en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega: `VITE_API_BASE_URL` con el valor de producción
4. Redeploy para aplicar los cambios

### Archivos de Configuración

- `.env.example`: Ejemplo de variables de entorno para desarrollo local
- Los archivos `.env` están ignorados por git y no se suben al repositorio

## 🛠️ Desarrollo Local

1. Clona el repositorio
2. Copia `.env.example` a `.env`
3. Configura `VITE_API_BASE_URL` en `.env`
4. Instala dependencias: `npm install`
5. Ejecuta el servidor: `npm run dev`

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
