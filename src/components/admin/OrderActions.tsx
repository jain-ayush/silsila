"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Truck, CheckCircle, Package } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (status: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating order status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
        <Eye className="h-4 w-4" />
      </Button>
      
      {currentStatus === "PENDING" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-blue-600"
          onClick={() => updateStatus("PROCESSING")}
          disabled={loading}
          title="Mark as Processing"
        >
          <Package className="h-4 w-4" />
        </Button>
      )}

      {currentStatus === "PROCESSING" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-amber-600"
          onClick={() => updateStatus("SHIPPED")}
          disabled={loading}
          title="Mark as Shipped"
        >
          <Truck className="h-4 w-4" />
        </Button>
      )}

      {currentStatus === "SHIPPED" && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-green-600"
          onClick={() => updateStatus("DELIVERED")}
          disabled={loading}
          title="Mark as Delivered"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
