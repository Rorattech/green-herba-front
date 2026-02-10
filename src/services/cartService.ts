import type { Product } from '../types/product';

export function addToCart(product: Product, quantity = 1) {
  // Example wrapper that would call backend/cart endpoints in future
  return Promise.resolve({ success: true, productId: product.id, quantity });
}

export function getCart() {
  // example placeholder
  return Promise.resolve({ items: [] });
}
