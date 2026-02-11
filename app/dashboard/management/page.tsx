"use client";

import { useState, useEffect } from "react";
// Interfaces
import { Hero, ServiceCard, Feature, FinalCTA } from "@/types/interfaces";
import HeroManagement from "@/components/managemen/HeroManagement";
import ServiceCardManagement from "@/components/managemen/ServiceCardManagement";
import FeatureManagement from "@/components/managemen/FeatureManagement";
import FinalCTAManagement from "@/components/managemen/FinalCTAManagement";
import AdminLayout from "@/components/dashboard/AdminLayout/AdminLayout";
// Composants spécifiques pour chaque section

// Définition du type global des sections
interface HomePageSections {
    heros: Hero[];
    service_cards: ServiceCard[];
    features: Feature[];
    final_ctas: FinalCTA[];
}

export default function ManagementPage() {
    const [activeTab, setActiveTab] = useState<keyof HomePageSections>("heros");
    const [sections, setSections] = useState<HomePageSections>({
        heros: [],
        service_cards: [],
        features: [],
        final_ctas: [],
    });
    const [loading, setLoading] = useState(true);

    // Récupération des données via fetch
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/homepage");
                const data = await res.json();

                // Assurer que la réponse correspond au type HomePageSections
                setSections({
                    heros: data.HomePageSections.heros || [],
                    service_cards: data.HomePageSections.service_cards || [],
                    features: data.HomePageSections.features || [],
                    final_ctas: data.HomePageSections.final_ctas || [],
                });
            } catch (error) {
                // console.error("Erreur lors de la récupération des sections :", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-6 text-center">Chargement...</div>;

    const tabs: { key: keyof HomePageSections; label: string }[] = [
        { key: "heros", label: "Héros" },
        { key: "service_cards", label: "Service" },
        { key: "features", label: "Caractéristiques" },
        { key: "final_ctas", label: "Final CTAs" },
    ];

    return (

        <AdminLayout>

            <div className="p-3 md:p-6">
                <h1 className="text-3xl font-bold mb-6">Gestion de la Page d'accueil</h1>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 flex-wrap">
                    {tabs.map((tab) => (
                        <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-6 py-1.5 rounded-lg font-semibold transition-all duration-300 ${activeTab === tab.key ? "bg-brand-primary2 text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-200"} `} >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Contenu du tab actif */}
                <div className="bg-white p-6">
                    {activeTab === "heros" && <HeroManagement/>}
                    {activeTab === "service_cards" && <ServiceCardManagement />}
                    {activeTab === "features" && <FeatureManagement />}
                    {activeTab === "final_ctas" && <FinalCTAManagement />}
                </div>
            </div>

        </AdminLayout>
    );
}
