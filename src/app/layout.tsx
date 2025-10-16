import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from '@/components/providers/apollo-provider'
import { ThemeProvider } from '@/context/theme-provider'
import { AuthProvider } from '@/context/auth-provider'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mongolec Admin",
  description: "Admin dashboard for Mongolec CMS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <ApolloProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ApolloProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
