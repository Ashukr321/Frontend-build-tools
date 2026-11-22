import DocsShell from "@/components/docs-shell";
import { getContent } from "@/lib/content";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getContent().categories.map((c) => ({
    slug: c.slug,
    title: c.title,
    docs: c.docs.map((d) => ({ title: d.title, url: d.url, group: d.group })),
  }));
  return <DocsShell nav={nav}>{children}</DocsShell>;
}
