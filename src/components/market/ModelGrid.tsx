import { Search } from "lucide-react";
import type { Model } from "@/types/market";
import ModelCard from "./ModelCard";
import ModelCardSkeleton from "./ModelCardSkeleton";

interface ModelGridProps {
  models: Model[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  loading?: boolean;
}

export default function ModelGrid({
  models,
  searchQuery,
  onSearchChange,
  loading,
}: ModelGridProps) {
  return (
    <div className="flex-1">
      {/* Header + Search */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Tất cả Models</h2>
          <p className="text-sm text-muted-foreground">
            Tìm thấy {models.length} model
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm model..."
            className="h-10 w-full rounded-full border border-border bg-background-secondary pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none sm:w-60"
          />
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ModelCardSkeleton key={i} />
          ))}
        </div>
      ) : models.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {models.map((model) => (
            <ModelCard key={model.id} model={model} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-3 size-10 text-muted-foreground/50" />
          <p className="text-sm font-medium text-muted-foreground">
            Không tìm thấy model nào
          </p>
          <p className="text-xs text-muted-foreground/70">
            Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
}
