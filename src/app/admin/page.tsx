import { ShoppingBag, Package, Users, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Revenue", value: "₹0", icon: TrendingUp, color: "text-green-600" },
    { title: "Active Orders", value: "0", icon: ShoppingBag, color: "text-blue-600" },
    { title: "Total Products", value: "12", icon: Package, color: "text-purple-600" },
    { title: "Total Customers", value: "1", icon: Users, color: "text-orange-600" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Welcome back to Silsila Administration.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-none border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="rounded-none border-none shadow-sm min-h-[300px] flex items-center justify-center">
           <p className="text-sm text-muted-foreground italic">Sales analytics coming soon...</p>
        </Card>
        <Card className="rounded-none border-none shadow-sm min-h-[300px] flex items-center justify-center">
           <p className="text-sm text-muted-foreground italic">Recent activity feed coming soon...</p>
        </Card>
      </div>
    </div>
  );
}
