# Hot Module Replacement (HMR)

HMR swaps only the code you changed into the running app, without a full page reload, so you keep your state while you edit.

## What it is

- A **module** is one file of code, like `Button.jsx` or `style.css`.
- **Hot Module Replacement** means replacing that one module in the running browser page, "hot" (while it is still running).
- Without HMR, saving a file reloads the whole page and you lose everything: form input, open modals, the counter value, your scroll position.
- Think of changing a **flat tyre without stopping the car**: the car keeps driving, only the broken part is replaced.

HMR is a feature of the [dev server](./dev-server.md). It only exists in development, never in the production build.

## Why we use it

- **Keep app state** - a filled form or open popup stays as it is after you save.
- **Faster feedback** - updating one module takes milliseconds; a full reload can take seconds in a big app.
- **CSS changes appear instantly** - styles update with no flicker.
- **Better focus** - you stay on the screen you are working on.

## How it works

1. **File change** - you save `Button.jsx`. The dev server's file watcher notices.
2. **Rebuild the module** - the build tool transforms only that file (not the whole app).
3. **Find the boundary** - it walks up the import chain to find a module that knows how to accept the update. This is called the **HMR boundary**. React components are boundaries when React Fast Refresh is on.
4. **Send a message** - the server tells the browser over a **WebSocket** (an always-open two-way connection): "Button.jsx changed".
5. **Fetch and swap** - the browser downloads the new module and replaces the old one in memory.
6. **Re-render** - only the affected part of the page updates. State is kept.
7. **Fallback** - if no boundary is found, the tool does a **full page reload** instead.

(This matches the steps in [what is a build tool](../01-basics/what-is-build-tool.md): detect the change, work out the delta, replace the code in memory, update the browser without a reload.)

**React Fast Refresh** is React's own HMR layer. It is turned on by `@vitejs/plugin-react` in Vite and by Next.js. It keeps `useState` values while re-running your edited component.

## A small example

```jsx
// Counter.jsx
import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;
}
```

1. Run `npm run dev` and click the button 5 times.
2. Change the text to `Pressed {count} times` and save.
3. The button text changes instantly, and the count is **still 5**.

Without HMR, the page would reload and the count would go back to 0.

Note: Fast Refresh works best when a file exports **only React components**. If it also exports other things (like a constant), Vite may fall back to a full reload.

## Common commands / config

In Vite, HMR is on by default. Framework plugins (React, Vue, Svelte) set it up for you. For plain JavaScript, you can accept updates yourself with the `import.meta.hot` API:

```js
// counter.js
export let count = 0;

if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    console.log("counter.js updated", newModule);
  });
}
```

Turn off the red error overlay, or HMR completely, in `vite.config.js`:

```js
export default {
  server: {
    hmr: { overlay: false }, // or hmr: false to disable HMR
  },
};
```

In [Webpack](../03-bundlers/webpack/webpack-basics.md), `webpack-dev-server` enables HMR with `devServer: { hot: true }` (on by default in v5), and the API is `module.hot.accept()`.

## When to use it

| Update type | What happens | State kept? |
| --- | --- | --- |
| HMR | Only the changed module is swapped | Yes |
| Live reload | Whole page reloads on save | No |
| Manual refresh | You press F5 | No |

HMR is always on in modern dev servers, so you rarely choose it yourself. If HMR seems broken, check: is the file exporting only components? Is there an error in the overlay? Did a config file change (that always restarts the server)?

## Key points

- HMR replaces only the changed module in the running page.
- App state (like `useState` values) survives the update.
- A WebSocket from the dev server tells the browser what changed.
- If no HMR boundary accepts the change, it falls back to a full reload.
- HMR is for development only; React Fast Refresh is React's version of it.
