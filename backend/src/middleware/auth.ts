// Importo las dependencias necesarias
import { Request, Response, NextFunction } from 'express'; // Express proporciona los tipos Request, Response y NextFunction para manejar las solicitudes y respuestas HTTP.
import jwt from 'jsonwebtoken'; // Importo la librería jwt que nos ayudará a verificar el token de autenticación.

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'; // Obtengo la clave secreta para verificar el JWT desde las variables de entorno. Si no existe, uso un valor por defecto ('changeme').


// Middleware para verificar que el usuario esté autenticado mediante un token JWT.
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // 1. Verifico si el encabezado "Authorization" está presente en la solicitud.
  const header = req.headers.authorization;
  
  // Si no hay encabezado de autorización, devuelvo un error 401 indicando que falta la autorización.
  if (!header) return res.status(401).json({ error: 'missing authorization' });

  // 2. Divido el encabezado en dos partes: el tipo de autorización (ejemplo: 'Bearer') y el token.
  const parts = header.split(' ');
  
  // Si el encabezado no tiene exactamente dos partes (tipo y token), es inválido, entonces respondo con un error 401.
  if (parts.length !== 2) return res.status(401).json({ error: 'invalid authorization' });

  // 3. Extraigo el token de la segunda parte del encabezado.
  const token = parts[1];

  try {
    // 4. Verifico el token usando la clave secreta. Si el token es válido, extraigo el payload (información del usuario).
    // Si el token es válido, el payload tendrá la propiedad 'sub' que corresponde al ID del usuario.
    const payload = jwt.verify(token, JWT_SECRET) as any;
    
    // 5. Guardo el ID del usuario (sub) extraído del token en el objeto "req" para que esté disponible en las siguientes funciones/métodos.
    // Esto nos permitirá acceder al ID del usuario en las rutas posteriores.
    (req as any).userId = payload.sub;

    // 6. Si todo está bien, paso al siguiente middleware o controlador llamando a next().
    next();
  } catch (err) {
    // 7. Si el token no es válido o ha expirado, devuelvo un error 401 indicando que el token es inválido.
    return res.status(401).json({ error: 'invalid token' });
  }
}
