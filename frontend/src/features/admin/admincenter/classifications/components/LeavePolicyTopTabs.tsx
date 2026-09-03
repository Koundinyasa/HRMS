import { NavLink } from "react-router-dom";
import { Plus, Clock, ChevronLeft, Save } from "lucide-react";
import { LEAVE_POLICY_TOP_TABS } from "../constants/leavePolicy.constants";

interface AddModeProps {
  mode?: "add";
  base: string;
  addLabel: string;
  onAdd: () => void;
}

interface EditModeProps {
  mode: "edit";
  base: string;
  onBack: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export default function LeavePolicyTopTabs(props: AddModeProps | EditModeProps) {
  const { base } = props;

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap px-5 py-3 border-b border-gray-100">
      <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
        {LEAVE_POLICY_TOP_TABS.map((tab) => (
          <NavLink
            key={tab.key}
            to={tab.key === "policy" ? base : `${base}/${tab.key}`}
            end={tab.key === "policy"}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-violet-600 hover:bg-white"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {props.mode === "edit" ? (
          <>
            <button
              type="button"
              onClick={props.onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              <ChevronLeft size={16} /> Back
            </button>
            <button
              type="button"
              onClick={props.onSave}
              disabled={props.isSaving}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
            >
              <Save size={15} /> {props.isSaving ? "Saving..." : "Save"}
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={props.onAdd}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap"
          >
            <Plus size={16} /> {props.addLabel}
          </button>
        )}
        <Clock size={18} className="text-gray-400 hover:text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
}
