





import { useEffect, useState } from "react";

import {
  useGetPayrollDetailsQuery,
  useUpdatePayrollDetailsMutation,
  getApiErrorMessage,
} from "../api/settingsapi";

import type { PayrollSettings } from "../types/settingstypes";

const pad = (n: number) => String(n).padStart(2, "0");

/** Today as YYYY-MM-DD (local) */
export function todayDateOnly(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Normalize any API / picker value to YYYY-MM-DD for form state.
 */
export function toDateOnly(value: unknown): string {
  if (value === null || value === undefined || value === "") return "";

  if (value instanceof Date) {
    return isNaN(value.getTime())
      ? ""
      : `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  }

  const text = String(value).trim();
  if (!text) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  // UTC midnight → date part
  if (/^\d{4}-\d{2}-\d{2}T00:00:00(?:\.0+)?Z$/.test(text)) {
    return text.slice(0, 10);
  }

  // ISO with time (e.g. 2026-01-31T18:30:00.000Z) → use UTC calendar date
  const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})T/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const monthYear = text.match(/^([A-Za-z]{3})\/?(\d{4})$/);
  if (monthYear) {
    const months: Record<string, string> = {
      Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
      Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
    };
    return `${monthYear[2]}-${months[monthYear[1]] || "01"}-01`;
  }

  const parsed = new Date(text);
  return isNaN(parsed.getTime()) ? "" : toDateOnly(parsed);
}

/** Display YYYY-MM-DD as dd-mm-yyyy */
export function isoToDisplay(iso: string): string {
  const d = toDateOnly(iso);
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}-${m}-${y}`;
}

/** Parse dd-mm-yyyy or YYYY-MM-DD → YYYY-MM-DD */
export function displayToIso(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(t)) return t;
  const m = t.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!m) return null;
  const day = Number(m[1]);
  const month = Number(m[2]);
  const year = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  return `${year}-${pad(month)}-${pad(day)}`;
}

function toIsoDate(value: string): string {
  return toDateOnly(value) || todayDateOnly();
}

const EMPTY_PAYROLL: PayrollSettings = {
  payCycleDate: "1",
  companyRoleCreation: false,
  effectiveFrom: todayDateOnly(),
  holidayDefinedOn: "None",
  weeklyHoliday: "None",
  salaryRoundOff: "Nearest Amount",
  retirementAge: "58",
  customPayslip: false,
  modules: {
    attendance: true,
    loan: false,
    insurance: false,
    advance: false,
    arrear: false,
    bonus: false,
    reimbursement: false,
    disbursement: false,
    costCenter: false,
    additionalSalary: false,
    attendanceIntegration: true,
  },
};

const MASTER_ID: Record<string, number> = {
  None: 0,
  Company: 1,
  Location: 2,
  Department: 3,
  "Nearest Amount": 1,
  "Higher Amount": 2,
  "Lower Amount": 3,
};

const ID_TO_HOLIDAY: Record<number, string> = {
  0: "None",
  1: "Company",
  2: "Location",
  3: "Department",
};

const ID_TO_ROUND: Record<number, string> = {
  1: "Nearest Amount",
  2: "Higher Amount",
  3: "Lower Amount",
};

type FormState = PayrollSettings & { id?: number };

function mapFromApi(raw: any): FormState {
  if (!raw || typeof raw !== "object") return { ...EMPTY_PAYROLL };

  const id = Number(raw.PayrollID ?? raw.payrollID ?? raw.id ?? 0);
  const holidayId = Number(raw.HolidaysDefinedOn ?? 0);
  const weeklyId = Number(raw.WeeklyHolidayDefinedOn ?? 0);
  const roundId = Number(raw.NetSalaryRoundOff ?? 1);

  return {
    id: id > 0 ? id : undefined,
    payCycleDate: String(raw.PayCycleStartDate ?? "1"),
    companyRoleCreation: Boolean(raw.CompanyWiseRoleCreation ?? false),
    effectiveFrom: toDateOnly(raw.EffectiveFrom) || EMPTY_PAYROLL.effectiveFrom,
    holidayDefinedOn: ID_TO_HOLIDAY[holidayId] ?? "None",
    weeklyHoliday: ID_TO_HOLIDAY[weeklyId] ?? "None",
    salaryRoundOff: ID_TO_ROUND[roundId] ?? "Nearest Amount",
    retirementAge: String(raw.RetirementAge ?? "58"),
    customPayslip: Boolean(raw.CustomLanguagePayslip ?? false),
    modules: {
      attendance: Boolean(raw.EnableTimeAndAttendance ?? true),
      loan: Boolean(raw.EnableLoan ?? false),
      insurance: Boolean(raw.EnableInsurance ?? false),
      advance: Boolean(raw.EnableAdvance ?? false),
      arrear: Boolean(raw.EnableArrear ?? false),
      bonus: Boolean(raw.EnableBonus ?? false),
      reimbursement: Boolean(raw.EnableReimbursement ?? false),
      disbursement: Boolean(raw.EnableDisbursement ?? false),
      costCenter: Boolean(raw.EnableCostCenter ?? false),
      additionalSalary: Boolean(raw.EnableAdditionalSalary ?? false),
      attendanceIntegration: Boolean(raw.EnableAttendanceIntegration ?? true),
    },
  };
}

/**
 * PUT body must match Nest UpdatePayrollConfigurationDto (camelCase).
 * ValidationPipe forbidNonWhitelisted rejects PascalCase (PayrollID, EffectiveFrom, …).
 * CompanyId / modifiedBy come from JWT — do not send PayrollID.
 */
function mapToApi(form: FormState) {
  return {
    // Required by UpdatePayrollConfigurationDto: id must be integer, not empty
    id: Number(form.id),
    effectiveFrom: toIsoDate(String(form.effectiveFrom)),
    payCycleStartDate: Number(form.payCycleDate) || 1,
    companyWiseRoleCreation: !!form.companyRoleCreation,
    enableTimeAndAttendance: !!form.modules.attendance,
    enableAdvance: !!form.modules.advance,
    enableReimbursement: !!form.modules.reimbursement,
    enableAdditionalSalary: !!form.modules.additionalSalary,
    enableAttendanceIntegration: !!form.modules.attendanceIntegration,
    enableLoan: !!form.modules.loan,
    enableArrear: !!form.modules.arrear,
    enableDisbursement: !!form.modules.disbursement,
    enableInsurance: !!form.modules.insurance,
    enableBonus: !!form.modules.bonus,
    enableCostCenter: !!form.modules.costCenter,
    holidaysDefinedOn: MASTER_ID[form.holidayDefinedOn] ?? 0,
    weeklyHolidayDefinedOn: MASTER_ID[form.weeklyHoliday] ?? 0,
    netSalaryRoundOff: MASTER_ID[form.salaryRoundOff] ?? 1,
    retirementAge: Number(form.retirementAge) || null,
    customLanguagePayslip: !!form.customPayslip,
  };
}

export function usePayrollSettings() {
  const {
    data: payroll,
    isLoading,
    isError: loadError,
    refetch,
  } = useGetPayrollDetailsQuery();

  const [updatePayrollDetails, { isLoading: isSaving }] =
    useUpdatePayrollDetailsMutation();

  const [formData, setFormData] = useState<FormState>(EMPTY_PAYROLL);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(t);
  }, [message]);

  useEffect(() => {
    if (payroll) setFormData(mapFromApi(payroll));
  }, [payroll]);

  const toggleModule = (name: keyof PayrollSettings["modules"]) => {
    setFormData((prev) => ({
      ...prev,
      modules: { ...prev.modules, [name]: !prev.modules[name] },
    }));
  };

  const handleSave = async () => {
    try {
      if (!formData.id || formData.id <= 0) {
        setMessage({
          type: "error",
          text: "Payroll configuration not found (missing PayrollID). Cannot update.",
        });
        return;
      }

      const body = mapToApi(formData);
      await updatePayrollDetails(body).unwrap();
      await refetch();
      setMessage({ type: "success", text: "Saved successfully" });
    } catch (err) {
      console.error("Failed to save payroll settings", err);
      setMessage({
        type: "error",
        text: getApiErrorMessage(err, "Failed to save payroll settings"),
      });
    }
  };

  const handleCancel = () => {
    if (payroll) setFormData(mapFromApi(payroll));
    else setFormData({ ...EMPTY_PAYROLL, modules: { ...EMPTY_PAYROLL.modules } });
    setMessage(null);
  };

  return {
    formData,
    setFormData,
    isLoading,
    isSaving,
    loadError,
    message,
    toggleModule,
    handleSave,
    handleCancel,
  };
}
