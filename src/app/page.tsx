import Hero from "@/components/storefront/Hero";
import FeaturedCategories from "@/components/storefront/FeaturedCategories";
import FeaturedProducts from "@/components/storefront/FeaturedProducts";
import InstagramShowcase from "@/components/storefront/InstagramShowcase";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <InstagramShowcase />
    </div>
  );
}
