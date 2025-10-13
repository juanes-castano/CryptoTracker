// Importamos hooks de React
import { useState, useEffect, useRef } from 'react';
// useSWR nos permite hacer peticiones automáticas con cache y revalidación
import useSWR from 'swr';
// Componente para renderizar cada fila de moneda
import CoinRow from './CoinRow';

// Función que hace fetch a la URL y la convierte en JSON
const fetcher = (u: string) => fetch(u).then(r => r.json());

// Tipos de campos por los que se puede ordenar
type SortField = 'price' | 'change24h' | 'volume24h';
// Tipos de dirección de ordenamiento
type SortDirection = 'asc' | 'desc';

export default function CoinList() {
  // Llamada a la API cada 60 segundos para obtener la lista de criptomonedas
  const { data, error } = useSWR(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/cryptos/list?limit=50`,
    fetcher,
    { refreshInterval: 60000 } // refresca cada minuto
  );

  // Estado para búsqueda en el input
  const [search, setSearch] = useState('');
  // Moneda confirmada al hacer click o presionar Enter
  const [confirmedSymbol, setConfirmedSymbol] = useState<string | null>(null);
  // Mostrar u ocultar sugerencias del buscador
  const [showSuggestions, setShowSuggestions] = useState(false);
  // Referencia al contenedor de sugerencias para cerrar si clickeas afuera
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Estado de campo y dirección de ordenamiento
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(null);

  // Mostrar solo favoritos (guardados en localStorage)
  const [showFavorites, setShowFavorites] = useState(false);

  // Detecta clics fuera del dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mostrar mensaje si hay error
  if (error) return <div>Error loading</div>;
  // Mostrar "loading..." si los datos aún no llegaron
  if (!data) return <div>Loading...</div>;

  // Accedemos al array de criptomonedas desde la API
  const list = data.data || [];

  // Filtramos la lista según el texto del input
  const filteredList = list.filter((coin: any) =>
    coin.name.toLowerCase().includes(search.toLowerCase())
  );

  // Clonamos la lista filtrada para poder ordenarla sin modificar el original
  const sortedList = [...filteredList];

  // Si hay criterio de orden y dirección, ordenamos la lista
  if (sortField && sortDirection) {
    sortedList.sort((a: any, b: any) => {
      let aVal: number;
      let bVal: number;

      // Tomamos el valor de cada campo dependiendo del tipo de orden
      switch (sortField) {
        case 'price':
          aVal = a.quote?.USD?.price ?? 0;
          bVal = b.quote?.USD?.price ?? 0;
          break;
        case 'change24h':
          aVal = a.quote?.USD?.percent_change_24h ?? 0;
          bVal = b.quote?.USD?.percent_change_24h ?? 0;
          break;
        case 'volume24h':
          aVal = a.quote?.USD?.volume_24h ?? 0;
          bVal = b.quote?.USD?.volume_24h ?? 0;
          break;
        default:
          aVal = 0;
          bVal = 0;
      }

      // Comparación de valores según dirección asc o desc
      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Si hay símbolo confirmado, filtramos para mostrar solo esa moneda
  const coinsToShow = confirmedSymbol
    ? list.filter((coin: any) => coin.symbol === confirmedSymbol)
    : sortedList;

  // Obtenemos los favoritos guardados localmente (localStorage)
  const favoritesFromStorage = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('ct_favs') || '[]')
    : [];

  // Si está activado "ver favoritos", filtramos por símbolos guardados
  const coinsToDisplay = showFavorites
    ? coinsToShow.filter((coin: any) => favoritesFromStorage.includes(coin.symbol))
    : coinsToShow;

  // Cuando el usuario selecciona una sugerencia
  const handleSelect = (symbol: string) => {
    const selected = list.find((coin: any) => coin.symbol === symbol);
    if (selected) {
      setSearch(selected.name); // rellenamos el input
    }
    setConfirmedSymbol(symbol); // guardamos la selección
    setShowSuggestions(false); // cerramos el dropdown
  };

  // Limpia el filtro y vuelve a mostrar la lista completa
  const handleReset = () => {
    setSearch('');
    setConfirmedSymbol(null);
  };

  // Si presiona Enter y hay una sola coincidencia, la seleccionamos automáticamente
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && filteredList.length === 1) {
      handleSelect(filteredList[0].symbol);
    }
  };

  // Muestra un texto descriptivo sobre el estado del orden
  const getSortLabel = () => {
    if (!sortField || !sortDirection) return 'No sorting';
    const fieldLabels: Record<SortField, string> = {
      price: 'Price',
      change24h: '24h %',
      volume24h: 'Volume 24h',
    };
    return `${fieldLabels[sortField]} (${sortDirection === 'asc' ? 'Asc' : 'Desc'})`;
  };

  // Render del componente principal
  return (
    <div className="overflow-auto relative">
      {/* 🔍 Sección de búsqueda, ordenamiento y favoritos */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center gap-2 relative">
        {/* Input de búsqueda */}
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value); // Actualiza estado
            setShowSuggestions(true); // Muestra sugerencias
          }}
          onKeyDown={handleKeyDown}
          className="px-3 py-2 w-full sm:w-64 border border-slate-700 rounded bg-slate-800 text-white placeholder-slate-400"
        />

        {/* Botón para volver a la lista completa si se filtró por moneda */}
        {confirmedSymbol && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded bg-slate-600 hover:bg-slate-500 text-white"
          >
            Back to list
          </button>
        )}

        {/* Selects de ordenamiento */}
        <div className="flex items-center gap-2 text-white">
          <label htmlFor="sortField" className="whitespace-nowrap">
            Sort by:
          </label>

          {/* Campo a ordenar */}
          <select
            id="sortField"
            value={sortField ?? ''}
            onChange={(e) =>
              setSortField(e.target.value === '' ? null : (e.target.value as SortField))
            }
            className="bg-slate-700 rounded px-2 py-1"
          >
            <option value="">None</option>
            <option value="price">Price</option>
            <option value="change24h">24h %</option>
            <option value="volume24h">Volume 24h</option>
          </select>

          {/* Dirección del orden */}
          <select
            id="sortDirection"
            value={sortDirection ?? ''}
            onChange={(e) =>
              setSortDirection(e.target.value === '' ? null : (e.target.value as SortDirection))
            }
            disabled={!sortField}
            className="bg-slate-700 rounded px-2 py-1"
          >
            <option value="">None</option>
            <option value="asc">Asc</option>
            <option value="desc">Desc</option>
          </select>
        </div>

        {/* Botón para activar/desactivar vista de favoritos */}
        <button
          onClick={() => setShowFavorites(!showFavorites)}
          className="absolute top-0 right-0 mt-1 px-2.5 py-0.5 rounded bg-slate-600 hover:bg-slate-300 text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-1xl"
        >
          {showFavorites ? 'Ver all' : 'View favorites'}
        </button>
      </div>

      {/* 📊 Tabla con monedas o mensaje si no hay resultados */}
      {coinsToDisplay.length === 0 ? (
        <div className="text-slate-400">No results found.</div>
      ) : (
        <table className="min-w-full">
          <thead>
            <tr className="text-left text-slate-400">
              <th className="px-4 py-2">Rank</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Price (USD)</th>
              <th className="px-4 py-2">24h %</th>
              <th className="px-4 py-2">Volume 24h</th>
              <th className="px-4 py-2">Fav</th>
            </tr>
          </thead>
          <tbody>
            {coinsToDisplay.map((coin: any) => (
              <CoinRow key={coin.id} coin={coin} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
