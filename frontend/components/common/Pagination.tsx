// components/common/Pagination.tsx
import { PaginationMeta } from "@/lib/types/common";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages, hasPreviousPage, hasNextPage, total } = pagination;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate range around current page
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      // Add ellipsis if needed
      if (start > 2) {
        pages.push("...");
      }

      // Add pages around current page
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Pagination Info */}
        <div className="text-sm text-gray-600">
          Showing page{" "}
          <span className="font-semibold text-[#2ECC71]">{page}</span> of{" "}
          <span className="font-semibold text-[#2ECC71]">{totalPages}</span> (
          <span className="font-semibold text-[#1A1A40]">{total}</span> total
          items)
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* First Page Button */}
          <button
            onClick={() => onPageChange(1)}
            disabled={!hasPreviousPage}
            className={`p-2 rounded-lg transition-all duration-200 ${
              !hasPreviousPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-[#1A1A40] hover:bg-[#2ECC71] hover:text-white hover:border-[#2ECC71] hover:shadow-md cursor-pointer"
            }`}
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>

          {/* Previous Page Button */}
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={!hasPreviousPage}
            className={`p-2 rounded-lg transition-all duration-200 ${
              !hasPreviousPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-[#1A1A40] hover:bg-[#2ECC71] hover:text-white hover:border-[#2ECC71] hover:shadow-md cursor-pointer"
            }`}
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page Numbers */}
          <div className="hidden sm:flex items-center gap-2">
            {getPageNumbers().map((pageNum, index) =>
              pageNum === "..." ? (
                <span
                  key={`ellipsis-${index}`}
                  className="px-3 py-1 text-gray-400"
                >
                  ...
                </span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum as number)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                    page === pageNum
                      ? "bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white shadow-md"
                      : "bg-white border border-gray-300 text-[#1A1A40] hover:bg-gray-50 hover:border-[#2ECC71]  cursor-pointer"
                  }`}
                >
                  {pageNum}
                </button>
              )
            )}
          </div>

          {/* Mobile Page Indicator */}
          <div className="sm:hidden px-4 py-2 bg-gradient-to-r from-[#2ECC71] to-[#27AE60] text-white rounded-lg font-semibold">
            {page} / {totalPages}
          </div>

          {/* Next Page Button */}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={!hasNextPage}
            className={`p-2 rounded-lg transition-all duration-200 ${
              !hasNextPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-[#1A1A40] hover:bg-[#2ECC71] hover:text-white hover:border-[#2ECC71] hover:shadow-md cursor-pointer"
            }`}
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Last Page Button */}
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
            className={`p-2 rounded-lg transition-all duration-200 ${
              !hasNextPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border border-gray-300 text-[#1A1A40] hover:bg-[#2ECC71] hover:text-white hover:border-[#2ECC71] hover:shadow-md cursor-pointer"
            }`}
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
