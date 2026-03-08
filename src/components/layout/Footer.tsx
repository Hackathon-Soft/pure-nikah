import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

const Footer = () => (
  <footer className="bg-foreground text-background py-16">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Heart className="h-6 w-6 fill-accent text-accent" />
            <span className="font-display text-lg font-bold">PureNikah</span>
          </div>
          <p className="text-background/60 text-sm leading-relaxed">
            A trusted Islamic marriage platform helping Muslims find their life partner with dignity, respect, and adherence to Islamic values.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Platform</h4>
          <div className="flex flex-col gap-2 text-sm text-background/60">
            <Link to="/search" className="hover:text-accent transition-colors">Search Profiles</Link>
            <Link to="/pricing" className="hover:text-accent transition-colors">Pricing</Link>
            <Link to="/about" className="hover:text-accent transition-colors">About Us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-background/60">
            <span className="hover:text-accent transition-colors cursor-pointer">Help Center</span>
            <span className="hover:text-accent transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-accent transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-2 text-sm text-background/60">
            <span>support@purenikah.com</span>
            <span>Available 24/7</span>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 pt-8 text-center text-sm text-background/40">
        © {new Date().getFullYear()} PureNikah. All rights reserved. Built with faith and love.
      </div>
    </div>
  </footer>
);

export default Footer;
