"use client";
import { useState } from "react";
import Header from "@/components/dashboard/header";
import { useProfile } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InvoiceForm from "@/components/invoice/invoice-form";
import StatsCards from "@/components/invoice/stats-cards";
import InvoiceList from "@/components/invoice/invoice-list";
import { Plus } from "lucide-react";

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <Header />

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-24 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Here&apos;s an overview of your invoices.
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 h-11 px-6"
          >
            <Plus className="h-5 w-5" />
            New Invoice
          </Button>
        </div>

        {/* Create Invoice Form Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Create New Invoice
              </DialogTitle>
            </DialogHeader>
            <InvoiceForm
              onSuccess={() => setShowCreateForm(false)}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Stats Cards */}
        <StatsCards />

        {/* Invoices Table */}
        <InvoiceList />
      </main>
    </div>
  );
};

export default DashboardComponent;
