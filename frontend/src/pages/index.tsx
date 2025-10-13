// Importa el componente Head de Next.js para poder modificar el <head> del HTML (como el título)
import Head from 'next/head';

// Importa el componente Header personalizado que muestra el logo y el título
import Header from '../components/Header';

// Importa el componente CoinList que muestra la lista de criptomonedas
import CoinList from '../components/CoinList';

// Componente principal de la página de inicio ("/")
export default function Home() {
  return (
    <>
      {/* Head modifica el <head> del documento HTML, útil para SEO, título, favicon, etc. */}
      <Head>
        <title>CryptoTracker</title>
      </Head>

      {/* Header: muestra el logo y título de la app */}
      <Header />

      {/* Contenido principal de la página */}
      <main className='p-6 max-w-6xl mx-auto'>
        
        {/* Sección introductoria con título y subtítulo */}
        <section className='mb-6'>
          <h2 className='text-xl font-bold mb-2 header-title'>Live market</h2>
          <p className='text-sm text-slate-400'>Prices update every 1 minute.</p>
        </section>

        {/* Sección principal donde se muestra la lista de criptomonedas */}
        <section className='card'>
          <CoinList />
        </section>
      </main>
    </>
  );
}
