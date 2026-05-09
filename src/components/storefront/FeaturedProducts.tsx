import { ProductService } from "@/database/services/ProductService";
import ProductCard from "./ProductCard";

const FeaturedProducts = async () => {
  let products: any[] = [];
  try {
    products = await ProductService.getFeaturedProducts();
  } catch (error) {
    console.error("FeaturedProducts Error:", error);
  }

  if (products.length === 0) return null;

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight uppercase tracking-[0.2em]">Our Signature Collection</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Hand-selected pieces for your unique style</p>
          <div className="h-1 w-20 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={JSON.parse(JSON.stringify(product))} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <a href="/shop" className="inline-block border-b-2 border-primary pb-1 text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">
            View All Products
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
