import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import HowItWorks from "@/components/home/HowItWorks";
import IslamicValues from "@/components/home/IslamicValues";
import SuccessStories from "@/components/home/SuccessStories";
import PricingSection from "@/components/home/PricingSection";
import FAQSection from "@/components/home/FAQSection";
import CTASection from "@/components/home/CTASection";

const Index = () => (
  <>
    <Navbar />
    <main>
      <HeroSection />
      <HowItWorks />
      <IslamicValues />
      <SuccessStories />
      <PricingSection />
      <FAQSection />
      <CTASection />
    </main>
    <Footer />
  </>
);

export default Index;
