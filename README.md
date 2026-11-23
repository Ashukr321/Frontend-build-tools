# Frontend Build Tools

[![Documentation](https://img.shields.io/badge/Docs-Interactive%20Website-f59e0b?style=flat-square)](./website)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Webpack](https://img.shields.io/badge/Webpack-5-8DD6F9?style=flat-square&logo=webpack)](https://webpack.js.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](./LICENSE)

A comprehensive, zero-fluff guide and deep-dive into the modern **Frontend Build Tools** ecosystem.

Whether you are preparing for senior frontend engineering interviews, debugging production build bottlenecks, or designing a clean toolchain from scratch, this repository breaks down how build tools work under the hood with clear mental models, visual diagrams, step-by-step guides, hands-on sample projects, and an interactive documentation web app.

---

## Table of Contents

- [Why This Repository?](#why-this-repository)
- [Interactive Documentation Website](#interactive-documentation-website)
- [Curriculum & Topics](#curriculum--topics)
  - [1. Basics & Foundations](#1-basics--foundations)
  - [2. Package Managers & Environment](#2-package-managers--environment)
  - [3. Bundlers & Compilers](#3-bundlers--compilers)
  - [4. Transpilers](#4-transpilers)
  - [5. Task Runners & Automation](#5-task-runners--automation)
  - [6. CSS Tooling & Preprocessors](#6-css-tooling--preprocessors)
  - [7. Linters & Code Formatters](#7-linters--code-formatters)
  - [8. Developer Experience & Local Dev Servers](#8-developer-experience--local-dev-servers)
  - [9. Performance Optimization & Bundling Mechanics](#9-performance-optimization--bundling-mechanics)
  - [10. CI/CD & Deployment Workflows](#10-cicd--deployment-workflows)
  - [11. Real-World Setups & Production Guides](#11-real-world-setups--production-guides)
- [Hands-on Sample Projects](#hands-on-sample-projects)
- [Contributing & Feedback](#contributing--feedback)
- [License](#license)

---

## Why This Repository?

Modern frontend development relies on sophisticated tooling: package managers resolve thousands of nested packages, bundlers construct complex dependency graphs, transpilers rewrite modern syntax for target runtimes, and tree-shakers eliminate unused dead code.

However, many developers treat these tools as opaque black boxes. When build performance slows down, circular dependencies arise, or production bundles blow up in size, surface-level fixes fall short.

This repository demystifies each stage of the build lifecycle:
- **How it works internally**: Step-by-step explanations of AST parsing, graph resolution, content hashing, memory serving, and symlink algorithms.
- **Trade-offs & Comparisons**: Detailed comparison tables (e.g., Vite vs Webpack vs Parcel, npm vs pnpm vs yarn, Babel vs SWC vs esbuild).
- **Practical Examples**: Real configuration snippets, common pitfalls, and sample project repositories.

---

## Interactive Documentation Website

This repository includes a full-featured documentation website located in the [`website/`](./website) directory, built with **Next.js 16**, **Tailwind CSS v4**, **React 19**, and **CmdK**. It prerenders every markdown note in this repository at build time with an instant search palette and responsive reading layout.

```bash
# Navigate to the website workspace
cd website

# Install dependencies
npm install

# Start the interactive documentation server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to browse all notes with keyboard navigation (`Cmd/Ctrl + K` to search), light/dark mode support, and offline PWA capabilities.

---

## Curriculum & Topics

### 1. Basics & Foundations
| Topic | Description | Link |
|---|---|---|
| **What is a Build Tool?** | Source code transformations, raw-to-runnable pipeline, memory vs disk builds | [what-is-build-tool.md](01-basics/what-is-build-tool.md) |
| **Build Process Flow** | Entry points, dependency graphs, transpiling, chunking, hashing, and output generation | [build-process-flow.md](01-basics/build-process-flow.md) |

### 2. Package Managers & Environment
| Topic | Description | Link |
|---|---|---|
| **npm** | Semantic versioning (`^` vs `~`), flat `node_modules`, `package-lock.json`, and `npm ci` | [npm.md](02-package-managers/npm.md) |
| **pnpm** | Content-addressable global store, hard links, symlinks, workspace monorepos, phantom dependencies | [pnpm.md](02-package-managers/pnpm.md) |
| **yarn** | Yarn Classic vs Yarn Berry, Plug'n'Play (PnP), zero-installs, and resolution rules | [yarn.md](02-package-managers/yarn.md) |
| **env-cmd** | Cross-platform environment variable management, multi-environment configs (`.env.staging`) | [env-cmd.md](env-cmd.md) |

### 3. Bundlers & Compilers
| Topic | Description | Link |
|---|---|---|
| **Vite** | Native ESM in dev, esbuild pre-bundling, Rollup/Rolldown production builds, HMR engine | [vite-overview.md](03-bundlers/vite/vite-overview.md) |
| **Webpack Basics** | Core architecture: entry, output, loaders, plugins, runtime manifests | [webpack-basics.md](03-bundlers/webpack/webpack-basics.md) |
| **Webpack Config Explained** | Detailed deep-dive into `webpack.config.js` options, rules, splitChunks, and optimization | [webpack-config-explained.md](03-bundlers/webpack/webpack-config-explained.md) |
| **esbuild** | Ultra-fast Go-based compiler & bundler, AST concurrency, CLI vs JS API | [esbuild.md](03-bundlers/esbuild.md) |
| **Rollup** | Scope hoisting, ES module-first design, the gold standard for library publishing | [rollup.md](03-bundlers/rollup.md) |
| **Parcel** | Zero-configuration bundling, automatic asset detection, worker-thread architecture | [parcel.md](03-bundlers/parcel.md) |

### 4. Transpilers
| Topic | Description | Link |
|---|---|---|
| **Babel** | Abstract Syntax Trees (AST), parser (`@babel/parser`), transform plugins, presets (`@babel/preset-env`), polyfills | [babel.md](04-transpilers/babel.md) |
| **TypeScript** | `tsc` compilation flags, `tsconfig.json`, isolated modules, type checking vs transpile-only (`ts-loader`, SWC) | [typescript.md](04-transpilers/typescript.md) |

### 5. Task Runners & Automation
| Topic | Description | Link |
|---|---|---|
| **npm Scripts** | Lifecycle hooks (`pre`/`post`), cross-platform scripts, running in parallel vs sequential | [npm-scripts.md](05-task-runners/npm-scripts.md) |
| **Gulp** | Node streams, piping files (`gulp.src().pipe()`), vinyl-fs, orchestrating legacy build pipelines | [gulp.md](05-task-runners/gulp.md) |

### 6. CSS Tooling & Preprocessors
| Topic | Description | Link |
|---|---|---|
| **PostCSS** | CSS AST parsing, Autoprefixer, CSS Modules, nesting plugins | [postcss.md](06-css-tools/postcss.md) |
| **Sass** | Mixins, variables, partials, nested rules, Sass compilation pipelines (`sass-loader`) | [sass.md](06-css-tools/sass.md) |
| **Tailwind Build** | Just-In-Time (JIT) compiler, content scanning, PurgeCSS, Tailwind CSS v4 pipeline | [tailwind-build.md](06-css-tools/tailwind-build.md) |

### 7. Linters & Code Formatters
| Topic | Description | Link |
|---|---|---|
| **ESLint** | Flat config format (`eslint.config.js`), rule severities, parser options, linting in CI | [eslint.md](07-linters-formatters/eslint.md) |
| **Prettier** | Opinionated code formatting, AST-based printing, preventing ESLint/Prettier rule conflicts | [prettier.md](07-linters-formatters/prettier.md) |

### 8. Developer Experience & Local Dev Servers
| Topic | Description | Link |
|---|---|---|
| **Dev Server** | Express/Connect middleware, reverse proxies, serving from memory, handling SPA client-side routing | [dev-server.md](08-dev-tools/dev-server.md) |
| **Hot Module Replacement (HMR)** | WebSockets client/server protocol, delta calculation, React Fast Refresh, state retention | [hot-module-replacement.md](08-dev-tools/hot-module-replacement.md) |

### 9. Performance Optimization & Bundling Mechanics
| Topic | Description | Link |
|---|---|---|
| **Code Splitting** | Dynamic `import()`, route-based splitting, vendor chunk segregation, `SplitChunksPlugin` | [code-splitting.md](09-optimization/code-splitting.md) |
| **Lazy Loading** | On-demand component loading, `React.lazy` + `Suspense`, prefetching (`<link rel="prefetch">`) | [lazy-loading.md](09-optimization/lazy-loading.md) |
| **Minification** | Whitespace removal, mangling, dead code branches, Terser vs SWC vs esbuild | [minification.md](09-optimization/minification.md) |
| **Tree Shaking** | Dead Code Elimination (DCE), ES module static analysis, `sideEffects` flag in `package.json` | [tree-shaking.md](09-optimization/tree-shaking.md) |

### 10. CI/CD & Deployment Workflows
| Topic | Description | Link |
|---|---|---|
| **Build in CI** | Ephemeral environments, build matrix, caching `node_modules` and bundler caches, artifact upload | [build-in-ci.md](10-ci-cd/build-in-ci.md) |
| **GitHub Actions** | Production workflows, step orchestration, secrets management, automated deployments | [github-actions.md](10-ci-cd/github-actions.md) |

### 11. Real-World Setups & Production Guides
| Topic | Description | Link |
|---|---|---|
| **React + Vite Setup** | Step-by-step modern React setup, `.env` conventions, `vite.config.ts`, production verification | [react-vite-setup.md](11-real-world-setups/react-vite-setup.md) |
| **React + Webpack Setup** | Production-grade Webpack setup with Babel, CSS loaders, asset modules, HTML generation | [react-webpack-setup.md](11-real-world-setups/react-webpack-setup.md) |
| **Next.js Build** | Turbopack vs Webpack, Next.js compiler (SWC), static generation (SSG) vs dynamic rendering (SSR) | [nextjs-build.md](11-real-world-setups/nextjs-build.md) |

---

## Hands-on Sample Projects

In addition to theory, this repository contains reproducible mini-projects you can run and experiment with:

- **[Vite Sample Project](03-bundlers/vite/sample-project/)**: Minimal pure JavaScript setup demonstrating native ES modules in development.
- **[Webpack Sample Project](03-bundlers/webpack/sample-project/)**: Complete configured Webpack application featuring `webpack.config.js`, loaders, asset modules, and bundle generation.

---

## Contributing & Feedback

Contributions, corrections, and new topic suggestions are always welcome!
1. Fork the repository
2. Create a feature branch (`git checkout -b topic/my-new-guide`)
3. Commit your changes (`git commit -m 'feat: add guide on Rolldown'`)
4. Push to your branch (`git push origin topic/my-new-guide`)
5. Open a Pull Request

---

## License

This project is open-source and available under the [MIT License](LICENSE).