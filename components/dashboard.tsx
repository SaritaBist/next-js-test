"use client";

import { useState } from "react";
import Header from "@/components/header";
import { useProfile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import InvoiceForm from "@/components/invoice-form";
import StatsCards from "@/components/stats-cards";
import InvoiceList from "@/components/invoice-list";
import { Plus, X } from "lucide-react";

const DashboardComponent = () => {
  const { isLoading: profileLoading, error } = useProfile();
  const [showCreateForm, setShowCreateForm] = useState(false);

  if (profileLoading) return <div className="p-6">Loading profile...</div>;
  if (error)
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load profile.</p>
      </div>
    );

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-24 py-10">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here&apos;s an overview of your invoices.
            </p>
          </div>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Invoice
          </Button>
        </div>

        {/* Create Invoice Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-semibold">Create New Invoice</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-6">
                <InvoiceForm
                  onSuccess={() => setShowCreateForm(false)}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <StatsCards />

        {/* Invoices Table */}
        <InvoiceList />
      </main>
    </div>
  );
};

export default DashboardComponent;
