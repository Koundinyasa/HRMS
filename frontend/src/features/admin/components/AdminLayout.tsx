import { Suspense, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SubSidebar from "./subSidebar";
import { SidebarProvider } from "./SidebarContext";
import { useAdminMenus } from "./adminMenus";
import AdminRouteGuard from "./AdminRouteGuard";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";
import PageLoader from "@/shared/components/PageLoader";
import { usePageTitle, titleFromMenus } from "@/hooks/usePageTitle";
import { useGetDashboardSummaryQuery } from "../dashboard/api/dashboardApi";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <AdminLayoutContent />
    </SidebarProvider>
  );
}

function AdminLayoutContent() {
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { domain } = useParams();
  const location = useLocation();

  const afterAdmin =
    location.pathname.split(`/${domain}/admin/`)[1] ?? "";

  const section = afterAdmin.split("/")[0];

  const { sections } = useAdminMenus();

  // Browser tab title: the name of the open menu.
  const { data: summary } = useGetDashboardSummaryQuery();
  const pathAfterDomain =
    domain && location.pathname.startsWith(`/${domain}`)
      ? location.pathname.slice(domain.length + 1)
      : location.pathname;
  usePageTitle(titleFromMenus(pathAfterDomain, summary?.menus ?? []));

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
            <AdminRouteGuard>
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
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