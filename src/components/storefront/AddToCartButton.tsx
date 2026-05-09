"use client";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/useCartStore";
import { useState } from "react";
import { Minus, Plus } from "lucide-react";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    image: string;
    stock: number;
    category: string;
  };
}

const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      id: Math.random().toString(36).substring(7),
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: product.price,
      image: product.image,
      quantity: quantity,
      stock: product.stock,
      category: product.category,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border h-14">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 h-full hover:bg-slate-100 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-6 text-sm font-bold w-16 text-center">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-4 h-full hover:bg-slate-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button 
          onClick={handleAddToCart}
          size="lg" 
          className="flex-grow rounded-none uppercase tracking-widest text-xs font-bold h-14"
        >
          Add to Shopping Bag
        </Button>
      </div>
    </div>
  );
};

export default AddToCartButton;
