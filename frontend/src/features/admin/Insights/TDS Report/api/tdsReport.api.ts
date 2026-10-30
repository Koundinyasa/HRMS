import { apiFetch } from "@/app/apiFetch";

export const fetchTDSReport = async (endpoint: string) => {
  const response = await apiFetch(endpoint);

  if (!response.ok) {
    throw new Error(`Unable to load TDS report (${response.status}).`);
  }

  const payload = await response.json();
  const rows = Array.isArray(payload)
    ? payload
    : payload?.rows ?? payload?.data ?? payload?.items ?? [];

  return Array.isArray(rows) ? rows : [];
};