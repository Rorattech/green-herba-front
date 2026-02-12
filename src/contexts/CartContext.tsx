"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CartItem, CartContextValue } from '@/src/types/cart';
import { Product } from '@/src/types/product';

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'green-herba-cart';

// Função para carregar do localStorage
function loadCartFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  return [];
}

// Função para salvar no localStorage
function saveCartToStorage(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar do localStorage na inicialização
  useEffect(() => {
    const savedItems = loadCartFromStorage();
    setItems(savedItems);
    setIsInitialized(true);
  }, []);

  // Salvar no localStorage sempre que o carrinho mudar
  useEffect(() => {
    if (isInitialized) {
      saveCartToStorage(items);
    }
  }, [items, isInitialized]);

  const addItem = useCallback((product: Product, quantity = 1, selectedSize?: string) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingItemIndex >= 0) {
        // Se o item já existe, atualiza a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        // Adiciona novo item
        return [...prevItems, { product, quantity, selectedSize }];
      }
    });
  }, []);

  const removeItem = useCallback((productId: number | string) => {
    setItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number | string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.product.price.replace(/[^0-9.-]+/g, '')) || 0;
      return total + price * item.quantity;
    }, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
