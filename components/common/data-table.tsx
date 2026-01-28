"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronDown, ChevronsUpDown, Eye, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Pagination } from "@/components/common/pagination"

// ─────────────────────────────────────────────────────────────
// Enhanced Types
// ─────────────────────────────────────────────────────────────

export type SortDirection = "asc" | "desc" | null

export interface Column<T = unknown> {
  /** Unique key matching the data property */
  key: keyof T | string
  /** Header label */
  header: string
  /** Enable sorting for this column */
  sortable?: boolean
  /** Custom cell renderer */
  render?: (row: T, index: number) => React.ReactNode
  /** Column width (Tailwind class, e.g. "w-32") */
  width?: string
  /** Column alignment */
  align?: "left" | "center" | "right"
}

export interface RowAction<T = unknown> {
  label: string
  onClick: (row: T) => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  icon?: React.ReactNode
  disabled?: boolean
}

export interface PaginationConfig {
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export interface DataTableProps<T = unknown> {
  /** Array of data to display */
  data: T[]
  /** Column definitions */
  columns: Column<T>[]
  /** Total count of records (for pagination info) */
  totalCount?: number
  /** Pagination configuration (optional) */
  pagination?: PaginationConfig
  /** Row actions (buttons rendered in last column) */
  rowActions?: RowAction<T>[]
  /** Called when sort changes */
  onSort?: (key: string, direction: SortDirection) => void
  /** Current sort state */
  sortKey?: string
  sortDirection?: SortDirection
  /** Loading state */
  isLoading?: boolean
  /** Empty state message */
  emptyMessage?: string
  /** Table title */
  title?: string
  /** Table description */
  description?: string
  /** Custom empty state component */
  emptyState?: React.ReactNode
}

// ─────────────────────────────────────────────────────────────
// Enhanced DataTable Component
// ─────────────────────────────────────────────────────────────

export function DataTable<T>({
  data,
  columns,
  totalCount,
  pagination,
  rowActions,
  onSort,
  sortKey: externalSortKey,
  sortDirection: externalSortDirection,
  isLoading = false,
  emptyMessage = "No data available.",
  title,
  description,
  emptyState,
}: DataTableProps<T>) {
  // Internal pagination state when pagination prop is not provided
  const [internalPage, setInternalPage] = React.useState(1);
  const [internalPageSize] = React.useState(10);

  // Internal sorting state
  const [internalSortKey, setInternalSortKey] = React.useState<string>("");
  const [internalSortDirection, setInternalSortDirection] = React.useState<SortDirection>(null);

  // Use external or internal sort state
  const sortKey = externalSortKey ?? internalSortKey;
  const sortDirection = externalSortDirection ?? internalSortDirection;

  // Use provided pagination or internal state
  const currentPage = pagination?.page ?? internalPage;
  const currentPageSize = pagination?.pageSize ?? internalPageSize;
  const handlePageChange = pagination?.onPageChange ?? setInternalPage;

  // Sort data internally
  const sortedData = React.useMemo(() => {
    if (!sortKey || !sortDirection) return data;

    return [...data].sort((a, b) => {
      const aValue = (a as Record<string, unknown>)[sortKey];
      const bValue = (b as Record<string, unknown>)[sortKey];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [data, sortKey, sortDirection]);

  // Auto-paginate data if no pagination config provided
  const shouldAutoPaginate = !pagination;
  const paginatedData = shouldAutoPaginate 
    ? sortedData.slice((currentPage - 1) * currentPageSize, currentPage * currentPageSize)
    : sortedData;

  const handleSort = (key: string) => {
    let newDirection: SortDirection = "asc"
    if (sortKey === key) {
      if (sortDirection === "asc") newDirection = "desc"
      else if (sortDirection === "desc") newDirection = null
    }
    
    // Update internal state
    setInternalSortKey(key);
    setInternalSortDirection(newDirection);
    
    // Call external handler if provided
    if (onSort) {
      onSort(key, newDirection);
    }
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-300 transition-colors" />
    if (sortDirection === "asc") return <ChevronUp className="ml-2 h-4 w-4 text-my-app-primary" />
    if (sortDirection === "desc") return <ChevronDown className="ml-2 h-4 w-4 text-my-app-primary" />
    return <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-300" />
  }

  const totalPages = Math.ceil((totalCount ?? data.length) / currentPageSize);

  const startRecord = (currentPage - 1) * currentPageSize + 1;
  const endRecord = Math.min(currentPage * currentPageSize, totalCount ?? data.length);

  return (
    <div className="w-full">
      {/* Header Section */}
      {(title || description) && (
        <div className="flex flex-col space-y-2 mb-6">
          {title && (
            <h2 className="text-2xl font-bold text-my-app-primary">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600 text-sm">{description}</p>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-t-2xl shadow-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-800 hover:bg-slate-800 border-none!">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={cn(
                    "text-start h-14 text-white",
                    col.width ?? "",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {col.sortable ? (
                    <button
                      className="flex items-center hover:opacity-80 transition-colors font-semibold text-white"
                      onClick={() => handleSort(String(col.key))}
                    >
                      {col.header}
                      {getSortIcon(String(col.key))}
                    </button>
                  ) : (
                    <span className="font-semibold text-white">{col.header}</span>
                  )}
                </TableHead>
              ))}
              {rowActions && rowActions.length > 0 && (
                <TableHead className="w-32 text-center text-white bg-slate-700">
                  <span className="font-semibold text-white">Actions</span>
                </TableHead>
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="relative">
                      <div className="w-8 h-8 border-4 border-purple-200 border-t-my-app-primary rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-500 font-medium">Loading data...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (rowActions ? 1 : 0)}
                  className="h-32 text-center"
                >
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500 font-medium">{emptyMessage}</p>
                        <p className="text-gray-400 text-sm mt-1">Try adjusting your filters or create new records.</p>
                      </div>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="group transition-all duration-200 hover:bg-purple-50/50 border-b border-gray-100 last:border-0"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className={cn(
                        "text-sm py-4 text-gray-700 font-medium transition-colors duration-150",
                        col.align === "center" && "text-center",
                        col.align === "right" && "text-right"
                      )}
                    >
                      {col.render
                        ? col.render(row, rowIndex)
                        : String((row as Record<string, unknown>)[col.key as string] ?? "-")}
                    </TableCell>
                  ))}
                  {rowActions && rowActions.length > 0 && (
                    <TableCell className="text-center px-3 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {rowActions.map((action, i) => (
                          <Button
                            key={i}
                            variant={action.variant ?? "ghost"}
                            size="sm"
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled}
                            className={cn(
                              "h-9 w-9 p-0 transition-all duration-200 hover:scale-110 rounded-lg shadow-sm",
                              action.variant === "destructive" && "hover:bg-red-50 hover:text-red-600 hover:border-red-200",
                              action.variant === "ghost" && "hover:bg-purple-50 text-my-app-primary"
                            )}
                          >
                            {action.icon || (
                              <>
                                {action.label === "View" && <Eye className="h-4 w-4" />}
                                {action.label === "Edit" && <Edit className="h-4 w-4" />}
                                {action.label === "Delete" && <Trash2 className="h-4 w-4" />}
                              </>
                            )}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount ?? data.length}
        pageSize={currentPageSize}
        startRecord={startRecord}
        endRecord={endRecord}
        onPageChange={handlePageChange}
        onPageSizeChange={undefined}
      />
    </div>
  )
}
