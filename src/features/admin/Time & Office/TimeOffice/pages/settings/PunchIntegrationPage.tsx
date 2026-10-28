import { useState } from "react";
import { CalendarClock, Clock, Eye, Info, Plus, Timer, TimerReset, Trash2 } from "lucide-react";
import SettingsLayout from "./SettingsLayout";
import DropdownSelect from "../../../../components/DropdownSelect";

const INTERVALS = [
  { key: "seconds", label: "Seconds", icon: Clock },
  { key: "minutes", label: "Minutes", icon: TimerReset },
  { key: "hours", label: "Hours", icon: Timer },
  { key: "daily", label: "Daily", icon: CalendarClock },
] as const;

export default function PunchIntegrationPage() {
  const [interval, setIntervalKey] = useState<(typeof INTERVALS)[number]["key"]>("seconds");
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState("Matrix");
  const [inputType, setInputType] = useState("API");
  const [vendor, setVendor] = useState("Matrix");
  const [empIdMappedTo, setEmpIdMappedTo] = useState("REFNO");
  const [manualLocation, setManualLocation] = useState("");

  return (
    <SettingsLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Location
              <span className="flex items-center gap-1.5">
                <DropdownSelect
                  options={[{ label: "Matrix", value: "Matrix" }]}
                  value={location}
                  onChange={setLocation}
                  menuClassName="w-28"
                  className="h-9 flex-1 rounded-lg border border-slate-200 px-2.5 text-sm"
                />
                <button type="button" className="text-slate-400 hover:text-red-500"><Trash2 size={15} /></button>
                <button type="button" className="h-9 w-9 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600">
                  <Plus size={14} />
                </button>
              </span>
            </label>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Input Type<span className="text-red-500">*</span>
              <DropdownSelect
                options={[{ label: "API", value: "API" }]}
                value={inputType}
                onChange={setInputType}
                menuClassName="w-24"
                className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Vendor
              <DropdownSelect
                options={[{ label: "Matrix", value: "Matrix" }]}
                value={vendor}
                onChange={setVendor}
                menuClassName="w-28"
                className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </label>
            <label className="flex items-center gap-1.5 text-sm text-slate-700 h-9">
              <input type="checkbox" defaultChecked /> User Access Event API
            </label>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Matrix Settings</p>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              URL<span className="text-red-500">*</span>
              <input defaultValue="Https://behavoxindia.matrixvyom.com" className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none focus:border-emerald-400" />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                User Name<span className="text-red-500">*</span>
                <input defaultValue="sa" className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                Password<span className="text-red-500">*</span>
                <span className="relative">
                  <input type={showPassword ? "text" : "password"} defaultValue="secret" className="h-9 w-full rounded-lg border border-slate-200 px-2.5 pr-8 text-sm outline-none" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                    <Eye size={15} />
                  </button>
                </span>
              </label>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                Emp ID Mapped To<span className="text-red-500">*</span>
                <DropdownSelect
                  options={[{ label: "REFNO", value: "REFNO" }]}
                  value={empIdMappedTo}
                  onChange={setEmpIdMappedTo}
                  menuClassName="w-28"
                  className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                Custom Field
                <DropdownSelect
                  options={[]}
                  value=""
                  onChange={() => {}}
                  disabled
                  menuClassName="w-28"
                  className="h-9 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-400"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Save</button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
            <p className="flex items-start gap-2 text-sm text-sky-700 bg-sky-50 border border-sky-100 rounded-lg px-3 py-2.5">
              <Info size={16} className="shrink-0 mt-0.5" />
              Configure automatic punch reading from biometric devices or integrated data sources. Based on your selected schedule and source settings, the system will periodically fetch punches without manual input. Ensure device connection details, data format, and read frequency are correctly configured.
            </p>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-slate-700">Select Interval</p>
              <div className="flex items-center gap-5 flex-wrap">
                {INTERVALS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setIntervalKey(key)}
                    className={`flex items-center gap-1.5 text-sm font-medium ${interval === key ? "text-emerald-600" : "text-slate-500"}`}
                  >
                    <Icon size={15} /> {label}
                  </button>
                ))}
              </div>
            </div>

            {interval === "seconds" && (
              <label className="flex flex-col gap-1.5 text-sm text-slate-700 max-w-xs">
                Enter Seconds
                <input defaultValue="5" className="h-10 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-emerald-400" />
              </label>
            )}
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-3">
            <p className="text-sm font-semibold text-slate-800 border-b border-slate-100 pb-2">Manual Punch Reading</p>
            <label className="flex flex-col gap-1.5 text-sm text-slate-700">
              Location
              <DropdownSelect
                options={[{ label: "Select Location", value: "" }]}
                value={manualLocation}
                onChange={setManualLocation}
                menuClassName="w-36"
                className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                From Date
                <input placeholder="DD-MM-YYYY" className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-slate-700">
                To Date
                <input placeholder="DD-MM-YYYY" className="h-9 rounded-lg border border-slate-200 px-2.5 text-sm outline-none" />
              </label>
            </div>
            <div className="flex justify-end">
              <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Read Data</button>
            </div>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
}
