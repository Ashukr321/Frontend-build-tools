# esbuild

esbuild is an extremely fast JavaScript and TypeScript bundler written in Go. Vite uses it behind the scenes to speed up development.

## What it is

esbuild is a **bundler** (it joins many files into one) and a **transpiler** (it turns TypeScript and JSX into plain JavaScript). It also minifies code.

Most older tools are written in JavaScript. esbuild is written in **Go**, a compiled language, and it uses all your CPU cores at the same time. That is why it is often 10 to 100 times faster than older tools.

## Why we use it

- **Speed**: builds that took a minute can take under a second.
- **Simple**: one small binary, very few options to learn.
- **Built-in support** for TypeScript, JSX, CSS, JSON and minification. No extra plugins needed for these.
- **Used inside other tools**: Vite uses esbuild to pre-bundle dependencies and transpile TypeScript in dev mode.

## How it works

1. You give esbuild an **entry point**, like `src/app.ts`.
2. It reads the file and follows every `import` to build a dependency graph.
3. It parses and transpiles files **in parallel** on many CPU cores.
4. It joins everything into one output file (or a few, if you enable splitting).
5. Optionally it minifies and writes a source map (a file that maps the minified code back to your original code for debugging).

Note: esbuild **removes** TypeScript types but does **not** type-check. Run `tsc --noEmit` separately to catch type errors. See [TypeScript](../04-transpilers/typescript.md).

## A small example

Install:

```bash
npm install -D esbuild
```

Build from the command line:

```bash
npx esbuild src/app.ts --bundle --minify --sourcemap --outfile=dist/app.js
```

The same thing with the JavaScript API (`build.mjs`):

```js
import * as esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/app.ts"],
  bundle: true,
  minify: true,
  sourcemap: true,
  outfile: "dist/app.js",
  target: ["es2020"], // which JS version the output should use
});
```

Run it with `node build.mjs`.

## Common options

| Option | Meaning |
|---|---|
| `--bundle` | Include imported files in the output (without it, esbuild only transpiles) |
| `--outfile` / `--outdir` | Where to write the result |
| `--minify` | Shrink the code |
| `--sourcemap` | Create a `.map` file for debugging |
| `--platform=node` | Build for Node.js instead of the browser |
| `--format=esm` | Output style: `esm`, `cjs` or `iife` |
| `--target=es2020` | Lowest JS version to output |
| `--splitting` | Code splitting (needs `--format=esm` and `--outdir`) |
| `--watch` | Rebuild when files change |
| `--servedir=.` | Start a simple dev server |

## Limitations

- No type checking for TypeScript.
- Fewer plugins than webpack or Rollup.
- No built-in Hot Module Replacement ([HMR](../08-dev-tools/hot-module-replacement.md)).
- Cannot lower some modern syntax to very old browsers (like ES5).

## When to use it

| Need | Pick |
|---|---|
| Fast build of a library, CLI tool or Node server | esbuild |
| Full web app with HMR and a dev server | [Vite](./vite/vite-overview.md) (uses esbuild inside) |
| Huge custom setup with many loaders | [Webpack](./webpack/webpack-basics.md) |
| Publishing a clean npm library | esbuild or [Rollup](./rollup.md) |

## Key points

- esbuild is a Go-based bundler, transpiler and minifier, and it is very fast.
- It handles TS, JSX and CSS out of the box.
- It does not type-check; use `tsc` for that.
- Vite uses esbuild during development for speed.
- Great for libraries, scripts and Node apps; for full apps, use it through Vite.
