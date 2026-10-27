




import { Outlet, useParams } from "react-router-dom";
import TabBar from "@/features/admin/components/TabBar";
import { SETTINGS_TABS } from "../constants/settingsconstants";

/**
 * One place that decides the font for every Settings module
 * (Payroll, Reminder, Email, Tenant).
 *
 * - `company-details-theme` is the same theme class CompanyDetailsPage uses,
 *   so Settings picks up the identical Company styling.
 * - Urbanist is set on the wrapper, and the `[&_...]:font-[inherit]` rules force
 *   form controls (input / textarea / select / button), which do NOT inherit
 *   the font by default, to use it as well.
 */
export default function SettingsPage() {
  const { domain } = useParams();
  const basePath = `/${domain}/admin/admin-center/settings`;

  return (
    <div
      className="company-details-theme w-full max-w-full overflow-x-hidden bg-[#F6F3FF] px-2 pb-6 font-['Urbanist',_sans-serif]
        [&_input]:font-[inherit] [&_textarea]:font-[inherit] [&_select]:font-[inherit] [&_button]:font-[inherit] [&_label]:font-[inherit]
        sm:px-4 md:px-6"
    >
      <TabBar basePath={basePath} tabs={SETTINGS_TABS} />

      <div className="w-full min-w-0 max-w-full">
        <Outlet />
      </div>
    </div>
  );
}