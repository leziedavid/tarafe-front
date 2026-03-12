"use client";

import Footer from "@/components/page/Footer";
import HomeGallerie from "@/components/page/HomeGallerie";
import Navbar from "@/components/page/Navbar";


export default function Home() {

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />
      <HomeGallerie />
    </main>
  );
}
