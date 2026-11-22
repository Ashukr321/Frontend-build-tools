# React + webpack Setup

A step-by-step guide to setting up React with webpack by hand: babel-loader for JSX, CSS loaders, html-webpack-plugin and the dev server.

## What it is

Tools like Vite set everything up for you. Doing it **by hand** with webpack is slower, but it teaches you what a build tool actually does. Many older company projects still use this setup.

The pieces we need:

| Package | Job |
| --- | --- |
| `webpack`, `webpack-cli` | The bundler and its command-line tool |
| `webpack-dev-server` | Dev server with live reload / HMR |
| `babel-loader`, `@babel/core` | Lets webpack run Babel on `.js`/`.jsx` files |
| `@babel/preset-env` | Turns modern JS into JS that older browsers understand |
| `@babel/preset-react` | Turns JSX into plain JavaScript |
| `css-loader`, `style-loader` | Lets you `import "./App.css"` and puts it on the page |
| `html-webpack-plugin` | Creates `index.html` and adds the script tag for you |

A **loader** teaches webpack how to read a file type it does not understand (JSX, CSS). A **plugin** does extra jobs on the whole build (like creating HTML). See [webpack basics](../03-bundlers/webpack/webpack-basics.md) and [Babel](../04-transpilers/babel.md).

## Step 1: Create the project

```bash
mkdir react-webpack-app
cd react-webpack-app
npm init -y
```

## Step 2: Install packages

```bash
npm install react react-dom
npm install -D webpack webpack-cli webpack-dev-server babel-loader @babel/core @babel/preset-env @babel/preset-react css-loader style-loader html-webpack-plugin
```

`-D` means "dev dependency": needed only to build, not inside the app itself.

## Step 3: Create the files

```text
react-webpack-app/
├── public/
│   └── index.html
├── src/
│   ├── App.css
│   ├── App.jsx
│   └── index.jsx
├── babel.config.json
├── package.json
└── webpack.config.js
```

```html
<!-- public/index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>React + webpack</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

```jsx
// src/index.jsx
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
```

```jsx
// src/App.jsx
import "./App.css";

export default function App() {
  return <h1 className="title">Hello from React + webpack</h1>;
}
```

```css
/* src/App.css */
.title {
  color: rebeccapurple;
}
```

## Step 4: Configure Babel

```json
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

`"runtime": "automatic"` means you do not need `import React from "react"` at the top of every JSX file.

## Step 5: Configure webpack

```js
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, argv) => {
  const isProd = argv.mode === "production";

  return {
    entry: "./src/index.jsx",               // where webpack starts
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProd ? "[name].[contenthash].js" : "[name].js",
      clean: true,                          // empty dist/ before each build
    },
    resolve: {
      extensions: [".js", ".jsx"],          // so you can import "./App" without .jsx
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,                  // .js and .jsx files
          exclude: /node_modules/,
          use: "babel-loader",
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"], // runs right to left
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "./public/index.html" }),
    ],
    devtool: isProd ? "source-map" : "eval-source-map",
    devServer: {
      port: 3000,
      hot: true,                            // Hot Module Replacement
      open: true,                           // open the browser
      historyApiFallback: true,             // needed for React Router
    },
  };
};
```

How the CSS loaders work: `css-loader` reads the CSS file and turns it into a JS module. Then `style-loader` injects it into the page in a `<style>` tag. Loaders run **from right to left** (last one first).

For production you can swap `style-loader` for `MiniCssExtractPlugin.loader` (from `mini-css-extract-plugin`) to get a separate `.css` file.

## Step 6: Add scripts

```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

## Step 7: Run it

```bash
npm start        # dev server on http://localhost:3000, served from memory
npm run build    # production files in dist/
```

The production build creates `dist/index.html` and `dist/main.<hash>.js`. In `production` mode, webpack also minifies the code and tree-shakes unused exports for you.

## Common problems

- **"You may need an appropriate loader"**: a file type has no rule. Check `test:` in `module.rules`.
- **JSX syntax error**: Babel is not running on that file. Check the `.jsx` extension and `babel.config.json`.
- **Blank page on refresh with React Router**: add `historyApiFallback: true`.

## Key points

- webpack only understands JS by default; **loaders** teach it JSX and CSS.
- `babel-loader` + `@babel/preset-react` handles JSX.
- `style-loader` + `css-loader` handle `import "./App.css"`.
- `html-webpack-plugin` makes `index.html` with the script tag.
- `webpack serve` runs the dev server; `webpack --mode production` builds `dist/`.
- For new projects, [Vite](./react-vite-setup.md) is simpler; this setup is great for learning.
