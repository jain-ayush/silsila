"use client";

import { useCartStore } from "@/store/useCartStore";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const CartSidebar = () => {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="relative">
        <ShoppingBag className="h-5 w-5" />
      </Button>
    );
  }

  const count = totalItems();

  return (
    <Sheet>
      <SheetTrigger render={
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-white flex items-center justify-center">
              {count}
            </span>
          )}
        </Button>
      } />
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b">
          <SheetTitle className="uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Bag ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <ShoppingBag className="h-12 w-12 text-muted-foreground/30" />
              <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">Your bag is empty</p>
              <Link href="/shop">
                <Button variant="outline" className="rounded-none uppercase tracking-widest text-xs font-bold">
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-slate-100">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium line-clamp-1">{item.title}</h4>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
                          {item.category}
                        </p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex justify-between items-center">
                      <div className="flex items-center border">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-xs font-medium w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="p-1 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="p-6 border-t flex-col space-y-4">
            <div className="flex justify-between items-center w-full">
              <span className="text-sm uppercase tracking-widest font-bold">Subtotal</span>
              <span className="text-lg font-bold">₹{totalPrice().toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-wider">
              Shipping and taxes calculated at checkout
            </p>
            <Link href="/checkout" className="w-full">
              <Button className="w-full rounded-none py-6 uppercase tracking-widest text-xs font-bold">
                Proceed to Checkout
              </Button>
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
