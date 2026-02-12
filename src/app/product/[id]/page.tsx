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
        }).catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const breadcrumbItems = [
        { label: "Home", href: "/" },
        { label: "Immune support", href: "/products" },
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
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={16} fill="currentColor" />
                                        ))}
                                    </div>
                                    <span className="text-body-s text-gray-400 underline cursor-pointer">
                                        ({product.reviewsCount} reviews)
                                    </span>
                                </div>
                                <h1 className="text-h2 font-heading text-green-800">{product.name}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-h4 font-bold text-green-800">${product.price}</span>
                                    <span className="text-h5 text-gray-300 line-through">${product.oldPrice}</span>
                                </div>
                            </div>

                            <div className="bg-green-200 text-green-100 p-4 rounded-lg flex justify-between items-center">
                                <p className="text-body-s font-medium">This week only: save 20% on your favorites</p>
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

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <QuantitySelector colorTheme="light" />
                                    <Button variant="primary" colorTheme="green" className="flex-1 h-14">
                                        Add to cart
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2 text-body-s text-green-800/60 pt-2">
                                    <Truck size={16} />
                                    <span>Free shipping over $50</span>
                                </div>
                            </div>

                            <div className="divide-y divide-gray-100 border-t border-gray-100 mt-6">
                                <TextAccordion title="Details" defaultOpen>
                                    <p>Terra Immune is designed for daily support, not quick fixes. With regular use, many people report feeling more balanced and supported through seasonal changes and everyday stressors.</p>
                                </TextAccordion>

                                <TextAccordion title="Results">
                                    <p>Our clinical trials showed a significant increase in baseline immune response after 30 days of consistent usage, combined with a healthy lifestyle.</p>
                                </TextAccordion>

                                <TextAccordion title="Ingredients">
                                    <ul className="list-disc pl-4 space-y-2">
                                        <li>Vitamin C (as Ascorbic Acid)</li>
                                        <li>Zinc (as Zinc Citrate)</li>
                                        <li>Elderberry Extract</li>
                                        <li>Echinacea Purpurea</li>
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
                        <h3 className="text-h5 font-heading">Free shipping over $50</h3>
                        <p className="text-body-m opacity-80">Delivered at your door step with no hidden fees.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <RotateCcw size={32} />
                        <h3 className="text-h5 font-heading">30-day easy returns</h3>
                        <p className="text-body-m opacity-80">Changed your mind? Return unused products within 30 days.</p>
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                        <ShieldCheck size={32} />
                        <h3 className="text-h5 font-heading">Trusted by thousands</h3>
                        <p className="text-body-m opacity-80">Join thousands of happy customers who shop with us every month.</p>
                    </div>
                </div>
            </section>

            <section className="bg-white">
                <TopProducts products={topProducts} />
            </section>
        </MainLayout>
    );
}