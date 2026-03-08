import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import { Heart, Users, ShieldCheck, Globe } from "lucide-react";

const stats = [
  { icon: Users, label: "Active Members", value: "50,000+" },
  { icon: Heart, label: "Successful Matches", value: "12,000+" },
  { icon: Globe, label: "Countries", value: "80+" },
  { icon: ShieldCheck, label: "Verified Profiles", value: "95%" },
];

const About = () => (
  <>
    <Navbar />
    <main className="pt-16">
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 islamic-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
              About PureNikah
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
              PureNikah was founded with a simple mission: to help Muslims find their life partner in a way that honours Islamic traditions, respects privacy, and fosters genuine connections.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-xl bg-card shadow-card border border-border"
              >
                <stat.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-8">Our Mission</h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p>
              Marriage is one of the most sacred institutions in Islam. The Prophet Muhammad ﷺ said, "When a man marries, he has fulfilled half of his religion." At PureNikah, we take this responsibility seriously.
            </p>
            <p>
              Our platform is designed to provide a dignified, private, and Islamic environment where Muslims can search for a spouse with sincerity and intention. We believe that technology, when used with the right values, can help bring people together for the sake of Allah.
            </p>
            <p>
              Every feature — from our privacy controls to our wali involvement system — is built with Islamic principles at its core. We're not just another dating app. We're a marriage platform rooted in faith, modesty, and respect.
            </p>
          </div>
        </div>
      </section>
    </main>
    <Footer />
  </>
);

export default About;
