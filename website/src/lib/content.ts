import fs from "node:fs";
import path from "node:path";
import { SITE_DESCRIPTION } from "./site";

/**
 * Reads the markdown notes from the repo root at build time.
 * Every page is prerendered, so these files are never needed at runtime;
 * the turbopackIgnore comments stop Turbopack from tracing the whole repo.
 */

export type DocImage = { src: string; alt: string };
export type Doc = {
  slug: string;
  url: string;
  title: string;
  description: string;
  body: string;
  empty: boolean;
  category: string;
  categoryTitle: string;
  group?: string;
  /** Images placed on the page outside the markdown body. */
  images: DocImage[];
  visualizations: { src: string; title: string }[];
  /** Repo-relative path of the .md file (null for an image-only folder page). */
  source: string | null;
  /** Repo-relative folder the page belongs to ("" = repo root). */
  dir: string;
  isReadme: boolean;
};
export type Category = { slug: string; title: string; dir: string; docs: Doc[] };
export type Content = { categories: Category[]; docs: Doc[] };

const IMAGE_EXT = /\.(svg|png|jpe?g|webp|gif)$/i;
const ASSET_EXT = /\.(svg|png|jpe?g|webp|gif|html)$/i;
const SKIP_DIRS = new Set(["website", "node_modules", ".git", ".claude"]);
/** Repo-relative image paths that are unrelated to the notes (ask before adding). */
export const IGNORED_IMAGES: string[] = [];
/** Notes at the repo root outside the numbered folders → category slug that shows them. */
const ROOT_NOTES: Record<string, string> = { "env-cmd.md": "package-managers" };
const WORDS: Record<string, string> = {
  api: "API", apis: "APIs", css: "CSS", ci: "CI", cd: "CD", hmr: "HMR", js: "JS", ts: "TS",
  html: "HTML", json: "JSON", jsx: "JSX", esm: "ESM", cjs: "CJS", cli: "CLI", pwa: "PWA",
  seo: "SEO", url: "URL", dom: "DOM", xss: "XSS", csrf: "CSRF", cors: "CORS", npm: "npm",
  pnpm: "pnpm", nextjs: "Next.js", postcss: "PostCSS", typescript: "TypeScript",
  eslint: "ESLint", github: "GitHub", esbuild: "esbuild",
};

export function contentRoot() {
  const dir = process.env.CONTENT_DIR;
  return dir
    ? path.resolve(/*turbopackIgnore: true*/ dir)
    : path.join(/*turbopackIgnore: true*/ process.cwd(), "..");
}

const stripNumber = (name: string) => name.replace(/^\d+[-_]/, "");
const slugify = (name: string) =>
  stripNumber(name)
    .replace(/\.md$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function titleize(name: string) {
  return stripNumber(name)
    .replace(/\.[a-z]+$/i, "")
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((w) => WORDS[w.toLowerCase()] ?? w[0].toUpperCase() + w.slice(1))
    .join(" ")
    .replace("CI CD", "CI/CD");
}

const polishHeading = (h: string) => {
  const [first, ...rest] = h.trim().split(/\s+/);
  const fix = (w: string) => WORDS[w.toLowerCase()] ?? w;
  // Known words keep their own casing ("esbuild", "npm"); anything else starts upper-case.
  return [WORDS[first.toLowerCase()] ?? first[0].toUpperCase() + first.slice(1), ...rest.map(fix)].join(" ");
};

const assetUrl = (rel: string) => "/content/" + rel.split("/").map(encodeURIComponent).join("/");

function readDir(rel: string) {
  return fs
    .readdirSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ contentRoot(), rel), {
      withFileTypes: true,
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

const isContentDir = (e: fs.Dirent) =>
  e.isDirectory() && !e.name.startsWith(".") && !SKIP_DIRS.has(e.name);
const join = (...parts: string[]) => parts.filter(Boolean).join("/");

/** Repo-relative paths of every servable image / visualization. */
export function listAssets(dir = ""): string[] {
  return readDir(dir).flatMap((e) => {
    const rel = join(dir, e.name);
    if (isContentDir(e)) return listAssets(rel);
    return e.isFile() && ASSET_EXT.test(e.name) && !IGNORED_IMAGES.includes(rel) ? [rel] : [];
  });
}

function findH1(md: string) {
  const lines = md.split(/\r?\n/);
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(```|~~~)/.test(lines[i])) inFence = !inFence;
    const m = !inFence && /^#\s+(.+?)\s*#*\s*$/.exec(lines[i]);
    if (m) return { text: m[1], line: i, lines };
  }
  return null;
}

function describe(md: string) {
  const para: string[] = [];
  let inFence = false;
  for (const line of md.split(/\r?\n/)) {
    const t = line.trim();
    if (/^(```|~~~)/.test(t)) {
      if (para.length) break;
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    // Skip headings, lists, quotes, tables, html, images and rules: only prose counts.
    if (!t || /^(#|[-*+]\s|\d+[.)]|>|\||<|!\[|---|\*\*\*)/.test(t)) {
      if (para.length) break;
      continue;
    }
    para.push(t);
  }
  const text = para
    .join(" ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length <= 160 ? text : text.slice(0, 159).replace(/\s+\S*$/, "") + "…";
}

type Draft = Omit<Doc, "title" | "description" | "body" | "empty" | "url"> & { title?: string };

function walk(cat: Category, rel: string, slug: string, group: string | undefined, out: Draft[]) {
  const entries = readDir(rel);
  const mds = entries.filter((e) => e.isFile() && /\.md$/i.test(e.name));
  const readme = mds.find((e) => /^readme\.md$/i.test(e.name));
  const base = { category: cat.slug, categoryTitle: cat.title, group, dir: rel, images: [], visualizations: [] };
  const folderTitle = titleize(path.posix.basename(rel));
  if (readme) {
    out.push({ ...base, slug, source: join(rel, readme.name), isReadme: true, title: folderTitle });
  } else if (!mds.length && entries.some((e) => e.isFile() && IMAGE_EXT.test(e.name) && !IGNORED_IMAGES.includes(join(rel, e.name)))) {
    // Image-only folder: give it a page so its diagrams still show.
    out.push({ ...base, slug, source: null, isReadme: true, title: folderTitle });
  }
  for (const e of mds) {
    if (e === readme) continue;
    const named = /^concept\.md$/i.test(e.name) ? folderTitle : undefined;
    out.push({ ...base, slug: `${slug}/${slugify(e.name)}`, source: join(rel, e.name), isReadme: false, title: named });
  }
  for (const d of entries.filter(isContentDir)) {
    walk(cat, join(rel, d.name), `${slug}/${slugify(d.name)}`, group ?? titleize(d.name), out);
  }
}

export function loadContent(): Content {
  const root = contentRoot();
  const top = readDir("");
  const categories: Category[] = top
    .filter((e) => isContentDir(e) && /^\d+[-_]/.test(e.name))
    .map((e) => ({ slug: slugify(e.name), title: titleize(e.name), dir: e.name, docs: [] }));

  const drafts = new Map<Category, Draft[]>();
  for (const cat of categories) {
    const out: Draft[] = [];
    walk(cat, cat.dir, cat.slug, undefined, out);
    drafts.set(cat, out);
  }

  // Root README → "Overview" in the first category; other root notes → their mapped category.
  const rootBase = { dir: "", images: [], visualizations: [], group: undefined };
  const rootReadme = top.find((e) => e.isFile() && /^readme\.md$/i.test(e.name));
  if (rootReadme && categories[0]) {
    const cat = categories[0];
    drafts.get(cat)!.unshift({ ...rootBase, slug: `${cat.slug}/overview`, source: rootReadme.name, isReadme: true, title: "Overview", category: cat.slug, categoryTitle: cat.title });
  }
  for (const [file, catSlug] of Object.entries(ROOT_NOTES)) {
    const cat = categories.find((c) => c.slug === catSlug);
    if (!cat || !top.some((e) => e.isFile() && e.name === file)) continue;
    const list = drafts.get(cat)!;
    const firstGrouped = list.findIndex((d) => d.group);
    const draft: Draft = { ...rootBase, slug: `${cat.slug}/${slugify(file)}`, source: file, isReadme: false, category: cat.slug, categoryTitle: cat.title };
    list.splice(firstGrouped === -1 ? list.length : firstGrouped, 0, draft);
  }

  const all = categories.flatMap((c) => drafts.get(c)!);
  const byFile = new Map(all.filter((d) => d.source).map((d) => [d.source!, d]));
  const byDir = new Map<string, Draft>();
  for (const d of all) if (d.isReadme && !byDir.has(d.dir)) byDir.set(d.dir, d);
  for (const c of categories) if (!byDir.has(c.dir) && drafts.get(c)!.length) byDir.set(c.dir, drafts.get(c)![0]);
  const urlOf = (d: Draft) => `/docs/${d.slug}`;

  const assets = listAssets();
  const assetSet = new Set(assets);
  const shown = new Map<string, Set<string>>(); // asset → slugs showing it

  const docs: Doc[] = all.map((d) => {
    const raw = d.source
      ? fs.readFileSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ root, d.source), "utf8")
      : "";
    let body = raw.replace(/^﻿/, "");
    let title = d.title;
    const h1 = findH1(body);
    if (h1 && h1.text.length <= 60) {
      title ??= polishHeading(h1.text);
      body = h1.lines.filter((_, i) => i !== h1.line).join("\n");
    }
    title ??= titleize(path.posix.basename(d.source ?? d.dir));
    if (d.dir === "" && d.isReadme) {
      // Overview: the README's folder-tree code blocks duplicate the sidebar, so hide them.
      body = body.replace(/^(```|~~~)[^\n]*\n[\s\S]*?^\1\s*$/gm, (block) => (/[├└│]/.test(block) ? "" : block));
      if (!body.trim()) {
        body = `${SITE_DESCRIPTION}\n\n## Topics\n\n${categories
          .filter((c) => drafts.get(c)!.some((x) => x !== d))
          .map((c) => `- [${c.title}](${urlOf(drafts.get(c)!.find((x) => x !== d)!)})`)
          .join("\n")}`;
      }
    }

    const from = d.source ? path.posix.dirname(d.source) : d.dir;
    const resolve = (href: string) => {
      const target = href.replace(/^<|>$/g, "").split("#")[0];
      if (!target || /^([a-z][a-z0-9+.-]*:|\/)/i.test(target)) return null;
      let decoded = target;
      try {
        decoded = decodeURIComponent(target);
      } catch {}
      const rel = path.posix.normalize(path.posix.join(from, decoded)).replace(/\/$/, "");
      return rel === "." ? "" : rel.startsWith("..") ? null : rel;
    };
    const markShown = (rel: string) => {
      if (!shown.has(rel)) shown.set(rel, new Set());
      shown.get(rel)!.add(d.slug);
    };
    const linkAsset = (src: string) => {
      const rel = resolve(src);
      if (rel === null || !assetSet.has(rel)) return null;
      markShown(rel);
      return assetUrl(rel);
    };

    // shortcut: regexes also touch code blocks; move to a remark plugin if notes ever show image/link syntax inside code.
    body = body
      .replace(/!\[([^\]]*)\]\(\s*(<[^>]*>|[^)\s]+)(\s+"[^"]*")?\s*\)/g, (m, alt, src, t = "") => {
        const url = linkAsset(src);
        return url ? `![${alt}](${url}${t})` : m;
      })
      .replace(/(<img\b[^>]*?\bsrc\s*=\s*)(["'])([^"']+)\2/gi, (m, pre, q, src) => {
        const url = linkAsset(src);
        return url ? `${pre}${q}${url}${q}` : m;
      })
      .replace(/(?<!!)\[([^\]]+)\]\(\s*(<[^>]*>|[^)\s]+)(\s+"[^"]*")?\s*\)/g, (m, text, href) => {
        const rel = resolve(href);
        if (rel === null) return m;
        const hash = href.includes("#") ? "#" + href.split("#")[1].replace(/>$/, "") : "";
        const target = byFile.get(rel) ?? byDir.get(rel);
        if (target) return `[${text}](${urlOf(target)}${hash})`;
        if (assetSet.has(rel)) return `[${text}](${assetUrl(rel)})`;
        return text; // link to a note that doesn't exist: plain text, not a 404
      });

    const empty = body.trim() === "";
    return {
      ...d,
      title,
      url: urlOf(d),
      body,
      empty,
      description: describe(body) || `${title}: ${d.categoryTitle} notes.`,
      images: [],
      visualizations: [],
    };
  });

  const words = (name: string) => name.replace(/\.[a-z]+$/i, "").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const nearest = (dir: string) => {
    for (let d = dir; ; d = d.includes("/") ? path.posix.dirname(d) : "") {
      const here = docs.filter((doc) => doc.dir === d);
      if (here.length) return here.find((doc) => doc.isReadme) ?? here[0];
      if (d === "") return undefined;
    }
  };

  for (const rel of assets) {
    const dir = rel.includes("/") ? path.posix.dirname(rel) : "";
    const name = path.posix.basename(rel);
    const caption = titleize(name);
    if (!IMAGE_EXT.test(name)) {
      nearest(dir)?.visualizations.push({ src: assetUrl(rel), title: caption });
      continue;
    }
    // An image whose file-name words all appear in a note's file name also shows on that note.
    const imgWords = words(name);
    for (const doc of docs) {
      if (doc.dir !== dir || !doc.source || shown.get(rel)?.has(doc.slug)) continue;
      const docWords = new Set(words(path.posix.basename(doc.source)));
      if (imgWords.length && imgWords.every((w) => docWords.has(w))) {
        doc.images.push({ src: assetUrl(rel), alt: caption });
        if (!shown.has(rel)) shown.set(rel, new Set());
        shown.get(rel)!.add(doc.slug);
      }
    }
    if (!shown.has(rel)) {
      const doc = nearest(dir);
      if (doc) {
        doc.images.push({ src: assetUrl(rel), alt: caption });
        shown.set(rel, new Set([doc.slug]));
      }
    }
  }

  for (const c of categories) c.docs = docs.filter((d) => d.category === c.slug);
  return { categories: categories.filter((c) => c.docs.length), docs };
}

let cache: Content | undefined;
export const getContent = () => (cache ??= loadContent());
export const getDoc = (slug: string) => getContent().docs.find((d) => d.slug === slug);
export function getNeighbours(slug: string) {
  const { docs } = getContent();
  const i = docs.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? docs[i - 1] : undefined, next: i >= 0 ? docs[i + 1] : undefined };
}
