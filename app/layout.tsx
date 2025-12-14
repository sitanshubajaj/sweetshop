import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Sweet Shop Management",
  description: "Manage your sweet shop inventory and sales",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50">
        <AuthProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#333',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Navbar />
          <main className="pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
