// Importo dotenv para cargar las variables de entorno desde un archivo .env
import dotenv from 'dotenv';
dotenv.config();

// Importo las funciones que interactúan con las APIs externas.
import { getListings, getQuotes, getInfo, getHistory } from './externalApis';
// Importo el servicio de caché que hemos definido en otro archivo.
import { cache } from './cache';

// Función para probar el comportamiento de la caché con nuestras funciones externas.
async function testCache() {
  // Primero, limpiamos la caché antes de comenzar a probar.
  console.log('--- Limpiando caché antes de empezar ---');
  cache.clear(); // Limpiamos la caché para asegurar que no haya datos previos.
  console.log('Cache cleared.');

  // **Prueba con getListings**:
  console.log('Test getListings - Primera llamada (debería hacer fetch)...');
  // Llamada inicial para obtener listados de criptomonedas, con un límite de 10 resultados.
  const listings1 = await getListings(10);
  console.log('Datos obtenidos:', listings1);

  // **Segunda llamada a getListings**:
  console.log('Test getListings - Segunda llamada (debería venir del caché)...');
  // Esta llamada debería venir del caché, no hacer una nueva solicitud a la API.
  const listings2 = await getListings(10);
  console.log('Datos obtenidos:', listings2);

  // Comprobamos si los datos se han cacheado correctamente, comparando la propiedad timestamp.
  console.log('¿Está cacheado getListings?', listings1.timestamp === listings2.timestamp);

  // Limpiar caché antes de la siguiente prueba.
  cache.clear();
  console.log('Cache cleared.');

  // **Prueba con getQuotes**:
  console.log('Test getQuotes - Primera llamada...');
  // Llamada inicial para obtener las cotizaciones de BTC y ETH.
  const quotes1 = await getQuotes('BTC,ETH');
  console.log('Datos obtenidos:', quotes1);

  // **Segunda llamada a getQuotes**:
  console.log('Test getQuotes - Segunda llamada...');
  // Esta llamada debería venir del caché.
  const quotes2 = await getQuotes('BTC,ETH');
  console.log('Datos obtenidos:', quotes2);

  // Comprobamos si los datos se han cacheado correctamente comparando las respuestas completas.
  console.log('¿Está cacheado getQuotes?', JSON.stringify(quotes1) === JSON.stringify(quotes2));

  // Limpiar caché antes de la siguiente prueba.
  cache.clear();
  console.log('Cache cleared.');

  // **Prueba con getInfo**:
  console.log('Test getInfo - Primera llamada...');
  // Llamada inicial para obtener información detallada sobre BTC y ETH.
  const info1 = await getInfo('BTC,ETH');
  console.log('Datos obtenidos:', info1);

  // **Segunda llamada a getInfo**:
  console.log('Test getInfo - Segunda llamada...');
  // Esta llamada debería venir del caché.
  const info2 = await getInfo('BTC,ETH');
  console.log('Datos obtenidos:', info2);

  // Comprobamos si los datos se han cacheado correctamente comparando las respuestas completas.
  console.log('¿Está cacheado getInfo?', JSON.stringify(info1) === JSON.stringify(info2));

  // Limpiar caché antes de la siguiente prueba.
  cache.clear();
  console.log('Cache cleared.');

  // **Prueba con getHistory**:
  console.log('Test getHistory - Primera llamada...');
  // Llamada inicial para obtener datos históricos de Bitcoin (últimos 7 días).
  const history1 = await getHistory('bitcoin', 7);
  console.log('Datos obtenidos:', history1);

  // **Segunda llamada a getHistory**:
  console.log('Test getHistory - Segunda llamada...');
  // Esta llamada debería venir del caché.
  const history2 = await getHistory('bitcoin', 7);
  console.log('Datos obtenidos:', history2);

  // Comprobamos si los datos se han cacheado correctamente comparando las respuestas completas.
  console.log('¿Está cacheado getHistory?', JSON.stringify(history1) === JSON.stringify(history2));

  // Limpiamos la caché al final para dejar todo limpio.
  console.log('--- Limpiando caché al final ---');
  cache.clear();
  console.log('Cache cleared.');
}

// Llamamos a la función `testCache` y gestionamos posibles errores.
testCache().catch(err => console.error(err));
