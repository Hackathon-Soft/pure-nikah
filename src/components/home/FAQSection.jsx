import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  { q: "Is PureNikah only for Muslims?", a: "Yes, PureNikah is exclusively designed for Muslims seeking a halal marriage partner. We verify the faith of all members." },
  { q: "How does the privacy system work?", a: "Your photos remain blurred until you approve access. You control who sees your profile, and you can hide your profile at any time." },
  { q: "Can my wali/guardian be involved?", a: "Absolutely. We offer an optional wali system where your guardian can oversee conversations and approve matches." },
  { q: "How are profiles verified?", a: "We use multi-step verification including ID verification, phone number, and optional community references to ensure genuine profiles." },
  { q: "Is messaging supervised?", a: "Yes, our halal communication system includes moderation options and optional wali visibility into conversations." },
  { q: "Can I cancel my subscription anytime?", a: "Yes, you can cancel anytime. You'll retain premium access until the end of your billing period." },
];

const FAQSection = () => (
  <section className="section-padding">
    <div className="app-container max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="section-header">
        <span className="section-label">FAQ</span>
        <h2 className="section-title">Frequently Asked Questions</h2>
      </motion.div>
      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="card-base px-token-6">
            <AccordionTrigger className="text-left font-display font-semibold text-foreground hover:no-underline">{faq.q}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-token-relaxed">{faq.a}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;
