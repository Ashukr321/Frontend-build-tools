# Webpack Basics

Webpack is a powerful, highly configurable bundler that turns your JavaScript, CSS and assets into optimized bundles for the browser.

## What it is

Webpack is a **module bundler**. It starts from one file, finds everything that file needs, and packs it all into one or more output files called **bundles**.

Webpack treats **everything as a module**: JS, CSS, images and fonts can all be `import`ed. It has been around since 2012, and many large apps still use it. The current major version is webpack 5.

## Why we use it

- Combines many files into a few bundles, so the browser makes fewer requests.
- Handles non-JS files (CSS, images) through **loaders**.
- Extra jobs (HTML generation, CSS extraction) through **plugins**.
- Built-in [code splitting](../../09-optimization/code-splitting.md), [tree shaking](../../09-optimization/tree-shaking.md) and minification.
- Huge ecosystem and full control over every step.

## The 5 core concepts

| Concept | Plain meaning |
|---|---|
| **Entry** | The starting file, e.g. `src/index.js` |
| **Output** | Where to write the bundle, e.g. `dist/bundle.js` |
| **Loaders** | Translators for non-JS files (CSS, TS, images) so webpack can understand them |
| **Plugins** | Extra helpers for bigger jobs (create `index.html`, extract CSS, define env variables) |
| **Mode** | `development` (fast, readable) or `production` (small, minified) |

Analogy: webpack is a post office. **Entry** is where it starts collecting letters. **Loaders** translate letters written in other languages. **Plugins** are extra services like gift wrapping. **Output** is the delivery address.

## How it works

1. Read the config (`webpack.config.js`).
2. Start from the **entry** file.
3. Follow every `import` / `require` and build a **dependency graph**.
4. When a file is not plain JS, run it through the matching **loader**.
5. Combine the modules into **chunks** (groups of modules).
6. Let **plugins** do their work (for example minify in production).
7. Write the final files to the **output** folder.

## A small example

```bash
npm install -D webpack webpack-cli
```

```js
// src/index.js
import greet from "./greet.js";
console.log(greet("World"));
```

```js
// webpack.config.js
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

Run `npx webpack` and you get `dist/bundle.js`. See [Webpack Config Explained](./webpack-config-explained.md) for a line-by-line walk through the sample project in this folder.

### Adding a loader and a plugin

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // ...entry, output, mode...
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] }, // read CSS, inject into page
    ],
  },
  plugins: [new HtmlWebpackPlugin({ template: "./src/index.html" })],
};
```

Loaders in `use` run from **right to left**: `css-loader` first, then `style-loader`.

## Common commands

```bash
npx webpack                       # build using webpack.config.js
npx webpack --mode production     # minified production build
npx webpack --watch               # rebuild on every save
npx webpack serve                 # dev server (needs webpack-dev-server)
```

## When to use it

| Tool | Strength | Weakness |
|---|---|---|
| Webpack | Maximum control, huge ecosystem, Module Federation | Lots of config, slower dev start |
| [Vite](../vite/vite-overview.md) | Instant dev server, simple config | Less fine-grained control |
| [Parcel](../parcel.md) | Zero config | Fewer customization options |
| [Rollup](../rollup.md) | Clean library output | Less suited to big apps alone |

Choose webpack when you join an existing webpack project or need very custom build steps. For a fresh project, Vite is usually simpler. See [React + Webpack setup](../../11-real-world-setups/react-webpack-setup.md).

## Key points

- Webpack bundles everything (JS, CSS, images) as modules.
- Core concepts: entry, output, loaders, plugins, mode.
- Loaders transform files; plugins do bigger jobs on the whole build.
- `mode: "production"` turns on minification and tree shaking.
- Powerful but config-heavy; Vite is the common modern alternative.
