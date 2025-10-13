// Importo las dependencias necesarias
import { Request, Response } from 'express'; // Request y Response son tipos proporcionados por Express para manejar solicitudes y respuestas HTTP.
import * as external from '../services/externalApis'; // Importo funciones de un servicio externo para obtener datos de criptomonedas.
import { getDBConnection } from '../utils/db'; // Importo la función para conectarme a la base de datos.


// Esta función lista las criptomonedas principales, con un límite configurable.
export async function list(req: Request, res: Response) {
  try {
    // Obtengo el parámetro "limit" de la consulta. Si no se pasa, por defecto uso 50.
    const limit = Number(req.query.limit || 50);

    // Llamo a la API externa para obtener las monedas con el límite especificado.
    const data = await external.getListings(limit);

    // Respondo con los datos obtenidos de la API externa.
    res.json(data);
  } catch (err: any) {
    // Si ocurre un error en la solicitud, lo registro en la consola para depuración y devuelvo un error 500.
    console.error(err?.message || err);
    res.status(500).json({ error: 'Error fetching listings' });
  }
}

// Esta función obtiene la cotización actual de una criptomoneda específica.
export async function quote(req: Request, res: Response) {
  try {
    // Obtengo el parámetro "symbol" de la URL (ejemplo: /quote/BTC)
    const symbol = String(req.params.symbol || '');
    
    // Si no se proporciona un símbolo, devuelvo un error 400.
    if (!symbol) return res.status(400).json({ error: 'symbol required' });

    // Llamo a la API externa para obtener la cotización de la criptomoneda.
    const data = await external.getQuotes(symbol);

    // Respondo con los datos obtenidos de la API externa.
    res.json(data);
  } catch (err: any) {
    // Si ocurre un error, lo registro en la consola y devuelvo un error 500.
    console.error(err?.message || err);
    res.status(500).json({ error: 'Error fetching quote' });
  }
}

// Esta función obtiene información detallada sobre una criptomoneda específica.
export async function info(req: Request, res: Response) {
  try {
    // Obtengo el parámetro "symbol" de la URL (ejemplo: /info/BTC)
    const symbol = String(req.params.symbol || '');
    
    // Si no se proporciona un símbolo, devuelvo un error 400.
    if (!symbol) return res.status(400).json({ error: 'symbol required' });

    // Llamo a la API externa para obtener la información de la criptomoneda.
    const data = await external.getInfo(symbol);

    // Respondo con los datos obtenidos de la API externa.
    res.json(data);
  } catch (err: any) {
    // Si ocurre un error, lo registro en la consola y devuelvo un error 500.
    console.error(err?.message || err);
    res.status(500).json({ error: 'Error fetching info' });
  }
}

// Esta función obtiene los datos históricos de una criptomoneda específica.
export async function history(req: Request, res: Response) {
  try {
    // Obtengo los parámetros "id" y "days" de la consulta. Por defecto, "id" es 'bitcoin' y "days" es 7.
    const id = String(req.query.id || 'bitcoin');
    const days = Number(req.query.days || 7);

    // Llamo a la API externa para obtener los datos históricos de la criptomoneda.
    const data = await external.getHistory(id, days);

    // Respondo con los datos históricos obtenidos.
    res.json(data);
  } catch (err: any) {
    // Si ocurre un error, lo registro en la consola y devuelvo un error 500.
    console.error(err?.message || err);
    res.status(500).json({ error: 'Error fetching history' });
  }
}

// Esta función agrega una criptomoneda a la lista de favoritos de un usuario autenticado.
export async function addFavorite(req: Request, res: Response) {
  try {
    // Obtengo el ID del usuario desde el token JWT que se encuentra en el objeto 'userId'.
    const userId = Number((req as any).userId);
    
    // Obtengo el símbolo de la criptomoneda del cuerpo de la solicitud.
    const { symbol } = req.body;

    // Si el usuario no está autenticado, devuelvo un error 401.
    if (!userId) return res.status(401).json({ error: 'unauthenticated' });
    
    // Si no se proporciona un símbolo, devuelvo un error 400.
    if (!symbol) return res.status(400).json({ error: 'symbol required' });

    // Establezco la conexión con la base de datos.
    const db = await getDBConnection();

    // Inserto la criptomoneda en la tabla "favorites" de la base de datos.
    await db.run(
      'INSERT INTO favorites (user_id, symbol) VALUES (?, ?)',
      userId,
      symbol.toUpperCase() // Convierto el símbolo a mayúsculas para estandarizarlo.
    );

    // Respondo con un mensaje de éxito.
    res.json({ ok: true });
  } catch (err: any) {
    // Si ocurre un error, lo registro en la consola y devuelvo un error 500.
    console.error(err?.message || err);
    res.status(500).json({ error: 'Error adding favorite' });
  }
}

// Esta función lista todos los favoritos de un usuario autenticado.
export async function listFavorites(req: Request, res: Response) {
  try {
    // Obtengo el ID del usuario desde el token JWT que se encuentra en el objeto 'userId'.
    const userId = Number((req as any).userId);
    
    // Si el usuario no está autenticado, devuelvo un error 401.
    if (!userId) return res.status(401).json({ error: 'unauthenticated' });

    // Establezco la conexión con la base de datos.
    const db = await getDBConnection();

    // Obtengo todos los símbolos de las criptomonedas favoritas del usuario desde la base de datos.
    const rows = await db.all(
      'SELECT symbol FROM favorites WHERE user_id = ?',
      userId
    );

    // Respondo con los símbolos de las criptomonedas favoritas.
    res.json({ favorites: rows.map((r: any) => r.symbol) });
  } catch (err: any) {
    // Si ocurre un error, lo registro en la consola y devuelvo un error 500.
    console.error(err?.message || err);
    res.status(500).json({ error: 'Error listing favorites' });
  }
}
