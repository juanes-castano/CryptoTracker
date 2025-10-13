// Importo la librería 'node-cache' que me permite manejar un sistema de cache en memoria.
import NodeCache from 'node-cache';

// Creo una instancia de NodeCache con una configuración por defecto
const cacheInstance = new NodeCache({ stdTTL: 3600 }); // La configuración 'stdTTL' define el tiempo de vida estándar de los datos en la caché (en segundos). En este caso, 3600 segundos = 1 hora.

// El objeto 'cache' ofrece un conjunto de métodos para interactuar con la caché.
export const cache = {
  // Método para obtener un valor de la caché usando una clave.
  // 'key' es el identificador de los datos almacenados.
  get: (key: string) => cacheInstance.get(key),

  // Método para establecer un valor en la caché asociado a una clave.
  // 'key' es el identificador de los datos y 'value' es el valor que se quiere almacenar.
  set: (key: string, value: any) => cacheInstance.set(key, value),

  // Método para borrar todos los datos almacenados en la caché.
  // Esto limpia por completo la caché.
  clear: () => cacheInstance.flushAll(),
};
