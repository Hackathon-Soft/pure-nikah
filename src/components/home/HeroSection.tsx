import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-foreground/60" />
    <div className="absolute inset-0 islamic-pattern opacity-30" />

    <div className="container mx-auto px-token-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-token-2 bg-background/10 backdrop-blur-md rounded-full px-token-4 py-token-2 mb-token-6 border border-background/20">
          <GoShieldCheck className="text-accent" style={{ fontSize: "var(--size-icon)" }} />
          <span className="text-token-sm font-medium text-background">
            Trusted by 50,000+ Muslims worldwide
          </span>
        </div>

        <h1 className="text-token-4xl md:text-token-6xl font-display font-bold text-background leading-token-tight mb-token-6">
          Find Your{" "}
          <span className="text-accent">Life Partner</span>
          <br />
          The Halal Way
        </h1>

        <p className="text-token-lg text-background/80 mb-token-8 max-w-lg leading-token-relaxed">
          PureNikah connects sincere Muslims seeking marriage in a respectful,
          private, and Islamic environment. Begin your journey to a blessed union.
        </p>

        <div className="flex flex-col sm:flex-row gap-token-4">
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

        <div className="flex items-center gap-token-8 mt-token-10 text-background/70 text-token-sm">
          <div className="flex flex-col">
            <span className="text-token-2xl font-bold text-background">50K+</span>
            <span>Active Members</span>
          </div>
          <div className="w-px h-10 bg-background/20" />
          <div className="flex flex-col">
            <span className="text-token-2xl font-bold text-background">12K+</span>
            <span>Successful Matches</span>
          </div>
          <div className="w-px h-10 bg-background/20" />
          <div className="flex flex-col">
            <span className="text-token-2xl font-bold text-background">100%</span>
            <span>Halal & Private</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
