"use client";

import ContactForm from "@/components/form/ContactForm";
import Footer from "@/components/page/Footer";
import Hero from "@/components/page/Hero";
import MonthlyAd from "@/components/page/MonthlyAd";
import Navbar from "@/components/page/Navbar";
import ProductList from "@/components/page/ProductList";
import { getAllRealisations } from "@/service/realisationServices";
import { ApiResponse } from "@/types/interfaces";
import { useEffect, useState } from "react";


export default function Home() {

  const [response, setResponse] = useState<ApiResponse | null>(null);

  const getAllRealisation = async () => {
    const response = await getAllRealisations();
    if (response.statusCode === 200 && response.data) {
      setResponse(response.data); // 👈 DONNE DIRECTEMENT ApiResponse
    }
  };


  useEffect(() => {
    getAllRealisation();
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      {/* <CanvaClone /> */}
      <ProductList products={response?.realisations ?? []} />
      <MonthlyAd /> {/* 👈 Pub du mois */}
      <ContactForm />
      <Footer reglages={response?.reglages ?? []} />
      {/*
      <Testimonial />
      <Lifestyle /> */}
    </main>
  );
}
