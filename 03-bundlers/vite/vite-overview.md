# Vite

Vite is a modern build tool that starts a dev server almost instantly and builds small, optimized files for production.

## What it is

Vite (French for "quick", said "veet") is a build tool made by the creator of Vue. It works with React, Vue, Svelte, plain JavaScript and more.

It has two parts:

- A **dev server** for coding, with very fast [Hot Module Replacement](../../08-dev-tools/hot-module-replacement.md) (HMR).
- A **build command** that bundles your app for production into `dist/`.

## Why we use it

- **Instant start**: the dev server is ready in milliseconds, even in big projects.
- **Fast HMR**: changes show in the browser right away, without losing page state.
- **Little config**: TypeScript, JSX, CSS, PostCSS and static assets work out of the box.
- **Optimized builds**: minification, [tree shaking](../../09-optimization/tree-shaking.md) and [code splitting](../../09-optimization/code-splitting.md) by default.
- **Big plugin ecosystem**, compatible with Rollup-style plugins.

## How it works

### In development (`npm run dev`)

Older bundlers like webpack bundle the **whole app first**, then start the server. Vite does not.

1. **Pre-bundle dependencies** - Vite uses [esbuild](../esbuild.md) to convert packages in `node_modules` (like React) into ES modules once and caches them. This is fast because esbuild is written in Go.
2. **Serve your code as native ES modules** - Modern browsers understand `import` directly. When the browser asks for `/src/App.jsx`, Vite transforms only that file (JSX to JS, for example) and sends it back.
3. **Only what the page needs** - Files are transformed on demand, so startup does not depend on app size.
4. **HMR** - When you save a file, Vite updates just that module in the browser.

Analogy: webpack cooks the whole menu before opening the restaurant. Vite opens immediately and cooks each dish when someone orders it.

### In production (`npm run build`)

Shipping hundreds of unbundled files would be slow for users, so Vite does bundle for production. It uses **Rollup** (and in newer versions **Rolldown**, a faster Rust version of Rollup) to bundle, tree shake, split and minify. The result goes to `dist/`.

## A small example

Create a project:

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

The dev server runs at `http://localhost:5173` by default.

The `sample-project/` folder next to this note is a place to try a plain JavaScript setup. Put an `index.html` beside `index.js`:

```html
<!-- index.html -->
<script type="module" src="/index.js"></script>
```

```js
// index.js
console.log("Hello from Vite");
```

Then run `npx vite` inside that folder.

## Common commands and config

```bash
npm run dev       # vite         - start dev server
npm run build     # vite build   - production build into dist/
npm run preview   # vite preview - serve dist/ locally to test the build
```

`vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],             // add React support (JSX, Fast Refresh)
  server: { port: 3000 },         // change dev server port
  build: { outDir: "dist" },      // where the build goes
  resolve: { alias: { "@": "/src" } }, // write "@/x" instead of "../../x"
});
```

Environment variables: put them in `.env` with a `VITE_` prefix (for example `VITE_API_URL=...`) and read them with `import.meta.env.VITE_API_URL`.

## When to use it

| Tool | Dev start | Config | Best for |
|---|---|---|---|
| Vite | Instant | Small | Most new apps today |
| [Webpack](../webpack/webpack-basics.md) | Slower on big apps | Large | Older or highly custom projects |
| [Parcel](../parcel.md) | Fast | None | Quick, zero-config projects |
| [esbuild](../esbuild.md) | Very fast | Small | Libraries, scripts |

See a full setup in [React + Vite](../../11-real-world-setups/react-vite-setup.md).

## Key points

- Vite has a fast dev server and an optimized production build.
- Dev: esbuild pre-bundles dependencies; your code is served as native ES modules on demand.
- Build: Rollup (now Rolldown) bundles, tree shakes and minifies into `dist/`.
- Default dev port is 5173; config lives in `vite.config.js`.
- Only `VITE_`-prefixed env variables reach your browser code.
