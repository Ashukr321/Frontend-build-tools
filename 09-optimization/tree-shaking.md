# Tree Shaking

Tree shaking removes code you imported but never used from the final bundle, so users download only the code your app really runs.

## What it is

**Tree shaking** is "dead code elimination" for modules. **Dead code** is code that is never used.

The name comes from a picture: your app and its imports form a tree. When you shake the tree, the dead leaves (unused code) fall off.

Example: a library exports 100 functions. You use 2. Tree shaking keeps those 2 and drops the other 98.

## Why we use it

- Smaller bundle = faster page load.
- You can use big utility libraries without shipping all of them.
- It happens automatically, with no extra work, if your code is written the right way.

## How it works

1. Tree shaking needs **ES modules** (ESM): `import` and `export`. These are **static**, which means the bundler can see what is used without running the code.
2. The bundler starts from your entry file (for example `main.js`).
3. It follows every `import` and marks the exports that are actually used.
4. Exports that are never used are left out.
5. The minifier then removes any leftover unreachable code.

It does **not** work well with CommonJS (`require` / `module.exports`), because `require` can be dynamic and the bundler cannot be sure what is used.

## A small example

```js
// math.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

```js
// main.js
import { add } from "./math.js";

console.log(add(2, 3));
```

After `npm run build`, the bundle contains `add` but **not** `multiply`, because nothing uses it.

## Import style matters

```js
// Good: named import from an ES module library, only `debounce` is kept
import { debounce } from "lodash-es";

// Bad: CommonJS lodash, the whole library ends up in the bundle
import _ from "lodash";
_.debounce(fn, 300);
```

Tip: prefer libraries that ship ES modules (for example `lodash-es` instead of `lodash`).

## Side effects

A **side effect** is code that does something just by being imported, like changing a global variable or adding CSS to the page.

```js
// polyfill.js - has a side effect: it changes a global
Array.prototype.last = function () {
  return this[this.length - 1];
};
```

The bundler must keep files with side effects, even if you use none of their exports. To help it, library authors add the `sideEffects` field in `package.json`:

```json
{
  "name": "my-library",
  "sideEffects": false
}
```

`false` means "no file in this package has side effects, so it is safe to drop unused files". If some files do (like CSS), list them:

```json
{
  "sideEffects": ["*.css", "./src/polyfill.js"]
}
```

## Common config

- **Vite / Rollup**: tree shaking is always on in `npm run build`.
- **webpack**: on when `mode: "production"` is set.
- **Next.js**: on automatically in `next build`.

```js
// webpack.config.js
module.exports = {
  mode: "production", // turns on usedExports + minification = tree shaking
};
```

## When it does not work

- You use `require()` (CommonJS) instead of `import`.
- Babel converts your ES modules to CommonJS before the bundler sees them. With `babel-loader` this does not happen by default, so leave the `modules` option alone.
- The library has side effects and does not set `sideEffects`.
- You use `import * as lib` and then pass `lib` around as an object.

## Related notes

- [Minification](./minification.md) - the step that cleans up after tree shaking
- [Code Splitting](./code-splitting.md)
- [Rollup](../03-bundlers/rollup.md) - the bundler that made tree shaking popular

## Key points

- Tree shaking removes unused exports from the bundle.
- It needs ES modules (`import` / `export`), not `require`.
- Use named imports: `import { x } from "lib"`.
- `"sideEffects": false` in `package.json` helps bundlers drop more code.
- It runs automatically in production builds.
