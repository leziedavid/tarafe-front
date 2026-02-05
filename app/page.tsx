"use client";

import { useEffect, useState } from "react";
import { ApiResponse } from "@/types/interfaces";
import { getAllRealisations } from "@/service/realisationServices";

// Composants existants
import Navbar from "@/components/page/Navbar";
import Footer from "@/components/page/Footer";

// Nouvelles sections Julaya
import ProductCardsSection from "@/components/home/ProductCardsSection";
import AlternatingFeaturesSection from "@/components/home/AlternatingFeaturesSection";
import FinalCTASection from "@/components/home/FinalCTASection";
import ContactForm from "@/components/form/ContactForm";
import CollectionsSection from "@/components/home/ProductList";
import Heros from "@/components/home/Heros";

export default function Home() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const getAllRealisation = async () => {
    const response = await getAllRealisations();
    if (response.statusCode === 200 && response.data) {
      setResponse(response.data);
    }
  };

  useEffect(() => {
    getAllRealisation();
  }, []);

  return (
    <main className="min-h-screen bg-julaya-gray text-gray-900">
      <Navbar />
      <Heros />
      <ProductCardsSection />
      <AlternatingFeaturesSection />
      <CollectionsSection product={response?.realisations ?? []} />
      <ContactForm />
      <FinalCTASection />
      <Footer reglages={response?.reglages ?? []} />
    </main>
  );
}
