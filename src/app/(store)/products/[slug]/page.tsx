import { notFound } from "next/navigation";
import { ProductService } from "@/database/services/ProductService";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, ShieldCheck, Truck, RotateCcw } from "lucide-react";
import AddToCartButton from "@/components/storefront/AddToCartButton";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  let product: any = null;
  try {
    const rawProduct = await ProductService.getProductBySlug(slug);
    if (rawProduct) {
      product = JSON.parse(JSON.stringify(rawProduct));
    }
  } catch (error) {
    console.error("ProductDetailsPage Error:", error);
  }

  if (!product) {
    notFound();
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative block aspect-[4/5] overflow-hidden bg-slate-100">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.title}
              className="object-cover w-full h-full"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images?.slice(1).map((img: any, index: number) => (
              <div key={index} className="relative block aspect-square overflow-hidden bg-slate-100 cursor-pointer border hover:border-primary transition-colors">
                <img src={img.url} alt={`${product.title} ${index + 2}`} className="object-cover w-full h-full" />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-bold">
              {product.category?.name}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
            <div className="flex items-center gap-4 pt-2">
              <span className="text-2xl font-bold">₹{Number(product.price).toLocaleString()}</span>
              {product.comparePrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ₹{Number(product.comparePrice).toLocaleString()}
                  </span>
                  <Badge className="bg-red-500 text-white border-none rounded-none">
                    SAVE {discount}%
                  </Badge>
                </>
              )}
            </div>
          </div>

          <div className="space-y-4 border-y py-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs uppercase tracking-widest font-bold">
               <div className="flex flex-col gap-1">
                 <span className="text-muted-foreground font-medium">Purity</span>
                 <span>{product.purity}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-muted-foreground font-medium">Weight</span>
                 <span>{product.weight}g</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-muted-foreground font-medium">SKU</span>
                 <span>{product.sku}</span>
               </div>
               <div className="flex flex-col gap-1">
                 <span className="text-muted-foreground font-medium">Availability</span>
                 <span className="text-green-600">In Stock</span>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <AddToCartButton 
              product={{
                id: product.id,
                title: product.title,
                slug: product.slug,
                price: Number(product.price),
                image: product.images?.[0]?.url || "/placeholder.jpg",
                stock: product.stock,
                category: product.category?.name || "Jewellery"
              }}
            />
            <Button size="lg" variant="outline" className="w-full rounded-none border-primary text-primary hover:bg-primary hover:text-white py-7">
              <Heart className="h-5 w-5 mr-2" /> Add to Wishlist
            </Button>
            <Button variant="ghost" className="w-full text-xs uppercase tracking-widest font-bold gap-2">
              <Share2 className="h-4 w-4" /> Share this piece
            </Button>
          </div>

          {/* Features / Assurance */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t">
            <div className="flex flex-col items-center text-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Certified Silver</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="h-6 w-6 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="h-6 w-6 text-primary" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
