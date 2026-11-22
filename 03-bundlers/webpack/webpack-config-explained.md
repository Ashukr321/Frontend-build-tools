# Webpack Config Explained

A line-by-line walk through the `webpack.config.js` in this folder's `sample-project`, showing how webpack turns `src/index.js` into `dist/bundle.js`.

## What we are looking at

The sample project is tiny on purpose:

```text
sample-project/
  package.json
  webpack.config.js
  src/
    index.js
    generateJoke.js
```

`src/generateJoke.js` exports a function that returns a joke. `src/index.js` imports it and prints it:

```js
// src/index.js
import generateJoke from "./generateJoke";
console.log(generateJoke());
```

Webpack's job: put both files into **one** file, `dist/bundle.js`.

## The full config

```js
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  }
}
```

## Line by line

### 1. `import path from 'path';`

`path` is a built-in Node.js module for working with file and folder paths. It joins paths correctly on every system (Windows uses `\`, Mac and Linux use `/`).

### 2. `import { fileURLToPath } from 'url';`

Another built-in Node module. `fileURLToPath` turns a URL like `file:///E:/project/webpack.config.js` into a normal path like `E:\project\webpack.config.js`.

### 3. `const __filename = fileURLToPath(import.meta.url);`

- `import.meta.url` is the location of **this** file, written as a `file://` URL.
- We convert it to a normal path and store it in `__filename`.

Why? This config uses **ES modules** (`import` / `export`). In old CommonJS files (`require`), Node gives you `__filename` and `__dirname` for free. In ES modules it does not, so we rebuild them by hand.

### 4. `const __dirname = path.dirname(__filename);`

`path.dirname` takes a file path and returns its folder. So `__dirname` becomes the `sample-project` folder. Now all other paths can be built from here, no matter where you run the command from.

### 5. `export default { ... }`

Webpack reads the object exported from this file. Everything inside is the configuration.

### 6. `mode: "development"`

Tells webpack how to build:

| Mode | Result |
|---|---|
| `development` | Readable output, no minification, fast builds. Good for learning |
| `production` | Minified, tree shaken, smaller files. Good for real users |

If you leave `mode` out, webpack uses `production` and prints a warning.

### 7. `entry: path.resolve(__dirname, 'src/index.js')`

The **entry** is the starting file. Webpack begins here and follows every `import`.

`path.resolve` joins the pieces into a full **absolute path** (a path from the root of the drive), for example `E:\...\sample-project\src\index.js`.

From the entry, webpack finds `import generateJoke from "./generateJoke"`, opens `src/generateJoke.js`, and adds it to the dependency graph.

### 8. `output: { ... }`

Where and how to write the result.

- `path: path.resolve(__dirname, "dist")` - the folder to write into. It **must be absolute**, which is why we use `path.resolve`. Webpack creates `dist/` if it does not exist.
- `filename: "bundle.js"` - the name of the output file.

## The package.json side

```json
"scripts": {
  "build": "webpack"
},
"devDependencies": {
  "webpack": "^5.104.1",
  "webpack-cli": "^6.0.1"
}
```

- `webpack` is the bundler itself (version 5).
- `webpack-cli` lets you run `webpack` from the terminal.
- `"build": "webpack"` means `npm run build` runs webpack, which automatically looks for `webpack.config.js` in the same folder.

## Run it

```bash
cd sample-project
npm install
npm run build
node dist/bundle.js   # prints the joke
```

`dist/bundle.js` now contains both modules plus a small webpack "runtime" (helper code that makes `import` work inside one file).

## A small tip about "type"

The sample `package.json` has `"type": "mjs"`. Node only understands `"module"` or `"commonjs"` here. To clearly mark the project as ES modules, use `"type": "module"`. When you do, webpack wants full file names in imports, so change the import to `"./generateJoke.js"`.

## What you could add next

```js
devtool: "source-map",            // map bundle code back to your source for debugging
output: { clean: true },          // empty dist/ before each build
module: { rules: [/* loaders */] },
plugins: [/* plugins */],
```

See [Webpack Basics](./webpack-basics.md) for loaders and plugins.

## Key points

- `__filename` and `__dirname` are rebuilt by hand because this is an ES module config.
- `path.resolve` creates absolute paths; `output.path` must be absolute.
- `entry` is where webpack starts; `output` is where the bundle goes.
- `mode: "development"` keeps output readable; switch to `production` for real builds.
- `npm run build` runs webpack, which reads this config and writes `dist/bundle.js`.
