"use client";

import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, Phone, Twitter, Youtube } from "lucide-react";
import { Reglage } from "@/types/interfaces";
import { getImagesUrl } from "@/types/baseUrl";
import { ReactNode } from "react";

interface reglagesProps {
    reglages: Reglage[];
}

interface IconItem {
    label: string;
    href: string;
    icon: ReactNode;
}

interface Contact {
    email: string;
    phone: string;
}

interface Item {
    label: string;
    href: string;
}

interface Services {
    title: string;
    items: Item[];
}

const Footer = ({ reglages }: reglagesProps) => {
    const isLoading = !reglages || reglages.length === 0; // Si pas de données, afficher le skeleton

    const photoUrl = reglages[0]?.logo_footer ?? 'Logos/Logo_blanc.png';
    const urlImages = getImagesUrl();

    // Icônes
    const icons: IconItem[] = [
        { label: "Facebook", href: reglages[0]?.lienFacebbook_reglages ?? "#", icon: <Facebook className="w-5 h-5 text-gray-300 hover:text-[#fd980e] transition-colors" /> },
        { label: "Instagram", href: reglages[0]?.lienInstagram_reglages ?? "#", icon: <Instagram className="w-5 h-5 text-gray-300 hover:text-[#fd980e] transition-colors" /> },
        { label: "Linkedin", href: reglages[0]?.lienLikedin_reglages ?? "#", icon: <Linkedin className="w-5 h-5 text-gray-300 hover:text-[#fd980e] transition-colors" /> },
        { label: "Youtube", href: reglages[0]?.liensYoutub_reglages ?? "#", icon: <Youtube className="w-5 h-5 text-gray-300 hover:text-[#fd980e] transition-colors" /> },
    ];

    const contact: Contact = {
        email: reglages[0]?.email_reglages ?? "",
        phone: reglages[0]?.phone1_reglages ?? "",
    };

    const services: Services = {
        title: "Services",
        items: [
            { label: "Personnalisation de produits", href: "#" },
            { label: "Solutions pour les entreprises (B2B)", href: "#" },
        ],
    };

    const handleClick = async (publicId: string) => {
        const url = `${publicId}`;
        window.open(url, '_blank');
    };

    // === Rendu Skeleton ===
    if (isLoading) {
        return (
            <footer className="w-full bg-[#242078] text-background py-16 md:py-24 bootom-0">
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
        <footer className="w-full bg-[#242078] text-background py-16 md:py-24 bootom-0">
            <div className="container mx-auto px-6 md:px-10">
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-start">
                    <div className="flex flex-col gap-4">
                        <Image src={`${urlImages}/${photoUrl}`} alt="Tarafé Logo" width={180} height={40} className="object-contain" priority unoptimized />
                        <p className="text-sm sm:text-base md:text-lg leading-relaxed text-background/80 max-w-lg"> {reglages[0]?.desc_footer} </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg md:text-xl font-semibold mb-2">{services.title}</h3>
                            <ul className="space-y-2">
                                {services.items.map((item, index) => (
                                    <li key={index}>
                                        <div onClick={() => handleClick(item.href)} className="flex items-center space-x-2 text-sm md:text-base text-white/75 hover:text-[#fd980e] transition-colors duration-200" >
                                            <span>{item.label}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Contactez nous</h3>
                            <ul className="space-y-2">
                                {contact.email && <li><a href={`mailto:${contact.email}`} className="flex items-center space-x-2 text-sm md:text-base text-white/75 hover:text-[#fd980e] transition-colors duration-200" >
                                    <Mail className="w-5 h-5 text-gray-300 hover:text-[#fd980e] transition-colors" /> <span>{contact.email}</span></a></li>}
                                {contact.phone && <li><a href={`tel:${contact.phone}`} className="flex items-center space-x-2 text-sm md:text-base text-white/75 hover:text-[#fd980e] transition-colors duration-200" >
                                    <Phone className="w-3 h-3 text-gray-300 hover:text-[#fd980e] transition-colors" /> <span>{contact.phone}</span></a></li>}
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h3 className="text-lg md:text-xl font-semibold mb-2">Suivez-nous sur</h3>
                            <ul className="space-y-2">
                                {icons.map((item, index) => (
                                    <li key={index}>
                                        <div onClick={() => handleClick(item.href)} className="flex items-center space-x-2 text-sm md:text-base text-white/75 hover:text-[#fd980e] transition-colors duration-200 cursor-pointer" >
                                            {item.icon && item.icon}
                                            <span>{item.label}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/20 mt-10 pt-4 text-center text-xs sm:text-sm text-white/70">
                    © {new Date().getFullYear()} Tarafé — Tous droits réservés.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
