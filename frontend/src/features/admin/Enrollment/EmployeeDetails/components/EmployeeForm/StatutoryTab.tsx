
import { History } from "lucide-react";
import EmployeeSummaryCard from "./EmployeeSummaryCard";
import type { EmployeeSummary } from "./EmployeeSummaryCard";
import MonthYearField from "./MonthYearField";
 
const inputCls =
  "border border-gray-300 rounded px-2.5 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] w-full";
const highlightInputCls =
  "border border-gray-300 rounded px-2.5 py-1.5 text-[13px] bg-[#FAF6EC] focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] w-full";
const labelCls = "block text-[12px] text-gray-500 mb-1";
const errorTextCls = "text-[11px] text-red-500 mt-1";
const errorBorderCls = "border-red-400 focus:border-red-500 focus:ring-red-200";
 
const FINANCIAL_YEARS = ["2024-2025", "2025-2026", "2026-2027", "2027-2028"];
 
export interface StatutoryCheckboxes {
  pfApplicable: boolean;
  pfVoluntary: boolean;
  zeroPension: boolean;
  restrictEmployeePfContribution: boolean;
  restrictEmployerPfContribution: boolean;
  zeroPt: boolean;
  esiApplicable: boolean;
  internationalWorker: boolean;
  lwfApplicable: boolean;
}
 
export interface StatutoryForm {
  aadharNo: string;
  tdsApplicable: boolean;
  financialYear: string;
  pan: string;
  pfNumber: string;
  departmentFileNo: string;
  uan: string;
  effectiveFrom: string;
  checkboxes: StatutoryCheckboxes;
}
 
interface StatutoryTabProps {
  employee: EmployeeSummary;
  form: StatutoryForm;
  set: <K extends keyof StatutoryForm>(key: K, value: StatutoryForm[K]) => void;
  setCheckbox: (key: keyof StatutoryCheckboxes, value: boolean) => void;
  errors: Record<string, string>;
  onVerifyETraces: () => void;
}
 
const CHECKBOX_ITEMS: { key: keyof StatutoryCheckboxes; label: string; disabled?: boolean }[] = [
  { key: "pfApplicable", label: "PF Applicable" },
  { key: "pfVoluntary", label: "PF Voluntary" },
  { key: "zeroPension", label: "Zero Pension" },
  { key: "restrictEmployeePfContribution", label: "Restrict Employee PF Contribution" },
  { key: "restrictEmployerPfContribution", label: "Restrict Employer PF Contribution", disabled: true },
  { key: "zeroPt", label: "Zero PT" },
  { key: "esiApplicable", label: "ESI Applicable" },
  { key: "internationalWorker", label: "International Worker" },
  { key: "lwfApplicable", label: "LWF Applicable" },
];
 
export default function StatutoryTab({
  employee,
  form,
  set,
  setCheckbox,
  errors,
  onVerifyETraces,
}: StatutoryTabProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_1fr] gap-8">
      <EmployeeSummaryCard employee={employee} />
 
      {/* Middle: Aadhar / PAN / PF fields */}
      <div className="space-y-4">
        <div>
          <label className={labelCls}>Aadhar No.</label>
          <input
            className={`${inputCls} ${errors.aadharNo ? errorBorderCls : ""}`}
            value={form.aadharNo}
            onChange={(e) => set("aadharNo", e.target.value)}
            maxLength={12}
          />
          {errors.aadharNo && <p className={errorTextCls}>{errors.aadharNo}</p>}
        </div>
 
        <div className="grid grid-cols-2 gap-3 items-start">
          <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={form.tdsApplicable}
              onChange={(e) => set("tdsApplicable", e.target.checked)}
              className="w-3.5 h-3.5 accent-[#2196F3]"
            />
            TDS Applicable
          </label>
          <div>
            <label className={labelCls}>
              Financial Year <span className="text-red-500">*</span>
            </label>
            <select
              className={`${inputCls} ${errors.financialYear ? errorBorderCls : ""}`}
              value={form.financialYear}
              onChange={(e) => set("financialYear", e.target.value)}
            >
              {FINANCIAL_YEARS.map((fy) => (
                <option key={fy}>{fy}</option>
              ))}
            </select>
            {errors.financialYear && <p className={errorTextCls}>{errors.financialYear}</p>}
            {form.tdsApplicable && (
              <button
                type="button"
                onClick={onVerifyETraces}
                className="mt-1.5 text-[11px] text-white bg-[#2196F3] rounded px-2 py-1 hover:bg-[#1976D2]"
              >
                Verify-Traces
              </button>
            )}
          </div>
        </div>
 
        <div>
          <label className={labelCls}>
            PAN <span className="text-red-500">*</span>
          </label>
          <input
            className={`${inputCls} ${errors.pan ? errorBorderCls : ""} uppercase`}
            value={form.pan}
            onChange={(e) => set("pan", e.target.value.toUpperCase())}
            maxLength={10}
          />
          {errors.pan && <p className={errorTextCls}>{errors.pan}</p>}
        </div>
 
        <div>
          <label className={labelCls}>PF Number</label>
          <input
            className={inputCls}
            value={form.pfNumber}
            onChange={(e) => set("pfNumber", e.target.value)}
          />
        </div>
 
        <div>
          <label className={labelCls}>Department File No.</label>
          <input
            className={highlightInputCls}
            value={form.departmentFileNo}
            onChange={(e) => set("departmentFileNo", e.target.value)}
          />
        </div>
 
        <div>
          <label className={labelCls}>UAN</label>
          <input
            className={inputCls}
            value={form.uan}
            onChange={(e) => set("uan", e.target.value)}
            maxLength={12}
          />
        </div>
      </div>
 
      {/* Right: Effective From + checkbox list */}
      <div>
        <div className="flex items-center justify-end gap-2 mb-6">
          <MonthYearField
            label="Effective From"
            value={form.effectiveFrom}
            onChange={(v) => set("effectiveFrom", v)}
            error={errors.effectiveFrom}
          />
          <button
            type="button"
            title="View history"
            className="p-1.5 text-gray-400 hover:text-[#2196F3] border border-dashed border-gray-300 rounded-full"
          >
            <History size={13} />
          </button>
        </div>
 
        <div className="space-y-3.5">
          {CHECKBOX_ITEMS.map(({ key, label, disabled }) => (
            <label
              key={key}
              className={`flex items-center gap-2 text-[13px] ${
                disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={form.checkboxes[key]}
                disabled={disabled}
                onChange={(e) => setCheckbox(key, e.target.checked)}
                className="w-3.5 h-3.5 accent-[#2196F3] disabled:accent-gray-300"
              />
              {label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}