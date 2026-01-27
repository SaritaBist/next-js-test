"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useProfile } from "@/hooks/use-auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  ),
}) => {
  const router = useRouter();
  const { data, isLoading, isError } = useProfile();

  useEffect(() => {
    // If not loading and there's an error or no user data, redirect to sign-in
    if (!isLoading && (isError || !data?.user)) {
      router.push("/sign-in");
    }
  }, [isLoading, isError, data, router]);

  // Show fallback while loading
  if (isLoading) {
    return <>{fallback}</>;
  }

  // Show fallback if no user (before redirect completes)
  if (isError || !data?.user) {
    return <>{fallback}</>;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default ProtectedRoute;
