// import { Button } from "@/components/ui/button";
// import { ChevronRight, FileText } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// interface ReportSection {
//   title: string;
//   reports: {
//     label: string;
//     path: string;
//   }[];
// }

// const TIME_OFFICE_SECTIONS: ReportSection[] = [
//   {
//     title: "Day-Wise Reports",
//     reports: [
//       { label: "Day-Wise Summary", path: "day-wise-summary" },
//       { label: "Day-Wise Detailed", path: "day-wise-detailed" },
//       { label: "Attendance Register", path: "attendance-register" },
//       { label: "Day-Wise Employee Shift", path: "day-wise-employee-shift" },
//       { label: "Employee Day Summary", path: "employee-day-summary" },
//       { label: "Employee CW Details", path: "employee-cw-details" },
//       { label: "Employee Day-Wise Overview", path: "employee-day-wise-overview" },
//     ],
//   },

//   {
//     title: "TA Employee wise Report",
//     reports: [
//       { label: "Assigned shift", path: "assigned-shift" },
//       { label: "Assigned Temp. Shift", path: "assigned-temp-shift" },
//       { label: "Assigned Pattern", path: "assigned-pattern" },
//       { label: "Assigned Policy", path: "assigned-policy" },
//       { label: "Temporary Policy", path: "temporary-policy" },
//       { label: "Employee TA Details", path: "employee-ta-details" },
//       { label: "Non Working Hours", path: "non-working-hours" },
//       { label: "Penalty Leave Adjustment", path: "penalty-leave-adjustment" },
//       { label: "Employee Break Slots", path: "employee-break-slots" },
//       { label: "Exception Report", path: "exception-report" },
//     ],
//   },

//   {
//     title: "Day Wise Attendance Summary",
//     reports: [
//       { label: "Late In", path: "late-in" },
//       { label: "Early Out", path: "early-out" },
//       { label: "Early In", path: "early-in" },
//       { label: "Late Out", path: "late-out" },
//       { label: "InOut Punch", path: "inout-punch" },
//       { label: "Over Time", path: "over-time" },
//       { label: "Attendance Status", path: "attendance-status" },
//       { label: "Work Hours", path: "work-hours" },
//       { label: "Week Off", path: "week-off" },
//       { label: "Absent Status", path: "absent-status" },
//     ],
//   },

//   {
//     title: "Monthly Attendance Summary",
//     reports: [
//       { label: "Late In", path: "monthly-late-in" },
//       { label: "Early Out", path: "monthly-early-out" },
//       { label: "Early In", path: "monthly-early-in" },
//       { label: "Late Out", path: "monthly-late-out" },
//       { label: "Over Time", path: "monthly-over-time" },
//       { label: "Work Hours", path: "monthly-work-hours" },
//       { label: "Attendance Status", path: "monthly-attendance-status" },
//       { label: "Monthly Shift", path: "monthly-shift" },
//       { label: "Monthly Overview", path: "monthly-overview" },
//       { label: "Continuous absent Days", path: "continuous-absent-days" },
//     ],
//   },

//   {
//     title: "Employee Punch Reports",
//     reports: [
//       { label: "Punch Report", path: "punch-report" },
//       { label: "Time Card", path: "time-card" },
//       { label: "Punch Events", path: "punch-events" },
//       { label: "Punch Penalty", path: "punch-penalty" },
//     ],
//   },

//   {
//     title: "Employee Exceptions",
//     reports: [
//       { label: "Personal Permission", path: "personal-permission" },
//       { label: "Official Permission", path: "official-permission" },
//       { label: "Auto Permission", path: "auto-permission" },
//       { label: "Day Wise Grace", path: "day-wise-grace" },
//       { label: "Monthly Grace", path: "monthly-grace" },
//     ],
//   },

//   {
//     title: "Regularizations/Authorization",
//     reports: [
//       { label: "Punch Correction", path: "punch-correction" },
//       { label: "Attendance Override", path: "attendance-override" },
//       { label: "CW Authorization", path: "cw-authorization" },
//       { label: "OT Authorization", path: "ot-authorization" },
//       { label: "OT to CW Converted", path: "ot-to-cw-converted" },
//     ],
//   },

//   {
//     title: "Yearly",
//     reports: [
//       { label: "Yearly Performance", path: "yearly-performance" },
//     ],
//   },
// ];

// export default function TimeOfficePage() {
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-full w-full bg-white p-4">
//       {/* ==================== TIME OFFICE HEADER ==================== */}
//       <div className="mb-5 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">
//         <div className="flex h-[62px] items-center px-5">
//           {/* Title */}
//           <div className="flex h-[40px] shrink-0 items-center rounded-[8px] border border-[#df8f7b] bg-white px-5">
//             <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
//               Time Office
//             </h1>
//           </div>
//         </div>
//       </div>

//       {/* ==================== REPORT SECTIONS ==================== */}
//       <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
//         {TIME_OFFICE_SECTIONS.map((section) => (
//           <div
//             key={section.title}
//             className="flex min-h-[280px] flex-col overflow-hidden rounded-[12px] border border-[#aeb4bb] bg-white"
//           >
//             {/* Section Header */}
//             <div className="flex min-h-[49px] shrink-0 items-center gap-2 border-b border-[#dfe3e8] bg-[#f3f5f7] px-3">
//               <FileText
//                 size={17}
//                 strokeWidth={1.8}
//                 className="shrink-0 text-[#a45a4a]"
//               />

//               <h2 className="font-[Urbanist] text-[18px] font-bold leading-6 text-[#9a5547]">
//                 {section.title}
//               </h2>
//             </div>

//             {/* Report List */}
//             <div className="flex-1 px-2 py-2">
//               {section.reports.map((report) => (
//                 <Button
//                   key={report.path}
//                   variant="ghost"
//                   type="button"
//                   onClick={() => navigate(report.path)}
//                   className="flex min-h-[32px] w-full items-center justify-between rounded-none px-2 font-[Urbanist] text-[13px] font-normal leading-5 text-[#202124] shadow-none transition-colors hover:bg-[#fff5f2] hover:text-[#9a5547]"
//                 >
//                   <span className="whitespace-nowrap">
//                     {report.label}
//                   </span>

//                   <ChevronRight
//                     size={17}
//                     strokeWidth={1.8}
//                     className="ml-2 shrink-0 text-[#3f3f3f]"
//                   />
//                 </Button>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { ChevronRight, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ReportSection {
  title: string;
  reports: {
    label: string;
    path: string;
  }[];
}

const TIME_OFFICE_SECTIONS: ReportSection[] = [
  {
    title: "Day-Wise Reports",
    reports: [
      { label: "Day-Wise Summary", path: "day-wise-summary" },
      { label: "Day-Wise Detailed", path: "day-wise-detailed" },
      { label: "Attendance Register", path: "attendance-register" },
      { label: "Day-Wise Employee Shift", path: "day-wise-employee-shift" },
      { label: "Employee Day Summary", path: "employee-day-summary" },
      { label: "Employee CW Details", path: "employee-cw-details" },
      { label: "Employee Day-Wise Overview", path: "employee-day-wise-overview" },
    ],
  },

  {
    title: "TA Employee wise Report",
    reports: [
      { label: "Assigned shift", path: "assigned-shift" },
      { label: "Assigned Temp. Shift", path: "assigned-temp-shift" },
      { label: "Assigned Pattern", path: "assigned-pattern" },
      { label: "Assigned Policy", path: "assigned-policy" },
      { label: "Temporary Policy", path: "temporary-policy" },
      { label: "Employee TA Details", path: "employee-ta-details" },
      { label: "Non Working Hours", path: "non-working-hours" },
      { label: "Penalty Leave Adjustment", path: "penalty-leave-adjustment" },
      { label: "Employee Break Slots", path: "employee-break-slots" },
      { label: "Exception Report", path: "exception-report" },
    ],
  },

  {
    title: "Day Wise Attendance Summary",
    reports: [
      { label: "Late In", path: "late-in" },
      { label: "Early Out", path: "early-out" },
      { label: "Early In", path: "early-in" },
      { label: "Late Out", path: "late-out" },
      { label: "InOut Punch", path: "inout-punch" },
      { label: "Over Time", path: "over-time" },
      { label: "Attendance Status", path: "attendance-status" },
      { label: "Work Hours", path: "work-hours" },
      { label: "Week Off", path: "week-off" },
      { label: "Absent Status", path: "absent-status" },
    ],
  },

  {
    title: "Monthly Attendance Summary",
    reports: [
      { label: "Late In", path: "monthly-late-in" },
      { label: "Early Out", path: "monthly-early-out" },
      { label: "Early In", path: "monthly-early-in" },
      { label: "Late Out", path: "monthly-late-out" },
      { label: "Over Time", path: "monthly-over-time" },
      { label: "Work Hours", path: "monthly-work-hours" },
      { label: "Attendance Status", path: "monthly-attendance-status" },
      { label: "Monthly Shift", path: "monthly-shift" },
      { label: "Monthly Overview", path: "monthly-overview" },
      { label: "Continuous absent Days", path: "continuous-absent-days" },
    ],
  },

  {
    title: "Employee Punch Reports",
    reports: [
      { label: "Punch Report", path: "punch-report" },
      { label: "Time Card", path: "time-card" },
      { label: "Punch Events", path: "punch-events" },
      { label: "Punch Penalty", path: "punch-penalty" },
      { label: "WFH Punch", path: "wfh-punch" },
      { label: "OD Punch", path: "od-punch" },
      { label: "Absentee (No Punch)", path: "absentee-no-punch" },
      { label: "Missed Punch", path: "missed-punch" },
      { label: "Location Punches", path: "location-punches" },
      { label: "Location Wise Punches", path: "location-wise-punches" },
    ],
  },

  {
    title: "Employee Exceptions",
    reports: [
      { label: "Personal Permission", path: "personal-permission" },
      { label: "Official Permission", path: "official-permission" },
      { label: "Auto Permission", path: "auto-permission" },
      { label: "Day Wise Grace", path: "day-wise-grace" },
      { label: "Monthly Grace", path: "monthly-grace" },
    ],
  },

  {
    title: "Regularizations/Authorization",
    reports: [
      { label: "Punch Correction", path: "punch-correction" },
      { label: "Attendance Override", path: "attendance-override" },
      { label: "CW Authorization", path: "cw-authorization" },
      { label: "OT Authorization", path: "ot-authorization" },
      { label: "OT to CW Converted", path: "ot-to-cw-converted" },
    ],
  },

  {
    title: "Yearly",
    reports: [
      { label: "Yearly Performance", path: "yearly-performance" },
    ],
  },
];

export default function TimeOfficePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full w-full bg-white p-4">
      {/* ==================== TIME OFFICE HEADER ==================== */}
      <div className="mb-5 w-full overflow-hidden rounded-[14px] border border-[#df8f7b] bg-[#fff8f6]">
        <div className="flex h-[62px] items-center px-5">
          <div className="flex h-[40px] shrink-0 items-center rounded-[8px] border border-[#df8f7b] bg-white px-5">
            <h1 className="whitespace-nowrap font-[Urbanist] text-[22px] font-extrabold leading-none text-[#9a5547]">
              Time Office
            </h1>
          </div>
        </div>
      </div>

      {/* ==================== REPORT SECTIONS ==================== */}
      <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {TIME_OFFICE_SECTIONS.map((section) => (
          <div
            key={section.title}
            className="flex min-h-[280px] flex-col rounded-[12px] border border-[#aeb4bb] bg-white"
          >
            {/* Section Header */}
            <div className="flex min-h-[49px] shrink-0 items-center gap-2 border-b border-[#dfe3e8] bg-[#f3f5f7] px-3">
              <FileText
                size={17}
                strokeWidth={1.8}
                className="shrink-0 text-[#a45a4a]"
              />

              <h2 className="font-[Urbanist] text-[18px] font-bold leading-6 text-[#9a5547]">
                {section.title}
              </h2>
            </div>

            {/* Report List */}
            <div className="px-2 py-2">
              {section.reports.map((report) => (
                <Button
                  key={report.path}
                  variant="ghost"
                  type="button"
                  onClick={() => navigate(report.path)}
                  className="flex min-h-[32px] w-full items-center justify-between rounded-none px-2 font-[Urbanist] text-[13px] font-normal leading-5 text-[#202124] shadow-none transition-colors hover:bg-[#fff5f2] hover:text-[#9a5547]"
                >
                  <span className="whitespace-nowrap">{report.label}</span>

                  <ChevronRight
                    size={17}
                    strokeWidth={1.8}
                    className="ml-2 shrink-0 text-[#3f3f3f]"
                  />
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
