import { useState } from "react";
import { Outlet, useLocation, useParams} from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SubSidebar from "./subSidebar";
import { SUB_NAV_REGISTRY } from "./subNav.registry";
import { SidebarProvider } from "./SidebarContext";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

export default function AdminLayout() {

  const [chatbotOpen,setChatbotOpen] =useState(false);
  const { domain } = useParams();
  const location = useLocation();

  const afterAdmin = location.pathname.split(`/${domain}/admin/`)[1] ?? "";
  const section = afterAdmin.split("/")[0];

  const subNavItems = SUB_NAV_REGISTRY[section];

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F4F8FE]">
        <Navbar />
        <div className="flex">
          <Sidebar />
          {subNavItems && <SubSidebar sectionPath={section} items={subNavItems} />}
          <main className="flex-1 min-w-0 p-4 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <ChatbotWidget
        isOpen={chatbotOpen}
        onToggle={()=>setChatbotOpen((o)=>!o)}
      />
    </SidebarProvider>
  );
}