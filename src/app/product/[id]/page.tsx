"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import MainLayout from "@/src/layouts/MainLayout";
import { Button } from "@/src/components/ui/Button";
import { QuantitySelector } from "@/src/components/ui/QuantitySelector";
import { Breadcrumb } from "@/src/components/ui/Breadcrumb";
import { TextAccordion } from "@/src/components/ui/TextAccordion";
import TopProducts from "@/src/components/top-products/TopProducts";
import ProductDetailSkeleton from "@/src/components/product-detail/ProductDetailSkeleton";
import ProductCardSkeleton from "@/src/components/product-card/ProductCardSkeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Star, Truck, RotateCcw, ShieldCheck, ArrowLeft, ArrowRight, X } from "lucide-react";
import SectionHeader from "@/src/components/section-header/SectionHeader";
import { Badge } from "@/src/components/ui/Badge";
import { Product } from "@/src/types/product";
import { fetchProductsMapped, getProductBySlug, mapApiProductToProduct } from "@/src/services/api/products";
import { useCart } from "@/src/contexts/CartContext";
import { useCartDrawer } from "@/src/contexts/CartDrawerContext";
import { useAuth } from "@/src/contexts/AuthContext";
import { createReview } from "@/src/services/api/reviews";
import type { ApiProduct } from "@/src/types/api";
import { getApiBaseUrlForResources } from "@/src/lib/api-client";
import { formatCurrency } from "@/src/utils/format";

function ProductReviewsSection({
    apiProduct,
    isLoggedIn,
    onReviewSubmitted,
}: {
    apiProduct: ApiProduct;
    isLoggedIn: boolean;
    onReviewSubmitted: () => void;
}) {
    const [rating, setRating] = useState(5);
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await createReview(apiProduct.id, { rating, message: message.trim() || undefined });
            setMessage("");
            setRating(5);
            onReviewSubmitted();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao enviar avaliação.");
        } finally {
            setSubmitting(false);
        }
    }

    const reviews = apiProduct.reviews ?? [];

    return (
        <div className="border-t border-gray-100 pt-6 mt-6">
            <TextAccordion title={`Avaliações (${reviews.length})`} defaultOpen={reviews.length > 0}>
                <div className="space-y-4">
                    {reviews.length === 0 && !isLoggedIn && <p className="text-body-s text-gray-500">Nenhuma avaliação ainda.</p>}
                    {reviews.map((r) => (
                        <div key={r.id} className="border-b border-gray-100 pb-3 last:border-0">
                            <div className="flex items-center gap-2">
                                <div className="flex text-warning">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={i < r.rating ? "fill-current" : "text-gray-300"} />
                                    ))}
                                </div>
                                <span className="text-body-s font-medium text-green-800">{r.user}</span>
                            </div>
                            {r.message && <p className="text-body-s text-gray-600 mt-1">{r.message}</p>}
                        </div>
                    ))}
                    {isLoggedIn && (
                        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
                            {error && <p className="text-body-s text-error">{error}</p>}
                            <div>
                                <label className="text-body-s font-medium text-green-800 block mb-1">Sua nota</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => setRating(v)}
                                            className="p-1 rounded hover:bg-gray-100"
                                            aria-label={`${v} estrelas`}
                                        >
                                            <Star size={24} className={v <= rating ? "text-warning fill-current" : "text-gray-300"} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="review-message" className="text-body-s font-medium text-green-800 block mb-1">Comentário (opcional)</label>
                                <textarea
                                    id="review-message"
                                    maxLength={500}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full border border-gray-300 rounded px-3 py-2 text-body-m min-h-[80px]"
                                    placeholder="Conte sua experiência com o produto"
                                />
                            </div>
                            <Button type="submit" variant="primary" colorTheme="green" disabled={submitting} className="text-green-100">
                                {submitting ? "Enviando…" : "Enviar avaliação"}
                            </Button>
                        </form>
                    )}
                </div>
            </TextAccordion>
        </div>
    );
}

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

type GalleryItem = { url: string; alt: string };

function ProductGallery({
    galleryItems,
    effectiveProduct,
}: {
    galleryItems: GalleryItem[];
    effectiveProduct: Product;
}) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const mainImage = galleryItems[selectedImageIndex] ?? galleryItems[0] ?? (effectiveProduct?.image ? { url: effectiveProduct.image, alt: effectiveProduct.name } : null);

    useEffect(() => {
        if (!lightboxOpen) return;
        const onEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") setLightboxOpen(false);
        };
        window.addEventListener("keydown", onEscape);
        return () => window.removeEventListener("keydown", onEscape);
    }, [lightboxOpen]);

    return (
        <div className={galleryItems.length > 1 ? "flex flex-col gap-4" : "space-y-4"}>
            <div
                className={`relative block w-full bg-gray-100 overflow-hidden group ${galleryItems.length > 1 ? "aspect-4/3" : "aspect-square"}`}
            >
                <button
                    type="button"
                    onClick={() => mainImage && setLightboxOpen(true)}
                    className={`absolute inset-0 w-full h-full text-left z-0 ${mainImage ? "cursor-zoom-in" : ""}`}
                    aria-label="Ampliar imagem"
                >
                    {mainImage && (
                        <Image
                            src={mainImage.url}
                            alt={mainImage.alt}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain p-8 md:p-12 transition-transform duration-500 group-hover:scale-105"
                            priority
                        />
                    )}
                </button>
                {galleryItems.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((i) => (i > 0 ? i - 1 : galleryItems.length - 1));
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-green-800 shadow focus:outline-none focus:ring-2 focus:ring-green-600"
                            aria-label="Imagem anterior"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex((i) => (i < galleryItems.length - 1 ? i + 1 : 0));
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-white/90 hover:bg-white text-green-800 shadow focus:outline-none focus:ring-2 focus:ring-green-600"
                            aria-label="Próxima imagem"
                        >
                            <ArrowRight size={20} />
                        </button>
                    </>
                )}
                <div className="absolute top-6 right-6 z-10 pointer-events-none">
                    <Badge variant={effectiveProduct.badgeVariant}>
                        {effectiveProduct.badgeLabel}
                    </Badge>
                </div>
            </div>
            {galleryItems.length > 1 && (
                <div className="flex items-center gap-3">
                    {galleryItems.length <= 4 ? (
                        <div className="grid grid-cols-4 gap-3 w-full">
                            {galleryItems.map((item, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setSelectedImageIndex(i)}
                                    className={`relative aspect-square w-full overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1 ${selectedImageIndex === i ? "opacity-100" : "opacity-60 hover:opacity-90"
                                                        }`}
                                    aria-label={`Ver imagem ${i + 1}`}
                                >
                                    <Image
                                        src={item.url}
                                        alt={item.alt}
                                        fill
                                        sizes="(max-width: 768px) 22vw, 120px"
                                        className="object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                            <Button
                                variant="outline"
                                colorTheme="green"
                                isIconOnly
                                className="prev-gallery shrink-0 w-9 h-9"
                                aria-label="Imagens anteriores"
                                iconLeft={<ArrowLeft size={16} />}
                            />
                            <Swiper
                                modules={[Navigation]}
                                spaceBetween={12}
                                slidesPerView={4}
                                navigation={{ prevEl: ".prev-gallery", nextEl: ".next-gallery" }}
                                className="flex-1 min-w-0"
                            >
                                {galleryItems.map((item, i) => (
                                    <SwiperSlide key={i}>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedImageIndex(i)}
                                            className={`relative block w-full aspect-square overflow-hidden cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-1 ${selectedImageIndex === i ? "opacity-100" : "opacity-60 hover:opacity-90"
                                                                }`}
                                            aria-label={`Ver imagem ${i + 1}`}
                                        >
                                            <Image
                                                src={item.url}
                                                alt={item.alt}
                                                fill
                                                sizes="120px"
                                                className="object-cover"
                                            />
                                        </button>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <Button
                                variant="outline"
                                colorTheme="green"
                                isIconOnly
                                className="next-gallery shrink-0 w-9 h-9"
                                aria-label="Próximas imagens"
                                iconRight={<ArrowRight size={16} />}
                            />
                        </>
                    )}
                </div>
            )}

            {lightboxOpen && mainImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Visualização em tela cheia"
                >
                    <button
                        type="button"
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 z-10 p-2 text-white hover:bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label="Fechar"
                    >
                        <X size={28} />
                    </button>
                    {galleryItems.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex((i) => (i > 0 ? i - 1 : galleryItems.length - 1));
                                }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Imagem anterior"
                            >
                                <ArrowLeft size={28} />
                            </button>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedImageIndex((i) => (i < galleryItems.length - 1 ? i + 1 : 0));
                                }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 text-white hover:bg-white/10 rounded focus:outline-none focus:ring-2 focus:ring-white"
                                aria-label="Próxima imagem"
                            >
                                <ArrowRight size={28} />
                            </button>
                        </>
                    )}
                    <div
                        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={mainImage.url}
                            alt={mainImage.alt}
                            className="max-w-full max-h-[85vh] w-auto h-auto object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ProductInternalPage() {
    const { id } = useParams<{ id: string }>();
    const slug = typeof id === "string" ? id : undefined;
    const [product, setProduct] = useState<Product | null>(null);
    const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);
    const [productLoading, setProductLoading] = useState(true);
    const [topProducts, setTopProducts] = useState<Product[]>([]);
    const { user } = useAuth();

    const isLoading = Boolean(slug) && productLoading;
    const effectiveProduct = slug ? product : null;

    const galleryItems = useMemo(() => {
        if (!effectiveProduct) return [];
        const base = getApiBaseUrlForResources();
        if (apiProduct?.images?.length) {
            return apiProduct.images.map((img) => {
                const url = img.url ?? `${base}/storage/${img.file_path}`;
                const normalizedUrl = url.replace(
                    /^https:\/\/pharma-green-backend\.onrender\.com/,
                    base
                );
                return {
                    url: normalizedUrl,
                    alt: img.alt_text ?? effectiveProduct?.name ?? "Produto",
                };
            });
        }
        if (effectiveProduct.image) {
            return [{ url: effectiveProduct.image, alt: effectiveProduct.name }];
        }
        return [];
    }, [apiProduct, effectiveProduct]);

    function refetchProduct() {
        if (!slug) return;
        getProductBySlug(slug).then((api) => {
            if (api) {
                setApiProduct(api);
                setProduct(mapApiProductToProduct(api));
            }
        }).catch(() => { });
    }

    useEffect(() => {
        if (!slug) return;
        let cancelled = false;
        queueMicrotask(() => setProductLoading(true));
        getProductBySlug(slug)
            .then((api) => {
                if (cancelled) return;
                if (api) {
                    setApiProduct(api);
                    setProduct(mapApiProductToProduct(api));
                } else {
                    setProduct(null);
                    setApiProduct(null);
                }
                setProductLoading(false);
            })
            .catch(() => {
                if (!cancelled) {
                    setProduct(null);
                    setApiProduct(null);
                    setProductLoading(false);
                }
            });
        return () => { cancelled = true; };
    }, [slug]);

    useEffect(() => {
        let cancelled = false;
        fetchProductsMapped({ page: 1 })
            .then(({ products }) => {
                if (!cancelled) setTopProducts(products.slice(0, 6));
            })
            .catch(() => { });
        return () => { cancelled = true; };
    }, []);

    if (isLoading) {
        return (
            <MainLayout>
                <section className="bg-white py-10">
                    <div className="container mx-auto px-4 md:px-0">
                        <ProductDetailSkeleton />
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
                <section className="bg-white py-10 md:py-14 overflow-hidden">
                    <div className="container mx-auto px-4 md:px-0">
                        <SectionHeader title="Top Produtos" buttonText="Ver todos" buttonLink="/products" />
                    </div>
                    <div className="container mx-auto px-4 md:px-0 overflow-visible">
                        <div className="flex gap-6 overflow-visible">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="w-full max-w-[320px] md:max-w-107.5 shrink-0">
                                    <ProductCardSkeleton />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="container mx-auto mt-8 px-4 md:px-0">
                        <div className="flex items-center justify-between border-gray-200">
                            <div className="w-full max-w-56.25 h-0.5 bg-gray-200 relative overflow-hidden" />
                            <div className="flex gap-3">
                                <Button
                                    variant="primary"
                                    colorTheme="pistachio"
                                    isIconOnly
                                    className="w-12 h-12"
                                    aria-label="Produto anterior"
                                    iconLeft={<ArrowLeft size={18} />}
                                />
                                <Button
                                    variant="primary"
                                    colorTheme="pistachio"
                                    isIconOnly
                                    className="w-12 h-12"
                                    aria-label="Próximo produto"
                                    iconRight={<ArrowRight size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                </section>
            </MainLayout>
        );
    }

    if (!effectiveProduct) {
        return (
            <MainLayout>
                <section className="bg-white py-10 min-h-[50vh] flex items-center justify-center">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-h3 font-heading text-green-800 mb-4">Produto não encontrado</h1>
                        <p className="text-body-m text-green-800/70 mb-6">O produto que você procura não existe ou foi removido.</p>
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center gap-2 rounded-full font-body text-body-m font-medium px-8 py-4 bg-green-700 text-green-100 hover:bg-green-800 transition-all duration-200"
                        >
                            Ver todos os produtos
                        </Link>
                    </div>
                </section>
            </MainLayout>
        );
    }

    const categoryName = effectiveProduct.category || effectiveProduct.categories?.[0]?.name || "Produtos";
    const categoryHref = categoryName !== "Produtos" ? `/products?category=${encodeURIComponent(categoryName)}` : "/products";

    const breadcrumbItems = [
        { label: "Início", href: "/" },
        { label: categoryName, href: categoryHref },
        { label: effectiveProduct.name, href: "#" },
    ];

    return (
        <MainLayout>
            <section className="bg-white py-10">
                <div className="container mx-auto px-4 md:px-0">

                    <div className="mb-8">
                        <Breadcrumb items={breadcrumbItems} colorTheme="dark" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">

                        {effectiveProduct && (
                            <ProductGallery
                                key={slug}
                                galleryItems={galleryItems}
                                effectiveProduct={effectiveProduct}
                            />
                        )}

                        <div className="flex flex-col gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex text-warning">
                                        {[...Array(5)].map((_, i) => {
                                            const rating = effectiveProduct.rating ?? 0;
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
                                    <span className="text-body-s text-gray-400">
                                        ({effectiveProduct.reviewsCount ?? 0} avaliações)
                                    </span>
                                </div>
                                <h1 className="text-h2 font-heading text-green-800">{effectiveProduct.name}</h1>
                                <div className="flex items-center gap-3">
                                    <span className="text-h4 font-bold text-green-800">{effectiveProduct.priceFormatted}</span>
                                    {effectiveProduct.oldPrice && effectiveProduct.oldPrice !== "0" && (
                                        <span className="text-h5 text-gray-300 line-through">{formatCurrency(parseFloat(effectiveProduct.oldPrice))}</span>
                                    )}
                                </div>
                            </div>

                            <p className="text-body-m text-green-800/70 leading-relaxed">
                                {effectiveProduct.description}
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                                    <span className="text-body-s font-bold text-green-500 uppercase">
                                        {effectiveProduct.stock}
                                    </span>
                                </div>

                                <AddToCartButton product={effectiveProduct} />

                                <div className="flex items-center gap-2 text-body-s text-green-800/60 pt-2">
                                    <Truck size={16} />
                                    <span>Frete grátis acima de R$ 50</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 mt-6">
                                <TextAccordion title="Especificações" defaultOpen={!!(apiProduct?.specifications && Object.keys(apiProduct.specifications).length > 0)}>
                                    {apiProduct?.specifications && Object.keys(apiProduct.specifications).length > 0 ? (
                                        <ul className="list-disc pl-4 space-y-2 text-body-m text-green-800/80">
                                            {Object.entries(apiProduct.specifications).map(([key, value]) => (
                                                <li key={key}>
                                                    <span className="font-medium capitalize">
                                                        {key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}:
                                                    </span>{" "}
                                                    {value}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-body-m text-green-800/70">Nenhuma especificação disponível.</p>
                                    )}
                                </TextAccordion>

                                {apiProduct && (
                                    <ProductReviewsSection
                                        apiProduct={apiProduct}
                                        isLoggedIn={!!user}
                                        onReviewSubmitted={refetchProduct}
                                    />
                                )}
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