import { useState } from "react";
import { Bookmark, ChevronDown, ExternalLink, X } from "lucide-react";

export interface NewLeaveDefinition {
  leaveName: string;
  shortName: string;
  showForSelectedEmployees: string;
  affectSalary: boolean;
  allot: boolean;
  leave: boolean;
}

interface AddLeaveDefinitionModalProps {
  onClose: () => void;
  onSave: (definition: NewLeaveDefinition) => void;
}

export default function AddLeaveDefinitionModal({ onClose, onSave }: AddLeaveDefinitionModalProps) {
  const [leaveName, setLeaveName] = useState("");
  const [shortName, setShortName] = useState("");
  const [showForSelectedEmployees, setShowForSelectedEmployees] = useState("");
  const [affectSalary, setAffectSalary] = useState(false);
  const [allot, setAllot] = useState(true);
  const [leave, setLeave] = useState(true);
  const [error, setError] = useState("");
  const flags: { key: string; label: string; checked: boolean; setChecked: (value: boolean) => void }[] = [
    { key: "affectSalary", label: "Affect Salary", checked: affectSalary, setChecked: setAffectSalary },
    { key: "allot", label: "Allot", checked: allot, setChecked: setAllot },
    { key: "leave", label: "Leave", checked: leave, setChecked: setLeave },
  ];

  const handleSave = () => {
    if (!leaveName.trim() || !shortName.trim()) {
      setError("Leave Name and Short Name are required.");
      return;
    }
    onSave({
      leaveName: leaveName.trim(),
      shortName: shortName.trim().toUpperCase(),
      showForSelectedEmployees,
      affectSalary,
      allot,
      leave,
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section role="dialog" aria-modal="true" aria-labelledby="add-leave-definition-title" className="w-full max-w-[575px] overflow-hidden rounded-[9px] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.2)]">
        <header className="flex h-[62px] items-center border-b border-[#E6EAF0] px-5">
          <h2 id="add-leave-definition-title" className="font-urbanist text-[21px] font-semibold text-[#172033]">Add Leave Type</h2>
        </header>

        <div className="space-y-5 px-5 py-5 sm:px-[22px]">
          <label className="block font-urbanist text-[15px] font-medium text-[#172033]">
            Leave Name<span className="text-red-500">*</span>
            <input autoFocus value={leaveName} onChange={(event) => setLeaveName(event.target.value)} placeholder="Casual Leave" className="mt-1 h-[47px] w-full rounded-[7px] border border-[#269BD7] bg-[#F3F5FA] px-4 text-[15px] text-[#172033] outline-none ring-1 ring-[#269BD7]/20 placeholder:text-[#BFC9DA] focus:ring-2 focus:ring-[#269BD7]/30" />
          </label>

          <label className="block font-urbanist text-[15px] font-medium text-[#172033]">
            Short Name<span className="text-red-500">*</span>
            <input value={shortName} onChange={(event) => setShortName(event.target.value)} placeholder="CL" maxLength={8} className="mt-1 h-[47px] w-full rounded-[7px] border border-[#E1E6EF] bg-[#E9EDF5] px-4 text-[15px] uppercase text-[#172033] outline-none placeholder:text-[#BFC9DA] focus:border-[#269BD7]" />
          </label>

          <div>
            <label htmlFor="leave-employee-visibility" className="mb-1 block font-urbanist text-[15px] font-medium text-[#172033]">Show leave only for selected employees</label>
            <div className="flex items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <select id="leave-employee-visibility" value={showForSelectedEmployees} onChange={(event) => setShowForSelectedEmployees(event.target.value)} className="h-[47px] w-full appearance-none rounded-[7px] border border-[#263244] bg-[#F3F5FA] px-4 pr-10 font-urbanist text-[15px] text-[#263244] outline-none focus:ring-2 focus:ring-[#269BD7]/25">
                  <option value="">Select Show leave only for selected employees</option>
                  <option value="All Employees">All Employees</option>
                  <option value="Selected Employees">Selected Employees</option>
                </select>
                <ChevronDown size={17} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#697586]" />
              </div>
              <button type="button" disabled={showForSelectedEmployees !== "Selected Employees"} title="Choose employees" aria-label="Choose employees" className="shrink-0 text-[#269BD7] disabled:opacity-50">
                <ExternalLink size={24} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-3 pt-1">
            {flags.map((flag) => (
              <label key={flag.key} className="flex cursor-pointer items-center gap-3 font-urbanist text-[15px] text-[#263244]">
                <input type="checkbox" checked={flag.checked} onChange={(event) => flag.setChecked(event.target.checked)} className="h-[19px] w-[19px] accent-[#269BD7]" />
                {flag.label}
              </label>
            ))}
          </div>
          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        </div>

        <footer className="flex justify-end gap-3 border-t border-[#E6EAF0] bg-[#F5F7FB] px-5 py-3.5 sm:px-[22px]">
          <button type="button" onClick={onClose} className="flex h-[49px] items-center gap-2 rounded-[7px] border border-[#AAB3C1] bg-white px-5 font-urbanist text-[16px] font-medium text-[#667085] hover:bg-slate-50"><X size={18} />Close</button>
          <button type="button" onClick={handleSave} className="flex h-[49px] items-center gap-2 rounded-[7px] bg-[#269BD7] px-5 font-urbanist text-[16px] font-semibold text-white hover:bg-[#168BC7]"><Bookmark size={18} />Save</button>
        </footer>
      </section>
    </div>
  );
}
