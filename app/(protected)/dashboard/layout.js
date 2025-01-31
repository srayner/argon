import { Suspense } from "react";
import { signOut } from "@/auth";
import { Menu } from "@/components/ui/sidebar/menu";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function DashboardLayout({ children }) {
  return (
    <div className="text-base h-screen grid grid-cols-[250px,1fr] grid-rows-[60px,1fr]">
      <header className="flex items-center justify-between bg-backgroundColor border-b border-separatorColor col-start-2 row-start-1 p-5">
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
      <section className="bg-primaryColor text-white col-span-1 row-span-2 p-2">
        <h1 className="p-2 text-center">Argon</h1>
        <Menu />
      </section>
      <main className="bg-backgroundColor p-5">
        <Breadcrumb />
        <Suspense>{children}</Suspense>
      </main>
    </div>
  );
}
