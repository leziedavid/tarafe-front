import BrandLogos from "@/components/home/BrandLogos";
import FashionTrends from "@/components/home/FashionTrends";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import Navigation from "@/components/home/Navigation";
import NewCollection from "@/components/home/NewCollection";
import StyleInspiration from "@/components/home/StyleInspiration";


export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <HeroSection />
      <BrandLogos />
      <FashionTrends />
      <StyleInspiration />
      <NewCollection />
      <Footer />
    </div>
  );
}