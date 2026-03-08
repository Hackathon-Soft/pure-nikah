import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const stories = [
  {
    name: "Ahmed & Fatima",
    location: "London, UK",
    text: "Alhamdulillah, we found each other on PureNikah. The halal environment gave us both peace of mind. We've been married for 2 years now!",
  },
  {
    name: "Yusuf & Aisha",
    location: "Toronto, Canada",
    text: "The wali system was a game-changer for my family. My father was able to be part of the process, which made everything so comfortable.",
  },
  {
    name: "Omar & Khadija",
    location: "Dubai, UAE",
    text: "What sets PureNikah apart is the focus on genuine intentions. Every profile is verified and the community is sincere. MashaAllah!",
  },
];

const SuccessStories = () => (
  <section className="py-20 bg-card">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm font-semibold text-accent uppercase tracking-wider">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-2">
          Success Stories
        </h2>
        <p className="text-muted-foreground mt-3 max-w-md mx-auto">
          Real couples who found their match on PureNikah, Alhamdulillah.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {stories.map((story, i) => (
          <motion.div
            key={story.name}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="rounded-2xl bg-background border border-border p-8 shadow-card relative"
          >
            <Quote className="h-8 w-8 text-primary/15 absolute top-6 right-6" />
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-4 w-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              "{story.text}"
            </p>
            <div>
              <p className="font-display font-semibold text-foreground">{story.name}</p>
              <p className="text-xs text-muted-foreground">{story.location}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SuccessStories;
