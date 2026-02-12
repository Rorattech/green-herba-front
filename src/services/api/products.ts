import { apiGet } from "@/src/lib/api-client";
import type {
  ApiProduct,
  ApiProductsResponse,
  ApiProductResponse,
} from "@/src/types/api";
import type { Product } from "@/src/types/product";
import { formatCurrency } from "@/src/utils/format";

const PLACEHOLDER_IMAGE = "/assets/products/PRODUTO-1.png";

/**
 * Maps an API product to the frontend Product type.
 * Fields not provided by the API (oldPrice, badgeLabel, rating, reviewsCount, etc.) are kept mock/optional.
 */
export function mapApiProductToProduct(api: ApiProduct): Product {
  const priceNum = parseFloat(api.price) || 0;
  // oldPrice mockado até o back enviar (evita quebrar layout do card)
  const oldPrice = priceNum > 0 ? (priceNum * 1.15).toFixed(2) : "";
  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    price: api.price,
    oldPrice,
    priceFormatted: formatCurrency(priceNum),
    description: api.description ?? "",
    image: api.primary_image?.file_path
      ? `https://pharma-green-backend.onrender.com/storage/${api.primary_image.file_path}`
      : PLACEHOLDER_IMAGE,
    badgeLabel: undefined, // mockado até o back enviar
    badgeVariant: undefined,
    rating: undefined,
    reviewsCount: 0, // mockado até o back enviar
    stock: "Em estoque", // mockado até o back enviar
    sizes: undefined,
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
