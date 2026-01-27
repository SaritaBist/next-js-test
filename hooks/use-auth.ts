"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi, clearTokens, type SignUpData, type SignInData, type AuthResponse, type ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// React Query keys
export const authKeys = {
  all: ['auth'] as const,
  profile: () => [...authKeys.all, 'profile'] as const,
};

// Sign Up Mutation
export const useSignUp = () => {
  const router = useRouter();

  return useMutation<AuthResponse, ApiError, SignUpData>({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      toast.success(data.message || "Account created successfully! Please sign in.");
      // Redirect to sign-in after successful registration
      router.push("/sign-in");
    },
    onError: (error) => {
      console.error("Sign up error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
};

// Sign In Mutation
export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, ApiError, SignInData>({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
      toast.success(data.message || "Signed in successfully!");
      // Invalidate and refetch user data
      queryClient.invalidateQueries({ queryKey: authKeys.profile() });
      // Redirect to dashboard
      router.push("/dashboard");
    },
    onError: (error) => {
      console.error("Sign in error:", error);
      toast.error(error.message || "Sign in failed. Please check your credentials.");
    },
  });
};

// Get User Profile Query
export const useProfile = () => {
  return useQuery<AuthResponse, ApiError>({
    queryKey: authKeys.profile(),
    queryFn: authApi.getProfile,
    enabled: typeof window !== "undefined" && !!localStorage.getItem("authToken"),
    retry: false,
  });
};

// Logout Mutation
export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearTokens();
      queryClient.clear(); // Clear all cached data
      router.push("/sign-in");
    },
    onError: () => {
      // Force logout even if API call fails
      clearTokens();
      queryClient.clear();
      router.push("/sign-in");
    },
  });
};

// Helper hook to check if user is authenticated
export const useIsAuthenticated = () => {
  const { data, isLoading } = useProfile();
  return {
    isAuthenticated: !!data?.user,
    user: data?.user,
    isLoading,
  };
};