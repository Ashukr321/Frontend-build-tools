# working of npm 

npm is the default package manager that comes with Node.js. It downloads libraries into `node_modules` and runs your project scripts.

## What it is

A **package** is a folder of reusable code someone else wrote (like React or lodash). A **package manager** is a tool that downloads packages, keeps track of their versions and updates them for you.

npm (Node Package Manager) has two parts:

- The **CLI** (command line tool) you run in your terminal: `npm install`.
- The **registry** at npmjs.com: a huge online library of packages.

npm is installed automatically when you install Node.js.

## Why we use it

- No need to download libraries by hand and copy them into your project.
- Everyone on the team gets the **same versions**, thanks to the lock file.
- It runs project tasks like `npm run dev` and `npm run build`.

## How it works

1. You run `npm install react`.
2. npm adds `react` to `dependencies` in `package.json`.
3. npm asks the registry which version matches your rule (for example `^19.0.0`).
4. It downloads the package **and all the packages it depends on** (its dependency tree).
5. It puts them in `node_modules/`. npm uses a mostly **flat** layout: it hoists (lifts) shared packages to the top of `node_modules` so they are not duplicated.
6. It writes the exact versions it chose into `package-lock.json`.
7. Next time anyone runs `npm install`, npm reads the lock file and installs exactly the same versions.

## Important files

| File | What it does |
|---|---|
| `package.json` | Your project's "ID card": name, scripts, and the packages you want |
| `package-lock.json` | The exact version of every installed package. Commit it to git |
| `node_modules/` | The downloaded code. Never commit it; it can be rebuilt |

## A small example

```json
{
  "name": "my-app",
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "react": "^19.0.0"
  },
  "devDependencies": {
    "vite": "^7.0.0"
  }
}
```

- `dependencies`: needed when the app runs (React).
- `devDependencies`: needed only while developing or building (Vite).

### Version symbols

- `^19.0.0` - any `19.x.x` (minor and patch updates allowed).
- `~19.0.0` - any `19.0.x` (only patch updates).
- `19.0.0` - exactly this version.

## Common commands

```bash
npm init -y                 # create package.json
npm install                 # install everything from package.json (short: npm i)
npm install react           # add a dependency
npm install -D vite         # add a dev dependency
npm uninstall react         # remove a package
npm update                  # update within allowed version ranges
npm ci                      # clean, exact install from the lock file (great for CI)
npm run build               # run the "build" script
npx create-vite@latest      # run a package without installing it globally
npm outdated                # show packages with newer versions
npm audit                   # check for known security problems
```

`npx` downloads (if needed) and runs a package's command once. Handy for project starters. See also [npm scripts](../05-task-runners/npm-scripts.md).

## When to use it

| Tool | Good for |
|---|---|
| npm | Default choice, works everywhere, nothing extra to install |
| [pnpm](./pnpm.md) | Faster installs, saves disk space, strict about dependencies |
| [Yarn](./yarn.md) | Teams already on Yarn, or wanting Plug'n'Play |

npm is a safe default. Many teams move to pnpm for speed in big projects or monorepos.

## Key points

- npm comes with Node.js and talks to the npmjs.com registry.
- `package.json` says what you want; `package-lock.json` records what you got.
- `node_modules` is rebuilt from those files, so do not commit it.
- Use `npm ci` in CI for clean, repeatable installs.
- Use `npm run <name>` to run scripts and `npx` to run one-off tools.
