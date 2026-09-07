import { useState } from "react";
import {
  CalendarCheck,
  UserCircle2,
  Fingerprint,
  Percent,
  FileText,
  Clock,
  UserX,
  Headphones,
  CalendarX,
  CreditCard,
  UserMinus,
  MapPin,
  Wallet,
  Plus,
  Save,
  History,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { validateModuleSettings } from "../validations/workflowValidations";

interface ModuleItem {
  key: string;
  label: string;
  icon: typeof CalendarCheck;
}

const LEFT_MODULES: ModuleItem[] = [
  { key: "leaveApply", label: "Leave Apply", icon: CalendarCheck },
  { key: "employeeProfile", label: "Employee Profile", icon: UserCircle2 },
  { key: "punches", label: "Punches", icon: Fingerprint },
  { key: "incomeTax", label: "Income Tax", icon: Percent },
  { key: "reimbursement", label: "Reimbursement", icon: FileText },
  { key: "timeSheet", label: "Time Sheet", icon: Clock },
  { key: "resignationCancellation", label: "Resignation Cancellation", icon: UserX },
];

const RIGHT_MODULES: ModuleItem[] = [
  { key: "helpDesk", label: "Help Desk", icon: Headphones },
  { key: "leaveCancellation", label: "Leave Cancellation", icon: CalendarX },
  { key: "advance", label: "Advance", icon: CreditCard },
  { key: "resignation", label: "Resignation", icon: UserMinus },
  { key: "ta", label: "TA", icon: MapPin },
  { key: "loan", label: "Loan", icon: Wallet },
];

const DEFAULT_ENABLED: Record<string, boolean> = {
  leaveApply: true,
  employeeProfile: true,
  punches: true,
  incomeTax: false,
  reimbursement: false,
  timeSheet: false,
  resignationCancellation: false,
  helpDesk: false,
  leaveCancellation: false,
  advance: false,
  resignation: false,
  ta: false,
  loan: false,
};

type Platform = "HRMS" | "ESS";

function ModuleCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
        checked
          ? "border-violet-600 bg-violet-600"
          : "border-gray-300 bg-white"
      }`}
    >
      {checked && (
        <svg
          width={12}
          height={12}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={3}
        >
          <path d="M5 13l4 4L19 7" />
        </svg>
      )}
    </div>
  );
}

export default function ModuleSettings() {
  const [platform, setPlatform] = useState<Platform>("ESS");
  const [enabledModules, setEnabledModules] =
    useState<Record<string, boolean>>(DEFAULT_ENABLED);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  function toggleModule(key: string) {
    setEnabledModules((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }

  async function handleSave() {
    const result = validateModuleSettings(
      platform,
      enabledModules
    );

    if (!result.isValid) {
      setError(result.error || "");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      console.log("Saving module settings", {
        platform,
        modules: enabledModules,
      });
    } finally {
      setIsSaving(false);
    }
  }

  function renderModuleRow(item: ModuleItem) {
    const Icon = item.icon;
    const checked = enabledModules[item.key];

    return (
      <div
        key={item.key}
        onClick={() => toggleModule(item.key)}
        className="flex cursor-pointer select-none items-center gap-3 rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <ModuleCheckbox checked={checked} />

        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          <Icon className="h-4 w-4 text-gray-600" />
        </div>

        <span className="text-sm font-medium text-gray-800">
          {item.label}
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* Platform Toggle + Actions */}
      <div className="mb-6 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={() => setPlatform("HRMS")}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium shadow-sm transition-colors ${
            platform === "HRMS"
              ? "border-violet-600 bg-white text-violet-600"
              : "border-gray-300 bg-white text-gray-500"
          }`}
        >
          HRMS
        </button>

        <button
          type="button"
          onClick={() => setPlatform("ESS")}
          className={`rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-colors ${
            platform === "ESS"
              ? "bg-violet-600 text-white"
              : "border border-gray-300 bg-white text-gray-500"
          }`}
        >
          ESS
        </button>

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 rounded-full bg-green-600 px-5 shadow-sm hover:bg-green-700"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>

        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 bg-white text-gray-500 shadow-sm hover:bg-gray-50"
        >
          <History className="h-4 w-4" />
        </button>
      </div>

      {/* Validation Error */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Module Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-4">
          {LEFT_MODULES.map(renderModuleRow)}
        </div>

        <div className="space-y-4">
          {RIGHT_MODULES.map(renderModuleRow)}
        </div>
      </div>

      {/* Add Module Configuration */}
      <button
        type="button"
        className="mt-4 flex w-full items-center gap-3 rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 lg:w-1/2"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
          <Plus className="h-4 w-4 text-gray-600" />
        </div>

        Add Module Configuration
      </button>
    </div>
  );
}