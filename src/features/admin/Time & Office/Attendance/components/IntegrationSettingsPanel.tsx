import { useState } from "react";
import {
  FileText,
  Link2,
  User,
  Lock,
  CalendarCheck,
  Shield,
  Info,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  useGetDescriptionsQuery,
  useGetIntegrationsQuery,
  useGetApplicableAttendanceQuery,
  useGetLeaveAbbreviationsQuery,
  useGetCalculateOTQuery,
  usePostAttendanceIntegrationMutation,
} from "../api/attendanceApi";
import { attendanceIntegrationSchema } from "../validations/AttendanceSchema";
import type { AttendanceIntegration } from "../types/attendance.types";

const INTEGRATION_GUIDELINES = [
  "Leaves from portal take higher priority over biometric integrations.",
  "Weekly off and scheduled holiday overlaps are automatically resolved.",
  "Absent logs are auto-validated against late exceptions daily.",
  "Reconciled logs require final approval before next payroll run.",
];

type FormState = Partial<AttendanceIntegration>;

export default function IntegrationSettingsPanel() {
  const descriptions = useGetDescriptionsQuery();
  const integrationTypes = useGetIntegrationsQuery();
  const applicableAttendance = useGetApplicableAttendanceQuery();
  const leaveAbbreviations = useGetLeaveAbbreviationsQuery();
  const calculateOTOptions = useGetCalculateOTQuery();
  const [saveIntegration, { isLoading: isSaving }] = usePostAttendanceIntegrationMutation();

  const [form, setForm] = useState<FormState>({
    skipHolidays: false,
    autoIntegrationHours: 1,
  });
  const [error, setError] = useState<string | null>(null);

  const setField = <K extends keyof FormState>(field: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSave = async () => {
    const result = attendanceIntegrationSchema.safeParse(form);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    setError(null);
    try {
      await saveIntegration(result.data).unwrap();
    } catch {
      setError("Unable to save configuration. Please try again.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* ── Description / Type / Credentials ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
        <Field label="Description" icon={FileText} required>
          <select
            value={form.description ?? ""}
            onChange={(e) => setField("description", e.target.value)}
            className={selectClass}
          >
            <option value="">Select Description</option>
            {descriptions.data?.map((d: { label: string; value: string }) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Attendance Integration Type" icon={Link2} required>
          <select
            value={form.integrationTypeId ?? ""}
            onChange={(e) => setField("integrationTypeId", Number(e.target.value))}
            className={selectClass}
          >
            <option value="">Select Integration Type</option>
            {integrationTypes.data?.map((t: { id: number; label: string }) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="User Name" icon={User}>
          <input
            type="text"
            value={form.userName ?? ""}
            onChange={(e) => setField("userName", e.target.value)}
            placeholder="Username / Email"
            className={inputClass}
          />
        </Field>

        <Field label="Password" icon={Lock}>
          <input
            type="password"
            value={form.password ?? ""}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="Password@123"
            className={inputClass}
          />
        </Field>

        <Field label="Applicable Attendance" icon={CalendarCheck}>
          <select
            value={form.applicableAttendanceId ?? ""}
            onChange={(e) => setField("applicableAttendanceId", Number(e.target.value))}
            className={selectClass}
          >
            <option value="">Select Applicable Attendance</option>
            {applicableAttendance.data?.map((a: { id: number; label: string }) => (
              <option key={a.id} value={a.id}>
                {a.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* ── Consider Leave Abbreviation ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <FileText size={16} className="text-slate-500" />
          Consider Leave Abbreviation
        </h3>

        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs rounded-lg px-3 py-2">
          <Info size={14} className="shrink-0 mt-0.5" />
          Abbreviations used in API responses should match with below Leave Abbreviations.
        </div>

        <div className="flex flex-wrap gap-2">
          {(leaveAbbreviations.data ?? []).map((abbr: { code: string }) => (
            <span
              key={abbr.code}
              className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700"
            >
              {abbr.code}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Present">
            <input
              value={form.present ?? ""}
              onChange={(e) => setField("present", e.target.value)}
              placeholder="P"
              className={inputClass}
            />
          </Field>
          <Field label="Absent">
            <input
              value={form.absent ?? ""}
              onChange={(e) => setField("absent", e.target.value)}
              placeholder="A"
              className={inputClass}
            />
          </Field>
          <Field label="Weekly Off">
            <input
              value={form.weeklyOff ?? ""}
              onChange={(e) => setField("weeklyOff", e.target.value)}
              placeholder="WO"
              className={inputClass}
            />
          </Field>
          <Field label="Holiday">
            <input
              value={form.holiday ?? ""}
              onChange={(e) => setField("holiday", e.target.value)}
              placeholder="H"
              className={inputClass}
            />
          </Field>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={form.skipHolidays ?? false}
            onChange={(e) => setField("skipHolidays", e.target.checked)}
            className="rounded border-slate-300"
          />
          Skip Holidays
        </label>

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span>Auto integration will start after</span>
          <input
            type="number"
            min={0}
            max={24}
            value={form.autoIntegrationHours ?? 1}
            onChange={(e) => setField("autoIntegrationHours", Number(e.target.value))}
            className="w-14 h-8 rounded-lg border border-slate-200 px-2 text-sm text-center"
          />
          <span>hours from midnight</span>
        </div>

        <div className="flex items-end justify-between gap-3">
          <Field label="Calculate OT" icon={Link2} className="flex-1">
            <select
              value={form.calculateOTId ?? ""}
              onChange={(e) => setField("calculateOTId", Number(e.target.value))}
              className={selectClass}
            >
              <option value="">Select</option>
              {calculateOTOptions.data?.map((o: { id: number; label: string }) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </Field>
          <span className="text-xs text-slate-400 pb-2">In Units</span>
        </div>
      </div>

      {/* ── Field Mapping ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Link2 size={16} className="text-slate-500" />
          Field Mapping
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <Field label="RefNo">
            <input
              value={form.refNo ?? ""}
              onChange={(e) => setField("refNo", e.target.value)}
              placeholder="Field Reference"
              className={inputClass}
            />
          </Field>
          <Field label="Process Date">
            <input
              type="date"
              value={form.processDate ?? ""}
              onChange={(e) => setField("processDate", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="1st Half">
            <input
              value={form.firstHalf ?? ""}
              onChange={(e) => setField("firstHalf", e.target.value)}
              placeholder="First Session Color"
              className={inputClass}
            />
          </Field>
          <Field label="2nd Half">
            <input
              value={form.secondHalf ?? ""}
              onChange={(e) => setField("secondHalf", e.target.value)}
              placeholder="Second Session Color"
              className={inputClass}
            />
          </Field>
        </div>
        <Field label="OT Units">
          <input
            value={form.otUnits ?? ""}
            onChange={(e) => setField("otUnits", e.target.value)}
            placeholder="In Hours / Units"
            className={inputClass}
          />
        </Field>
      </div>

      {/* ── Precedence Rules ── */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 flex flex-col gap-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Shield size={16} className="text-slate-500" />
          Precedence Rules
        </h3>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="flex items-center gap-2 text-xs font-semibold text-amber-700 mb-2">
            <AlertTriangle size={14} />
            Integration Guidelines
          </p>
          <ol className="list-decimal list-inside text-xs text-amber-700 space-y-1">
            {INTEGRATION_GUIDELINES.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <div className="flex items-center justify-between mt-auto pt-2">
          <p className="flex items-center gap-1.5 text-xs text-slate-500">
            <Info size={13} />
            Ensure all configurations are correct prior to saving.
          </p>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Check size={15} />
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-slate-300";
const selectClass = inputClass + " bg-white";

function Field({
  label,
  icon: Icon,
  required,
  children,
  className,
}: {
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="flex items-center gap-1.5 text-xs font-medium text-slate-600 mb-1">
        {Icon && <Icon size={13} className="text-slate-400" />}
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}