# AI Notes to Mind Map Generator

Frontend-only React app for turning pasted notes into an interactive mind map UI. This folder is prepared to deploy on Vercel and connect to a separately deployed backend through `VITE_API_BASE_URL`.

## Stack

- React 18 + Vite
- Tailwind CSS 4
- Framer Motion
- React Flow (`@xyflow/react`)
- `html-to-image`
- `react-router-dom`

## Frontend Features

- Landing page plus app workspace
- Interactive mind map canvas with drag, zoom, minimap, and controls
- Branch collapse and inline node renaming
- PNG export
- JSON export
- Local browser saves
- Shareable links with encoded map data
- Example notes
- Light and dark theme toggle
- Responsive layout

## Project Structure

```text
client/
  src/
    components/
    lib/
    pages/
    App.jsx
    main.jsx
  index.html
  package.json
  vercel.json
  vite.config.js
```

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Create your local env file:

```bash
cp .env.example .env
```

3. Start the frontend:

```bash
npm run dev
```

The dev server runs on `http://localhost:5173`.

## Environment Variable

This frontend uses one public env variable:

```bash
VITE_API_BASE_URL=http://localhost:5001/api
```

For production on Vercel, set it to your deployed Render backend API URL, for example:

```bash
VITE_API_BASE_URL=https://your-backend.onrender.com/api
```

If `VITE_API_BASE_URL` is missing in production, the UI still loads, but AI generation is disabled and the app shows a setup message instead of silently failing.

## Deploy To Vercel

1. Import the repository into Vercel.
2. Set the Root Directory to `client`.
3. Set the Framework Preset to `Vite` if Vercel does not detect it automatically.
4. Add the environment variable `VITE_API_BASE_URL` and point it to your Render backend URL ending in `/api`.
5. Deploy.

This folder already includes [vercel.json](/Users/apple/Downloads/VS-code/Vibecode/mindmap/client/vercel.json) with an SPA rewrite so React Router routes like `/app` work after deployment.

## Build

Run a production build locally with:

```bash
npm run build
```

The build output is written to `dist/`.

## Notes

- Saved mind maps live in browser local storage.
- Share links store encoded map data in the URL, so very large maps can make long links.
- The frontend does not contain backend code; it only calls the configured API base URL.
