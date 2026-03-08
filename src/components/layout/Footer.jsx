import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const Footer = () => (
  <footer className="bg-foreground text-background py-section">
    <div className="app-container">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-token-10 mb-token-12">
        <div>
          <div className="flex items-center gap-token-2 mb-token-4">
            <FaHeart className="text-accent" style={{ fontSize: "var(--size-icon-lg)" }} />
            <span className="font-display text-token-lg font-bold">PureNikah</span>
          </div>
          <p className="text-background/60 text-token-sm leading-token-relaxed">
            A trusted Islamic marriage platform helping Muslims find their life partner with dignity, respect, and adherence to Islamic values.
          </p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-token-4">Platform</h4>
          <div className="flex flex-col gap-token-2 text-token-sm text-background/60">
            <Link to="/search" className="link-footer">Search Profiles</Link>
            <Link to="/pricing" className="link-footer">Pricing</Link>
            <Link to="/about" className="link-footer">About Us</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-token-4">Support</h4>
          <div className="flex flex-col gap-token-2 text-token-sm text-background/60">
            <Link to="/help" className="link-footer">Help Center</Link>
            <Link to="/privacy-policy" className="link-footer">Privacy Policy</Link>
            <Link to="/terms-of-service" className="link-footer">Terms of Service</Link>
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-token-4">Contact</h4>
          <div className="flex flex-col gap-token-2 text-token-sm text-background/60">
            <span>support@purenikah.com</span>
            <span>Available 24/7</span>
          </div>
        </div>
      </div>
      <div className="border-t border-background/10 pt-token-8 text-center text-token-sm text-background/40">
        © {new Date().getFullYear()} PureNikah. All rights reserved. Built with faith and love.
      </div>
    </div>
  </footer>
);

export default Footer;
