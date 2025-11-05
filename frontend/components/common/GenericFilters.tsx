// components/common/GenericFilters.tsx - PRODUCTION VERSION
"use client";

import type React from "react";

import type { BaseFilters } from "@/lib/types/common";
import { Search, RotateCcw, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

interface GenericFiltersProps<T extends BaseFilters> {
  filters: T;
  onFiltersChange: (filters: T) => void;
  onReset: () => void;
  children?: React.ReactNode;
  searchPlaceholder?: string; // 🔥 Make search placeholder dynamic
}

export function GenericFilters<T extends BaseFilters>({
  filters,
  onFiltersChange,
  onReset,
  children,
  searchPlaceholder = "Search...",
}: GenericFiltersProps<T>) {
  // 🔥 LOCAL STATE for search input (for debouncing)
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);

  // 🔥 DEBOUNCED SEARCH - Only update filters after user stops typing
  useEffect(() => {
    setIsSearching(true);

    // Set a timer to update the actual filter after 500ms
    const timer = setTimeout(() => {
      if (searchValue !== filters.search) {
        handleChange("search" as keyof T, searchValue || undefined);
      }
      setIsSearching(false);
    }, 500); // 500ms debounce

    // Cleanup: Cancel the timer if user types again
    return () => clearTimeout(timer);
  }, [searchValue]); // Only re-run when searchValue changes

  // 🔥 SYNC local state with prop changes (when filters are reset)
  useEffect(() => {
    setSearchValue(filters.search || "");
  }, [filters.search]);

  const handleChange = (key: keyof T, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* 🔥 SEARCH - With debounce */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Search
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#1A1A40]" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue} // 🔥 Use local state
              onChange={(e) => setSearchValue(e.target.value)} // 🔥 Update local state only
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm placeholder:text-gray-400 text-[#1A1A40]"
            />
            {isSearching && searchValue && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#2ECC71] text-white">
                  Searching...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Entity-specific filters */}
        {children}

        {/* 🔥 SORT - Common to all entities */}
        <div className="w-[160px]">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Sort By
          </label>
          <select
            value={filters.sortBy || "createdAt"}
            onChange={(e) => handleChange("sortBy" as keyof T, e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
            aria-label="Sort by"
          >
            <option value="createdAt">📅 Created Date</option>
            <option value="updatedAt">🔄 Updated Date</option>
          </select>
        </div>

        <div className="w-[120px]">
          <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
            Sort Order
          </label>
          <select
            value={filters.sortOrder || "DESC"}
            onChange={(e) =>
              handleChange(
                "sortOrder" as keyof T,
                e.target.value as "ASC" | "DESC"
              )
            }
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none bg-white text-sm font-medium text-[#1A1A40]"
            aria-label="Sort order"
          >
            <option value="DESC">↓ Newest</option>
            <option value="ASC">↑ Oldest</option>
          </select>
        </div>

        {/* 🔥 DATE RANGE - With labels and better UX */}
        <div className="flex items-center gap-2">
          {/* From Date */}
          <div className="w-[170px]">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
              <Calendar className="w-3 h-3 inline mr-1" />
              From Date
            </label>
            <input
              type="date"
              value={filters.createdAfter || ""}
              onChange={(e) =>
                handleChange(
                  "createdAfter" as keyof T,
                  e.target.value || undefined
                )
              }
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm text-[#1A1A40]"
              aria-label="Filter from date"
            />
          </div>

          {/* To Date */}
          <div className="w-[170px]">
            <label className="block text-xs font-medium text-gray-600 mb-1 ml-1">
              <Calendar className="w-3 h-3 inline mr-1" />
              To Date
            </label>
            <input
              type="date"
              value={filters.createdBefore || ""}
              onChange={(e) =>
                handleChange(
                  "createdBefore" as keyof T,
                  e.target.value || undefined
                )
              }
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#2ECC71] focus:border-[#2ECC71] transition-all outline-none text-sm text-[#1A1A40]"
              aria-label="Filter to date"
            />
          </div>
        </div>

        {/* 🔥 RESET BUTTON - With counter */}
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1A1A40] rounded-lg font-medium transition-all text-sm border-2 border-gray-200 cursor-pointer
          sm:mt-5
          "
          aria-label="Reset filters"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
          {/* 🔥 ACTIVE FILTERS COUNTER */}
          {(() => {
            const activeFiltersCount = Object.entries(filters).filter(
              ([key, value]) =>
                value !== undefined &&
                value !== null &&
                value !== "" &&
                key !== "sortBy" &&
                key !== "sortOrder"
            ).length;
            return activeFiltersCount > 0 ? (
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#2ECC71] text-white text-xs font-bold">
                {activeFiltersCount}
              </span>
            ) : null;
          })()}
        </button>
      </div>

      {/* 🔥 ACTIVE FILTERS DISPLAY - Show what's being filtered */}
      {(() => {
        const activeFilters = Object.entries(filters).filter(
          ([key, value]) =>
            value !== undefined &&
            value !== null &&
            value !== "" &&
            key !== "sortBy" &&
            key !== "sortOrder"
        );

        return activeFilters.length > 0 ? (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-600">
                Active filters:
              </span>
              {activeFilters.map(([key, value]) => (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-[#2ECC71] bg-opacity-10 text-white text-xs font-medium rounded-md border border-[#2ECC71]"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          </div>
        ) : null;
      })()}
    </div>
  );
}
