"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import MainLayout from "../../layouts/MainLayout";
import ProductCard from "../../components/product-card/ProductCard";
import ProductCardSkeleton from "../../components/product-card/ProductCardSkeleton";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Select } from "@/src/components/ui/Select";
import { cn } from "@/src/utils/cn";
import { FilterSidebar } from '@/src/components/filter-sidebar/FilterSidebar';
import { ProductSearchBar } from '@/src/components/product-search/ProductSearchBar';
import { Product } from '@/src/types/product';
import { fetchProductsMapped } from '@/src/services/api/products';
import { useProductFilters, ProductFilters, ProductSort } from '@/src/hooks/useProductFilters';

function filterProductsByQuery(products: Product[], query: string): Product[] {
  if (!query.trim()) return products;
  const lower = query.trim().toLowerCase();
  return products.filter((p) => p.name.toLowerCase().includes(lower) || (p.description?.toLowerCase().includes(lower)));
}

function filterProductsByCategory(products: Product[], category: string): Product[] {
  if (!category.trim()) return products;
  const categoryLower = category.trim().toLowerCase();
  return products.filter((p) => {
    // Verifica se a categoria principal corresponde
    if (p.category?.toLowerCase() === categoryLower) return true;
    // Verifica se alguma das categorias corresponde
    if (p.categories?.some(cat => cat.name.toLowerCase() === categoryLower)) return true;
    return false;
  });
}

function filterProducts(products: Product[], filters: ProductFilters): Product[] {
  let filtered = [...products];

  // Filtro por categorias - só filtra se houver categorias selecionadas
  // Se não houver categorias selecionadas, considera todas (não filtra)
  if (filters.categories.length > 0) {
    filtered = filtered.filter((p) => {
      const productCategories = [
        p.category,
        ...(p.categories?.map(c => c.name) || [])
      ].filter(Boolean).map(c => c?.toLowerCase());
      
      return filters.categories.some(filterCat => 
        productCategories.includes(filterCat.toLowerCase())
      );
    });
  }

  // Filtro por rating mínimo - só filtra se não for null
  // Produtos com rating 0 (sem avaliação) são excluídos quando há filtro de rating
  if (filters.minRating !== null && filters.minRating !== undefined) {
    filtered = filtered.filter((p) => {
      // Se rating é 0 ou não existe (sem avaliação), exclui o produto
      if (!p.rating || p.rating === 0) {
        return false;
      }
      // Se tem rating > 0, verifica se atende ao mínimo
      return p.rating >= filters.minRating!;
    });
  }

  // Filtro por preço - só filtra se pelo menos um valor não for null
  // Se ambos forem null, ignora o filtro (considera todos os preços)
  if (filters.minPrice !== null || filters.maxPrice !== null) {
    filtered = filtered.filter((p) => {
      const price = parseFloat(p.price.replace(/[^0-9.-]+/g, '')) || 0;
      if (filters.minPrice !== null && price < filters.minPrice) return false;
      if (filters.maxPrice !== null && price > filters.maxPrice) return false;
      return true;
    });
  }

  return filtered;
}

function sortProducts(products: Product[], sort: ProductSort): Product[] {
  const sorted = [...products];
  
  switch (sort.field) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'price-low':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, '')) || 0;
        return priceA - priceB;
      });
      break;
    case 'price-high':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price.replace(/[^0-9.-]+/g, '')) || 0;
        const priceB = parseFloat(b.price.replace(/[^0-9.-]+/g, '')) || 0;
        return priceB - priceA;
      });
      break;
  }
  
  return sorted;
}

function ProductsContent() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('q') ?? '';
  const categoryParam = searchParams.get('category') ?? '';
  
  const {
    filters,
    sort,
    setSort,
    resetFilters,
    hasActiveFilters,
  } = useProductFilters();

  // Estado local para filtros temporários (antes de aplicar)
  const [tempFilters, setTempFilters] = useState<ProductFilters>({
    categories: [],
    minRating: null,
    minPrice: null,
    maxPrice: null,
    requiresPrescription: null,
  });
  
  // Estado para filtros aplicados (usados na filtragem)
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>({
    categories: [],
    minRating: null,
    minPrice: null,
    maxPrice: null,
    requiresPrescription: null,
  });

  // Detectar se é mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Inicializar tempFilters apenas uma vez na montagem
  useEffect(() => {
    setTempFilters(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Aplicar filtros quando clicar em Apply
  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    // Sincronizar com o hook também para manter consistência
    // (mas não vamos usar diretamente do hook, vamos usar appliedFilters)
    if (isMobile) {
      setIsFilterOpen(false);
    }
  };

  // Usar filtros aplicados na filtragem
  const activeFilters = appliedFilters;

  // Sincronizar categoria da URL com filtros
  useEffect(() => {
    if (categoryParam) {
      // Se há categoria na URL, adiciona aos filtros se não estiver lá
      if (!filters.categories.includes(categoryParam)) {
        // Não vamos modificar diretamente, mas vamos usar na filtragem
      }
    }
  }, [categoryParam, filters.categories]);

  useEffect(() => {
    let cancelled = false;
    setProductsLoading(true);
    fetchProductsMapped({ page: 1 })
      .then(({ products: list }) => {
        if (!cancelled) {
          setProducts(list);
          setProductsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts([]);
          setProductsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Obter categorias únicas dos produtos
  const availableCategories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach((p) => {
      if (p.category) categorySet.add(p.category);
      p.categories?.forEach((cat) => categorySet.add(cat.name));
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Obter range de preços
  const priceRange = useMemo(() => {
    const prices = products
      .map((p) => parseFloat(p.price.replace(/[^0-9.-]+/g, '')) || 0)
      .filter((p) => p > 0);
    return {
      min: prices.length > 0 ? Math.min(...prices) : 0,
      max: prices.length > 0 ? Math.max(...prices) : 1000,
    };
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;
    
    // Primeiro filtra por categoria da URL (se houver)
    if (categoryParam) {
      filtered = filterProductsByCategory(filtered, categoryParam);
    }
    
    // Depois aplica os filtros do sidebar (mobile ou desktop)
    filtered = filterProducts(filtered, activeFilters);
    
    // Depois filtra por query de busca
    if (searchQuery) {
      filtered = filterProductsByQuery(filtered, searchQuery);
    }
    
    // Por fim, ordena
    filtered = sortProducts(filtered, sort);
    
    return filtered;
  }, [products, searchQuery, categoryParam, activeFilters, sort]);

  // Título baseado na categoria ou padrão
  const pageTitle = categoryParam || 'Todos os Produtos';

  const handleResetFilters = () => {
    const emptyFilters = {
      categories: [],
      minRating: null,
      minPrice: null,
      maxPrice: null,
      requiresPrescription: null,
    };
    setTempFilters(emptyFilters);
    setAppliedFilters(emptyFilters);
    resetFilters();
    if (categoryParam) {
      router.push('/products');
    }
  };

  const hasTempFiltersActive = () => {
    return (
      tempFilters.categories.length > 0 ||
      tempFilters.minRating !== null ||
      tempFilters.minPrice !== null ||
      tempFilters.maxPrice !== null
    );
  };

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
              {pageTitle}
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
                  {isFilterOpen ? 'Ocultar filtros' : 'Mostrar filtros'} {(() => {
                    const activeCount = appliedFilters.categories.length + 
                      (appliedFilters.minRating !== null ? 1 : 0) + 
                      (appliedFilters.minPrice !== null || appliedFilters.maxPrice !== null ? 1 : 0);
                    return activeCount > 0 ? `(${activeCount})` : '';
                  })()}
                </Button>

                <div className="hidden md:flex items-center gap-4">
                  {hasTempFiltersActive() && (
                    <>
                      <button 
                        onClick={handleResetFilters}
                        className="text-body-s font-bold text-green-800/60 underline cursor-pointer hover:text-green-800"
                      >
                        Limpar tudo
                      </button>
                      <Button 
                        colorTheme="green" 
                        className="px-6 py-2 h-auto"
                        onClick={applyFilters}
                      >
                        Aplicar
                      </Button>
                    </>
                  )}
                </div>

                <span className="text-body-m font-medium text-green-800/60 ml-auto md:ml-0">
                  {productsLoading ? "Carregando..." : `${filteredAndSortedProducts.length} ${filteredAndSortedProducts.length === 1 ? "resultado" : "resultados"}`}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 md:gap-6">
                <div className="w-full md:w-auto lg:w-[400px]">
                  <ProductSearchBar />
                </div>
                <div className="w-full md:w-auto md:min-w-[200px]">
                  <Select 
                    label="Ordenar por" 
                    value={sort.field}
                    onChange={(e) => setSort({ field: e.target.value as ProductSort['field'] })}
                  >
                    <option value="name">Nome</option>
                    <option value="price-low">Preço: Menor para Maior</option>
                    <option value="price-high">Preço: Maior para Menor</option>
                  </Select>
                </div>
              </div>
            </div>

            <div className={cn(
              "md:hidden fixed inset-x-0 bottom-0 bg-white z-50 transition-all duration-300 ease-in-out flex flex-col",
              isFilterOpen ? "top-[116px] opacity-100" : "top-full opacity-0"
            )}>
              <div className="flex-1 overflow-y-auto p-6 pb-32">
                <FilterSidebar 
                  availableCategories={availableCategories}
                  priceRange={priceRange}
                  isMobile={true}
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                />
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-white p-6 border-t border-gray-100 flex items-center justify-between gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                {hasTempFiltersActive() && (
                  <button 
                    onClick={handleResetFilters}
                    className="text-body-m font-bold underline text-green-800"
                  >
                    Reset all
                  </button>
                )}
                <Button colorTheme="green" className="flex-1 h-14" onClick={applyFilters}>
                  Apply
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-8 lg:gap-12">
            {isFilterOpen && (
              <div className="hidden md:block w-[240px] lg:w-[280px] shrink-0">
                <FilterSidebar 
                  availableCategories={availableCategories}
                  priceRange={priceRange}
                  isMobile={false}
                  tempFilters={tempFilters}
                  setTempFilters={setTempFilters}
                />
              </div>
            )}

            <div className="flex-1">
              <div
                key={productsLoading ? "products-skeleton" : "products-list"}
                className={cn(
                  "grid gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12 transition-all duration-300",
                  isFilterOpen
                    ? "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                )}
              >
                {productsLoading ? (
                  [...Array(8)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))
                ) : filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))
                ) : (
                  <div className="col-span-full py-16 text-center">
                    <p className="text-body-m text-green-800/70">
                      {categoryParam 
                        ? `Nenhum produto encontrado na categoria "${categoryParam}"${searchQuery ? ` para "${searchQuery}"` : ''}.`
                        : searchQuery 
                          ? `Nenhum produto encontrado para "${searchQuery}".`
                          : 'Nenhum produto encontrado.'
                      }
                    </p>
                    <p className="text-body-s text-gray-500 mt-2">
                      Tente outro termo ou limpe a busca.
                    </p>
                  </div>
                )}
              </div>
              {/* 
              {!productsLoading && filteredAndSortedProducts.length > 0 && (
                <div className="mt-16 flex justify-center">
                  <Button variant="primary" colorTheme="pistachio" className="px-12">
                    Mostrar mais
                  </Button>
                </div>
              )} */}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

function ProductsPageFallback() {
  return (
    <MainLayout>
      <section className="bg-white min-h-screen">
        <div className="container mx-auto px-4 md:px-0 py-10 md:py-16">
          <div className="mb-8 md:mb-12">
            <h1 className="text-h3 md:text-h2 font-heading text-green-800 mb-6 md:mb-8">
              Todos os Produtos
            </h1>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-10 md:gap-y-12">
            {[...Array(8)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageFallback />}>
      <ProductsContent />
    </Suspense>
  );
}