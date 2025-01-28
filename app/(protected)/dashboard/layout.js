import { Suspense } from "react";
import { signOut } from "@/auth";
import { Menu } from "@/components/ui/sidebar/menu";
import Breadcrumb from "@/components/ui/Breadcrumb";
import styles from "./layout.module.css";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <span>Argon Stock Control System</span>

        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button type="submit">Log out</button>
        </form>
      </header>
      <section className={styles.sidebar}>
        <h1 className={styles.heading}>Argon</h1>
        <Menu />
      </section>
      <main className={styles.main}>
        <Breadcrumb />
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}
