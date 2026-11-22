import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="text-center">
        <p className="font-mono text-sm text-amber-600 dark:text-amber-400">404</p>
        <h1 className="mt-2 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">This topic doesn&apos;t exist, or it has moved.</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
        >
          Back to all topics
        </Link>
      </div>
    </main>
  );
}
