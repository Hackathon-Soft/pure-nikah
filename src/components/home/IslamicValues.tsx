import { motion } from "framer-motion";
import { ShieldCheck, Eye, Users, BookOpen } from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Privacy & Modesty",
    description: "Profiles are protected. Photos remain blurred until you grant access. Your dignity is our priority.",
  },
  {
    icon: Eye,
    title: "Verified Profiles",
    description: "Every profile goes through verification to ensure genuine intentions and authenticity.",
  },
  {
    icon: Users,
    title: "Wali Involvement",
    description: "Optional guardian/wali system allows families to be part of the process, as encouraged in Islam.",
  },
  {
    icon: BookOpen,
    title: "Islamic Guidance",
    description: "Access marriage counselors and Islamic advice to help you make the right decision with tawakkul.",
  },
];

const IslamicValues = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Our Foundation</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
          Built on Islamic Values
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          "And among His signs is that He created for you mates from among yourselves, that you may dwell in tranquility with them." — Quran 30:21
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {values.map((val, i) => (
          <motion.div
            key={val.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4 p-6 rounded-xl bg-card shadow-card border border-border hover:shadow-elevated transition-shadow"
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <val.icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-1">{val.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{val.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default IslamicValues;
