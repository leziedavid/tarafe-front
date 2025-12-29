"use client";

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react'; // Assurez-vous d'importer Loader2 depuis lucide-react ou autre package d'icônes

interface Option {
    id_option_reaalisation: number;
    libelleOption_reaalisation: string;
}

interface CategoryFilterProps {
    options: Option[];
    onFilterChange: (categoryId: number | null) => void; // Fonction de filtrage par catégorie
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ options, onFilterChange }) => {

    const [selectedCategory, setSelectedCategory] = useState<number | null>(null); // État pour suivre la catégorie sélectionnée
    const [loading, setLoading] = useState<boolean>(false); // État pour gérer le chargement

    const handleCategoryChange = (categoryId: number | null) => {
        setLoading(true); // Commence le chargement dès qu'une catégorie est sélectionnée
        setSelectedCategory(categoryId); // Mise à jour de la catégorie sélectionnée
        onFilterChange(categoryId); // Appel la fonction pour filtrer par catégorie
        // Simuler un délai de chargement (par exemple, attendre que la nouvelle page soit chargée)
        setTimeout(() => setLoading(false), 500); // Arrêter le chargement après un délai
    };

    return (
        <div className="mb-3">
            <h4 className="text-xl font-bold mb-2">Filtrer par catégorie</h4>
            <div className="flex gap-4 flex-wrap">
                
                <button className={`p-2 rounded-full px-3 text-sm text-center me-3 ${selectedCategory === null ? 'bg-[#242078] text-white' : 'bg-gray-200'}`} onClick={() => handleCategoryChange(null)} >
                    Toutes
                </button>

                {options.map((option) => (
                    <button
                        key={option.id_option_reaalisation}
                        className={`p-2 rounded-full px-3 text-sm text-center me-3 ${selectedCategory === option.id_option_reaalisation ? 'bg-[#242078] text-white' : 'bg-gray-200'}`}
                        onClick={() => handleCategoryChange(option.id_option_reaalisation)}
                    >
                        {selectedCategory === option.id_option_reaalisation && loading ? (
                            <Loader2 className="animate-spin w-5 h-5" />
                        ) : (
                            option.libelleOption_reaalisation
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryFilter;
