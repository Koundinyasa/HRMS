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

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface SidebarContextType {
  sidebarOpen: boolean;
  subSidebarOpen: boolean;
  toggleSidebar: () => void;
  openSubSidebar: () => void;
  closeSubSidebar: () => void;
  closeAllSidebars: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(
  undefined
);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [subSidebarOpen, setSubSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const openSubSidebar = () => {
    setSidebarOpen(false);
    setSubSidebarOpen(true);
  };

  const closeSubSidebar = () => {
    setSubSidebarOpen(false);
  };

  const closeAllSidebars = () => {
    setSidebarOpen(false);
    setSubSidebarOpen(false);
  };

  return (
    <SidebarContext.Provider
      value={{
        sidebarOpen,
        subSidebarOpen,
        toggleSidebar,
        openSubSidebar,
        closeSubSidebar,
        closeAllSidebars,
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