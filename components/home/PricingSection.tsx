"use client";

import { Pricing } from "@/types/interfaces";

interface PricingSectionProps {
    pricing: Pricing[];
    isLoading?: boolean;
}

export default function PricingSection({ pricing, isLoading = false }: PricingSectionProps) {
    // Filtrer les tarifs actifs
    const activePricing = pricing.filter(p => p.is_active === 1);

    const SkeletonRow = () => (
        <tr className="animate-pulse border-b border-gray-100 last:border-0">
            <td className="px-5 py-4">
                <div className="h-5 bg-gray-100 rounded-md w-48 mb-1.5"></div>
                <div className="h-3 bg-gray-50 rounded-md w-32"></div>
            </td>
            <td className="px-5 py-4 text-center">
                <div className="mx-auto h-6 bg-gray-100 rounded-full w-12"></div>
            </td>
            <td className="px-5 py-4 text-right">
                <div className="ml-auto h-6 bg-gray-100 rounded-md w-20"></div>
            </td>
        </tr>
    );

    return (

        <section className="py-12 px-4 md:px-8 bg-white dark:bg-gray-950">
            <div className="max-w-5xl mx-auto">

                {/* <pre>{JSON.stringify(activePricing, null, 2)}</pre> */}

                {/* Pricing Table Section - Compact Header */}
                <div className="mb-8">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase mb-6 text-brand-secondary leading-tight">
                        Grille Tarifaire
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                        Tarifs transparents pour nos services de personnalisation
                    </p>
                </div>

                <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden glass-morphism">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50/80 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white uppercase tracking-wider text-[11px]">Produit</th>
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white text-center uppercase tracking-wider text-[11px]">Quantité</th>
                                    <th className="px-5 py-3 font-semibold text-gray-900 dark:text-white text-right uppercase tracking-wider text-[11px]">Prix Unitaire</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
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
                                        <tr key={item.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-900/20 transition-colors group">
                                            <td className="px-5 py-4">
                                                <div className="font-bold text-gray-900 dark:text-white">{item.product_name}</div>
                                                {item.description && <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">{item.description}</div>}
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                                                    {item.quantity}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <div className="text-base font-bold text-[#242078] dark:text-[#4a45b1]">
                                                    {item.unit_price} XOF
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-5 py-12 text-center text-gray-400 bg-gray-50/30 dark:bg-gray-900/10 italic">
                                            Aucun tarif disponible pour le moment.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[11px] text-gray-400 dark:text-gray-500 italic">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-primary2/30"></div>
                    * Les prix peuvent varier selon la complexité et les options.
                    <span className="hidden sm:inline">Contactez-nous pour un devis personnalisé.</span>
                </div>
            </div>
        </section>

    );
}
