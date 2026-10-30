import { API_BASE_URL } from "@/app/apiConfig";

// Same address as every other API call (VITE_API_URL). The old code read a
// different variable, VITE_API_BASE_URL, which nothing else defines.
export const MISSED_PUNCH_API_BASE_URL = API_BASE_URL;

export const COMPANY_STORAGE_KEYS = [
  "companyId",
  "CompanyId",
  "CompanyID",
] as const;