# Code Splitting

Code splitting breaks one big JavaScript bundle into smaller files, so the browser only downloads the code a page actually needs.

## What it is

When a bundler builds your app, it normally joins all your files into one big file called a **bundle**.

**Code splitting** means cutting that one big bundle into several smaller files. Each small file is called a **chunk**.

Think of it like a pizza. Instead of forcing a guest to eat the whole pizza at once, you cut it into slices and give them one slice when they want it.

## Why we use it

- **Faster first load**: the user downloads only the code for the page they open, not the whole app.
- **Better caching**: if you change one page, only that page's chunk changes. The browser keeps the other chunks in its cache (saved copy).
- **Less wasted data**: a user who never opens the admin page never downloads the admin code.

## How it works

1. You write a **dynamic import**: `import("./file.js")`. This is a function call, not the normal `import` at the top of a file.
2. The bundler sees the dynamic import and says: "this file can be loaded later".
3. The bundler puts that file (and its own imports) into a separate chunk, for example `Settings-4f2a1c.js`.
4. At runtime, when your code calls `import()`, the browser downloads that chunk over the network.
5. `import()` returns a **Promise** (a value that arrives later). When it resolves, you can use the module.

## Types of code splitting

| Type | What gets split | Example |
| --- | --- | --- |
| Entry points | Different pages/apps get their own bundle | `home.js`, `admin.js` |
| Dynamic imports | Code loaded on demand | `import("./chart.js")` |
| Vendor split | Library code from `node_modules` goes in its own chunk | `vendor.js` with React |

## A small example

Plain JavaScript: load a heavy chart file only when the user clicks a button.

```js
// main.js
const button = document.querySelector("#show-chart");

button.addEventListener("click", async () => {
  // This file is NOT in the main bundle. It is downloaded on click.
  const { drawChart } = await import("./chart.js");
  drawChart();
});
```

React: split by route (page) with `React.lazy`.

```jsx
import { lazy, Suspense } from "react";

const Settings = lazy(() => import("./pages/Settings.jsx"));

export default function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Settings />
    </Suspense>
  );
}
```

After `npm run build`, you will see an extra file in `dist/assets/` such as `Settings-B7x9kQ.js`.

## Common config

Most of the time you do not need any config. Vite, webpack, Rollup and Next.js split dynamic imports automatically.

Vite: put React into its own vendor chunk.

```js
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
        },
      },
    },
  },
});
```

webpack: split shared library code automatically.

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: "all", // split code from both normal and dynamic imports
    },
  },
};
```

## When to use it

- Split by **route** (each page is a chunk). This is the easiest win.
- Split **big, rarely used** features: charts, rich text editors, PDF viewers, maps.
- Do **not** split tiny files. Every chunk is one more network request, so too many small chunks can make things slower.

Next.js does route splitting for you: each page in `app/` gets its own chunk.

## Related notes

- [Lazy Loading](./lazy-loading.md) - loading those chunks only when needed
- [Tree Shaking](./tree-shaking.md) - removing unused code from each chunk
- [Vite](../03-bundlers/vite/vite-overview.md) and [webpack](../03-bundlers/webpack/webpack-basics.md)

## Key points

- Code splitting = one big bundle becomes many smaller chunks.
- `import("./file.js")` is the main tool. The bundler creates a chunk for it.
- In React, use `React.lazy` + `<Suspense>`.
- Split by route first, then split heavy features.
- Too many tiny chunks can hurt. Aim for a balance.
