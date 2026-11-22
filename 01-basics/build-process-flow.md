# Build Process Flow

A build tool turns your source files into a small, fast `dist/` folder through a fixed series of steps. This note walks through each step in order.

## What it is

The build process is the journey your code takes from the files you write (`src/`) to the files the browser downloads (`dist/`).

Think of it like a factory line. Raw material (your code) goes in at one end. Each station does one job. A finished, packed product comes out at the other end.

New to build tools? Read [what is a build tool](./what-is-build-tool.md) first.

## Why we need it

- Browsers do not understand TypeScript, JSX or Sass directly.
- Hundreds of small files mean hundreds of network requests, which is slow.
- Comments, spaces and unused code make files bigger than they need to be.
- Images and fonts need correct, cache-friendly file names.

The build process fixes all of these automatically.

## The whole flow at a glance

```text
 src/ (your code)
     |
     v
 1. Entry point        start from one file, e.g. src/main.js
     |
     v
 2. Resolve imports    follow every import and build a "dependency graph"
     |
     v
 3. Transpile          TS / JSX / modern JS  ->  plain JS the browser understands
     |
     v
 4. Bundle             join many modules into a few files (chunks)
     |
     v
 5. Optimize           tree shaking, minification, code splitting
     |
     v
 6. Assets             CSS, images, fonts -> processed and renamed with a hash
     |
     v
 7. Output             write everything to dist/
```

## How it works (step by step)

1. **Entry point** - The tool starts from one file you name, like `src/index.js`. This is the front door of your app.
2. **Resolve imports** - It reads that file and finds every `import`. Then it opens those files and finds *their* imports, and so on. The result is a **dependency graph**: a map of which file needs which. "Resolve" just means finding the real file on disk, for example turning `import React from "react"` into `node_modules/react/index.js`.
3. **Transpile** - "Transpile" means translating code from one form of JavaScript into another. TypeScript types are removed, JSX (`<App />`) becomes normal function calls, and very new syntax can be rewritten for older browsers. Tools: [Babel](../04-transpilers/babel.md), [TypeScript](../04-transpilers/typescript.md), esbuild, SWC.
4. **Bundle** - All the modules in the graph are joined into one or a few files called **bundles** or **chunks**. Fewer files means fewer requests.
5. **Optimize** - The tool makes the bundle smaller and faster:
   - [Tree shaking](../09-optimization/tree-shaking.md): removes code you never use.
   - [Minification](../09-optimization/minification.md): removes spaces and comments, shortens variable names.
   - [Code splitting](../09-optimization/code-splitting.md): splits code so each page loads only what it needs.
6. **Assets** - CSS is processed (for example [Sass](../06-css-tools/sass.md) to CSS, [PostCSS](../06-css-tools/postcss.md) adds browser prefixes). Images may be compressed. Files get a **content hash** in their name, like `logo.3f9a1c.png`. The hash changes only when the file changes, so browsers can cache safely.
7. **Output** - Everything is written to the `dist/` folder, ready to upload to a server.

## A small example

Your source:

```text
src/
  index.js        imports ./math.js and ./style.css
  math.js         exports add() and multiply()
  style.css
```

```js
// src/index.js
import { add } from "./math.js";
import "./style.css";
console.log(add(2, 3));
```

After `npm run build` you may get:

```text
dist/
  index.html
  assets/index-a1b2c3.js     (math.js + index.js, minified, multiply() removed)
  assets/index-d4e5f6.css
```

Notice `multiply()` is gone because nothing used it (tree shaking).

## Dev mode vs build mode

| | Dev (`npm run dev`) | Build (`npm run build`) |
|---|---|---|
| Goal | Fast feedback while coding | Smallest, fastest files for users |
| Output | Kept in memory, no `dist/` | Written to `dist/` |
| Minify | No | Yes |
| Extras | [Dev server](../08-dev-tools/dev-server.md), [HMR](../08-dev-tools/hot-module-replacement.md) | Hashing, tree shaking, splitting |

## Key points

- Flow: entry -> resolve imports -> transpile -> bundle -> optimize -> assets -> `dist/`.
- The dependency graph is the map that tells the tool which files to include.
- Transpiling translates code; bundling joins code; minifying shrinks code.
- Hashed file names let browsers cache files safely.
- Dev mode skips the heavy steps to stay fast; build mode does them all.
