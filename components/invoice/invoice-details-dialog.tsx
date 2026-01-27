"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Invoice } from "@/hooks/use-invoices";
import {
  Calendar,
  User,
  DollarSign,
  FileText,
  Package,
  Hash,
  Clock,
} from "lucide-react";

interface InvoiceDetailsDialogProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
}

export function InvoiceDetailsDialog({
  invoice,
  isOpen,
  onClose,
}: InvoiceDetailsDialogProps) {
  if (!invoice) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "overdue":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto bg-white border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Invoice Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Invoice Number and Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Hash className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Invoice Number</p>
                <p className="text-lg font-semibold text-slate-900">
                  {invoice.invoiceNumber}
                </p>
              </div>
            </div>
            <div
              className={`px-3 rounded-full border font-semibold ${getStatusColor(
                invoice.status
              )}`}
            >
              <span className="text-xs font-medium  ">{invoice.status.toUpperCase()}</span>
            </div>
          </div>

          {/* Customer, Amount, and Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">Customer</h3>
              </div>
              <p className="text-lg font-semibold text-slate-900 ml-11">
                {invoice.customer}
              </p>
            </div>

            {/* Amount */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">
                  Total Amount
                </h3>
              </div>
              <p className="text-lg font-semibold text-slate-900 ml-11">
                ${invoice.amount.toFixed(2)}
              </p>
            </div>

            {/* Issue Date */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">
                  Issue Date
                </h3>
              </div>
              <p className="text-lg font-semibold text-slate-900 ml-11">
                {new Date(invoice.date).toLocaleDateString()}
              </p>
            </div>

            {/* Due Date */}
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">Due Date</h3>
              </div>
              <p className="text-lg font-semibold text-slate-900 ml-11">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Description */}
          {invoice.description && (
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-sm font-medium text-slate-600">
                  Description
                </h3>
              </div>
              <p className="text-slate-900 ml-11">{invoice.description}</p>
            </div>
          )}

          {/* Items */}
          {invoice.items && invoice.items.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Package className="h-5 w-5 text-cyan-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Items</h3>
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-300">
                <table className="min-w-full divide-y divide-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {invoice.items.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                          {item.item}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {item.qty}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                          ${(item.qty * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Total Summary */}
          <div className="flex justify-end pt-4 border-t border-slate-300">
            <div className="text-right">
              <p className="text-sm text-slate-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ${invoice.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
