"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { invoiceApi, type Invoice, type InvoicesResponse, type CreateInvoiceData, type ApiError } from "@/lib/api"

// Re-export types for convenience
export type { Invoice, InvoicesResponse, CreateInvoiceData }

// Query keys
export const invoiceKeys = {
  all: ["invoices"] as const,
  list: () => [...invoiceKeys.all, "list"] as const,
}

// Fetch invoices hook
export function useInvoices() {
  return useQuery<InvoicesResponse, ApiError>({
    queryKey: invoiceKeys.list(),
    queryFn: invoiceApi.getAll,
    staleTime: 30000, // 30 seconds
  })
}

// Create invoice hook
export function useCreateInvoice() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string; invoice: Invoice }, ApiError, CreateInvoiceData>({
    mutationFn: invoiceApi.create,
    onSuccess: () => {
      // Invalidate and refetch invoices list
      queryClient.invalidateQueries({ queryKey: invoiceKeys.list() })
    },
  })
}
