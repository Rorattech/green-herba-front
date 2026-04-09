"use client";

import Link from "next/link";
import Image from "next/image";

const TOOLTIP = "Não tem receita? Clique aqui!";

/**
 * FAB inferior direito: leva ao FAQ sobre receita e parceiro Mãe Terra (/about).
 */
export function FloatingPrescriptionHelpButton() {
  return (
    <div className="fixed bottom-5 right-5 z-85 md:bottom-8 md:right-8">
      <div className="group relative inline-block">
        <span
          role="tooltip"
          className="pointer-events-none absolute top-1/2 right-full z-10 mr-3 w-[min(18rem,calc(100vw-6rem))] -translate-y-1/2 rounded-md bg-green-800 px-4 py-3 text-center text-body-m font-medium leading-snug text-green-100 opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {TOOLTIP}
          <span
            className="absolute top-1/2 left-full -translate-y-1/2 border-y-[6px] border-y-transparent border-l-[6px] border-l-green-800"
            aria-hidden
          />
        </span>
        <Link
          href="/about#duvidas-receita-mae-terra"
          aria-label={TOOLTIP}
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white shadow-md ring-1 ring-black/5 transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700"
        >
          <Image
            src="/assets/favicon.png"
            alt=""
            width={40}
            height={40}
            className="size-10 object-contain"
          />
        </Link>
      </div>
    </div>
  );
}
