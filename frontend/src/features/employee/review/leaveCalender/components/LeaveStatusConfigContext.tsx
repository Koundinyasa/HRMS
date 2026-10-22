import { createContext, useContext, type ReactNode } from "react";

export type StatusConfigMap = Record<string, { label: string; className: string }>;

const LeaveStatusConfigContext = createContext<StatusConfigMap>({});

export function LeaveStatusConfigProvider({
  value,
  children,
}: {
  value: StatusConfigMap;
  children: ReactNode;
}) {
  return (
    <LeaveStatusConfigContext.Provider value={value}>
      {children}
    </LeaveStatusConfigContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStatusConfigMap(): StatusConfigMap {
  return useContext(LeaveStatusConfigContext);
}