import { getDb } from "@/lib/db";
import { Category } from "@/database/entities/Category";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";

export default async function AdminCategoriesPage() {
  let categories: any[] = [];
  try {
    const db = await getDb();
    categories = await db.getRepository(Category).find();
  } catch (error) {
    console.error("AdminCategoriesPage Error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage your jewellery collections</p>
        </div>
        <Button className="rounded-none uppercase tracking-widest text-xs font-bold gap-2">
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="bg-white border rounded-none overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Image</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Category Name</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Slug</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((category) => (
              <tr key={category.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="h-12 w-12 bg-slate-100 overflow-hidden">
                    <img src={category.image || "/placeholder.jpg"} alt={category.name} className="h-full w-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium">{category.name}</td>
                <td className="p-4 font-mono text-xs">{category.slug}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <div className="p-20 text-center text-muted-foreground italic">
            No categories found.
          </div>
        )}
      </div>
    </div>
  );
}
