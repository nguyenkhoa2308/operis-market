import { taskCategories } from "@/data/filter-categories";
import FilterTag from "./FilterTag";

interface FilterPanelProps {
  activeTab: "tasks" | "providers";
  onTabChange: (tab: "tasks" | "providers") => void;
  selectedFilters: Set<string>;
  onFilterToggle: (filterId: string) => void;
  onClearAll: () => void;
}

export default function FilterPanel({
  activeTab,
  onTabChange,
  selectedFilters,
  onFilterToggle,
  onClearAll,
}: FilterPanelProps) {
  const taskCount = taskCategories.reduce(
    (sum, cat) => sum + cat.options.length,
    0,
  );

  return (
    <div>
      {/* Tabs */}
      <div className="mb-5 flex overflow-hidden rounded-full bg-muted">
        <button
          type="button"
          onClick={() => onTabChange("tasks")}
          className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "tasks"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Tasks ({taskCount})
        </button>
        <button
          type="button"
          onClick={() => onTabChange("providers")}
          className={`flex-1 cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "providers"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Providers (0)
        </button>
      </div>

      {/* Filter categories */}
      {activeTab === "tasks" && (
        <div className="space-y-5">
          {taskCategories.map((category) => (
            <div key={category.id}>
              <h4 className="mb-2.5 text-sm font-semibold text-foreground">
                {category.label}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.options.map((option) => (
                  <FilterTag
                    key={option.id}
                    label={option.label}
                    isActive={selectedFilters.has(option.id)}
                    onClick={() => onFilterToggle(option.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "providers" && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          Sắp ra mắt
        </p>
      )}

      {/* Clear all */}
      {selectedFilters.size > 0 && (
        <div className="mt-5 pt-4">
          <button
            type="button"
            onClick={onClearAll}
            className="cursor-pointer text-sm font-medium text-primary transition-colors hover:text-primary-hover"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
