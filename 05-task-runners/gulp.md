# Gulp

Gulp is a task runner. It automates boring jobs like compiling Sass, minifying files and copying images, using small JavaScript functions.

## What it is

- A **task runner** is a tool that runs repeated jobs (tasks) for you, so you do not do them by hand.
- In Gulp, every task is a normal JavaScript function written in a file called `gulpfile.js`.
- Gulp uses **streams**. A stream is data flowing through a pipe. Files go in one end, pass through some tools, and come out the other end changed.
- Think of a **factory conveyor belt**: a file goes on the belt, one machine compiles it, the next minifies it, and the last one puts it in a box (the output folder).

## Why we use it

- Automate repeated work: compile Sass, add vendor prefixes, minify CSS and JS, optimize images.
- **Watch** files and re-run tasks every time you save.
- Run tasks **in order** (series) or **at the same time** (parallel).
- Good for simple websites, HTML email templates, and old projects without a modern bundler.

## How it works

1. `gulp.src()` reads files from disk (for example all `.scss` files).
2. `.pipe()` sends those files through a **plugin** (a small tool, like `gulp-sass`).
3. You can chain more `.pipe()` calls, one per step.
4. `gulp.dest()` writes the final files into an output folder.
5. You export tasks from `gulpfile.js` and run them with the `gulp` command.

Gulp works with files in memory between steps, so it only writes to disk at the end. That makes it fast.

## A small example

Install:

```bash
npm install --save-dev gulp gulp-sass sass gulp-clean-css
```

`gulpfile.js`:

```js
import gulp from "gulp";
import gulpSass from "gulp-sass";
import * as dartSass from "sass";
import cleanCSS from "gulp-clean-css";

const { src, dest, watch, series } = gulp;
const sass = gulpSass(dartSass);

// Task 1: compile Sass and minify it
export function styles() {
  return src("src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(dest("dist/css"));
}

// Task 2: copy images
export function images() {
  return src("src/images/**/*", { encoding: false }).pipe(dest("dist/images"));
}

// Task 3: watch files and re-run styles on save
export function dev() {
  watch("src/scss/**/*.scss", styles);
}

// Default task: runs when you type just "gulp"
export default series(styles, images);
```

(Using `import` needs `"type": "module"` in `package.json`, or name the file `gulpfile.mjs`.)

## Common commands / config

```bash
npx gulp          # run the default task
npx gulp styles   # run one task by name
npx gulp dev      # start watching
npx gulp --tasks  # list all tasks
```

Useful Gulp functions:

| Function | What it does |
| --- | --- |
| `src(glob)` | Read files matching a pattern |
| `pipe(plugin)` | Send files through a plugin |
| `dest(folder)` | Write files to a folder |
| `watch(glob, task)` | Re-run a task when files change |
| `series(a, b)` | Run tasks one after another |
| `parallel(a, b)` | Run tasks at the same time |

## When to use it

Gulp was very popular around 2014-2018. Today, bundlers like [Vite](../03-bundlers/vite/vite-overview.md) and [Webpack](../03-bundlers/webpack/webpack-basics.md) already compile Sass, minify code and run a dev server, so most new apps do not need Gulp.

| Tool | Best for |
| --- | --- |
| Gulp | File-by-file jobs on simple sites, email templates, legacy projects |
| [npm scripts](./npm-scripts.md) | Running a few commands; no extra tool needed |
| Vite / Webpack | Modern JS apps (bundling, dev server, HMR) |

Choose Gulp when you have many file-processing steps that are not about bundling JavaScript. For a React or Vue app, use a bundler instead.

## Key points

- Gulp is a task runner; tasks are plain JS functions in `gulpfile.js`.
- It uses streams: `src()` then `.pipe()` steps then `dest()`.
- `series()` runs in order, `parallel()` runs together, `watch()` re-runs on save.
- Plugins (like `gulp-sass`) do the real work.
- Modern bundlers have replaced Gulp in most new projects.
