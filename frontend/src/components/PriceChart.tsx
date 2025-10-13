import React from 'react';
// Importamos el componente Line para gráficos de líneas de react-chartjs-2
import { Line } from 'react-chartjs-2';
// Importamos los módulos necesarios de Chart.js para registrar escalas, elementos y plugins
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  TimeScale,
  ChartOptions,
  Plugin
} from 'chart.js';

// Registramos los componentes necesarios en ChartJS para poder usarlos
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, TimeScale);

// Plugin personalizado para poner un fondo ligeramente más claro en el canvas del gráfico
const backgroundPlugin: Plugin<'line'> = {
  id: 'customCanvasBackgroundColor',
  beforeDraw: (chart) => {
    const ctx = chart.ctx; // Contexto de dibujo de canvas
    ctx.save(); // Guardamos estado previo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'; // Color blanco con muy baja opacidad para fondo
    ctx.fillRect(0, 0, chart.width, chart.height); // Dibujamos rectángulo que cubre todo el canvas
    ctx.restore(); // Restauramos estado
  }
};

// Definimos la interfaz de las props, que recibe un arreglo de tuplas [timestamp, precio]
interface PriceChartProps {
  prices: [number, number][];
}

// Opciones de configuración para el gráfico
const options: ChartOptions<'line'> = {
  plugins: {
    legend: {
      labels: {
        color: '#0ff' // Color azul cian para las etiquetas de la leyenda
      }
    }
  },
  scales: {
    // Configuración del eje X
    x: {
      grid: {
        color: 'rgba(255,255,255,0.1)' // Color tenue para líneas de la cuadrícula
      },
      ticks: {
        color: '#ccc' // Color gris claro para etiquetas de ticks
      }
    },
    // Configuración del eje Y
    y: {
      grid: {
        color: 'rgba(255,255,255,0.1)' // Igual que el eje X para uniformidad
      },
      ticks: {
        color: '#ccc' // Color de texto para ticks del eje Y
      }
    }
  }
};

// Componente funcional que recibe precios y genera el gráfico de línea
export default function PriceChart({ prices }: PriceChartProps) {
  // Convertimos timestamps a cadenas de fecha legibles para las etiquetas X
  const labels = prices.map(p => new Date(p[0]).toLocaleString());

  // Datos para el gráfico, con etiquetas y conjunto de datos con precios
  const data = {
    labels,
    datasets: [
      {
        label: 'Price (USD)', // Etiqueta para la leyenda
        data: prices.map(p => p[1]), // Valores de precio a graficar
        tension: 0.2, // Curvatura de la línea para suavizarla
        fill: false, // No rellenar debajo de la línea
        borderColor: '#0ff', // Color de la línea azul cian
        backgroundColor: '#0ff' // Color de los puntos (si se usan)
      }
    ]
  };

  // Renderizamos el componente Line con los datos, opciones y el plugin de fondo
  return <Line data={data} options={options} plugins={[backgroundPlugin]} />;
}
