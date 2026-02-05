"use client";

import Image from "next/image";

export default function ServicesGridSection() {
    const services = [
        {
            title: "PERSONNALISATION",
            description:
                "Broderie, sérigraphie, et impression numérique sur tous types de textiles.",
            iconBg: "tarafe-lavender",
            icon: "/icons/customize.svg",
        },
        {
            title: "LIVRAISON RAPIDE",
            description:
                "Livraison express dans toute la Côte d'Ivoire et expédition internationale.",
            iconBg: "tarafe-mint",
            icon: "/icons/delivery.svg",
        },
        {
            title: "SUPPORT 24/7",
            description:
                "Une équipe dédiée à votre écoute pour vous accompagner à chaque étape.",
            iconBg: "tarafe-peach",
            icon: "/icons/support.svg",
        },
    ];

    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 flex flex-col transition-all duration-300" >
                            <h3 className="text-2xl md:text-3xl font-black uppercase mb-4 text-tarafe-black">
                                {service.title}
                            </h3>

                            <p className="text-base leading-relaxed mb-6 flex-1 text-tarafe-black/70">
                                {service.description}
                            </p>

                            {/* Zone icône en bas */}
                            <div className={`bg-${service.iconBg} rounded-2xl p-6 mt-auto flex items-center justify-center`}>
                                <div className="w-16 h-16 bg-tarafe-black/10 rounded-full flex items-center justify-center">
                                    <span className="text-3xl">✨</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
