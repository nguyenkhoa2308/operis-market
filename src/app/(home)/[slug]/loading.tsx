export default function ModelDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-8 pt-20 sm:px-6 lg:pb-10">
      {/* Header skeleton */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="size-12 animate-pulse rounded-xl bg-accent" />
          <div>
            <div className="h-6 w-40 animate-pulse rounded-full bg-accent" />
            <div className="mt-2 h-4 w-24 animate-pulse rounded-full bg-accent" />
          </div>
        </div>
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-accent" />
        <div className="mt-2 h-4 w-3/4 max-w-lg animate-pulse rounded-full bg-accent" />
        {/* Status bar skeleton */}
        <div className="mt-8 flex gap-0.5">
          {Array.from({ length: 48 }).map((_, i) => (
            <div key={i} className="h-8 flex-1 animate-pulse rounded-[2px] bg-accent" />
          ))}
        </div>
      </div>

      {/* Tabs skeleton */}
      <div className="mb-6 flex gap-4 border-b border-border pb-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-5 w-24 animate-pulse rounded-full bg-accent" />
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-0 rounded-xl border border-border lg:grid-cols-2">
        <div className="space-y-4 border-r border-border p-6">
          <div className="h-5 w-16 animate-pulse rounded-full bg-accent" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-accent" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-accent" />
          <div className="h-10 w-full animate-pulse rounded-lg bg-accent" />
        </div>
        <div className="space-y-4 p-6">
          <div className="h-5 w-16 animate-pulse rounded-full bg-accent" />
          <div className="aspect-video w-full animate-pulse rounded-xl bg-accent" />
        </div>
      </div>
    </div>
  );
}
