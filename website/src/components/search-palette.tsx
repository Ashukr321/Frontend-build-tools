"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";
import type { NavCategory } from "./sidebar-nav";

// Every typed word must appear (cmdk's default fuzzy match is too loose).
export function matchAllWords(value: string, search: string, keywords: string[] = []) {
  const hay = [value, ...keywords].join(" ").toLowerCase();
  return search.toLowerCase().split(/\s+/).filter(Boolean).every((w) => hay.includes(w)) ? 1 : 0;
}

export default function SearchPalette({
  nav,
  open,
  onOpenChange,
}: {
  nav: NavCategory[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  return (
    <Command.Dialog
      open={open}
      onOpenChange={onOpenChange}
      label="Search topics"
      filter={matchAllWords}
      overlayClassName="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
      contentClassName="fixed top-[12vh] left-1/2 z-50 w-[calc(100vw-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
    >
      <Command.Input
        placeholder="Search topics…"
        className="w-full border-b border-neutral-200 bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-neutral-400 dark:border-neutral-800"
      />
      <Command.List className="max-h-[60vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-8 text-center text-sm text-neutral-500">No topics found.</Command.Empty>
        {nav.map((cat) => (
          <Command.Group
            key={cat.slug}
            heading={cat.title}
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-2 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:text-neutral-500"
          >
            {cat.docs.map((d) => (
              <Command.Item
                key={d.url}
                value={d.url}
                keywords={[d.title, d.group ?? "", cat.title]}
                onSelect={() => {
                  onOpenChange(false);
                  router.push(d.url);
                }}
                className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-2 text-sm text-neutral-700 data-[selected=true]:bg-amber-500/10 data-[selected=true]:text-amber-700 dark:text-neutral-300 dark:data-[selected=true]:text-amber-400"
              >
                <FileText className="size-4 shrink-0 opacity-60" aria-hidden />
                <span className="truncate">{d.title}</span>
                {d.group && <span className="ml-auto shrink-0 text-xs text-neutral-400">{d.group}</span>}
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}
