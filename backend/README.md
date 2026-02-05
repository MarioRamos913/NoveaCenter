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
*   **Inicialización BD**: Ejecuta el script `scripts/initLocalDb.sql` en tu gestor de base de datos para crear la tabla necesaria.
