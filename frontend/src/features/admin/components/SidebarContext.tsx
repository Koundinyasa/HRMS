
// import { createContext, useContext, useState, type ReactNode} from "react";

// interface SidebarContextType {
//   isOpen: boolean;
//   toggleSidebar: () => void;
// }

// const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// export function SidebarProvider({ children }: { children: ReactNode }) {
//   const [isOpen, setIsOpen] = useState(true);
//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   return (
//     <SidebarContext.Provider value={{ isOpen, toggleSidebar }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// }

// export function useSidebar() {
//   const context = useContext(SidebarContext);
//   if (!context) throw new Error("useSidebar must be used within a SidebarProvider");
//   return context;
// }

/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextType {
  isOpen: boolean;
  subSidebarOpen: boolean;
  toggleSidebar: () => void;
  toggleSubSidebar: () => void;
  closeSubSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768,
  );
  const [subSidebarOpen, setSubSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const toggleSubSidebar = () => setSubSidebarOpen((prev) => !prev);
  const closeSubSidebar = () => setSubSidebarOpen(false);
  const closeSidebar = closeSubSidebar;

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggleSidebar,
        subSidebarOpen,
        toggleSubSidebar,
        closeSubSidebar,
        closeSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error(
      "useSidebar must be used within a SidebarProvider"
    );
  }

  return context;
}