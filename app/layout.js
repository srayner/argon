"use client";

import "./globals.css";
import styles from "./layout.module.css";
import Menu from "./ui/sidebar/menu";
import { Inter } from "next/font/google";
import { usePathname } from "next/navigation";

const inter = Inter({
  weight: "400",
  subsets: ["latin"],
});

// export const metadata = {
//   title: "Argon",
//   description: "Stock Control System",
// };

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className={styles.container}>
          <header className={styles.header}>
            <span>Argon</span>
          </header>
          <section className={styles.sidebar}>
            <h1 className={styles.heading}>Argon</h1>
            <Menu currentPage={pathname} />
          </section>
          <main className={styles.main}>{children}</main>
        </div>
      </body>
    </html>
  );
}
