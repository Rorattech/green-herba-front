"use client";

export default function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-8">
        <div className="flex gap-2">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-4 bg-gray-200 rounded" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-start">
        <div className="space-y-4">
          <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-4 h-4 bg-gray-200 rounded" />
                ))}
              </div>
              <div className="h-4 w-24 bg-gray-100 rounded" />
            </div>
            <div className="h-9 w-3/4 bg-gray-200 rounded" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-6 w-16 bg-gray-100 rounded" />
            </div>
          </div>

          <div className="h-20 bg-gray-200 rounded-lg" />

          <div className="space-y-2">
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-full bg-gray-100 rounded" />
            <div className="h-4 w-4/5 bg-gray-100 rounded" />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-gray-200 rounded-full" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>

          <div className="flex gap-4">
            <div className="h-14 w-32 bg-gray-200 rounded-lg" />
            <div className="h-14 flex-1 bg-gray-200 rounded-lg" />
          </div>

          <div className="h-4 w-48 bg-gray-100 rounded" />

          <div className="divide-y divide-gray-100 space-y-4 pt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pt-4 first:pt-0">
                <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-4 w-full bg-gray-100 rounded" />
                <div className="h-4 w-5/6 bg-gray-100 rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
