"use client";

import Footer from "@/components/page/Footer";
import Navbar from "@/components/page/Navbar";
import React, { useState, useEffect } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

export default function Page() {
  const equipeData = [
    {
      "id_equipe": "3",
      "nomPren_equipe": "Inès",
      "fonction_equipe": "Designer graphique",
      "email_equipe": "contact@tarafe.com",
      "photo_equipe": "/ads/tdl.jpg"
    },
    {
      "id_equipe": "2",
      "nomPren_equipe": "Bénédicte",
      "fonction_equipe": "Co-fondatrice / Marketing",
      "email_equipe": "contact@tarafe.com",
      "photo_equipe": "/ads/benedicte.webp"
    },
    {
      "id_equipe": "1",
      "nomPren_equipe": "David",
      "fonction_equipe": "Développeur web mobile",
      "email_equipe": "contact@tarafe.com",
      "photo_equipe": "/ads/tdl.jpg"
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === equipeData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? equipeData.length - 1 : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-12 w-full">
          <div className="flex flex-col lg:flex-row items-stretch gap-12 h-full">
            {/* Left Side - Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight text-gray-900">  A propos de Tarafé  </h1>
                <p className="text-md text-gray-600 mb-8 leading-relaxed">

                  Tarafé est une plateforme digitale de personnalisation des produits mode, accessoires et déco, avec une touche africaine, pour les entreprises et les particuliers. Notre mission est de valoriser les savoir-faire et le patrimoine textile local.
                  <br />
                  Nos services :
                  Personnalisation de produits : Tarafé offre la possibilité de personnaliser divers articles tels que des vêtements, des accessoires et des objets de décoration, en y intégrant des motifs et des designs inspirés de la culture africaine.
                  Solutions pour les entreprises (B2B) : La plateforme propose des services adaptés aux besoins des entreprises, notamment pour des cadeaux d'entreprise personnalisés, du merchandising ou des articles promotionnels reflétant une identité africaine. Bienvenue  😊
                </p>
                
              </div>
            </div>

            {/* Right Side - Carousel avec images en background */}
            <div className="flex-1 flex items-center justify-center">
              <div className="relative w-full h-[600px] max-w-xl rounded-2xl overflow-hidden shadow-2xl">
                {/* Carousel Container */}
                <div className="relative w-full h-full">
                  {/* Slides avec images en background */}
                  <div
                    className="flex transition-transform duration-500 ease-in-out h-full"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {equipeData.map((membre, index) => (
                      <div key={membre.id_equipe} className="w-full h-full flex-shrink-0 relative">
                        {/* Image de fond */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50">
                          {/* Placeholder - Remplacez par vos vraies images */}
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center text-gray-400">
                              <div className="text-6xl mb-4">👤</div>
                              {/* <p>Photo de {membre.nomPren_equipe}</p> */}
                              {/* Décommentez pour utiliser les vraies images */}
                              <Image
                                src={membre.photo_equipe}
                                alt={membre.nomPren_equipe}
                                fill
                                className="object-cover"
                                priority
                              />

                            </div>
                          </div>
                        </div>

                        {/* Overlay avec texte */}
                        <div className="absolute inset-0 bg-black/20 flex items-end">
                          <div className="p-8 text-white w-full bg-gradient-to-t from-black/80 to-transparent">
                            <h3 className="text-3xl font-bold mb-2">{membre.nomPren_equipe}</h3>
                            <p className="text-blue-300 text-xl mb-3">{membre.fonction_equipe}</p>
                            <p className="text-gray-300">{membre.email_equipe}</p>
                          </div>
                        </div>
                      </div>


                      // <div key={membre.id_equipe} className="w-full h-full flex-shrink-0 relative">
                      //   {/* Image de fond avec dimensions fixes */}
                      //   <div className="absolute inset-0">
                      //     <Image
                      //       src={membre.photo_equipe}
                      //       alt={membre.nomPren_equipe}
                      //       fill
                      //       className="object-cover"
                      //       priority={index === 0}
                      //       sizes="100vw"
                      //       quality={90}
                      //       placeholder="blur"
                      //       blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk9SQHL1wj+ob4K6B6h+cnD0pbbEn"
                      //       style={{
                      //         objectFit: 'cover',
                      //         objectPosition: 'center'
                      //       }}
                      //     />
                      //   </div>

                      //   {/* Gradient overlay pour améliorer la lisibilité */}
                      //   <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
                      //     <div className="p-8 text-white w-full">
                      //       <h3 className="text-3xl font-bold mb-2">{membre.nomPren_equipe}</h3>
                      //       <p className="text-blue-300 text-xl mb-3">{membre.fonction_equipe}</p>
                      //       <p className="text-gray-300">{membre.email_equipe}</p>
                      //     </div>
                      //   </div>
                      // </div>

                    ))}
                  </div>

                  {/* Boutons de navigation */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-colors shadow-lg"
                  >
                    <ChevronLeft size={24} className="text-gray-800" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full transition-colors shadow-lg"
                  >
                    <ChevronRight size={24} className="text-gray-800" />
                  </button>

                  {/* Indicateurs de slide */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {equipeData.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                          }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer reglages={[]} />
    </main>
  );
}