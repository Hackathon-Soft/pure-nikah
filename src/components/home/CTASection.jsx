import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

const CTASection = () => (
  <section className="section-padding bg-gradient-primary relative overflow-hidden">
    <div className="absolute inset-0 islamic-pattern opacity-20" />
    <div className="app-container relative z-10 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
        <h2 className="text-token-3xl md:text-token-5xl font-display font-bold text-primary-foreground mb-token-4">Your Journey to a Blessed Union Starts Here</h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto mb-token-8 text-token-lg">Join thousands of Muslims who found their life partner through PureNikah. InshaAllah, you're next.</p>
        <Button variant="gold" size="lg" asChild className="text-token-base px-token-10">
          <Link to="/register">Create Free Account <FiArrowRight className="ml-token-2" style={{ fontSize: "var(--size-icon)" }} /></Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
