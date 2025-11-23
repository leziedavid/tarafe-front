"use client";

// import CanvaClone from "@/components/form/CanvaClone";
import ContactForm from "@/components/form/ContactForm";
import Footer from "@/components/page/Footer";
import Hero from "@/components/page/Hero";
import MonthlyAd from "@/components/page/MonthlyAd";
import Navbar from "@/components/page/Navbar";
import ProductList from "@/components/page/ProductList";


export default function Home() {

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      {/* <CanvaClone /> */}
      <ProductList />
      <MonthlyAd /> {/* 👈 Pub du mois */}
      <ContactForm />
      <Footer />
{/* 
      <Testimonial />
      <Lifestyle /> */}
    </main>
  );
}
