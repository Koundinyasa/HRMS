// import { useState, type ReactNode } from "react";
// import { Outlet, useParams } from "react-router-dom";
// import LeaveSettingsTabs from "../components/LeaveSettingsTabs";

// export interface LeaveSettingsOutletContext {
//   setHeaderActions: (actions: ReactNode) => void;
// }

// export default function LeaveSettingsPage() {
//   const { domain } = useParams();
//   const [headerActions, setHeaderActions] = useState<ReactNode>(null);
//   const basePath = `/${domain}/admin/time-office/leave/settings`;

//   return (
//     <div className="w-full min-w-0 space-y-3">
//       <div className="mx-[20px] mt-[20px]">
//         <LeaveSettingsTabs basePath={basePath} actions={headerActions} />
//       </div>
//       <Outlet context={{ setHeaderActions } satisfies LeaveSettingsOutletContext} />
//     </div>
//   );
// }


import { useState, type ReactNode } from "react";
import { Outlet, useLocation } from "react-router-dom";

import LeaveSettingsTabs from "../components/LeaveSettingsTabs";

export interface LeaveSettingsOutletContext {
  setHeaderActions: (actions: ReactNode) => void;
}

export default function LeaveSettingsPage() {
  const { pathname } = useLocation();

  const [headerActions, setHeaderActions] = useState<ReactNode>(null);
  const settingsSuffix = "/time-office/leave/settings";
  const settingsIndex = pathname.lastIndexOf(settingsSuffix);
  const basePath =
    settingsIndex >= 0
      ? pathname.slice(0, settingsIndex + settingsSuffix.length)
      : "/admin/time-office/leave/settings";

  return (
    <div className="w-full min-w-0 space-y-3">
      <LeaveSettingsTabs
        basePath={basePath}
        actions={headerActions}
      />

      <Outlet
        key={pathname}
        context={{ setHeaderActions } satisfies LeaveSettingsOutletContext}
      />
    </div>
  );
}
