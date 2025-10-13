// Importamos las dependencias necesarias para nuestro servidor Express
import express from 'express';  // Framework para crear el servidor y manejar rutas HTTP
import cors from 'cors';        // Middleware para habilitar CORS (Cross-Origin Resource Sharing)
import dotenv from 'dotenv';    // Librería para cargar variables de entorno desde un archivo .env
import bodyParser from 'body-parser'; // Middleware para parsear el cuerpo de las peticiones HTTP
import { router as cryptoRouter } from './routes/cryptoRoutes'; // Rutas relacionadas con criptomonedas
import { router as authRouter } from './routes/authRoutes'; // Rutas relacionadas con autenticación de usuarios
import { initDb } from './utils/db';  // Función que inicializa la base de datos

// Cargar las variables de entorno desde el archivo .env
dotenv.config();

// Imprimir en consola la clave API de CoinMarketCap desde las variables de entorno (para comprobar que esté cargada)
console.log("🌟 CMC_API_KEY en .env:", process.env.CMC_API_KEY);

// Definir el puerto en el que se ejecutará el backend (si no está definido en .env, usa el puerto 5000)
const PORT = process.env.PORT || 5000;

// Llamamos a la función para inicializar la base de datos y crear tablas si no existen
initDb();

// Crear una instancia de la aplicación Express
const app = express();

// Usar CORS para habilitar que la API sea accesible desde otros dominios (por ejemplo, frontend)
app.use(cors());

// Usar bodyParser para que Express pueda parsear JSON en las solicitudes entrantes
app.use(bodyParser.json());

// Rutas para manejar las criptomonedas, definidas en `cryptoRoutes.ts`
app.use('/api/cryptos', cryptoRouter);

// Rutas para manejar la autenticación, definidas en `authRoutes.ts`
app.use('/api/auth', authRouter);

// Ruta raíz que responde con un mensaje de estado del servidor
app.get('/', (req, res) => res.json({ ok: true, msg: 'CryptoTracker backend' }));

// Iniciar el servidor en el puerto definido y loguear en consola que el backend está funcionando
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
