"use client";

import { useEffect } from 'react';
import { cn } from "@/src/utils/cn";
import { X, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/Button";
import { QuantitySelector } from "../ui/QuantitySelector";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {

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
          <h2 className="text-h5 font-heading text-green-800">Your bag | 2 items</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <X size={24} className="text-green-800" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {[1, 2].map((item) => (
            <div key={item} className="flex gap-4">
              <div className="relative w-20 h-24 bg-gray-100 rounded-sm overflow-hidden shrink-0">
                <Image
                  src="/assets/products/PRODUTO-1.png"
                  alt="Terra Immune"
                  fill
                  className="object-contain p-2"
                  priority
                />
              </div>
              <div className="flex flex-col flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-body-m font-bold text-green-800">Terra Immune</h3>
                  <button className="text-gray-400 hover:text-error transition-colors cursor-pointer">
                    <Trash2 size={16} />
                  </button>
                </div>
                <p className="text-body-s text-gray-400 mb-3">Size: 60 capsules</p>
                <div className="flex items-center justify-between mt-auto">
                  <QuantitySelector colorTheme="light" />
                  <div className="flex flex-col items-end">
                    <span className="text-body-m font-bold text-green-800">$39.99</span>
                    <span className="text-body-s text-gray-300 line-through">$49.99</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white border-t border-gray-100 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-body-m text-gray-500">
              <span>Subtotal (2 items)</span>
              <span className="text-green-800 font-medium">$79.98</span>
            </div>
            <div className="flex justify-between text-body-m text-gray-500">
              <span>Shipping</span>
              <span className="text-green-200 font-bold uppercase tracking-tight">Free</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center mb-4">
            <span className="text-body-l font-normal text-green-800 uppercase tracking-wider">Estimated total</span>
            <span className="text-h6 text-green-800 font-heading font-bold">$79.98</span>
          </div>

          <Button variant="primary" colorTheme="green" className="w-full">
            Checkout
          </Button>

          <p className="text-[10px] text-gray-400 text-center px-4 leading-relaxed">
            By continuing, I confirm that I have read and accept the <a href="#" className="underline hover:text-green-700">Terms of Service</a> and the <a href="#" className="underline hover:text-green-700">Privacy Policy</a>.
          </p>
        </div>
      </aside>
    </>
  );
};