// Importo las dependencias necesarias
import express from 'express'; // Importo Express para manejar las rutas HTTP.
import * as controller from '../controllers/cryptoController'; // Importo todas las funciones del controlador 'cryptoController' que manejarán la lógica de las rutas.
import { authMiddleware } from '../middleware/auth'; // Importo el middleware de autenticación, que se encargará de verificar que el usuario esté autenticado antes de permitir el acceso a ciertas rutas.

export const router = express.Router(); // Creo una nueva instancia del enrutador de Express.


// Defino la ruta para obtener la lista de criptomonedas
// Esta ruta maneja solicitudes GET a '/list', y se usa para obtener las principales criptomonedas.
router.get('/list', controller.list);

// Defino la ruta para obtener el precio de una criptomoneda específica
// Esta ruta maneja solicitudes GET a '/quote/:symbol', donde ':symbol' es un parámetro de la criptomoneda (ej. bitcoin, ethereum).
// Devuelve la cotización de la criptomoneda especificada.
router.get('/quote/:symbol', controller.quote);

// Defino la ruta para obtener información sobre una criptomoneda específica
// Esta ruta maneja solicitudes GET a '/info/:symbol', donde ':symbol' es el parámetro de la criptomoneda.
router.get('/info/:symbol', controller.info);

// Defino la ruta para obtener datos históricos de una criptomoneda
// Esta ruta maneja solicitudes GET a '/history', permitiendo al cliente obtener datos históricos sobre una criptomoneda.
router.get('/history', controller.history);


// Rutas protegidas para los favoritos (requiere autenticación)
router.post('/favorites', authMiddleware, controller.addFavorite); // La ruta POST para agregar una criptomoneda a los favoritos. Esta ruta está protegida por el middleware de autenticación 'authMiddleware'.
router.get('/favorites', authMiddleware, controller.listFavorites); // La ruta GET para listar los favoritos del usuario. Esta ruta también está protegida por el middleware de autenticación 'authMiddleware'.
