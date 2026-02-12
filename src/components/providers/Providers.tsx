"use client";

import { CartProvider } from '@/src/contexts/CartContext';
import { CartDrawerProvider } from '@/src/contexts/CartDrawerContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <CartDrawerProvider>
        {children}
      </CartDrawerProvider>
    </CartProvider>
  );
}
