// // import { baseApi } from "@/app/baseApi";

// // import type {
// //   AttendanceDay,
 
// //   AttendanceOverviewParams,
// //   AttendanceOverviewResponse,
// //   EmployeePunchDashboardResponse,
// //   MonthlyAttendanceParams,
// //   PunchDashboardParams,
// //   PunchRecord,
// //   RawPunchParams,
// //   ReportingEmployee,
// // } from "../types/regularization.types";

// // export const regularizationApi = baseApi.injectEndpoints({
// //   endpoints: (builder) => ({
// //     // =====================================================
// //     // EMPLOYEE MONTHLY ATTENDANCE DETAILS
// //     // POST /review/employeemonthlyattendancedetails
// //     // =====================================================
// //     getEmployeeMonthlyAttendanceDetails: builder.query<
// //       AttendanceDay[],
// //       MonthlyAttendanceParams
// //     >({
// //       query: ({
// //         employeeId,
// //         month,
// //         year,
// //         classificationId,
// //       }) => ({
// //         url: "/review/employeemonthlyattendancedetails",
// //         method: "POST",
// //         body: {
// //           employeeId,
// //           month,
// //           year,
// //           classificationId,
// //         },
// //       }),

// //       transformResponse: (
// //         response: unknown,
// //       ): AttendanceDay[] => {
// //         if (Array.isArray(response)) {
// //           return response as AttendanceDay[];
// //         }

// //         if (
// //           response &&
// //           typeof response === "object"
// //         ) {
// //           const data =
// //             response as Record<string, unknown>;

// //           if (Array.isArray(data.data)) {
// //             return data.data as AttendanceDay[];
// //           }

// //           if (Array.isArray(data.result)) {
// //             return data.result as AttendanceDay[];
// //           }
// //         }

// //         return [];
// //       },
// //     }),

// //     // =====================================================
// //     // EMPLOYEE ATTENDANCE OVERVIEW
// //     // POST /review/employeeattendanceoverview
// //     // =====================================================
// //     getEmployeeAttendanceOverview: builder.query<
// //       AttendanceOverviewResponse,
// //       AttendanceOverviewParams
// //     >({
// //       query: ({
// //         employeeId,
// //         year,
// //         month,
// //       }) => ({
// //         url: "/review/employeeattendanceoverview",
// //         method: "POST",
// //         body: {
// //           employeeId,
// //           year,
// //           month,
// //         },
// //       }),

// //       transformResponse: (
// //         response: unknown,
// //       ): AttendanceOverviewResponse => {
// //         // Actual API response is an array of employees.
// //         //
// //         // Example:
// //         // [
// //         //   {
// //         //     EmployeeID: "294663",
// //         //     FullName: "K. Sriram Preetham",
// //         //     "1 Sat": "W",
// //         //     "2 Sun": "W",
// //         //     ...
// //         //   }
// //         // ]

// //         if (Array.isArray(response)) {
// //           return response as AttendanceOverviewResponse;
// //         }

// //         if (
// //           response &&
// //           typeof response === "object"
// //         ) {
// //           const data =
// //             response as Record<string, unknown>;

// //           if (Array.isArray(data.data)) {
// //             return data.data as AttendanceOverviewResponse;
// //           }

// //           if (Array.isArray(data.result)) {
// //             return data.result as AttendanceOverviewResponse;
// //           }
// //         }

// //         return [];
// //       },
// //     }),

// //     // =====================================================
// //     // EMPLOYEE PUNCH DASHBOARD
// //     // GET /review/employeepunchdashboard
// //     // =====================================================
// //     //
// //     // NOTE:
// //     // The actual response body for this endpoint has not
// //     // been provided yet.
// //     //
// //     // Therefore we are keeping the existing response
// //     // structure instead of inventing backend fields.
// //     // =====================================================
// //     getEmployeePunchDashboard: builder.query<
// //       EmployeePunchDashboardResponse,
// //       PunchDashboardParams
// //     >({
// //       query: ({
// //         employeeId,
// //         selectedDate,
// //         viewType = "CustomMonth",
// //       }) => ({
// //         url: "/review/employeepunchdashboard",
// //         method: "GET",
// //         params: {
// //           employeeId,
// //           ...(selectedDate
// //             ? { selectedDate }
// //             : {}),
// //           viewType,
// //         },
// //       }),

// //       transformResponse: (
// //         response: EmployeePunchDashboardResponse,
// //       ): EmployeePunchDashboardResponse => ({
// //         employeeProfile:
// //           Array.isArray(
// //             response?.employeeProfile,
// //           )
// //             ? response.employeeProfile
// //             : [],

// //         attendanceSummary:
// //           Array.isArray(
// //             response?.attendanceSummary,
// //           )
// //             ? response.attendanceSummary
// //             : [],

// //         punchRecords:
// //           Array.isArray(
// //             response?.punchRecords,
// //           )
// //             ? response.punchRecords
// //             : [],
// //       }),
// //     }),

// //     // =====================================================
// //     // EMPLOYEE RAW PUNCHES
// //     // POST /review/employeerawpunches
// //     // =====================================================
// //     //
// //     // Request:
// //     //
// //     // {
// //     //   "employeeId": "294663",
// //     //   "date": "2026-09-10"
// //     // }
// //     //
// //     // Response:
// //     //
// //     // [
// //     //   {
// //     //     "PunchType": "IN",
// //     //     "OriginalTime": "09:47:39",
// //     //     "EntryType": "GPS",
// //     //     "Approverstatus": "Success"
// //     //   }
// //     // ]
// //     // =====================================================
// //     getEmployeeRawPunches: builder.query<
// //       PunchRecord[],
// //       RawPunchParams
// //     >({
// //       query: ({
// //         employeeId,
// //         date,
// //       }) => ({
// //         url: "/review/employeerawpunches",
// //         method: "POST",
// //         body: {
// //           employeeId,
// //           date,
// //         },
// //       }),

// //       transformResponse: (
// //         response: unknown,
// //       ): PunchRecord[] => {
// //         let records: unknown[] = [];

// //         if (Array.isArray(response)) {
// //           records = response;
// //         } else if (
// //           response &&
// //           typeof response === "object"
// //         ) {
// //           const data =
// //             response as Record<string, unknown>;

// //           if (Array.isArray(data.data)) {
// //             records = data.data;
// //           } else if (
// //             Array.isArray(data.result)
// //           ) {
// //             records = data.result;
// //           }
// //         }

// //         return records
// //           .filter(
// //             (
// //               item,
// //             ): item is Record<
// //               string,
// //               unknown
// //             > =>
// //               Boolean(
// //                 item &&
// //                   typeof item === "object",
// //               ),
// //           )
// //           .map((item) => ({
// //             time: String(
// //               item.OriginalTime ?? "",
// //             ),

// //             type: String(
// //               item.PunchType ?? "",
// //             ),

// //             source: String(
// //               item.EntryType ?? "",
// //             ),

// //             approverStatus:
// //               item.Approverstatus !==
// //               undefined
// //                 ? String(
// //                     item.Approverstatus,
// //                   )
// //                 : undefined,
// //           }))
// //           .filter(
// //             (item) =>
// //               item.time ||
// //               item.type ||
// //               item.source,
// //           );
// //       },
// //     }),

// //     // =====================================================
// //     // REPORTING EMPLOYEES
// //     // GET /review/reporting-employees
// //     // =====================================================
// //     //
// //     // Actual response:
// //     //
// //     // [
// //     //   {
// //     //     "EmployeeID": "294676",
// //     //     "EmployeeName": "Mandapuram Divya"
// //     //   },
// //     //   {
// //     //     "EmployeeID": "284519",
// //     //     "EmployeeName": "Rakesh Peddi"
// //     //   },
// //     //   {
// //     //     "EmployeeID": "294623",
// //     //     "EmployeeName": "Tharun Nagarjunapu"
// //     //   },
// //     //   {
// //     //     "EmployeeID": "284512",
// //     //     "EmployeeName": "Varalaxmi Gumudala"
// //     //   }
// //     // ]
// //     // =====================================================
// //     getReportingEmployees: builder.query<
// //       ReportingEmployee[],
// //       void
// //     >({
// //       query: () => ({
// //         url: "/review/reporting-employees",
// //         method: "GET",
// //       }),

// //       transformResponse: (
// //         response: unknown,
// //       ): ReportingEmployee[] => {
// //         if (Array.isArray(response)) {
// //           return response as ReportingEmployee[];
// //         }

// //         if (
// //           response &&
// //           typeof response === "object"
// //         ) {
// //           const data =
// //             response as Record<string, unknown>;

// //           if (Array.isArray(data.data)) {
// //             return data.data as ReportingEmployee[];
// //           }

// //           if (Array.isArray(data.result)) {
// //             return data.result as ReportingEmployee[];
// //           }
// //         }

// //         return [];
// //       },
// //     }),
// //   }),
// // });

// // // =====================================================
// // // HOOKS
// // // =====================================================

// // export const {
// //   useGetEmployeeMonthlyAttendanceDetailsQuery,
// //   useLazyGetEmployeeMonthlyAttendanceDetailsQuery,

// //   useGetEmployeeAttendanceOverviewQuery,
// //   useLazyGetEmployeeAttendanceOverviewQuery,

// //   useGetEmployeePunchDashboardQuery,
// //   useLazyGetEmployeePunchDashboardQuery,

// //   useGetEmployeeRawPunchesQuery,
// //   useLazyGetEmployeeRawPunchesQuery,

// //   useGetReportingEmployeesQuery,
// //   useLazyGetReportingEmployeesQuery,
// // } = regularizationApi;


// import { baseApi } from "@/app/baseApi";

// import type {
//   AttendanceDay,

//   AttendanceOverviewParams,
//   AttendanceOverviewResponse,
//   EmployeePunchDashboardResponse,
//   MonthlyAttendanceParams,
//   PunchDashboardParams,
//   PunchRecord,
//   RawPunchParams,
//   ReportingEmployee,
// } from "../types/regularization.types";

// export const regularizationApi = baseApi.injectEndpoints({
//   endpoints: (builder) => ({
//     // =====================================================
//     // EMPLOYEE MONTHLY ATTENDANCE DETAILS
//     // POST /attendance/employeemonthlyattendancedetails
//     // =====================================================
//     getEmployeeMonthlyAttendanceDetails: builder.query<
//       AttendanceDay[],
//       MonthlyAttendanceParams
//     >({
//       query: ({
//         employeeId,
//         month,
//         year,
//         classificationId,
//       }) => ({
//         url: "/attendance/employeemonthlyattendancedetails",
//         method: "POST",
//         body: {
//           employeeId,
//           month,
//           year,
//           classificationId,
//         },
//       }),

//       transformResponse: (
//         response: unknown,
//       ): AttendanceDay[] => {
//         if (Array.isArray(response)) {
//           return response as AttendanceDay[];
//         }

//         if (
//           response &&
//           typeof response === "object"
//         ) {
//           const data =
//             response as Record<string, unknown>;

//           if (Array.isArray(data.data)) {
//             return data.data as AttendanceDay[];
//           }

//           if (Array.isArray(data.result)) {
//             return data.result as AttendanceDay[];
//           }
//         }

//         return [];
//       },
//     }),

//     // =====================================================
//     // EMPLOYEE ATTENDANCE OVERVIEW
//     // POST /attendance/employeeattendanceoverview
//     // =====================================================
//     getEmployeeAttendanceOverview: builder.query<
//       AttendanceOverviewResponse,
//       AttendanceOverviewParams
//     >({
//       query: ({
//         employeeId,
//         year,
//         month,
//       }) => ({
//         url: "/attendance/employeeattendanceoverview",
//         method: "POST",
//         body: {
//           employeeId,
//           year,
//           month,
//         },
//       }),

//       transformResponse: (
//         response: unknown,
//       ): AttendanceOverviewResponse => {
//         // Actual API response is an array of employees.
//         //
//         // Example:
//         // [
//         //   {
//         //     EmployeeID: "294663",
//         //     FullName: "K. Sriram Preetham",
//         //     "1 Sat": "W",
//         //     "2 Sun": "W",
//         //     ...
//         //   }
//         // ]

//         if (Array.isArray(response)) {
//           return response as AttendanceOverviewResponse;
//         }

//         if (
//           response &&
//           typeof response === "object"
//         ) {
//           const data =
//             response as Record<string, unknown>;

//           if (Array.isArray(data.data)) {
//             return data.data as AttendanceOverviewResponse;
//           }

//           if (Array.isArray(data.result)) {
//             return data.result as AttendanceOverviewResponse;
//           }
//         }

//         return [];
//       },
//     }),

//     // =====================================================
//     // EMPLOYEE PUNCH DASHBOARD
//     // POST /attendance/employeepunchdashboard
//     //
//     // NOTE: was previously called as GET with query params -
//     // the backend AttendanceController only accepts POST with
//     // a JSON body, so this now matches that.
//     // =====================================================
//     getEmployeePunchDashboard: builder.query<
//       EmployeePunchDashboardResponse,
//       PunchDashboardParams
//     >({
//       query: ({
//         employeeId,
//         selectedDate,
//         viewType = "CustomMonth",
//       }) => ({
//         url: "/attendance/employeepunchdashboard",
//         method: "POST",
//         body: {
//           employeeId,
//           ...(selectedDate
//             ? { selectedDate }
//             : {}),
//           viewType,
//         },
//       }),

//       transformResponse: (
//         response: EmployeePunchDashboardResponse,
//       ): EmployeePunchDashboardResponse => ({
//         employeeProfile:
//           Array.isArray(
//             response?.employeeProfile,
//           )
//             ? response.employeeProfile
//             : [],

//         attendanceSummary:
//           Array.isArray(
//             response?.attendanceSummary,
//           )
//             ? response.attendanceSummary
//             : [],

//         punchRecords:
//           Array.isArray(
//             response?.punchRecords,
//           )
//             ? response.punchRecords
//             : [],
//       }),
//     }),

//     // =====================================================
//     // EMPLOYEE RAW PUNCHES
//     // POST /attendance/employeerawpunches
//     // =====================================================
//     //
//     // Request:
//     //
//     // {
//     //   "employeeId": "294663",
//     //   "date": "2026-09-10"
//     // }
//     //
//     // Response:
//     //
//     // [
//     //   {
//     //     "PunchType": "IN",
//     //     "OriginalTime": "09:47:39",
//     //     "EntryType": "GPS",
//     //     "Approverstatus": "Success"
//     //   }
//     // ]
//     // =====================================================
//     getEmployeeRawPunches: builder.query<
//       PunchRecord[],
//       RawPunchParams
//     >({
//       query: ({
//         employeeId,
//         date,
//       }) => ({
//         url: "/attendance/employeerawpunches",
//         method: "POST",
//         body: {
//           employeeId,
//           date,
//         },
//       }),

//       transformResponse: (
//         response: unknown,
//       ): PunchRecord[] => {
//         let records: unknown[] = [];

//         if (Array.isArray(response)) {
//           records = response;
//         } else if (
//           response &&
//           typeof response === "object"
//         ) {
//           const data =
//             response as Record<string, unknown>;

//           if (Array.isArray(data.data)) {
//             records = data.data;
//           } else if (
//             Array.isArray(data.result)
//           ) {
//             records = data.result;
//           }
//         }

//         return records
//           .filter(
//             (
//               item,
//             ): item is Record<
//               string,
//               unknown
//             > =>
//               Boolean(
//                 item &&
//                   typeof item === "object",
//               ),
//           )
//           .map((item) => ({
//             time: String(
//               item.OriginalTime ?? "",
//             ),

//             type: String(
//               item.PunchType ?? "",
//             ),

//             source: String(
//               item.EntryType ?? "",
//             ),

//             approverStatus:
//               item.Approverstatus !==
//               undefined
//                 ? String(
//                     item.Approverstatus,
//                   )
//                 : undefined,
//           }))
//           .filter(
//             (item) =>
//               item.time ||
//               item.type ||
//               item.source,
//           );
//       },
//     }),

//     // =====================================================
//     // REPORTING EMPLOYEES
//     // POST /attendance/reportingemployees
//     //
//     // NOTE: was previously called as GET /review/reporting-employees,
//     // which doesn't exist on the backend. This now points at a new
//     // endpoint in the attendance module - see attendance.controller.ts
//     // / attendance.service.ts below.
//     // =====================================================
//     //
//     // Actual response:
//     //
//     // [
//     //   {
//     //     "EmployeeID": "294676",
//     //     "EmployeeName": "Mandapuram Divya"
//     //   },
//     //   {
//     //     "EmployeeID": "284519",
//     //     "EmployeeName": "Rakesh Peddi"
//     //   },
//     //   {
//     //     "EmployeeID": "294623",
//     //     "EmployeeName": "Tharun Nagarjunapu"
//     //   },
//     //   {
//     //     "EmployeeID": "284512",
//     //     "EmployeeName": "Varalaxmi Gumudala"
//     //   }
//     // ]
//     // =====================================================
//     getReportingEmployees: builder.query<
//       ReportingEmployee[],
//       void
//     >({
//       query: () => ({
//         url: "/attendance/reportingemployees",
//         method: "POST",
//       }),

//       transformResponse: (
//         response: unknown,
//       ): ReportingEmployee[] => {
//         if (Array.isArray(response)) {
//           return response as ReportingEmployee[];
//         }

//         if (
//           response &&
//           typeof response === "object"
//         ) {
//           const data =
//             response as Record<string, unknown>;

//           if (Array.isArray(data.data)) {
//             return data.data as ReportingEmployee[];
//           }

//           if (Array.isArray(data.result)) {
//             return data.result as ReportingEmployee[];
//           }
//         }

//         return [];
//       },
//     }),
//   }),
// });

// // =====================================================
// // HOOKS
// // =====================================================

// export const {
//   useGetEmployeeMonthlyAttendanceDetailsQuery,
//   useLazyGetEmployeeMonthlyAttendanceDetailsQuery,

//   useGetEmployeeAttendanceOverviewQuery,
//   useLazyGetEmployeeAttendanceOverviewQuery,

//   useGetEmployeePunchDashboardQuery,
//   useLazyGetEmployeePunchDashboardQuery,

//   useGetEmployeeRawPunchesQuery,
//   useLazyGetEmployeeRawPunchesQuery,

//   useGetReportingEmployeesQuery,
//   useLazyGetReportingEmployeesQuery,
// } = regularizationApi;


import { baseApi } from "@/app/baseApi";

import type {
  AttendanceDay,
  AttendanceOverviewParams,
  AttendanceOverviewResponse,
  EmployeePunchDashboardResponse,
  MonthlyAttendanceParams,
  PunchDashboardParams,
  PunchRecord,
  RawPunchParams,
  ReportingEmployee,
} from "../types/regularization.types";

export const regularizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =====================================================
    // EMPLOYEE MONTHLY ATTENDANCE DETAILS
    // POST /attendance/employeemonthlyattendancedetails
    // =====================================================
    getEmployeeMonthlyAttendanceDetails: builder.query<
      AttendanceDay[],
      MonthlyAttendanceParams
    >({
      query: ({
        employeeId,
        month,
        year,
        classificationId,
      }) => {
        const body: Record<string, unknown> = {
          employeeId,
          month,
          year,
        };

        // Only send classificationId when it is a real positive value
        // Sending 0 was causing: {"StatusCode":400,"StatusMessage":"Invalid Attendance..."}
        if (classificationId && classificationId > 0) {
          body.classificationId = classificationId;
        }

        return {
          url: "/review/employeemonthlyattendancedetails",
          method: "POST",
          body,
        };
      },

      transformResponse: (
        response: unknown,
      ): AttendanceDay[] => {
        // Handle backend error response
        if (
          Array.isArray(response) &&
          response.length > 0 &&
          (response[0] as any)?.StatusCode === 400
        ) {
          console.warn(
            "Monthly attendance API returned 400:",
            response[0],
          );
          return [];
        }

        if (Array.isArray(response)) {
          return response as AttendanceDay[];
        }

        if (response && typeof response === "object") {
          const data = response as Record<string, unknown>;

          if (Array.isArray(data.data)) {
            return data.data as AttendanceDay[];
          }
          if (Array.isArray(data.result)) {
            return data.result as AttendanceDay[];
          }
          if (Array.isArray(data.recordset)) {
            return data.recordset as AttendanceDay[];
          }
          if (Array.isArray((data as any).recordsets?.[0])) {
            return (data as any).recordsets[0] as AttendanceDay[];
          }
        }

        return [];
      },
    }),

    // =====================================================
    // EMPLOYEE ATTENDANCE OVERVIEW
    // POST /attendance/employeeattendanceoverview
    // =====================================================
    getEmployeeAttendanceOverview: builder.query<
      AttendanceOverviewResponse,
      AttendanceOverviewParams
    >({
      query: ({
        employeeId,
        year,
        month,
      }) => ({
        url: "/review/employeeattendanceoverview",
        method: "POST",
        body: {
          employeeId,
          year,
          month,
        },
      }),

      transformResponse: (
        response: unknown,
      ): AttendanceOverviewResponse => {
        if (Array.isArray(response)) {
          return response as AttendanceOverviewResponse;
        }

        if (response && typeof response === "object") {
          const data = response as Record<string, unknown>;

          if (Array.isArray(data.data)) {
            return data.data as AttendanceOverviewResponse;
          }
          if (Array.isArray(data.result)) {
            return data.result as AttendanceOverviewResponse;
          }
          if (Array.isArray(data.recordset)) {
            return data.recordset as AttendanceOverviewResponse;
          }
          if (Array.isArray((data as any).recordsets?.[0])) {
            return (data as any).recordsets[0] as AttendanceOverviewResponse;
          }
        }

        return [];
      },
    }),

    // =====================================================
    // EMPLOYEE PUNCH DASHBOARD
    // POST /attendance/employeepunchdashboard
    // =====================================================
    getEmployeePunchDashboard: builder.query<
      EmployeePunchDashboardResponse,
      PunchDashboardParams
    >({
      query: ({
        employeeId,
        selectedDate,
        viewType = "CustomMonth",
      }) => ({
        url: "/review/employeepunchdashboard",
        method: "POST",
        body: {
          employeeId,
          ...(selectedDate ? { selectedDate } : {}),
          viewType,
        },
      }),

      transformResponse: (
        response: EmployeePunchDashboardResponse,
      ): EmployeePunchDashboardResponse => ({
        employeeProfile: Array.isArray(response?.employeeProfile)
          ? response.employeeProfile
          : [],
        attendanceSummary: Array.isArray(response?.attendanceSummary)
          ? response.attendanceSummary
          : [],
        punchRecords: Array.isArray(response?.punchRecords)
          ? response.punchRecords
          : [],
      }),
    }),

    // =====================================================
    // EMPLOYEE RAW PUNCHES
    // POST /attendance/employeerawpunches
    // =====================================================
    getEmployeeDailyRawPunches: builder.query<
      PunchRecord[],
      RawPunchParams
    >({
      query: ({
        employeeId,
        date,
      }) => ({
        url: "/review/employeerawpunches",
        method: "POST",
        body: {
          employeeId,
          date,
        },
      }),

      transformResponse: (
        response: unknown,
      ): PunchRecord[] => {
        let records: unknown[] = [];

        if (Array.isArray(response)) {
          records = response;
        } else if (response && typeof response === "object") {
          const data = response as Record<string, unknown>;

          if (Array.isArray(data.data)) {
            records = data.data;
          } else if (Array.isArray(data.result)) {
            records = data.result;
          }
        }

        return records
          .filter(
            (item): item is Record<string, unknown> =>
              Boolean(item && typeof item === "object"),
          )
          .map((item) => ({
            time: String(item.OriginalTime ?? ""),
            type: String(item.PunchType ?? ""),
            source: String(item.EntryType ?? ""),
            approverStatus:
              item.Approverstatus !== undefined
                ? String(item.Approverstatus)
                : undefined,
          }))
          .filter(
            (item) => item.time || item.type || item.source,
          );
      },
    }),

    // =====================================================
    // REPORTING EMPLOYEES
    // POST /attendance/reportingemployees
    // =====================================================
    getAttendanceOverviewEmployees: builder.query<
      ReportingEmployee[],
      void
    >({
      query: () => ({
        url: "/review/reporting-employees",
        method: "GET",
      }),

      transformResponse: (
        response: unknown,
      ): ReportingEmployee[] => {
        if (Array.isArray(response)) {
          return response as ReportingEmployee[];
        }

        if (response && typeof response === "object") {
          const data = response as Record<string, unknown>;

          if (Array.isArray(data.data)) {
            return data.data as ReportingEmployee[];
          }
          if (Array.isArray(data.result)) {
            return data.result as ReportingEmployee[];
          }
          if (Array.isArray(data.recordset)) {
            return data.recordset as ReportingEmployee[];
          }
          if (Array.isArray((data as any).recordsets?.[0])) {
            return (data as any).recordsets[0] as ReportingEmployee[];
          }
        }

        return [];
      },
    }),
  }),
});

// =====================================================
// HOOKS
// =====================================================

export const {
  useGetEmployeeMonthlyAttendanceDetailsQuery,
  useLazyGetEmployeeMonthlyAttendanceDetailsQuery,

  useGetEmployeeAttendanceOverviewQuery,
  useLazyGetEmployeeAttendanceOverviewQuery,

  useGetEmployeePunchDashboardQuery,
  useLazyGetEmployeePunchDashboardQuery,

  useGetEmployeeDailyRawPunchesQuery,
  useLazyGetEmployeeDailyRawPunchesQuery,

  useGetAttendanceOverviewEmployeesQuery,
  useLazyGetAttendanceOverviewEmployeesQuery,
} = regularizationApi;