import { getDb } from "@/lib/db";
import { User } from "@/database/entities/User";
import { Button } from "@/components/ui/button";
import { UserCircle, Mail, Phone } from "lucide-react";

export default async function AdminUsersPage() {
  let users: any[] = [];
  try {
    const db = await getDb();
    users = await db.getRepository(User).find({
      order: { createdAt: "DESC" }
    });
  } catch (error) {
    console.error("AdminUsersPage Error:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-widest">Customers</h1>
        <p className="text-sm text-muted-foreground">Manage your registered user base</p>
      </div>

      <div className="bg-white border rounded-none overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Customer</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Contact</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Role</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Joined</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img src={user.avatar} className="h-8 w-8 rounded-full" alt="" />
                    ) : (
                      <UserCircle className="h-8 w-8 text-muted-foreground" />
                    )}
                    <span className="font-medium">{user.name || "Anonymous User"}</span>
                  </div>
                </td>
                <td className="p-4 space-y-1">
                  {user.email && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" /> {user.email}
                    </div>
                  )}
                  {user.phoneNumber && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-3 w-3" /> {user.phoneNumber}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold uppercase ${user.role === 'ADMIN' ? 'text-primary' : 'text-muted-foreground'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-xs text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                  <span className="text-[10px] font-bold uppercase text-green-600 bg-green-50 px-2 py-1">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="p-20 text-center text-muted-foreground italic">
            No registered customers found.
          </div>
        )}
      </div>
    </div>
  );
}
