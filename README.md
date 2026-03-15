# GameBet - Ajedrez con Apuestas Crypto

App de ajedrez descentralizada que permite a los usuarios competir y ganar recompensas en criptomonedas (BNB, USDT) a través de contratos inteligentes en BNB Smart Chain.

## Tecnologías

- **Frontend**: Vite, React, TypeScript
- **Estilos**: Tailwind CSS, shadcn/ui, Framer Motion
- **Blockchain**: Ethers.js
- **Backend/Base de Datos**: Supabase

## Configuración Local

1. **Clona el repositorio**:
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd crypto-chess-bets
   ```

2. **Instala las dependencias**:
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**:
   Crea un archivo `.env` basado en `.env.example` y añade tus credenciales de Supabase.

4. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## Despliegue

El proyecto está configurado para ser desplegado en plataformas como Vercel o Netlify. Asegúrate de configurar las variables de entorno en el panel de control de tu proveedor de hosting.
