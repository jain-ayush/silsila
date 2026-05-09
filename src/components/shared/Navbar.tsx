"use client";

import Link from "next/link";
import { Search, ShoppingBag, Heart, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import CartSidebar from "@/components/storefront/CartSidebar";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger render={
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            } />
            <SheetContent side="left" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" onClick={() => setIsOpen(false)} className="text-lg font-medium">Home</Link>
                <Link href="/shop" onClick={() => setIsOpen(false)} className="text-lg font-medium">Shop All</Link>
                <Link href="/shop?category=rings" onClick={() => setIsOpen(false)} className="text-lg font-medium">Rings</Link>
                <Link href="/shop?category=necklaces" onClick={() => setIsOpen(false)} className="text-lg font-medium">Necklaces</Link>
                <Link href="/shop?category=bracelets" onClick={() => setIsOpen(false)} className="text-lg font-medium">Bracelets</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex">
          <Link href="/" className="text-2xl font-bold tracking-widest text-primary uppercase">
            Silsila
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex lg:gap-8">
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">Shop All</Link>
          <Link href="/shop?category=rings" className="text-sm font-medium hover:text-primary transition-colors">Rings</Link>
          <Link href="/shop?category=necklaces" className="text-sm font-medium hover:text-primary transition-colors">Necklaces</Link>
          <Link href="/shop?category=bracelets" className="text-sm font-medium hover:text-primary transition-colors">Bracelets</Link>
        </nav>

        {/* Icons & Search */}
        <div className="flex items-center gap-2 sm:gap-4">
          <form onSubmit={handleSearch} className="hidden md:flex relative w-48 lg:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search jewellery..."
              className="pl-9 h-9 w-full rounded-full bg-muted/50 border-none focus-visible:ring-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          <Link href="/wishlist">
            <Button variant="ghost" size="icon">
              <Heart className="h-5 w-5" />
            </Button>
          </Link>

          <CartSidebar />

          {session ? (
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-xs font-bold uppercase tracking-widest text-primary">
                {session.user?.name || "User"}
              </span>
              <Button variant="ghost" size="icon" onClick={() => signOut()}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
