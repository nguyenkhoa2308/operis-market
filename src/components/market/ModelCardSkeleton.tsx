export default function ModelCardSkeleton() {
  return (
    <div className="relative flex aspect-[4/3] overflow-hidden rounded-xl bg-accent">
      {/* Gradient overlay like real card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

      {/* Bottom content */}
      <div className="relative mt-auto w-full p-4">
        {/* Provider */}
        <div className="h-3 w-14 animate-pulse rounded-full bg-muted-foreground/20" />
        {/* Model name */}
        <div className="mt-2.5 h-4 w-36 animate-pulse rounded-full bg-muted-foreground/25" />
        {/* Tags */}
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-muted-foreground/15" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-muted-foreground/15" />
          <div className="h-6 w-14 animate-pulse rounded-full bg-muted-foreground/15" />
        </div>
      </div>
    </div>
  );
}
