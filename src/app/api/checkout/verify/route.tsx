import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getDb } from "@/lib/db";
import { Order, PaymentStatus } from "@/database/entities/Order";
import { Payment } from "@/database/entities/Payment";
import { sendMetaEvent } from "@/lib/meta/conversions-api";
import { Resend } from 'resend';
import { OrderConfirmationEmail } from "@/components/emails/OrderConfirmation";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

      const order = await orderRepo.findOne({ 
        where: { id: orderId },
        relations: ["user", "items", "items.product"] 
      });

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

        // Send Confirmation Email
        if (resend && (order as any).user?.email) {
          try {
            await resend.emails.send({
              from: 'Silsila <orders@silsila.com>',
              to: [(order as any).user.email],
              subject: 'Your Silsila Order has been confirmed',
              react: (
                <OrderConfirmationEmail 
                  orderId={order.id}
                  customerName={(order as any).user.name || 'Customer'}
                  totalAmount={Number(order.totalAmount)}
                  items={(order as any).items.map((i: any) => ({
                    title: i.product?.title || 'Jewellery Piece',
                    quantity: i.quantity,
                    price: Number(i.price)
                  }))}
                />
              ),
            });
          } catch (emailErr) {
            console.error("Non-blocking Email Error:", emailErr);
          }
        }

        // Track Meta Conversions API Event
        try {
          await sendMetaEvent("Purchase", req.url, {
            email: (order as any).user?.email,
            phone: (order as any).user?.phoneNumber,
            clientIpAddress: req.headers.get("x-forwarded-for") || "127.0.0.1",
            clientUserAgent: req.headers.get("user-agent") || "",
          }, {
            value: Number(order.totalAmount),
            currency: "INR",
            content_type: "product",
            content_ids: (order as any).items?.map((i: any) => i.productId) || [],
          });
        } catch (metaErr) {
          console.error("Non-blocking Meta API Error:", metaErr);
        }

        return NextResponse.json({ success: true, message: "Payment verified successfully" });
      }
    }

    return NextResponse.json({ success: false, message: "Invalid signature" }, { status: 400 });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
