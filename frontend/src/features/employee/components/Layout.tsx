import { useRef, useState } from "react";

import { Outlet, useLocation } from "react-router-dom";
import { ArrowUp } from "lucide-react";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chatbotOpen, setChatbotOpen] = useState(false);

  const [showBackToTop, setShowBackToTop] = useState(false);

  const mainRef = useRef<HTMLElement>(null);
  const location = useLocation();
  const isDashboard = location.pathname.endsWith("/employee/dashboard");

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
    <div className="h-screen w-full flex flex-col overflow-hidden">

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
          onScroll={handleMainScroll}
          className="
    flex-1
    min-w-0
    min-h-0
    overflow-y-auto
    overflow-x-hidden
    bg-slate-100
    p-3
    sm:p-4
    lg:p-5
  "
        >
          {isDashboard ? (
            <Outlet />
          ) : (
            <div className="module-shell p-3 sm:p-4 lg:p-5">
              <Outlet />
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