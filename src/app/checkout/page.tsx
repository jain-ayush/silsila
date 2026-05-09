"use client";

import { useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Truck, ArrowLeft, Loader2 } from "lucide-react";
import Script from "next/script";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items, totalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (status === "unauthenticated") {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePlaceOrder = async () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.postalCode) {
      alert("Please fill in all required shipping details.");
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order in Backend
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, address }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || "Failed to create order");

      // 2. Load Razorpay Script
      const isLoaded = await loadRazorpay();
      if (!isLoaded) {
        alert("Razorpay SDK failed to load. Are you online?");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay Widget
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Silsila Jewellery",
        description: "Order #" + orderData.orderId,
        order_id: orderData.razorpayOrderId,
        handler: async (response: any) => {
          // 4. Verify Payment
          const verifyRes = await fetch("/api/checkout/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...response,
              orderId: orderData.orderId,
            }),
          });

          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            clearCart();
            router.push("/checkout/success?orderId=" + orderData.orderId);
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: address.fullName,
          contact: address.phone,
          email: session?.user?.email || "",
        },
        theme: { color: "#000000" },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error("Order error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center space-y-6">
        <h1 className="text-2xl font-bold uppercase tracking-widest">Your bag is empty</h1>
        <p className="text-muted-foreground">Add some exquisite jewellery to your bag before checking out.</p>
        <Link href="/shop">
          <Button className="rounded-none uppercase tracking-widest text-xs font-bold px-8 py-6">
            Explore Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex items-center gap-2 mb-8">
        <Link href="/shop" className="text-xs uppercase tracking-widest font-bold flex items-center gap-1 hover:text-primary transition-colors">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>
      </div>

      <h1 className="text-3xl font-bold uppercase tracking-widest mb-12">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Shipping Form */}
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.2em] font-bold border-b pb-4">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Full Name *</label>
                <Input name="fullName" value={address.fullName} onChange={handleInputChange} placeholder="John Doe" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Phone Number *</label>
                <Input name="phone" value={address.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className="rounded-none h-12" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address Line 1 *</label>
                <Input name="addressLine1" value={address.addressLine1} onChange={handleInputChange} placeholder="House No, Street Name" className="rounded-none h-12" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Address Line 2 (Optional)</label>
                <Input name="addressLine2" value={address.addressLine2} onChange={handleInputChange} placeholder="Apartment, Landmark" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">City *</label>
                <Input name="city" value={address.city} onChange={handleInputChange} placeholder="Mumbai" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">State *</label>
                <Input name="state" value={address.state} onChange={handleInputChange} placeholder="Maharashtra" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Postal Code *</label>
                <Input name="postalCode" value={address.postalCode} onChange={handleInputChange} placeholder="400001" className="rounded-none h-12" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">Country</label>
                <Input value="India" disabled className="rounded-none h-12 bg-slate-50" />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.2em] font-bold border-b pb-4">Payment Method</h3>
            <div className="p-6 border bg-slate-50 flex items-center gap-4">
              <div className="h-4 w-4 rounded-full border-4 border-primary bg-white" />
              <div className="flex-grow">
                <p className="text-sm font-bold uppercase tracking-wider">Secure Online Payment (Razorpay)</p>
                <p className="text-xs text-muted-foreground">Pay via UPI, Cards, Netbanking or Wallets</p>
              </div>
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
          </section>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 p-8 sticky top-24 space-y-8">
            <h3 className="text-sm uppercase tracking-[0.2em] font-bold border-b pb-4">Order Summary</h3>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-4">
                  <div className="h-16 w-14 bg-white border overflow-hidden shrink-0">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-grow">
                    <h4 className="text-xs font-medium line-clamp-1">{item.title}</h4>
                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-xs font-bold mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{totalPrice().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-bold uppercase text-[10px] tracking-widest">Free</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-4">
                <span className="uppercase tracking-widest text-sm">Total</span>
                <span>₹{totalPrice().toLocaleString()}</span>
              </div>
            </div>

            <Button 
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full rounded-none py-8 uppercase tracking-[0.2em] text-xs font-bold shadow-lg"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place Order"}
            </Button>

            <div className="flex flex-col gap-3 pt-4">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                <ShieldCheck className="h-4 w-4 text-primary" /> 100% Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                <Truck className="h-4 w-4 text-primary" /> Insured Fast Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
