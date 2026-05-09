import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="text-2xl font-bold tracking-widest text-primary uppercase">
              Silsila
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Exquisite handcrafted silver jewellery designed for the modern woman. 
              Elegance in every piece, crafted with passion.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white rounded-full border hover:bg-primary hover:text-white transition-all shadow-sm">
                <Instagram className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-white rounded-full border hover:bg-primary hover:text-white transition-all shadow-sm">
                <Facebook className="h-4 w-4" />
              </Link>
              <Link href="#" className="p-2 bg-white rounded-full border hover:bg-primary hover:text-white transition-all shadow-sm">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Jewellery</Link></li>
              <li><Link href="/categories/rings" className="text-sm text-muted-foreground hover:text-primary transition-colors">Rings</Link></li>
              <li><Link href="/categories/necklaces" className="text-sm text-muted-foreground hover:text-primary transition-colors">Necklaces</Link></li>
              <li><Link href="/categories/bracelets" className="text-sm text-muted-foreground hover:text-primary transition-colors">Bracelets</Link></li>
              <li><Link href="/categories/earrings" className="text-sm text-muted-foreground hover:text-primary transition-colors">Earrings</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Customer Service</h4>
            <ul className="space-y-4">
              <li><Link href="/shipping" className="text-sm text-muted-foreground hover:text-primary transition-colors">Shipping Policy</Link></li>
              <li><Link href="/returns" className="text-sm text-muted-foreground hover:text-primary transition-colors">Returns & Exchanges</Link></li>
              <li><Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Story</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>123 Jewellery Lane, Silver City, IN 452001</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>hello@silsila.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Silsila Jewellery. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-primary">Terms</Link>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-primary">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
