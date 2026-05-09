"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/button"; // Wait, button? No, let's use standard input

export default function PriceFilter({ initialMin, initialMax }: { initialMin: string, initialMax: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [min, setMin] = useState(initialMin);
  const [max, setMax] = useState(initialMax);

  // Sync state if URL changes externally
  useEffect(() => {
    setMin(searchParams.get("minPrice") || "");
    setMax(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min); else params.delete("minPrice");
    if (max) params.set("maxPrice", max); else params.delete("maxPrice");
    params.delete("page");
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <input 
          type="number" 
          placeholder="Min" 
          value={min}
          onChange={(e) => setMin(e.target.value)}
          className="w-full border p-2 text-xs rounded-none focus:outline-primary" 
        />
        <span className="text-muted-foreground">-</span>
        <input 
          type="number" 
          placeholder="Max" 
          value={max}
          onChange={(e) => setMax(e.target.value)}
          className="w-full border p-2 text-xs rounded-none focus:outline-primary" 
        />
      </div>
      <button 
        onClick={handleApply}
        className="w-full py-2 bg-slate-900 text-white text-[10px] uppercase font-bold tracking-widest hover:bg-primary transition-colors"
      >
        Apply Range
      </button>
    </div>
  );
}
