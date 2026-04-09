"use client";

import { AuthProvider } from '@/src/contexts/AuthContext';
import { CartProvider } from '@/src/contexts/CartContext';
import { CartDrawerProvider } from '@/src/contexts/CartDrawerContext';
import { FloatingPrescriptionHelpButton } from '@/src/components/floating-prescription-help/FloatingPrescriptionHelpButton';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CartDrawerProvider>
          {children}
          <FloatingPrescriptionHelpButton />
        </CartDrawerProvider>
      </CartProvider>
    </AuthProvider>
  );
}
