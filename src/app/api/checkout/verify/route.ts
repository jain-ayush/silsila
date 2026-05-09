import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { Order, PaymentStatus } from "@/database/entities/Order";
import { Payment } from "@/database/entities/Payment";

export async function POST(req: NextRequest) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = await req.json();

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body.toString())
      .digest("hex");

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (isSignatureValid) {
      const db = await getDb();
      const orderRepo = db.getRepository(Order);
      const paymentRepo = db.getRepository(Payment);

      const order = await orderRepo.findOne({ where: { id: orderId } });

      if (order) {
        order.paymentStatus = PaymentStatus.PAID;
        await orderRepo.save(order);

        const payment = paymentRepo.create({
          orderId: order.id,
          razorpayPaymentId: razorpay_payment_id,
          amount: order.totalAmount,
          status: "SUCCESS",
        });
        await paymentRepo.save(payment);

        return NextResponse.json({ success: true, message: "Payment verified successfully" });
      }
    }

    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
