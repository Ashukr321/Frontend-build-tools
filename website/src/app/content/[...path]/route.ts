import fs from "node:fs";
import path from "node:path";
import { contentRoot, listAssets } from "@/lib/content";

// Only the files listed here are servable; any other path is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return listAssets().map((rel) => ({ path: rel.split("/") }));
}

const TYPES: Record<string, string> = {
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
};

export async function GET(_req: Request, ctx: RouteContext<"/content/[...path]">) {
  // Prerendered at build time with the exact params from generateStaticParams.
  const rel = (await ctx.params).path.join("/");
  if (!listAssets().includes(rel)) return new Response("Not found", { status: 404 });
  const file = fs.readFileSync(/*turbopackIgnore: true*/ path.join(/*turbopackIgnore: true*/ contentRoot(), rel));
  return new Response(file, {
    headers: { "Content-Type": TYPES[path.extname(rel).toLowerCase()] ?? "application/octet-stream" },
  });
}
