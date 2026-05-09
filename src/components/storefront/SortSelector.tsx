"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortSelector({ currentSort }: { currentSort: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    params.delete("page"); // Reset to first page on sort change
    router.push(`/shop?${params.toString()}`);
  };

  return (
    <select 
      value={currentSort}
      onChange={handleSortChange}
      className="bg-transparent text-sm border-b border-primary py-1 outline-none cursor-pointer"
    >
      <option value="newest">Newest arrivals</option>
      <option value="price_asc">Price: Low to High</option>
      <option value="price_desc">Price: High to Low</option>
    </select>
  );
}
