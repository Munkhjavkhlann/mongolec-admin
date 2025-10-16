"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GetMeDocument } from "@/__generated__/graphql";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@apollo/client/react";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearUser, setLoading, isLoading, isAuthenticated } =
    useAuthStore();

  // Always try to fetch current user data (cookies will be sent automatically)
  const {
    data: userData,
    error,
    loading,
  } = useQuery(GetMeDocument, {
    errorPolicy: "all", // Don't throw on GraphQL errors
    notifyOnNetworkStatusChange: true,
  });

  // Update loading state
  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  // Update user in store when data is fetched
  useEffect(() => {
    if (userData?.me) {
      setUser(userData.me);
    } else if (error && !loading) {
      // If there's an error and we're not loading, user is not authenticated
      console.log("Failed to fetch user data:", error);
      clearUser();

      // Redirect to sign-in if not already on an auth page
      const isAuthPage = pathname?.includes("/sign-in") ||
                         pathname?.includes("/sign-up") ||
                         pathname?.includes("/forgot-password") ||
                         pathname?.includes("/otp");

      if (!isAuthPage) {
        const redirectUrl = `/sign-in?redirect=${encodeURIComponent(
          pathname || "/"
        )}`;
        router.push(redirectUrl);
      }
    }
  }, [userData, error, loading, setUser, clearUser, router, pathname]);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
