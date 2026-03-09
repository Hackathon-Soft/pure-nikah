import { useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";

const stories = [
  { name: "Ahmed & Fatima", location: "London, UK", text: "Alhamdulillah, we found each other on PureNikah. The halal environment gave us both peace of mind. We've been married for 2 years now!" },
  { name: "Yusuf & Aisha", location: "Toronto, Canada", text: "The wali system was a game-changer for my family. My father was able to be part of the process, which made everything so comfortable." },
  { name: "Omar & Khadija", location: "Dubai, UAE", text: "What sets PureNikah apart is the focus on genuine intentions. Every profile is verified and the community is sincere. MashaAllah!" },
  { name: "Ibrahim & Maryam", location: "Karachi, Pakistan", text: "I had almost given up hope, but Alhamdulillah PureNikah connected me with the most amazing person. We got married within 3 months!" },
  { name: "Bilal & Zainab", location: "Birmingham, UK", text: "The Islamic values embedded in the platform made us both comfortable. Our families were involved from day one. Truly a blessed experience." },
];

const SuccessStories = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Auto-play every 4 seconds
  useEffect(() => {
    if (!emblaApi) return;
    const interval = setInterval(() => emblaApi.scrollNext(), 4000);
    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <section className="section-padding bg-card">
      <div className="app-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="section-header"
        >
          <span className="section-label">Testimonials</span>
          <h2 className="section-title">Success Stories</h2>
          <p className="section-subtitle">Real couples who found their match on PureNikah, Alhamdulillah.</p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Carousel */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {stories.map((story) => (
                <div
                  key={story.name}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
                >
                  <div className="rounded-2xl bg-background border border-border p-token-8 shadow-card relative h-full">
                    <RiDoubleQuotesL
                      className="absolute top-6 right-6 text-primary/15"
                      style={{ fontSize: "var(--size-icon-xl)" }}
                    />
                    <div className="flex gap-token-1 mb-token-4">
                      {[...Array(5)].map((_, j) => (
                        <FaStar key={j} className="text-accent" style={{ fontSize: "var(--size-icon)" }} />
                      ))}
                    </div>
                    <p className="text-muted-foreground text-token-sm leading-token-relaxed mb-token-6">
                      "{story.text}"
                    </p>
                    <div>
                      <p className="font-display font-semibold text-foreground">{story.name}</p>
                      <p className="text-token-xs text-muted-foreground">{story.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={scrollPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-background border border-border shadow-card flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10"
            aria-label="Previous"
          >
            <FiChevronLeft style={{ fontSize: "var(--size-icon)" }} />
          </button>
          <button
            onClick={scrollNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-background border border-border shadow-card flex items-center justify-center text-foreground hover:bg-muted transition-colors z-10"
            aria-label="Next"
          >
            <FiChevronRight style={{ fontSize: "var(--size-icon)" }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
