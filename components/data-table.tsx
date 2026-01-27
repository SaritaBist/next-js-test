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
import { ChevronUp, ChevronDown, ChevronsUpDown, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

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
  sortKey,
  sortDirection,
  isLoading = false,
  emptyMessage = "No data available.",
  title,
  description,
  emptyState,
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return
    let newDirection: SortDirection = "asc"
    if (sortKey === key) {
      if (sortDirection === "asc") newDirection = "desc"
      else if (sortDirection === "desc") newDirection = null
    }
    onSort(key, newDirection)
  }

  const getSortIcon = (key: string) => {
    if (sortKey !== key) return <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400 transition-colors" />
    if (sortDirection === "asc") return <ChevronUp className="ml-2 h-4 w-4 text-blue-600" />
    if (sortDirection === "desc") return <ChevronDown className="ml-2 h-4 w-4 text-blue-600" />
    return <ChevronsUpDown className="ml-2 h-4 w-4 text-gray-400" />
  }

  const totalPages = pagination && totalCount
    ? Math.ceil(totalCount / pagination.pageSize)
    : 1

  const startRecord = pagination ? (pagination.page - 1) * pagination.pageSize + 1 : 1
  const endRecord = pagination
    ? Math.min(pagination.page * pagination.pageSize, totalCount ?? data.length)
    : data.length

  return (
    <div className="w-full">
      {/* Header Section */}
      {(title || description) && (
        <div className="flex flex-col space-y-2 mb-4">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          )}
          {description && (
            <p className="text-gray-600">{description}</p>
          )}
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white rounded-t-xl shadow-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-50 hover:bg-blue-50 !border-none">
              {columns.map((col) => (
                <TableHead
                  key={String(col.key)}
                  className={cn(
                    "text-start h-12 text-blue-600 active:!bg-blue-100",
                    col.width ?? "",
                    col.align === "center" && "text-center",
                    col.align === "right" && "text-right"
                  )}
                >
                  {col.sortable ? (
                    <button
                      className="flex items-center hover:text-blue-600 transition-colors font-semibold text-blue-600"
                      onClick={() => handleSort(String(col.key))}
                    >
                      {col.header}
                      {getSortIcon(String(col.key))}
                    </button>
                  ) : (
                    <span className="font-semibold text-blue-600">{col.header}</span>
                  )}
                </TableHead>
              ))}
              {rowActions && rowActions.length > 0 && (
                <TableHead className="w-32 text-center text-blue-600 bg-blue-50">
                  <span className="font-semibold text-blue-600">Actions</span>
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
                      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
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
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className="group transition-colors hover:bg-gray-100 border-b border-gray-200"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={String(col.key)}
                      className={cn(
                        "text-[13px] border-t border-gray-200 transition-colors duration-150",
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
                    <TableCell className="text-center border border-gray-200 px-3">
                      <div className="flex items-center justify-center gap-1">
                        {rowActions.map((action, i) => (
                          <Button
                            key={i}
                            variant={action.variant ?? "ghost"}
                            size="sm"
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled}
                            className={cn(
                              "h-8 w-8 p-0 transition-all duration-200 hover:scale-105",
                              action.variant === "destructive" && "hover:bg-red-100 hover:text-red-700"
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

      {/* Enhanced Pagination - Always show */}
      <div className="flex items-center justify-between bg-white rounded-b-lg border-x border-b border-gray-200 px-4 py-3">
        <div className="text-sm text-blue-600">
          Showing results {data.length === 0 ? 0 : startRecord}-{endRecord} of {totalCount ?? data.length}
        </div>

        <div className="flex items-center gap-4">
          {/* Rows per page selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows</span>
            <select
              className="h-8 w-16 rounded-md border border-gray-300 bg-white px-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={pagination?.pageSize ?? 10}
              onChange={(e) => {
                // This would need to be handled by parent if needed
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          {/* Pagination controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination?.onPageChange((pagination?.page ?? 1) - 1)}
              disabled={!pagination || pagination.page <= 1}
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers */}
            {(() => {
              const currentPage = pagination?.page ?? 1
              const total = totalPages
              const pages: (number | string)[] = []

              if (total <= 5) {
                for (let i = 1; i <= total; i++) pages.push(i)
              } else {
                // Always show first 3 pages
                pages.push(1, 2, 3)
                
                if (currentPage > 4) {
                  pages.push('...')
                }
                
                // Show current page area if not in first 3
                if (currentPage > 3 && currentPage < total - 2) {
                  if (!pages.includes(currentPage)) pages.push(currentPage)
                }
                
                if (currentPage < total - 3) {
                  pages.push('...')
                }
                
                // Always show last page
                if (!pages.includes(total)) pages.push(total)
              }

              return pages.map((page, idx) => (
                page === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">...</span>
                ) : (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 text-sm font-medium",
                      currentPage === page
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() => pagination?.onPageChange(page as number)}
                  >
                    {String(page).padStart(2, '0')}
                  </Button>
                )
              ))
            })()}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => pagination?.onPageChange((pagination?.page ?? 1) + 1)}
              disabled={!pagination || (pagination?.page ?? 1) >= totalPages}
              className="h-8 w-8 p-0 text-gray-500 hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
