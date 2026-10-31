import { baseApi } from "@/app/baseApi";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type {
  CompanyDetails,
  CompanyDetailsApi,
  EsiConfiguration,
  EsiDetails,
  EsiDetailsApi,
  EstablishmentDetails,
  EstablishmentDetailsApi,
  LwfConfiguration,
  LwfDetails,
  LwfDetailsApi,
  PfConfiguration,
  PfDetails,
  PfDetailsApi,
  PtDetails,
  PtDetailsApi,
  PtSlab,
  SalaryRoundOffOption,
} from "../types/company.types";

// ------------------------------------------------------------
// Date helpers
// ------------------------------------------------------------

/** Configuration dates are calendar dates in India, independent of browser timezone. */
/**
 * Configuration dates are calendar dates (not instants).
 * SQL Server often returns a Date as "YYYY-MM-DDT18:30:00.000Z"
 * (midnight IST stored as previous-day 18:30 UTC).
 * Always resolve to the India calendar date (Asia/Kolkata).
 */
function toLocalDateString(
  value: string | null | undefined,
): string {
  const text = (value ?? "").trim();
  if (!text) return "";

  // Already a pure date
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;

  const dayFirstDate = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(text);
  if (dayFirstDate) {
    const [, day, month, year] = dayFirstDate;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  // ISO datetime WITH timezone (Z or ±hh:mm) → India calendar date
  // e.g. "2025-07-31T18:30:00.000Z" → "2025-08-01" in IST
  if (/^\d{4}-\d{2}-\d{2}T/.test(text) && /(?:Z|[+-]\d{2}:?\d{2})$/i.test(text)) {
    const date = new Date(text);
    if (!Number.isNaN(date.getTime())) {
      const dateParts = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).formatToParts(date);
      const parts = Object.fromEntries(
        dateParts.map(({ type, value: part }) => [type, part]),
      );
      return `${parts.year}-${parts.month}-${parts.day}`;
    }
  }

  // ISO datetime WITHOUT timezone → use the date part as-is
  const dateWithoutTimezone =
    /^(\d{4}-\d{2}-\d{2})T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?$/.exec(text);
  if (dateWithoutTimezone) return dateWithoutTimezone[1];

  // Fallback: leading YYYY-MM-DD
  const m = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  if (m) return m[1];

  const date = new Date(text);
  if (Number.isNaN(date.getTime())) return "";

  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const parts = Object.fromEntries(
    dateParts.map(({ type, value: part }) => [type, part]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** "YYYY-MM-DD" -> "DD-MM-YYYY" (same style as Date of Establishment). */
function toDisplayDate(
  value: string | null | undefined,
): string {
  const iso = toLocalDateString(value);
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : "";
}

function toDateInputValue(
  value: string | null | undefined,
): string {
  return toLocalDateString(value);
}

function toIsoDate(
  value: string | null | undefined,
): string {
  if (!value) {
    return new Date().toISOString();
  }

  const datePartMatch = value
    .trim()
    .match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (datePartMatch) {
    return `${datePartMatch[1]}-${datePartMatch[2]}-${datePartMatch[3]}T00:00:00.000Z`;
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthYearMatch =
    /^([A-Za-z]{3})\/(\d{4})$/.exec(value.trim());

  if (monthYearMatch) {
    const monthIndex = months.findIndex(
      (month) =>
        month.toLowerCase() ===
        monthYearMatch[1].toLowerCase(),
    );

    if (monthIndex >= 0) {
      return `${monthYearMatch[2]}-${String(monthIndex + 1).padStart(2, "0")}-01T00:00:00.000Z`;
    }
  }

  return value;
}

/** Effective dates are calendar dates; send date-only values to avoid timezone shifts. */
function toApiEffectiveDate(value: string | null | undefined): string {
  const date = toLocalDateString(value);
  if (!date) {
    throw new Error(`Invalid effective date: "${value ?? ""}".`);
  }
  return date;
}

// ------------------------------------------------------------
// Common helpers
// ------------------------------------------------------------

/** Unwrap /admin/configuration/salary-round-off body (supports old array + new { salaryRoundOff, periodType }). */
function unwrapPayrollDropdownData(response: unknown): {
  salaryRoundOff: unknown[];
  periodType: unknown[];
} {
  let data: unknown =
    response && typeof response === "object" && "data" in response
      ? (response as { data: unknown }).data
      : response;

  if (Array.isArray(data)) {
    return { salaryRoundOff: data, periodType: [] };
  }

  if (data && typeof data === "object") {
    const o = data as Record<string, unknown>;
    const salaryRoundOff = Array.isArray(o.salaryRoundOff)
      ? o.salaryRoundOff
      : Array.isArray(o.SalaryRoundOff)
        ? (o.SalaryRoundOff as unknown[])
        : [];
    const periodType = Array.isArray(o.periodType)
      ? o.periodType
      : Array.isArray(o.PeriodType)
        ? (o.PeriodType as unknown[])
        : [];
    return { salaryRoundOff, periodType };
  }

  return { salaryRoundOff: [], periodType: [] };
}

function mapNamedOptions(
  list: unknown[],
  label: string,
  idKeys: string[],
  nameKeys: string[],
): SalaryRoundOffOption[] {
  return list.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      throw new Error(`${label} option ${index + 1} is invalid.`);
    }

    const fields = Object.entries(item).map(([key, value]) => [
      key.toLowerCase().replace(/[^a-z0-9]/g, ""),
      value,
    ] as const);

    const idField =
      fields.find(([key]) => idKeys.includes(key)) ??
      fields.find(([key]) => key === "id" || key.endsWith("id"));
    const nameField =
      fields.find(([key]) => nameKeys.includes(key)) ??
      fields.find(
        ([key, value]) =>
          !key.endsWith("id") &&
          (typeof value === "string" || typeof value === "number"),
      );

    const id = Number(idField?.[1]);
    const name = String(nameField?.[1] ?? "").trim();

    if (!Number.isInteger(id) || id <= 0 || !name) {
      throw new Error(`${label} option ${index + 1} is missing its ID or name.`);
    }

    return { id, name };
  });
}

function mapSalaryRoundOffOptions(response: unknown): SalaryRoundOffOption[] {
  const { salaryRoundOff } = unwrapPayrollDropdownData(response);
  if (!salaryRoundOff.length) {
    // tolerate empty list rather than hard-fail the page
    return [];
  }
  return mapNamedOptions(
    salaryRoundOff,
    "Salary round-off",
    ["id", "roundofftypeid", "salaryroundoffid", "payrollroundoffid"],
    ["name", "code", "roundoff", "roundofftype", "roundofftypename", "description"],
  );
}

function mapPeriodTypeOptions(response: unknown): SalaryRoundOffOption[] {
  const { periodType } = unwrapPayrollDropdownData(response);
  if (!periodType.length) return [];
  return mapNamedOptions(
    periodType,
    "Period type",
    ["id", "periodtypeid", "periodid", "typeid"],
    ["name", "period", "periodtype", "periodtypename", "code", "description"],
  );
}

function mapPeriodLabelToId(
  label: string | undefined,
): number {
  const value = (label ?? "").toLowerCase();

  if (value.includes("quarterly")) return 2;
  if (value.includes("half")) return 3;
  if (value.includes("yearly")) return 4;

  return 1;
}

// ------------------------------------------------------------
// Row / id helpers
// ------------------------------------------------------------

/** Pick first positive integer (accepts number or numeric string from API). */
function pickPositiveInt(...values: unknown[]): number | undefined {
  for (const v of values) {
    if (v === null || v === undefined || v === "") continue;
    const n = typeof v === "number" ? v : Number(v);
    if (Number.isFinite(n) && n > 0) return Math.trunc(n);
  }
  return undefined;
}

const normKey = (key: string) => key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

/**
 * Finds the row id of a configuration row returned by USP_GetAdminConfigurationData.
 * The PF / ESI / LWF PUT endpoints now REQUIRE this id.
 * `extra` lists the normalised column names that may hold it (e.g. "pfid").
 */
function resolveRowId(
  row: Record<string, unknown> | undefined,
  extra: string[] = [],
): number | undefined {
  if (!row) return undefined;
  const wanted = new Set(["id", "configid", "configurationid", ...extra]);
  for (const [key, val] of Object.entries(row)) {
    if (wanted.has(normKey(key))) {
      const n = pickPositiveInt(val);
      if (n !== undefined) return n;
    }
  }

  // Fallback: exactly one column that ends with "id" and is not a group/state/type id.
  const candidates = Object.entries(row).filter(([key]) => {
    const k = normKey(key);
    return (
      k.endsWith("id") &&
      !/group|state|roundoff|type|company/.test(k) &&
      pickPositiveInt(row[key]) !== undefined
    );
  });
  if (candidates.length === 1) return pickPositiveInt(candidates[0][1]);

  return undefined;
}

/** Reads the first matching key (case / punctuation insensitive) from a row. */
function readKey(
  row: Record<string, unknown> | undefined,
  ...names: string[]
): unknown {
  if (!row) return undefined;
  const wanted = new Set(names.map(normKey));
  for (const [key, val] of Object.entries(row)) {
    if (wanted.has(normKey(key))) return val;
  }
  return undefined;
}

function requireId(id: number | undefined, label: string): number {
  if (id === undefined) {
    throw new Error(
      `The ${label} API did not return a configuration id, so it cannot be updated. ` +
        `Check that the GET response rows contain an "ID" column.`,
    );
  }
  return id;
}

// ------------------------------------------------------------
// State ID mapping (LWF)
// ------------------------------------------------------------

const STATE_IDS: Record<string, number> = {
  "andhra pradesh": 1,
  "arunachal pradesh": 2,
  assam: 3,
  bihar: 4,
  chhattisgarh: 5,
  goa: 6,
  gujarat: 7,
  haryana: 8,
  "himachal pradesh": 9,
  jharkhand: 10,
  karnataka: 11,
  kerala: 12,
  "madhya pradesh": 13,
  maharashtra: 14,
  manipur: 15,
  meghalaya: 16,
  mizoram: 17,
  nagaland: 18,
  odisha: 19,
  punjab: 20,
  rajasthan: 21,
  sikkim: 22,
  "tamil nadu": 23,
  telangana: 24,
  tripura: 25,
  "uttar pradesh": 26,
  uttarakhand: 27,
  "west bengal": 28,
  delhi: 29,
  "jammu and kashmir": 30,
  ladakh: 31,
  puducherry: 32,
};

/** Uses the id returned by the API; only falls back to the state name. Never guesses. */
function resolveStateId(
  stateName: string | undefined,
  apiId?: number,
): number {
  if (typeof apiId === "number" && apiId > 0) return apiId;

  const byName = STATE_IDS[(stateName ?? "").trim().toLowerCase()];
  if (byName !== undefined) return byName;

  throw new Error(
    `Cannot determine the state id for LWF (state: "${stateName ?? ""}"). ` +
      `The LWF GET response should include "Stateid" on the group.`,
  );
}

// ------------------------------------------------------------
// Logo path helpers
// ------------------------------------------------------------

/** Backend (multer on Windows) can return "uploads\\company-documents\\x.png". */
function normalizeUploadPath(path: string | null | undefined): string {
  return (path ?? "").trim().replace(/\\/g, "/");
}

/**
 * Turns the stored path into something an <img> can load.
 * The backend must serve ./uploads statically (e.g. app.useStaticAssets).
 * Optional env: VITE_FILE_BASE_URL (falls back to VITE_API_BASE_URL without a trailing /api).
 */
function buildLogoUrl(path: string): string {
  if (!path) return "";
  if (/^(https?:|data:|blob:)/i.test(path)) return path;

  const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env ?? {};
  const base = (env.VITE_FILE_BASE_URL ?? env.VITE_API_BASE_URL ?? "")
    .replace(/\/+$/, "")
    .replace(/\/api$/i, "");

  return `${base}/${path.replace(/^\.?\/+/, "")}`;
}

// ------------------------------------------------------------
// Company
// ------------------------------------------------------------

function mapCompanyFromApi(
  raw: CompanyDetailsApi | Record<string, unknown>,
): CompanyDetails {
  const r = raw as Record<string, unknown>;
  const str = (...keys: string[]) => {
    for (const k of keys) {
      const v = r[k];
      if (typeof v === "string") return v;
    }
    return "";
  };
  const bool = (...keys: string[]) => {
    for (const k of keys) {
      const v = r[k];
      if (typeof v === "boolean") return v;
    }
    return false;
  };

  const companyLogoPath = normalizeUploadPath(
    str("CompanyLogoPath", "companyLogoPath"),
  );

  return {
    companyName: str("CompanyName", "companyName"),
    dateOfEstablishment: toDateInputValue(
      str("DateOfEstablishment", "dateOfEstablishment") ||
        undefined,
    ),
    cin_LPIN: str("CIN_LPIN", "cin_LPIN"),
    tan: str("TAN", "tan"),
    website: str("Website", "website"),
    address1: str("Address1", "address1"),
    address2: str("Address2", "address2"),
    address3: str("Address3", "address3"),
    contactMobile: str("ContactMobile", "contactMobile"),
    companyCode: str("CompanyCode", "companyCode"),
    isPFApplicable: bool("IsPFApplicable", "isPFApplicable"),
    isESIApplicable: bool("IsESIApplicable", "isESIApplicable"),
    isPTApplicable: bool("IsPTApplicable", "isPTApplicable"),
    isTDSApplicable: bool("IsTDSApplicable", "isTDSApplicable"),
    tdsFilingMarToFeb: bool(
      "TDSFilingMarToFeb",
      "tdsFilingMarToFeb",
    ),
    isLWFAvailable: bool("IsLWFAvailable", "isLWFAvailable"),
    companyLogoPath,
    companyLogoUrl: buildLogoUrl(companyLogoPath),
  };
}

function mapCompanyToApi(data: CompanyDetails) {
  return {
    dateOfEstablishment: toIsoDate(data.dateOfEstablishment),
    cin_LPIN: (data.cin_LPIN ?? "").trim(),
    tan: (data.tan ?? "").trim(),
    website: (data.website ?? "").trim(),
    address1: (data.address1 ?? "").trim(),
    address2: (data.address2 ?? "").trim(),
    address3: (data.address3 ?? "").trim(),
    contactMobile: (data.contactMobile ?? "").trim(),
    companyCode: (data.companyCode ?? "").trim(),
    isPFApplicable: Boolean(data.isPFApplicable),
    isESIApplicable: Boolean(data.isESIApplicable),
    isPTApplicable: Boolean(data.isPTApplicable),
    isTDSApplicable: Boolean(data.isTDSApplicable),
    tdsFilingMarToFeb: Boolean(data.tdsFilingMarToFeb),
    isLWFAvailable: Boolean(data.isLWFAvailable),
    companyLogoPath: normalizeUploadPath(data.companyLogoPath),
  };
}

// ------------------------------------------------------------
// PF
// ------------------------------------------------------------

function mapPfFromApi(raw: PfDetailsApi): PfDetails {
  const configurations = [...(raw.configuration ?? [])].sort((a, b) => {
    const dateA = toLocalDateString(a["Effective From"]);
    const dateB = toLocalDateString(b["Effective From"]);
    if (!dateA) return dateB ? 1 : 0;
    if (!dateB) return -1;
    return dateB.localeCompare(dateA);
  });

  return {
    group: (raw.group ?? []).map((group) => {
      const row = group as unknown as Record<string, unknown>;
      return {
        id: pickPositiveInt(row.ID, row.Id, row.id) ?? 0,
        name: String(row.Name ?? row.name ?? ""),
      };
    }),

    configuration: configurations.map((config) => ({
      id: resolveRowId(config as unknown as Record<string, unknown>, ["pfid", "pfconfigid", "pfconfigurationid", "pfdetailsid"]),
      effectiveFrom: toLocalDateString(config["Effective From"]),
      epfPercentage: config["EPF(A)-(%)"] ?? 0,
      cutoff: config.Cutoff ?? 0,
      pfOnPayDays: config["PF On Pay Days"] ?? false,
      pensionFundPercentage: config["Pension Fund(B)-(%)"] ?? 0,
      employerEPFPercentage: config["EPF(A-B)-(%)"] ?? 0,
      roundOff: config["Round Off"] ?? "",
      accountNo02Rate: config["Account No. 02(%)"] ?? 0,
      accountNo21Rate: config["Account No.21(%)"] ?? 0,
      minimumChargesAccNo02:
        config["Minimum Charges For Acc.No.2"] ?? 0,
      restrictEmployerShare:
        config["Restrict Employer Share"] ?? false,
      restrictEmployerEmployeeWise:
        config["Restrict Employer Share EmployeeWise"] ?? false,
    })),
  };
}

/** PUT /admin/configuration/pf  (PFDefaultConfigurationDto — `id` is required) */
function mapPfConfigToApi(
  config: PfConfiguration,
  pfGroupId: number,
  roundOffTypeId: number,
): Record<string, unknown> {
  return {
    id: requireId(config.id, "PF"),
    pfGroupId,
    effectiveFrom: toApiEffectiveDate(config.effectiveFrom),
    epfPercentage: Number(config.epfPercentage),
    cutoff: Number(config.cutoff),
    pfOnPayDays: !!config.pfOnPayDays,
    pensionFundPercentage: Number(config.pensionFundPercentage),
    employerEPFPercentage: Number(config.employerEPFPercentage),
    roundOffTypeId: requireId(roundOffTypeId, "Salary round-off type"),
    accountNo02Rate: Number(config.accountNo02Rate),
    accountNo21Rate: Number(config.accountNo21Rate),
    minimumChargesAccNo02: Number(config.minimumChargesAccNo02),
    restrictEmployerShare: !!config.restrictEmployerShare,
    restrictEmployerEmployeeWise:
      !!config.restrictEmployerEmployeeWise,
    isDefault: true,
    isActive: true,
  };
}

// ------------------------------------------------------------
// ESI
// ------------------------------------------------------------

function mapEsiFromApi(raw: EsiDetailsApi): EsiDetails {
  const groups = (raw.group ?? []).map((group) => {
    const row = group as unknown as Record<string, unknown>;
    return {
      id: pickPositiveInt(row.ID, row.Id, row.id) ?? 0,
      name: String(row.Name ?? row.name ?? ""),
    };
  });
  const groupId = groups[0]?.id || undefined;

  return {
    group: groups,

    configuration: (raw.configuration ?? []).map((config) => ({
      id: resolveRowId(config as unknown as Record<string, unknown>, ["esiid", "esiconfigid", "esiconfigurationid", "esidetailsid"]),
      groupId:
        pickPositiveInt(
          readKey(config as unknown as Record<string, unknown>, "ESIGroupId", "ESI Group ID"),
        ) ?? groupId,
      effectiveFrom: toLocalDateString(config["Effective From"]),
      cutOffAmount: config["Cut Off(Amount)"] ?? 0,
      employeeRate: config["Employee Rate(%)"] ?? 0,
      employerRate: config["Employer Rate(%)"] ?? 0,
      minimumDailyWage:
        config["Minimum Daily Wage(Amount)"] ?? 0,
      roundOff: config["Round Off"] ?? "",
    })),
  };
}

/** PUT /admin/configuration/esi  (ESIDefaultConfigurationDto — `id` + `esiGroupId` required) */
function mapEsiConfigToApi(
  config: EsiConfiguration,
  roundOffTypeId: number,
): Record<string, unknown> {
  return {
    id: requireId(config.id, "ESI"),
    esiGroupId: requireId(config.groupId, "ESI group"),
    effectiveFrom: toApiEffectiveDate(config.effectiveFrom),
    cutOffAmount: Number(config.cutOffAmount),
    employeeRate: Number(config.employeeRate),
    employerRate: Number(config.employerRate),
    minimumDailyWage: Number(config.minimumDailyWage),
    roundOffTypeId: requireId(roundOffTypeId, "Salary round-off type"),
    isDefault: true,
    isActive: true,
  };
}

// ------------------------------------------------------------
// PT
// ------------------------------------------------------------

/** Unique slab id from GET row — column names vary by SP. */
function resolvePtSlabId(slab: Record<string, unknown>): number | undefined {
  const direct = pickPositiveInt(
    slab.ID,
    slab.Id,
    slab.id,
    slab.PTID,
    slab.PTId,
    slab.ptId,
    slab["PT ID"],
    slab.SlabId,
    slab.SlabID,
    slab.slabId,
    slab.PTSlabId,
    slab.PTSlabID,
    slab.PtSlabId,
    slab.ptSlabId,
  );
  if (direct !== undefined) return direct;

  for (const [key, val] of Object.entries(slab)) {
    const k = key.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (k === "id" || k === "ptid" || k === "slabid" || k === "ptslabid") {
      const n = pickPositiveInt(val);
      if (n !== undefined) return n;
    }
  }
  return undefined;
}

function mapPtFromApi(raw: PtDetailsApi): PtDetails {
  return {
    group: (raw.group ?? []).map((group) => {
      const row = group as unknown as Record<string, unknown>;
      return {
        id: pickPositiveInt(row.id, row.ID, row.Id) ?? 0,
        name: String(row.Name ?? row.name ?? ""),
        state: String(row.State ?? row.state ?? ""),
      };
    }),

    slabs: (raw.slabs ?? []).map((slab) => {
      const row = slab as unknown as Record<string, unknown>;
      return {
        slabId: resolvePtSlabId(row),
        groupId: pickPositiveInt(
          row.PTGroupID,
          row.PTGroupId,
          row.ptGroupId,
          row.GroupId,
          row.groupId,
        ),
        effectiveFrom: toDisplayDate(
          String(row["Effective From"] ?? row.effectiveFrom ?? ""),
        ),
        period: String(row.Period ?? row.period ?? ""),
        fromSalary: Number(row.FromSalary ?? row.fromSalary ?? 0),
        toSalary: Number(row.ToSalary ?? row.toSalary ?? 0),
        ptAmount: Number(row.PTAmount ?? row.ptAmount ?? 0),
        isActive:
          row.IsActive === false || row.isActive === false ? false : true,
      };
    }),
  };
}

/** Body for PUT /api/admin/configuration/pt — { id, fromSalary, toSalary, ptAmount, isActive } */
export type UpdatePtSlabPayload = {
  id: number;
  fromSalary?: number;
  toSalary?: number;
  ptAmount?: number;
  isActive?: boolean;
};

function mapPtSlabToUpdateApi(slab: PtSlab): UpdatePtSlabPayload {
  const id = pickPositiveInt(slab.slabId);
  if (id === undefined) {
    throw new Error(
      "The PT API did not return a slab ID. Cannot update without unique id.",
    );
  }

  return {
    id,
    fromSalary: Number(slab.fromSalary),
    toSalary: Number(slab.toSalary),
    ptAmount: Number(slab.ptAmount),
    isActive: slab.isActive ?? true,
  };
}
// ------------------------------------------------------------
// LWF
// ------------------------------------------------------------

function mapLwfFromApi(raw: LwfDetailsApi): LwfDetails {
  const groups = (raw.group ?? []).map((group) => {
    const row = group as unknown as Record<string, unknown>;
    return {
      id: pickPositiveInt(row.id, row.ID, row.Id) ?? 0,
      defaultLWF: String(readKey(row, "Default LWF") ?? ""),
      state: String(readKey(row, "State") ?? ""),
      stateId: pickPositiveInt(readKey(row, "Stateid", "State ID", "StateId", "StateID")),
    };
  });
  const g0 = groups[0];

  return {
    group: groups.map(({ id, defaultLWF, state }) => ({ id, defaultLWF, state })),

    configuration: (raw.configuration ?? []).map((config) => {
      const row = config as unknown as Record<string, unknown>;

      // 1) Standard resolve
      let resolvedId = resolveRowId(row, [
        "lwfid",
        "lwfconfigid",
        "lwfconfigurationid",
        "lwfdetailsid",
        "lwfdefaultconfigurationid",
        "defaultlwfid",
        "lwfconfigurationdetailsid",
        "defaultconfigurationid",
        "defaultconfigid",
      ]);

      // 2) Explicit common aliases
      if (resolvedId === undefined) {
        resolvedId = pickPositiveInt(
          readKey(
            row,
            "ID",
            "Id",
            "id",
            "LWF ID",
            "LWFId",
            "LWFID",
            "ConfigID",
            "ConfigurationID",
            "DefaultConfigurationID",
            "LWFConfigurationID",
            "LWFConfigID",
            "LWFDetailsID",
          ),
        );
      }

      // 3) Last resort: any positive int field that is not group/state/company amounts
      if (resolvedId === undefined) {
        const skip = /group|state|company|employer|employee|cutoff|contribution|amount|rate|percent/;
        for (const [key, val] of Object.entries(row)) {
          const k = normKey(key);
          if (skip.test(k)) continue;
          const n = pickPositiveInt(val);
          if (n !== undefined && n > 0) {
            console.warn(
              `[LWF] Using fallback id from column "${key}" = ${n}. Raw keys:`,
              Object.keys(row),
            );
            resolvedId = n;
            break;
          }
        }
      }

      if (resolvedId === undefined) {
        console.warn(
          "[LWF] No configuration id found in GET row. Available keys:",
          Object.keys(row),
          "row:",
          row,
        );
      }

      return {
        id: resolvedId,
        groupId:
          pickPositiveInt(
            readKey(
              row,
              "LWFGroupID",
              "LWF Group ID",
              "LWFGroupId",
              "GroupID",
              "GroupId",
              "groupId",
            ),
          ) ?? (g0?.id || undefined),
        stateId:
          pickPositiveInt(
            readKey(row, "Stateid", "State ID", "StateId", "StateID", "stateId"),
          ) ?? g0?.stateId,
        stateName: g0?.state,
        effectiveFrom: toLocalDateString(
          String(
            readKey(row, "Effective From", "EffectiveFrom", "effectiveFrom") ??
              config["Effective From"] ??
              "",
          ),
        ),
        cutoffAmount: Number(
          readKey(
            row,
            "Cutoff Amount",
            "CutOffAmount",
            "CutoffAmount",
            "cutoffAmount",
            "Cut Off Amount",
          ) ??
            config["Cutoff Amount"] ??
            0,
        ),
        employeeContribution: Number(
          readKey(
            row,
            "Employee Contribution(Amount)",
            "EmployeeContribution",
            "Employee Contribution",
            "employeeContribution",
          ) ??
            config["Employee Contribution(Amount)"] ??
            0,
        ),
        employerContribution: Number(
          readKey(
            row,
            "Employer Contribution(Amount)",
            "EmployerContribution",
            "Employer Contribution",
            "employerContribution",
          ) ??
            config["Employer Contribution(Amount)"] ??
            0,
        ),
        january: Boolean(config.January ?? row.January ?? row.january ?? false),
        february: Boolean(config.February ?? row.February ?? row.february ?? false),
        march: Boolean(config.March ?? row.March ?? row.march ?? false),
        april: Boolean(config.April ?? row.April ?? row.april ?? false),
        may: Boolean(config.May ?? row.May ?? row.may ?? false),
        june: Boolean(config.June ?? row.June ?? row.june ?? false),
        july: Boolean(config.July ?? row.July ?? row.july ?? false),
        august: Boolean(config.August ?? row.August ?? row.august ?? false),
        september: Boolean(config.September ?? row.September ?? row.september ?? false),
        october: Boolean(config.October ?? row.October ?? row.october ?? false),
        november: Boolean(config.November ?? row.November ?? row.november ?? false),
        december: Boolean(config.December ?? row.December ?? row.december ?? false),
      };
    }),
  };
}

/** PUT /admin/configuration/lwf  (LWFDefaultConfigurationDto — `id`, `lwfGroupId`, `stateId` required) */
function mapLwfConfigToApi(
  config: LwfConfiguration,
): Record<string, unknown> {
  return {
    id: requireId(config.id, "LWF"),
    lwfGroupId: requireId(config.groupId, "LWF group"),
    stateId: resolveStateId(config.stateName, config.stateId),
    effectiveFrom: toApiEffectiveDate(config.effectiveFrom),
    cutoffAmount: Number(config.cutoffAmount),
    employeeContribution: Number(config.employeeContribution),
    employerContribution: Number(config.employerContribution),
    january: !!config.january,
    february: !!config.february,
    march: !!config.march,
    april: !!config.april,
    may: !!config.may,
    june: !!config.june,
    july: !!config.july,
    august: !!config.august,
    september: !!config.september,
    october: !!config.october,
    november: !!config.november,
    december: !!config.december,
    isDefault: true,
    isActive: true,
  };
}

// ------------------------------------------------------------
// Establishment
// ------------------------------------------------------------

// GET may return the object directly, wrapped in { data } / { result },
// or as a one-row array — handle all of them.
function unwrapEstablishmentResponse(
  response: unknown,
): EstablishmentDetailsApi {
  let r: unknown = response;
  if (r && typeof r === "object" && !Array.isArray(r)) {
    const o = r as Record<string, unknown>;
    if (o.data !== undefined) r = o.data;
    else if (o.result !== undefined) r = o.result;
  }
  if (Array.isArray(r)) r = r[0];
  return (r ?? {}) as EstablishmentDetailsApi;
}

function mapEstablishmentFromApi(
  raw: EstablishmentDetailsApi,
): EstablishmentDetails {
  const row = raw as unknown as Record<string, unknown>;
  const text = (...names: string[]) => {
    const v = readKey(row, ...names);
    return typeof v === "string" ? v : "";
  };
  const nature = readKey(row, "NatureOfBusiness");

  return {
    nameAndAddressOfEstablishment: text(
      "Name and Address of Establishment",
    ),
    nameAndAddressOfEmployer: text("Name and Address of Employer"),
    nameAndAddressOfPrincipalEmployer: text(
      "Name and Address of Prinicipal Employer",
      "Name and Address of Principal Employer",
    ),
    nameAndAddressOfContractor: text("Name and Address of Contractor"),
    nameAndAddressOfManager: text("Name and address of Manager"),
    natureOfBusiness: typeof nature === "string" ? nature : null,
  };
}

// Each textarea holds "Name" + "Address" together, but the backend wants them
// separately. Rule: first line = name, remaining lines = address.
// If everything is on one line, the text before the first comma is the name.
function splitNameAddress(value: string | null | undefined): { name: string; address: string } {
  const text = (value ?? "").trim();
  if (!text) return { name: "", address: "" };

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1) {
    return { name: lines[0], address: lines.slice(1).join(", ") };
  }

  const comma = text.indexOf(",");
  if (comma > 0) {
    return { name: text.slice(0, comma).trim(), address: text.slice(comma + 1).trim() };
  }
  return { name: text, address: "" };
}

function mapEstablishmentToApi(
  data: EstablishmentDetails,
): Record<string, unknown> {
  const establishment = splitNameAddress(data.nameAndAddressOfEstablishment);
  const employer = splitNameAddress(data.nameAndAddressOfEmployer);
  const principal = splitNameAddress(data.nameAndAddressOfPrincipalEmployer);
  const contractor = splitNameAddress(data.nameAndAddressOfContractor);
  const manager = splitNameAddress(data.nameAndAddressOfManager);

  return {
    establishmentName: establishment.name,
    establishmentAddress: establishment.address,
    employerName: employer.name,
    employerAddress: employer.address,
    principalEmployerName: principal.name,
    principalEmployerAddress: principal.address,
    contractorName: contractor.name,
    contractorAddress: contractor.address,
    managerName: manager.name,
    managerAddress: manager.address,
    natureOfBusiness: (data.natureOfBusiness ?? "").trim(),
    isActive: true,
  };
}

// ------------------------------------------------------------
// API endpoints
// ------------------------------------------------------------

function unwrapCompanyResponse(
  response: unknown,
): CompanyDetailsApi {
  if (response && typeof response === "object") {
    const r = response as Record<string, unknown>;
    if (
      r.data &&
      typeof r.data === "object" &&
      !Array.isArray(r.data)
    ) {
      return r.data as CompanyDetailsApi;
    }
    if (
      r.result &&
      typeof r.result === "object" &&
      !Array.isArray(r.result)
    ) {
      return r.result as CompanyDetailsApi;
    }
  }
  return response as CompanyDetailsApi;
}

type PutResult =
  | { data: undefined; error?: undefined }
  | { error: FetchBaseQueryError; data?: undefined };

const companyApiBase = baseApi.enhanceEndpoints({
  addTagTypes: [
    "CompanyDetails",
    "PF",
    "ESI",
    "PT",
    "LWF",
    "Establishment",
  ],
});

export const companyApi = companyApiBase.injectEndpoints({
  endpoints: (builder) => {
    /**
     * Builds the PUT body inside queryFn so mapping problems (missing id,
     * unknown state ...) surface as a normal RTK error instead of a silent
     * wrong request.
     */
    const putMapped = async (
      baseQuery: (arg: {
        url: string;
        method: string;
        body: unknown;
      }) => PromiseLike<{ error?: unknown }>,
      url: string,
      buildBody: () => unknown,
    ): Promise<PutResult> => {
      let body: unknown;
      try {
        body = buildBody();
      } catch (err) {
        return {
          error: {
            status: 400,
            data: err instanceof Error ? err.message : "Invalid data.",
          },
        };
      }
      const result = await baseQuery({ url, method: "PUT", body });
      if (result.error) {
        return { error: result.error as FetchBaseQueryError };
      }
      return { data: undefined };
    };

    return {
      getCompanyDetails: builder.query<CompanyDetails, void>({
        query: () => "/admin/configuration/company",
        providesTags: ["CompanyDetails"],
        transformResponse: (response: unknown) =>
          mapCompanyFromApi(unwrapCompanyResponse(response)),
      }),

      getSalaryRoundOff: builder.query<SalaryRoundOffOption[], void>({
        query: () => "/admin/configuration/salary-round-off",
        transformResponse: (response: unknown) =>
          mapSalaryRoundOffOptions(response),
      }),

      /** Same endpoint as salary-round-off; maps `data.periodType` for PT Period dropdown. */
      getPeriodTypes: builder.query<SalaryRoundOffOption[], void>({
        query: () => "/admin/configuration/salary-round-off",
        transformResponse: (response: unknown) =>
          mapPeriodTypeOptions(response),
      }),

      updateCompanyDetails: builder.mutation<void, CompanyDetails>({
        query: (body) => ({
          url: "/admin/configuration/company",
          method: "PUT",
          body: mapCompanyToApi(body),
        }),
        invalidatesTags: ["CompanyDetails"],
      }),

      getPfDetails: builder.query<PfDetails, void>({
        query: () => "/admin/configuration/pf",
        providesTags: ["PF"],
        transformResponse: (response: PfDetailsApi) =>
          mapPfFromApi(response),
      }),

      updatePfDetails: builder.mutation<
        void,
        {
          configuration: PfConfiguration;
          pfGroupId: number;
          roundOffTypeId: number;
        }
      >({
        async queryFn(
          { configuration, pfGroupId, roundOffTypeId },
          _api,
          _extra,
          baseQuery,
        ) {
          return putMapped(
            baseQuery as never,
            "/admin/configuration/pf",
            () => mapPfConfigToApi(configuration, pfGroupId, roundOffTypeId),
          );
        },
        invalidatesTags: ["PF"],
      }),

      getEsiDetails: builder.query<EsiDetails, void>({
        query: () => "/admin/configuration/esi",
        providesTags: ["ESI"],
        transformResponse: (response: EsiDetailsApi) =>
          mapEsiFromApi(response),
      }),

      updateEsiDetails: builder.mutation<
        void,
        { configuration: EsiConfiguration; roundOffTypeId: number }
      >({
        async queryFn(
          { configuration, roundOffTypeId },
          _api,
          _extra,
          baseQuery,
        ) {
          return putMapped(
            baseQuery as never,
            "/admin/configuration/esi",
            () => mapEsiConfigToApi(configuration, roundOffTypeId),
          );
        },
        invalidatesTags: ["ESI"],
      }),

      getPtDetails: builder.query<PtDetails, void>({
        query: () => "/admin/configuration/pt",
        transformResponse: (response: PtDetailsApi) =>
          mapPtFromApi(response),
        providesTags: ["PT"],
      }),

      /**
       * Updates existing PT slabs by unique id (PUT /admin/configuration/pt takes ONE slab:
       * { id, fromSalary, toSalary, ptAmount, isActive }), so slabs are sent one by one.
       */
      updatePtDetails: builder.mutation<void, { slabs: PtSlab[] }>({
        async queryFn({ slabs }, _api, _extra, baseQuery) {
          if (!slabs.length) {
            return {
              error: {
                status: 400,
                data: "At least one PT slab is required.",
              },
            };
          }

          for (const slab of slabs) {
            const result = await putMapped(
              baseQuery as never,
              "/admin/configuration/pt",
              () => mapPtSlabToUpdateApi(slab),
            );
            if (result.error) {
              return { error: result.error };
            }
          }

          return { data: undefined };
        },
        invalidatesTags: ["PT"],
      }),

      /**
       * POST /admin/configuration/documents/upload  (multipart, field name "file").
       * Backend answers { message, originalName, fileName, path, size, mimeType }.
       * `path` is stored as companyLogoPath on PUT /admin/configuration/company.
       */
      uploadCompanyDocument: builder.mutation<
        { path: string; fileName?: string; originalName?: string },
        File
      >({
        query: (file) => {
          const formData = new FormData();
          formData.append("file", file);
          return {
            url: "/admin/configuration/documents/upload",
            method: "POST",
            body: formData,
            // Do not set Content-Type - browser sets the multipart boundary
            formData: true,
          };
        },
        transformResponse: (response: {
          path?: string;
          fileName?: string;
          originalName?: string;
          filePath?: string;
          data?: { path?: string; fileName?: string };
        }) => {
          const path = normalizeUploadPath(
            response.path ?? response.data?.path ?? response.filePath ?? "",
          );
          return {
            path,
            fileName: response.fileName ?? response.data?.fileName,
            originalName: response.originalName,
          };
        },
      }),

      getLwfDetails: builder.query<LwfDetails, void>({
        query: () => "/admin/configuration/lwf",
        providesTags: ["LWF"],
        transformResponse: (response: LwfDetailsApi) =>
          mapLwfFromApi(response),
      }),

      updateLwfDetails: builder.mutation<void, LwfConfiguration>({
        async queryFn(config, _api, _extra, baseQuery) {
          return putMapped(
            baseQuery as never,
            "/admin/configuration/lwf",
            () => mapLwfConfigToApi(config),
          );
        },
        invalidatesTags: ["LWF"],
      }),

      getEstablishmentDetails: builder.query<
        EstablishmentDetails,
        void
      >({
        query: () => "/admin/configuration/establishment",
        transformResponse: (response: unknown) =>
          mapEstablishmentFromApi(unwrapEstablishmentResponse(response)),
        providesTags: ["Establishment"],
      }),

      updateEstablishmentDetails: builder.mutation<
        void,
        EstablishmentDetails
      >({
        query: (body) => ({
          url: "/admin/configuration/establishment",
          method: "PUT",
          body: mapEstablishmentToApi(body),
        }),
        invalidatesTags: ["Establishment"],
      }),
    };
  },
});

export const {
  useGetCompanyDetailsQuery,
  useGetSalaryRoundOffQuery,
  useGetPeriodTypesQuery,
  useGetPfDetailsQuery,
  useGetEsiDetailsQuery,
  useGetPtDetailsQuery,
  useGetLwfDetailsQuery,
  useGetEstablishmentDetailsQuery,
  useUpdateCompanyDetailsMutation,
  useUpdatePfDetailsMutation,
  useUpdateEsiDetailsMutation,
  useUpdatePtDetailsMutation,
  useUpdateLwfDetailsMutation,
  useUpdateEstablishmentDetailsMutation,
  useUploadCompanyDocumentMutation,
} = companyApi;