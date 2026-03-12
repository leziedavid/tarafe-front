"use client";

import Image from "next/image";
import { Icon } from "@iconify/react";
import { Reglage } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { ReactNode } from "react";

interface reglagesProps {
    reglages: Reglage[];
}


interface Contact {
    email: string;
    phone: string;
}

interface Item {
    label: string;
    href: string;
    icon: string;
}

interface Services {
    title: string;
    items: Item[];
}

interface IconItem {
    href: string;
    src: string;
    alt: string;
}

const Footer = ({ reglages }: reglagesProps) => {
    const isLoading = !reglages || reglages.length === 0; // Si pas de données, afficher le skeleton

    const photoUrl = reglages[0]?.logo_footer ?? 'Logos/Logo_blanc.png';
    const urlImages = getImagesUrl();



    const icons: IconItem[] = [
        {
            href: reglages[0]?.lienFacebbook_reglages ?? "#",
            src: "/logos/facebook.svg",
            alt: "Facebook"
        },
        {
            href: reglages[0]?.lienInstagram_reglages ?? "#",
            src: "/logos/instagram.svg",
            alt: "Instagram"
        },
        {
            href: reglages[0]?.lienLikedin_reglages ?? "#",
            src: "/logos/linkedin.svg",
            alt: "LinkedIn"
        },
        {
            href: reglages[0]?.liensYoutub_reglages ?? "#",
            src: "/logos/youtube.svg",
            alt: "YouTube"
        }
    ];

    const contact: Contact = {
        email: reglages[0]?.email_reglages ?? "",
        phone: reglages[0]?.phone1_reglages ?? "",
    };
    const services: Services = {
        title: "Services",
        items: [
            {
                label: "Personnalisation de vêtements",
                href: "#",
                icon: "solar:t-shirt-bold"
            },
            {
                label: "Accessoires personnalisés",
                href: "#",
                icon: "solar:watch-square-bold"
            },
            {
                label: "Solutions pour entreprises (B2B)",
                href: "#",
                icon: "solar:buildings-bold"
            },
            {
                label: "Pack cadeaux personnalisés",
                href: "#",
                icon: "solar:gift-bold"
            },
            {
                label: "Design & impression sur mesure",
                href: "#",
                icon: "solar:palette-bold"
            }
        ],
    };

    const handleClick = async (publicId: string) => {
        const url = `${publicId}`;
        window.open(url, '_blank');
    };

    // === Rendu Skeleton ===
    if (isLoading) {
        return (
            <footer className="w-full bg-[#242078] dark:bg-background/80 backdrop-blur-lg text-white py-16 md:py-24 bootom-0 transition-colors duration-500 border-t border-white/5">
                <div className="container mx-auto px-6 md:px-10 animate-pulse">
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                        {/* Colonne gauche */}
                        <div className="flex flex-col gap-4">
                            <div className="w-44 h-10 bg-gray-700 rounded"></div>
                            <div className="h-4 bg-gray-600 rounded max-w-lg"></div>
                            <div className="h-4 bg-gray-600 rounded max-w-md"></div>
                            <div className="h-4 bg-gray-600 rounded max-w-sm"></div>
                        </div>

                        {/* Colonnes de droite */}
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                            {[...Array(3)].map((_, idx) => (
                                <div key={idx} className="flex flex-col gap-2">
                                    <div className="h-5 w-24 bg-gray-700 rounded mb-2"></div>
                                    <ul className="space-y-2">
                                        {[...Array(3)].map((_, i) => (
                                            <li key={i}>
                                                <div className="h-3 bg-gray-600 rounded w-20 sm:w-24 md:w-32"></div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-white/20 mt-10 pt-4 text-center text-xs sm:text-sm text-white/70">
                        <div className="h-3 bg-gray-600 rounded mx-auto w-40"></div>
                    </div>
                </div>
            </footer>
        );
    }

    // === Rendu normal ===

    return (
        <footer className="w-full bg-[#242078] dark:bg-background/80 backdrop-blur-lg text-white py-16 md:py-24 transition-colors duration-500 border-t border-white/5">
            <div className="container mx-auto px-6 md:px-10">
                {/* Structure en 3 colonnes avec plus d'espace pour la première */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

                    {/* Première colonne - Logo et description (prend plus d'espace) */}
                    <div className="lg:col-span-6 flex flex-col gap-4">
                        <Image src={`${urlImages}/${photoUrl}`} alt="Tarafé Logo" width={180} height={40} className="object-contain" priority unoptimized />
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/80 max-w-2xl">
                            {reglages[0]?.desc_footer}
                        </p>
                    </div>

                    {/* Deuxième colonne - Services */}
                    <div className="lg:col-span-3 flex flex-col gap-2">
                        <h3 className="text-lg md:text-4xl font-semibold mb-2">{services.title}</h3>
                        <ul className="space-y-2">
                            {services.items.map((item, index) => (
                                <li key={index}>
                                    <div onClick={() => handleClick(item.href)} className="flex items-center space-x-2 text-sm md:text-base text-white/75 hover:text-[#fd980e] transition-colors duration-200 cursor-pointer group" >
                                        <Icon icon={item.icon} className="w-4 h-4 text-gray-400 group-hover:text-[#fd980e] transition-colors" />
                                        <span>{item.label}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Troisième colonne - Réseaux sociaux */}
                    <div className="lg:col-span-3 flex flex-col gap-2">
                        <h3 className="text-lg md:text-4xl font-semibold mb-2 whitespace-nowrap">
                            Suivez-nous
                        </h3>                        <div className="flex flex-wrap gap-2">
                            {icons.map((item, index) => (
                                <button key={index} onClick={() => handleClick(item.href)} className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-white/10 hover:bg-[#fd980e] transition-all duration-300 flex items-center justify-center group"  >
                                    <Image src={item.src} alt={item.alt} width={20} height={20} className="object-contain opacity-80 group-hover:opacity-100" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="border-t border-white/20 mt-12 pt-6 text-center text-xs sm:text-sm text-white/70">
                    © {new Date().getFullYear()} Tarafé — Tous droits réservés.
                </div>
            </div>
        </footer>
    );

};

export default Footer;
