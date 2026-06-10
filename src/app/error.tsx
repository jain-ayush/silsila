"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-8">
      <div className="h-20 w-20 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Something went wrong</h1>
        <p className="text-muted-foreground max-w-md">
          We encountered an unexpected error while processing your request. Please try again.
        </p>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={() => reset()}
          className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-6"
        >
          Try Again
        </Button>
        <Link href="/">
          <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-6">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
