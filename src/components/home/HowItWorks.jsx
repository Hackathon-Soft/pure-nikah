import { motion } from "framer-motion";
import { FiUserPlus, FiSearch, FiHeart, FiMessageCircle } from "react-icons/fi";

const steps = [
  { icon: FiUserPlus, title: "Create Profile", description: "Sign up and build your detailed Islamic profile with your preferences and values." },
  { icon: FiSearch, title: "Discover Matches", description: "Use our smart filters to find compatible partners based on religiosity, lifestyle, and goals." },
  { icon: FiHeart, title: "Express Interest", description: "Send an interest request to profiles you connect with. Both parties must agree to proceed." },
  { icon: FiMessageCircle, title: "Connect & Communicate", description: "Chat in a halal environment with optional wali/guardian involvement for peace of mind." },
];

const HowItWorks = () => (
  <section className="section-padding bg-muted islamic-pattern">
    <div className="app-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-header">
        <span className="section-label">Simple Process</span>
        <h2 className="section-title">How PureNikah Works</h2>
        <p className="section-subtitle">Four simple steps towards a blessed marriage, InshaAllah.</p>
      </motion.div>
      <div className="grid-4col">
        {steps.map((step, i) => (
          <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative text-center">
            {i < steps.length - 1 && <div className="step-connector" />}
            <div className="icon-circle w-[var(--size-avatar)] h-[var(--size-avatar)] mb-token-5">
              <step.icon style={{ fontSize: "var(--size-icon-xl)" }} />
            </div>
            <div className="step-badge">{i + 1}</div>
            <h3 className="card-section-title mb-token-2">{step.title}</h3>
            <p className="text-body-muted">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
