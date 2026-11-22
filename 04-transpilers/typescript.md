# TypeScript as a Build Step

TypeScript adds types to JavaScript. Browsers cannot run it, so a build step removes the types and outputs plain JavaScript.

## What it is

- **TypeScript** (TS) is JavaScript plus **types**. A type says what kind of value something holds, like `string` or `number`.
- Browsers only understand JavaScript, so `.ts` and `.tsx` files must be turned into `.js` first.
- The official TypeScript tool is **`tsc`** (the TypeScript Compiler). It comes with the `typescript` npm package.

## Why we use it

- **Catch mistakes early** - TS warns you before the code runs, for example when you pass a number where a string is expected.
- **Better editor help** - autocomplete and "go to definition" work much better.
- **Safer refactoring** - rename something and TS shows every place that breaks.

The types are only for you and your editor. They are removed before the code runs.

## How it works

TypeScript does two separate jobs. Keep them apart in your head:

1. **Type-checking** - reading all your files together and finding type errors. This is slow because TS must understand the whole project.
2. **Transpiling** - removing the types and writing plain JavaScript. This is fast because each file can be handled alone.

`tsc` can do both. Modern bundlers only do job 2:

1. You run `npm run dev` with [Vite](../03-bundlers/vite/vite-overview.md).
2. Vite passes each `.ts` file to a fast tool (esbuild or Oxc) that just **deletes the types**. It is like erasing pencil notes from a printed page: the printed text (the real code) stays.
3. No type-checking happens here, so code with type errors still runs in the browser.
4. Type errors are shown by your editor, and by running `tsc --noEmit` in a script or in CI.

This split is a big reason why Vite starts so fast: it skips the slow job.

## A small example

TypeScript input:

```ts
type User = { name: string; age: number };

function greet(user: User): string {
  return `Hello ${user.name}`;
}
```

JavaScript output (types removed):

```js
function greet(user) {
  return `Hello ${user.name}`;
}
```

A type error that `tsc` catches, but Vite would still run:

```ts
greet({ name: "Asha" }); // Error: property 'age' is missing
```

## Common commands / config

Install and create a config file:

```bash
npm install --save-dev typescript
npx tsc --init
```

```bash
npx tsc            # type-check and write .js files
npx tsc --noEmit   # only type-check, write nothing
npx tsc --watch    # re-check whenever files change
```

A typical `tsconfig.json` for a Vite + React app:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

| Option | Meaning |
| --- | --- |
| `target` | Which JavaScript version to output |
| `module` / `moduleResolution` | How imports are written and found; `bundler` matches Vite and Webpack |
| `strict` | Turn on all strict type checks (recommended) |
| `noEmit` | Only check types; the bundler writes the JS |
| `isolatedModules` | Warn about code that cannot be transpiled one file at a time |
| `jsx` | How to handle JSX in `.tsx` files |

The Vite React template runs both jobs in its build script:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build"
  }
}
```

`tsc -b` checks the types first. If there is an error, the build stops before `vite build` runs.

## When to use it

| Tool | Checks types? | Removes types? | Speed |
| --- | --- | --- | --- |
| `tsc` | Yes | Yes | Slow |
| esbuild / Oxc / SWC (inside Vite, Next.js) | No | Yes | Very fast |
| [Babel](./babel.md) `preset-typescript` | No | Yes | Medium |
| Node.js 22.18+ (built-in type stripping) | No | Yes | Fast |

- Building an **app**? Let the bundler remove types, and run `tsc --noEmit` to check them.
- Building a **library** for npm? Use `tsc` to output `.js` files plus `.d.ts` files (type definition files that tell other projects your types).

## Key points

- TypeScript = JavaScript + types; browsers cannot run it directly.
- Two jobs: type-checking (slow, whole project) and transpiling (fast, one file at a time).
- Bundlers like Vite only strip types; they never check them.
- Run `tsc --noEmit` (or `tsc -b`) in scripts or CI to catch type errors.
- `tsconfig.json` controls how TypeScript behaves.
