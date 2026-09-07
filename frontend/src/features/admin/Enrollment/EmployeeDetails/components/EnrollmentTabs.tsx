import { useNavigate, useLocation, useParams } from "react-router-dom";
 
export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";
 
const TAB_ITEMS = [
  { label: "Employee", segment: "" },
  { label: "Employee Group", segment: "employee-group" },
  { label: "Pending Candidate", segment: "pending-candidates" },
  { label: "Organization Chart", segment: "organization-chart" },
  { label: "Reset Blocked User", segment: "reset-blocked-user" },
  { label: "Import", segment: "import" },
] as const;
 
const EnrollmentTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { domain } = useParams();
 
  const basePath = `/${domain}/admin/enrollment`;
 
  const getPath = (segment: string) =>
    segment ? `${basePath}/${segment}` : basePath;
 
  const isActive = (segment: string) => {
    const path = getPath(segment);
 
    if (!segment) {
      return (
        location.pathname === path ||
        location.pathname === `${path}/` ||
        location.pathname.startsWith(`${path}/employee/`)
      );
    }
 
    return (
      location.pathname === path ||
      location.pathname.startsWith(`${path}/`)
    );
  };
 
  return (
    <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
      <div className="flex items-center gap-6 overflow-x-auto">
        {TAB_ITEMS.map((tab) => {
          const active = isActive(tab.segment);
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => navigate(getPath(tab.segment))}
              className={`relative whitespace-nowrap py-3 text-[13px] transition-colors ${
                active
                  ? "font-semibold text-[#2D8CF0]"
                  : "font-medium text-[#5B6B80] hover:text-[#2B3A55]"
              }`}
            >
              {tab.label}
              {active && (
                <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t bg-[#2D8CF0]" />
              )}
            </button>
          );
        })}
      </div>
 
      <div
        id={ENROLLMENT_ACTIONS_SLOT_ID}
        className="flex shrink-0 items-center gap-2.5"
      />
    </div>
  );
};
 
export default EnrollmentTabs;