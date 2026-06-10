import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getDb } from "@/lib/db";
import { Order } from "@/database/entities/Order";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await req.json();

    const db = await getDb();
    const orderRepo = db.getRepository(Order);

    const order = await orderRepo.findOne({ where: { id: params.id } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.orderStatus = status;
    await orderRepo.save(order);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Order Update Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
