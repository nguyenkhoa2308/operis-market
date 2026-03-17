import ModelCardSkeleton from "@/components/market/ModelCardSkeleton";

export default function MarketLoading() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:pt-8">
      {/* Banner skeleton */}
      <div className="h-[280px] w-full animate-pulse rounded-xl bg-accent" />

      <div className="flex gap-6">
        {/* Sidebar skeleton */}
        <aside className="hidden w-[300px] shrink-0 rounded-2xl border border-border p-5 lg:block">
          <div className="mb-6 h-10 w-48 animate-pulse rounded-full bg-accent" />
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="mb-3 h-4 w-28 animate-pulse rounded-full bg-accent" />
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-9 w-20 animate-pulse rounded-full bg-accent" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Grid skeleton */}
        <div className="min-w-0 flex-1">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="h-6 w-32 animate-pulse rounded-full bg-accent" />
              <div className="mt-1 h-4 w-24 animate-pulse rounded-full bg-accent" />
            </div>
            <div className="h-10 w-60 animate-pulse rounded-full bg-accent" />
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <ModelCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
