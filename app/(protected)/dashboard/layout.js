"use client";

import React, { Suspense, useState } from "react";
import Menu from "@/components/ui/sidebar/menu";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { handleSignOut } from "@/actions/logout";
export default function DashboardLayout({ children }) {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="text-base h-screen flex bg-backgroundColor">
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-[9999] md:hidden transition-opacity duration-300 ease-in-out ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)} // Close sidebar when overlay is clicked
      />

      <section
        className={`bg-sideMenu text-white w-64 p-2 transition-all duration-300 ease-in-out 
    ${
      isSidebarOpen
        ? "translate-x-0 opacity-100"
        : "-translate-x-full opacity-0"
    } 
    absolute left-0 top-0 h-full md:relative md:translate-x-0 md:opacity-100 z-[10000]`}
      >
        <button
          className="absolute top-2 right-2 p-2 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          ✖
        </button>
        <h1 className="p-2 text-white">📦 Argon</h1>
        <Menu
          onSelect={() => {
            setSidebarOpen(false);
          }}
        />
      </section>

      <div className="flex-1">
        <div className="border-b border-separatorColor">
          <header className="max-w-[1920px] mx-auto flex items-center justify-between p-5">
            <button
              className="md:hidden p-2"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
              ☰
            </button>
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
