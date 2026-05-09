import { getDb } from "@/lib/db";
import { Order } from "@/database/entities/Order";
import { Button } from "@/components/ui/button";
import { Eye, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  try {
    const db = await getDb();
    orders = await db.getRepository(Order).find({
      relations: ["user"],
      order: { createdAt: "DESC" }
    });
  } catch (error) {
    console.error("AdminOrdersPage Error:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest">Orders</h1>
        <p className="text-sm text-muted-foreground">Monitor and fulfill customer orders</p>
      </div>

      <div className="bg-white border rounded-none overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Order ID</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Customer</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Date</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Amount</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono text-xs truncate max-w-[100px]">{order.id}</td>
                <td className="p-4 font-medium">{order.user?.name || order.user?.phoneNumber || "Guest"}</td>
                <td className="p-4 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="p-4 font-bold">₹{Number(order.totalAmount).toLocaleString()}</td>
                <td className="p-4">
                  <Badge variant={order.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="rounded-none uppercase text-[9px]">
                    {order.paymentStatus}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary">
                      <Truck className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="p-20 text-center text-muted-foreground italic">
            No orders placed yet.
          </div>
        )}
      </div>
    </div>
  );
}
