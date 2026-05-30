# Registral Frontend (RMS)

React 18 + Vite + Material UI client for the Registrar Management System.

**Related repo:** [registral-yordi-backend](https://github.com/TENSAEA/registral-yordi-backend)

## Setup

```bash
npm install
npm run dev
```

App runs at `http://localhost:3000`. API requests to `/api` are proxied to `http://localhost:5000` (see `vite.config.js`). Start the backend before using the app.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build (`dist/`) |
| `npm run preview` | Preview production build |

## Deployment

Build with `npm run build` and deploy the `dist/` folder (Vercel, Netlify, etc.). Configure your host to proxy `/api` to your deployed backend, or set the API base URL in your deployment config.
