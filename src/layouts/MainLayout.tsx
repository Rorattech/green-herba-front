"use client";
import { Header } from '../components/header/Header';
import { Footer } from '../components/footer/Footer';
import { CartDrawer } from '../components/cart-drawer/CartDrawer';
import { useCartDrawer } from '../contexts/CartDrawerContext';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, closeDrawer } = useCartDrawer();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />

      <CartDrawer isOpen={isOpen} onClose={closeDrawer} />
    </div>
  );
}