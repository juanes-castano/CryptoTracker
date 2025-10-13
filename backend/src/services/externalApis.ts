// Importo la librería axios para hacer solicitudes HTTP.
import axios from 'axios';
// Importo el servicio de caché que definimos en el archivo 'cache.ts' para almacenar y recuperar datos de la memoria.
import { cache } from './cache';

// Defino las URLs base para las APIs de CoinMarketCap (CMC) y CoinGecko (CG).
const CMC_BASE = 'https://pro-api.coinmarketcap.com/v1'; // Base URL para la API de CoinMarketCap.
const CG_BASE = 'https://api.coingecko.com/api/v3'; // Base URL para la API de CoinGecko.

// Creo un cliente de Axios para CoinMarketCap, configurando su base URL.
const cmcClient = axios.create({
  baseURL: CMC_BASE
});

// Configuro un interceptor para añadir la API key en todas las solicitudes de CoinMarketCap.
// Este interceptor se ejecutará automáticamente en cada solicitud.
cmcClient.interceptors.request.use(config => {
  config.headers = config.headers || {}; // Aseguro que las cabeceras existan.
  config.headers['X-CMC_PRO_API_KEY'] = process.env.CMC_API_KEY || ''; // Agrego la API key de CoinMarketCap a las cabeceras.
  return config; // Retorno la configuración modificada.
});

// Función para obtener las criptomonedas más importantes desde CoinMarketCap.
export async function getListings(limit = 50) {
  const cacheKey = `listings_${limit}`; // Genero una clave única para la caché basada en el límite de criptomonedas que queremos obtener.

  // Intento obtener los datos desde la caché.
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData; // Si los datos están en caché, los devuelvo directamente.
  }

  // Si no están en caché, hago una solicitud HTTP a CoinMarketCap para obtener la lista de criptomonedas.
  const res = await cmcClient.get('/cryptocurrency/listings/latest', {
    params: { limit, convert: 'USD' } // Parámetros para limitar la cantidad de resultados y convertir los valores a USD.
  });

  // Almaceno los datos obtenidos en la caché para que no tengamos que hacer la misma solicitud de nuevo.
  cache.set(cacheKey, res.data);

  return res.data; // Devuelvo los datos obtenidos.
}

// Función para obtener las cotizaciones actuales de una criptomoneda específica.
export async function getQuotes(symbols: string) {
  const cacheKey = `quotes_${symbols}`; // Genero una clave única para la caché basada en el símbolo de la criptomoneda.

  // Intento obtener los datos de la caché.
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData; // Si los datos están en caché, los devuelvo directamente.
  }

  // Si no están en caché, hago una solicitud HTTP a CoinMarketCap para obtener las cotizaciones.
  const res = await cmcClient.get('/cryptocurrency/quotes/latest', {
    params: { symbol: symbols, convert: 'USD' } // Parámetros con el símbolo de la criptomoneda y la conversión a USD.
  });

  // Almaceno los datos obtenidos en la caché.
  cache.set(cacheKey, res.data);
  return res.data; // Devuelvo los datos obtenidos.
}

// Función para obtener información detallada de una criptomoneda.
export async function getInfo(symbols: string) {
  const cacheKey = `info_${symbols}`; // Genero una clave única para la caché basada en el símbolo de la criptomoneda.

  // Intento obtener los datos de la caché.
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData; // Si los datos están en caché, los devuelvo directamente.
  }

  // Si no están en caché, hago una solicitud HTTP a CoinMarketCap para obtener la información de la criptomoneda.
  const res = await cmcClient.get('/cryptocurrency/info', {
    params: { symbol: symbols } // Parámetro con el símbolo de la criptomoneda.
  });

  // Almaceno los datos obtenidos en la caché.
  cache.set(cacheKey, res.data);
  return res.data; // Devuelvo los datos obtenidos.
}

// Función para obtener datos históricos de una criptomoneda desde CoinGecko.
export async function getHistory(coingeckoId: string, days = 7) {
  const cacheKey = `history_${coingeckoId}_${days}`; // Genero una clave única para la caché basada en el ID de CoinGecko y los días solicitados.

  // Intento obtener los datos de la caché.
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return cachedData; // Si los datos están en caché, los devuelvo directamente.
  }

  try {
    // Hago una solicitud HTTP a CoinGecko para obtener el historial de la criptomoneda.
    const res = await axios.get(`${CG_BASE}/coins/${encodeURIComponent(coingeckoId)}/market_chart`, {
      params: { vs_currency: 'usd', days } // Parámetros para obtener el gráfico de mercado en USD y los días solicitados.
    });

    // Almaceno los datos obtenidos en la caché.
    cache.set(cacheKey, res.data);
    return res.data; // Devuelvo los datos obtenidos.
  } catch (error) {
    console.error("❌ Error al obtener historial de CoinGecko:", error); // Si ocurre un error, lo registro en la consola.
    throw new Error('Error fetching history'); // Lanza un error para que el cliente pueda manejarlo.
  }
}
