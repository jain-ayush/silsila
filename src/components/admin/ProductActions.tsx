"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProductActionsProps {
  productId: string;
  productSlug: string;
}

export default function ProductActions({ productId, productSlug }: ProductActionsProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete product");
      
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error deleting product");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Link href={`/products/${productSlug}`} target="_blank">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </Link>
      <Link href={`/admin/products/${productId}`}>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
          <Edit className="h-4 w-4" />
        </Button>
      </Link>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-muted-foreground hover:text-destructive"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
      </Button>
    </div>
  );
}
