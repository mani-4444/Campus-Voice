"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-foreground">
      <h1 className="text-4xl font-bold tracking-tighter">
        Something went wrong
      </h1>
      <p className="text-muted-foreground">
        {error.message || "An unexpected error occurred."}
      </p>
      <button
        onClick={reset}
        className="mt-4 rounded-md bg-primary px-6 py-2 text-primary-foreground transition hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
