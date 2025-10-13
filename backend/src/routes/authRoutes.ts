// Importo las dependencias necesarias
import express from 'express'; // Importo Express para poder trabajar con el enrutador y manejar rutas HTTP.
import * as auth from '../controllers/authController'; // Importo las funciones de autenticación del controlador, que se encargan de registrar y autenticar usuarios.

// Creo una nueva instancia del enrutador de Express
export const router = express.Router();

// Defino la ruta para registrar un nuevo usuario
// Esta ruta manejará las solicitudes POST a '/register'
router.post('/register', auth.register);

// Defino la ruta para iniciar sesión de un usuario
// Esta ruta manejará las solicitudes POST a '/login'
router.post('/login', auth.login);
