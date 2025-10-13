import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import Header from '../../components/Header';
import PriceChart from '../../components/PriceChart';
const fetcher = (u:string)=> fetch(u).then(r=>r.json());

// Traduce símbolo (BTC, ETH, etc) al ID que CoinGecko necesita (bitcoin, ethereum, etc)
async function getGeckoIdFromSymbol(symbol: string): Promise<string | null> {
  const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
  const coins = await res.json();

  // Busca una coincidencia por símbolo
  const coin = coins.find((c: any) => c.symbol.toLowerCase() === symbol.toLowerCase());

  return coin?.id || null;
}

export default function CoinDetail() {
  const router = useRouter();
  const symbol = String(router.query.symbol || '');
  const quote = useSWR(() => symbol ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cryptos/quote/${symbol}` : null, fetcher, { refreshInterval: 60000 });
  const info = useSWR(() => symbol ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cryptos/info/${symbol}` : null, fetcher);
const [cgId, setCgId] = useState<string | null>(null);

useEffect(() => {
  if (symbol) {
    getGeckoIdFromSymbol(symbol).then(setCgId);
  }
}, [symbol]);


  // selectable ranges
  const daysOptions = [1,7,30];
  const days = Number((router.query.days as string) || 7);
  const history = useSWR(() =>cgId ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/cryptos/history?id=${cgId}&days=${days}` : null,fetcher);


  const prices = history.data?.prices || [];

  return (
    <>
      <Header />
      <main className='p-6 max-w-4xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4 header-title'>{symbol} details</h1>
        <section className='card'>
          {quote.data ? (
            <div>
              <div className='mb-2'>Price: ${quote.data.data?.[symbol]?.quote?.USD?.price?.toFixed(2) ?? '-'}</div>
              <div>24h: {quote.data.data?.[symbol]?.quote?.USD?.percent_change_24h ?? '-' }%</div>
            </div>
          ) : <div>Loading price...</div>}

          <div className='mt-6'>
            <h3 className='mb-2'>History</h3>
            <div className='mb-3'>
              {daysOptions.map(d => (
                <a key={d} href={`?days=${d}`} className='px-2 py-1 mr-2 rounded border border-slate-700'>{d}d</a>
              ))}
            </div>
            {prices.length ? <PriceChart prices={prices} /> : <div>Loading chart...</div>}
          </div>
        </section>
      </main>
    </>
  );
}
