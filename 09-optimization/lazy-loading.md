# Lazy Loading

Lazy loading means waiting to load code, images or components until the user actually needs them, which makes the first page load faster.

## What it is

**Lazy loading** is the opposite of loading everything up front (called "eager loading").

With lazy loading, the browser loads a thing only at the moment it is needed:

- a JavaScript module, when the user opens a page or clicks a button
- an image, when the user scrolls near it
- a React component, when it is shown for the first time

Analogy: a restaurant does not cook every dish on the menu when you sit down. It cooks a dish only after you order it.

## Why we use it

- The first screen shows up faster, because there is less to download.
- Users on slow mobile networks save data.
- The browser does less work parsing JavaScript it does not need yet.

## Lazy loading vs code splitting

These two work together, but they are not the same thing:

- **Code splitting** happens at **build time**. The bundler cuts the code into chunks.
- **Lazy loading** happens at **runtime** (while the app runs). The app decides **when** to download a chunk.

You need code splitting first, so there is a separate chunk to lazy load. See [Code Splitting](./code-splitting.md).

## How it works

1. You mark something as "load later" (dynamic `import()`, `React.lazy`, or `loading="lazy"` on an image).
2. The build tool puts that code in its own chunk.
3. The page loads without that chunk.
4. When a trigger happens (route change, click, scroll), the browser downloads the chunk.
5. While it downloads, you show a **fallback** (like a spinner or "Loading...").
6. When it arrives, the real content replaces the fallback.

## A small example

### Lazy loading a React component

```jsx
import { lazy, Suspense, useState } from "react";

// The import runs only the first time <HeavyEditor /> is rendered.
const HeavyEditor = lazy(() => import("./HeavyEditor.jsx"));

export default function App() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(true)}>Open editor</button>

      {open && (
        <Suspense fallback={<p>Loading editor...</p>}>
          <HeavyEditor />
        </Suspense>
      )}
    </div>
  );
}
```

Note: the lazy component file must use `export default`.

### Lazy loading images (no JavaScript needed)

```html
<img src="/photos/beach.jpg" alt="Beach at sunset" loading="lazy" width="800" height="600" />
```

The browser waits until the image is close to the screen before downloading it. Setting `width` and `height` stops the page from jumping when the image appears.

### Lazy loading in Next.js

```jsx
"use client";
import dynamic from "next/dynamic";

// ssr: false = only load this component in the browser
const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});
```

## Tips

- **Preload on hover**: start the download when the user hovers a link, so it is ready by the time they click.

```js
const loadSettings = () => import("./pages/Settings.jsx");
link.addEventListener("mouseenter", loadSettings); // starts the download early
```

- Do not lazy load things that are visible right away (the header, the main hero image). That makes them appear later, not sooner.
- Always show a fallback, so users know something is happening.

## When to use it

- Pages/routes the user may never visit.
- Modals, dialogs and tabs that are hidden at first.
- Heavy libraries: charts, maps, editors, video players.
- Images "below the fold" (lower on the page than the first screen).

## Key points

- Lazy loading = load it only when it is needed.
- Code splitting makes the chunks; lazy loading decides when to fetch them.
- React: `lazy(() => import("./X.jsx"))` + `<Suspense fallback={...}>`.
- Images: `loading="lazy"`.
- Never lazy load what the user sees first.
