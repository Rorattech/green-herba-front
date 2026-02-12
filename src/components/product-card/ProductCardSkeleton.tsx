"use client";

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col bg-transparent w-full h-full animate-pulse">
      <div className="relative aspect-square lg:aspect-4/5 w-full bg-gray-200 mb-4 shrink-0 rounded-lg" />
      <div className="flex flex-col flex-1 items-center text-center px-2">
        <div className="h-5 bg-gray-200 rounded w-4/5 mx-auto mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/5 mx-auto mb-2" />
        <div className="flex items-center justify-center gap-1 mb-2">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-3 h-3 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="w-6 h-3 bg-gray-200 rounded ml-1" />
        </div>
        <div className="mt-auto w-full flex flex-col items-center pt-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-5 w-16 bg-gray-200 rounded" />
            <div className="h-5 w-12 bg-gray-100 rounded" />
          </div>
          <div className="h-12 w-full bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
