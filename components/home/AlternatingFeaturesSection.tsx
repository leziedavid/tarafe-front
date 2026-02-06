"use client";

import Image from "next/image";
import CardContainer from "../layout/CardContainer";

export default function AlternatingFeaturesSection() {
    const features = [
        {
            title: "GARDEZ LE CONTRÔLE SUR VOS TRANSACTIONS",
            description: "Suivez vos commandes en temps réel, gérez votre inventaire et accédez à toutes vos données depuis un tableau de bord intuitif. La simplicité au service de votre business.",
            imageSrc: "/ads/fille-noir.jpg",
            imageAlt: "Dashboard Tarafé",
            reverse: false,
        },
        {
            title: "LIBÉREZ DU TEMPS POUR L'ESSENTIEL",
            description: "Automatisez vos processus de gestion, de la commande à la livraison. Concentrez-vous sur ce qui compte vraiment : créer et satisfaire vos clients.",
            imageSrc: "/ads/fille-noir.jpg",
            imageAlt: "Gestion simplifiée",
            reverse: true,
        },
    ];

    return (
        <section className="w-full bg-tarafe-gray">
            <div className="w-full md:max-w-[1400px] md:mx-auto px-0 md:px-6">
                <CardContainer bgColor="white" rounded="tarafe" padding="xl">
                    <div className="space-y-24">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="grid md:grid-cols-2 gap-12 md:gap-16 items-center"
                            >
                                {/* Texte */}
                                <div
                                    className={`space-y-6 ${feature.reverse ? "md:order-2" : "md:order-1"
                                        }`}
                                >
                                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight text-tarafe-black">
                                        {feature.title}
                                    </h2>

                                    <p className="text-base md:text-lg leading-relaxed text-tarafe-black/80">
                                        {feature.description}
                                    </p>

                                    <a
                                        href="#"
                                        className="underline font-semibold inline-flex items-center gap-2 text-tarafe-black hover:gap-4 transition-all duration-300"
                                    >
                                        En savoir plus
                                        <span>→</span>
                                    </a>
                                </div>

                                {/* Image */}
                                <div className={`rounded-xl overflow-hidden  ${feature.reverse ? "md:order-1" : "md:order-2"}`} >
                                    <Image
                                        src={feature.imageSrc}
                                        alt={feature.imageAlt}
                                        width={600}
                                        height={400}
                                        className="w-full h-auto"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContainer>
            </div>
        </section>
    );
}
