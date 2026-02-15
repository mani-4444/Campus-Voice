"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-6xl font-bold tracking-tighter">404</h1>
      <p className="text-muted-foreground text-lg">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground transition hover:opacity-90"
      >
        Back to Home
      </Link>
    </div>
  );
}
