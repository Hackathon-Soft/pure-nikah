import { Link, Outlet } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

const AuthLayout = () => (
  <div className="min-h-screen flex flex-col bg-muted islamic-pattern">
    {/* Minimal Auth Header */}
    <header className="w-full py-token-4 px-token-6">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-token-2">
          <FaHeart className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} />
          <span className="font-display text-token-xl font-bold text-foreground">PureNikah</span>
        </Link>
        <div className="flex items-center gap-token-4 text-token-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors hidden sm:inline">
            About
          </Link>
        </div>
      </div>
    </header>

    {/* Auth Content */}
    <main className="flex-1 flex items-center justify-center px-token-4 py-token-8">
      <Outlet />
    </main>

    {/* Minimal Auth Footer */}
    <footer className="w-full py-token-4 px-token-6 border-t border-border">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-token-2 text-token-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} PureNikah. All rights reserved.</span>
        <div className="flex items-center gap-token-4">
          <Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <Link to="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link to="/help" className="hover:text-primary transition-colors">Help</Link>
        </div>
      </div>
    </footer>
  </div>
);

export default AuthLayout;
