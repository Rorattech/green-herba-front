export interface Product {
  id: number | string;
  slug?: string;
  name: string;
  image: string;
  price: string;
  oldPrice: string;
  badgeLabel?: string;
  badgeVariant?: 'neutral' | 'success' | 'warning' | 'error' | 'primary';
  description: string;
  priceFormatted: string;
  rating?: number;
  reviewsCount?: number;
  stock?: string;
  sizes?: string[];
}