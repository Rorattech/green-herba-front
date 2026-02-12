import { useState, useCallback } from 'react';

export interface ProductFilters {
  categories: string[];
  minRating: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  requiresPrescription: boolean | null;
}

export interface ProductSort {
  field: 'name' | 'price-low' | 'price-high';
}

const defaultFilters: ProductFilters = {
  categories: [],
  minRating: null,
  minPrice: null,
  maxPrice: null,
  requiresPrescription: null,
};

export function useProductFilters() {
  const [filters, setFilters] = useState<ProductFilters>(defaultFilters);
  const [sort, setSort] = useState<ProductSort>({ field: 'name' });

  const toggleCategory = useCallback((category: string) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const setMinRating = useCallback((rating: number | null) => {
    setFilters((prev) => ({ ...prev, minRating: rating }));
  }, []);

  const setPriceRange = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, minPrice: min, maxPrice: max }));
  }, []);

  const setRequiresPrescription = useCallback((value: boolean | null) => {
    setFilters((prev) => ({ ...prev, requiresPrescription: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const hasActiveFilters = useCallback(() => {
    return (
      filters.categories.length > 0 ||
      filters.minRating !== null ||
      filters.minPrice !== null ||
      filters.maxPrice !== null ||
      filters.requiresPrescription !== null
    );
  }, [filters]);

  return {
    filters,
    sort,
    setSort,
    toggleCategory,
    setMinRating,
    setPriceRange,
    setRequiresPrescription,
    resetFilters,
    hasActiveFilters,
  };
}
