# Tailwind CSS Build Process

Tailwind CSS scans your source files for class names and generates only the CSS you actually use, at build time.

## What it is

- **Tailwind CSS** is a **utility-first** CSS framework. Instead of writing your own CSS, you put small ready-made classes in HTML, like `p-4`, `text-center`, `bg-blue-500`.
- Tailwind has thousands of possible classes. Shipping all of them would make a huge CSS file.
- So Tailwind runs at **build time**: it looks at your code, finds the classes you wrote, and creates CSS only for those.
- Think of a **restaurant kitchen**: Tailwind reads your order (the classes in your files) and cooks only those dishes, not the whole menu.

## Why we use it

- **Small CSS** - the final file contains only used classes, often just a few KB.
- **No naming headaches** - you do not invent class names like `.card-wrapper-inner`.
- **Fast styling** - you style right inside your markup.
- **Consistent design** - spacing, colours and sizes come from one shared theme.

## How it works

In Tailwind v4 (released January 2025):

1. Your CSS file has one line: `@import "tailwindcss";`
2. When the build runs, Tailwind **scans your source files** (`.html`, `.jsx`, `.tsx`, `.vue`, etc.) as plain text, looking for anything that looks like a class name.
3. Detection is automatic. Tailwind skips files in `.gitignore` (like `node_modules`), binary files and CSS files.
4. For every class it finds, it generates the matching CSS rule.
5. It writes everything into one CSS file. In dev mode, when you save a file and add a new class, the new CSS is added right away through HMR.

Because Tailwind only reads text, class names must appear **complete** in your code:

```jsx
// Bad: Tailwind never sees "bg-red-500" or "bg-green-500"
<div className={`bg-${color}-500`} />

// Good: full class names are written out
<div className={color === "red" ? "bg-red-500" : "bg-green-500"} />
```

## A small example

Setup with [Vite](../03-bundlers/vite/vite-overview.md) (recommended):

```bash
npm install tailwindcss @tailwindcss/vite
```

`vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
});
```

`src/index.css`:

```css
@import "tailwindcss";
```

Use classes in a component:

```jsx
export default function Button() {
  return <button className="rounded-lg bg-blue-500 px-4 py-2 text-white">Save</button>;
}
```

Tailwind generates CSS only for `rounded-lg`, `bg-blue-500`, `px-4`, `py-2` and `text-white`.

## Common commands / config

Setup with the [PostCSS](./postcss.md) plugin (for Webpack, Next.js and others):

```bash
npm install tailwindcss @tailwindcss/postcss
```

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Without any bundler, use the CLI:

```bash
npm install tailwindcss @tailwindcss/cli
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch
```

v4 configuration lives **in CSS**, not in `tailwind.config.js`:

```css
@import "tailwindcss";

/* add your own design values */
@theme {
  --color-brand: #7c3aed;
  --font-display: "Inter", sans-serif;
}

/* scan a folder Tailwind would skip, e.g. a UI library in node_modules */
@source "../node_modules/my-ui-lib";
```

Now `bg-brand` and `font-display` work as classes.

| Setup | Package | Use with |
| --- | --- | --- |
| Vite plugin | `@tailwindcss/vite` | Vite, React, Vue, Svelte apps |
| PostCSS plugin | `@tailwindcss/postcss` | Webpack, Next.js, other tools |
| CLI | `@tailwindcss/cli` | Plain HTML, no bundler |

## When to use it

- **v3 vs v4**: v3 used `tailwind.config.js` with a `content` array and `@tailwind base; @tailwind components; @tailwind utilities;`. v4 finds files automatically, uses `@import "tailwindcss";`, and is much faster (its engine is partly written in Rust).
- Choose Tailwind if you like styling in markup and want small CSS. Choose [Sass](./sass.md) or plain CSS if your team prefers separate stylesheets.

## Key points

- Tailwind generates CSS at build time, only for classes it finds.
- It scans source files as plain text, so write full class names.
- v4 setup: `@import "tailwindcss";` plus the Vite plugin, PostCSS plugin, or CLI.
- Customise with `@theme` in CSS; add extra scan paths with `@source`.
- New classes appear instantly in dev through HMR.
