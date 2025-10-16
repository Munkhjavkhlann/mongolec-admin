"use client";

import { ApolloProvider as ApolloClientProvider } from "@apollo/client/react";
import { apolloClient } from "@/lib/apollo";

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <ApolloClientProvider client={apolloClient}>
      {children}
    </ApolloClientProvider>
  );
}
