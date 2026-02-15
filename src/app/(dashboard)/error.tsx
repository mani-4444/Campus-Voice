"use client";

import { useEffect } from "react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[DashboardError]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <h2 className="text-2xl font-semibold">Dashboard Error</h2>
      <p className="text-muted-foreground">
        {error.message || "Something went wrong loading this page."}
      </p>
      <button
        onClick={reset}
        className="rounded-md bg-primary px-6 py-2 text-primary-foreground transition hover:opacity-90"
      >
        Try Again
      </button>
    </div>
  );
}
