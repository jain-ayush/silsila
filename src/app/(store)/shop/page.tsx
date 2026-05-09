import { ProductService } from "@/database/services/ProductService";
import ProductCard from "@/components/storefront/ProductCard";
import SortSelector from "@/components/storefront/SortSelector";
import PriceFilter from "@/components/storefront/PriceFilter";
import Link from "next/link";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const search = typeof params.search === "string" ? params.search : undefined;
  const sort = typeof params.sort === "string" ? (params.sort as any) : "newest";
  const minPrice = typeof params.minPrice === "string" ? Number(params.minPrice) : undefined;
  const maxPrice = typeof params.maxPrice === "string" ? Number(params.maxPrice) : undefined;

  // Note: This will fail without a running MySQL DB, but the code is correct.
  let productsData: any = { products: [], total: 0, page: 1, totalPages: 1 };
  try {
    productsData = await ProductService.getAllProducts({
      category,
      search,
      sort,
      minPrice,
      maxPrice,
      limit: 100, // For now fetch many
    });
  } catch (error) {
    console.error("ShopPage Error:", error);
  }

  const categories = await ProductService.getAllCategories().catch(() => []);

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight uppercase tracking-widest">
            {search ? `Search: "${search}"` : category ? category.replace("-", " ") : "All Jewellery"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {productsData.products.length} products
          </p>
        </div>

        <div className="flex items-center gap-4">
           <SortSelector currentSort={sort} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="hidden md:block space-y-8">
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className={`text-sm ${!category ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"}`}>
                  All
                </Link>
              </li>
              {categories.map((cat: any) => (
                <li key={cat.id}>
                  <Link 
                    href={`/shop?category=${cat.slug}`} 
                    className={`text-sm ${category === cat.slug ? "text-primary font-bold" : "text-muted-foreground hover:text-primary"}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-4">Price Range</h4>
            <PriceFilter 
              initialMin={params.minPrice as string || ""} 
              initialMax={params.maxPrice as string || ""} 
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="md:col-span-3">
          {productsData.products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {productsData.products.map((product: any) => (
                <ProductCard key={product.id} product={JSON.parse(JSON.stringify(product))} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-none">
              <p className="text-muted-foreground">No products found matching your filters.</p>
              <Link href="/shop" className="text-primary text-sm font-bold mt-4 underline uppercase tracking-widest">
                Clear all filters
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
