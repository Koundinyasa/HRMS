import { useState } from "react";

import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

import ChatbotWidget from "@/features/chatbot/components/ChatbotWidget";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [chatbotOpen, setChatbotOpen] = useState(false);

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
          className="
    flex-1
    min-w-0
    min-h-0
    overflow-y-auto
    overflow-x-hidden
    p-3
    sm:p-4
    lg:p-5
    bg-slate-100
  "
        >
          <Outlet />
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