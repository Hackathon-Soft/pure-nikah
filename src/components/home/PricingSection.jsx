import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FiCheck, FiHeart, FiShield, FiStar, FiSearch } from "react-icons/fi";
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

const specialDiscounts = [
  {
    icon: "🕊️",
    title: "Widowed Members",
    subtitle: "100% Free Premium",
    description: "We understand the difficulty of losing a spouse. PureNikah provides all premium features completely free to help you find a new beginning.",
    benefits: [
      "Free verified badge — no waiting",
      "Priority placement in search results",
      "Highlighted profile with special badge",
      "Free premium match suggestions",
      "Dedicated support channel",
      "Free wali/family involvement features",
    ],
    color: "border-primary",
    bg: "bg-primary/5",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary",
  },
  {
    icon: "💫",
    title: "Divorced Members",
    subtitle: "50% Off + Free Verification",
    description: "Everyone deserves a second chance at happiness. We offer significant discounts and support to help divorced members find their match.",
    benefits: [
      "Free profile verification",
      "50% off any optional donation tier",
      "Priority in search results",
      "Special 'Fresh Start' profile badge",
      "Advanced compatibility matching",
      "Extended privacy controls",
    ],
    color: "border-accent",
    bg: "bg-accent/5",
    badgeBg: "bg-accent/15",
    badgeText: "text-accent-foreground",
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
      <div className="grid-2col max-w-3xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
            className={plan.highlight ? "card-pricing-highlight" : "card-pricing-default"}>
            {plan.highlight && (
              <div className="badge-recommended">
                <FiHeart style={{ fontSize: "var(--text-xs)" }} /> Recommended
              </div>
            )}
            <h3 className="card-section-title text-token-xl">{plan.name}</h3>
            <div className="mt-token-3 mb-token-2">
              <span className="pricing-price">{plan.price}</span>
              {plan.period && <span className="pricing-period">{plan.period}</span>}
            </div>
            <p className="pricing-description">{plan.description}</p>
            <ul className="pricing-features">
              {plan.features.map((f) => (
                <li key={f} className="check-list-item">
                  <FiCheck className="check-list-item-icon" style={{ fontSize: "var(--size-icon)" }} />
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

      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-token-16">
        <div className="section-header">
          <span className="section-label">Special Support</span>
          <h2 className="section-title">Discounts for Widowed & Divorced</h2>
          <p className="section-subtitle max-w-lg">
            Islam encourages supporting those going through difficult times. We offer special benefits to widowed and divorced members as our way of giving back.
          </p>
        </div>

        <div className="grid-2col max-w-4xl mx-auto">
          {specialDiscounts.map((discount, i) => (
            <motion.div
              key={discount.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <Card className={`${discount.color} ${discount.bg} h-full`}>
                <CardContent className="p-token-8 flex flex-col h-full">
                  <div className="discount-card-header">
                    <span className="discount-card-icon">{discount.icon}</span>
                    <div>
                      <h3 className="discount-card-title">{discount.title}</h3>
                      <span className={`discount-card-badge ${discount.badgeBg} ${discount.badgeText}`}>
                        {discount.subtitle}
                      </span>
                    </div>
                  </div>

                  <p className="text-body-muted mb-token-6">{discount.description}</p>

                  <ul className="pricing-features">
                    {discount.benefits.map((benefit) => (
                      <li key={benefit} className="check-list-item text-foreground">
                        <FiCheck className="check-list-item-icon" style={{ fontSize: "var(--size-icon)" }} />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <Button variant="hero" size="lg" asChild className="w-full">
                    <Link to="/register">Register & Claim Benefits</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-token-10 text-center max-w-2xl mx-auto"
        >
          <Card className="bg-card border-border">
            <CardContent className="p-token-6">
              <p className="quote-text">"The best of you are those who are best to the widows and the poor."</p>
              <p className="quote-attribution">— Prophet Muhammad ﷺ (Sahih Bukhari)</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  </section>
);

export default PricingSection;
