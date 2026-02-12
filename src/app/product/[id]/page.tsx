"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { QuantitySelector } from "@/src/components/ui/QuantitySelector";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { TextAccordion } from "@/src/components/ui/TextAccordion";
import TopProducts from "@/src/components/top-products/TopProducts";
import { mockTopProducts, mockAllProducts } from "@/src/mocks/products.mock";
import { Star, Truck, RotateCcw, ShieldCheck } from "lucide-react";
import { Badge } from "@/src/components/ui/Badge";
import { Product } from "@/src/types/product";
import { fetchProductBySlugMapped, fetchProductsMapped } from "@/src/services/api/products";
import { useCart } from "@/src/contexts/CartContext";
import { useCartDrawer } from "@/src/contexts/CartDrawerContext";
import { formatCurrency } from '@/src/utils/format';

const FALLBACK_PRODUCT: Product = {
    id: 0,
    name: "Carregando...",
    price: "0",
    oldPrice: "0",
    priceFormatted: "R$ 0,00",
    description: "",
    image: "/assets/products/PRODUTO-1.png",
    rating: 5,
    reviewsCount: 0,
    stock: "—",
    sizes: [],
};

function AddToCartButton({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1);
    const { addItem } = useCart();
    const { openDrawer } = useCartDrawer();

    return (
        <div className="flex flex-col sm:flex-row gap-4">
            <QuantitySelector
                colorTheme="light"
                value={quantity}
                onChange={setQuantity}
                min={1}
            />
            <Button
                variant="primary"
                colorTheme="green"
                className="flex-1 h-14"
                onClick={() => {
                    addItem(product, quantity);
                    openDrawer();
                }}
            >
                Adicionar ao carrinho
            </Button>
        </div>
    );
}

export default function ProductInternalPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product>(FALLBACK_PRODUCT);
    const [topProducts, setTopProducts] = useState<Product[]>(mockTopProducts);

    useEffect(() => {
        const slug = typeof id === "string" ? id : undefined;
        if (!slug) return;
        let cancelled = false;
        fetchProductBySlugMapped(slug)
            .then((p) => {
                if (cancelled) return;
                if (p) setProduct(p);
                else setProduct(mockAllProducts[0] ?? FALLBACK_PRODUCT);
            })
            .catch(() => {
                if (!cancelled) setProduct(mockAllProducts[0] ?? FALLBACK_PRODUCT);
            });
        return () => { cancelled = true; };
    }, [id]);

    useEffect(() => {
        let cancelled = false;
        fetchProductsMapped({ page: 1 }).then(({ products }) => {
            if (!cancelled && products.length > 0) setTopProducts(products.slice(0, 6));
        }).catch(() => { });
        return () => { cancelled = true; };
    }, []);

    // Pega a primeira categoria do produto, se houver
    const categoryName = product.category || product.categories?.[0]?.name || "Produtos";
    const categoryHref = categoryName !== "Produtos" ? `/products?category=${encodeURIComponent(categoryName)}` : "/products";

    const breadcrumbItems = [
        { label: "Início", href: "/" },
        { label: categoryName, href: categoryHref },
        { label: product.name, href: "#" },
    ];

    return (
        <MainLayout>
            <section className="bg-white py-10">
                <div className="container mx-auto px-4 md:px-0">

                    <div className="mb-8">
                        <Breadcrumb items={breadcrumbItems} colorTheme="dark" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

                        <div className="space-y-4">
                            <div className="relative aspect-square bg-gray-100 overflow-hidden group">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-12 transition-transform duration-500 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute top-6 right-6 z-10">
                                    <Badge variant={product.badgeVariant}>
                                        {product.badgeLabel}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-warning">
                                        {[...Array(5)].map((_, i) => {
                                            const rating = product.rating ?? 0;
                                            const isFilled = i < Math.floor(rating);
                                            return (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    className={isFilled ? "fill-current" : "text-gray-300"}
                                                />
                                            );
                                        })}
                                    </div>
                                    <span className="text-body-s text-gray-400 underline cursor-pointer">
                                        ({product.reviewsCount ?? 0} avaliações)
                                    </span>
                                </div>
                                <h1 className="text-h2 font-heading text-green-800">{product.name}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-h4 font-bold text-green-800">{product.priceFormatted}</span>
                                    {product.oldPrice && product.oldPrice !== "0" && (
                                        <span className="text-h5 text-gray-300 line-through">{formatCurrency(parseFloat(product.oldPrice))}</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-green-200 text-green-100 p-4 rounded-lg flex justify-between items-center">
                                <p className="text-body-s font-medium">Somente esta semana: economize 20% nos seus favoritos</p>
                                <div className="flex gap-4 font-bold tracking-widest">
                                    <span>06 : 20 : 16</span>
                                </div>
                            </div>

                            <p className="text-body-m text-green-800/70 leading-relaxed">
                                {product.description}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-body-s font-bold text-green-500 uppercase">
                                        {product.stock}
                                    </span>
                                </div>

                                <AddToCartButton product={product} />

                                <div className="flex items-center gap-2 text-body-s text-green-800/60 pt-2">
                                    <Truck size={16} />
                                    <span>Frete grátis acima de R$ 50</span>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100 border-t border-gray-100 mt-6">
                                <TextAccordion title="Detalhes" defaultOpen>
                                    <p>Terra Immune é projetado para suporte diário, não soluções rápidas. Com uso regular, muitas pessoas relatam sentir-se mais equilibradas e apoiadas durante mudanças sazonais e estressores do dia a dia.</p>
                                </TextAccordion>

                                <TextAccordion title="Resultados">
                                    <p>Nossos ensaios clínicos mostraram um aumento significativo na resposta imune basal após 30 dias de uso consistente, combinado com um estilo de vida saudável.</p>
                                </TextAccordion>

                                <TextAccordion title="Ingredientes">
                                    <ul className="list-disc pl-4 space-y-2">
                                        <li>Vitamina C (como Ácido Ascórbico)</li>
                                        <li>Zinco (como Citrato de Zinco)</li>
                                        <li>Extrato de Sabugueiro</li>
                                        <li>Equinácea Purpúrea</li>
                                    </ul>
                                </TextAccordion>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-green-700 py-16 text-green-100">
                <div className="container mx-auto px-4 md:px-0 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <Truck size={32} />
                        <h3 className="text-h5 font-heading">Frete grátis acima de R$ 50</h3>
                        <p className="text-body-m opacity-80">Entregue na sua porta sem taxas ocultas.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <RotateCcw size={32} />
                        <h3 className="text-h5 font-heading">Devolução fácil em 30 dias</h3>
                        <p className="text-body-m opacity-80">Mudou de ideia? Devolva produtos não utilizados em até 30 dias.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <ShieldCheck size={32} />
                        <h3 className="text-h5 font-heading">Confiado por milhares</h3>
                        <p className="text-body-m opacity-80">Junte-se a milhares de clientes satisfeitos que compram conosco todo mês.</p>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <TopProducts products={topProducts} />
            </section>
        </MainLayout>
    );
}