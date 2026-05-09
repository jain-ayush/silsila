import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  {
    name: "Rings",
    slug: "rings",
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Necklaces",
    slug: "necklaces",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000",
  },
  {
    name: "Earrings",
    slug: "earrings",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    image: "https://images.unsplash.com/photo-1611591437281-460bfbe157a8?auto=format&fit=crop&q=80&w=1000",
  },
];

const FeaturedCategories = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight uppercase tracking-[0.2em]">Shop by Category</h2>
          <div className="h-1 w-20 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category) => (
            <Link key={category.slug} href={`/shop?category=${category.slug}`}>
              <Card className="group overflow-hidden border-none rounded-none cursor-pointer shadow-none">
                <CardContent className="p-0 relative block aspect-[4/5]">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-white text-xl font-bold uppercase tracking-widest">{category.name}</h3>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
