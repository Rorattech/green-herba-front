import { apiGet } from "@/src/lib/api-client";
import type {
  ApiProduct,
  ApiProductsResponse,
  ApiProductResponse,
} from "@/src/types/api";
import type { Product } from "@/src/types/product";
import { formatCurrency } from "@/src/utils/format";

const PLACEHOLDER_IMAGES = [
  "/assets/products/PRODUTO-1.png",
  "/assets/products/PRODUTO-2.png",
  "/assets/products/PRODUTO-3.png",
  "/assets/products/PRODUTO-4.png",
];

/**
 * Maps an API product to the frontend Product type.
 * Fields not provided by the API (stock, sizes) use defaults until the backend supports them.
 */
export function mapApiProductToProduct(api: ApiProduct): Product {
  const priceFromString = parseFloat(api.price) || 0;
  const finalPrice = api.new_price ?? priceFromString;

  const placeholderIndex = typeof api.id === 'number' 
    ? api.id % PLACEHOLDER_IMAGES.length 
    : Math.floor(Math.random() * PLACEHOLDER_IMAGES.length);

  const selectedPlaceholder = PLACEHOLDER_IMAGES[placeholderIndex];

  const oldPrice =
    api.discount_percentage && parseFloat(api.discount_percentage) > 0
      ? api.price
      : (finalPrice > 0 ? (finalPrice * 1.15).toFixed(2) : "");

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    price: finalPrice.toString(),
    oldPrice,
    priceFormatted: formatCurrency(finalPrice),
    description: api.description ?? "",
    image:
      api.primary_image?.file_path &&
      typeof api.primary_image.file_path === "string"
        ? `https://pharma-green-backend.onrender.com/storage/${api.primary_image.file_path}`
        : selectedPlaceholder,
    badgeLabel: api.badge_label ?? undefined,
    badgeVariant: api.badge_variant as Product["badgeVariant"] | undefined,
    rating: api.rating ?? 0,
    reviewsCount: api.reviews_count ?? 0,
    stock: "Em estoque",
    sizes: undefined,
    category: api.categories?.[0]?.name,
    categories: api.categories,
  };
}

export type GetProductsParams = {
  page?: number;
  per_page?: number;
};

/**
 * Fetches paginated products from the API.
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<ApiProductsResponse> {
  return apiGet<ApiProductsResponse>("/api/products", {
    page: params?.page,
    per_page: params?.per_page,
  } as Record<string, number | undefined>);
}

/**
 * Fetches a single product by slug. GET /api/products/:slug (e.g. /api/products/acido-folico-5mg).
 * If the endpoint returns 404, returns null.
 */
export async function getProductBySlug(slug: string): Promise<ApiProduct | null> {
  try {
    const res = await apiGet<ApiProductResponse>(`/api/products/${encodeURIComponent(slug)}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetches products and returns them mapped to the frontend Product type.
 */
export async function fetchProductsMapped(
  params?: GetProductsParams
): Promise<{ products: Product[]; meta: ApiProductsResponse["meta"] }> {
  const response = await getProducts(params);
  const products = response.data.map(mapApiProductToProduct);
  return { products, meta: response.meta };
}

/**
 * Fetches a single product by slug and returns it mapped to the frontend Product type, or null.
 */
export async function fetchProductBySlugMapped(slug: string): Promise<Product | null> {
  const apiProduct = await getProductBySlug(slug);
  if (!apiProduct) return null;
  return mapApiProductToProduct(apiProduct);
}
