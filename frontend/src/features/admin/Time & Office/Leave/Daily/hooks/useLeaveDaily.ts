import { useCallback, useMemo, useState } from "react";
import {
  getLeaveDaily,
  getLeaveDailyErrorMessage,
  useGetCompanyDropdownDataQuery,
  useGetEmployeeLeaveBalanceQuery,
  useGetLeaveMasterDataQuery,
  useGetMonthlyLeaveCalendarQuery,
  withLeaveCodes,
  type LeaveDailyFilterKey,
  type LeaveDailyOption,
  type MonthlyLeaveCalendarRow,
} from "../api";
import type {
  LeaveDailyFilters,
  LeaveDailyPagination,
  LeaveDailyRow,
} from "../types/leaveDaily.types";
import {
  LEAVE_DAILY_DEFAULT_PAGE_SIZE,
  LEAVE_DAILY_DEFAULT_FILTERS,
} from "../constants/leaveDaily.constants";

export const useLeaveDaily = () => {
  const [filters, setFilters] = useState<LeaveDailyFilters>(
    LEAVE_DAILY_DEFAULT_FILTERS,
  );

  const [rows, setRows] = useState<LeaveDailyRow[]>([]);
  const [pagination, setPagination] = useState<LeaveDailyPagination>({
    pageNumber: 1,
    pageSize: LEAVE_DAILY_DEFAULT_PAGE_SIZE,
    totalCount: 0,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLeaveDaily = useCallback(
    async (
      nextFilters: LeaveDailyFilters = filters,
      pageNumber = pagination.pageNumber,
      pageSize = pagination.pageSize,
    ) => {
      try {
        setLoading(true);
        setError(null);

        const response = await getLeaveDaily(
          nextFilters,
          pageNumber,
          pageSize,
        );

        setRows(response.data ?? []);

        setPagination({
          pageNumber: response.pageNumber,
          pageSize: response.pageSize,
          totalCount: response.totalCount,
        });
      } catch (err) {
        setRows([]);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load Leave Daily data.",
        );
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.pageNumber, pagination.pageSize],
  );

  const updateFilters = (nextFilters: LeaveDailyFilters) => {
    setFilters(nextFilters);
    setPagination((current) => ({
      ...current,
      pageNumber: 1,
    }));
  };

  const changePage = (pageNumber: number) => {
    setPagination((current) => ({
      ...current,
      pageNumber,
    }));
  };

  const changePageSize = (pageSize: number) => {
    setPagination({
      pageNumber: 1,
      pageSize,
      totalCount: pagination.totalCount,
    });
  };

  return {
    filters,
    rows,
    pagination,
    loading,
    error,
    updateFilters,
    fetchLeaveDaily,
    changePage,
    changePageSize,
  };
};

/* ------------------------------------------------------------------ */
/*  Leave Daily page hooks (RTK Query)                                 */
/* ------------------------------------------------------------------ */

const NO_OPTIONS: LeaveDailyOption[] = [];
const NO_ROWS: MonthlyLeaveCalendarRow[] = [];

/** Loads all filter dropdowns from company-dropdown-data (one API call). */
export const useLeaveDailyFilterOptions = () => {
  // ===== GET .../company-dropdown-data (the company comes from the login token) =====
  const query = useGetCompanyDropdownDataQuery();

  const options = useMemo<Record<LeaveDailyFilterKey, LeaveDailyOption[]>>(
    () => ({
      branch: query.data?.branches ?? NO_OPTIONS,
      salaryStructure: query.data?.salaryStructures ?? NO_OPTIONS,
      leave: query.data?.leaveTypes ?? NO_OPTIONS,
      attendance: query.data?.attendanceStatuses ?? NO_OPTIONS,
      designation: query.data?.designations ?? NO_OPTIONS,
      empStatus: query.data?.employeeStatuses ?? NO_OPTIONS,
    }),
    [query.data],
  );

  return { options, loading: query.isLoading || query.isFetching, error: query.isError };
};

/** Leave balance for one employee — eye / summary panel. */
export const useEmployeeLeaveBalance = (employeeId: string | undefined) => {
  // ===== CHANGED: GET .../employee-leave-balance?employeeId= =====
  const query = useGetEmployeeLeaveBalanceQuery(employeeId ?? "", {
    skip: !employeeId,
  });

  return {
    rows: query.data ?? [],
    loading: query.isFetching,
    error: query.isError ? getLeaveDailyErrorMessage(query.error) : null,
    reload: query.refetch,
  };
};

interface UseMonthlyLeaveCalendarParams {
  year: number;
  /** 1 - 12 */
  month: number;
  /** Selected ids of each filter (option values). Empty / omitted = that filter is not applied. */
  branchIds?: string[];
  employmentStatusIds?: string[];
  designationIds?: string[];
  structureIds?: string[];
  leaveTypeIds?: string[];
  attendanceStatusIds?: string[];
  /** Selected leave policy id */
  policyId?: string | number | null;
}

/** ["1","2"] -> [1,2] (stable between renders while the selection is the same) */
const useIntList = (values?: string[]) => {
  const key = (values ?? []).join(",");
  return useMemo(
    () =>
      key
        ? key
            .split(",")
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0)
        : [],
    [key],
  );
};

/** Loads usp_GetMonthlyLeaveCalendar for the month (+ selected filters and policy). */
export const useMonthlyLeaveCalendar = ({
  year,
  month,
  branchIds,
  employmentStatusIds,
  designationIds,
  structureIds,
  leaveTypeIds,
  attendanceStatusIds,
  policyId,
}: UseMonthlyLeaveCalendarParams) => {
  const branches = useIntList(branchIds);
  const employmentStatuses = useIntList(employmentStatusIds);
  const designations = useIntList(designationIds);
  const structures = useIntList(structureIds);
  const leaveTypes = useIntList(leaveTypeIds);
  const attendanceStatuses = useIntList(attendanceStatusIds);
  const policy = Number(policyId);

  const query = useGetMonthlyLeaveCalendarQuery({
    year,
    month,
    branchIds: branches,
    employmentStatusIds: employmentStatuses,
    designationIds: designations,
    structureIds: structures,
    leaveTypeIds: leaveTypes,
    attendanceStatusIds: attendanceStatuses,
    policyId: Number.isInteger(policy) && policy > 0 ? policy : null,
  });

  const hasUnexpectedResponse =
    query.data !== undefined && !Array.isArray(query.data);

  return {
    rows: Array.isArray(query.data) ? query.data : NO_ROWS,
    loading: query.isFetching,
    error: query.isError
      ? getLeaveDailyErrorMessage(query.error)
      : hasUnexpectedResponse
        ? "Monthly leave calendar returned an unexpected response. Please retry."
        : null,
    reload: query.refetch,
  };
};


/* ------------------------------------------------------------------ */
/*  Leave types / Present for the Apply dropdown and the Leave Form    */
/* ------------------------------------------------------------------ */

export interface LeaveCodeOption {
  /** LeaveTypeId from the database (sent as leaveTypeId) */
  id: number;
  /** Short code shown in the dropdown, e.g. "CL" */
  code: string;
  /** Full name, e.g. "Casual Leave" */
  name: string;
}

/**
 * Leave types + the Present status, straight from company-dropdown-data
 * (leaveTypes / attendanceStatuses), so the ids always match the database.
 */
export const useLeaveCodeOptions = () => {
  const query = useGetCompanyDropdownDataQuery();
  const data = query.data;

  const leaveTypes = useMemo<LeaveCodeOption[]>(
    () =>
      (data?.leaveTypes ?? [])
        .map((option) => ({
          id: Number(option.value),
          code: String(option.code ?? option.label).trim().toUpperCase(),
          name: option.label,
        }))
        .filter((option) => Number.isInteger(option.id) && option.id > 0 && option.code !== ""),
    [data],
  );

  // From the database (`presentStatus` row with Code "P"). null = the server did not send it.
  const presentStatusId = data?.presentStatusId ?? null;
  // name of that status from attendanceStatuses (ID 1 = "Present")
  const presentName =
    data?.attendanceStatuses.find((option) => Number(option.value) === presentStatusId)?.label ??
    "Present";

  return {
    leaveTypes,
    presentStatusId,
    presentName,
    loading: query.isFetching,
    failed: query.isError,
    reload: query.refetch,
  };
};


/* ------------------------------------------------------------------ */
/*  Months for the Month dropdowns                                     */
/* ------------------------------------------------------------------ */

/** Months from the backend (company-dropdown-data -> monthYear), e.g. "Oct/2026", oldest first */
export const useDailyMonths = () => {
  const query = useGetCompanyDropdownDataQuery();
  return {
    months: query.data?.months ?? NO_OPTIONS,
    loading: query.isFetching,
    failed: query.isError,
  };
};


/* ------------------------------------------------------------------ */
/*  Leave types for ONE employee (Leave Form)                          */
/* ------------------------------------------------------------------ */

/**
 * Leave types for a single employee, from GET .../leave-master-data?employeeId=...
 * (USP_LeaveMasterData). These can differ from employee to employee.
 *
 * - While the list is loading: empty + `loading`.
 * - If the request FAILS: the company-wide leave types are used instead, and `failed` is true.
 * - If it succeeds with nothing: `empty` is true (this employee has no leave types).
 * Also returns the Present id / name (same as useLeaveCodeOptions).
 */
export const useEmployeeLeaveTypes = (employeeId: string | null) => {
  const company = useLeaveCodeOptions();
  const companyData = useGetCompanyDropdownDataQuery().data;
  const master = useGetLeaveMasterDataQuery(employeeId ?? "", { skip: !employeeId });

  const employeeTypes = useMemo<LeaveCodeOption[]>(
    () =>
      withLeaveCodes(master.data ?? [], companyData?.leaveTypeCodes ?? [])
        .map((option) => ({
          id: Number(option.value),
          code: String(option.code ?? option.label).trim().toUpperCase(),
          name: option.label,
        }))
        .filter((option) => Number.isInteger(option.id) && option.id > 0 && option.code !== ""),
    [master.data, companyData],
  );

  const failed = master.isError;
  const leaveTypes = failed || !employeeId ? company.leaveTypes : employeeTypes;

  return {
    leaveTypes,
    presentStatusId: company.presentStatusId,
    presentName: company.presentName,
    loading: company.loading || master.isFetching,
    /** true = the employee's own list could not be loaded, the company-wide list is shown */
    failed,
    /** true = the request worked but this employee has no leave types */
    empty: !failed && !!employeeId && !master.isFetching && master.isSuccess && employeeTypes.length === 0,
  };
};


/* ------------------------------------------------------------------ */
/*  Leave policies (Policy dropdown on the Daily and Import pages)     */
/* ------------------------------------------------------------------ */

/**
 * Active leave policies from company-dropdown-data (value = policy id).
 * Uses the same single request as the filters, months and leave types -
 * no extra call to the server.
 */
export const useDailyPolicies = () => {
  const query = useGetCompanyDropdownDataQuery();
  return {
    policies: query.data?.activeLeavePolicies ?? NO_OPTIONS,
    loading: query.isLoading,
    failed: query.isError,
  };
};