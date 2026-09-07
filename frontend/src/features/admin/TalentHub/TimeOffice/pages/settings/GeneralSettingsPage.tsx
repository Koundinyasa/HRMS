import { useState } from "react";
import SettingsLayout from "./SettingsLayout";
import DropdownSelect from "../../../../components/DropdownSelect";

type Values = Record<string, boolean | string | number>;

const GEO_CLASSIFICATION_OPTIONS = [
  { label: "None", value: "None" },
  { label: "Department", value: "Department" },
  { label: "Branch", value: "Branch" },
];

const PROCESS_START_DAY_OPTIONS = Array.from({ length: 28 }, (_, i) => ({
  label: String(i + 1),
  value: String(i + 1),
}));

const PUNCH_ROUND_OFF_OPTIONS = [
  { label: "Nearest", value: "Nearest" },
  { label: "Up", value: "Up" },
  { label: "Down", value: "Down" },
];

const INITIAL: Values = {
  overTime: false,
  compensatoryWork: false,
  workFromHome: true,
  enableSupervisor: false,
  autoShift: false,
  geoClassification: "None",
  processStartDay: 1,
  displayByProcessDate: true,
  punchSecondsRoundOff: "Nearest",
  duplicatePunchMinutes: 2,
  considerPunchDirection: false,
  hidePunchDirection: false,
};

function ToggleRow({ title, description, checked, onChange }: { title: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div>
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-[18px] w-8 shrink-0 items-center rounded-full mt-0.5 transition-colors ${checked ? "bg-emerald-600" : "bg-slate-200"}`}
      >
        <span className={`h-3.5 w-3.5 rounded-full bg-white transition-transform ${checked ? "translate-x-[15px]" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col divide-y divide-slate-100">
      <h3 className="text-sm font-semibold text-slate-800 pb-2">{title}</h3>
      {children}
    </div>
  );
}

export default function GeneralSettingsPage() {
  const [values, setValues] = useState(INITIAL);
  const set = (key: string, value: boolean | string | number) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <SettingsLayout>
      <div className="flex justify-end -mt-2">
        <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Save</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="flex flex-col gap-4">
          <Card title="General Configuration">
            <ToggleRow title="Over Time" description="Allow employees to work Over time" checked={Boolean(values.overTime)} onChange={(v) => set("overTime", v)} />
            <ToggleRow title="Compensatory Work" description="Enable comp-off for overtime work" checked={Boolean(values.compensatoryWork)} onChange={(v) => set("compensatoryWork", v)} />
            <ToggleRow title="Work From Home" description="Allow employees to work remotely" checked={Boolean(values.workFromHome)} onChange={(v) => set("workFromHome", v)} />
            <ToggleRow title="Enable T&A Supervisor" description="Allow T&A Supervisor to approve punch requests" checked={Boolean(values.enableSupervisor)} onChange={(v) => set("enableSupervisor", v)} />
            <ToggleRow
              title="Auto Shift"
              description="Enabling this option will automatically assign employees to shifts based on their actual first punch, following the predefined assigned shift pattern."
              checked={Boolean(values.autoShift)}
              onChange={(v) => set("autoShift", v)}
            />
          </Card>

          <Card title="Additional Configuration">
            <div className="flex items-start justify-between gap-4 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">Map Geo Location To Classification</p>
                <p className="text-xs text-slate-500 mt-0.5">Enable this option to control mobile punch validation by linking employee classifications with predefined geo-locations.</p>
              </div>
              <DropdownSelect
                options={GEO_CLASSIFICATION_OPTIONS}
                value={values.geoClassification as string}
                onChange={(value) => set("geoClassification", value)}
                align="right"
                menuClassName="w-36"
                className="h-9 shrink-0 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </div>
          </Card>

          <Card title="Work Hours Configuration">
            <div className="flex items-start justify-between gap-4 py-2.5">
              <p className="text-sm font-semibold text-slate-800">Minimum Early In Allowed</p>
              <div className="text-right shrink-0">
                <input placeholder="HH:mm" disabled className="h-9 w-24 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-400" />
                <p className="text-xs text-red-500 mt-1">Minimum 120 mins allowed</p>
              </div>
            </div>
            <div className="flex items-start justify-between gap-4 py-2.5">
              <p className="text-sm font-semibold text-slate-800">Maximum Late Out Allowed</p>
              <div className="text-right shrink-0">
                <input placeholder="HH:mm" disabled className="h-9 w-24 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-sm text-slate-400" />
                <p className="text-xs text-red-500 mt-1">Minimum 120 mins allowed</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col divide-y divide-slate-100">
            <div className="flex items-start justify-between gap-4 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">TA Process Start Date</p>
                <p className="text-xs text-slate-500 mt-0.5">This date will be considered as the reference date for calculations, including penalty(late in, early out)</p>
              </div>
              <DropdownSelect
                options={PROCESS_START_DAY_OPTIONS}
                value={String(values.processStartDay)}
                onChange={(value) => set("processStartDay", Number(value))}
                align="right"
                menuClassName="w-20"
                className="h-9 shrink-0 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </div>
            <ToggleRow
              title="Display all screens and reports based on the selected Process Date"
              description=""
              checked={Boolean(values.displayByProcessDate)}
              onChange={(v) => set("displayByProcessDate", v)}
            />
            <div className="flex items-start justify-between gap-4 py-2.5">
              <p className="text-sm font-semibold text-slate-800">Punch Seconds Round Off</p>
              <DropdownSelect
                options={PUNCH_ROUND_OFF_OPTIONS}
                value={values.punchSecondsRoundOff as string}
                onChange={(value) => set("punchSecondsRoundOff", value)}
                align="right"
                menuClassName="w-28"
                className="h-9 shrink-0 rounded-lg border border-slate-200 px-2.5 text-sm"
              />
            </div>
            <div className="flex items-start justify-between gap-4 py-2.5">
              <div>
                <p className="text-sm font-semibold text-slate-800">Duplicate Punch Period (Minutes)</p>
                <p className="text-xs text-slate-500 mt-0.5">Among all rounded punches, only 1st punch will be considered within the specified interval (in minutes); any additional punches within this period will be excluded</p>
              </div>
              <input
                className="h-9 w-16 shrink-0 rounded-lg border border-slate-200 px-2.5 text-sm outline-none"
                value={values.duplicatePunchMinutes as number}
                onChange={(e) => set("duplicatePunchMinutes", Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <Card title="Punch Configuration">
            <ToggleRow
              title="Consider Punch Direction (In/Out) as Available for Processing"
              description=""
              checked={Boolean(values.considerPunchDirection)}
              onChange={(v) => set("considerPunchDirection", v)}
            />
            <ToggleRow
              title="Do Not Display Punch Direction (In/Out)"
              description="Punch Direction (In/Out) will not be displayed on screens or reports. However, the system will still consider the IO Type internally for punch processing"
              checked={Boolean(values.hidePunchDirection)}
              onChange={(v) => set("hidePunchDirection", v)}
            />
          </Card>
        </div>
      </div>
    </SettingsLayout>
  );
}
