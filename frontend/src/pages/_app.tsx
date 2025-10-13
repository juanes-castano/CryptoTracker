// Importa los estilos globales para que estén disponibles en toda la app
import '../styles/globals.css';

// Importa el tipo de props que recibe el componente principal desde Next.js
import type { AppProps } from 'next/app';

// Este es el componente principal que Next.js usa para renderizar todas las páginas.
// Es como el punto de entrada para cada "vista" o "pantalla" en la app.
export default function App({ Component, pageProps }: AppProps) {
  // Renderiza el componente correspondiente a la ruta actual (ej: Home, About, etc.)
  // Le pasa las props necesarias que Next.js genera automáticamente
  return <Component {...pageProps} />;
}
