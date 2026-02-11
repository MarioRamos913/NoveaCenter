// Script para ejecutar migraciones usando las variables del .env
require('dotenv').config();

const { spawn } = require('child_process');
const path = require('path');

// Construir la DATABASE_URL desde las variables de entorno
const DATABASE_URL = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// Obtener el comando (up, down, etc.)
const command = process.argv[2] || 'up';

console.log(`Ejecutando migraciones: ${command}`);

// Ejecutar node-pg-migrate con la DATABASE_URL en el entorno
const migratePath = path.join(__dirname, 'node_modules', '.bin', 'node-pg-migrate');

const childProcess = spawn(migratePath, [command, '--config-file', '.migrate.json'], {
    env: {
        ...process.env,
        DATABASE_URL: DATABASE_URL
    },
    stdio: 'inherit',
    shell: true
});

childProcess.on('exit', (code) => {
    process.exit(code);
});
