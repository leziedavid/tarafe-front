"use client";

import AllProduits from "@/components/page/AllProduits";
import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";


export default function Home() {

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      <AllProduits />
    </main>
  );
}
