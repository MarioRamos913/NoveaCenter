# NovaCenter Backend

Servidor API REST para NovaCenter. Gestiona licencias de software, autenticación JWT y control de acceso basado en roles (RBAC).

## 🧱 Arquitectura

El backend sigue una arquitectura **modular por dominio** con TypeScript estricto:

```
src/
├── app.ts                    # Entrada principal, configuración Express
├── config/
│   └── database.ts           # Pool de conexiones PostgreSQL
├── middlewares/
│   ├── auth.middleware.ts     # Verificación JWT (authenticate)
│   ├── role.middleware.ts     # Autorización por roles (authorize)
│   └── permission.middleware.ts  # Autorización por recurso (requirePermission)
├── modules/
│   ├── auth/                 # Login, registro, refresh, logout
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.utils.ts     # Generación JWT con roles/permissions
│   │   ├── auth.schema.ts    # Validación Zod
│   │   └── auth.routes.ts
│   ├── users/                # CRUD de usuarios + asignación de roles
│   │   ├── user.model.ts
│   │   ├── user.service.ts
│   │   ├── user.controller.ts
│   │   ├── user.schema.ts
│   │   └── user.routes.ts
│   ├── roles/                # CRUD de roles + asignación de recursos
│   │   ├── role.model.ts
│   │   ├── role.service.ts
│   │   ├── role.controller.ts
│   │   ├── role.schema.ts
│   │   └── role.routes.ts
│   ├── resources/            # CRUD de recursos del sistema
│   │   ├── resource.model.ts
│   │   ├── resource.service.ts
│   │   ├── resource.controller.ts
│   │   ├── resource.schema.ts
│   │   └── resource.routes.ts
│   └── menu/                 # Menú dinámico según permisos
│       ├── menu.controller.ts
│       └── menu.routes.ts
├── controllers/
│   └── licenseController.ts  # Controlador de licencias
├── models/
│   └── License.ts            # Modelo de licencias
└── routes/
    └── licenseRoutes.ts      # Rutas de licencias
```

## 🔐 Sistema de Seguridad

### Autenticación (JWT)
*   **Access Token**: Corta duración, contiene `id`, `username`, `roles[]`, `permissions[]`.
*   **Refresh Token**: Larga duración, almacenado en BD para revocación.
*   **Contraseñas**: Hashing con bcrypt (10 salt rounds).

### RBAC (Control de Acceso por Roles)
*   **Roles**: Agrupaciones de permisos (ej: `admin`, `user`).
*   **Recursos**: Entidades del sistema con `code` único (ej: `dashboard`, `licenses`, `users`).
*   **Tablas de relación**: `user_roles` (usuario ↔ roles), `role_resources` (rol ↔ recursos).
*   **Middlewares**:
    *   `authenticate` — Verifica JWT válido.
    *   `authorize(['admin'])` — Requiere al menos uno de los roles indicados.
    *   `requirePermission('users')` — Requiere permiso al recurso por code.

### Licencias
*   **Claves Cifradas**: HMAC SHA256 con salt aleatorio, formato `XXXX-XXXX-XXXX-XXXX`.
*   **Expiración**: Soporte para múltiples duraciones (1 mes, 3 meses, 1 año, personalizado).

## 🔌 Endpoints

### Autenticación (`/api/auth`)
| Método | Ruta | Protección | Descripción |
|--------|------|------------|-------------|
| POST | `/register` | Pública | Registrar nuevo usuario |
| POST | `/login` | Pública | Iniciar sesión (retorna tokens + roles + permissions) |
| POST | `/refresh` | Pública | Renovar access token |
| POST | `/logout` | Pública | Invalidar refresh token |

### Licencias (`/api/licenses`)
| Método | Ruta | Protección | Descripción |
|--------|------|------------|-------------|
| POST | `/validate` | Pública | Validar clave de licencia |
| GET | `/` | Auth | Listar licencias (admin: todas, user: propias) |
| POST | `/` | Admin | Crear licencia |
| PATCH | `/:key/status` | Admin | Cambiar estado (active/revoked) |
| DELETE | `/:key` | Admin | Eliminar licencia |

### Usuarios (`/api/users`)
| Método | Ruta | Protección | Descripción |
|--------|------|------------|-------------|
| GET | `/` | Admin | Listar usuarios con roles |
| GET | `/:id` | Admin | Detalle de usuario |
| POST | `/` | Admin | Crear usuario |
| PUT | `/:id` | Admin | Actualizar usuario |
| DELETE | `/:id` | Admin | Eliminar usuario |
| POST | `/:id/roles` | Admin | Asignar roles al usuario |

### Roles (`/api/roles`)
| Método | Ruta | Protección | Descripción |
|--------|------|------------|-------------|
| GET | `/` | Auth | Listar roles |
| GET | `/:id` | Auth | Detalle con recursos asignados |
| POST | `/` | Admin | Crear rol |
| PUT | `/:id` | Admin | Actualizar rol |
| DELETE | `/:id` | Admin | Eliminar rol |
| POST | `/:id/resources` | Admin | Asignar recursos al rol |

### Recursos (`/api/resources`)
| Método | Ruta | Protección | Descripción |
|--------|------|------------|-------------|
| GET | `/` | Auth | Listar recursos |
| GET | `/:id` | Auth | Detalle de recurso |
| POST | `/` | Admin | Crear recurso |
| PUT | `/:id` | Admin | Actualizar recurso |
| DELETE | `/:id` | Admin | Eliminar recurso |

### Menú (`/api/menu`)
| Método | Ruta | Protección | Descripción |
|--------|------|------------|-------------|
| GET | `/` | Auth | Menú dinámico según permisos del usuario |

## ⚙️ Configuración (.env)

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

## 📜 Scripts

*   `npm run dev`: Inicia en modo desarrollo con ts-node.
*   `npm run build`: Compila TypeScript a JavaScript.
*   `npm start`: Inicia el servidor en producción.

### 🗃️ Migraciones de Base de Datos

El proyecto utiliza **node-pg-migrate** para gestionar el esquema.

> **Nota**: `node-pg-migrate` requiere `DATABASE_URL`. En PowerShell:
> ```powershell
> $env:DATABASE_URL="postgres://usuario:contraseña@localhost:5432/BD_novacenter"
> ```

#### Comandos
```bash
# Aplicar migraciones pendientes
npx node-pg-migrate up

# Revertir la última migración
npx node-pg-migrate down

# Crear nueva migración
npm run migrate:create -- nombre-de-la-migracion
```

#### Migraciones Existentes
1. **`create-licenses`** — Tabla principal de licencias.
2. **`add-auth-tables`** — Tabla de usuarios y refresh tokens.
3. **`create-rbac-tables`** — Tablas RBAC: `roles`, `resources`, `user_roles`, `role_resources` con seed data inicial.

#### ⚠️ Notas Importantes
*   No modifiques migraciones ya aplicadas en producción. Crea nuevas.
*   Las migraciones se ejecutan en orden cronológico por timestamp.
*   El sistema registra migraciones ejecutadas en `pgmigrations`.
*   Siempre define la función `down` para poder revertir cambios.
