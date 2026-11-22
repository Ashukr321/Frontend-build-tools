# Sass

Sass is a CSS preprocessor. You write .scss files with variables, nesting and mixins, and Sass compiles them into normal CSS.

## What it is

- A **preprocessor** is a tool that turns a "nicer" language into a language the browser understands. Sass turns SCSS into CSS.
- Browsers cannot read `.scss` files. They must be **compiled** (converted) into `.css` first.
- Sass has two syntaxes. **SCSS** (`.scss`) looks like CSS with curly braces and is what almost everyone uses. The older indented syntax (`.sass`) has no braces.
- The official compiler is **Dart Sass**, installed with the `sass` npm package. The old `node-sass` package is dead; do not use it.

## Why we use it

- **Variables** - store a colour once, reuse it everywhere.
- **Nesting** - write child selectors inside parent selectors, like a folder tree.
- **Mixins** - reusable blocks of CSS, like functions.
- **Partials and modules** - split styles into small files and load them with `@use`.
- **Loops and maths** - generate many classes with a few lines.

Modern CSS now has its own variables (`--color`) and nesting, so you need Sass less than before. But mixins, loops and modules are still handy.

## How it works

1. You write `src/styles/main.scss`.
2. The Sass compiler reads it and follows every `@use` to load other files.
3. It replaces variables with values, flattens nesting into normal selectors, and expands mixins.
4. It writes one plain `.css` file (plus an optional source map).
5. The browser loads that CSS file.

In [Vite](../03-bundlers/vite/vite-overview.md), you only install `sass` and import the `.scss` file. Vite compiles it for you. In [Webpack](../03-bundlers/webpack/webpack-basics.md) you add `sass-loader`.

## A small example

`_variables.scss` (a **partial**: the `_` means "do not compile this file alone"):

```scss
$primary: #3b82f6;
$radius: 8px;
```

`main.scss`:

```scss
@use "variables" as v;

@mixin center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  border-radius: v.$radius;
  @include center;

  .title {
    color: v.$primary;
  }

  &:hover {
    opacity: 0.9;
  }
}
```

Compiled CSS:

```css
.card {
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card .title {
  color: #3b82f6;
}
.card:hover {
  opacity: 0.9;
}
```

## Common commands / config

Install:

```bash
npm install --save-dev sass
```

Compile from the command line:

```bash
npx sass src/main.scss dist/main.css            # compile once
npx sass --watch src/main.scss dist/main.css    # recompile on save
npx sass src/main.scss dist/main.css --style=compressed   # minified
```

Use in a Vite + React app:

```js
// main.jsx
import "./styles/main.scss";
```

Important syntax:

| Syntax | Meaning |
| --- | --- |
| `$name: value;` | Variable |
| `&` | The parent selector |
| `@mixin` / `@include` | Define / use a reusable block |
| `@use "file"` | Load another file (modern way) |
| `@import "file"` | Old way; deprecated, will be removed |

## When to use it

| Tool | Use when |
| --- | --- |
| Sass | You want mixins, loops, modules in a big stylesheet |
| Plain modern CSS | Small or medium projects; native nesting and variables are enough |
| [PostCSS](./postcss.md) | You want prefixes or minifying (often used after Sass) |
| [Tailwind CSS](./tailwind-build.md) | You prefer utility classes in HTML instead of writing CSS files |

## Key points

- Sass compiles `.scss` into normal `.css`.
- Use the `sass` package (Dart Sass), not `node-sass`.
- Main features: variables, nesting, mixins, partials, `@use`.
- Prefer `@use` over the deprecated `@import`.
- Vite compiles `.scss` automatically once `sass` is installed.
