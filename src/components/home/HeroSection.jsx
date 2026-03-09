import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="hero-section">
    <div className="hero-bg" style={{ backgroundImage: `url(${heroBg})` }} />
    <div className="hero-overlay" />
    <div className="hero-pattern" />

    <div className="app-container relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hero-content"
      >
        <div className="hero-chip mb-token-6">
          <GoShieldCheck className="text-accent" style={{ fontSize: "var(--size-icon)" }} />
          <span className="hero-chip-text">Trusted by 50,000+ Muslims worldwide</span>
        </div>

        <h1 className="hero-title">
          Find Your <span className="hero-title-accent">Life Partner</span>
          <br />
          The Halal Way
        </h1>

        <p className="hero-description">
          PureNikah connects sincere Muslims seeking marriage in a respectful,
          private, and Islamic environment. Begin your journey to a blessed union.
        </p>

        <div className="hero-actions">
          <Button variant="gold" size="lg" asChild className="text-token-base px-token-8">
            <Link to="/register">
              <FiSearch className="mr-token-2" style={{ fontSize: "var(--size-icon)" }} />
              Start Your Search
            </Link>
          </Button>
          <Button
            variant="outline-hero"
            size="lg"
            asChild
            className="text-token-base px-token-8 border-background/40 text-background hover:bg-background hover:text-foreground"
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <span className="hero-stat-value">50K+</span>
            <span>Active Members</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">12K+</span>
            <span>Successful Matches</span>
          </div>
          <div className="hero-stat-divider" />
          <div className="hero-stat">
            <span className="hero-stat-value">100%</span>
            <span>Halal & Private</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
