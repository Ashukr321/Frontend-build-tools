import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getContent, getDoc, listAssets, loadContent } from "@/lib/content";
import { matchAllWords } from "@/components/search-palette";

describe("content (real notes)", () => {
  const { docs, categories } = getContent();

  it("has unique, URL-safe slugs and a title on every doc", () => {
    expect(docs.length).toBeGreaterThan(0);
    expect(new Set(docs.map((d) => d.slug)).size).toBe(docs.length);
    for (const d of docs) {
      expect(d.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*(\/[a-z0-9]+(-[a-z0-9]+)*)*$/);
      expect(d.title.trim()).not.toBe("");
      expect(d.title).not.toBe("Concept");
      expect(d.description.length).toBeLessThanOrEqual(160);
    }
  });

  it("maps the root README to an Overview page in the first category", () => {
    expect(categories[0].docs[0]).toMatchObject({ title: "Overview", source: "README.md" });
    expect(categories[0].docs[0].body).not.toMatch(/[├└│]/); // folder tree is hidden
    expect(categories[0].docs[0].body).toContain("](/docs/");
  });

  it("shows the root env-cmd note under Package Managers", () => {
    expect(getDoc("package-managers/env-cmd")?.source).toBe("env-cmd.md");
  });

  it("returns undefined for a missing doc", () => {
    expect(getDoc("basics/does-not-exist")).toBeUndefined();
  });

  it("puts every repo image on at least one page", () => {
    for (const rel of listAssets().filter((a) => !a.endsWith(".html"))) {
      const url = "/content/" + rel.split("/").map(encodeURIComponent).join("/");
      expect(docs.some((d) => d.body.includes(url) || d.images.some((i) => i.src === url)), rel).toBe(true);
    }
  });

  it("never serves files from website/, .git or .claude", () => {
    expect(listAssets().filter((a) => /^(website|\.git|\.claude)\//.test(a))).toEqual([]);
  });
});

describe("content (fixture)", () => {
  let dir: string;
  let prev: string | undefined;
  const write = (rel: string, text = "") => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };

  beforeAll(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), "docs-fixture-"));
    prev = process.env.CONTENT_DIR;
    process.env.CONTENT_DIR = dir;
    write("README.md", "# Repo\n\nRoot.");
    write("01_Web_Security/README.md", "# Security\n\nIntro to xss.\n\n![diagram](./flow%20chart.svg)\n\n[cors](./cors/concept.md) [gone](./missing.md)");
    write("01_Web_Security/flow chart.svg", "<svg/>");
    write("01_Web_Security/validation-vs-sanitization-vs-escaping.md", "Body.");
    write("01_Web_Security/validation.svg", "<svg/>");
    write("01_Web_Security/cors/concept.md", "");
    write("01_Web_Security/cors/demo.html", "<p>hi</p>");
    write("01_Web_Security/cors/orphan.png", "x");
    write("01_Web_Security/diagrams/only.svg", "<svg/>");
    write("website/package.json", "{}");
    write(".claude/secret.png", "x");
  });

  afterAll(() => {
    if (prev === undefined) delete process.env.CONTENT_DIR;
    else process.env.CONTENT_DIR = prev;
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it("builds slugs, titles, groups and links", () => {
    const { docs } = loadContent();
    const bySlug = Object.fromEntries(docs.map((d) => [d.slug, d]));
    expect(Object.keys(bySlug)).toEqual([
      "web-security/overview",
      "web-security",
      "web-security/validation-vs-sanitization-vs-escaping",
      "web-security/cors/concept",
      "web-security/diagrams",
    ]);
    expect(bySlug["web-security/cors/concept"]).toMatchObject({ title: "CORS", group: "CORS", empty: true });
    expect(bySlug["web-security"].body).toContain("](/docs/web-security/cors/concept)");
    expect(bySlug["web-security"].body).toContain("![diagram](/content/01_Web_Security/flow%20chart.svg)");
    expect(bySlug["web-security"].body).toContain(" gone"); // missing note → plain text
    expect(bySlug["web-security"].body).not.toContain("missing.md");
  });

  it("places unlinked images and visualizations", () => {
    const { docs } = loadContent();
    const imgs = (slug: string) => docs.find((d) => d.slug === slug)!.images.map((i) => i.src);
    expect(imgs("web-security/validation-vs-sanitization-vs-escaping")).toEqual(["/content/01_Web_Security/validation.svg"]);
    expect(imgs("web-security/cors/concept")).toEqual(["/content/01_Web_Security/cors/orphan.png"]);
    expect(imgs("web-security/diagrams")).toEqual(["/content/01_Web_Security/diagrams/only.svg"]);
    expect(docs.find((d) => d.slug === "web-security/cors/concept")!.visualizations[0].src).toBe("/content/01_Web_Security/cors/demo.html");
  });

  it("only serves repo assets outside website/ and .claude", () => {
    const assets = listAssets();
    expect(assets).toContain("01_Web_Security/flow chart.svg");
    expect(assets.some((a) => a.startsWith("website/") || a.startsWith(".claude/"))).toBe(false);
  });
});

describe("search filter", () => {
  it("requires every typed word", () => {
    expect(matchAllWords("/docs/bundlers/vite", "vite over", ["Vite Overview"])).toBe(1);
    expect(matchAllWords("/docs/basics/overview", "cors", ["Overview"])).toBe(0);
  });
});
