"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Smartphone, LogIn, Chrome } from "lucide-react";

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      
      setStep(2);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      phoneNumber,
      otp,
      callbackUrl: "/",
    });
    setLoading(false);
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[70vh] px-4 py-12">
      <Card className="w-full max-w-md rounded-none border-none shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <CardTitle className="text-3xl font-bold tracking-widest uppercase">
            Silsila
          </CardTitle>
          <CardDescription className="uppercase tracking-widest text-xs font-bold">
            {step === 1 ? "Enter your phone number to login" : "Enter the 6-digit code sent to you"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="relative">
                <Smartphone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10 h-12 rounded-none border-slate-200"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs font-bold"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div className="relative">
                <LogIn className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="pl-10 h-12 rounded-none border-slate-200"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 rounded-none uppercase tracking-widest text-xs font-bold"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify & Login"}
              </Button>
              <button 
                type="button" 
                onClick={() => setStep(1)} 
                className="w-full text-xs uppercase tracking-widest font-bold text-muted-foreground hover:text-primary transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground tracking-widest">Or continue with</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full h-12 rounded-none uppercase tracking-widest text-xs font-bold gap-3"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <Chrome className="h-4 w-4" /> Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
