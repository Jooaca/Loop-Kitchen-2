# Loop Kitchen 🍳

Loop Kitchen es un asistente inteligente de cocina y despensa móvil desarrollado con **React (Vite)** en el frontend y **Express (Node.js)** con **MongoDB** en el backend. Integra inteligencia artificial para planificar menús semanales de 7 días y sugerir recetas personalizadas basadas en los ingredientes que tienes en tu despensa.

## 🌟 Características clave
* **Gestión de Despensa (Pantry):** Registra tus ingredientes, unidades y cantidades disponibles.
* **Recetas Inteligentes con IA:** Genera sugerencias de recetas utilizando los ingredientes de tu despensa para reducir el desperdicio.
* **Planificador Semanal Inteligente:** Diseña planes de alimentación balanceados de 7 días adaptados a tus objetivos y presupuesto.
* **Lista de Supermercado Optimizada:** Genera listas de compras automáticamente y las optimiza usando IA.
* **Almacenamiento Local de Respaldo:** Si MongoDB está sin conexión, la app inicia automáticamente en modo de fallback en memoria.

---

## 📁 Estructura del Proyecto

El repositorio está organizado de la siguiente manera:
* `client/` - Aplicación frontend construida con React, Vite y react-router-dom.
* `server/` - Servidor backend REST API construido con Node.js, Express y Mongoose.
* `loop-kitchen-app/` - Prototipo estático HTML/JS.

---

## 🛠️ Requisitos previos
* **Node.js** (versión 18 o superior recomendada).
* **MongoDB** (opcional, la app cuenta con un modo de almacenamiento en memoria si no está activo).

---

## 🚀 Guía de Instalación y Ejecución

Sigue estos pasos para clonar y ejecutar el repositorio localmente.

### 1. Clonar el repositorio
```bash
git clone https://github.com/Jooaca/loopkitchen.git
cd loopkitchen
```

### 2. Configurar el Backend
1. Ve al directorio del servidor:
   ```bash
   cd server
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Crea un archivo `.env` a partir del archivo de ejemplo `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Abre `.env` y configura tus credenciales. Asegúrate de incluir tu clave de API proxy o de Gemini:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/loopkitchen
   JWT_SECRET=tu_secreto_para_jwt
   STUDENT_PROXY_API_KEY=tu_clave_api_proxy
   STUDENT_PROXY_URL=https://gemini-vertex-student-proxy.vercel.app/api/gemini
   CLIENT_URL=http://localhost:5173
   ```
5. Inicia el servidor backend:
   ```bash
   # Modo desarrollo (con recarga automática)
   node --watch server.js
   # O alternativamente
   node server.js
   ```
   El servidor iniciará en [http://localhost:5000](http://localhost:5000).

### 3. Configurar el Frontend
1. Abre una nueva terminal y navega al directorio del cliente:
   ```bash
   cd client
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npx vite
   ```
   La aplicación cliente estará lista en [http://localhost:5173](http://localhost:5173).

---

## 🔒 Notas sobre Seguridad
* El archivo `server/.env` contiene claves de API y secretos. **Nunca** lo subas a repositorios públicos. Ya está configurado en el archivo `.gitignore` raíz para evitar subirse accidentalmente.
