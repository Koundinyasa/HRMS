import { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import { Menu } from "lucide-react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SubSidebar from "./subSidebar";
import { SidebarProvider, useSidebar } from "./SidebarContext";
import { useAdminMenus } from "./adminMenus";
import AdminRouteGuard from "./AdminRouteGuard";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}

function AdminLayoutContent() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { toggleSubSidebar } = useSidebar();
  const { domain } = useParams();
  const location = useLocation();

  const afterAdmin =
    location.pathname.split(`/${domain}/admin/`)[1] ?? "";

  const section = afterAdmin.split("/")[0];

  const { sections } = useAdminMenus();

  // Second-level menu of this section, from the database menus.
  const subNavItems =
    sections.find((s) => s.path.toLowerCase() === section.toLowerCase())?.items ?? [];

  return (
    <>
      {/* Full viewport shell — nothing on this level scrolls */}
      <div className="flex h-screen flex-col overflow-hidden bg-[#F4F8FE]">
        <Navbar />

        {/* Below navbar: sidebars + main */}
        <div className="flex min-h-0 flex-1">
          <Sidebar />

          {subNavItems.length > 0 && (
            <SubSidebar
              sectionPath={section}
              items={subNavItems}
            />
          )}

          {/* Only the main content area scrolls */}
          <main className="min-w-0 flex-1 overflow-y-auto p-4 lg:p-6">
            {section === "talent-hub" && (
              <button
                type="button"
                onClick={toggleSubSidebar}
                aria-label="Open Recruitment sections"
                className="mb-3 inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm md:hidden"
              >
                <Menu className="h-4 w-4" />
                Recruitment sections
              </button>
            )}
            <AdminRouteGuard>
              <Outlet />
            </AdminRouteGuard>
          </main>
        </div>
      </div>

      <ChatbotWidget
        isOpen={chatbotOpen}
        onToggle={() =>
          setChatbotOpen((open) => !open)
        }
      />
    </>
  );
}