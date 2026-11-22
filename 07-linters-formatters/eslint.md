# ESLint

ESLint reads your JavaScript and TypeScript code and warns you about bugs and bad patterns before you run it.

## What it is

- ESLint is a **linter**. A linter checks your code for problems without running it. This is called **static analysis**.
- It works with **rules**. Each rule checks one thing, like "no unused variables" or "no `==`, use `===`".
- Think of ESLint as a **spell-checker for code**: it underlines mistakes as you type and can fix some of them for you.
- ESLint finds **code-quality** problems. For **formatting** (spaces, quotes, line length) use [Prettier](./prettier.md).

## Why we use it

- **Catch bugs early** - unused variables, typos in names, missing `await`, wrong React hook usage.
- **One code style for the team** - everyone follows the same rules.
- **Auto-fix** - many problems can be fixed with one command.
- **Works everywhere** - in your editor, in a git hook, and in CI.

## How it works

1. You run `npx eslint .` (or your editor runs it on save).
2. ESLint loads `eslint.config.js` from the project root.
3. For each file, a **parser** turns the code into an **AST** (a tree describing the code).
4. Every enabled rule walks the tree and reports problems.
5. ESLint prints each problem with file, line and rule name. With `--fix`, it rewrites the fixable ones.

Each rule has a level: `"off"` (0), `"warn"` (1) or `"error"` (2). Errors make the command fail, which stops a CI build.

## A small example

Code with problems:

```js
const unused = 5;
if (count == 10) {
  console.log("ten");
}
```

ESLint output:

```bash
1:7  error  'unused' is assigned a value but never used  no-unused-vars
2:5  error  'count' is not defined                         no-undef
2:11 error  Expected '===' and instead saw '=='            eqeqeq
```

## Common commands / config

Set up quickly with the official wizard:

```bash
npm init @eslint/config@latest
```

Or install by hand:

```bash
npm install --save-dev eslint @eslint/js globals
```

ESLint v9 and later use a **flat config**: one file called `eslint.config.js` that exports an array of config objects. (The old `.eslintrc.json` format is deprecated and removed in ESLint v10.)

```js
// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),             // never lint these folders
  {
    files: ["**/*.{js,jsx}"],          // which files this block applies to
    extends: [js.configs.recommended], // start from the recommended rules
    languageOptions: {
      globals: globals.browser,        // allow window, document, etc.
    },
    rules: {
      eqeqeq: "error",
      "no-console": "warn",
    },
  },
]);
```

How flat config works: objects later in the array override earlier ones, and `files` decides which files each object affects.

For TypeScript, add `typescript-eslint`:

```bash
npm install --save-dev typescript-eslint
```

```js
import tseslint from "typescript-eslint";
// inside defineConfig([...]):
// { files: ["**/*.{ts,tsx}"], extends: [js.configs.recommended, tseslint.configs.recommended] }
```

Commands (usually saved as [npm scripts](../05-task-runners/npm-scripts.md)):

```bash
npx eslint .          # check everything
npx eslint . --fix    # check and auto-fix
npx eslint src/App.jsx
```

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

Install the **ESLint extension** in VS Code to see problems while you type.

## When to use it

| Tool | Job |
| --- | --- |
| ESLint | Finds bugs and bad patterns (code quality) |
| [Prettier](./prettier.md) | Formats code (style only) |
| `tsc --noEmit` | Checks [TypeScript](../04-transpilers/typescript.md) types |
| Biome / Oxlint | Newer, very fast Rust linters; fewer plugins |

Use ESLint in almost every JS or TS project. Turn off its formatting rules (with `eslint-config-prettier`) when you also use Prettier, so the two tools do not fight.

## Key points

- ESLint is a linter: it finds problems without running code.
- Rules can be `off`, `warn` or `error`.
- Modern setup = flat config in `eslint.config.js`, an array of objects.
- `npx eslint . --fix` fixes many problems automatically.
- Use ESLint for quality, Prettier for formatting.
