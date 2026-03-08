import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const PublicLayout = () => (
  <>
    <Navbar />
    <main className="pt-navbar">
      <Outlet />
    </main>
    <Footer />
  </>
);

export default PublicLayout;
