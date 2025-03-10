import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import "./globals.css";
import { ToastProvider } from "@/components/ToastContext";
import Toast from "@/components/ui/Toast";

const fontSans = FontSans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Argon",
  description: "Stock Control System",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ToastProvider>
          {children}
          <Toast />
        </ToastProvider>
      </body>
    </html>
  );
}
