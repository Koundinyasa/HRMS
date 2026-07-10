import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { SidebarProvider } from "./SidebarContext";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F4F8FE]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-w-0 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}