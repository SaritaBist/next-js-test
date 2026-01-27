"use client";

import React, { useState } from "react";
import { DataTable, Column, RowAction, SortDirection } from "@/components/common/data-table";
import { useInvoices, type Invoice } from "@/hooks/use-invoices";

const InvoiceList: React.FC = () => {
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices();

  const invoices = invoicesData?.invoices ?? [];

  // Column definitions for invoices
  const columns: Column<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice",
      sortable: true,
      width: "w-32",
    },
    {
      key: "customer",
      header: "Customer",
      sortable: true,
    },
    {
      key: "amount",
      header: "Amount",
      sortable: true,
      render: (row) => (
        <span className="font-medium">${row.amount.toFixed(2)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            row.status === "Paid"
              ? "bg-green-100 text-green-800"
              : row.status === "Unpaid"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "date",
      header: "Date",
      sortable: true,
      render: (row) => new Date(row.date).toLocaleDateString(),
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (row) => new Date(row.dueDate).toLocaleDateString(),
    },
  ];

  // Row actions
  const rowActions: RowAction<Invoice>[] = [
    {
      label: "View",
      onClick: (row) => alert(`Invoice: ${row.invoiceNumber}\nCustomer: ${row.customer}\nAmount: $${row.amount}\nDescription: ${row.description}`),
      variant: "ghost",
    },
  ];

  const handleSort = (key: string, direction: SortDirection) => {
    setSortKey(key);
    setSortDirection(direction);
  };

  // Stats calculations
  const totalInvoices = invoices.length;

  return (
    <DataTable<Invoice>
      data={invoices}
      columns={columns}
      totalCount={totalInvoices}
      rowActions={rowActions}
      sortKey={sortKey}
      sortDirection={sortDirection}
      onSort={handleSort}
      isLoading={invoicesLoading}
      title="All Invoices"
      description="Manage and track all your invoices in one place."
      emptyMessage="No invoices found. Create your first invoice to get started."
    />
  );
};

export default InvoiceList;