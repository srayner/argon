"use client";

import "./globals.css";
import styles from "./layout.module.css";
import Menu from "./ui/sidebar/menu";
import Breadcrumbs from "./ui/breadcrumbs/breadcrumbs";
import { Inter as FontSans } from "next/font/google";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <div className={styles.container}>
          <header className={styles.header}>
            <span>Argon Stock Control System</span>
          </header>
          <section className={styles.sidebar}>
            <h1 className={styles.heading}>Argon</h1>
            <Menu currentPage={pathname} />
          </section>
          <main className={styles.main}>
            <Breadcrumbs />
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
