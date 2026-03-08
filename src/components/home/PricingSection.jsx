import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FiCheck, FiHeart } from "react-icons/fi";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Free Forever", price: "Free", period: "",
    description: "Everything you need to find your match — no hidden fees.",
    features: ["Create & complete your profile", "Unlimited search & filters", "Send & receive interests", "Unlimited messaging", "View full profiles", "Smart match suggestions", "Location-based search", "Cast & preference filters"],
    cta: "Get Started Free", variant: "hero", highlight: true,
  },
  {
    name: "Sadqa Support", price: "Optional", period: "donation",
    description: "Help us keep PureNikah running. Any amount is appreciated.",
    features: ["Everything in Free", "Support server costs", "Help us stay ad-free", "Earn sadqa-e-jariyah", "Priority support", "Verified badge faster"],
    cta: "Support PureNikah", variant: "gold", highlight: false,
  },
];

const PricingSection = () => (
  <section className="section-padding bg-muted islamic-pattern" id="pricing">
    <div className="app-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-header">
        <span className="section-label">Pricing</span>
        <h2 className="section-title">100% Free. No Hidden Fees.</h2>
        <p className="section-subtitle max-w-lg">PureNikah is built as a community service. All features are free. We only ask for optional donations to keep the platform running.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-token-6 max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            className={`relative rounded-2xl bg-card border p-token-8 flex flex-col ${plan.highlight ? "border-primary shadow-elevated" : "border-border shadow-card"}`}>
            {plan.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 badge-sm bg-gradient-primary text-primary-foreground font-semibold px-token-4 flex items-center gap-token-1">
                <FiHeart style={{ fontSize: "var(--text-xs)" }} /> Recommended
              </div>
            )}
            <h3 className="card-section-title text-token-xl">{plan.name}</h3>
            <div className="mt-token-3 mb-token-2">
              <span className="text-token-4xl font-bold text-foreground">{plan.price}</span>
              {plan.period && <span className="text-muted-foreground text-token-sm ml-token-1">{plan.period}</span>}
            </div>
            <p className="text-token-sm text-muted-foreground mb-token-6">{plan.description}</p>
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
