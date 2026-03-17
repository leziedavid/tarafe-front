"use client";

import { useEffect, useState } from "react";
import { Pricing } from "@/types/interfaces";
import { Icon } from "@iconify/react";
import { getImagesUrl } from "@/types/baseUrl";
import ImagePreview from "../shared/ImagePreview";
import Image from "next/image";

interface PricingSectionProps {
    pricing: Pricing[];
    isLoading?: boolean;
}

export default function PricingSection({ pricing = [], isLoading = false }: PricingSectionProps) {
    const [previewOpen, setPreviewOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
    const [initialIndex, setInitialIndex] = useState<number | null>(null);
    const urlImages = getImagesUrl();

    // Filtrer les tarifs actifs
    const activePricing = (pricing || []).filter(p => p.is_active === 1);

    const SkeletonRow = () => (
        <tr className="animate-pulse border-b border-border/50 last:border-0 mt-12 md:mt-0">
            <td className="px-5 py-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-xl"></div>
                    <div className="space-y-2">
                        <div className="h-5 bg-muted rounded-md w-32 md:w-48"></div>
                        <div className="h-3 bg-muted/50 rounded-md w-24 md:w-32"></div>
                    </div>
                </div>
            </td>
            <td className="px-5 py-6 text-center">
                <div className="mx-auto h-6 bg-muted rounded-full w-12"></div>
            </td>
            <td className="px-5 py-6 text-right">
                <div className="ml-auto h-7 bg-muted rounded-xl w-24"></div>
            </td>
        </tr>
    );

    return (

        <section className="py-16 px-5 md:px-15 bg-background mt-12 md:mt-0">
            <div className="max-w-7xl mx-auto">

                {/* Pricing Table Section - Header styled like AllProduits */}
                <div className="mb-10">
                    <h2 className="text-brand-secondary text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight uppercase">
                        Grille Tarifaire
                    </h2>
                    <div className="w-20 h-1 bg-brand-primary mt-4 rounded-full"></div>
                    <p className="text-muted-foreground mt-4 font-medium max-w-2xl text-sm md:text-base">
                        Consultez nos tarifs transparents pour tous vos projets de personnalisation. Chaque création est unique.
                    </p>
                </div>

                <div className="bg-card border border-border rounded-[2rem] shadow-xl shadow-black/5 overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto hide-scrollbar">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-muted/30 border-b border-border">
                                    <th className="px-8 py-5 font-bold text-brand-secondary uppercase tracking-[0.1em] text-[11px]">Produit & Détails</th>
                                    <th className="px-8 py-5 font-bold text-brand-secondary text-center uppercase tracking-[0.1em] text-[11px]">Quantité</th>
                                    <th className="px-8 py-5 font-bold text-brand-secondary text-right uppercase tracking-[0.1em] text-[11px]">Prix Unitaire</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {isLoading ? (
                                    <>
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                        <SkeletonRow />
                                    </>

                                ) : pricing.length > 0 ? (
                                    pricing.map((item) => (
                                        <tr key={item.id} className="hover:bg-brand-primary/5 transition-all duration-300 group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    {item.files && item.files.length > 0 ? (
                                                        <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 cursor-pointer hover:scale-110 active:scale-95 transition-all group/img relative overflow-hidden rounded-2xl bg-white shadow-sm border border-border/50"
                                                            onClick={() => {
                                                                setSelectedFiles(item.files || []);
                                                                setInitialIndex(0);
                                                                setPreviewOpen(true);
                                                            }} >
                                                            <Image src={`${urlImages}/${item.files[0].file_path}`} alt={item.product_name} fill className="object-contain p-2" unoptimized />
                                                            <div className="absolute inset-0 bg-brand-primary/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity backdrop-blur-[2px]">
                                                                <Icon icon="solar:eye-bold" className="w-5 h-5 text-brand-primary" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-muted flex items-center justify-center flex-shrink-0">
                                                            <Icon icon="solar:box-bold-duotone" className="w-8 h-8 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="space-y-1">
                                                        <div className="font-black text-brand-secondary text-base group-hover:text-brand-primary transition-colors">{item.product_name}</div>
                                                        {item.description && <div className="text-xs text-muted-foreground line-clamp-2 max-w-xs">{item.description}</div>}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="inline-flex items-center justify-center min-w-[3rem] px-4 py-1.5 rounded-full text-xs font-black bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="text-lg font-black text-brand-secondary bg-brand-secondary/5 px-4 py-2 rounded-xl inline-block group-hover:bg-brand-primary group-hover:text-white transition-all duration-300">
                                                    {item.unit_price?.toLocaleString()} <span className="text-[10px] ml-1 opacity-70">FCFA</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-8 py-20 text-center text-muted-foreground bg-muted/20 italic">
                                            <div className="flex flex-col items-center gap-4">
                                                <Icon icon="solar:ghost-bold-duotone" width={48} className="opacity-20" />
                                                <p>Aucun tarif disponible pour le moment.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-muted/30 rounded-3xl border border-dashed border-border/50">
                    <div className="flex items-center gap-3 text-xs md:text-sm text-muted-foreground font-medium">
                        <Icon icon="solar:info-circle-bold-duotone" className="text-brand-primary w-5 h-5" />
                        <p>* Les prix peuvent varier selon la complexité et les options. Devis sur mesure disponible.</p>
                    </div>
                    <button className="whitespace-nowrap px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
                        Demander un devis
                    </button>
                </div>
            </div>

            {previewOpen && selectedFiles && (
                <ImagePreview
                    data={selectedFiles}
                    imageKey="file_path"
                    initialIndex={initialIndex}
                    onClose={() => {
                        setPreviewOpen(false);
                        setInitialIndex(null);
                    }}
                />
            )}
        </section>

    );
}
