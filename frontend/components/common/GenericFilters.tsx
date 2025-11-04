// components/common/GenericFilters.tsx
import { BaseFilters } from "@/lib/types/common";
import { Search, RotateCcw } from "lucide-react";

interface GenericFiltersProps<T extends BaseFilters> {
  filters: T;
  onFiltersChange: (filters: T) => void;
  onReset: () => void;
  children?: React.ReactNode;
}

export function GenericFilters<T extends BaseFilters>({
  filters,
  onFiltersChange,
  onReset,
  children,
}: GenericFiltersProps<T>) {
  const handleChange = (key: keyof T, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search - Common to all entities */}
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#1A1A40]" />
            <input
              type="text"
              placeholder="Search users..."
              value={filters.search || ""}
              onChange={(e) =>
                handleChange("search" as keyof T, e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm placeholder:text-[#1A1A40] text-[#1A1A40]"
            />
          </div>
        </div>

        {/* Entity-specific filters */}
        {children}

        {/* Sort - Common to all entities */}
        <div className="w-[140px]">
          <select
            value={filters.sortBy || "createdAt"}
            onChange={(e) => handleChange("sortBy" as keyof T, e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
          >
            <option value="createdAt">📅 Created Date</option>
            <option value="updatedAt">🔄 Updated Date</option>
          </select>
        </div>

        <div className="w-[120px]">
          <select
            value={filters.sortOrder || "DESC"}
            onChange={(e) =>
              handleChange(
                "sortOrder" as keyof T,
                e.target.value as "ASC" | "DESC"
              )
            }
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
          >
            <option value="DESC">↓ Newest</option>
            <option value="ASC">↑ Oldest</option>
          </select>
        </div>

        {/* Date Range - Common to all entities */}
        <div className="w-[150px]">
          <input
            type="date"
            placeholder="From date"
            value={filters.createdAfter || ""}
            onChange={(e) =>
              handleChange(
                "createdAfter" as keyof T,
                e.target.value || undefined
              )
            }
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm text-[#1A1A40]"
          />
        </div>

        <div className="w-[150px]">
          <input
            type="date"
            placeholder="To date"
            value={filters.createdBefore || ""}
            onChange={(e) =>
              handleChange(
                "createdBefore" as keyof T,
                e.target.value || undefined
              )
            }
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm text-[#1A1A40]"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1A40] rounded-lg font-medium transition-all text-sm border-2 border-gray-200"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>
    </div>
  );
}
