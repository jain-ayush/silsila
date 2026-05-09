import Link from "next/link";
import { Button } from "@/components/ui/button";

const Hero = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] md:h-[80vh] w-full overflow-hidden bg-slate-900">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=2000" 
          alt="Silsila Banner"
          className="w-full h-full object-cover object-center opacity-70"
          loading="eager"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10" />

      <div className="container relative mx-auto h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8 text-white z-20">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
            Timeless Elegance in <span className="text-primary-foreground italic">Pure Silver</span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-lg">
            Handcrafted pieces that tell a story. Discover our new arrivals and find the perfect addition to your collection.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/shop">
              <Button size="lg" className="px-8 rounded-none uppercase tracking-widest text-xs font-bold">
                Shop Collection
              </Button>
            </Link>
            <Link href="/categories/new-arrivals">
              <Button size="lg" variant="outline" className="px-8 rounded-none border-white text-white hover:bg-white hover:text-black uppercase tracking-widest text-xs font-bold">
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
