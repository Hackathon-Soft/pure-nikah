import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PricingSection from "@/components/home/PricingSection";

const Pricing = () => (
  <>
    <Navbar />
    <main className="pt-16">
      <PricingSection />
    </main>
    <Footer />
  </>
);

export default Pricing;
