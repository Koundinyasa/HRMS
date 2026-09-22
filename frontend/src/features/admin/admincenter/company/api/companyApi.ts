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
let lastLwfGroupId = 1;
let lastLwfStateName: string | undefined;
 
// ------------------------------------------------------------
// Date helpers
// ------------------------------------------------------------
 
function toDateInputValue(
  value: string | null | undefined,
): string {
  if (!value) return "";
 
  // API dates may be UTC ISO strings.
  // Convert to the date represented by the ISO date portion.
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
 
  // Already an ISO date/time.
  if (value.includes("T")) {
    return value;
  }
 
  // YYYY-MM-DD from date inputs.
  const isoDateMatch =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
 
  if (isoDateMatch) {
    // Use UTC midnight for the selected calendar date.
    return `${value}T00:00:00.000Z`;
  }
 
  // Handle values such as Jul/2026.
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
 
// Telangana = 24, based on the intended PT payload.
// Add other states using their verified backend IDs.
// Do not assume these IDs match another master-data system.
 
function getStateId(
  stateName: string | undefined,
): number {
  const normalized = (stateName ?? "")
    .trim()
    .toLowerCase();
 
  const stateIds: Record<string, number> = {
    telangana: 24,
  };
 
  const stateId = stateIds[normalized];
 
  if (stateId === undefined) {
    throw new Error(
      `Unknown state "${stateName}". ` +
        "Please add its verified backend state ID.",
    );
  }
 
  return stateId;
}
 
// ------------------------------------------------------------
// Company
// ------------------------------------------------------------
 
function mapCompanyFromApi(
  raw: CompanyDetailsApi,
): CompanyDetails {
  return {
    companyName: raw.CompanyName ?? "",
    dateOfEstablishment: toDateInputValue(
      raw.DateOfEstablishment,
    ),
    cin_LPIN: raw.CIN_LPIN ?? "",
    tan: raw.TAN ?? "",
    website: raw.Website ?? "",
    address1: raw.Address1 ?? "",
    address2: raw.Address2 ?? "",
    address3: raw.Address3 ?? "",
    contactMobile: raw.ContactMobile ?? "",
    companyCode: raw.CompanyCode ?? "",
    isPFApplicable: raw.IsPFApplicable ?? false,
    isESIApplicable: raw.IsESIApplicable ?? false,
    isPTApplicable: raw.IsPTApplicable ?? false,
    isTDSApplicable: raw.IsTDSApplicable ?? false,
    tdsFilingMarToFeb:
      raw.TDSFilingMarToFeb ?? false,
    isLWFAvailable: raw.IsLWFAvailable ?? false,
    companyLogoPath: raw.CompanyLogoPath ?? "",
  };
}
 
function mapCompanyToApi(
  data: CompanyDetails,
): CompanyDetailsApi {
  return {
    CompanyName: data.companyName,
    DateOfEstablishment: data.dateOfEstablishment,
    CIN_LPIN: data.cin_LPIN,
    TAN: data.tan,
    Website: data.website,
    Address1: data.address1,
    Address2: data.address2,
    Address3: data.address3,
    ContactMobile: data.contactMobile,
    CompanyCode: data.companyCode,
    IsPFApplicable: data.isPFApplicable,
    IsESIApplicable: data.isESIApplicable,
    IsPTApplicable: data.isPTApplicable,
    IsTDSApplicable: data.isTDSApplicable,
    TDSFilingMarToFeb: data.tdsFilingMarToFeb,
    IsLWFAvailable: data.isLWFAvailable,
    CompanyLogoPath: data.companyLogoPath,
  };
}
 
// ------------------------------------------------------------
// PF
// ------------------------------------------------------------
 
function mapPfFromApi(
  raw: PfDetailsApi,
): PfDetails {
  lastPfGroupId = raw.group?.[0]?.ID ?? 1;
 
  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.ID,
      name: group.Name,
    })),
 
    configuration: (raw.configuration ?? []).map(
      (config) => ({
        effectiveFrom: toMonthYear(
          config["Effective From"],
        ),
        epfPercentage:
          config["EPF(A)-(%)"] ?? 0,
        cutoff: config.Cutoff ?? 0,
        pfOnPayDays:
          config["PF On Pay Days"] ?? false,
        pensionFundPercentage:
          config["Pension Fund(B)-(%)"] ?? 0,
        employerEPFPercentage:
          config["EPF(A-B)-(%)"] ?? 0,
        roundOff:
          config["Round Off"] ?? "Nearest Amount",
        accountNo02Rate:
          config["Account No. 02(%)"] ?? 0,
        accountNo21Rate:
          config["Account No.21(%)"] ?? 0,
        minimumChargesAccNo02:
          config["Minimum Charges For Acc.No.2"] ??
          0,
        restrictEmployerShare:
          config["Restrict Employer Share"] ??
          false,
        restrictEmployerEmployeeWise:
          config[
            "Restrict Employer Share EmployeeWise"
          ] ?? false,
      }),
    ),
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
    pensionFundPercentage: Number(
      config.pensionFundPercentage,
    ),
    employerEPFPercentage: Number(
      config.employerEPFPercentage,
    ),
    roundOffTypeId: mapRoundOffLabelToId(
      config.roundOff,
    ),
    accountNo02Rate: Number(
      config.accountNo02Rate,
    ),
    accountNo21Rate: Number(
      config.accountNo21Rate,
    ),
    minimumChargesAccNo02: Number(
      config.minimumChargesAccNo02,
    ),
    restrictEmployerShare:
      !!config.restrictEmployerShare,
    restrictEmployerEmployeeWise:
      !!config.restrictEmployerEmployeeWise,
    isDefault: true,
    isActive: true,
  };
}
 
// ------------------------------------------------------------
// ESI
// ------------------------------------------------------------
 
function mapEsiFromApi(
  raw: EsiDetailsApi,
): EsiDetails {
  lastEsiGroupId = raw.group?.[0]?.ID ?? 1;
 
  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.ID,
      name: group.Name,
    })),
 
    configuration: (raw.configuration ?? []).map(
      (config) => ({
        effectiveFrom: toMonthYear(
          config["Effective From"],
        ),
        cutOffAmount:
          config["Cut Off(Amount)"] ?? 0,
        employeeRate:
          config["Employee Rate(%)"] ?? 0,
        employerRate:
          config["Employer Rate(%)"] ?? 0,
        minimumDailyWage:
          config["Minimum Daily Wage(Amount)"] ??
          0,
        roundOff:
          config["Round Off"] ?? "Nearest Amount",
      }),
    ),
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
    minimumDailyWage: Number(
      config.minimumDailyWage,
    ),
    roundOffTypeId: mapRoundOffLabelToId(
      config.roundOff,
    ),
    isDefault: true,
    isActive: true,
  };
}
 
// ------------------------------------------------------------
// PT
// ------------------------------------------------------------
 
function mapPtFromApi(
  raw: PtDetailsApi,
): PtDetails {
  lastPtGroupId = raw.group?.[0]?.id ?? 1;
  lastPtStateName = raw.group?.[0]?.State;
 
  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.id,
      name: group.Name,
      state: group.State,
    })),
 
    slabs: (raw.slabs ?? []).map((slab) => ({
      effectiveFrom: toMonthYear(
        slab["Effective From"],
      ),
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
    throw new Error(
      "At least one PT slab is required.",
    );
  }
 
  const effectiveFrom = toIsoDate(
    firstSlab.effectiveFrom,
  );
 
  const periodTypeId = mapPeriodLabelToId(
    firstSlab.period,
  );
 
  const stateId = getStateId(lastPtStateName);
 
  return {
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
}
 
// ------------------------------------------------------------
// LWF
// ------------------------------------------------------------
 
function mapLwfFromApi(
  raw: LwfDetailsApi,
): LwfDetails {
  lastLwfGroupId = raw.group?.[0]?.id ?? 1;
  lastLwfStateName = raw.group?.[0]?.State;
 
  return {
    group: (raw.group ?? []).map((group) => ({
      id: group.id,
      defaultLWF:
        group["Default LWF"] ?? "",
      state: group.State ?? "",
    })),
 
    configuration: (raw.configuration ?? []).map(
      (config) => ({
        effectiveFrom: toMonthYear(
          config["Effective From"],
        ),
        cutoffAmount:
          config["Cutoff Amount"] ?? 0,
        employeeContribution:
          config[
            "Employee Contribution(Amount)"
          ] ?? 0,
        employerContribution:
          config[
            "Employer Contribution(Amount)"
          ] ?? 0,
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
      }),
    ),
  };
}
 
function mapLwfConfigToApi(
  config: LwfConfiguration,
): Record<string, unknown> {
  return {
    lwfGroupId: lastLwfGroupId,
    stateId: getStateId(lastLwfStateName),
    effectiveFrom: toIsoDate(config.effectiveFrom),
    cutoffAmount: Number(config.cutoffAmount),
    employeeContribution: Number(
      config.employeeContribution,
    ),
    employerContribution: Number(
      config.employerContribution,
    ),
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
 
function mapEstablishmentFromApi(
  raw: EstablishmentDetailsApi,
): EstablishmentDetails {
  return {
    nameAndAddressOfEstablishment:
      raw["Name and Address of Establishment"] ??
      "",
    nameAndAddressOfEmployer:
      raw["Name and Address of Employer"] ?? "",
    nameAndAddressOfPrincipalEmployer:
      raw[
        "Name and Address of Prinicipal Employer"
      ] ?? "",
    nameAndAddressOfContractor:
      raw["Name and Address of Contractor"] ?? "",
    nameAndAddressOfManager:
      raw["Name and address of Manager"] ?? "",
    natureOfBusiness:
      raw.NatureOfBusiness ?? null,
  };
}
 
function mapEstablishmentToApi(
  data: EstablishmentDetails,
): EstablishmentDetailsApi {
  return {
    "Name and Address of Establishment":
      data.nameAndAddressOfEstablishment ?? "",
    "Name and Address of Employer":
      data.nameAndAddressOfEmployer ?? "",
    "Name and Address of Prinicipal Employer":
      data.nameAndAddressOfPrincipalEmployer ?? "",
    "Name and Address of Contractor":
      data.nameAndAddressOfContractor ?? "",
    "Name and address of Manager":
      data.nameAndAddressOfManager ?? "",
    NatureOfBusiness: data.natureOfBusiness,
  };
}
 
// ------------------------------------------------------------
// API endpoints
// ------------------------------------------------------------
 
export const companyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Company
    getCompanyDetails: builder.query<
      CompanyDetails,
      void
    >({
      query: () => "/admin/configuration/company",
      transformResponse: (
        response: CompanyDetailsApi,
      ) => mapCompanyFromApi(response),
    }),
 
    updateCompanyDetails: builder.mutation<
      void,
      CompanyDetails
    >({
      query: (body) => ({
        url: "/admin/configuration/company",
        method: "PUT",
        body: mapCompanyToApi(body),
      }),
    }),
 
    // PF
    getPfDetails: builder.query<PfDetails, void>({
      query: () => "/admin/configuration/pf",
      transformResponse: (
        response: PfDetailsApi,
      ) => mapPfFromApi(response),
    }),
 
    updatePfDetails: builder.mutation<
      void,
      PfConfiguration
    >({
      query: (body) => ({
        url: "/admin/configuration/pf",
        method: "PUT",
        body: mapPfConfigToApi(body),
      }),
    }),
 
    // ESI
    getEsiDetails: builder.query<EsiDetails, void>({
      query: () => "/admin/configuration/esi",
      transformResponse: (
        response: EsiDetailsApi,
      ) => mapEsiFromApi(response),
    }),
 
    updateEsiDetails: builder.mutation<
      void,
      EsiConfiguration
    >({
      query: (body) => ({
        url: "/admin/configuration/esi",
        method: "PUT",
        body: mapEsiConfigToApi(body),
      }),
    }),
 
    // PT
    getPtDetails: builder.query<
      PtDetails,
      void
    >({
      query: () => "/admin/configuration/pt",
      transformResponse: (
        response: PtDetailsApi,
      ) => mapPtFromApi(response),
 
      // Refresh cached PT details after successful update.
      providesTags: ["PT"],
    }),
 
    updatePtDetails: builder.mutation<
      void,
      { slabs: PtSlab[] }
    >({
      query: (body) => ({
        url: "/admin/configuration/pt",
        method: "PUT",
        body: mapPtSlabsToApi(body.slabs),
      }),
 
      // Causes getPtDetails to refetch after PUT succeeds.
      invalidatesTags: ["PT"],
    }),
 
    // LWF
    getLwfDetails: builder.query<
      LwfDetails,
      void
    >({
      query: () => "/admin/configuration/lwf",
      transformResponse: (
        response: LwfDetailsApi,
      ) => mapLwfFromApi(response),
    }),
 
    updateLwfDetails: builder.mutation<
      void,
      LwfConfiguration
    >({
      query: (body) => ({
        url: "/admin/configuration/lwf",
        method: "PUT",
        body: mapLwfConfigToApi(body),
      }),
    }),
 
    // Establishment
    getEstablishmentDetails: builder.query<
      EstablishmentDetails,
      void
    >({
      query: () => "/admin/configuration/establishment",
      transformResponse: (
        response: EstablishmentDetailsApi,
      ) => mapEstablishmentFromApi(response),
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