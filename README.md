# 🪙 **Crypto Tracker**

**Crypto Tracker** es una aplicación web full stack desarrollada con **Next.js (frontend)** y **Node.js/Express (backend)** que permite a los usuarios consultar precios de criptomonedas en tiempo real, visualizar tendencias y guardar sus monedas favoritas.  
La información se obtiene dinámicamente desde las APIs públicas de **CoinGecko** y **CoinMarketCap**, almacenándose las preferencias del usuario en una base de datos **SQLite**.

---

## 📁 **Estructura General del Proyecto**

```
cCRYPTO_TRACKER_FINAL/
├── backend/
│   ├── src/
│   │   ├── controllers/       → Controladores de rutas
│   │   ├── middleware/        → Autenticación JWT
│   │   ├── routes/            → Rutas Express
│   │   ├── services/          → Servicios externos y cache
│   │   ├── utils/             → Base de datos y helpers
│   │   └── app.ts             → Servidor principal Express
│   ├── database.sqlite        → Base de datos local
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/        → UI: CoinList, CoinRow, Header, etc.
    │   ├── pages/             → index, coin/[symbol]
    │   ├── styles/            → globals.css
    │   └── Clientcache.ts     → Caché local CoinGecko
    └── package.json


```

---

## ⚙️ **Arquitectura del Backend**

El backend implementa una **arquitectura en capas (Layered Architecture)** con separación de responsabilidades:

| Capa | Descripción | Archivos |
|------|--------------|-----------|
| **Data Layer** | Define la persistencia y estructura de datos. Usa **SQLite3** como base de datos local. | `data/database.sqlite` |
| **Service Layer** | Contiene la lógica de negocio y la comunicación con APIs externas (CoinGecko / CoinMarketCap). | `services/` |
| **Controller Layer** | Recibe las peticiones HTTP, ejecuta servicios y envía respuestas JSON al frontend. | `controllers/` |
| **Routing Layer** | Define los endpoints REST y los asocia a controladores. | `routes/` |

---

## 🧠 **Flujo de Datos**

1. El usuario interactúa con la interfaz (Next.js).  
2. El frontend realiza peticiones HTTP (`GET`, `POST`) a los endpoints REST del backend.  
3. El backend obtiene datos en tiempo real desde **CoinGecko** o **CoinMarketCap**, o guarda/consulta favoritos en **SQLite**.  
4. Se retorna la información procesada al frontend.  
5. El frontend renderiza los resultados en tiempo real.

---

## 🌍 **Endpoints Principales**

### 🔹 Cryptos
| Método | Endpoint | Descripción |
|---------|-----------|--------------|
| `GET` | `/api/cryptos/list?limit=50` | Devuelve lista de criptomonedas con precios y volúmenes actuales. |
| `GET` | `/api/cryptos/:symbol` | Devuelve información detallada de una criptomoneda. |

### 🔹 Favoritos
| Método | Endpoint | Descripción |
|---------|-----------|--------------|
| `GET` | `/api/favorites` | Obtiene la lista de monedas favoritas del usuario. |
| `POST` | `/api/favorites` | Agrega una moneda a la lista de favoritos. |
| `DELETE` | `/api/favorites/:id` | Elimina una moneda favorita. |

---

## 🧩 **Frontend (Next.js + React)**

### 📦 Librerías Principales
- **Next.js** v14+  
- **React** v18+  
- **SWR** → optimiza llamadas a la API  
- **Axios** → comunicación HTTP  
- **Tailwind CSS** → diseño moderno  
- **Lucide Icons**, **Framer Motion** → íconos y animaciones

### 💡 Componentes Clave
| Componente | Descripción |
|-------------|-------------|
| `CryptoList.jsx` | Muestra lista de criptomonedas. |
| `Favorites.jsx` | Muestra y gestiona las monedas favoritas. |
| `Header.jsx` | Navegación y branding. |
| `api.js` | Configura Axios para conectar con el backend. |

---

## 🗃️ **Base de Datos (SQLite)**

### Tablas principales:
- **users**
  - `id` INTEGER (PK, AUTOINCREMENT)
  - `username` TEXT UNIQUE
  - `password` TEXT (hashed)
  - `created_at` DATETIME

- **favorites**
  - `id` INTEGER (PK, AUTOINCREMENT)
  - `user_id` INTEGER (FK → users.id)
  - `symbol` TEXT
  - `added_at` DATETIME

Relación:  
`1 usuario → N favoritos`

---

## 🔐 **Dependencias Backend**

| Librería | Descripción |
|-----------|-------------|
| **Express** | Framework del servidor |
| **Axios** | Cliente HTTP |
| **SQLite3** | Base de datos |
| **Cors** | Comunicación entre front y back |
| **Dotenv** | Variables de entorno |
| **Nodemon** | Recarga automática |

---

## 🌐 **APIs Externas**

### 🧾 CoinGecko API
Provee precios, capitalización y volumen de criptomonedas.  
Ejemplo: `/coins/{id}/market_chart?vs_currency=usd&days=7`

### 💹 CoinMarketCap API
Provee listados y métricas del mercado global.  
Ejemplo: `/v1/cryptocurrency/listings/latest`

---

## 🧰 **Lenguajes y Entorno**

| Componente | Lenguaje | Versión |
|-------------|-----------|----------|
| **Frontend** | JavaScript (Next.js + React) | Node.js 20+ |
| **Backend** | JavaScript (Node.js + Express) | Node.js 20+ |
| **Base de Datos** | SQLite | 3.45+ |
| **Estilos** | Tailwind CSS | 3.4+ |

---

## 🚀 **Instalación y Ejecución**

### 🔧 Backend
```bash
cd backend
npm install
npm start
```

### 💻 Frontend
```bash
cd frontend
npm install
npm run dev
```

Luego abre en tu navegador:  
👉 http://localhost:3000

---

## 🧾 **Buenas Prácticas y Diseño**

- Arquitectura en capas (Data → Service → Controller → Route)
- Conexión desacoplada a APIs externas  
- Código modular, legible y mantenible  
- Estilos con Tailwind CSS  
- Uso de SWR para cache y revalidación  
- Compatible con despliegue en **Vercel (frontend)** y **Render (backend)**

---

## 📊 **Futuras Mejoras**
- Autenticación JWT real  
- Dashboard de precios históricos  
- Notificaciones de alertas de mercado  
- Migración a **PostgreSQL** en producción

---

## ✨ **Autor**
**Juan Esteban Castaño León**  
Desarrollador Full Stack | Proyecto tecnico– 2025  