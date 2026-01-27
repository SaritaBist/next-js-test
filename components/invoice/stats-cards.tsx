"use client";

import React from "react";
import { useInvoices } from "@/hooks/use-invoices";
import StatCard from "@/components/invoice/stat-card";

const StatsCards: React.FC = () => {
  const { data: invoicesData } = useInvoices();

  const invoices = invoicesData?.invoices ?? [];

  // Stats calculations
  const totalInvoices = invoices.length;
  const paidCount = invoices.filter((i) => i.status === "Paid").length;
  const unpaidCount = invoices.filter((i) => i.status === "Unpaid").length;
  const overdueCount = invoices.filter((i) => i.status === "Overdue").length;
  const totalAmount = invoices.reduce((sum, i) => sum + i.amount, 0);

  const statsData = [
    {
      title: "Total Invoices",
      value: totalInvoices,
      color: "default" as const,
    },
    {
      title: "Total Amount",
      value: `$${totalAmount.toFixed(2)}`,
      color: "blue" as const,
    },
    {
      title: "Paid",
      value: paidCount,
      color: "green" as const,
    },
    {
      title: "Unpaid",
      value: unpaidCount,
      color: "yellow" as const,
    },
    {
      title: "Overdue",
      value: overdueCount,
      color: "red" as const,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      {statsData.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          color={stat.color}
        />
      ))}
    </div>
  );
};

export default StatsCards;