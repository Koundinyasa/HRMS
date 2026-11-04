import { Suspense, useEffect, useRef, useState } from "react";

import { Outlet, useLocation, useParams } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import { useAppSelector } from "@/hooks/useAppSelector";
import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";
import SkeletonLoading from "@/components/ui/SkeletonLoading";
import { usePageTitle, titleFromMenus } from "@/hooks/usePageTitle";
import { useGetMenusQuery } from "@/features/employee/dashboard/api/dashboardApi";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chatbotOpen, setChatbotOpen] = useState(false);

  const [showBackToTop, setShowBackToTop] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const { domain } = useParams();
  const [settledPath, setSettledPath] = useState("");

  // Browser tab title: the name of the open menu.
  const { data: menuData } = useGetMenusQuery();
  const pathAfterDomain =
    domain && location.pathname.startsWith(`/${domain}`)
      ? location.pathname.slice(domain.length + 1)
      : location.pathname;
  usePageTitle(titleFromMenus(pathAfterDomain, menuData?.data ?? []));

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSettledPath(location.pathname);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [location.pathname]);

  const isInitialDataLoading = useAppSelector(
    (state) =>
      settledPath !== location.pathname ||
      state.employee.employeeInfo.pendingPageDataRequests > 0,
  );
  const isDashboard = location.pathname.endsWith("/employee/dashboard");
  const isPunchPage = location.pathname.endsWith("/employee/Punch");

  const handleMainScroll = () => {
    const main = mainRef.current;

    if (!main || !isDashboard) {
      setShowBackToTop(false);
      return;
    }

    setShowBackToTop(
      main.scrollTop + main.clientHeight >= main.scrollHeight - 4,
    );
  };

  const scrollToTop = () => {
    mainRef.current?.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="h-dvh w-full flex flex-col overflow-hidden">
      {/* Keyboard users can jump past the menus to the page content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-blue-700 focus:shadow-lg focus:ring-2 focus:ring-blue-500"
      >
        Skip to main content
      </a>

      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <div className="relative flex flex-1 min-h-0 min-w-0 overflow-hidden">

        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main
          ref={mainRef}
          id="main-content"
          tabIndex={-1}
          onScroll={handleMainScroll}
          className={`relative flex-1 min-w-0 min-h-0 ${
            isPunchPage
              ? "punch-scroll-container overflow-y-scroll"
              : "overflow-y-auto"
          } overflow-x-hidden bg-slate-100 p-3 focus:outline-none sm:p-4 lg:p-5`}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* Pages are loaded on demand; show the same skeleton while a page's code downloads. */}
          <Suspense fallback={<SkeletonLoading pathname={location.pathname} />}>
            {isDashboard ? (
              <Outlet />
            ) : (
              <div className="module-shell p-3 sm:p-4 lg:p-5">
                <Outlet />
              </div>
            )}
          </Suspense>
          {isInitialDataLoading && (
            <div className="absolute inset-0 z-10 overflow-y-auto bg-slate-100 p-3 sm:p-4 lg:p-5">
              <SkeletonLoading pathname={location.pathname} />
            </div>
          )}

          {isDashboard && showBackToTop && (
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Back to top"
              title="Back to top"
              className="fixed bottom-6 left-1/2 z-40 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full bg-[#1683ee] text-white shadow-lg transition hover:bg-[#0d6dcc] focus:outline-none focus:ring-2 focus:ring-[#1683ee] focus:ring-offset-2"
            >
              <ArrowUp size={20} strokeWidth={2.5} />
            </button>
          )}
        </main>

      </div>

      <ChatbotWidget
        isOpen={chatbotOpen}
        onToggle={() =>
          setChatbotOpen((prev) => !prev)
        }
      />
    </div>
  );
}