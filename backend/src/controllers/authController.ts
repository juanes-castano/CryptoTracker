// Importamos las dependencias necesarias
import { Request, Response } from 'express'; // Request y Response son tipos de Express para manejar solicitudes y respuestas HTTP
import { getDBConnection } from '../utils/db'; // Función personalizada para obtener la conexión a la base de datos
import bcrypt from 'bcrypt'; // Bcrypt es una librería para encriptar contraseñas
import jwt from 'jsonwebtoken'; // JsonWebToken es una librería para generar y verificar tokens de autenticación

// Definimos la clave secreta para el JWT. En un entorno real, esto debería estar en las variables de entorno.
const JWT_SECRET = process.env.JWT_SECRET || 'changeme'; // Usamos una variable de entorno para la clave secreta del JWT

// Función para registrar un nuevo usuario
export async function register(req: Request, res: Response) {
  try {
    // Extraemos los datos enviados en el cuerpo de la solicitud
    const { username, password } = req.body;

    // Validamos que se haya enviado un nombre de usuario y una contraseña
    if (!username || !password)
      return res.status(400).json({ error: 'username and password required' });

    // Establecemos la conexión con la base de datos
    const db = await getDBConnection();

    // Comprobamos si ya existe un usuario con el mismo nombre de usuario
    const existing = await db.get('SELECT id FROM users WHERE username = ?', username);
    if (existing) return res.status(400).json({ error: 'user exists' });

    // Encriptamos la contraseña antes de guardarla en la base de datos
    const hash = await bcrypt.hash(password, 10); // El número 10 es el "salt rounds", una medida de cuán difícil es descifrar la contraseña

    // Insertamos el nuevo usuario en la base de datos
    const info = await db.run(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      username,
      hash
    );

    // Obtenemos el id del nuevo usuario insertado
    const id = info.lastID;

    // Creamos un token JWT que contiene el ID del usuario y lo firmamos con la clave secreta
    const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: '7d' });

    // Devolvemos el token como respuesta, para que el cliente pueda usarlo en futuras solicitudes
    res.json({ token });
  } catch (err: any) {
    console.error(err?.message || err); // En caso de error, lo mostramos en consola para depuración
    res.status(500).json({ error: 'Error registering' }); // En caso de un error, devolvemos un mensaje de error
  }
}

// Función para hacer login de un usuario
export async function login(req: Request, res: Response) {
  try {
    // Extraemos los datos de la solicitud (nombre de usuario y contraseña)
    const { username, password } = req.body;

    // Verificamos que se haya enviado tanto el nombre de usuario como la contraseña
    if (!username || !password)
      return res.status(400).json({ error: 'username and password required' });

    // Establecemos la conexión con la base de datos
    const db = await getDBConnection();

    // Buscamos al usuario en la base de datos utilizando el nombre de usuario
    const row = await db.get(
      'SELECT id, password FROM users WHERE username = ?',
      username
    );

    // Si no se encuentra el usuario, devolvemos un error
    if (!row) return res.status(400).json({ error: 'invalid credentials' });

    // Comparamos la contraseña proporcionada con la que está almacenada en la base de datos
    const ok = await bcrypt.compare(password, row.password);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });

    // Si las credenciales son correctas, creamos un token JWT para este usuario
    const token = jwt.sign({ sub: row.id }, JWT_SECRET, { expiresIn: '7d' });

    // Devolvemos el token al cliente para que lo utilice en futuras solicitudes
    res.json({ token });
  } catch (err: any) {
    console.error(err?.message || err); // En caso de error, lo mostramos en consola para depuración
    res.status(500).json({ error: 'Error logging in' }); // En caso de un error, devolvemos un mensaje de error
  }
}
