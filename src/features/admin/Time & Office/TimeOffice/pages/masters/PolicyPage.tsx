import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import MastersLayout from "./MastersLayout";
import DateField from "../../components/DateField";
import DropdownSelect from "../../../../components/DropdownSelect";

const WFH_RESTRICT_OPTIONS = [
  { label: "Select to res...", value: "" },
  { label: "Week Off", value: "week-off" },
  { label: "Holiday", value: "holiday" },
];

const BREAK_DEDUCTION_OPTIONS = [
  { label: "Defined Break duration", value: "Defined Break duration" },
  { label: "Actual Break duration", value: "Actual Break duration" },
];

const POLICY_STEPS = [
  "Attendance",
  "Work Hours Consideration",
  "Late In",
  "Early Out",
  "On Duty",
  "Work From Home",
  "Permissions",
  "Advanced",
] as const;

type PolicyValue = boolean | string | number;

/** Defaults transcribed from the reference "General Policy" screens. */
const INITIAL_VALUES: Record<string, PolicyValue> = {
  biometric: true,
  ess: true,
  essRequireApproval: true,
  mobile: true,
  mobileSelfieMandatory: false,
  mobileLocationMandatory: true,
  mobileGeoFencing: true,
  mobileRequireApproval: true,
  manualPunch: true,
  manualPunchPastDays: "",
  manualPunchMonthlyLimit: "",
  manualPunchRestrictIfNoPunch: false,
  manualPunchRemarksMandatory: false,
  punchConsideration: "double",
  workDurationInOutFlags: false,

  halfDayFrom: "04:30",
  halfDayTo: "04:30",
  fullDayFrom: "09:00",
  fullDayTo: "09:00",
  includeEarlyInMinutes: true,
  maxEarlyInMinutes: "",
  includeLateOutMinutes: true,
  maxLateOutMinutes: "",

  lateInGraceMinutes: 15,
  lateInRestrictDays: "",
  lateInTotalGrace: false,
  lateInRestrictByCrossedDays: false,
  lateInIncludeInNetHours: true,
  lateInConsiderForStatus: false,

  earlyOutGraceMinutes: 15,
  earlyOutRestrictDays: "",
  earlyOutTotalGrace: false,
  earlyOutRestrictByCrossedDays: false,
  earlyOutIncludeInNetHours: false,
  earlyOutConsiderForStatus: false,

  onDutyAllow: false,
  onDutyRequireApproval: false,

  wfhAllow: false,
  wfhMaxPerMonth: "",
  wfhRestrictPastDays: 0,
  wfhRestrictOn: "",
  wfhRequireApproval: true,

  officialAllow: true,
  officialMinPerDay: 60,
  officialMaxPerDay: 120,
  officialMaxMinutes: 120,
  officialMaxDaysPerMonth: 2,
  officialConsiderWorkStatus: true,
  officialIncludeInNetHours: false,

  personalAllow: true,
  personalMinPerDay: 30,
  personalMaxPerDay: 60,
  personalMaxMinutes: 60,
  personalMaxDaysPerMonth: 1,
  personalConsiderWorkStatus: true,
  personalIncludeInNetHours: false,

  breakLateInBuffer: "00:15",
  breakEarlyOutBuffer: "00:15",
  advancedBreakDeduction: "Defined Break duration",
  sandwichWeekOff: false,
  sandwichWeekOffRule: "both",
  sandwichHoliday: false,
  sandwichHolidayRule: "both",
};

export default function PolicyPage() {
  const [step, setStep] = useState<(typeof POLICY_STEPS)[number]>("Attendance");
  const [values, setValues] = useState(INITIAL_VALUES);
  const [effectiveFrom, setEffectiveFrom] = useState("2026-03-01");
  const set = (key: string, value: PolicyValue) => setValues((prev) => ({ ...prev, [key]: value }));

  return (
    <MastersLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-4">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col gap-2 h-fit">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase flex items-center gap-1.5">
              <Copy size={13} /> T&amp;A Policy
            </span>
            <button type="button" className="h-7 w-7 flex items-center justify-center rounded-lg border border-slate-200 text-emerald-600">
              <Plus size={14} />
            </button>
          </div>
          <button type="button" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left bg-emerald-50 text-emerald-700 font-medium">
            <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-semibold flex items-center justify-center">G</span>
            General Policy
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-semibold text-slate-800">General Policy</h3>
            <div className="flex items-center gap-2">
              <DateField label="Effective From" value={effectiveFrom} onChange={setEffectiveFrom} />
              <button type="button" className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-sm font-medium">Save</button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-5">
            <div className="flex sm:flex-col gap-2 overflow-x-auto">
              {POLICY_STEPS.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(label)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-left whitespace-nowrap ${
                    step === label ? "bg-emerald-50 text-emerald-700 font-medium" : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-5 w-5 shrink-0 rounded-full text-xs font-semibold flex items-center justify-center ${
                      step === label ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {i + 1}
                  </span>
                  {label}
                </button>
              ))}
            </div>

            <div className="min-w-0">
              {step === "Attendance" && <AttendanceStep values={values} set={set} />}
              {step === "Work Hours Consideration" && <WorkHoursStep values={values} set={set} />}
              {step === "Late In" && <GraceStep prefix="lateIn" title="Late In Policy" icon="→" values={values} set={set} />}
              {step === "Early Out" && <GraceStep prefix="earlyOut" title="Early Out Policy" icon="↪" values={values} set={set} />}
              {step === "On Duty" && <OnDutyStep values={values} set={set} />}
              {step === "Work From Home" && <WfhStep values={values} set={set} />}
              {step === "Permissions" && <PermissionsStep values={values} set={set} />}
              {step === "Advanced" && <AdvancedStep values={values} set={set} />}
            </div>
          </div>
        </div>
      </div>
    </MastersLayout>
  );
}

type StepProps = { values: Record<string, PolicyValue>; set: (key: string, value: PolicyValue) => void };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h4 className="text-sm font-semibold text-slate-800">{children}</h4>;
}

function Checkbox({ values, set, field, label, note }: StepProps & { field: string; label: string; note?: string }) {
  return (
    <label className="flex items-start gap-2 text-sm text-slate-700">
      <input
        type="checkbox"
        className="mt-0.5"
        checked={Boolean(values[field])}
        onChange={(e) => set(field, e.target.checked)}
      />
      <span>
        {label}
        {note && <span className="block text-xs text-slate-400 font-normal mt-0.5">{note}</span>}
      </span>
    </label>
  );
}

function NumberField({ values, set, field, suffix, width = "w-20" }: StepProps & { field: string; suffix?: string; width?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <input
        type="text"
        inputMode="numeric"
        className={`h-9 ${width} rounded-lg border border-slate-200 px-2 text-sm outline-none`}
        value={values[field] as string | number}
        onChange={(e) => set(field, e.target.value)}
      />
      {suffix && <span className="text-sm text-slate-600">{suffix}</span>}
    </span>
  );
}

function AttendanceStep({ values, set }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-3">
          <Checkbox values={values} set={set} field="biometric" label="Bio-metric Device" />
          <div className="flex flex-col gap-2 pl-1">
            <Checkbox values={values} set={set} field="ess" label="ESS" />
            <p className="text-xs text-slate-500">IP address to restrict access</p>
            <span className="flex items-center gap-2">
              <input placeholder="Enter IP address" className="h-9 flex-1 rounded-lg border border-slate-200 px-2 text-sm outline-none" />
              <button type="button" className="h-9 px-3 rounded-lg border border-slate-200 text-sm text-slate-400">ADD IP</button>
            </span>
            <p className="text-xs font-semibold text-slate-500 underline">Punch Settings</p>
            <Checkbox values={values} set={set} field="essRequireApproval" label="Required Approval for ESS punches" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Checkbox values={values} set={set} field="mobile" label="Mobile" />
          <div className="flex flex-col gap-2 pl-1">
            <Checkbox values={values} set={set} field="mobileSelfieMandatory" label="Make mobile selfies mandatory" />
            <Checkbox values={values} set={set} field="mobileLocationMandatory" label="Make Location Mandatory" />
            <Checkbox values={values} set={set} field="mobileGeoFencing" label="Geo-fencing for all mobile punches" />
            <p className="text-xs font-semibold text-slate-500 underline">Punch Settings</p>
            <Checkbox values={values} set={set} field="mobileRequireApproval" label="Required Approval for Mobile punches" />
          </div>

          <Checkbox values={values} set={set} field="manualPunch" label="Manual Punch" />
          <div className="flex flex-col gap-3 pl-1">
            <label className="text-sm text-slate-700">
              Restrict past dated Punch correction request to
              <div className="mt-1"><NumberField values={values} set={set} field="manualPunchPastDays" suffix="calendar days back" /></div>
            </label>
            <label className="text-sm text-slate-700">
              Maximum Allowed Punch correction limit
              <div className="mt-1"><NumberField values={values} set={set} field="manualPunchMonthlyLimit" suffix="days per month" /></div>
            </label>
            <Checkbox values={values} set={set} field="manualPunchRestrictIfNoPunch" label="Restrict Punch Correction If Punch doesnot exists" />
            <Checkbox values={values} set={set} field="manualPunchRemarksMandatory" label="Make Remarks Mandatory for Punch Correction Submission" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SectionTitle>Punch Consideration Based on</SectionTitle>
        <div className="flex items-center gap-6 flex-wrap">
          {(["none", "single", "double", "multiple"] as const).map((v) => (
            <label key={v} className="flex items-center gap-1.5 text-sm text-slate-700">
              <input type="radio" checked={values.punchConsideration === v} onChange={() => set("punchConsideration", v)} />
              {v === "none" ? "No Punch" : v === "single" ? "Single Punch" : v === "double" ? "Double Punch" : "Multiple Punch"}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <SectionTitle>Special Functions</SectionTitle>
        <Checkbox values={values} set={set} field="workDurationInOutFlags" label="Calculate work duration calculation based on In/Out flags" />
      </div>
    </div>
  );
}

function TimeRange({ values, set, fromField, toField, label, subLabel }: StepProps & { fromField: string; toField: string; label: string; subLabel: string }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm text-slate-700">
      {label}
      <span className="flex items-center gap-2">
        <input type="time" value={values[fromField] as string} onChange={(e) => set(fromField, e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none" />
        <span className="text-xs text-slate-400">({subLabel})</span>
        to
        <input type="time" value={values[toField] as string} onChange={(e) => set(toField, e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none" />
        <span className="text-xs text-slate-400">({subLabel})</span>
      </span>
    </label>
  );
}

function WorkHoursStep({ values, set }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>Work Hours Consideration Based on</SectionTitle>
      <TimeRange values={values} set={set} fromField="halfDayFrom" toField="halfDayTo" label="Minimum hours required for Half Day" subLabel="270 min" />
      <TimeRange values={values} set={set} fromField="fullDayFrom" toField="fullDayTo" label="Minimum hours required for Full Day" subLabel="540 min" />

      <div className="flex flex-col gap-2">
        <Checkbox values={values} set={set} field="includeEarlyInMinutes" label="Include Early In minutes for working hours" />
        <label className="text-sm text-slate-700 pl-6">
          Considered maximum Early In minutes
          <div className="mt-1"><NumberField values={values} set={set} field="maxEarlyInMinutes" /></div>
          <p className="text-xs text-slate-400 mt-1">Complete early in minutes will be considered for work hours calculation</p>
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <Checkbox values={values} set={set} field="includeLateOutMinutes" label="Include Late Out minutes for working hours" />
        <label className="text-sm text-slate-700 pl-6">
          Considered maximum Late Out minutes
          <div className="mt-1"><NumberField values={values} set={set} field="maxLateOutMinutes" /></div>
        </label>
      </div>
    </div>
  );
}

function GraceStep({ prefix, title, icon, values, set }: StepProps & { prefix: "lateIn" | "earlyOut"; title: string; icon: string }) {
  return (
    <div className="flex flex-col gap-5">
      <SectionTitle>
        <span className="mr-1.5">{icon}</span>{title}
      </SectionTitle>

      <div className="flex flex-col gap-3">
        <label className="text-sm text-slate-700">
          Grace period for {prefix === "lateIn" ? "Late In" : "Early Out"} by
          <div className="mt-1"><NumberField values={values} set={set} field={`${prefix}GraceMinutes`} suffix="minutes" /></div>
        </label>
        <label className="text-sm text-slate-700">
          Restrict grace period for {prefix === "lateIn" ? "Late In" : "Early Out"} by
          <div className="mt-1"><NumberField values={values} set={set} field={`${prefix}RestrictDays`} suffix="Days" /></div>
        </label>
      </div>

      <div className="rounded-lg border border-slate-100">
        <p className="text-sm font-semibold text-slate-700 px-3 py-2 bg-slate-50 rounded-t-lg">
          {prefix === "lateIn" ? "Late In" : "Early Out"} Grace period considerations
        </p>
        <div className="p-3 flex flex-col gap-3">
          <Checkbox
            values={values} set={set} field={`${prefix}TotalGrace`}
            label={`Include Grace period for total ${prefix === "lateIn" ? "Late In" : "Early Out"} minutes`}
            note="Grace minutes will be included to calculated late in"
          />
          <Checkbox
            values={values} set={set} field={`${prefix}RestrictByCrossedDays`}
            label={`Restrict Grace Days for ${prefix === "lateIn" ? "Late In" : "Early Out"}, Based Only on Crossed Grace Period Days`}
            note="Only days where the grace period crossed will be counted for grace day restriction calculation."
          />
          <Checkbox
            values={values} set={set} field={`${prefix}IncludeInNetHours`}
            label={`Include ${prefix === "lateIn" ? "Late In" : "Early Out"} Grace Period in Net Work Hours`}
            note={`Grace period time will be added to Net Work Hours only if the employees ${prefix === "lateIn" ? "late in" : "early out"} is within the defined grace period limit`}
          />
          <Checkbox
            values={values} set={set} field={`${prefix}ConsiderForStatus`}
            label={`Consider ${prefix === "lateIn" ? "Late In" : "Early Out"} Grace Period for Attendance Status Update`}
            note={`${prefix === "lateIn" ? "Late in" : "Early out"} grace period will be considered for attendance status calculation when the employee punches within the defined grace period`}
          />
        </div>
      </div>
    </div>
  );
}

function OnDutyStep({ values, set }: StepProps) {
  return (
    <div className="flex flex-col gap-3">
      <SectionTitle>On Duty</SectionTitle>
      <Checkbox values={values} set={set} field="onDutyAllow" label="Allow On Duty to employee" />
      <div className="pl-6 flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-500 underline">Punch Settings</p>
        <Checkbox
          values={values} set={set} field="onDutyRequireApproval"
          label="Required Approval for OD punches"
          note="When enabled, all Official Duty punches must be approved through the defined workflow to be treated as valid attendance"
        />
      </div>
    </div>
  );
}

function WfhStep({ values, set }: StepProps) {
  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>WFH Settings</SectionTitle>
      <Checkbox values={values} set={set} field="wfhAllow" label="Allow Work From Home to employee" />
      <label className="text-sm text-slate-700 pl-6">
        Maximum WFH allowed <NumberField values={values} set={set} field="wfhMaxPerMonth" width="w-16" /> in a month
      </label>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-500 underline">Request Restrictions</p>
        <label className="text-sm text-slate-700">
          Restrict past dated WFH request to <NumberField values={values} set={set} field="wfhRestrictPastDays" width="w-16" suffix="calendar days back." />
        </label>
        <label className="text-sm text-slate-700 flex items-center gap-2">
          Restrict Employee's from raising WFH request on
          <DropdownSelect
            options={WFH_RESTRICT_OPTIONS}
            value={values.wfhRestrictOn as string}
            onChange={(value) => set("wfhRestrictOn", value)}
            menuClassName="w-40"
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-xs font-semibold text-slate-500 underline">Punch Settings</p>
        <Checkbox
          values={values} set={set} field="wfhRequireApproval"
          label="Required Approval for WFH punches"
          note="When enabled, all Work From Home punches must be approved through the defined workflow to be treated as valid attendance"
        />
      </div>
    </div>
  );
}

function PermissionBlock({ kind, values, set }: StepProps & { kind: "official" | "personal" }) {
  const label = kind === "official" ? "Official Permission" : "Personal Permission";
  return (
    <div className="flex flex-col gap-3">
      <SectionTitle>{label}</SectionTitle>
      <Checkbox values={values} set={set} field={`${kind}Allow`} label={`Allow ${label}`} />
      <div className="pl-6 flex flex-col gap-3">
        <label className="text-sm text-slate-700">
          Minimum Allowed Minutes per Permission (per day)
          <div className="mt-1"><NumberField values={values} set={set} field={`${kind}MinPerDay`} suffix="minutes" /></div>
        </label>
        <label className="text-sm text-slate-700">
          Maximum Allowed Minutes per Permission (per day)
          <div className="mt-1"><NumberField values={values} set={set} field={`${kind}MaxPerDay`} suffix="minutes" /></div>
        </label>
        <label className="text-sm text-slate-700 flex items-center gap-2 flex-wrap">
          Maximum Allowed Permission limit:
          <NumberField values={values} set={set} field={`${kind}MaxMinutes`} suffix="Minutes and" />
          <NumberField values={values} set={set} field={`${kind}MaxDaysPerMonth`} suffix="Days per Month" />
        </label>
        <Checkbox
          values={values} set={set} field={`${kind}ConsiderWorkStatus`}
          label={`Consider ${label} Work Status`}
          note={`Enables work status calculation based on approved ${label}s`}
        />
        <Checkbox values={values} set={set} field={`${kind}IncludeInNetHours`} label={`Include ${label.split(" ")[0]} approved Permission Duration in Net Work Hours`} />
      </div>
    </div>
  );
}

function PermissionsStep({ values, set }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <PermissionBlock kind="official" values={values} set={set} />
      <PermissionBlock kind="personal" values={values} set={set} />
    </div>
  );
}

function SandwichRule({ values, set, field, options }: StepProps & { field: string; options: { value: string; label: string }[] }) {
  return (
    <div className="flex items-center gap-4 flex-wrap pl-6">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-1.5 text-sm text-slate-700">
          <input type="radio" checked={values[field] === opt.value} onChange={() => set(field, opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function AdvancedStep({ values, set }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-500 underline">Break Hours Settings</p>
        <label className="text-sm text-slate-700">
          Break Late in buffer minutes
          <span className="ml-2">
            <input type="time" value={values.breakLateInBuffer as string} onChange={(e) => set("breakLateInBuffer", e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none" />
            <span className="text-xs text-slate-400 ml-1.5">(15 min)</span>
          </span>
        </label>
        <label className="text-sm text-slate-700">
          Break Early out buffer minutes
          <span className="ml-2">
            <input type="time" value={values.breakEarlyOutBuffer as string} onChange={(e) => set("breakEarlyOutBuffer", e.target.value)} className="h-9 rounded-lg border border-slate-200 px-2 text-sm outline-none" />
            <span className="text-xs text-slate-400 ml-1.5">(15 min)</span>
          </span>
        </label>
        <label className="text-sm text-slate-700 flex items-center gap-2">
          Advanced Break Deduction
          <DropdownSelect
            options={BREAK_DEDUCTION_OPTIONS}
            value={values.advancedBreakDeduction as string}
            onChange={(value) => set("advancedBreakDeduction", value)}
            menuClassName="w-48"
            className="h-9 rounded-lg border border-slate-200 px-2 text-sm"
          />
        </label>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold text-slate-500 underline">Sandwich Options</p>
        <Checkbox values={values} set={set} field="sandwichWeekOff" label="Apply Sandwich Leave Rule For Week Off(Ab - WO - Ab)" />
        <label className="text-sm text-slate-700 pl-6">Apply Sandwich Rule for One-Side Week Off :</label>
        <SandwichRule
          values={values} set={set} field="sandwichWeekOffRule"
          options={[{ value: "prefix", label: "Prefix (Ab - WO)" }, { value: "suffix", label: "Suffix (WO - Ab)" }, { value: "both", label: "Both" }]}
        />

        <Checkbox values={values} set={set} field="sandwichHoliday" label="Apply Sandwich Leave Rule For General Holiday(Ab - GH- Ab)" />
        <label className="text-sm text-slate-700 pl-6">Apply Sandwich Rule for One-Side General Holiday :</label>
        <SandwichRule
          values={values} set={set} field="sandwichHolidayRule"
          options={[{ value: "prefix", label: "Prefix (Ab - GH)" }, { value: "suffix", label: "Suffix (GH- Ab)" }, { value: "both", label: "Both" }]}
        />
      </div>
    </div>
  );
}
