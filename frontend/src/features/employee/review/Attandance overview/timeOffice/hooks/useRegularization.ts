// import { useCallback, useEffect, useState } from "react";

// import {
//   useGetEmployeeMonthlyAttendanceDetailsQuery,
//   useGetEmployeeAttendanceOverviewQuery,
//   useLazyGetEmployeePunchDashboardQuery,
//   useLazyGetEmployeeRawPunchesQuery,
// } from "../api/regularizationApi";

// import type {
//   AttendanceDay,
//   AttendanceOverviewData,
//   PunchRecord,
//   UseAttendanceProps,
// } from "../types/regularization.types";

// import {
//   isValidEmployeeId,
//   isValidMonth,
//   isValidYear,
// } from "../validations/regularization.validations";

// export function useAttendance({
//   employeeId,
//   month,
//   year,
//   classificationId,
// }: UseAttendanceProps) {
//   const [attendance, setAttendance] =
//     useState<AttendanceDay[]>([]);

//   const [overview, setOverview] =
//     useState<AttendanceOverviewData | null>(null);

//   const [punchRecords, setPunchRecords] =
//     useState<PunchRecord[]>([]);

//   const [error, setError] =
//     useState<string | null>(null);

//   // =====================================================
//   // VALIDATE REQUEST
//   // =====================================================

//   const validRequest =
//     isValidEmployeeId(employeeId) &&
//     Number.isInteger(classificationId) &&
//     classificationId > 0 &&
//     isValidMonth(month) &&
//     isValidYear(year);

//   // =====================================================
//   // MONTHLY ATTENDANCE
//   // =====================================================

//   const {
//     data: attendanceData = [],
//     isLoading: isAttendanceLoading,
//     isError: isAttendanceError,
//     error: attendanceError,
//   } = useGetEmployeeMonthlyAttendanceDetailsQuery(
//     {
//       employeeId: Number(employeeId),
//       month,
//       year,
//       classificationId,
//     },
//     {
//       skip: !validRequest,
//     },
//   );

//   // =====================================================
//   // ATTENDANCE OVERVIEW
//   // =====================================================

//   const {
//     data: overviewData = {},
//     isLoading: isOverviewLoading,
//     isError: isOverviewError,
//     error: overviewError,
//   } = useGetEmployeeAttendanceOverviewQuery(
//     {
//       employeeId,
//       month,
//       year,
//     },
//     {
//       skip: !validRequest,
//     },
//   );

//   // =====================================================
//   // PUNCH DASHBOARD
//   // =====================================================

//   const [
//     getPunchDashboard,
//     { isLoading: isPunchLoading },
//   ] = useLazyGetEmployeePunchDashboardQuery();

//   // =====================================================
//   // RAW PUNCHES
//   // =====================================================

//   const [
//     getRawPunches,
//     { isLoading: isRawPunchLoading },
//   ] = useLazyGetEmployeeRawPunchesQuery();

//   // =====================================================
//   // UPDATE ATTENDANCE DATA FROM API
//   // =====================================================

//   useEffect(() => {
//     if (!validRequest) {
//       setAttendance([]);
//       setOverview(null);
//       setError(
//         "Invalid employee or attendance selection.",
//       );
//       return;
//     }

//     setAttendance(
//       Array.isArray(attendanceData)
//         ? attendanceData
//         : [],
//     );

//     setOverview(overviewData || {});
//   }, [
//     validRequest,
//     attendanceData,
//     overviewData,
//   ]);

//   // =====================================================
//   // API ERROR HANDLING
//   // =====================================================

//   useEffect(() => {
//     if (
//       isAttendanceError ||
//       isOverviewError
//     ) {
//       console.error(
//         "Attendance API Error:",
//         attendanceError || overviewError,
//       );

//       setError(
//         "Failed to load attendance.",
//       );

//       return;
//     }

//     if (validRequest) {
//       setError(null);
//     }
//   }, [
//     isAttendanceError,
//     isOverviewError,
//     attendanceError,
//     overviewError,
//     validRequest,
//   ]);

//   // =====================================================
//   // RELOAD ATTENDANCE
//   // =====================================================

//   const loadAttendance =
//     useCallback(async () => {
//       if (!validRequest) {
//         setAttendance([]);
//         setOverview(null);
//         return;
//       }

//       setAttendance(
//         Array.isArray(attendanceData)
//           ? attendanceData
//           : [],
//       );

//       setOverview(
//         overviewData || {},
//       );
//     }, [
//       validRequest,
//       attendanceData,
//       overviewData,
//     ]);

//   // =====================================================
//   // LOAD PUNCH DETAILS
//   // =====================================================

//   const loadPunchDetails =
//     useCallback(
//       async (selectedDate: string) => {
//         if (!validRequest) {
//           return {
//             employeeProfile: [],
//             attendanceSummary: [],
//             punchRecords: [],
//           };
//         }

//         const result =
//           await getPunchDashboard({
//             employeeId,
//             selectedDate,
//             viewType: "CustomMonth",
//           }).unwrap();

//         setPunchRecords(
//           result?.punchRecords || [],
//         );

//         return result;
//       },
//       [
//         validRequest,
//         employeeId,
//         getPunchDashboard,
//       ],
//     );

//   // =====================================================
//   // LOAD RAW PUNCHES
//   // =====================================================

//   const loadRawPunches =
//     useCallback(
//       async (date: string) => {
//         if (!validRequest) {
//           return [];
//         }

//         return getRawPunches({
//           employeeId,
//           date,
//         }).unwrap();
//       },
//       [
//         validRequest,
//         employeeId,
//         getRawPunches,
//       ],
//     );

//   // =====================================================
//   // RETURN
//   // =====================================================

//   return {
//     attendance,
//     overview,
//     punchRecords,

//     loading:
//       isAttendanceLoading ||
//       isOverviewLoading ||
//       isPunchLoading ||
//       isRawPunchLoading,

//     isAttendanceLoading,
//     isOverviewLoading,
//     isPunchLoading,
//     isRawPunchLoading,

//     error,

//     loadAttendance,
//     loadPunchDetails,
//     loadRawPunches,
//   };
// }


import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useGetEmployeeMonthlyAttendanceDetailsQuery,
  useGetEmployeeAttendanceOverviewQuery,
  useLazyGetEmployeePunchDashboardQuery,
  useLazyGetEmployeeDailyRawPunchesQuery,
} from "../api/regularizationApi";

import type {
  AttendanceDay,
  AttendanceOverviewData,
  PunchRecord,
  UseAttendanceProps,
} from "../types/regularization.types";

import {
  isValidEmployeeId,
  isValidMonth,
  isValidYear,
} from "../validations/regularization.validations";

export function useAttendance({
  employeeId,
  month,
  year,
  classificationId,
}: UseAttendanceProps) {
  const [attendance, setAttendance] =
    useState<AttendanceDay[]>([]);

  const [overview, setOverview] =
    useState<AttendanceOverviewData | null>(null);

  const [punchRecords, setPunchRecords] =
    useState<PunchRecord[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  // =====================================================
  // VALIDATE REQUEST
  // =====================================================

  const validRequest =
    isValidEmployeeId(employeeId) &&
    isValidMonth(month) &&
    isValidYear(year);

  // =====================================================
  // MONTHLY ATTENDANCE
  // =====================================================

  const {
    data: attendanceData = [],
    isLoading: isAttendanceLoading,
    isError: isAttendanceError,
    error: attendanceError,
  } = useGetEmployeeMonthlyAttendanceDetailsQuery(
    {
      employeeId: Number(employeeId),
      month,
      year,
      classificationId,
    },
    {
      skip: !validRequest,
    },
  );

  // =====================================================
  // ATTENDANCE OVERVIEW
  // =====================================================

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    isError: isOverviewError,
    error: overviewError,
  } = useGetEmployeeAttendanceOverviewQuery(
    {
      employeeId,
      month,
      year,
    },
    {
      skip: !validRequest,
    },
  );

  const overviewRows = useMemo(
    () =>
      Array.isArray(overviewData)
        ? (overviewData as AttendanceOverviewData[])
        : [],
    [overviewData],
  );

  // =====================================================
  // PUNCH DASHBOARD
  // =====================================================

  const [
    getPunchDashboard,
    { isLoading: isPunchLoading },
  ] = useLazyGetEmployeePunchDashboardQuery();

  // =====================================================
  // RAW PUNCHES
  // =====================================================

  const [
    getRawPunches,
    { isLoading: isRawPunchLoading },
  ] = useLazyGetEmployeeDailyRawPunchesQuery();

  // =====================================================
  // UPDATE ATTENDANCE DATA FROM API
  // =====================================================

  useEffect(() => {
    if (!validRequest) {
      setAttendance([]);
      setOverview(null);
      setError(
        "Invalid employee or attendance selection.",
      );
      return;
    }

    setAttendance(
      Array.isArray(attendanceData)
        ? attendanceData
        : [],
    );

    setOverview(
      overviewRows as unknown as AttendanceOverviewData,
    );
  }, [
    validRequest,
    attendanceData,
    overviewData,
  ]);

  // =====================================================
  // API ERROR HANDLING
  // =====================================================

  useEffect(() => {
    if (
      isAttendanceError ||
      isOverviewError
    ) {
      console.error(
        "Attendance API Error:",
        attendanceError || overviewError,
      );

      setError(
        "Failed to load attendance.",
      );

      return;
    }

    if (validRequest) {
      setError(null);
    }
  }, [
    isAttendanceError,
    isOverviewError,
    attendanceError,
    overviewError,
    validRequest,
  ]);

  // =====================================================
  // RELOAD ATTENDANCE
  // =====================================================

  const loadAttendance =
    useCallback(async () => {
      if (!validRequest) {
        setAttendance([]);
        setOverview(null);
        return;
      }

      setAttendance(
        Array.isArray(attendanceData)
          ? attendanceData
          : [],
      );

      setOverview(
        overviewRows as unknown as AttendanceOverviewData,
      );
    }, [
      validRequest,
      attendanceData,
      overviewData,
    ]);

  // =====================================================
  // LOAD PUNCH DETAILS
  // =====================================================

  const loadPunchDetails =
    useCallback(
      async (selectedDate: string) => {
        if (!validRequest) {
          return {
            employeeProfile: [],
            attendanceSummary: [],
            punchRecords: [],
          };
        }

        const result =
          await getPunchDashboard({
            employeeId,
            selectedDate,
            viewType: "CustomMonth",
          }).unwrap();

        setPunchRecords(
          result?.punchRecords || [],
        );

        return result;
      },
      [
        validRequest,
        employeeId,
        getPunchDashboard,
      ],
    );

  // =====================================================
  // LOAD RAW PUNCHES
  // =====================================================

  const loadRawPunches =
    useCallback(
      async (date: string) => {
        if (!validRequest) {
          return [];
        }

        return getRawPunches({
          employeeId,
          date,
        }).unwrap();
      },
      [
        validRequest,
        employeeId,
        getRawPunches,
      ],
    );

  // =====================================================
  // RETURN
  // =====================================================

  return {
    attendance,
    overview,
    punchRecords,

    loading:
      isAttendanceLoading ||
      isOverviewLoading ||
      isPunchLoading ||
      isRawPunchLoading,

    isAttendanceLoading,
    isOverviewLoading,
    isPunchLoading,
    isRawPunchLoading,

    error,

    loadAttendance,
    loadPunchDetails,
    loadRawPunches,
  };
}