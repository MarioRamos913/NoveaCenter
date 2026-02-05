# NovaCenter Pro - Frontend

## 📖 Descripción del Sistema

**NovaCenter Pro** es la interfaz administrativa para la gestión centralizada de licencias de software SaaS. Está diseñada para permitir a los administradores generar, monitorear y revocar claves de acceso de manera segura y eficiente.

El frontend actúa como una **Single Page Application (SPA)** moderna que se comunica con una API REST para persistir los datos. Su objetivo principal es ofrecer una experiencia de usuario (UX) premium, fluida y altamente reactiva, eliminando la complejidad visual de las operaciones de base de datos.

## 🛠 Stack Tecnológico

Este proyecto utiliza tecnologías de vanguardia para garantizar rendimiento, mantenibilidad y escalabilidad:

### Core
*   **React 19**: Librería principal para la construcción de la interfaz por componentes.
*   **TypeScript**: Lenguaje que añade tipado estático para prevenir errores en tiempo de desarrollo.
*   **Vite**: Entorno de desarrollo de próxima generación, ultra rápido para bundling y Hot Module Replacement (HMR).

### Estilos y Diseño
*   **Tailwind CSS v4**: La última versión del framework de utilidad.
    *   **Motor Oxide**: Compilación en tiempo real escrita en Rust.
    *   **CSS-first configuration**: Configuración de tema directamente en CSS via `@theme`, eliminando archivos JavaScript de configuración.
    *   **Variables Nativas**: Uso extensivo de CSS Variables para colores, fuentes y efectos.
*   **Fuentes**:
    *   `Space Grotesk`: Para títulos y encabezados, dando un toque tecnológico/futurista.
    *   `Inter`: Para legibilidad óptima en interfaces de usuario y datos.

## 🧠 Arquitectura y Funcionamiento

El frontend sigue una arquitectura basada en **Hooks** y **Componentes Funcionales**.

### 1. Flujo de Datos (`useLicenses.ts`)
Toda la lógica de negocio y comunicación con el backend está encapsulada en el custom hook `useLicenses`.
*   **Estado Centralizado**: Maneja la lista de licencias y el estado de carga (`loading`).
*   **Operaciones CRUD**:
    *   `createLicense`: Envía POST a la API y actualiza la lista optimísticamente.
    *   `updateStatus`: Permite revocar/activar sin recargar la página.
    *   `deleteLicense`: Eliminación permanente.

### 2. Capa Visual (`Dashboard.tsx`)
El componente de vista es puramente presentacional ("dumb component" en lógica, "smart" en UI).
*   **Glassmorphism**: Uso de `backdrop-filter: blur()` y colores con canal alfa (transparencia) para crear sensación de profundidad.
*   **Feedback**:
    *   Indicadores de carga en botones.
    *   Badges de estado animados (pulsaciones para "Activo").
    *   Gradientes que reaccionan al hover y foco.

### 3. Configuración de Estilos (`index.css`)
Aquí reside la "magia" de Tailwind v4. Definimos el sistema de diseño "Deep Space":
*   `--color-void`: El fondo oscuro profundo.
*   `--color-neon-*`: La paleta de acentos vibrantes.
*   `--font-display`: La familia tipográfica para encabezados.

## 🚀 Guía de Desarrollo

### Requisitos Previos
*   Node.js 18+ (Requerido para Vite/React 19)

### Instalación y Ejecución

1.  **Instalar dependencias**:
    ```bash
    npm install
    ```

2.  **Iniciar servidor de desarrollo**:
    ```bash
    npm run dev
    ```
    Accesible en `http://localhost:5173`.

3.  **Construir para producción**:
    ```bash
    npm run build
    ```
    Genera la carpeta `dist/` optimizada y minificada.

## 📂 Estructura de Directorios

```
src/
├── hooks/             # Lógica de negocio reutilizable (useLicenses)
├── models/            # Interfaces TypeScript defininedo la forma de los datos
├── views/             # Páginas/Vistas principales (Dashboard)
├── assets/            # Recursos estáticos
├── index.css          # Punto de entrada de estilos y configuración del tema
└── main.tsx           # Punto de montaje de React
```
