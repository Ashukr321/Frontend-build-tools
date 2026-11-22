# Prettier

Prettier is a code formatter. It rewrites your code in one consistent style, so the whole team's code looks the same.

## What it is

- Prettier is an **opinionated formatter**. "Opinionated" means it makes most style choices for you and offers only a few options.
- It handles spaces, indentation, quotes, semicolons, line breaks and line length.
- It supports JavaScript, TypeScript, JSX, CSS, SCSS, HTML, JSON, Markdown, YAML and more.
- Think of Prettier as an **auto-tidy button**: you throw clothes in the cupboard, press the button, and everything is folded the same way.

## Why we use it

- **No more style arguments** - tabs vs spaces, single vs double quotes: Prettier decides.
- **Cleaner code reviews** - pull requests show real changes, not spacing changes.
- **Saves time** - format on save, and never align code by hand again.
- **Works with any editor** - VS Code, WebStorm, Vim and others.

## How it works

1. Prettier reads your file and builds an **AST** (a tree that describes the code).
2. It **throws away** your original formatting completely.
3. It prints the code again from the tree, using its own rules.
4. If a line is longer than `printWidth` (80 by default), it breaks the line in a smart way.

Because Prettier prints from the tree, it never changes what your code does. It only changes how it looks.

## A small example

Before:

```js
const user={name:'Asha',age:25,skills:['js','react','node'],active:true}
function greet(u){return 'Hi '+u.name}
```

After `npx prettier --write`:

```js
const user = {
  name: "Asha",
  age: 25,
  skills: ["js", "react", "node"],
  active: true,
};
function greet(u) {
  return "Hi " + u.name;
}
```

## Common commands / config

Install (pin the exact version so everyone formats the same way):

```bash
npm install --save-dev --save-exact prettier
```

Optional config file `.prettierrc`:

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "all",
  "printWidth": 80
}
```

Files to skip go in `.prettierignore` (it also respects `.gitignore`):

```bash
dist
coverage
```

Commands:

```bash
npx prettier --write .   # format all files
npx prettier --check .   # only check; fails if any file is not formatted (good for CI)
npx prettier --write src/App.jsx
```

As [npm scripts](../05-task-runners/npm-scripts.md):

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  }
}
```

In VS Code: install the Prettier extension, set it as the default formatter and turn on **Format On Save**.

Use Prettier together with [ESLint](./eslint.md). Add `eslint-config-prettier` to turn off ESLint rules that only deal with style, so the two tools never disagree:

```bash
npm install --save-dev eslint-config-prettier
```

```js
// eslint.config.js (put it last so it wins)
import eslintConfigPrettier from "eslint-config-prettier/flat";
// ... add eslintConfigPrettier as the last item in the config array
```

## When to use it

| Tool | Job |
| --- | --- |
| Prettier | Formatting (how code looks) |
| [ESLint](./eslint.md) | Code quality (bugs and bad patterns) |
| Biome | Fast all-in-one formatter + linter written in Rust, mostly Prettier-compatible |

Use Prettier in almost every project. Run `prettier --check` in CI and optionally format staged files before each commit with `lint-staged` and a git hook tool like Husky.

## Key points

- Prettier formats code; it does not find bugs.
- It reprints code from an AST, so behaviour never changes.
- `--write` formats files, `--check` only verifies (use in CI).
- Configure lightly with `.prettierrc`; ignore files with `.prettierignore`.
- Pair with ESLint plus `eslint-config-prettier` to avoid conflicts.
