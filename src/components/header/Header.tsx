"use client";

import { useState } from 'react';
import { ArrowRight, Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';
import Link from 'next/link';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderProps {
  onCartOpen: () => void;
}

export const Header = ({ onCartOpen }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-300 sticky top-0 z-50 bg-white">
      <div className="flex flex-row items-center justify-center gap-2 p-2 bg-green-700">
        <h3 className="text-green-100 text-body-m font-body font-medium">
          Free shipping on orders over $50
        </h3>
        <ArrowRight size={16} strokeWidth={1.5} color="white" />
      </div>

      <div className="bg-gray-100 flex items-center justify-center">
        <div className="container flex items-center justify-between py-6 px-4 md:px-0">

          <div className="flex lg:hidden flex-1">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-green-800 cursor-pointer"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          <div className="flex-none lg:flex-1 flex justify-center lg:justify-start">
            <Link href="/" className="relative block w-[160px] h-[40px]">
              <Image
                src="/assets/logo.svg"
                alt="Green Herba Pharma"
                width={327}
                height={90}
                priority
                className="object-contain"
              />
            </Link>
          </div>

          <nav className="hidden lg:flex items-center justify-center gap-8 flex-1">
            <Link href="/products" className="text-body-m font-body font-medium text-gray-800 hover:text-green-700 transition-colors">
              Produtos
            </Link>
            <Link href="#" className="text-body-m font-body font-medium text-gray-800 hover:text-green-700 transition-colors">
              Sobre
            </Link>
          </nav>

          <div className="flex items-center justify-end gap-4 lg:gap-6 flex-1 text-gray-700">
            <button className="hover:text-green-700 transition-colors cursor-pointer">
              <Search size={22} strokeWidth={1.5} />
            </button>
            <button className="hidden lg:block hover:text-green-700 transition-colors cursor-pointer">
              <User size={22} strokeWidth={1.5} />
            </button>
            <button
              onClick={onCartOpen}
              className="hover:text-green-700 transition-colors cursor-pointer"
            >
              <ShoppingBag size={22} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>

      <div className={cn(
        "fixed inset-0 top-[116px] bg-white z-40 transition-transform duration-300 lg:hidden h-[calc(100vh-116px)]",
        isMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <nav className="flex flex-col p-6 gap-6">
          <Link href="/products" className="text-body-m font-medium font-heading text-green-800 border-b border-gray-200 pb-4" onClick={() => setIsMenuOpen(false)}>
            Produtos
          </Link>
          <Link href="#" className="text-body-m font-medium font-heading text-green-800 border-b border-gray-200 pb-4" onClick={() => setIsMenuOpen(false)}>
            Sobre
          </Link>
          <Link href="#" className="flex items-center gap-3 text-body-m font-body font-medium text-green-700 mt-4" onClick={() => setIsMenuOpen(false)}>
            <User size={20} />
            Minha Conta
          </Link>
        </nav>
      </div>
    </header>
  );
};