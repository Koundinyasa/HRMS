import { useEffect } from "react";

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { loadTheme } from "./theme";

export default function Layout() {

  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <div className="h-screen flex flex-col">

      <Navbar />

      <div className="flex flex-1 overflow-hidden">

        <Sidebar />

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