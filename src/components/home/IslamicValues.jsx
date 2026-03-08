import { motion } from "framer-motion";
import { GoShieldCheck } from "react-icons/go";
import { FiEye, FiUsers, FiBookOpen } from "react-icons/fi";

const values = [
  { icon: GoShieldCheck, title: "Privacy & Modesty", description: "Profiles are protected. Photos remain blurred until you grant access. Your dignity is our priority." },
  { icon: FiEye, title: "Verified Profiles", description: "Every profile goes through verification to ensure genuine intentions and authenticity." },
  { icon: FiUsers, title: "Wali Involvement", description: "Optional guardian/wali system allows families to be part of the process, as encouraged in Islam." },
  { icon: FiBookOpen, title: "Islamic Guidance", description: "Access marriage counselors and Islamic advice to help you make the right decision with tawakkul." },
];

const IslamicValues = () => (
  <section className="section-padding">
    <div className="app-container">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-header">
        <span className="section-label">Our Foundation</span>
        <h2 className="section-title">Built on Islamic Values</h2>
        <p className="section-subtitle max-w-lg">"And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them." — Quran 30:21</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-token-6 max-w-4xl mx-auto">
        {values.map((val, i) => (
          <motion.div key={val.title} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="flex gap-token-4 p-token-6 card-base hover:shadow-elevated transition-shadow">
            <div className="icon-box w-12 h-12">
              <val.icon className="text-primary" style={{ fontSize: "var(--size-icon-lg)" }} />
            </div>
            <div>
              <h3 className="card-section-title mb-token-1">{val.title}</h3>
              <p className="text-token-sm text-muted-foreground leading-token-relaxed">{val.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default IslamicValues;
