import { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SubSidebar from "./subSidebar";
import { SUB_NAV_REGISTRY } from "./subNav.registry";
import { SidebarProvider } from "./SidebarContext";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";
 
export default function AdminLayout() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { domain } = useParams();
  const location = useLocation();
 
  const afterAdmin = location.pathname.split(`/${domain}/admin/`)[1] ?? "";
  const section = afterAdmin.split("/")[0];
  const subNavItems = SUB_NAV_REGISTRY[section];
 
  return (
    <SidebarProvider>
      {/* Full viewport shell — nothing on this level scrolls */}
      <div className="flex h-screen flex-col overflow-hidden bg-[#F4F8FE]">
        <Navbar />
 
        {/* Below navbar: sidebars + main. min-h-0 lets children shrink and scroll */}
        <div className="flex min-h-0 flex-1">
          <Sidebar />
 
          {subNavItems && (
            <SubSidebar sectionPath={section} items={subNavItems} />
          )}
 
          {/* ONLY this area scrolls */}
          <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
 
      <ChatbotWidget
        isOpen={chatbotOpen}
        onToggle={() => setChatbotOpen((o) => !o)}
      />
    </SidebarProvider>
  );
}