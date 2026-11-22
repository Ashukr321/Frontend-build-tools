# working of pnpm 

pnpm is a fast package manager that saves disk space by storing each package version only once on your computer and linking to it.

## What it is

pnpm ("performant npm") does the same job as [npm](./npm.md): it installs packages and runs scripts. It reads the same `package.json`. The difference is **how** it stores packages on disk.

## Why we use it

- **Faster installs**, especially when you have many projects.
- **Less disk space**: ten projects using React share one copy instead of ten.
- **Strict**: your code can only import packages you actually listed in `package.json`.
- **Great monorepo support** with workspaces.

## How it works

1. **Global store** - pnpm keeps one shared folder on your computer called the **content-addressable store**. "Content-addressable" means each file is saved by a fingerprint (hash) of its contents. Same content = same file, saved only once.
2. **Hard links** - When you install, pnpm does not copy files into your project. It creates **hard links** from the store into `node_modules/.pnpm/`. A hard link is like a second name for the same file on disk; it uses no extra space.
3. **Symlinks** - At the top of `node_modules`, pnpm creates **symlinks** (shortcuts) only for the packages you listed in `package.json`. Each one points into `node_modules/.pnpm/`.
4. **Lock file** - Exact versions are saved in `pnpm-lock.yaml`.

```text
pnpm store  (one copy of each file on the whole computer)
      |  hard links
      v
my-app/node_modules/.pnpm/react@19.0.0/node_modules/react
      ^  symlink
      |
my-app/node_modules/react
```

### Why "strict" matters

With npm's flat `node_modules`, a package you never installed directly (a dependency of a dependency) can still be imported by mistake. This is called a **phantom dependency**. It breaks later when that hidden package changes or disappears. pnpm only exposes what you listed, so the mistake shows up early.

## A small example

```bash
npm install -g pnpm        # or: corepack enable pnpm
pnpm init
pnpm add react
pnpm add -D vite
pnpm dev                   # same as "pnpm run dev"
```

Workspace (monorepo) setup in `pnpm-workspace.yaml`:

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

## Common commands

| npm | pnpm |
|---|---|
| `npm install` | `pnpm install` |
| `npm install react` | `pnpm add react` |
| `npm install -D vite` | `pnpm add -D vite` |
| `npm uninstall react` | `pnpm remove react` |
| `npm run build` | `pnpm build` |
| `npx create-vite` | `pnpm dlx create-vite` |
| `npm ci` | `pnpm install --frozen-lockfile` |

Extra useful ones:

```bash
pnpm store prune                    # delete unused packages from the store
pnpm --filter web build             # run "build" only in the "web" workspace
pnpm -r build                       # run "build" in every workspace
```

## When to use it

| Situation | Pick |
|---|---|
| Small project, just learning | npm is fine |
| Many projects on one machine | pnpm (saves space) |
| Monorepo with many packages | pnpm (fast, good workspace tools) |
| A tool that breaks with symlinks | npm, or pnpm with `node-linker=hoisted` in `.npmrc` |

## Key points

- pnpm stores every package version once in a global, content-addressable store.
- Projects get hard links (no extra space) plus symlinks for direct dependencies.
- It is strict, which prevents phantom dependencies.
- Lock file: `pnpm-lock.yaml`. Commit it.
- Commands are close to npm: `add`, `remove`, `dlx`, `--filter`.
