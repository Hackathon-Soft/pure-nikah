import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HiOutlineMenu, HiX } from "react-icons/hi";
import { FaHeart } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Pricing", path: "/pricing" },
  { label: "Search", path: "/search" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, signOut, profile } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          <FaHeart className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} />
          <span className="navbar-brand-text">PureNikah</span>
        </Link>

        <div className="navbar-links">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`nav-link ${location.pathname === link.path ? "nav-link-active" : "nav-link-inactive"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="hero" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        <button className="navbar-mobile-toggle" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? (
            <HiX style={{ fontSize: "var(--size-icon-lg)" }} />
          ) : (
            <HiOutlineMenu style={{ fontSize: "var(--size-icon-lg)" }} />
          )}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="navbar-mobile-menu"
          >
            <div className="navbar-mobile-inner">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setOpen(false)}
                  className={`nav-link py-token-2 ${location.pathname === link.path ? "nav-link-active" : "nav-link-inactive"}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="navbar-mobile-actions">
                {isAuthenticated ? (
                  <>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/dashboard" onClick={() => setOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button variant="hero" className="flex-1" onClick={() => { handleSignOut(); setOpen(false); }}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" asChild className="flex-1">
                      <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
                    </Button>
                    <Button variant="hero" asChild className="flex-1">
                      <Link to="/register" onClick={() => setOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
