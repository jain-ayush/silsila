import { Instagram } from "lucide-react";

const instagramPosts = [
  "https://images.unsplash.com/photo-1611085583191-a3b1a30a5af4?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?q=80&w=2069&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=1964&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?q=80&w=1974&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1603561591411-071c7f1ec0ae?q=80&w=1974&auto=format&fit=crop",
];

const InstagramShowcase = () => {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight uppercase tracking-[0.2em]">Shop Our Instagram</h2>
          <p className="text-muted-foreground text-sm">Tag @SilsilaSilver to be featured</p>
          <div className="h-1 w-20 bg-primary mx-auto" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {instagramPosts.map((post, index) => (
            <div key={index} className="relative aspect-square group overflow-hidden cursor-pointer">
              <img
                src={post}
                alt={`Instagram post ${index + 1}`}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Instagram className="text-white h-8 w-8" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InstagramShowcase;
