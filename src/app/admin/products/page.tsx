import { ProductService } from "@/database/services/ProductService";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductActions from "@/components/admin/ProductActions";

export default async function AdminProductsPage() {
  let products: any[] = [];
  try {
    const data = await ProductService.getAllProducts({ limit: 100 });
    products = data.products;
  } catch (error) {
    console.error("AdminProductsPage Error:", error);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-widest">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your jewellery inventory</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="rounded-none uppercase tracking-widest text-xs font-bold gap-2">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white border rounded-none overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b bg-slate-50">
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Product</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">SKU</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Category</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Price</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Stock</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px]">Status</th>
              <th className="p-4 font-bold uppercase tracking-wider text-[10px] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-10 bg-slate-100 flex-shrink-0">
                      <img 
                        src={product.images[0]?.url || "/placeholder.jpg"} 
                        alt={product.title} 
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-medium line-clamp-1">{product.title}</span>
                  </div>
                </td>
                <td className="p-4 font-mono text-xs">{product.sku}</td>
                <td className="p-4 uppercase text-[10px] font-bold text-muted-foreground">{product.category?.name}</td>
                <td className="p-4 font-bold">₹{Number(product.price).toLocaleString()}</td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-1 ${product.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="p-4">
                   {product.featured && (
                     <span className="text-[10px] uppercase font-bold text-primary">Featured</span>
                   )}
                </td>
                <td className="p-4 text-right">
                  <ProductActions productId={product.id} productSlug={product.slug} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="p-20 text-center text-muted-foreground italic">
            No products found. Start by adding your first jewellery piece.
          </div>
        )}
      </div>
    </div>
  );
}
