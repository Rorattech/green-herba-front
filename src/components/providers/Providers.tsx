"use client";

import { AuthProvider } from '@/src/contexts/AuthContext';
import { CartProvider } from '@/src/contexts/CartContext';
import { CartDrawerProvider } from '@/src/contexts/CartDrawerContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawerProvider>
          {children}
        </CartDrawerProvider>
      </CartProvider>
    </AuthProvider>
  );
}
