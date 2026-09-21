export const fetchTDSReport = async (endpoint: string) => {
  const token = localStorage.getItem("token");
  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });

  if (!response.ok) {
    throw new Error(`Unable to load TDS report (${response.status}).`);
  }

  const payload = await response.json();
  const rows = Array.isArray(payload)
    ? payload
    : payload?.rows ?? payload?.data ?? payload?.items ?? [];

  return Array.isArray(rows) ? rows : [];
};