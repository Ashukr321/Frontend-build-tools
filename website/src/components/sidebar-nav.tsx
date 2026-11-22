"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronRight } from "lucide-react";

export type NavDoc = { title: string; url: string; group?: string };
export type NavCategory = { slug: string; title: string; docs: NavDoc[] };

function CategoryItem({ cat, pathname, onNavigate }: { cat: NavCategory; pathname: string; onNavigate?: () => void }) {
  const isActive = cat.docs.some((d) => d.url === pathname);
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? isActive;
  const groups = [...new Set(cat.docs.map((d) => d.group))];

  return (
    <li className="border-b border-neutral-200 dark:border-neutral-800/80">
      <button
        type="button"
        onClick={() => setToggled(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] font-semibold text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-900"
      >
        {cat.title}
        <ChevronRight
          className={`size-4 shrink-0 text-neutral-400 transition-transform duration-300 ${open ? "rotate-90" : ""}`}
          aria-hidden
        />
      </button>
      <div
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
      >
        <div className="overflow-hidden">
          {groups.map((g) => (
            <div key={g ?? ""} className="pb-2">
              {g && (
                <p className="px-6 pt-2 pb-1 text-[13px] font-semibold tracking-wider text-neutral-400 [font-variant-caps:all-small-caps] dark:text-neutral-500">
                  {g}
                </p>
              )}
              <ul>
                {cat.docs
                  .filter((d) => d.group === g)
                  .map((d) => {
                    const active = d.url === pathname;
                    return (
                      <li key={d.url}>
                        <Link
                          href={d.url}
                          onClick={onNavigate}
                          aria-current={active ? "page" : undefined}
                          className={`mx-2 block rounded-md border-l-2 px-4 py-1.5 text-[13px] transition-colors ${
                            active
                              ? "border-accent bg-amber-500/10 font-medium text-amber-700 dark:text-amber-400"
                              : "border-transparent text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100"
                          }`}
                        >
                          {d.title}
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </li>
  );
}

export default function SidebarNav({ nav, onNavigate }: { nav: NavCategory[]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Topics" className="flex-1 overflow-y-auto overscroll-contain">
      <ul>
        {nav.map((cat) => (
          <CategoryItem key={cat.slug} cat={cat} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </ul>
    </nav>
  );
}
