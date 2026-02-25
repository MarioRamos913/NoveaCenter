# NovaCenter - Sistema de Gestión de Licencias

Bienvenido a **NovaCenter**, un sistema moderno y centralizado para la generación, administración y validación de licencias de software. Diseñado con una arquitectura modular que incluye **autenticación JWT**, **control de acceso basado en roles (RBAC)** y una interfaz premium.

## 📋 Características Principales

*   **Gestión de Licencias**: Generación, activación, revocación y eliminación de claves cifradas.
*   **Autenticación segura**: Login con JWT (Access + Refresh Tokens), hashing con bcrypt.
*   **RBAC (Control de Acceso por Roles)**: Roles dinámicos, recursos, y permisos granulares.
*   **Panel Administrativo**: CRUD completo para usuarios, roles y recursos.
*   **Menú Dinámico**: Sidebar que se genera automáticamente según los permisos del usuario.
*   **API de Validación**: Endpoint público para que aplicaciones externas validen licencias.

## 🏗 Estructura del Proyecto

```
novacenter/
├── backend/         # API REST (Node.js, Express, TypeScript, PostgreSQL)
└── frontend/        # SPA (React 19, TypeScript, Vite, CSS Vanilla)
```

## 🚀 Inicio Rápido

### Requisitos
*   **Node.js** 18+
*   **PostgreSQL** 12+

### 1. Configurar el Backend

```bash
cd backend
npm install
```

Crear archivo `.env`:
```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_contraseña
DB_NAME=BD_novacenter

JWT_SECRET=tu_clave_secreta_jwt
REFRESH_TOKEN_SECRET=tu_clave_secreta_refresh
```

Ejecutar migraciones y arrancar:
```bash
# Aplicar migraciones (incluyendo tablas RBAC)
$env:DATABASE_URL="postgres://usuario:contraseña@localhost:5432/BD_novacenter"
npx node-pg-migrate up

# Iniciar servidor
npm run dev
```
> El servidor iniciará en `http://localhost:4000`.

### 2. Iniciar el Frontend

```bash
cd frontend
npm install
npm run dev
```
> La aplicación abrirá en `http://localhost:5173`.

## 🔑 Guía de Uso

1.  Abre `http://localhost:5173` — serás redirigido al **Login**.
2.  **Credenciales iniciales**: La migración crea un usuario admin por defecto (ver seed en migration).
3.  Al iniciar sesión como admin verás el **Dashboard** con sidebar dinámico:
    *   **Dashboard** — Vista principal con tabla de licencias.
    *   **Usuarios** — CRUD de usuarios + asignación de roles.
    *   **Roles** — CRUD de roles + asignación de recursos/permisos.
    *   **Recursos** — CRUD de recursos del sistema.
4.  Los usuarios con rol `user` solo ven las secciones permitidas por sus roles.

## 🛠 Tecnologías

| Capa | Tecnologías |
|---|---|
| **Backend** | Node.js, Express, TypeScript, PostgreSQL, JWT, bcrypt, Zod |
| **Frontend** | React 19, TypeScript, Vite, CSS Vanilla, Zustand |
| **Base de Datos** | PostgreSQL con node-pg-migrate |
| **Seguridad** | HMAC SHA256 (licencias), bcrypt (contraseñas), JWT (sesiones), RBAC (permisos) |

---
*Revisa los archivos README.md dentro de cada carpeta (`backend/` y `frontend/`) para detalles técnicos específicos.*
