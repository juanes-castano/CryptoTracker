// Importo las dependencias necesarias
import sqlite3 from 'sqlite3'; // El driver de SQLite
import { open, Database } from 'sqlite'; // Librería para interactuar con la base de datos SQLite
import path from 'path'; // Módulo para manejar rutas de archivos
import fs from 'fs'; // Módulo para interactuar con el sistema de archivos

// Ruta del archivo de base de datos
const DB_FILE = process.env.DATABASE_FILE || './database.sqlite'; // Si no existe una variable de entorno, usamos un archivo por defecto.


// 📘 Función que abre y devuelve una conexión a la base de datos SQLite
export async function getDBConnection(): Promise<Database> {
  // Usamos `sqlite.open` para abrir una conexión a la base de datos.
  const db = await open({
    filename: DB_FILE, // Ruta al archivo de la base de datos
    driver: sqlite3.Database, // Usamos el driver de sqlite3
  });
  return db; // Retorna la conexión a la base de datos.
}


// 🧩 Función para inicializar la base de datos y crear tablas si no existen
export async function initDb() {
  // Verifica si el archivo de base de datos ya existe
  if (!fs.existsSync(DB_FILE)) {
    // Si no existe, lo crea.
    fs.writeFileSync(DB_FILE, ''); // Escribe un archivo vacío con la ruta `DB_FILE`
    console.log(`✅ Base de datos creada: ${DB_FILE}`); // Loguea en consola que la base de datos fue creada
  }

  // Abre la conexión a la base de datos
  const db = await getDBConnection();

  // Ejecuta las consultas SQL para crear las tablas si no existen
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Crea un ID único para cada usuario
      username TEXT UNIQUE NOT NULL,          -- Nombre de usuario, único y no nulo
      password TEXT NOT NULL                  -- Contraseña del usuario, no nula
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,   -- Crea un ID único para cada favorito
      user_id INTEGER NOT NULL,               -- ID del usuario, referenciado por una clave foránea
      symbol TEXT NOT NULL,                   -- Símbolo de la criptomoneda, por ejemplo 'BTC', 'ETH'
      FOREIGN KEY (user_id) REFERENCES users(id) -- Clave foránea que vincula el favorito con el usuario
    );
  `);

  // Cierra la conexión a la base de datos una vez que todo esté listo
  await db.close();
  console.log('✅ Tablas verificadas o creadas correctamente'); // Loguea en consola que las tablas están listas
}
