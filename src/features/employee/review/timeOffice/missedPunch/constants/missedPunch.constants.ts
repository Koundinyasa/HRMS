export const MISSED_PUNCH_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3001/api";

export const COMPANY_STORAGE_KEYS = [
  "companyId",
  "CompanyId",
  "CompanyID",
] as const;