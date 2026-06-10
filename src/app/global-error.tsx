"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex flex-col items-center justify-center min-h-screen text-center p-4">
        <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest">A Critical Error Occurred</h2>
        <p className="text-muted-foreground mb-8">We apologize for the inconvenience. A critical system error was detected.</p>
        <Button 
          onClick={() => reset()}
          className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-6"
        >
          Restart Application
        </Button>
      </body>
    </html>
  );
}
