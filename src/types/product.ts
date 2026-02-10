export interface Product {
  id: number | string;
  name: string;
  image: string;
  price: string;
  oldPrice: string;
  discount?: number;
  description: string;
  priceFormatted: string;
  rating?: number;
  reviewsCount?: number;
}