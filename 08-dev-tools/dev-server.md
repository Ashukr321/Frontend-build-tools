# Dev Server

A dev server is a local web server for development. It serves your app from memory, rebuilds on save and refreshes the browser for you.

## What it is

- A **dev server** is a small web server that runs on your own computer while you code, usually at `http://localhost:5173` (Vite) or `http://localhost:3000`.
- `localhost` means "this computer". Only you can open it (unless you share it on your network).
- It is started by a command like `npm run dev`.
- Think of it as a **practice kitchen**: you cook and taste quickly while making changes. The production build is the final dish packed for delivery.

As described in [what is a build tool](../01-basics/what-is-build-tool.md), the dev server does **not** write a `dist` folder. It keeps the built files in memory (RAM) and sends them straight to the browser.

## Why we use it

- **You cannot just double-click `index.html`** - modern apps use ES modules, JSX and TypeScript, which need a server and a build step.
- **Instant feedback** - save a file and see the change in the browser in milliseconds.
- **Hot Module Replacement** - updates only the changed code without losing page state. See [HMR](./hot-module-replacement.md).
- **Helpful errors** - build errors are shown as an overlay right in the browser.
- **Proxy** - forwards API calls to your backend so you avoid CORS errors. (**CORS** is a browser security rule that blocks requests to a different address unless that server allows it.)

## How it works

1. You run `npm run dev`.
2. The tool starts a server on a port (for example 5173).
3. It starts a **file watcher**, which notices every time you save a file.
4. The browser asks for `index.html`. The server sends it.
5. The browser asks for `/src/main.jsx`. The server transforms it on the fly (JSX to JS, removes TypeScript types) and sends the result from memory.
6. The server keeps a **WebSocket** open with the browser. A WebSocket is an always-open two-way connection, like a phone line that stays connected.
7. When you save a file, the watcher tells the server, the server rebuilds that part, and it sends a message over the WebSocket so the browser updates.

**Vite vs Webpack style:**

- [Vite](../03-bundlers/vite/vite-overview.md) does **not** bundle in dev. The browser loads each file as a native ES module, and Vite transforms only the files the browser asks for. That is why it starts almost instantly.
- [Webpack](../03-bundlers/webpack/webpack-basics.md) dev server **bundles** the whole app first (in memory), then serves the bundle. Big apps start more slowly.

## A small example

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev
```

Output:

```text
  VITE vX.Y.Z  ready in 300 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Common commands / config

Vite dev server options in `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,       // change the port
    open: true,       // open the browser automatically
    host: true,       // allow phones on the same Wi-Fi to open it
    proxy: {
      // /api/users -> http://localhost:8080/api/users
      "/api": "http://localhost:8080",
    },
  },
});
```

Useful commands:

```bash
npm run dev              # start the dev server
npx vite --port 4000     # start on another port
npx vite --host          # share on your local network
npm run build            # make the real production files in dist/
npx vite preview         # serve the dist/ folder locally to test the build
```

Webpack uses `webpack-dev-server` with a `devServer` section in `webpack.config.js` (`port`, `hot`, `proxy`, `historyApiFallback`).

## When to use it

| Situation | Use |
| --- | --- |
| Writing code every day | Dev server (`npm run dev`) |
| Testing the final optimized build | `npm run build` then `vite preview` |
| Real users on the internet | A production host or CDN, never the dev server |

The dev server is for development only. It is not optimized and not secure enough for real traffic.

## Key points

- A dev server runs your app locally at `localhost` while you code.
- It serves files from memory; no `dist` folder is created.
- A file watcher plus a WebSocket give instant updates and HMR.
- Vite serves native ES modules without bundling, so it starts fast.
- Use `proxy` to reach your backend; never use the dev server in production.
