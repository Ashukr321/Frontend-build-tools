"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { Boxes, Moon, PanelLeft, Search, Sun, X } from "lucide-react";
import SidebarNav, { type NavCategory } from "./sidebar-nav";
import SearchPalette from "./search-palette";
import { SITE_NAME } from "@/lib/site";

const noop = () => () => {};
const useModKey = () =>
  useSyncExternalStore(
    noop,
    () => (/Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  );

function Brand({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className="flex items-center gap-2 text-sm font-semibold">
      <Boxes className="size-5 text-accent" aria-hidden />
      {SITE_NAME}
    </Link>
  );
}

function toggleTheme() {
  const dark = document.documentElement.classList.toggle("dark");
  try {
    localStorage.setItem("theme", dark ? "dark" : "light");
  } catch {}
}

const iconButton =
  "inline-flex size-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-100";

export default function DocsShell({ nav, children }: { nav: NavCategory[]; children: React.ReactNode }) {
  const [desktopOpen, setDesktopOpen] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const mod = useModKey();
  const closeDrawer = () => setDrawerOpen(false);

  const toggleSidebar = useCallback(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) setDesktopOpen((o) => !o);
    else setDrawerOpen((o) => !o);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.code === "KeyK") {
        e.preventDefault();
        setSearchOpen((o) => !o);
      } else if (mod && e.code === "KeyB") {
        e.preventDefault();
        toggleSidebar();
      } else if (e.key === "Escape") {
        setDrawerOpen(false);
      } else if (e.code === "Slash" && !mod && !e.altKey) {
        const t = e.target as HTMLElement | null;
        if (t?.closest("input, textarea, select, [contenteditable='true']")) return;
        e.preventDefault();
        if (e.shiftKey) toggleSidebar();
        else setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSidebar]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar: width animates; the fixed-width inner wrapper keeps content from reflowing. */}
      <aside
        aria-label="Sidebar"
        className={`sticky top-0 hidden h-screen shrink-0 overflow-hidden border-neutral-200 bg-neutral-50 transition-[width,visibility] duration-300 ease-out lg:block dark:border-neutral-800 dark:bg-neutral-950 ${
          desktopOpen ? "visible w-64 border-r" : "invisible w-0"
        }`}
      >
        <div className="flex h-full w-64 flex-col">
          <div className="flex h-14 shrink-0 items-center border-b border-neutral-200 px-4 dark:border-neutral-800">
            <Brand />
          </div>
          <SidebarNav nav={nav} />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`fixed inset-0 z-40 lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`} inert={!drawerOpen}>
        <div
          onClick={closeDrawer}
          aria-hidden
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${drawerOpen ? "opacity-100" : "opacity-0"}`}
        />
        <aside
          aria-label="Sidebar"
          className={`absolute inset-y-0 left-0 flex w-72 max-w-[85vw] flex-col bg-neutral-50 shadow-xl transition-transform duration-300 ease-out dark:bg-neutral-950 ${
            drawerOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
            <Brand onNavigate={closeDrawer} />
            <button type="button" onClick={closeDrawer} className={iconButton} aria-label="Close sidebar">
              <X className="size-4" />
            </button>
          </div>
          <SidebarNav nav={nav} onNavigate={closeDrawer} />
        </aside>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-neutral-200 bg-white/80 px-3 backdrop-blur sm:px-4 dark:border-neutral-800 dark:bg-neutral-950/80">
          <button
            type="button"
            onClick={toggleSidebar}
            className={iconButton}
            aria-label="Toggle sidebar"
            title={`Toggle sidebar (${mod} B)`}
          >
            <PanelLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 w-full max-w-xs items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 text-sm text-neutral-500 transition-colors hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
          >
            <Search className="size-4 shrink-0" aria-hidden />
            <span className="flex-1 truncate text-left">Search topics...</span>
            <kbd className="hidden rounded border border-neutral-300 px-1.5 font-mono text-[11px] sm:inline dark:border-neutral-700">
              {mod} K
            </kbd>
          </button>
          <button type="button" onClick={toggleTheme} className={`${iconButton} ml-auto`} aria-label="Toggle theme">
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
          </button>
        </header>
        <main className="flex-1">{children}</main>
      </div>

      <SearchPalette nav={nav} open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
