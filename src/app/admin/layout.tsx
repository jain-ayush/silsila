import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "Categories", href: "/admin/categories", icon: Tag },
    { name: "Customers", href: "/admin/users", icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b">
          <Link href="/" className="text-xl font-bold tracking-widest text-primary uppercase">
            Silsila Admin
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex items-center justify-between p-3 text-sm font-medium rounded-none hover:bg-slate-100 transition-colors text-muted-foreground hover:text-primary"
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.name}
              </div>
              <ChevronRight className="h-4 w-4 opacity-30" />
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t">
          <Link href="/">
            <button className="flex items-center gap-3 p-3 text-sm font-medium w-full text-muted-foreground hover:text-destructive transition-colors">
              <LogOut className="h-5 w-5" />
              Exit Admin
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow">
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
           <h2 className="text-sm uppercase tracking-widest font-bold">Store Management</h2>
           <div className="flex items-center gap-4">
             {/* Admin Profile Placeholder */}
             <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
               AD
             </div>
           </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
