# Next.js Build

`next build` turns a Next.js app into an optimized production version, deciding page by page what can be pre-built and what must run on the server.

## What it is

**Next.js** is a React framework. It adds routing, server rendering and a built-in build tool on top of React.

`next build` is the command that makes the **production build**. You do not configure webpack or Vite yourself; Next.js does it for you.

```bash
npx create-next-app@latest my-app
cd my-app
npm run build   # runs: next build
npm start       # runs: next start (serves the production build)
```

## Why it matters

A Next.js build does much more than bundle JavaScript. It also:

- compiles every route (page) separately
- decides which pages can be turned into plain HTML ahead of time
- splits code per page automatically
- minifies JS and CSS
- optimizes fonts and images

## How it works

1. **Reads config**: loads `next.config.js` (or `.ts` / `.mjs`) and env files like `.env.production`.
2. **Compiles the code**: TypeScript and JSX are turned into plain JavaScript. Next.js 16 uses **Turbopack** for this by default.
3. **Type checks** your TypeScript (if you use it).
4. **Compiles each route**: every folder in `app/` with a `page.js` becomes a route, with its own chunks for server and browser.
5. **Pre-renders static pages**: pages that do not need request data are rendered to HTML now, at build time.
6. **Writes the output** to the `.next/` folder.
7. **Prints a route table** that shows how each page will be served.

## Static vs dynamic rendering

This is the most important idea in a Next.js build.

- **Static** (pre-rendered): the HTML is created once at build time and reused for every visitor. Very fast, can be cached on a CDN (a network of servers close to users).
- **Dynamic**: the HTML is created on the server for every request. Needed when the page depends on the request, for example cookies, headers, or search params.

Next.js decides this automatically. A page becomes dynamic if it uses things like `cookies()`, `headers()`, `searchParams`, or `fetch` with `cache: "no-store"`.

The build prints something like:

```text
Route (app)                Size     First Load JS
┌ ○ /                      5.2 kB        110 kB
├ ○ /about                 1.1 kB        106 kB
├ ● /blog/[slug]           2.3 kB        108 kB
└ ƒ /dashboard             3.4 kB        109 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses generateStaticParams)
ƒ  (Dynamic)  server-rendered on demand
```

### Example: a static and a dynamic page

```jsx
// app/about/page.jsx  -> static (no request data)
export default function About() {
  return <h1>About us</h1>;
}
```

```jsx
// app/dashboard/page.jsx  -> dynamic (reads cookies)
import { cookies } from "next/headers";

export default async function Dashboard() {
  const theme = (await cookies()).get("theme")?.value ?? "light";
  return <h1>Dashboard ({theme} theme)</h1>;
}
```

You can also re-build a static page in the background every N seconds. This is called **ISR** (Incremental Static Regeneration):

```jsx
export const revalidate = 60; // re-generate at most once every 60 seconds
```

## The `.next` output folder

| Path | What it holds |
| --- | --- |
| `.next/static/` | Browser files: JS chunks, CSS, fonts (with hashed names for caching) |
| `.next/server/` | Server code for each route, plus pre-rendered HTML |
| `.next/cache/` | Build cache, makes the next build faster |
| `.next/standalone/` | Only when `output: "standalone"` is set (see below) |

Do not commit `.next/` to git. It is in `.gitignore` by default.

## Turbopack

**Turbopack** is the Rust-based bundler made by the Next.js team, built to replace webpack inside Next.js.

- In **Next.js 16**, Turbopack is the default for both `next dev` and `next build`.
- To use webpack instead (for example, for an old custom webpack plugin): `next build --webpack`.
- In Next.js 15, Turbopack was the default for dev, and you could try it for builds with `next build --turbopack`.

## `output: "standalone"`

By default, running a Next.js app on a server needs the whole `node_modules` folder. That is big.

With `output: "standalone"`, the build copies **only the files needed to run** into `.next/standalone/`, including a small `server.js`. Great for Docker images.

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
};

module.exports = nextConfig;
```

```bash
npm run build
# standalone does not include these two folders, copy them yourself:
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
node .next/standalone/server.js
```

Other option: `output: "export"` creates a fully static site in the `out/` folder (no server at all, so no dynamic pages).

## Common commands

```bash
next dev                # development server with fast refresh
next build              # production build
next start              # serve the production build
next build --webpack    # Next.js 16: build with webpack instead of Turbopack
```

Note: in Next.js 16, `next build` no longer runs the linter. Run ESLint as its own step (for example in CI).

## Key points

- `next build` compiles every route and writes the result to `.next/`.
- Pages are **static** (built once) or **dynamic** (built per request). Next.js picks automatically.
- The route table shows `○` static, `●` SSG, `ƒ` dynamic.
- Turbopack is the default bundler in Next.js 16.
- `output: "standalone"` makes a small, self-contained server for Docker.
- Serve the build with `next start`.
