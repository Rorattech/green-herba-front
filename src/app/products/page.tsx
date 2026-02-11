"use client";

import { useState, useEffect } from 'react';
import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/product-card/ProductCard";
import { mockAllProducts } from "../../mocks/products.mock";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Select } from "@/src/components/ui/Select";
import { cn } from "@/src/utils/cn";
import { FilterSidebar } from '@/src/components/filter-sidebar/FilterSidebar';

export default function ProductsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isFilterOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isFilterOpen]);

  return (
    <MainLayout>
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-0 py-10 md:py-16">

          <div className="mb-8 md:mb-12">
            <h1 className="text-h3 md:text-h2 font-heading text-green-800 mb-6 md:mb-8">
              Todos os Produtos
            </h1>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
              <div className="flex items-center gap-4 md:gap-6">
                <Button
                  variant="primary"
                  colorTheme="pistachio"
                  className="px-4 md:px-6 py-2.5 h-auto text-body-s flex items-center gap-2"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <SlidersHorizontal size={16} />
                  {isFilterOpen ? 'Hide filter' : 'Show filter'} ({isFilterOpen ? '6' : '0'})
                </Button>

                <button className="hidden md:block text-body-s font-bold text-green-800/60 underline cursor-pointer hover:text-green-800">
                  Reset all
                </button>

                <span className="text-body-m font-medium text-green-800/60 ml-auto md:ml-0">
                  100 results
                </span>
              </div>

              <div className="w-full md:w-auto md:min-w-[200px]">
                <Select label="Sort by" defaultValue="best-sellers">
                  <option value="best-sellers">Best sellers</option>
                </Select>
              </div>
            </div>

            <div className={cn(
              "md:hidden fixed inset-x-0 bottom-0 bg-white z-50 transition-all duration-300 ease-in-out flex flex-col",
              isFilterOpen ? "top-[116px] opacity-100" : "top-full opacity-0"
            )}>
              <div className="flex-1 overflow-y-auto p-6 pb-32">
                <FilterSidebar />
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-white p-6 border-t border-gray-100 flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button className="text-body-m font-bold underline text-green-800">Reset all</button>
                <Button colorTheme="green" className="flex-1 h-14" onClick={() => setIsFilterOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12">
            {isFilterOpen && (
              <div className="hidden md:block w-[240px] lg:w-[280px] shrink-0">
                <FilterSidebar />
              </div>
            )}

            <div className="flex-1">
              <div className={cn(
                "grid gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12 transition-all duration-300",
                isFilterOpen
                  ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              )}>
                {mockAllProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              <div className="mt-16 flex justify-center">
                <Button variant="primary" colorTheme="pistachio" className="px-12">
                  Show more
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}