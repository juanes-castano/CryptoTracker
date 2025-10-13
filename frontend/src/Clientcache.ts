// lib/clientCoinGeckoCache.ts

// Variable para mantener una copia local (en memoria) de la lista de monedas de CoinGecko
let coinListCache: any[] | null = null;

// Función que retorna la lista de monedas, usando caché en memoria del cliente (navegador)
export async function getClientCachedCoinList(): Promise<any[]> {
  // Si ya tenemos datos en la caché, los devolvemos directamente (sin hacer otra petición HTTP)
  if (coinListCache !== null) {
    return coinListCache;
  }

  // Si no hay caché, hacemos una petición a CoinGecko para obtener la lista completa de monedas
  const res = await fetch('https://api.coingecko.com/api/v3/coins/list');

  // Si hubo un error al hacer la petición, lanzamos una excepción
  if (!res.ok) {
    throw new Error('Failed to fetch CoinGecko coin list');
  }

  // Parseamos la respuesta JSON
  const coins: any[] = await res.json();

  // Guardamos los datos en caché (para próximos usos sin recargar desde la red)
  coinListCache = coins;

  // Devolvemos los datos recién obtenidos
  return coinListCache;
}
