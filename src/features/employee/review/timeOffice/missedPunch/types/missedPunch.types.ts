/* =========================================================
   MISSED PUNCH TYPES
========================================================= */

export interface MissedPunchEmployee {
  employeeId: string;
  employeeName: string;
  punchDate: string;

  companyId?: string | number | null;

  department?: string | null;
  designation?: string | null;

  [key: string]: unknown;
}

/* =========================================================
   API RESPONSE
========================================================= */

export interface MissedPunchResponse {
  data?: MissedPunchEmployee[];

  message?: string;

  success?: boolean;

  [key: string]: unknown;
}

/* =========================================================
   API REQUEST
========================================================= */

export interface MissedPunchRequest {
  companyId?: string | number;

  fromDate: string;

  toDate: string;

  searchText?: string;
}

/* =========================================================
   PAGE FILTER STATE
========================================================= */

export interface MissedPunchFilters {
  fromDate: string;

  toDate: string;

  searchText: string;
}

/* =========================================================
   TABLE PROPS
========================================================= */

export interface MissedPunchTableProps {
  employees: MissedPunchEmployee[];

  isLoading: boolean;

  onAction: (
    employee: MissedPunchEmployee,
  ) => void;
}

/* =========================================================
   ROW PROPS
========================================================= */

export interface MissedPunchRowProps {
  employee: MissedPunchEmployee;

  onAction: (
    employee: MissedPunchEmployee,
  ) => void;
}

/* =========================================================
   FILTER PROPS
========================================================= */

export interface MissedPunchFiltersProps {
  filters: MissedPunchFilters;

  onSearchChange: (
    value: string,
  ) => void;
}

/* =========================================================
   NAVBAR PROPS
========================================================= */

export interface MissedPunchNavbarProps {
  filters: MissedPunchFilters;

  onFromDateChange: (
    value: string,
  ) => void;

  onToDateChange: (
    value: string,
  ) => void;

  onRefresh: () => void;
}

/* =========================================================
   HOOK RESULT
========================================================= */

export interface UseMissedPunchResult {
  employees: MissedPunchEmployee[];

  isLoading: boolean;

  error: string | null;

  filters: MissedPunchFilters;

  setFromDate: (
    value: string,
  ) => void;

  setToDate: (
    value: string,
  ) => void;

  setSearchText: (
    value: string,
  ) => void;

  refetch: () => Promise<void>;
}

/* =========================================================
   NORMALIZED API ITEM
========================================================= */

export interface RawMissedPunchEmployee {
  employeeId?: string | number;

  EmployeeId?: string | number;

  EmployeeID?: string | number;

  employeeName?: string;

  EmployeeName?: string;

  Name?: string;

  punchDate?: string;

  PunchDate?: string;

  Punch_Date?: string;

  companyId?: string | number;

  CompanyId?: string | number;

  CompanyID?: string | number;

  department?: string;

  Department?: string;

  designation?: string;

  Designation?: string;

  [key: string]: unknown;
}