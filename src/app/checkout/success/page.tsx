"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-8">
      <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em]">Order Placed Successfully!</h1>
        <p className="text-muted-foreground">Thank you for choosing Silsila. Your order has been confirmed.</p>
        {orderId && (
          <p className="text-sm font-bold uppercase tracking-widest pt-2">
            Order ID: <span className="text-primary">{orderId}</span>
          </p>
        )}
      </div>

      <div className="bg-slate-50 p-6 max-w-md w-full border border-dashed text-sm space-y-4">
        <p>A confirmation email has been sent to your registered email address.</p>
        <p>You can track your order status in your account dashboard.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link href="/shop">
          <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-6">
            Continue Shopping
          </Button>
        </Link>
        <Link href="/dashboard/orders">
          <Button className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-6 gap-2">
            View My Orders <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
