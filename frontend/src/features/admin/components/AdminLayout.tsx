// import { useState } from "react";
// import { Outlet, useLocation, useParams} from "react-router-dom";
// import Navbar from "./Navbar";
// import Sidebar from "./Sidebar";
// import SubSidebar from "./subSidebar";
// import { SUB_NAV_REGISTRY } from "./subNav.registry";
// import { SidebarProvider } from "./SidebarContext";
// import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

// export default function AdminLayout() {

//   const [chatbotOpen,setChatbotOpen] =useState(false);
//   const { domain } = useParams();
//   const location = useLocation();

//   const afterAdmin = location.pathname.split(`/${domain}/admin/`)[1] ?? "";
//   const section = afterAdmin.split("/")[0];
//   console.log({ pathname: location.pathname, domain, afterAdmin, section }); 

//   const subNavItems = SUB_NAV_REGISTRY[section];

//   return (
//     <SidebarProvider>
//       <div className="min-h-screen bg-[#F4F8FE]">
//         <Navbar />
//         <div className="flex">
//           <Sidebar />
//           {subNavItems && <SubSidebar sectionPath={section} items={subNavItems} />}
//           <main className="flex-1 min-w-0 p-4 lg:p-6">
//             <Outlet />
//           </main>
//         </div>
//       </div>

//       <ChatbotWidget
//         isOpen={chatbotOpen}
//         onToggle={()=>setChatbotOpen((o)=>!o)}
//       />
//     </SidebarProvider>
//   );
// }


import { useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import SubSidebar from "./subSidebar";
import { SUB_NAV_REGISTRY } from "./subNav.registry";
import { SidebarProvider } from "./SidebarContext";

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

  const { domain } = useParams<{ domain: string }>();
  const location = useLocation();

  const afterAdmin =
    location.pathname.split(`/${domain}/admin/`)[1] ?? "";

  const section = afterAdmin.split("/")[0];

  const subNavItems = SUB_NAV_REGISTRY[section];

  return (
    <SidebarProvider>
      {/* Full viewport shell */}
      <div className="flex h-screen flex-col overflow-hidden bg-[#F4F8FE]">
        <Navbar />

        {/* Below navbar: sidebars + main */}
        <div className="flex min-h-0 flex-1">
          <Sidebar />

          {subNavItems && (
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
            <Outlet />
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