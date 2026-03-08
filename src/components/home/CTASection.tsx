import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const CTASection = () => (
  <section className="py-20 bg-gradient-primary relative overflow-hidden">
    <div className="absolute inset-0 islamic-pattern opacity-20" />
    <div className="container mx-auto px-4 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
          Your Journey to a Blessed Union Starts Here
        </h2>
        <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8 text-lg">
          Join thousands of Muslims who found their life partner through PureNikah. InshaAllah, you're next.
        </p>
        <Button variant="gold" size="lg" asChild className="text-base px-10">
          <Link to="/register">
            Create Free Account <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
