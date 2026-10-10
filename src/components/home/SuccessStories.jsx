import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import { RiDoubleQuotesL } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useEmblaCarousel from "embla-carousel-react";

const staticStories = [
  { couple_names: "Ahmed & Fatima", location: "London, UK", review: "Alhamdulillah, we found each other on PureNikah. The halal environment gave us both peace of mind. We've been married for 2 years now!", rating: 5 },
  { couple_names: "Yusuf & Aisha", location: "Toronto, Canada", review: "The wali system was a game-changer for my family. My father was able to be part of the process, which made everything so comfortable.", rating: 5 },
  { couple_names: "Omar & Khadija", location: "Dubai, UAE", review: "What sets PureNikah apart is the focus on genuine intentions. Every profile is verified and the community is sincere. MashaAllah!", rating: 5 },
  { couple_names: "Ibrahim & Maryam", location: "Karachi, Pakistan", review: "I had almost given up hope, but Alhamdulillah PureNikah connected me with the most amazing person. We got married within 3 months!", rating: 5 },
  { couple_names: "Bilal & Zainab", location: "Birmingham, UK", review: "The Islamic values embedded in the platform made us both comfortable. Our families were involved from day one. Truly a blessed experience.", rating: 5 },
];

const SuccessStories = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });

  const { data: dbStories } = useQuery({
    queryKey: ["success-stories-public"],
    queryFn: async () => {
      const { data } = await supabase
        .from("success_stories")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      return data || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const stories = (dbStories && dbStories.length > 0) ? dbStories : staticStories;

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

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
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {stories.map((story, index) => (
                <div
                  key={story.id || `static-${index}`}
                  className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-3"
                >
                  <div className="card-testimonial">
                    <RiDoubleQuotesL
                      className="absolute top-6 right-6 text-primary/15"
                      style={{ fontSize: "var(--size-icon-xl)" }}
                    />
                    <div className="flex gap-token-1 mb-token-4">
                      {[...Array(story.rating || 5)].map((_, j) => (
                        <FaStar key={j} className="text-accent" style={{ fontSize: "var(--size-icon)" }} />
                      ))}
                    </div>
                    <p className="text-body-muted mb-token-6">"{story.review}"</p>
                    <div>
                      <p className="font-display font-semibold text-foreground">{story.couple_names}</p>
                      <p className="text-body-muted-xs">{story.location || "—"}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={scrollPrev} className="carousel-nav-prev" aria-label="Previous success story">
            <FiChevronLeft style={{ fontSize: "var(--size-icon)" }} />
          </button>
          <button onClick={scrollNext} className="carousel-nav-next" aria-label="Next success story">
            <FiChevronRight style={{ fontSize: "var(--size-icon)" }} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
