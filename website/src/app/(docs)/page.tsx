import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getContent } from "@/lib/content";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export default function Home() {
  const { categories, docs } = getContent();
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      <p className="inline-flex rounded-full border border-neutral-200 px-3 py-1 text-xs font-medium text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        {docs.length} topics · {categories.length} categories
      </p>
      <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{SITE_NAME}</h1>
      <p className="mt-4 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">{SITE_DESCRIPTION}</p>
      {docs[0] && (
        <Link
          href={docs[0].url}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          Start reading <ArrowRight className="size-4" aria-hidden />
        </Link>
      )}

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <section
            key={c.slug}
            className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-900/60"
          >
            <h2 className="text-sm font-semibold">
              <Link href={c.docs[0].url} className="hover:text-amber-600 dark:hover:text-amber-400">
                {c.title}
              </Link>
            </h2>
            <ul className="mt-3 space-y-1.5">
              {c.docs.slice(0, 6).map((d) => (
                <li key={d.url}>
                  <Link
                    href={d.url}
                    className="text-[13px] text-neutral-600 transition-colors hover:text-amber-600 dark:text-neutral-400 dark:hover:text-amber-400"
                  >
                    {d.title}
                  </Link>
                </li>
              ))}
              {c.docs.length > 6 && <li className="text-xs text-neutral-500">+{c.docs.length - 6} more</li>}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
