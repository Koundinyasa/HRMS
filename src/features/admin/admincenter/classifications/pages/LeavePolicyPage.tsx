import { useNavigate, useParams } from "react-router-dom";
import ClassificationNavbar from "../components/ClassificationNavbar";
import LeavePolicyTopTabs from "../components/LeavePolicyTopTabs";
import LeavePolicySidebarPanel from "../components/LeavePolicySidebarPanel";
import LeavePolicyTable from "../components/LeavePolicyTable";
import { useLeavePolicy } from "../hooks/useLeavePolicy";
import { LEAVE_POLICY_SECTION_PATH } from "../constants/leavePolicy.constants";
import type { LeavePolicyGroupCode } from "../types/leavePolicy.types";

export default function LeavePolicyPage() {
  const { domain, group = "employee" } = useParams();
  const navigate = useNavigate();
  const groupCode = group as LeavePolicyGroupCode;

  const { groups, activeGroup, rows, toggleActive, deleteLeave } = useLeavePolicy(groupCode);

  const base = `/${domain}/admin/${LEAVE_POLICY_SECTION_PATH}`;

  // Selecting a policy group (e.g. "Intern Leave Policy") switches the
  // table below to that group's leaves.
  const goToGroupSettings = (code: LeavePolicyGroupCode) => {
    navigate(`${base}/${code}`);
  };

  return (
    <div className="w-full">
      <ClassificationNavbar />

      <p className="px-4 sm:px-6 mt-4 text-xs text-gray-400">
        Classifications Summary / Leave Policy / {activeGroup.shortLabel}
      </p>

      <div className="mt-4 px-4 sm:px-6 pb-8 flex flex-col lg:flex-row gap-6 items-start">
        <LeavePolicySidebarPanel
          groups={groups}
          selectedCode={groupCode}
          onSelect={goToGroupSettings}
          onAdd={() => {
            /* new policy group creation not wired to a backend endpoint yet */
          }}
        />

        <div className="flex-1 min-w-0 w-full bg-white rounded-xl shadow-sm overflow-hidden">
          <LeavePolicyTopTabs
            base={`${base}/${groupCode}`}
            addLabel={`Add Leaves To ${activeGroup.name}`}
            onAdd={() => {
              /* add-leaves modal not wired to a backend endpoint yet */
            }}
          />

          <div className="overflow-x-auto">
            <LeavePolicyTable
              rows={rows}
              onToggleActive={toggleActive}
              onSettings={(row) => navigate(`${base}/${groupCode}/${row.code}/settings/behavior`)}
              onDelete={deleteLeave}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
