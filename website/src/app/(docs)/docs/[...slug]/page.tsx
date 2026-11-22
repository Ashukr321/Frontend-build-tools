import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Markdown from "@/components/markdown";
import { getContent, getDoc, getNeighbours } from "@/lib/content";
import { SITE_NAME } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getContent().docs.map((d) => ({ slug: d.slug.split("/") }));
}

export async function generateMetadata(props: PageProps<"/docs/[...slug]">): Promise<Metadata> {
  const doc = getDoc((await props.params).slug.join("/"));
  if (!doc) return {};
  const title = `${doc.title} — ${doc.categoryTitle}`;
  return {
    title,
    description: doc.description,
    alternates: { canonical: doc.url },
    openGraph: { type: "article", title, description: doc.description, url: doc.url, siteName: SITE_NAME },
  };
}

export default async function DocPage(props: PageProps<"/docs/[...slug]">) {
  const slug = (await props.params).slug.join("/");
  const doc = getDoc(slug);
  if (!doc) notFound();
  const { prev, next } = getNeighbours(slug);
  const category = getContent().categories.find((c) => c.slug === doc.category)!;

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-900 dark:hover:text-neutral-200">
          {SITE_NAME}
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <Link href={category.docs[0].url} className="hover:text-neutral-900 dark:hover:text-neutral-200">
          {doc.categoryTitle}
        </Link>
        {doc.group && (
          <>
            <ChevronRight className="size-3" aria-hidden />
            <span>{doc.group}</span>
          </>
        )}
        <ChevronRight className="size-3" aria-hidden />
        <span className="text-neutral-700 dark:text-neutral-300" aria-current="page">
          {doc.title}
        </span>
      </nav>

      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>

      <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert prose-a:text-amber-600 prose-a:underline-offset-2 dark:prose-a:text-amber-400 prose-pre:overflow-x-auto prose-img:rounded-lg prose-code:before:content-none prose-code:after:content-none">
        {doc.empty && !doc.images.length && !doc.visualizations.length ? (
          <p className="text-neutral-500 italic">This topic is still being written.</p>
        ) : (
          <Markdown>{doc.body}</Markdown>
        )}

        {doc.images.map((img) => (
          <figure key={img.src}>
            {/* eslint-disable-next-line @next/next/no-img-element -- repo images of unknown size, served statically */}
            <img src={img.src} alt={img.alt} loading="lazy" className="mx-auto bg-white" />
            <figcaption className="text-center">{img.alt}</figcaption>
          </figure>
        ))}
      </div>

      {doc.visualizations.map((v) => (
        <section key={v.src} className="mt-8">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold">{v.title}</h2>
            <a
              href={v.src}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-600 hover:underline dark:text-amber-400"
            >
              <Maximize2 className="size-3" aria-hidden /> Open full screen
            </a>
          </div>
          <iframe
            src={v.src}
            title={v.title}
            sandbox="allow-scripts"
            loading="lazy"
            className="h-[70vh] w-full rounded-lg border border-neutral-200 bg-white dark:border-neutral-800"
          />
        </section>
      ))}

      <nav aria-label="Pagination" className="mt-12 grid gap-3 border-t border-neutral-200 pt-6 sm:grid-cols-2 dark:border-neutral-800">
        {prev ? (
          <Link
            href={prev.url}
            className="group rounded-lg border border-neutral-200 p-4 transition-colors hover:border-amber-500/60 dark:border-neutral-800"
          >
            <span className="flex items-center gap-1 text-xs text-neutral-500">
              <ChevronLeft className="size-3" aria-hidden /> Previous
            </span>
            <span className="mt-1 block text-sm font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={next.url}
            className="group rounded-lg border border-neutral-200 p-4 text-right transition-colors hover:border-amber-500/60 dark:border-neutral-800"
          >
            <span className="flex items-center justify-end gap-1 text-xs text-neutral-500">
              Next <ChevronRight className="size-3" aria-hidden />
            </span>
            <span className="mt-1 block text-sm font-medium group-hover:text-amber-600 dark:group-hover:text-amber-400">
              {next.title}
            </span>
          </Link>
        )}
      </nav>
    </article>
  );
}
