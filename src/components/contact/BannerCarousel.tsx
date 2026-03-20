"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { cn } from "@/src/utils/cn";

export function BannerCarousel({
  images,
  alt,
  intervalMs = 6000,
  className,
}: {
  images: string[];
  alt: string;
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);

  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const safeIntervalMs = Number.isFinite(intervalMs) ? intervalMs : 6000;

  useEffect(() => {
    if (!safeImages.length) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    if (prefersReducedMotion) return;

    const id = window.setInterval(() => {
      setIndex((current) => (current + 1) % safeImages.length);
    }, safeIntervalMs);

    return () => window.clearInterval(id);
  }, [safeImages.length, safeIntervalMs]);

  if (!safeImages.length) return null;

  return (
    <div className={cn("absolute inset-0", className)} aria-hidden="true">
      {safeImages.map((src, i) => {
        const isActive = i === index;
        return (
          <div
            key={src}
            className={cn(
              "absolute inset-0 transition-opacity duration-700 ease-in-out",
              isActive ? "opacity-100" : "opacity-0"
            )}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        );
      })}
    </div>
  );
}

