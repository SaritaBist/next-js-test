"use client";

import { useProfile, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Header() {
  const { data, isLoading } = useProfile();
  const logout = useLogout();

  const username = data?.user?.username || "User";

  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-xl font-bold text-primary">InvoiceApp</span>
            <span className="text-gray-300">|</span>
            <h1 className="text-base text-gray-700">
              {isLoading ? "Loading..." : `Welcome, ${username}`}
            </h1>
          </div>

          <div className="flex items-center">
            <Button 
              variant="secondary" 
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-xs font-medium"
            >
              <LogOut className="h-2 w-2" />
              {logout.isPending ? "Signing out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
