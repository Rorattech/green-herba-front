import Hero from "../components/hero/Hero";
import TopProducts from "../components/top-products/TopProducts";
import HomeCategories from "../components/home-categories/HomeCategories";
import MainLayout from "../layouts/MainLayout";
import { fetchHealth } from "../lib/api";
import { Product } from "../types/product";
import HomeTestimonials from "../components/home-testimonials/HomeTestimonials";
import AllProducts from "../components/all-products/AllProcuts";

export default async function Home() {
  const mockProducts: Product[] = [
    {
      id: 1,
      name: "Terra Gut",
      price: "39.99",
      oldPrice: "49.99",
      priceFormatted: "R$ 39,99",
      description: "DAILY SUPPLEMENT - 60 CAPSULES",
      discount: 20,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
      rating: 5,
      reviewsCount: 123
    },
    {
      id: 2,
      name: "Terra Immune",
      price: "39.99",
      oldPrice: "49.99",
      priceFormatted: "R$ 39,99",
      description: "DAILY SUPPLEMENT - 60 CAPSULES",
      discount: 20,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
      rating: 5,
      reviewsCount: 123
    },
    {
      id: 3,
      name: "Terra Balance",
      price: "39.99",
      oldPrice: "49.99",
      priceFormatted: "R$ 39,99",
      description: "DAILY SUPPLEMENT - 60 CAPSULES",
      discount: 20,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
      rating: 5,
      reviewsCount: 89
    },
    {
      id: 4,
      name: "Terra Daily",
      price: "39.99",
      oldPrice: "49.99",
      priceFormatted: "R$ 39,99",
      description: "DAILY SUPPLEMENT - 60 CAPSULES",
      discount: 20,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
      rating: 4,
      reviewsCount: 156
    },
    {
      id: 5,
      name: "Terra Daily",
      price: "39.99",
      oldPrice: "49.99",
      priceFormatted: "R$ 39,99",
      description: "DAILY SUPPLEMENT - 60 CAPSULES",
      discount: 20,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
      rating: 4,
      reviewsCount: 156
    },
    {
      id: 6,
      name: "Terra Daily",
      price: "39.99",
      oldPrice: "49.99",
      priceFormatted: "R$ 39,99",
      description: "DAILY SUPPLEMENT - 60 CAPSULES",
      discount: 20,
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=400",
      rating: 4,
      reviewsCount: 156
    },
  ];

  const data = await fetchHealth();
  console.log(data);
  return (
    <>
      <MainLayout>
        <Hero />
        <TopProducts products={mockProducts} />
        <HomeCategories />
        <HomeTestimonials />
        <AllProducts products={mockProducts} />
      </MainLayout>
    </>
  );
}
