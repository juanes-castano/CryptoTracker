// Importamos Link de Next.js para navegación interna (aunque no se usa aquí)
import Link from 'next/link';

// Componente funcional Header
export default function Header() {
  return (
    // Header con padding vertical y horizontal, y fondo con gradiente azul oscuro
    <header className='py-6 px-4 bg-gradient-to-r from-[#071022] to-[#071033]'>
      {/* Contenedor centrado con ancho máximo y flex para alinear ítems en fila */}
      <div className='max-w-6xl mx-auto flex items-center gap-4'>
        
        {/* Imagen del logo */}
        <img
          src='/images/logo.png'             // Ruta de la imagen del logo
          alt='logo'                        // Texto alternativo para accesibilidad
          width={56}                        // Ancho fijo de 56px
          height={56}                       // Alto fijo de 56px
          className='rounded-full'          // Bordes redondeados para hacerla circular
        />
        
        {/* Contenedor del texto del título y subtítulo */}
        <div>
          {/* Título principal con texto grande, negrita y estilo personalizado */}
          <div className='text-3xl font-extrabold header-title'>
            Crypto{/* Parte del título normal */}
            <span className='text-neon-cyan'>Tracker</span>{/* "Tracker" en color cyan neón */}
          </div>
          {/* Subtítulo con texto pequeño y color gris claro */}
          <div className='text-sm text-slate-400'>
            Realtime portfolio & price monitoring{/* Descripción breve */}
          </div>
        </div>
      </div>
    </header>
  );
}
