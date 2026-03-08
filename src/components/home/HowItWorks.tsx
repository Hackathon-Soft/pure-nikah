import { motion } from "framer-motion";
import { FiUserPlus, FiSearch, FiHeart, FiMessageCircle } from "react-icons/fi";

const steps = [
  {
    icon: FiUserPlus,
    title: "Create Profile",
    description: "Sign up and build your detailed Islamic profile with your preferences and values.",
  },
  {
    icon: FiSearch,
    title: "Discover Matches",
    description: "Use our smart filters to find compatible partners based on religiosity, lifestyle, and goals.",
  },
  {
    icon: FiHeart,
    title: "Express Interest",
    description: "Send an interest request to profiles you connect with. Both parties must agree to proceed.",
  },
  {
    icon: FiMessageCircle,
    title: "Connect & Communicate",
    description: "Chat in a halal environment with optional wali/guardian involvement for peace of mind.",
  },
];

const HowItWorks = () => (
  <section className="section-padding bg-muted islamic-pattern">
    <div className="container mx-auto px-token-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-gap-section"
      >
        <span className="text-token-sm font-semibold text-accent uppercase tracking-wider">Simple Process</span>
        <h2 className="text-token-3xl md:text-token-4xl font-display font-bold text-foreground mt-token-2">
          How PureNikah Works
        </h2>
        <p className="text-muted-foreground mt-token-3 max-w-md mx-auto">
          Four simple steps towards a blessed marriage, InshaAllah.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-token-8">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="relative text-center"
          >
            {i < steps.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary/20" />
            )}
            <div className="inline-flex items-center justify-center w-[var(--size-avatar)] h-[var(--size-avatar)] rounded-full bg-gradient-primary text-primary-foreground shadow-elevated mb-token-5">
              <step.icon style={{ fontSize: "var(--size-icon-xl)" }} />
            </div>
            <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent text-accent-foreground text-token-xs font-bold absolute top-0 right-[38%]">
              {i + 1}
            </div>
            <h3 className="font-display text-token-lg font-semibold text-foreground mb-token-2">
              {step.title}
            </h3>
            <p className="text-token-sm text-muted-foreground leading-token-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
