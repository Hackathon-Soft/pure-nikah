import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiCheck, FiHeart } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free Forever",
    price: "Free",
    period: "",
    description: "Everything you need to find your match",
    features: [
      "Create full profile",
      "Unlimited search & filters",
      "Send & receive interests",
      "Unlimited messaging",
      "View all profiles",
      "Location-based search",
      "Caste & preference filters",
      "CNIC verified badge",
    ],
    cta: "Join Free",
    variant: "hero" as const,
    popular: true,
    icon: GoShieldCheck,
  },
  {
    name: "Supporter",
    price: "PKR 500",
    period: "/one-time",
    description: "Optional donation to support the platform",
    features: [
      "Everything in Free",
      "Profile boost for 30 days",
      "Priority in search results",
      "Support the community",
      "Special supporter badge",
      "Help keep PureNikah running",
    ],
    cta: "Support Us",
    variant: "gold" as const,
    popular: false,
    icon: FiHeart,
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
        <span className="text-token-sm font-semibold text-accent uppercase tracking-wider">No Hidden Fees</span>
        <h2 className="text-token-3xl md:text-token-4xl font-display font-bold text-foreground mt-token-2">
          100% Free — No Barriers to Nikah
        </h2>
        <p className="text-muted-foreground mt-token-3 max-w-lg mx-auto">
          We believe finding a life partner shouldn't cost money. PureNikah is completely free. Optionally support us if you'd like to keep the platform running.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-token-8 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className={`relative rounded-2xl bg-card border p-token-8 flex flex-col ${
              plan.popular
                ? "border-primary shadow-elevated"
                : "border-border shadow-card"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary text-primary-foreground text-token-xs font-semibold px-token-4 py-token-1 rounded-full flex items-center gap-token-1">
                <GoShieldCheck style={{ fontSize: "var(--text-xs)" }} /> Recommended
              </div>
            )}
            <div className="flex items-center gap-token-3 mb-token-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <plan.icon className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} />
              </div>
              <div>
                <h3 className="font-display text-token-xl font-bold text-foreground">{plan.name}</h3>
                <p className="text-token-xs text-muted-foreground">{plan.description}</p>
              </div>
            </div>
            <div className="mb-token-6">
              <span className="text-token-4xl font-bold text-foreground">{plan.price}</span>
              {plan.period && (
                <span className="text-muted-foreground text-token-sm ml-token-1">{plan.period}</span>
              )}
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
