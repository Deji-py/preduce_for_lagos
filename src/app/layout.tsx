import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/context/UserContext";
import { UserLoadingProvider } from "@/components/user-loading-provider";
import { QueryProvider } from "@/context/QueryProvider";
import { Suspense } from "react";

const interFont = Inter({
  variable: "--next-inter",
  subsets: ["latin"],
});

const poppinsFont = Poppins({
  variable: "--next-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "100", "200", "300", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Produce For Lagos",
  description: "Produce For Lagos Registration Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${interFont.variable} ${poppinsFont.variable}  antialiased`}
      >
        <Suspense fallback="loading">
          <QueryProvider>
            <UserProvider>
              <UserLoadingProvider>
                <Toaster richColors />
                {children}
              </UserLoadingProvider>
            </UserProvider>
          </QueryProvider>
        </Suspense>
      </body>
    </html>
  );
}
