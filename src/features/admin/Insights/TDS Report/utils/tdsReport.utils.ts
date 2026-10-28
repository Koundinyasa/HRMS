export const getTDSReportFileName = (reportName: string): string => {
  return reportName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9-_]/g, "")
    .toLowerCase();
};

export const formatTDSValue = (value: unknown): string => {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  return String(value);
};