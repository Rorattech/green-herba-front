"use client";

import { useEffect } from 'react';
import { cn } from "@/src/utils/cn";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { QuantitySelector } from "../ui/QuantitySelector";
import { useCart } from "@/src/contexts/CartContext";
import Link from 'next/link';
import { formatCurrency } from '@/src/utils/format';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { items, removeItem, updateQuantity, getTotalItems, getTotalPrice } = useCart();
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);


  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-xs z-60 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside className={cn(
        "fixed top-0 right-0 z-70 h-full w-full sm:max-w-[450px] bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>

        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-h5 font-heading text-green-800">
            Sua sacola | {totalItems} {totalItems === 1 ? 'item' : 'itens'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={24} className="text-green-800" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-body-m text-gray-400 mb-4">Sua sacola está vazia</p>
              <Button variant="primary" colorTheme="green" onClick={onClose}>
                Continuar Comprando
              </Button>
            </div>
          ) : (
            items.map((item) => {
              const price = parseFloat(item.product.price.replace(/[^0-9.-]+/g, '')) || 0;
              const oldPrice = parseFloat(item.product.oldPrice.replace(/[^0-9.-]+/g, '')) || 0;

              return (
                <div key={`${item.product.id}-${item.selectedSize || 'default'}`} className="flex gap-4">
                  <div className="relative w-20 h-24 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <Link 
                        href={`/product/${item.product.slug ?? item.product.id}`}
                        onClick={onClose}
                        className="hover:underline"
                      >
                        <h3 className="text-body-m font-bold text-green-800">{item.product.name}</h3>
                      </Link>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="text-gray-400 hover:text-error transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {item.selectedSize && (
                      <p className="text-body-s text-gray-400 mb-3">Tamanho: {item.selectedSize}</p>
                    )}
                    <div className="flex items-center justify-between mt-auto">
                      <QuantitySelector
                        colorTheme="light"
                        value={item.quantity}
                        onChange={(newQuantity) => updateQuantity(item.product.id, newQuantity)}
                        min={1}
                      />
                      <div className="flex flex-col items-end">
                        <span className="text-body-m font-bold text-green-800">{formatCurrency(price * item.quantity)}</span>
                        {oldPrice > 0 && (
                          <span className="text-body-s text-gray-300 line-through">{formatCurrency(oldPrice * item.quantity)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-body-m text-gray-500">
                <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span>
                <span className="text-green-800 font-medium">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-body-m text-gray-500">
                <span>Frete</span>
                <span className="text-green-200 font-bold uppercase tracking-tight">
                  {totalPrice >= 50 ? 'Grátis' : 'Calculado no checkout'}
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-4">
              <span className="text-body-l font-normal text-green-800 uppercase tracking-wider">Total estimado</span>
              <span className="text-h6 text-green-800 font-heading font-bold">{formatCurrency(totalPrice)}</span>
            </div>

            <Button variant="primary" colorTheme="green" className="w-full">
              Finalizar Compra
            </Button>

            <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
              Ao continuar, confirmo que li e aceito os <a href="#" className="underline hover:text-green-700">Termos de Serviço</a> e a <a href="#" className="underline hover:text-green-700">Política de Privacidade</a>.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};