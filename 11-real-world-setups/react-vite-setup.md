# React + Vite Setup

A step-by-step guide to creating a React app with Vite: the create command, folder structure, scripts, environment variables and the build output.

## What it is

**Vite** (French for "fast", said like "veet") is a build tool with a very fast dev server. It is the most common way to start a new React app today (Create React App is deprecated). See [Vite overview](../03-bundlers/vite/vite-overview.md).

You need **Node.js 20.19+ or 22.12+** for Vite 7. Check with:

```bash
node -v
```

## Step 1: Create the project

```bash
npm create vite@latest my-app -- --template react
```

- `my-app` is the folder name.
- `--template react` picks React with JavaScript. Use `react-ts` for TypeScript.
- The extra `--` passes the flag through npm to the create tool.

You can also run `npm create vite@latest` with no options and answer the questions.

## Step 2: Install and start

```bash
cd my-app
npm install
npm run dev
```

Open `http://localhost:5173`. Edit `src/App.jsx` and save: the page updates instantly without a reload. That is HMR (see [Hot Module Replacement](../08-dev-tools/hot-module-replacement.md)).

## Step 3: Understand the folder structure

```text
my-app/
├── public/            # files copied as-is (favicon, robots.txt)
│   └── vite.svg
├── src/               # your app code
│   ├── assets/        # images etc. that you import in code
│   ├── App.css
│   ├── App.jsx        # main component
│   ├── index.css
│   └── main.jsx       # entry point: mounts React into the page
├── index.html         # the HTML page, it is the real entry of the app
├── eslint.config.js
├── package.json
└── vite.config.js     # Vite config
```

Important: in Vite, `index.html` sits in the project root (not in `public/`). It loads your code with:

```html
<div id="root"></div>
<script type="module" src="/src/main.jsx"></script>
```

And `main.jsx` mounts React:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

## Step 4: Know the config and scripts

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // JSX + Fast Refresh for React
});
```

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Starts the dev server (code served from memory, no `dist/`) |
| `npm run build` | Makes the production build in `dist/` |
| `npm run preview` | Serves `dist/` locally so you can test the real build |
| `npm run lint` | Checks code with ESLint |

## Step 5: Use environment variables

Create a `.env` file in the project root:

```bash
# .env
VITE_API_URL=https://api.example.com
```

Read it in code with `import.meta.env`:

```jsx
const apiUrl = import.meta.env.VITE_API_URL;
```

Rules:

- Only variables starting with **`VITE_`** reach your code. This stops you leaking other values by accident.
- Everything with `VITE_` ends up in the browser bundle, so **never put secrets there**.
- Other files: `.env.local` (not committed), `.env.development`, `.env.production`.
- Built-in values: `import.meta.env.MODE`, `import.meta.env.DEV`, `import.meta.env.PROD`.
- Restart `npm run dev` after changing `.env` files.

## Step 6: Build for production

```bash
npm run build
```

Output:

```text
dist/
├── index.html
├── vite.svg
└── assets/
    ├── index-BxY3k9aQ.js
    └── index-D8f2LmQe.css
```

- The random part (`BxY3k9aQ`) is a **hash** of the file content. When the content changes, the name changes, so browsers never use an old cached file.
- The JS is bundled with Rollup, tree-shaken and minified.
- Upload the `dist/` folder to any static host (Netlify, Vercel, GitHub Pages, S3...).

Test it locally first:

```bash
npm run preview   # serves dist/ on http://localhost:4173
```

## Key points

- Create: `npm create vite@latest my-app -- --template react`.
- `index.html` is in the root; `src/main.jsx` is the JS entry.
- `npm run dev` for development, `npm run build` for production, `npm run preview` to test the build.
- Env vars need the `VITE_` prefix and are read with `import.meta.env`.
- The build goes to `dist/` with hashed file names.
