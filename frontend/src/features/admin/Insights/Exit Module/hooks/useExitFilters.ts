// import { useMemo, useState } from "react";

// import {
//   useGetExitAttendanceQuery,
//   useGetExitBranchesQuery,
//   useGetExitDesignationsQuery,
//   useGetExitLeavesQuery,
//   useGetExitQueriesQuery,
//   useGetExitSalaryStructuresQuery,
// } from "../api/exitReportsApi";

// import { DEFAULT_EXIT_FILTERS, EMP_STATUS_OPTIONS } from "../constants/exitReport.constants";

// import type { ExitReportFilters } from "../types/exitReport.types";

// /**
//  * Shared state + option-fetching for the filter toolbar used by every
//  * Exit Module view (Exit Module Report, Relieving Letter, Experience Letter).
//  */
// export const useExitFilters = () => {
//   const [filters, setFilters] = useState<ExitReportFilters>(DEFAULT_EXIT_FILTERS);

//   const branches = useGetExitBranchesQuery();
//   const salaryStructures = useGetExitSalaryStructuresQuery();
//   const leaves = useGetExitLeavesQuery();
//   const attendance = useGetExitAttendanceQuery();
//   const designations = useGetExitDesignationsQuery();
//   const queries = useGetExitQueriesQuery();

//   const setSearch = (search: string) => {
//     setFilters((previous) => ({ ...previous, search }));
//   };

//   const setValues = (field: keyof Omit<ExitReportFilters, "search">, values: string[]) => {
//     setFilters((previous) => ({ ...previous, [field]: values }));
//   };

//   const clearOne = (field: keyof Omit<ExitReportFilters, "search">) => {
//     setValues(field, []);
//   };

//   const clearAll = () => {
//     setFilters(DEFAULT_EXIT_FILTERS);
//   };

//   const activeCount = useMemo(() => {
//     const { search: _search, ...rest } = filters;

//     return Object.values(rest).reduce(
//       (total, values) => total + (values?.length ?? 0),
//       0
//     );
//   }, [filters]);

//   return {
//     filters,
//     setSearch,
//     setValues,
//     clearOne,
//     clearAll,
//     activeCount,

//     options: {
//       query: { data: queries.data ?? [], isLoading: queries.isFetching },
//       branch: { data: branches.data ?? [], isLoading: branches.isFetching },
//       salaryStructure: {
//         data: salaryStructures.data ?? [],
//         isLoading: salaryStructures.isFetching,
//       },
//       leave: { data: leaves.data ?? [], isLoading: leaves.isFetching },
//       attendance: { data: attendance.data ?? [], isLoading: attendance.isFetching },
//       designation: { data: designations.data ?? [], isLoading: designations.isFetching },
//       empStatus: { data: EMP_STATUS_OPTIONS, isLoading: false },
//     },
//   };
// };


import { useMemo, useState } from "react";

import {
  useGetExitAttendanceQuery,
  useGetExitBranchesQuery,
  useGetExitDesignationsQuery,
  useGetExitLeavesQuery,
  useGetExitQueriesQuery,
  useGetExitSalaryStructuresQuery,
} from "../api/exitReportsApi";

import {
  DEFAULT_EXIT_FILTERS,
  EMP_STATUS_OPTIONS,
} from "../constants/exitReport.constants";

import type { ExitReportFilters } from "../types/exitReport.types";

/**
 * Static Leave options displayed in the Leave filter dropdown.
 */
const LEAVE_OPTIONS = [
  {
    id: "employee-leave-policy",
    label: "Employee Leave Policy",
  },
  {
    id: "intern-leave-policy",
    label: "Intern Leave Policy",
  },
];

/**
 * Shared state + option-fetching for the filter toolbar used by every
 * Exit Module view (Exit Module Report, Relieving Letter, Experience Letter).
 */
export const useExitFilters = () => {
  const [filters, setFilters] =
    useState<ExitReportFilters>(
      DEFAULT_EXIT_FILTERS
    );

  const branches =
    useGetExitBranchesQuery();

  const salaryStructures =
    useGetExitSalaryStructuresQuery();

  const leaves =
    useGetExitLeavesQuery();

  const attendance =
    useGetExitAttendanceQuery();

  const designations =
    useGetExitDesignationsQuery();

  const queries =
    useGetExitQueriesQuery();

  const setSearch = (search: string) => {
    setFilters((previous) => ({
      ...previous,
      search,
    }));
  };

  const setValues = (
    field: keyof Omit<
      ExitReportFilters,
      "search"
    >,
    values: string[]
  ) => {
    setFilters((previous) => ({
      ...previous,
      [field]: values,
    }));
  };

  const clearOne = (
    field: keyof Omit<
      ExitReportFilters,
      "search"
    >
  ) => {
    setValues(field, []);
  };

  const clearAll = () => {
    setFilters(DEFAULT_EXIT_FILTERS);
  };

  const activeCount = useMemo(() => {
    const {
      search: _search,
      ...rest
    } = filters;

    return Object.values(rest).reduce(
      (total, values) =>
        total + (values?.length ?? 0),
      0
    );
  }, [filters]);

  return {
    filters,

    setSearch,

    setValues,

    clearOne,

    clearAll,

    activeCount,

    options: {
      query: {
        data: queries.data ?? [],
        isLoading: queries.isFetching,
      },

      branch: {
        data: branches.data ?? [],
        isLoading: branches.isFetching,
      },

      salaryStructure: {
        data:
          salaryStructures.data ?? [],
        isLoading:
          salaryStructures.isFetching,
      },

      /*
       * LEAVE
       *
       * The API call is kept unchanged.
       * The dropdown displays the two required
       * Leave options.
       */
      leave: {
        data: LEAVE_OPTIONS,
        isLoading: leaves.isFetching,
      },

      attendance: {
        data:
          attendance.data ?? [],
        isLoading:
          attendance.isFetching,
      },

      designation: {
        data:
          designations.data ?? [],
        isLoading:
          designations.isFetching,
      },

      empStatus: {
        data: EMP_STATUS_OPTIONS,
        isLoading: false,
      },
    },
  };
};