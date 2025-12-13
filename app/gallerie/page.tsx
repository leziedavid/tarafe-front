"use client";

import Footer from "@/components/page/Footer";
import HomeGallerie from "@/components/page/HomeGallerie";
import Navbar from "@/components/page/Navbar";


export default function Home() {

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <HomeGallerie />
      <Footer reglages={[]} />
    </main>
  );
}
