const API_BASE_URL = "http://localhost:3001";

type RequestParams = Record<string, unknown>;

const buildQueryString = (params?: RequestParams): string => {
  if (!params) {
    return "";
  }

  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      !(Array.isArray(value) && value.length === 0)
    ) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          searchParams.append(key, String(item));
        });
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  const queryString = searchParams.toString();

  return queryString ? `?${queryString}` : "";
};

const getRequest = async <T>(
  endpoint: string,
  params?: RequestParams,
): Promise<T> => {
  const response = await fetch(
    `${API_BASE_URL}${endpoint}${buildQueryString(params)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `API request failed: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
};

/* Audit Trail */

export const getAuditTrail = (params?: RequestParams) =>
  getRequest("/api/reports/others/audittrail", params);

export const getAuditTrailEmployees = () =>
  getRequest("/api/reports/others/audittrail/filters/employees");

export const getAuditTrailPages = () =>
  getRequest("/api/reports/others/audittrail/filters/pages");

/* Audit Trail For Import */

export const getAuditTrailImport = (params?: RequestParams) =>
  getRequest("/api/reports/others/audittrailimport", params);

export const getAuditTrailImportEmployees = () =>
  getRequest("/api/reports/others/audittrailimport/filters/employees");

/* Workflow Status */

export const getWorkflowStatus = (params?: RequestParams) =>
  getRequest("/api/reports/others/workflowstatus", params);

export const getWorkflowModules = () =>
  getRequest("/api/reports/others/workflowstatus/filters/modules");

export const getWorkflowWorkflows = () =>
  getRequest("/api/reports/others/workflowstatus/filters/workflows");

export const getWorkflowGroups = () =>
  getRequest("/api/reports/others/workflowstatus/filters/groups");

export const getWorkflowApprovers = () =>
  getRequest("/api/reports/others/workflowstatus/filters/approvers");

/* Attrition Report */

export const getAttritionReport = (params?: RequestParams) =>
  getRequest("/api/reports/others/attritionreport", params);

export const getAttritionFinancialYears = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/financialyears",
  );

export const getAttritionBranches = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/branches",
  );

export const getAttritionSalaryStructures = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/salarystructures",
  );

export const getAttritionLeaves = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/leaves",
  );

export const getAttritionAttendance = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/attendance",
  );

export const getAttritionDesignations = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/designations",
  );

export const getAttritionEmployeeStatus = () =>
  getRequest(
    "/api/reports/others/attritionreport/filters/empstatus",
  );