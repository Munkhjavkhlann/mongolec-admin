"use client";

import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { GET_ME } from "@/graphql/queries/auth";
import { useAuthStore } from "@/stores/auth-store";
import { useQuery } from "@apollo/client/react";

type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
};

interface GetMeData {
  me: {
    id: string
    email: string
    firstName: string
    lastName: string
    isActive: boolean
    createdAt: string
    updatedAt: string
    tenant?: { id: string; slug: string; name: string } | null
    roles?: { id: string; role: { id: string; name: string } }[]
  } | null
}

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
  } = useQuery<GetMeData>(GET_ME, {
    fetchPolicy: "cache-first",
    errorPolicy: "all",
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
    } else if (!loading) {
      // If query completed and no user data, user is not authenticated
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
  }, [userData, loading, setUser, clearUser, router, pathname]);

  return (
    <AuthContext.Provider value={{ isLoading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
