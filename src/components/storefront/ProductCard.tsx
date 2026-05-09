"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/useCartStore";

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url: string }[];
    category: { name: string };
    featured?: boolean;
    stock: number;
  };
}

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: Math.random().toString(36).substring(7), // Temporary ID for cart item instance
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.images[0]?.url || "/placeholder.jpg",
      quantity: 1,
      stock: product.stock,
      category: product.category.name,
    });
  };

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-none shadow-none rounded-none">
      <Link href={`/products/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={product.images[0]?.url || "/placeholder.jpg"}
          alt={product.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white rounded-none border-none">
            -{discount}%
          </Badge>
        )}
        {product.featured && (
          <Badge className="absolute top-3 right-3 bg-primary text-white rounded-none border-none">
            Featured
          </Badge>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform bg-white/10 backdrop-blur-sm">
           <Button 
            onClick={handleAddToCart}
            className="w-full rounded-none uppercase text-xs font-bold tracking-widest"
           >
             Quick Add
           </Button>
        </div>
      </Link>
      <CardContent className="pt-4 px-0 flex-grow">
        <div className="space-y-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            {product.category?.name || "Jewellery"}
          </p>
          <Link href={`/products/${product.slug}`} className="block">
            <h3 className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
              {product.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-sm font-bold">₹{Number(product.price).toLocaleString()}</span>
            {product.comparePrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{Number(product.comparePrice).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
