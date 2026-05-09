import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { razorpay } from "@/lib/razorpay";
import { getDb } from "@/lib/db";
import { Order, OrderStatus, PaymentStatus } from "@/database/entities/Order";
import { OrderItem } from "@/database/entities/OrderItem";
import { ProductService } from "@/database/services/ProductService";
import { Address } from "@/database/entities/Address";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { items, address } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const db = await getDb();
    const productIds = items.map((item: any) => item.productId);
    const dbProducts = await ProductService.getProductsByIds(productIds);

    let totalAmount = 0;
    const orderItemsData: any[] = [];

    for (const item of items) {
      const product = dbProducts.find((p) => p.id === item.productId);
      if (!product) continue;
      
      const price = Number(product.price);
      totalAmount += price * item.quantity;
      
      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: price,
      });
    }

    // Save/Get Address
    const addressRepo = db.getRepository(Address);
    let shippingAddress: Address | null = null;
    
    if (address.id) {
      shippingAddress = await addressRepo.findOne({ where: { id: address.id, userId: (session.user as any).id } });
    } else {
      const newAddress = addressRepo.create({
        ...address,
        userId: (session.user as any).id,
      });
      shippingAddress = await addressRepo.save(newAddress) as any;
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Create Razorpay Order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // amount in paisa
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save Order in DB
    const orderRepo = db.getRepository(Order);
    const orderItemRepo = db.getRepository(OrderItem);

    const newOrder = orderRepo.create({
      userId: (session.user as any).id,
      totalAmount: totalAmount,
      paymentStatus: PaymentStatus.PENDING,
      orderStatus: OrderStatus.PENDING,
      shippingAddressId: shippingAddress.id,
    });

    const savedOrder = await orderRepo.save(newOrder);

    for (const itemData of orderItemsData) {
      const orderItem = orderItemRepo.create({
        ...itemData,
        orderId: savedOrder.id,
      });
      await orderItemRepo.save(orderItem);
    }

    return NextResponse.json({
      orderId: savedOrder.id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
