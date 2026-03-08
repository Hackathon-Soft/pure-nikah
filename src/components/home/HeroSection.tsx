import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ShieldCheck } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => (
  <section className="relative min-h-[90vh] flex items-center overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: `url(${heroBg})` }}
    />
    <div className="absolute inset-0 bg-foreground/60" />
    <div className="absolute inset-0 islamic-pattern opacity-30" />

    <div className="container mx-auto px-4 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-2xl"
      >
        <div className="inline-flex items-center gap-2 bg-background/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 border border-background/20">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-background">
            Trusted by 50,000+ Muslims worldwide
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-display font-bold text-background leading-tight mb-6">
          Find Your{" "}
          <span className="text-accent">Life Partner</span>
          <br />
          The Halal Way
        </h1>

        <p className="text-lg text-background/80 mb-8 max-w-lg leading-relaxed">
          PureNikah connects sincere Muslims seeking marriage in a respectful,
          private, and Islamic environment. Begin your journey to a blessed union.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button variant="gold" size="lg" asChild className="text-base px-8">
            <Link to="/register">
              <Search className="h-4 w-4 mr-2" />
              Start Your Search
            </Link>
          </Button>
          <Button
            variant="outline-hero"
            size="lg"
            asChild
            className="text-base px-8 border-background/40 text-background hover:bg-background hover:text-foreground"
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </div>

        <div className="flex items-center gap-8 mt-10 text-background/70 text-sm">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-background">50K+</span>
            <span>Active Members</span>
          </div>
          <div className="w-px h-10 bg-background/20" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-background">12K+</span>
            <span>Successful Matches</span>
          </div>
          <div className="w-px h-10 bg-background/20" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-background">100%</span>
            <span>Halal & Private</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

export default HeroSection;
