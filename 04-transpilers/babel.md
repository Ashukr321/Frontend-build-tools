# Babel

Babel is a JavaScript transpiler. It turns modern JavaScript, JSX and TypeScript into plain JavaScript that more browsers can run.

## What it is

- Babel is a **transpiler**. A transpiler is a tool that reads code in one form and writes the same logic in another form.
- Babel reads new JavaScript (like `?.`, `??`, arrow functions, JSX) and rewrites it as older, simpler JavaScript.
- Think of Babel as a **translator**: you speak "new JavaScript", an old browser only understands "old JavaScript", and Babel translates between them.

Babel does **not** bundle files together. That is the job of a bundler like [Webpack](../03-bundlers/webpack/webpack-basics.md) or [Vite](../03-bundlers/vite/vite-overview.md). Babel only changes the code inside each file.

## Why we use it

1. **Old browser support** - write modern code, still run it on older browsers.
2. **JSX** - browsers do not understand `<App />` inside JavaScript. Babel turns it into normal function calls.
3. **TypeScript** - Babel can remove TypeScript types (it does not check them).
4. **Try new features early** - plugins let you use syntax before every browser supports it.

## How it works

Babel works in three steps:

1. **Parse** - it reads your code and builds an **AST** (Abstract Syntax Tree). An AST is a tree of objects that describes every piece of your code.
2. **Transform** - **plugins** walk through the tree and change it. For example, one plugin swaps arrow functions for normal functions.
3. **Generate** - it turns the changed tree back into code (plus an optional **source map**, a file that links the new code back to your original lines for debugging).

A **preset** is just a ready-made group of plugins, so you do not have to pick dozens of plugins by hand.

## A small example

Input (modern code):

```js
const getName = (user) => user?.name ?? "Guest";
```

Output (for older browsers, simplified):

```js
var getName = function (user) {
  var name = user === null || user === undefined ? undefined : user.name;
  return name !== null && name !== undefined ? name : "Guest";
};
```

JSX example:

```js
// Input
const el = <h1>Hello</h1>;

// Output (React automatic runtime)
import { jsx as _jsx } from "react/jsx-runtime";
const el = _jsx("h1", { children: "Hello" });
```

## Common commands / config

Install:

```bash
npm install --save-dev @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

Config file `babel.config.json` in the project root:

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

Tell Babel which browsers to support with a `browserslist` field in `package.json`:

```json
{
  "browserslist": "> 0.5%, last 2 versions, not dead"
}
```

Run it from the command line:

```bash
npx babel src --out-dir dist
```

With Webpack, you add `babel-loader` so every `.js` file goes through Babel during the build.

| Preset | What it does |
| --- | --- |
| `@babel/preset-env` | Converts modern JS based on your target browsers |
| `@babel/preset-react` | Converts JSX |
| `@babel/preset-typescript` | Removes TypeScript types |

Note: Babel only changes **syntax**. A missing built-in feature (like `Array.prototype.at` in an old browser) needs a **polyfill**, which is extra code that adds the missing feature. `core-js` is the usual polyfill library.

## When to use it

Many modern tools now use faster transpilers written in Go or Rust, like **esbuild**, **SWC** and **Oxc**. Vite and Next.js do this for you, so you often never touch Babel directly.

| Tool | Speed | Plugins | Common use |
| --- | --- | --- | --- |
| Babel | Slower (written in JS) | Huge ecosystem | Webpack setups, custom transforms |
| [esbuild](../03-bundlers/esbuild.md) | Very fast (Go) | Few | Vite, quick builds |
| SWC | Very fast (Rust) | Some | Next.js, `@vitejs/plugin-react-swc` |

Use Babel when you need a special plugin (for example the React Compiler or a custom code transform) or when an older Webpack project already uses it.

## Key points

- Babel is a translator from modern JS/JSX/TS to older JS.
- Steps: parse to AST, transform with plugins, generate code.
- A preset is a group of plugins; `preset-env` reads your browserslist.
- Babel changes syntax only; polyfills add missing features.
- Babel removes TypeScript types but never checks them.
- Faster tools (esbuild, SWC, Oxc) replace Babel in many modern setups.
