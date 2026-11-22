# working of yarn 

Yarn is a package manager first made by Facebook as a faster npm. It comes in two flavors: Yarn Classic (v1) and Yarn Berry (v2+) with Plug'n'Play.

## What it is

Yarn does the same job as [npm](./npm.md): it installs packages listed in `package.json` and runs scripts. It was created in 2016, when npm was slow and had no lock file.

There are two very different versions:

- **Yarn Classic (v1)** - works much like npm, with a `node_modules` folder. It only gets bug fixes now.
- **Yarn Berry (v2, v3, v4 and later)** - a rewrite. Its main idea is **Plug'n'Play (PnP)**, which can skip `node_modules` entirely.

## Why we use it

- Fast, reliable installs with a lock file (`yarn.lock`).
- Good workspace (monorepo) support.
- With Berry's PnP: no huge `node_modules`, and quick startup.
- Option for **zero-installs**: commit the package cache so teammates do not need to install at all.

## How it works

### Yarn Classic

1. Reads `package.json`.
2. Resolves versions and writes them to `yarn.lock`.
3. Downloads packages to a global cache.
4. Copies them into a flat `node_modules`, like npm.

### Yarn Berry with Plug'n'Play

1. Reads `package.json` and resolves versions into `yarn.lock`.
2. Stores each package as a single **zip file** in a cache.
3. Instead of a `node_modules` folder, it writes one file: **`.pnp.cjs`**. This is a map that says "package X lives in this zip".
4. When Node runs your code, `.pnp.cjs` tells it exactly where each package is. No folder searching.

Analogy: `node_modules` is like looking for a book by walking every shelf. PnP is like a library catalogue that tells you the exact shelf.

If a tool does not support PnP, you can switch back to a normal folder in `.yarnrc.yml`:

```yaml
nodeLinker: node-modules
```

## A small example

```bash
corepack enable           # Corepack ships with Node and manages Yarn versions
yarn init -2              # start a project with modern Yarn
yarn add react
yarn add -D vite
yarn dev                  # runs the "dev" script
```

## Common commands

| npm | Yarn |
|---|---|
| `npm install` | `yarn` or `yarn install` |
| `npm install react` | `yarn add react` |
| `npm install -D vite` | `yarn add -D vite` |
| `npm uninstall react` | `yarn remove react` |
| `npm run build` | `yarn build` |
| `npx create-vite` | `yarn dlx create-vite` (Berry) |
| `npm ci` | `yarn install --immutable` (Berry) |

Check your version with `yarn --version`. `1.x` means Classic; `2.x` or higher means Berry.

## Important files (Berry)

| File | What it does |
|---|---|
| `yarn.lock` | Exact versions. Commit it |
| `.yarnrc.yml` | Yarn settings (for example `nodeLinker`) |
| `.pnp.cjs` | Plug'n'Play map of where packages live |
| `.yarn/cache/` | Zipped packages (commit it only if you want zero-installs) |

## When to use it

| Tool | Strength |
|---|---|
| npm | Default, no setup |
| [pnpm](./pnpm.md) | Fast, saves disk, strict, popular for monorepos |
| Yarn Classic | Old projects already using it |
| Yarn Berry | PnP, zero-installs, teams that want those features |

For a new project, npm or pnpm is the common choice. Use Yarn when your team or project already uses it.

## Key points

- Yarn Classic (v1) is npm-like and in maintenance mode.
- Yarn Berry (v2+) adds Plug'n'Play: packages in zip files plus a `.pnp.cjs` map.
- PnP removes `node_modules`, but some tools need `nodeLinker: node-modules`.
- Use Corepack (built into Node) to install and pin the Yarn version.
- Lock file: `yarn.lock`. Always commit it.
