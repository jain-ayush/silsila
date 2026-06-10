import { NextRequest, NextResponse } from "next/server";
import { OTPService } from "@/lib/auth/otp";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    const result = await OTPService.sendOTP(phoneNumber);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ error: result.message || "Failed to send OTP" }, { status: 500 });
    }
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
