import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";

const stories = [
  { name: "Ahmed & Fatima", location: "London, UK", text: "Alhamdulillah, we found each other on PureNikah. The halal environment gave us both peace of mind. We've been married for 2 years now!" },
  { name: "Yusuf & Aisha", location: "Toronto, Canada", text: "The wali system was a game-changer for my family. My father was able to be part of the process, which made everything so comfortable." },
  { name: "Omar & Khadija", location: "Dubai, UAE", text: "What sets PureNikah apart is the focus on genuine intentions. Every profile is verified and the community is sincere. MashaAllah!" },
];

const SuccessStories = () => (
  <section className="section-padding bg-card">
    <div className="container mx-auto px-token-4">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-token-14">
        <span className="text-token-sm font-semibold text-accent uppercase tracking-wider">Testimonials</span>
        <h2 className="text-token-3xl md:text-token-4xl font-display font-bold text-foreground mt-token-2">Success Stories</h2>
        <p className="text-muted-foreground mt-token-3 max-w-md mx-auto">Real couples who found their match on PureNikah, Alhamdulillah.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-token-6 max-w-5xl mx-auto">
        {stories.map((story, i) => (
          <motion.div key={story.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="rounded-2xl bg-background border border-border p-token-8 shadow-card relative">
            <RiDoubleQuotesL className="absolute top-6 right-6 text-primary/15" style={{ fontSize: "var(--size-icon-xl)" }} />
            <div className="flex gap-token-1 mb-token-4">
              {[...Array(5)].map((_, j) => (<FaStar key={j} className="text-accent" style={{ fontSize: "var(--size-icon)" }} />))}
            </div>
            <p className="text-muted-foreground text-token-sm leading-token-relaxed mb-token-6">"{story.text}"</p>
            <div>
              <p className="font-display font-semibold text-foreground">{story.name}</p>
              <p className="text-token-xs text-muted-foreground">{story.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SuccessStories;
