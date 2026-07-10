import { useEffect, useState } from "react";

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { loadTheme } from "./theme";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] =useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <div className="h-screen flex flex-col">

      <Navbar
  isSidebarOpen={isSidebarOpen}
  setIsSidebarOpen={setIsSidebarOpen}
/>

      <div className="flex flex-1 overflow-hidden">

        <Sidebar
  isSidebarOpen={isSidebarOpen}
/>

        <main
          className="
            flex-1
            overflow-y-auto
            p-5
            bg-slate-100
          "
        >
          <Outlet />
        </main>

      </div>

    </div>
  );
}