// Hooks de React
import { useState, useEffect } from 'react';
// Botón para marcar como favorito
import FavoriteButton from './FavoriteButton';
// Componente para el gráfico de precios
import PriceChart from './PriceChart';
// SWR para fetching de datos con cache y revalidación
import useSWR from 'swr';

// Función auxiliar para hacer fetch y parsear la respuesta
const fetcher = (url: string) => fetch(url).then(res => res.json());

// 🔎 Busca el ID de CoinGecko usando el símbolo (ej: BTC -> bitcoin)
async function getGeckoIdFromSymbol(symbol: string): Promise<string | null> {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/list'); // Lista completa de monedas
  const coins = await res.json(); // Parseamos el JSON
  const coin = coins.find((c: any) => c.symbol.toLowerCase() === symbol.toLowerCase()); // Buscamos por símbolo
  return coin?.id || null; // Retornamos el id o null
}

// Componente principal: representa una fila de la tabla
export default function CoinRow({ coin }: { coin: any }) {
  const [showDetails, setShowDetails] = useState(false); // Mostrar u ocultar detalles de la moneda
  const [cgId, setCgId] = useState<string | null>(null); // ID de CoinGecko
  const [days, setDays] = useState(7); // Rango de días para el gráfico
  const [cachedPrices, setCachedPrices] = useState<[number, number][]>([]); // Precios cacheados para mantener gráfico visible

  // Cuando se muestran los detalles, obtenemos el ID de CoinGecko
  useEffect(() => {
    if (showDetails) {
      getGeckoIdFromSymbol(coin.symbol).then(setCgId); // Buscar ID y setearlo
    }
  }, [showDetails, coin.symbol]);

  // Hook SWR que obtiene el histórico de precios desde nuestra API
  const history = useSWR(
    () =>
      cgId
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cryptos/history?id=${cgId}&days=${days}`
        : null,
    fetcher
  );

  // Si hay nuevos datos de precios, los guardamos en cache local
  useEffect(() => {
    if (history.data?.prices?.length) {
      setCachedPrices(history.data.prices);
    }
  }, [history.data]);

  const prices = cachedPrices; // Siempre mostramos los precios cacheados
  const quote = coin.quote?.USD || {}; // Accedemos a los datos de precio en USD
  const logo =
    coin.logo || `https://s2.coinmarketcap.com/static/img/coins/64x64/${coin.id}.png`; // Logo de la moneda

  return (
    <>
      {/* Fila principal de la tabla */}
      <tr className="border-b border-slate-700">
        {/* Logo de la moneda (clic para mostrar detalles) */}
        <td className="px-4 py-3 w-12">
          <img
            src={logo}
            alt=""
            width={28}
            height={28}
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation(); // Prevenir propagación para evitar efectos secundarios
              setShowDetails(!showDetails); // Toggle para mostrar u ocultar detalles
            }}
          />
        </td>

        {/* Nombre y símbolo */}
        <td className="px-4 py-3 flex items-center gap-3">
          <div>
            <div className="font-semibold">{coin.name}</div>
            <div className="text-sm text-slate-400">{coin.symbol}</div>
          </div>
        </td>

        {/* Precio actual en USD */}
        <td className="px-4 py-3">${quote.price?.toFixed(2) ?? '-'}</td>

        {/* Porcentaje de cambio en 24h */}
        <td className="px-4 py-3">{quote.percent_change_24h?.toFixed(2) ?? '-'}%</td>

        {/* Volumen en 24h */}
        <td className="px-4 py-3">{Number(quote.volume_24h || 0).toLocaleString()}</td>

        {/* Botón de favoritos */}
        <td className="px-4 py-3">
          <FavoriteButton symbol={coin.symbol} />
        </td>
      </tr>

      {/* Fila expandida con detalles: gráfico + botones de rango */}
      {showDetails && (
        <tr>
          {/* Se extiende a todas las columnas */}
          <td colSpan={6} className="bg-slate-900 p-4">
            <div>
              <h3 className="mb-2 font-semibold">{coin.symbol} History</h3>

              {/* Botones para cambiar el rango del gráfico */}
              <div className="mb-3">
                {[1, 7, 30].map((d) => (
                  <button
                    key={d}
                    onClick={(e) => {
                      e.stopPropagation(); // Evita cerrar detalles por error
                      setDays(d); // Cambia el rango
                    }}
                    className={`px-2 py-1 mr-2 rounded border ${
                      days === d ? 'border-neon-cyan text-neon-cyan' : 'border-slate-700'
                    }`}
                  >
                    {d}d
                  </button>
                ))}
              </div>

              {/* Mostrar gráfico o mensaje de carga */}
              {prices.length ? (
                <PriceChart prices={prices} />
              ) : (
                <div>Loading chart...</div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
