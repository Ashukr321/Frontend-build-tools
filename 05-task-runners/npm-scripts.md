# npm Scripts

npm scripts are short named commands stored in package.json. You run them with `npm run <name>` to start, build, test or lint your project.

## What it is

- Every JavaScript project has a `package.json` file. It has a `"scripts"` section.
- Each script is a **name** and a **command**. For example, `"build": "vite build"`.
- You run a script with `npm run build`. npm finds the command and runs it in your terminal.
- Think of npm scripts as **speed-dial buttons** on a phone: you save a long number once, then press one button to call it.

See [npm](../02-package-managers/npm.md) for more about the package manager itself.

## Why we use it

- **No extra tool** - npm is already installed with Node.js.
- **Same commands for everyone** - every developer and the CI server run `npm run build` the same way.
- **Short names for long commands** - you do not have to remember long flags.
- **Local tools just work** - npm adds `node_modules/.bin` to the `PATH`, so you can write `vite` instead of `./node_modules/.bin/vite`. (`PATH` is the list of folders your terminal searches for commands.)

## How it works

1. You type `npm run dev`.
2. npm reads `package.json` and finds the `"dev"` script.
3. npm adds `node_modules/.bin` to the `PATH` for this run.
4. If a `predev` script exists, npm runs it first.
5. npm runs the `dev` command in a shell.
6. If a `postdev` script exists, npm runs it after.

## A small example

`package.json` for a Vite + React app:

```json
{
  "name": "my-app",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier --write .",
    "test": "vitest",
    "prebuild": "npm run lint"
  }
}
```

Run them:

```bash
npm run dev       # start the dev server
npm run build     # runs "prebuild" (lint) first, then build
npm test          # "test" and "start" do not need the word "run"
npm start
```

## Common commands / config

Pass extra flags to a script with `--`:

```bash
npm run build -- --mode staging
```

Run commands one after another, or at the same time:

| Pattern | Meaning |
| --- | --- |
| `a && b` | Run `b` only if `a` succeeds |
| `a ; b` | Run `b` after `a` (does not work in Windows cmd) |
| `npm-run-all2 --parallel a b` | Run `a` and `b` at the same time (works everywhere) |
| `concurrently "a" "b"` | Same idea, with coloured output per command |

Set environment variables in a way that works on Windows, macOS and Linux with `cross-env` (or [env-cmd](../env-cmd.md) for `.env` files):

```json
{
  "scripts": {
    "build:prod": "cross-env NODE_ENV=production vite build"
  }
}
```

Other useful commands:

```bash
npm run           # list all scripts
npx vite --help   # run a tool from node_modules/.bin without a script
```

pnpm and Yarn work the same way: `pnpm dev`, `yarn dev`.

## When to use it

| Tool | Good for |
| --- | --- |
| npm scripts | Almost every project: dev, build, test, lint, format |
| [Gulp](./gulp.md) | Many file-processing steps with custom logic |
| A small Node script (`node scripts/x.js`) | Logic too long for one line in JSON |

Start with npm scripts. Only add a task runner when the scripts become too long or complex to read.

## Key points

- Scripts live in the `"scripts"` section of `package.json`.
- Run them with `npm run <name>`; `start` and `test` are shortcuts.
- `node_modules/.bin` is added to `PATH`, so local tools run by name.
- `pre<name>` and `post<name>` scripts run automatically before and after.
- Use `&&` for steps in order; use helper packages for parallel and cross-platform env variables.
