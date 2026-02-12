import { Product } from './product';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
}

export interface CartContextValue {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedSize?: string) => void;
  removeItem: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}
