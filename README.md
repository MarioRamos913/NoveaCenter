# NovaCenter - Sistema de Gestión de Licencias

Bienvenido a **NovaCenter**, un sistema moderno y centralizado para la generación, administración y validación de licencias de software. Este proyecto está diseñado con una arquitectura modular, separando claramente el **Backend** (lógica de negocio y API) del **Frontend** (interfaz de usuario).

## 🗂 Estructura del Proyecto

El proyecto se divide en dos carpetas principales:

*   **`backend/`**: Contiene el servidor, la API REST y la lógica para crear y validar licencias.
*   **`frontend/`**: Contiene la aplicación web (React) desde donde los administradores interactúan con el sistema.

## 🚀 Inicio Rápido

Para poner en marcha el sistema completo, necesitas dos terminales (una para el backend y otra para el frontend).

### 1. Iniciar el Backend
El backend es el "cerebro" que procesa los datos. Debe estar corriendo para que el frontend funcione.

```bash
cd backend
npm install  # Solo la primera vez
npm run dev
```
> El servidor iniciará en `http://localhost:4000`.

### 2. Iniciar el Frontend
La interfaz visual para el usuario.

```bash
cd frontend
npm install  # Solo la primera vez
npm run dev
```
> La aplicación abrirá en `http://localhost:5173`.

## � Guía de Uso

Una vez que ambos servidores (Backend y Frontend) están corriendo:

1.  Abre tu navegador en `http://localhost:5173`.
2.  Verás el **Panel Principal (Dashboard)** de NovaCenter.
3.  **Generar una Licencia**:
    *   En el formulario "Nueva Suscripción", completa los datos del cliente: **Nombres**, **Apellidos**, **Cédula/ID** y selecciona la **Duración**.
    *   Haz clic en "Generar Licencia".
    *   El sistema validará los datos y animará la creación de la nueva licencia en la tabla.
4.  **Ver Licencias Activas**:
    *   A la derecha verás una tabla estilizada con todas las licencias registradas.
    *   Podrás ver el estado (ACTIVA/REVOCADA) y la fecha de vencimiento.

## �🛠 Tecnologías Principales

*   **Node.js & Express**: Para un backend rápido y escalable.
*   **React & Vite**: Para una interfaz de usuario dinámica y veloz.
*   **Tailwind CSS v4**: Para un diseño moderno, responsivo y mantenible.
*   **TypeScript**: Utilizamos TypeScript en todo el proyecto para garantizar un código más robusto y con menos errores.

---
*Revisa los archivos README.md dentro de cada carpeta (`backend/` y `frontend/`) para detalles técnicos específicos.*
