"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-sm text-red-500">Error</p>
        <h1 className="mt-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm text-neutral-500">Try again, or go back to the home page.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-900"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
