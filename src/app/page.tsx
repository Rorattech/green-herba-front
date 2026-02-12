import Hero from "../components/hero/Hero";
import TopProducts from "../components/top-products/TopProducts";
import HomeCategories from "../components/home-categories/HomeCategories";
import MainLayout from "../layouts/MainLayout";
import { fetchHealth } from "../lib/api";
import HomeTestimonials from "../components/home-testimonials/HomeTestimonials";
import AllProducts from "../components/all-products/AllProcuts";
import { fetchProductsMapped } from "../services/api/products";
import { mockTopProducts, mockAllProducts } from "../mocks/products.mock";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await fetchHealth();
  if (data) {
    console.log('Health check:', data);
  }

  let topProducts = mockTopProducts;
  let allProducts = mockAllProducts;
  try {
    const { products } = await fetchProductsMapped({ page: 1 });
    if (products.length > 0) {
      topProducts = products.slice(0, 6);
      allProducts = products;
    }
  } catch (e) {
    console.warn("Failed to fetch products for home:", e);
  }

  return (
    <>
      <MainLayout>
        <Hero />
        <TopProducts products={topProducts} />
        <HomeCategories />
        <HomeTestimonials />
        <AllProducts products={allProducts} />
      </MainLayout>
    </>
  );
}
