# NovaCenter Pro - Frontend

## 📖 Descripción

**NovaCenter Pro** es la interfaz administrativa para la gestión centralizada de licencias de software SaaS. Incluye autenticación JWT, control de acceso basado en roles (RBAC), panel administrativo completo y menú dinámico según permisos.

## 🛠 Stack Tecnológico

| Categoría | Tecnología |
|---|---|
| **UI** | React 19, TypeScript |
| **Build** | Vite |
| **Estilos** | CSS Vanilla (modular, sin frameworks) |
| **Estado** | Zustand (auth store) |
| **Routing** | React Router v6 |
| **Tipografías** | Space Grotesk (títulos), Inter (UI) |

## 🧠 Arquitectura

```
src/
├── components/
│   ├── DashboardLayout/       # Layout principal: sidebar dinámico + header + outlet
│   │   ├── DashboardLayout.tsx
│   │   └── DashboardLayout.css
│   ├── CreateLicense/         # Formulario de creación de licencias
│   ├── LicensesTable/         # Tabla virtualizada de licencias
│   ├── RequireAuth.tsx        # Guard de rutas (auth + roles + permisos)
│   └── Toast.tsx              # Sistema de notificaciones floating
├── hooks/
│   └── useLicenses.ts         # Hook con lógica CRUD de licencias
├── models/
│   ├── License.ts             # Interfaz de licencia
│   ├── User.ts                # Interfaz de usuario (con roles)
│   ├── Role.ts                # Interfaz de rol (con recursos)
│   ├── Resource.ts            # Interfaz de recurso del sistema
│   └── MenuItem.ts            # Interfaz de ítem del menú dinámico
├── pages/
│   ├── Login/Login.tsx        # Página de autenticación
│   ├── Dashboard.tsx          # Vista principal de licencias
│   ├── AdminUsers/            # CRUD de usuarios + asignación de roles
│   ├── AdminRoles/            # CRUD de roles + asignación de recursos
│   ├── AdminResources/        # CRUD de recursos del sistema
│   └── Admin/Admin.css        # Estilos compartidos admin (tablas, modales, badges)
├── services/
│   ├── api.ts                 # Axios instance con interceptors (refresh token)
│   ├── auth.service.ts        # Login, register, logout, refresh
│   ├── user.service.ts        # CRUD usuarios + assignRoles
│   ├── role.service.ts        # CRUD roles + assignResources
│   ├── resource.service.ts    # CRUD recursos
│   └── menu.service.ts        # Obtener menú dinámico
├── store/
│   └── authStore.ts           # Zustand: user, tokens, roles[], permissions[], helpers
├── views/
│   └── Dashboard.css          # Estilos del dashboard principal
├── index.css                  # Variables CSS globales, sistema de diseño
├── App.tsx                    # Rutas principales
└── main.tsx                   # Punto de montaje
```

## 🔐 Autenticación y RBAC

### Flujo de Login
1.  El usuario ingresa credenciales en `/login`.
2.  Backend retorna `accessToken`, `refreshToken`, y datos del usuario con `roles[]` y `permissions[]`.
3.  El store Zustand persiste tokens y datos en `localStorage`.
4.  `api.ts` intercepta respuestas 401 para renovar automáticamente con refresh token.

### Protección de Rutas
*   **`RequireAuth`**: Componente wrapper que verifica autenticación.
    *   `allowedRoles`: Restringe acceso por roles (ej: `['admin']`).
    *   `requiredPermissions`: Restringe por permisos/recursos específicos.

### Menú Dinámico
*   Al cargar `DashboardLayout`, se solicita `GET /api/menu`.
*   El backend retorna solo los recursos accesibles al usuario según sus roles.
*   El sidebar se construye dinámicamente con los ítems recibidos.

## 🎨 Sistema de Diseño

*   **Tema "Deep Space"**: Fondo oscuro con acentos vibrantes (purple/blue).
*   **Glassmorphism**: `backdrop-filter: blur()` en cards, modales y header.
*   **Variables CSS**: Sistema completo de tokens (`--color-*`, `--font-*`, etc.).
*   **Micro-animaciones**: Transiciones suaves en hover, badges pulsantes, toasts flotantes.

## 🚀 Desarrollo

### Requisitos
*   Node.js 18+
*   Backend corriendo en `http://localhost:4000`

### Comandos
```bash
npm install        # Instalar dependencias
npm run dev        # Servidor desarrollo (http://localhost:5173)
npm run build      # Build de producción (dist/)
npm run preview    # Preview del build
```

## 📌 Rutas

| Ruta | Componente | Protección | Descripción |
|------|------------|------------|-------------|
| `/login` | Login | Pública | Página de autenticación |
| `/dashboard` | Dashboard | Auth | Tabla de licencias + formulario (admin) |
| `/dashboard/licenses` | Dashboard | Admin | Gestión de licencias |
| `/dashboard/users` | AdminUsers | Admin | CRUD de usuarios |
| `/dashboard/roles` | AdminRoles | Admin | CRUD de roles |
| `/dashboard/resources` | AdminResources | Admin | CRUD de recursos |
