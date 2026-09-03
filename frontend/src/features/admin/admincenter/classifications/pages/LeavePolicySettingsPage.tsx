import { useNavigate, useParams } from "react-router-dom";
import ClassificationNavbar from "../components/ClassificationNavbar";
import LeavePolicyTopTabs from "../components/LeavePolicyTopTabs";
import LeavePolicyDetailSidebar from "../components/LeavePolicyDetailSidebar";
import LeaveBehaviorForm from "../components/LeaveBehaviorForm";
import LeaveHolidayWeeklyOffForm from "../components/LeaveHolidayWeeklyOffForm";
import { useLeavePolicy } from "../hooks/useLeavePolicy";
import { LEAVE_POLICY_SECTION_PATH } from "../constants/leavePolicy.constants";
import type { LeavePolicyGroupCode, LeavePolicySettingTabKey } from "../types/leavePolicy.types";

export default function LeavePolicySettingsPage() {
  const {
    domain,
    group = "employee",
    leaveCode = "",
    settingTab = "behavior",
  } = useParams();
  const navigate = useNavigate();
  const groupCode = group as LeavePolicyGroupCode;
  const activeSettingTab = settingTab as LeavePolicySettingTabKey;

  const { activeGroup, rows, getSettings, updateSettings, saveSettings, isSaving } =
    useLeavePolicy(groupCode);

  const leave = rows.find((r) => r.code === leaveCode) ?? rows[0];
  const settings = getSettings(leave?.code ?? "");

  const base = `/${domain}/admin/${LEAVE_POLICY_SECTION_PATH}`;
  const groupBase = `${base}/${groupCode}`;

  return (
    <div className="w-full">
      <ClassificationNavbar />

      <p className="px-4 sm:px-6 mt-4 text-xs text-gray-400">
        Classifications Summary / Leave Policy / {activeGroup.shortLabel} / Settings
      </p>

      <div className="mt-4 px-4 sm:px-6 pb-8 flex flex-col lg:flex-row gap-6 items-start">
        <LeavePolicyDetailSidebar
          groupName={activeGroup.name}
          leaveName={leave?.name ?? ""}
          activeTab={activeSettingTab}
          onSelectTab={(tab) => navigate(`${groupBase}/${leaveCode}/settings/${tab}`)}
          onAddGroup={() => {
            /* new policy group creation not wired to a backend endpoint yet */
          }}
        />

        <div className="flex-1 min-w-0 w-full bg-white rounded-xl shadow-sm overflow-hidden">
          <LeavePolicyTopTabs
            mode="edit"
            base={groupBase}
            onBack={() => navigate(groupBase)}
            onSave={() => saveSettings(leave?.code ?? "")}
            isSaving={isSaving}
          />

          <div className="p-5">
            {activeSettingTab === "behavior" ? (
              <LeaveBehaviorForm
                settings={settings}
                onChange={(patch) => leave && updateSettings(leave.code, patch)}
              />
            ) : (
              <LeaveHolidayWeeklyOffForm
                settings={settings}
                onChange={(patch) => leave && updateSettings(leave.code, patch)}
                leaveName={leave?.name ?? ""}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
