"use client";

import AllProduits from "@/components/page/AllProduits";
import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";


export default function Home() {

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <AllProduits />
    </main>
  );
}
