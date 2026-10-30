import { baseApi } from "@/app/baseApi";
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
} from "../types/company.types";

// ------------------------------------------------------------
// Cached group information from GET responses
// ------------------------------------------------------------

let lastPfGroupId = 1;
let lastEsiGroupId = 1;
let lastPtGroupId = 1;
let lastPtStateName: string | undefined;
let lastPtStateId: number | undefined;
let lastLwfGroupId = 1;
let lastLwfStateName: string | undefined;
let lastLwfStateId: number | undefined;

// ------------------------------------------------------------
// Date helpers
// ------------------------------------------------------------

function toDateInputValue(
  value: string | null | undefined,
): string {
  if (!value) return "";

  if (value.includes("T")) {
    return value.slice(0, 10);
  }

  return value;
}

function toMonthYear(
  value: string | null | undefined,
): string {
  if (!value) return "";

  const datePart = value.includes("T")
    ? value.slice(0, 10)
    : value;

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    datePart,
  );

  if (!match) return value;

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

  const monthIndex = Number(match[2]) - 1;

  if (monthIndex < 0 || monthIndex > 11) {
    return value;
  }

  return `${months[monthIndex]}/${match[1]}`;
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

  const isoDateMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (isoDateMatch) {
    return `${value}T00:00:00.000Z`;
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

  if (!monthYearMatch) {
    return value;
  }

  const monthIndex = months.findIndex(
    (month) =>
      month.toLowerCase() ===
      monthYearMatch[1].toLowerCase(),
  );

  if (monthIndex < 0) {
    return value;
  }

  const month = String(monthIndex + 1).padStart(
    2,
    "0",
  );

  return `${monthYearMatch[2]}-${month}-01T00:00:00.000Z`;
}

// ------------------------------------------------------------
// Common helpers
// ------------------------------------------------------------

function mapRoundOffLabelToId(
  label: string | undefined,
): number {
  const value = (label ?? "").toLowerCase();

  if (value.includes("higher")) return 2;
  if (value.includes("lower")) return 3;

  return 1;
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
// State ID mapping
// ------------------------------------------------------------

function getStateId(
  stateName: string | undefined,
  cachedId?: number,
): number {
  if (typeof cachedId === "number" && cachedId > 0) {
    return cachedId;
  }

  const normalized = (stateName ?? "")
    .trim()
    .toLowerCase();

  const stateIds: Record<string, number> = {
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

  if (normalized && stateIds[normalized] !== undefined) {
    return stateIds[normalized];
  }

  console.warn(
    `[PT/LWF] Unknown state "${stateName}". Falling back to stateId=24.`,
  );
  return 24;
}

// ------------------------------------------------------------
// Company
// ------------------------------------------------------------

function mapCompanyFromApi(
  raw: CompanyDetailsApi & Record<string, unknown>,
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
    companyLogoPath: str("CompanyLogoPath", "companyLogoPath"),
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
    companyLogoPath: data.companyLogoPath ?? "",
  };
}

// ------------------------------------------------------------
// PF
// ------------------------------------------------------------

function mapPfFromApi(raw: PfDetailsApi): PfDetails {
  lastPfGroupId = raw.group?.[0]?.ID ?? 1;

  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.ID,
      name: group.Name,
    })),

    configuration: (raw.configuration ?? []).map((config) => ({
      effectiveFrom: toMonthYear(config["Effective From"]),
      epfPercentage: config["EPF(A)-(%)"] ?? 0,
      cutoff: config.Cutoff ?? 0,
      pfOnPayDays: config["PF On Pay Days"] ?? false,
      pensionFundPercentage: config["Pension Fund(B)-(%)"] ?? 0,
      employerEPFPercentage: config["EPF(A-B)-(%)"] ?? 0,
      roundOff: config["Round Off"] ?? "Nearest Amount",
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

function mapPfConfigToApi(
  config: PfConfiguration,
): Record<string, unknown> {
  return {
    pfGroupId: lastPfGroupId,
    effectiveFrom: toIsoDate(config.effectiveFrom),
    epfPercentage: Number(config.epfPercentage),
    cutoff: Number(config.cutoff),
    pfOnPayDays: !!config.pfOnPayDays,
    pensionFundPercentage: Number(config.pensionFundPercentage),
    employerEPFPercentage: Number(config.employerEPFPercentage),
    roundOffTypeId: mapRoundOffLabelToId(config.roundOff),
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
  lastEsiGroupId = raw.group?.[0]?.ID ?? 1;

  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.ID,
      name: group.Name,
    })),

    configuration: (raw.configuration ?? []).map((config) => ({
      effectiveFrom: toMonthYear(config["Effective From"]),
      cutOffAmount: config["Cut Off(Amount)"] ?? 0,
      employeeRate: config["Employee Rate(%)"] ?? 0,
      employerRate: config["Employer Rate(%)"] ?? 0,
      minimumDailyWage:
        config["Minimum Daily Wage(Amount)"] ?? 0,
      roundOff: config["Round Off"] ?? "Nearest Amount",
    })),
  };
}

function mapEsiConfigToApi(
  config: EsiConfiguration,
): Record<string, unknown> {
  return {
    esiGroupId: lastEsiGroupId,
    effectiveFrom: toIsoDate(config.effectiveFrom),
    cutOffAmount: Number(config.cutOffAmount),
    employeeRate: Number(config.employeeRate),
    employerRate: Number(config.employerRate),
    minimumDailyWage: Number(config.minimumDailyWage),
    roundOffTypeId: mapRoundOffLabelToId(config.roundOff),
    isDefault: true,
    isActive: true,
  };
}

// ------------------------------------------------------------
// PT
// ------------------------------------------------------------

function mapPtFromApi(raw: PtDetailsApi): PtDetails {
  const g0 = raw.group?.[0];
  lastPtGroupId = g0?.id ?? 1;
  lastPtStateName =
    g0?.State ?? (g0 as { state?: string } | undefined)?.state;
  const sid =
    g0?.Stateid ??
    (g0 as { stateId?: number; StateId?: number } | undefined)
      ?.stateId ??
    (g0 as { StateId?: number } | undefined)?.StateId;
  lastPtStateId =
    typeof sid === "number" && sid > 0 ? sid : undefined;

  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.id,
      name: group.Name,
      state: group.State,
    })),

    slabs: (raw.slabs ?? []).map((slab) => ({
      effectiveFrom: toMonthYear(slab["Effective From"]),
      period: slab.Period ?? "Monthly",
      fromSalary: slab.FromSalary ?? 0,
      toSalary: slab.ToSalary ?? 0,
      ptAmount: slab.PTAmount ?? 0,
    })),
  };
}



function mapPtSlabsToApi(
  slabs: PtSlab[],
): Record<string, unknown> {
  const firstSlab = slabs[0];

  if (!firstSlab) {
    throw new Error("At least one PT slab is required.");
  }

  const effectiveFrom = toIsoDate(firstSlab.effectiveFrom);
  const periodTypeId = mapPeriodLabelToId(firstSlab.period);
  const stateId = getStateId(lastPtStateName, lastPtStateId);

  const body = {
    ptGroupId: lastPtGroupId,
    stateId,
    effectiveFrom,
    periodTypeId,
    slabs: slabs.map((slab) => ({
      fromSalary: Number(slab.fromSalary),
      toSalary: Number(slab.toSalary),
      ptAmount: Number(slab.ptAmount),
    })),
  };

  console.log("[PT] update payload", body);

  return body;
}
// ------------------------------------------------------------
// LWF
// ------------------------------------------------------------

function mapLwfFromApi(raw: LwfDetailsApi): LwfDetails {
  const g0 = raw.group?.[0] as
    | (LwfDetailsApi["group"][number] & {
        Stateid?: number;
        stateId?: number;
        StateId?: number;
        state?: string;
      })
    | undefined;

  lastLwfGroupId = g0?.id ?? 1;
  lastLwfStateName = g0?.State ?? g0?.state;
  const sid = g0?.Stateid ?? g0?.stateId ?? g0?.StateId;
  lastLwfStateId =
    typeof sid === "number" && sid > 0 ? sid : undefined;

  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.id,
      defaultLWF: group["Default LWF"] ?? "",
      state: group.State ?? "",
    })),

    configuration: (raw.configuration ?? []).map((config) => ({
      effectiveFrom: toMonthYear(config["Effective From"]),
      cutoffAmount: config["Cutoff Amount"] ?? 0,
      employeeContribution:
        config["Employee Contribution(Amount)"] ?? 0,
      employerContribution:
        config["Employer Contribution(Amount)"] ?? 0,
      january: config.January ?? false,
      february: config.February ?? false,
      march: config.March ?? false,
      april: config.April ?? false,
      may: config.May ?? false,
      june: config.June ?? false,
      july: config.July ?? false,
      august: config.August ?? false,
      september: config.September ?? false,
      october: config.October ?? false,
      november: config.November ?? false,
      december: config.December ?? false,
    })),
  };
}

function mapLwfConfigToApi(
  config: LwfConfiguration,
): Record<string, unknown> {
  return {
    lwfGroupId: lastLwfGroupId,
    stateId: getStateId(lastLwfStateName, lastLwfStateId),
    effectiveFrom: toIsoDate(config.effectiveFrom),
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
  return {
    nameAndAddressOfEstablishment:
      raw["Name and Address of Establishment"] ?? "",
    nameAndAddressOfEmployer:
      raw["Name and Address of Employer"] ?? "",
    nameAndAddressOfPrincipalEmployer:
      raw["Name and Address of Prinicipal Employer"] ?? "",
    nameAndAddressOfContractor:
      raw["Name and Address of Contractor"] ?? "",
    nameAndAddressOfManager:
      raw["Name and address of Manager"] ?? "",
    natureOfBusiness: raw.NatureOfBusiness ?? null,
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

const companyApiBase = baseApi.enhanceEndpoints({
  addTagTypes: ["CompanyDetails", "PT", "Establishment"],
});

export const companyApi = companyApiBase.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyDetails: builder.query<CompanyDetails, void>({
      query: () => "/admin/configuration/company",
      providesTags: ["CompanyDetails"],
      transformResponse: (response: unknown) =>
        mapCompanyFromApi(unwrapCompanyResponse(response)),
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
      transformResponse: (response: PfDetailsApi) =>
        mapPfFromApi(response),
    }),

    updatePfDetails: builder.mutation<void, PfConfiguration>({
      query: (body) => ({
        url: "/admin/configuration/pf",
        method: "PUT",
        body: mapPfConfigToApi(body),
      }),
    }),

    getEsiDetails: builder.query<EsiDetails, void>({
      query: () => "/admin/configuration/esi",
      transformResponse: (response: EsiDetailsApi) =>
        mapEsiFromApi(response),
    }),

    updateEsiDetails: builder.mutation<void, EsiConfiguration>({
      query: (body) => ({
        url: "/admin/configuration/esi",
        method: "PUT",
        body: mapEsiConfigToApi(body),
      }),
    }),

    getPtDetails: builder.query<PtDetails, void>({
      query: () => "/admin/configuration/pt",
      transformResponse: (response: PtDetailsApi) =>
        mapPtFromApi(response),
      providesTags: ["PT"],
    }),

    updatePtDetails: builder.mutation<void, { slabs: PtSlab[] }>({
      query: (body) => ({
        url: "/admin/configuration/pt",
        method: "PUT",
        body: mapPtSlabsToApi(body.slabs),
      }),
      invalidatesTags: ["PT"],
    }),

    getLwfDetails: builder.query<LwfDetails, void>({
      query: () => "/admin/configuration/lwf",
      transformResponse: (response: LwfDetailsApi) =>
        mapLwfFromApi(response),
    }),

    updateLwfDetails: builder.mutation<void, LwfConfiguration>({
      query: (body) => ({
        url: "/admin/configuration/lwf",
        method: "PUT",
        body: mapLwfConfigToApi(body),
      }),
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
  }),
});

export const {
  useGetCompanyDetailsQuery,
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
} = companyApi;