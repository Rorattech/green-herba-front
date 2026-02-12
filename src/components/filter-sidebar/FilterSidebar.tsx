"use client";

import { Star } from "lucide-react";
import { FilterAccordion } from "../ui/FilterAccordion";
import { FilterCheckbox } from "../ui/FilterCheckbox";
import { ProductFilters } from "@/src/hooks/useProductFilters";
import { useState, useEffect } from "react";

interface FilterSidebarProps {
    availableCategories: string[];
    priceRange: { min: number; max: number };
    isMobile?: boolean;
    tempFilters: ProductFilters;
    setTempFilters: (filters: ProductFilters) => void;
}

export const FilterSidebar = ({ 
    availableCategories, 
    priceRange, 
    isMobile = false,
    tempFilters,
    setTempFilters
}: FilterSidebarProps) => {
    const [localMinPrice, setLocalMinPrice] = useState(tempFilters.minPrice?.toString() || '');
    const [localMaxPrice, setLocalMaxPrice] = useState(tempFilters.maxPrice?.toString() || '');

    // Sincronizar estado local quando filtros mudarem
    useEffect(() => {
        setLocalMinPrice(tempFilters.minPrice?.toString() || '');
        setLocalMaxPrice(tempFilters.maxPrice?.toString() || '');
    }, [tempFilters.minPrice, tempFilters.maxPrice]);

    const handleToggleCategory = (category: string) => {
        const newCategories = tempFilters.categories.includes(category)
            ? tempFilters.categories.filter((c) => c !== category)
            : [...tempFilters.categories, category];
        setTempFilters({ ...tempFilters, categories: newCategories });
    };

    const handleSetMinRating = (rating: number) => {
        // Se já está selecionado, deseleciona. Senão, seleciona o novo rating
        const newRating = tempFilters.minRating === rating ? null : rating;
        // Forçar atualização criando um novo objeto
        setTempFilters({
            ...tempFilters,
            minRating: newRating
        });
    };

    const handlePriceChange = () => {
        const min = localMinPrice ? parseFloat(localMinPrice) : null;
        const max = localMaxPrice ? parseFloat(localMaxPrice) : null;
        setTempFilters({ ...tempFilters, minPrice: min, maxPrice: max });
    };

    return (
        <div className="flex flex-col w-full gap-6">
            {availableCategories.length > 0 && (
                <FilterAccordion title="Categorias" defaultOpen>
                    {availableCategories.map((category) => (
                        <FilterCheckbox
                            key={category}
                            id={`category-${category}`}
                            label={category}
                            checked={tempFilters.categories.includes(category)}
                            onChange={() => handleToggleCategory(category)}
                        />
                    ))}
                </FilterAccordion>
            )}

            <FilterAccordion title="Avaliação">
                {[4, 3, 2, 1].map((stars) => {
                    const isChecked = tempFilters.minRating === stars;
                    return (
                        <FilterCheckbox
                            variant="radio"
                            name="rating"
                            key={`rating-${stars}-${tempFilters.minRating}`}
                            id={`rating-${stars}`}
                            checked={isChecked}
                            onChange={() => handleSetMinRating(stars)}
                            label={
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={14}
                                                className={
                                                    i < stars
                                                        ? "fill-green-800 text-green-800"
                                                        : "text-gray-300"
                                                }
                                            />
                                        ))}
                                    </div>
                                    <span className="text-body-s text-gray-500">e acima</span>
                                </div>
                            }
                        />
                    );
                })}
            </FilterAccordion>

            <FilterAccordion title="Preço">
                <div className="flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder={`Min: ${priceRange.min.toFixed(2)}`}
                            value={localMinPrice}
                            onChange={(e) => setLocalMinPrice(e.target.value)}
                            onBlur={handlePriceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-body-m text-green-800 focus:outline-none focus:border-green-700"
                            min={priceRange.min}
                            max={priceRange.max}
                        />
                        <input
                            type="number"
                            placeholder={`Max: ${priceRange.max.toFixed(2)}`}
                            value={localMaxPrice}
                            onChange={(e) => setLocalMaxPrice(e.target.value)}
                            onBlur={handlePriceChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-body-m text-green-800 focus:outline-none focus:border-green-700"
                            min={priceRange.min}
                            max={priceRange.max}
                        />
                    </div>
                    {(tempFilters.minPrice !== null || tempFilters.maxPrice !== null) && (
                        <button
                            onClick={() => {
                                setLocalMinPrice('');
                                setLocalMaxPrice('');
                                setTempFilters({ ...tempFilters, minPrice: null, maxPrice: null });
                            }}
                            className="text-body-s text-green-700 underline hover:text-green-800"
                        >
                            Limpar filtro de preço
                        </button>
                    )}
                </div>
            </FilterAccordion>
        </div>
    );
};