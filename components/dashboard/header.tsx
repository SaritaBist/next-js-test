"use client";

import { useProfile, useLogout } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { data, isLoading } = useProfile();
  const logout = useLogout();

  const username = data?.user?.username || "User";

  return (
    <header className="w-full bg-linear-to-r from-blue-600 via-purple-600 to-blue-700 shadow-lg sticky top-0 z-40 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-24">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md">
                <LayoutDashboard className="h-6 w-6 text-blue-600" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">InvoiceApp</span>
            </div>
            
            {/* Divider */}
            <div className="h-8 w-px bg-white/30 hidden sm:block" />
            
            {/* Welcome message */}
            <div className="hidden sm:flex items-center gap-2 text-white/90">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isLoading ? "Loading..." : username}
              </span>
            </div>
          </div>

          <div className="flex items-center">
            <Button 
              variant="ghost"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="text-white hover:bg-white/20 hover:text-white font-medium transition-all duration-200 h-10 px-4"
            >
              <LogOut className="h-4 w-4" />
              {logout.isPending ? "Signing out..." : "Logout"}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
