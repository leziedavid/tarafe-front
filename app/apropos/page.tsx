"use client";

import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";
import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Equipe, Reglage } from "@/types/interfaces";
import { getAllEquipe } from "@/service/security";
import { getImagesUrl } from "@/types/baseUrl";

export default function Page() {
  const [equipeData, setEquipeData] = useState<Equipe[]>([]);
  const [reglages, setReglages] = useState<Reglage[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const urlImages = getImagesUrl();

  useEffect(() => {
    getAllEquipe().then((res) => {
      if (res.data) {
        setEquipeData(res.data.equipes || []);
        if (res.data.reglages) {
          setReglages(res.data.reglages);
        }
      }
      setLoading(false);
    }).catch(err => {
      console.error("Erreur lors de la récupération de l'équipe:", err);
      setLoading(false);
    });
  }, []);

  const nextSlide = () => {
    if (equipeData.length === 0) return;
    setCurrentSlide((prev) => (prev === equipeData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    if (equipeData.length === 0) return;
    setCurrentSlide((prev) => (prev === 0 ? equipeData.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (equipeData.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [equipeData.length]);

  // Helper function for images
  const getFullImageUrl = (path: string | null | undefined) => {
    if (!path) return '/ads/tdl.jpg';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${urlImages}${cleanPath}`;
  };

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-500">
      <Navbar />

      <section className="relative mt-20 md:mt-24 pb-20 overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-secondary/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start gap-16">
            {/* Left Side - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand font-medium text-sm">
                <Icon icon="solar:star-fall-2-bold-duotone" className="text-lg" />
                <span>{reglages[0]?.entreprise_reglages || "Notre Histoire"}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-secondary leading-[1.1]">
                {reglages[0]?.texteHeader2 || "À propos de Tarafé"}
              </h1>

              {loading ? (
                <div className="space-y-4">
                  <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-4 bg-muted animate-pulse rounded w-1/2" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </div>
              ) : (
                <div
                  className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: reglages[0]?.description_reglages || "" }}
                />
              )}


            </motion.div>

            {/* Right Side - Slider */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 w-full lg:sticky lg:top-32"
            >
              <div className="relative group aspect-[4/5] md:aspect-square lg:aspect-[4/5] max-w-lg mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl bg-muted ring-1 ring-white/10">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                    <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Chargement de l'équipe...</p>
                  </div>
                ) : equipeData.length > 0 ? (
                  <>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                      >
                        <Image
                          src={getFullImageUrl(equipeData[currentSlide].photo_equipe)}
                          alt={equipeData[currentSlide].nomPren_equipe || 'Membre Tarafé'}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 space-y-2">
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <h3 className="text-3xl md:text-4xl font-black text-white">{equipeData[currentSlide].nomPren_equipe}</h3>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="w-8 h-[2px] bg-white" />
                              <p className="text-white font-bold uppercase tracking-widest text-sm">{equipeData[currentSlide].fonction_equipe}</p>
                            </div>
                            {equipeData[currentSlide].email_equipe && (
                              <p className="text-white mt-4 flex items-center gap-2 text-sm">
                                <Icon icon="solar:letter-linear" />
                                {equipeData[currentSlide].email_equipe}
                              </p>
                            )}
                          </motion.div>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg">
                        <Icon icon="solar:alt-arrow-left-linear" className="text-2xl" />
                      </button>
                      <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-lg">
                        <Icon icon="solar:alt-arrow-right-linear" className="text-2xl" />
                      </button>
                    </div>

                    {/* Progress Indicators */}
                    <div className="absolute top-8 right-8 flex flex-col gap-2">
                      {equipeData.map((_, index) => (
                        <button key={index} onClick={() => setCurrentSlide(index)} className={`w-1.5 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-brand h-10' : 'bg-white/30 h-6'}`} />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                    <p className="text-muted-foreground">Aucun membre d'équipe trouvé.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer reglages={reglages} />
    </main>
  );
}