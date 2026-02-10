"use client";
import { useState } from 'react';
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import { CartDrawer } from '../components/cart-drawer/CartDrawer';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header onCartOpen={() => setIsCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}