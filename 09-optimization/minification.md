# Minification

Minification shrinks your code by removing spaces, comments and long names, so files download faster without changing how the code works.

## What it is

**Minification** makes code files as small as possible. It removes everything the computer does not need:

- spaces, tabs and new lines
- comments
- long variable names (it renames them to short names like `a`, `b`)

The code still does exactly the same thing. It just becomes very hard for a human to read.

Analogy: it is like packing a suitcase by rolling your clothes tightly. Same clothes, less space.

## Why we use it

- **Smaller files** = faster downloads, especially on mobile.
- Less code for the browser to parse.
- Files often get 30-60% smaller, and even smaller after **gzip** or **Brotli** (compression the web server adds on top).

## How it works

1. The build tool reads your code and turns it into a tree that describes the code. This is called an **AST** (Abstract Syntax Tree).
2. It removes whitespace and comments.
3. It renames local variables to short names. This is called **mangling**.
4. It simplifies code where it is safe, for example `if (true) { x() }` becomes `x()`. This is called **compression**.
5. It writes the result out, usually as one long line.

## A small example

Before minification:

```js
// Calculate the total price with tax
function calculateTotal(price, taxRate) {
  const taxAmount = price * taxRate;
  return price + taxAmount;
}

console.log(calculateTotal(100, 0.18));
```

After minification (roughly):

```js
function calculateTotal(t,a){return t+t*a}console.log(calculateTotal(100,.18));
```

Notice: the comment is gone, `price` became `t`, the extra variable was removed, and `0.18` became `.18`.

The function name `calculateTotal` stayed because it is at the top level, and other code might use it.

## Popular minifiers

| Tool | Used by | Notes |
| --- | --- | --- |
| **esbuild** | Vite (default for JS and CSS) | Written in Go, very fast |
| **Terser** | webpack (default, via `TerserPlugin`) | Written in JavaScript, slower, slightly smaller output |
| **SWC** | Next.js | Written in Rust, very fast |
| **Lightning CSS** / **cssnano** | CSS | Minify CSS files |

## Common commands / config

You usually do not set anything. Minification runs automatically in a **production build**.

```bash
npm run build      # Vite / Next.js / webpack production build -> minified files
```

Vite options:

```js
// vite.config.js
export default {
  build: {
    minify: "esbuild", // default; can be "terser" (needs: npm i -D terser) or false
    sourcemap: true,   // also create .map files for debugging
  },
};
```

webpack: minification is on when `mode` is `"production"`.

```js
// webpack.config.js
module.exports = {
  mode: "production", // turns on TerserPlugin automatically
};
```

## Source maps

Minified code is very hard to debug. A **source map** (`.map` file) is a lookup table that tells the browser DevTools how the minified code maps back to your original code. With source maps, errors show your real file names and line numbers.

## When to use it

- Always for production builds.
- Not during development (`npm run dev`), because you want readable code and fast rebuilds. Dev servers skip it for you.

## Key points

- Minification removes spaces, comments and long names to make files smaller.
- The code behaves exactly the same.
- It runs automatically in `npm run build`.
- Vite uses esbuild, webpack uses Terser, Next.js uses SWC.
- Use source maps to debug minified code.
- Minification is different from compression (gzip/Brotli). Use both.
