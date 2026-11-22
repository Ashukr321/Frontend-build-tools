# Parcel

Parcel is a zero-configuration bundler: point it at an HTML file and it works out the rest, with a dev server and fast rebuilds built in.

## What it is

Parcel is a web application bundler. "Zero configuration" means you usually do **not** need a config file. Parcel looks at your files and decides what to do with them.

Analogy: webpack is like cooking from scratch with a long recipe. Parcel is like a meal kit: everything is ready, you just heat it up.

Parcel 2 has a fast core written in **Rust** and caches its work on disk, so the second build is much faster than the first.

## Why we use it

- **No setup**: start a project in seconds.
- **Everything built in**: TypeScript, JSX, CSS, Sass, images, a dev server and [HMR](../08-dev-tools/hot-module-replacement.md).
- **Automatic optimizations** in production: minification, [tree shaking](../09-optimization/tree-shaking.md), [code splitting](../09-optimization/code-splitting.md) and content hashing.
- Good for learning, prototypes and small to medium apps.

## How it works

1. You give Parcel an entry, usually `index.html`.
2. Parcel reads the HTML and finds `<script>`, `<link>` and `<img>` tags.
3. It follows each file and its imports to build a dependency graph.
4. For each file type it picks a **transformer** automatically (for example SWC for JS/TS, a Sass compiler for `.scss`). If a needed tool is missing, Parcel can install it for you.
5. It bundles, optimizes and writes the result to `dist/`.
6. It saves a cache in `.parcel-cache/`, so the next build only redoes what changed.

## A small example

```bash
npm install -D parcel
```

```text
my-app/
  index.html
  src/
    index.js
    style.css
```

```html
<!-- index.html -->
<link rel="stylesheet" href="./src/style.css" />
<script type="module" src="./src/index.js"></script>
```

```json
{
  "source": "index.html",
  "scripts": {
    "dev": "parcel",
    "build": "parcel build"
  }
}
```

Run `npm run dev` to open a dev server (default `http://localhost:1234`), or `npm run build` to create `dist/`.

## Common commands

```bash
npx parcel index.html              # dev server with HMR
npx parcel build index.html        # production build into dist/
npx parcel build --no-source-maps  # build without source maps
npx parcel --port 3000             # change the dev server port
```

If you do need settings, add a `.parcelrc` file, for example to add a plugin. Most projects never need it.

## When to use it

| Tool | Setup effort | Notes |
|---|---|---|
| Parcel | Almost none | Easiest start, everything automatic |
| [Vite](./vite/vite-overview.md) | Very little | Most popular today, huge plugin ecosystem |
| [Webpack](./webpack/webpack-basics.md) | High | Most control, many older projects use it |
| [esbuild](./esbuild.md) | Low | Fastest, but fewer app features |

Today most new React or Vue projects pick Vite. Parcel is still a great choice when you want "it just works" with almost no config.

## Key points

- Parcel is a zero-config bundler: start from `index.html` and go.
- It includes a dev server, HMR, TS/JSX/CSS support and production optimizations.
- A Rust core plus disk cache (`.parcel-cache/`) keeps it fast.
- Use `.parcelrc` only when you need to customize.
- Good for beginners and quick projects; Vite is the more common choice now.
