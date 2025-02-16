import { Suspense } from "react";
import { Menu } from "@/components/ui/sidebar/menu";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { handleSignOut } from "@/actions/logout";
export default function DashboardLayout({ children }) {
  return (
    <div className="text-base h-screen flex bg-backgroundColor">
      <section className="bg-sideMenu text-white w-64 p-2">
        <h1 className="p-2 text-white">📦 Argon</h1>
        <Menu />
      </section>

      <div className="flex-1">
        <div className="border-b border-separatorColor">
          <header className="max-w-[1920px] mx-auto flex items-center justify-between p-5">
            <span>Argon Stock Control System</span>

            {/* Signout form*/}
            <form action={handleSignOut}>
              <button type="submit">Log out</button>
            </form>
          </header>
        </div>

        <main className="max-w-[1920px] mx-auto p-5">
          <Breadcrumb />
          <Suspense>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
