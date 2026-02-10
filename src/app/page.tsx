import Hero from "../components/hero/Hero";
import TopProducts from "../components/top-products/TopProducts";
import HomeCategories from "../components/home-categories/HomeCategories";
import MainLayout from "../layouts/MainLayout";
import { fetchHealth } from "../lib/api";
import HomeTestimonials from "../components/home-testimonials/HomeTestimonials";
import AllProducts from "../components/all-products/AllProcuts";
import { mockAllProducts, mockTopProducts } from "../mocks/products.mock";

export default async function Home() {
  const data = await fetchHealth();
  if (data) {
    console.log('Health check:', data);
  }
  
  return (
    <>
      <MainLayout>
        <Hero />
        <TopProducts products={mockTopProducts} />
        <HomeCategories />
        <HomeTestimonials />
        <AllProducts products={mockAllProducts} />
      </MainLayout>
    </>
  );
}
