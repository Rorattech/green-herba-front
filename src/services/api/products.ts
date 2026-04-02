import { apiGet, getApiBaseUrlForResources } from "@/src/lib/api-client";
import { createRequestCache } from "@/src/lib/request-cache";
import type {
  ApiProduct,
  ApiProductsResponse,
  ApiProductResponse,
} from "@/src/types/api";
import type { Product } from "@/src/types/product";
import { formatCurrency } from "@/src/utils/format";

/** Lista/catálogo público: reutiliza resposta por um intervalo curto para cortar chamadas repetidas no cliente */
const PRODUCTS_LIST_CACHE_TTL_MS = 60_000;
const PRODUCT_SLUG_CACHE_TTL_MS = 60_000;

const cachedProductsList = createRequestCache<ApiProductsResponse>(PRODUCTS_LIST_CACHE_TTL_MS);
const cachedProductBySlug = createRequestCache<ApiProduct | null>(PRODUCT_SLUG_CACHE_TTL_MS);

function getProductsListCacheKey(params?: GetProductsParams): string {
  return JSON.stringify({
    page: params?.page ?? null,
    per_page: params?.per_page ?? null,
    rx: params?.requires_prescription === true,
  });
}

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

  const baseUrl = getApiBaseUrlForResources();
  const rawPrimaryUrl =
    api.primary_image?.url ||
    (api.primary_image?.file_path && typeof api.primary_image.file_path === "string"
      ? `${baseUrl}/storage/${api.primary_image.file_path}`
      : null);
  // Normalize: if API returned full URL with old host, use our configured base
  const primaryImageUrl =
    rawPrimaryUrl?.replace(
      /^https:\/\/pharma-green-backend\.onrender\.com/,
      baseUrl
    ) ?? null;

  return {
    id: api.id,
    slug: api.slug,
    name: api.name,
    price: finalPrice.toString(),
    oldPrice,
    priceFormatted: formatCurrency(finalPrice),
    description: api.description ?? "",
    image: primaryImageUrl ?? selectedPlaceholder,
    badgeLabel: api.badge_label ?? undefined,
    badgeVariant: api.badge_variant as Product["badgeVariant"] | undefined,
    rating: api.rating ?? 0,
    reviewsCount: api.reviews_count ?? 0,
    stock: "Em estoque",
    sizes: undefined,
    category: api.categories?.[0]?.name,
    categories: api.categories,
    requiresPrescription: api.requires_prescription ?? false,
  };
}

export type GetProductsParams = {
  page?: number;
  per_page?: number;
  /** Filter: only products that require prescription (for prescription upload select) */
  requires_prescription?: boolean;
};

/**
 * Fetches paginated products from the API.
 */
export async function getProducts(
  params?: GetProductsParams
): Promise<ApiProductsResponse> {
  const key = getProductsListCacheKey(params);
  return cachedProductsList(key, () => {
    const query: Record<string, string | number | undefined> = {
      page: params?.page,
      per_page: params?.per_page,
    };
    if (params?.requires_prescription === true) {
      query.requires_prescription = "1";
    }
    return apiGet<ApiProductsResponse>("/api/products", query);
  });
}

/**
 * Fetches a single product by slug. GET /api/products/:slug (e.g. /api/products/acido-folico-5mg).
 * If the endpoint returns 404, returns null.
 */
export async function getProductBySlug(slug: string): Promise<ApiProduct | null> {
  const key = `slug:${encodeURIComponent(slug)}`;
  return cachedProductBySlug(key, async () => {
    try {
      const res = await apiGet<ApiProductResponse>(`/api/products/${encodeURIComponent(slug)}`);
      return res.data ?? null;
    } catch {
      return null;
    }
  });
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
