# PostCSS

PostCSS is a tool that transforms CSS with JavaScript plugins, for example adding vendor prefixes, minifying, or running Tailwind.

## What it is

- PostCSS reads your CSS, lets **plugins** change it, and writes new CSS.
- On its own, PostCSS does almost nothing. All the real work comes from plugins.
- Think of PostCSS as a **car wash conveyor**: the car (your CSS) rolls through, and each station (plugin) does one job like soap, rinse or wax.
- It is not a new language like Sass. You usually write normal CSS.

## Why we use it

- **Vendor prefixes** - Autoprefixer adds `-webkit-` and similar prefixes only where your target browsers need them.
- **Future CSS today** - `postcss-preset-env` converts new CSS features into CSS older browsers understand. It is like [Babel](../04-transpilers/babel.md), but for CSS.
- **Minify** - `cssnano` removes spaces and comments to make the file smaller.
- **Tailwind CSS** - Tailwind can run as a PostCSS plugin.

## How it works

1. **Parse** - PostCSS reads the CSS text and builds an **AST** (a tree of objects describing every rule and property).
2. **Plugins** - each plugin walks through the tree and changes it, one after another, in the order you list them.
3. **Stringify** - PostCSS turns the tree back into CSS text, plus an optional source map for debugging.

Bundlers like [Vite](../03-bundlers/vite/vite-overview.md) run PostCSS automatically if they find a PostCSS config file. In [Webpack](../03-bundlers/webpack/webpack-basics.md) you add `postcss-loader`.

## A small example

Input CSS:

```css
.box {
  user-select: none;
  display: flex;
}
```

After Autoprefixer (for older Safari):

```css
.box {
  -webkit-user-select: none;
  user-select: none;
  display: flex;
}
```

## Common commands / config

Install:

```bash
npm install --save-dev postcss autoprefixer cssnano
```

`postcss.config.js` in the project root:

```js
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";

export default {
  plugins: [
    autoprefixer(),
    cssnano(), // minify last
  ],
};
```

Choose target browsers in `package.json` (Autoprefixer and Babel both read it):

```json
{
  "browserslist": "> 0.5%, last 2 versions, not dead"
}
```

Run PostCSS by itself (without a bundler):

```bash
npm install --save-dev postcss-cli
npx postcss src/style.css -o dist/style.css
npx postcss src/style.css -o dist/style.css --watch
```

Popular plugins:

| Plugin | Job |
| --- | --- |
| `autoprefixer` | Adds vendor prefixes |
| `postcss-preset-env` | Converts modern CSS for older browsers |
| `cssnano` | Minifies CSS |
| `postcss-import` | Joins `@import` files into one |
| `@tailwindcss/postcss` | Runs Tailwind CSS v4 |

## When to use it

| Tool | What it is | Use when |
| --- | --- | --- |
| PostCSS | CSS in, CSS out, with plugins | You want prefixes, minifying, Tailwind |
| [Sass](./sass.md) | A CSS language with extra features | You want nesting, mixins, loops, partials |
| Lightning CSS | Very fast Rust tool (prefixes + minify) | You want speed; Vite can use it instead of PostCSS |

PostCSS and Sass are often used **together**: Sass compiles `.scss` to CSS first, then PostCSS adds prefixes and minifies. Many Vite projects need no PostCSS config at all, because Vite already minifies CSS for production.

## Key points

- PostCSS = parse CSS, run plugins, write CSS.
- PostCSS alone does nothing; plugins do the work.
- Autoprefixer, cssnano and Tailwind are the most common plugins.
- Plugins run in the order you list them.
- Vite picks up `postcss.config.js` automatically; Webpack uses `postcss-loader`.
