import { motion } from "framer-motion";
import { FiHeart, FiUsers, FiGlobe } from "react-icons/fi";
import { GoShieldCheck } from "react-icons/go";

const stats = [
  { icon: FiUsers, label: "Active Members", value: "50,000+" },
  { icon: FiHeart, label: "Successful Matches", value: "12,000+" },
  { icon: FiGlobe, label: "Countries", value: "80+" },
  { icon: GoShieldCheck, label: "Verified Profiles", value: "95%" },
];

const About = () => (
  <>
    <section className="section-padding bg-gradient-primary relative overflow-hidden">
      <div className="absolute inset-0 islamic-pattern opacity-20" />
      <div className="container mx-auto px-token-4 relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-token-4xl md:text-token-5xl font-display font-bold text-primary-foreground mb-token-4">
            About PureNikah
          </h1>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-token-lg leading-token-relaxed">
            PureNikah was founded with a simple mission: to help Muslims find their life partner in a way that honours Islamic traditions, respects privacy, and fosters genuine connections.
          </p>
        </motion.div>
      </div>
    </section>

    <section className="section-padding">
      <div className="container mx-auto px-token-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-token-6 max-w-4xl mx-auto">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-token-6 rounded-xl bg-card shadow-card border border-border"
            >
              <stat.icon className="text-primary mx-auto mb-token-3" style={{ fontSize: "var(--size-icon-xl)" }} />
              <p className="text-token-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-token-sm text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    <section className="section-padding bg-muted">
      <div className="container mx-auto px-token-4 max-w-3xl">
        <h2 className="text-token-3xl font-display font-bold text-foreground text-center mb-token-8">Our Mission</h2>
        <div className="space-y-6 text-muted-foreground leading-token-relaxed">
          <p>Marriage is one of the most sacred institutions in Islam. The Prophet Muhammad ﷺ said, "When a man marries, he has fulfilled half of his religion." At PureNikah, we take this responsibility seriously.</p>
          <p>Our platform is designed to provide a dignified, private, and Islamic environment where Muslims can search for a spouse with sincerity and intention.</p>
          <p>Every feature — from our privacy controls to our wali involvement system — is built with Islamic principles at its core.</p>
        </div>
      </div>
    </section>
  </>
);

export default About;
