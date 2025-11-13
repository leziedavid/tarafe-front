"use client";

import Footer from "@/components/page/Footer";
import Hero from "@/components/page/Hero";
// import Lifestyle from "@/components/page/Lifestyle";
// import Testimonial from "@/components/page/Testimonial";
import MonthlyAd from "@/components/page/MonthlyAd";
import Navbar from "@/components/page/Navbar";
import ProductList from "@/components/page/ProductList";


export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <ProductList />
      <MonthlyAd /> {/* 👈 Pub du mois */}
      <Footer />
{/* 
      <Testimonial />
      <Lifestyle /> */}
    </main>
  );
}
