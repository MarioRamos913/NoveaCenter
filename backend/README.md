# NovaCenter Backend

Este es el servidor encargado de la lógica de negocio de NovaCenter. Provee una API REST para gestionar licencias de software de manera segura y persistente.

## 🧱 Arquitectura

El backend sigue una arquitectura **MVC (Modelo-Vista-Controlador)** y utiliza **PostgreSQL** para la persistencia de datos.

*   **`src/app.ts`**: Punto de entrada, configuración de Express y carga de variables de entorno (`dotenv`).
*   **`src/config/database.ts`**: Configuración del pool de conexiones a PostgreSQL.
*   **`src/routes/`**: Endpoints de la API.
*   **`src/controllers/`**: 
    *   Generación de claves cifradas (HMAC SHA256).
    *   Cálculo automático de fechas de expiración.
    *   Validación de datos.
*   **`src/models/`**: Consultas SQL directas a la base de datos `licenses`.

## 🔐 Seguridad y Licenciamiento

*   **Claves Cifradas**: Las licencias no son strings aleatorios simples. Se generan cifrando (HMAC) la combinación del ID del cliente y la fecha actual.
*   **Expiración Automática**: Por defecto, las licencias duran 1 mes, pero el sistema soporta duraciones de 3 meses, 1 año o fechas personalizadas.

## 🔌 Endpoints

### Licencias (`/api/licenses`)

*   **GET `/`**: Obtiene todas las licencias.
*   **POST `/`**: Crea una nueva licencia.
    *   **Body**: `firstName`, `lastName`, `idNumber`, `businessName`, `sector`, `duration` ('1_month' | '3_months' | '1_year' | 'custom').
*   **PATCH `/:key/status`**: Actualiza el estado (`active` | `revoked`).
*   **DELETE `/:key`**: Elimina una licencia permanentemente.

## ⚙️ Configuración (.env)

Asegúrate de tener un archivo `.env` con:

```env
PORT=4000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=secret
DB_NAME=novacenter
```

## 📜 Scripts

*   `npm run dev`: Inicia en modo desarrollo.
*   `npm run build`: Compila TypeScript a JavaScript.
*   `npm start`: Inicia el servidor en producción.

### 🗃️ Migraciones de Base de Datos

El proyecto utiliza **node-pg-migrate** para gestionar el esquema de la base de datos de forma profesional y controlada.

#### Comandos Disponibles

```bash
# Aplicar todas las migraciones pendientes
npm run migrate

# Revertir la última migración
npm run migrate:down

# Crear una nueva migración
npm run migrate:create -- nombre-de-la-migracion
```

#### 🚀 Inicialización de Base de Datos (Primera Vez)

**NOTA**: Si ya tienes la tabla `licenses` en tu base de datos (como es tu caso), **NO necesitas ejecutar migraciones**. El sistema ya está conectado.

1. **Asegúrate de que las credenciales en `.env` sean correctas**:
   - Base de datos: `BD_novacenter`
   - Usuario: `postgres`
   - Contraseña: verificar que coincida con tu instalación

2. **La tabla debe existir**: `licenses`
   - Si la tabla no existe, ejecuta `npm run migrate`
   - Si la tabla ya existe, el backend funcionará directamente

3. **Iniciar el backend**:
   ```bash
   npm run dev
   ```
   
   Deberías ver: `NovaCenter Backend running on port 4000`


#### 📝 Flujo de Trabajo con Migraciones

**Para agregar una nueva tabla o modificar el esquema:**

1. Crear una nueva migración:
   ```bash
   npm run migrate:create -- add-nueva-tabla
   ```

2. Editar el archivo generado en `migrations/`:
   ```javascript
   export const up = (pgm) => {
     pgm.createTable('nueva_tabla', {
       id: 'id', // Serial primary key
       name: { type: 'varchar(100)', notNull: true },
       created_at: {
         type: 'timestamp',
         notNull: true,
         default: pgm.func('CURRENT_TIMESTAMP')
       }
     });
   };

   export const down = (pgm) => {
     pgm.dropTable('nueva_tabla');
   };
   ```

3. Aplicar la migración:
   ```bash
   npm run migrate
   ```

4. Si hay un error, revertir:
   ```bash
   npm run migrate:down
   ```

#### ⚠️ Notas Importantes

*   **No modifiques migraciones ya aplicadas** en producción. Crea nuevas migraciones para cambios adicionales.
*   Las migraciones se ejecutan en orden cronológico según su timestamp.
*   El sistema registra qué migraciones se han ejecutado en la tabla `pgmigrations`.
*   Siempre define la función `down` para poder revertir cambios si es necesario.

