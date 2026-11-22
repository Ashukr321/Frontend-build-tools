# Rollup

Rollup is a JavaScript bundler known for small, clean output and great tree shaking. It is popular for libraries and powers Vite's production build.

## What it is

Rollup is a **module bundler**. It takes your ES modules (files that use `import` and `export`) and combines them into one or more output files.

Rollup was one of the first bundlers built around ES modules. Because `import` and `export` are fixed at the top of a file, Rollup can see exactly what is used, and drop what is not. This is called [tree shaking](../09-optimization/tree-shaking.md).

## Why we use it

- **Small, readable output**: very little extra "glue" code is added.
- **Excellent tree shaking**: unused exports are removed.
- **Many output formats** from one source: ESM, CommonJS, UMD, IIFE. Perfect for publishing npm libraries.
- **Simple plugin system**. Vite's plugins use the same style.
- **Inside Vite**: Vite has used Rollup for production builds. Newer Vite versions use **Rolldown**, a Rust rewrite of Rollup with the same plugin API.

## How it works

1. Rollup starts from the `input` file.
2. It follows every `import` and builds a dependency graph.
3. It marks which exports are really used.
4. It **hoists** all modules into one scope (called "scope hoisting"), meaning it puts the code side by side instead of wrapping every file in a function. This makes output smaller and faster.
5. Plugins run along the way (to read `node_modules`, convert CommonJS, transpile TypeScript, minify).
6. It writes the bundle in each format you asked for.

## A small example

```bash
npm install -D rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-terser
```

`rollup.config.js`:

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import terser from "@rollup/plugin-terser";

export default {
  input: "src/index.js",
  output: [
    { file: "dist/my-lib.mjs", format: "es" },  // for modern bundlers
    { file: "dist/my-lib.cjs", format: "cjs" }, // for older Node require()
  ],
  plugins: [
    resolve(),   // find packages in node_modules
    commonjs(),  // convert CommonJS packages to ES modules
    terser(),    // minify
  ],
};
```

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c --watch"
  }
}
```

`-c` means "use the config file".

## Common plugins

| Plugin | Job |
|---|---|
| `@rollup/plugin-node-resolve` | Lets Rollup find packages in `node_modules` |
| `@rollup/plugin-commonjs` | Converts `require()` code to `import` |
| `@rollup/plugin-typescript` | Compiles TypeScript |
| `@rollup/plugin-babel` | Runs [Babel](../04-transpilers/babel.md) |
| `@rollup/plugin-terser` | Minifies the output |
| `@rollup/plugin-json` | Lets you `import` JSON files |

## Output formats

- `es` - ES modules (`import`/`export`). Modern default.
- `cjs` - CommonJS (`require`/`module.exports`) for older Node.
- `umd` - works in browsers via `<script>` and in Node.
- `iife` - a self-running function for a plain `<script>` tag.

## When to use it

| Need | Pick |
|---|---|
| Publishing an npm library | Rollup (or tools built on it) |
| Full web app with dev server and HMR | [Vite](./vite/vite-overview.md) |
| Huge app with many custom loaders | [Webpack](./webpack/webpack-basics.md) |
| Fastest possible build | [esbuild](./esbuild.md) |

## Key points

- Rollup is an ES-module-first bundler with very good tree shaking.
- Output is small and clean thanks to scope hoisting.
- One config can produce `es`, `cjs`, `umd` and `iife` builds.
- Plugins handle `node_modules`, CommonJS, TypeScript and minifying.
- Vite's production build is based on Rollup (now Rolldown, which keeps the same plugin API).
