"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ImagePlus, X, Save, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
    sku: "",
    purity: "925 Sterling Silver",
    weight: "",
    categoryId: "",
    featured: false,
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        
        setFormData({
          title: data.title,
          slug: data.slug,
          description: data.description,
          price: data.price.toString(),
          comparePrice: data.comparePrice?.toString() || "",
          stock: data.stock.toString(),
          sku: data.sku,
          purity: data.purity,
          weight: data.weight.toString(),
          categoryId: data.category?.slug || "",
          featured: data.featured,
        });
        setImages(data.images.map((img: any) => img.url));
      } catch (error) {
        console.error(error);
        alert("Error loading product");
        router.push("/admin/products");
      } finally {
        setFetching(false);
      }
    };

    if (id) fetchProduct();
  }, [id, router]);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      setImages([...images, result.info.secure_url]);
    }
  };

  const removeImage = (url: string) => {
    setImages(images.filter((img) => img !== url));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images }),
      });

      if (!res.ok) throw new Error("Failed to update product");
      
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Error updating product");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold uppercase tracking-widest">Edit Jewellery</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-6 border space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest">Product Title</Label>
              <Input 
                required
                className="rounded-none h-12"
                placeholder="e.g. Eternal Silver Band" 
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest">Slug (URL)</Label>
              <Input 
                required
                className="rounded-none h-12"
                placeholder="e.g. eternal-silver-band" 
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] uppercase font-bold tracking-widest">Description</Label>
              <Textarea 
                required
                className="rounded-none min-h-[200px]"
                placeholder="Describe the craftsmanship and story..." 
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white p-6 border space-y-6">
            <h3 className="text-[10px] uppercase font-bold tracking-widest border-b pb-4">Product Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((url) => (
                <div key={url} className="relative aspect-[3/4] bg-slate-100 border">
                  <img src={url} alt="Upload" className="h-full w-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => removeImage(url)}
                    className="absolute -top-2 -right-2 bg-destructive text-white rounded-full p-1 shadow-lg"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <CldUploadWidget 
                uploadPreset="silsila_products" 
                onUpload={handleUpload}
                signatureEndpoint=""
                options={{
                  maxFiles: 5,
                  clientAllowedFormats: ["jpg", "png", "webp"],
                }}
              >
                {({ open }) => (
                  <button
                    type="button"
                    onClick={() => open()}
                    className="aspect-[3/4] border-2 border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-primary hover:border-primary transition-all"
                  >
                    <ImagePlus className="h-8 w-8" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Upload</span>
                  </button>
                )}
              </CldUploadWidget>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar settings */}
        <div className="space-y-8">
          <div className="bg-white p-6 border space-y-6">
            <h3 className="text-[10px] uppercase font-bold tracking-widest border-b pb-4">Inventory & Pricing</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Price (INR)</Label>
                <Input 
                  required
                  type="number"
                  className="rounded-none h-12"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Compare at Price (INR)</Label>
                <Input 
                  type="number"
                  className="rounded-none h-12 text-muted-foreground"
                  value={formData.comparePrice}
                  onChange={(e) => setFormData({ ...formData, comparePrice: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">SKU</Label>
                <Input 
                  required
                  className="rounded-none h-12 font-mono"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Stock Quantity</Label>
                <Input 
                  required
                  type="number"
                  className="rounded-none h-12"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border space-y-6">
            <h3 className="text-[10px] uppercase font-bold tracking-widest border-b pb-4">Organization</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Category</Label>
                <Select 
                  value={formData.categoryId}
                  onValueChange={(val: string | null) => setFormData({ ...formData, categoryId: val ?? "" })}
                >
                  <SelectTrigger className="rounded-none h-12 uppercase text-[10px] font-bold">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                     <SelectItem value="rings">Rings</SelectItem>
                     <SelectItem value="necklaces">Necklaces</SelectItem>
                     <SelectItem value="bracelets">Bracelets</SelectItem>
                     <SelectItem value="earrings">Earrings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Purity</Label>
                <Input 
                  className="rounded-none h-12"
                  value={formData.purity}
                  onChange={(e) => setFormData({ ...formData, purity: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Weight (Grams)</Label>
                <Input 
                  required
                  type="number"
                  step="0.01"
                  className="rounded-none h-12"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between pt-4">
                <Label className="text-[10px] uppercase font-bold tracking-widest">Featured Product</Label>
                <Switch 
                  checked={formData.featured}
                  onCheckedChange={(val) => setFormData({ ...formData, featured: val })}
                />
              </div>
            </div>
          </div>

          <Button 
            type="submit"
            disabled={loading}
            className="w-full rounded-none py-8 uppercase tracking-[0.2em] text-xs font-bold shadow-lg"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Update Product</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
