import Hero from "../components/hero/Hero";
import TopProducts from "../components/top-products/TopProducts";
import HomeCategories from "../components/home-categories/HomeCategories";
import MainLayout from "../layouts/MainLayout";
import { fetchHealth } from "../lib/api";
import HomeTestimonials from "../components/home-testimonials/HomeTestimonials";
import AllProducts from "../components/all-products/AllProcuts";
import { fetchProductsMapped } from "../services/api/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  await fetchHealth();

  let topProducts: Awaited<ReturnType<typeof fetchProductsMapped>>["products"] = [];
  let allProducts: Awaited<ReturnType<typeof fetchProductsMapped>>["products"] = [];
  let productsLoadFailed = false;
  try {
    const { products } = await fetchProductsMapped({ page: 1 });
    topProducts = products.slice(0, 6);
    allProducts = products;
  } catch (e) {
    console.warn("Failed to fetch products for home:", e);
    productsLoadFailed = true;
  }

  return (
    <>
      <MainLayout>
        <Hero />
        <TopProducts products={topProducts} productsLoadFailed={productsLoadFailed} />
        <HomeCategories />
        <HomeTestimonials />
        <AllProducts products={allProducts} productsLoadFailed={productsLoadFailed} />
      </MainLayout>
    </>
  );
}
