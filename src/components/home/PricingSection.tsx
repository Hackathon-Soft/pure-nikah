import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiCheck } from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: [
      "Create profile",
      "Basic search filters",
      "5 interests per day",
      "Limited messaging",
      "View basic profiles",
    ],
    cta: "Get Started",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Premium",
    price: "$19",
    period: "/month",
    features: [
      "Everything in Free",
      "Unlimited messaging",
      "Advanced search filters",
      "See who viewed you",
      "Priority support",
      "Compatibility scoring",
      "Verified badge",
    ],
    cta: "Go Premium",
    variant: "hero" as const,
    popular: true,
  },
  {
    name: "Gold",
    price: "$39",
    period: "/month",
    features: [
      "Everything in Premium",
      "AI match recommendations",
      "Video introduction",
      "Marriage counselor access",
      "Profile boost weekly",
      "Wali management tools",
    ],
    cta: "Choose Gold",
    variant: "gold" as const,
    popular: false,
  },
];

const PricingSection = () => (
  <section className="section-padding bg-muted islamic-pattern" id="pricing">
    <div className="container mx-auto px-token-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-token-14"
      >
        <span className="text-token-sm font-semibold text-accent uppercase tracking-wider">Plans</span>
        <h2 className="text-token-3xl md:text-token-4xl font-display font-bold text-foreground mt-token-2">
          Simple, Transparent Pricing
        </h2>
        <p className="text-muted-foreground mt-token-3 max-w-md mx-auto">
          Start for free and upgrade when you're ready for more features.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-token-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`relative rounded-2xl bg-card border p-token-8 flex flex-col ${
              plan.popular
                ? "border-primary shadow-elevated scale-105"
                : "border-border shadow-card"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-token-xs font-semibold px-token-4 py-token-1 rounded-full flex items-center gap-token-1">
                <FaStar style={{ fontSize: "var(--text-xs)" }} /> Most Popular
              </div>
            )}
            <h3 className="font-display text-token-xl font-bold text-foreground">{plan.name}</h3>
            <div className="mt-token-4 mb-token-6">
              <span className="text-token-4xl font-bold text-foreground">{plan.price}</span>
              <span className="text-muted-foreground text-token-sm ml-token-1">{plan.period}</span>
            </div>
            <ul className="flex-1 space-y-3 mb-token-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-token-2 text-token-sm text-muted-foreground">
                  <FiCheck className="text-primary flex-shrink-0 mt-0.5" style={{ fontSize: "var(--size-icon)" }} />
                  {f}
                </li>
              ))}
            </ul>
            <Button variant={plan.variant} size="lg" asChild className="w-full">
              <Link to="/register">{plan.cta}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PricingSection;
