// Importamos hooks de React
import { useEffect, useState } from 'react';

// Componente que recibe una propiedad: el símbolo de la moneda (ej: BTC, ETH)
export default function FavoriteButton({ symbol } : { symbol: string }) {
  const key = 'ct_favs'; // Clave usada para guardar favoritos en localStorage
  const [fav, setFav] = useState(false); // Estado que indica si la moneda es favorita o no

  // useEffect que se ejecuta una vez al montar el componente (y cuando cambia el símbolo)
  useEffect(() => {
    // Obtenemos los favoritos desde localStorage
    const raw = typeof window !== 'undefined' ? localStorage.getItem(key) : null;
    const arr = raw ? JSON.parse(raw) as string[] : [];

    // Verificamos si el símbolo actual está en la lista de favoritos
    setFav(arr.includes(symbol));

    // Función que se ejecuta si hay cambios en localStorage (desde otra pestaña o evento custom)
    const onChange = () => {
      const r = localStorage.getItem(key);
      const a = r ? JSON.parse(r) as string[] : [];
      setFav(a.includes(symbol)); // Actualizamos el estado local si hubo cambios
    };

    // Escuchamos cambios del almacenamiento local (multitab) y un evento personalizado
    window.addEventListener('storage', onChange); // para cambios entre pestañas
    window.addEventListener('favorites-changed', onChange as any); // evento custom dentro de la misma pestaña

    // Cleanup: eliminamos listeners al desmontar el componente
    return () => {
      window.removeEventListener('storage', onChange);
      window.removeEventListener('favorites-changed', onChange as any);
    };
  }, [symbol]);

  // Función para alternar el estado de favorito al hacer clic
  const toggle = () => {
    // Obtenemos el array de favoritos actual desde localStorage
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) as string[] : [];

    const i = arr.indexOf(symbol); // Buscamos el índice del símbolo actual

    if (i >= 0) {
      arr.splice(i, 1); // Si ya está, lo eliminamos
    } else {
      arr.push(symbol); // Si no está, lo agregamos
    }

    // Guardamos la nueva lista en localStorage
    localStorage.setItem(key, JSON.stringify(arr));

    // Disparamos un evento personalizado para notificar a otros componentes
    window.dispatchEvent(new Event('favorites-changed'));
  };

  // Renderizamos el botón con ★ si es favorito, ☆ si no lo es
  return (
    <button onClick={toggle} className='px-2 py-1 rounded bg-slate-800 hover:bg-slate-700'>
      {fav ? '★' : '☆'}
    </button>
  );
}
