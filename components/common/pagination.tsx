"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  startRecord: number;
  endRecord: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  totalCount,
  pageSize,
  startRecord,
  endRecord,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      // Always show last page
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  return (
    <div className="flex items-center justify-between bg-slate-50 border-x border-b border-slate-200 px-6 py-4 rounded-b-2xl shadow-sm">
      {/* Results info */}
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-600">
          Showing{" "}
          <span className="font-bold text-my-app-primary">
            {totalCount === 0 ? 0 : startRecord}-{endRecord}
          </span>{" "}
          of{" "}
          <span className="font-bold text-my-app-primary">
            {totalCount}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Rows per page selector */}
        {onPageSizeChange && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Rows</span>
            <select
              className="h-9 px-3 rounded-lg border-2 border-slate-200 bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-my-app-primary focus:border-my-app-primary transition-all hover:border-slate-300 cursor-pointer"
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        )}

        {/* Pagination controls */}
        <div className="flex items-center gap-2">
          {/* Previous button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="h-9 w-9 p-0 rounded-lg transition-all hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {pages.map((page, idx) =>
              page === "..." ? (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-gray-400 font-medium select-none"
                >
                  ...
                </span>
              ) : (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  className={cn(
                    "h-9 min-w-9 px-3 text-sm font-semibold rounded-lg transition-all",
                    currentPage === page
                      ? "bg-my-app-primary hover:opacity-90 text-white shadow-lg hover:shadow-xl transform hover:scale-105"
                      : "text-gray-600 hover:bg-purple-50"
                  )}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )
            )}
          </div>

          {/* Next button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="h-9 w-9 p-0 rounded-lg transition-all hover:bg-purple-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}
