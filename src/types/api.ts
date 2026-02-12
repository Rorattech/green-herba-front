/** Category as returned by the API */
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
}

/** Product image as returned by the API */
export interface ApiProductImage {
  id: number;
  file_path: string;
  alt_text: string | null;
  sort_order?: number;
  is_primary?: boolean;
}

/** Product as returned by the API */
export interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  discount_percentage: string | null;
  new_price: number;
  requires_prescription: boolean;
  badge_label: string | null;
  badge_variant: string | null;
  specifications: Record<string, string>;
  primary_image: ApiProductImage | null;
  images: ApiProductImage[];
  categories: ApiCategory[];
  rating: number | null;
  reviews_count: number;
  reviews?: Array<{
    id: number;
    user: string;
    rating: number;
    message: string;
  }>;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/** Pagination links from Laravel-style API */
export interface ApiPaginationLinks {
  first: string;
  last: string;
  prev: string | null;
  next: string | null;
}

/** Pagination meta from Laravel-style API */
export interface ApiPaginationMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: Array<{ url: string | null; label: string; page: number | null; active: boolean }>;
  path: string;
  per_page: number;
  to: number;
  total: number;
}

/** Products list response (paginated) */
export interface ApiProductsResponse {
  data: ApiProduct[];
  links: ApiPaginationLinks;
  meta: ApiPaginationMeta;
}

/** Single product response (for GET /products/:id when available) */
export interface ApiProductResponse {
  data: ApiProduct;
}
