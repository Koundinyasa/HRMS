// import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import {
//   ChevronDown,
//   ChevronsLeft,
//   ChevronsRight,
//   ChevronLeft,
//   ChevronRight,
//   FileSpreadsheet,
//   FileText,
//   Search,
//   Filter,
//   X,
//   Plus,
//   MoreVertical,
//   Clock,
//   Eye
// } from "lucide-react";

// import {
//   Activity,
//   BarChart3,
//   Download,
// } from "lucide-react";
// import DatePicker, {
//   type DatePickerCell,
// } from "@/components/ui/datepicker";
// import CheckboxDropdownFilter from "../pages/CheckboxDropdownFilter";
// import contactImage from "../../../../assets/images/contactimage.png";

// type FilterOption = {
//   label: string;
//   value: string;
// };

// /* -------------------------------------------------------------------------- */
// /* Date field hook — drives the real DatePicker component off a plain         */
// /* "DD-MM-YYYY" string, the same format the rest of this page already uses.   */
// /* -------------------------------------------------------------------------- */

// function parseDDMMYYYY(value: string): Date | null {
//   const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
//   if (!match) return null;

//   const [, dd, mm, yyyy] = match;
//   const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

//   if (
//     date.getFullYear() !== Number(yyyy) ||
//     date.getMonth() !== Number(mm) - 1 ||
//     date.getDate() !== Number(dd)
//   ) {
//     return null;
//   }

//   return date;
// }

// function toISO(date: Date): string {
//   const yyyy = date.getFullYear();
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// function formatDDMMYYYY(date: Date): string {
//   const dd = String(date.getDate()).padStart(2, "0");
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const yyyy = date.getFullYear();
//   return `${dd}-${mm}-${yyyy}`;
// }

// function useDateField(value: string, onChange: (value: string) => void) {
//   const [text, setText] = useState(value);
//   const [open, setOpen] = useState(false);
//   const [isInvalid, setIsInvalid] = useState(false);
//   const [viewDate, setViewDate] = useState<Date>(
//     () => parseDDMMYYYY(value) ?? new Date(),
//   );

//   // Keep local text/view in sync if the value is changed from outside.
//   useMemo(() => {
//     setText(value);
//     const parsed = parseDDMMYYYY(value);
//     if (parsed) setViewDate(parsed);
//   }, [value]);

//   const monthLabel = viewDate.toLocaleString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

//   const cells: DatePickerCell[] = useMemo(() => {
//     const year = viewDate.getFullYear();
//     const month = viewDate.getMonth();
//     const firstOfMonth = new Date(year, month, 1);
//     const startOffset = firstOfMonth.getDay();
//     const start = new Date(year, month, 1 - startOffset);

//     const selected = parseDDMMYYYY(value);
//     const selectedIso = selected ? toISO(selected) : "";

//     return Array.from({ length: 42 }, (_, index) => {
//       const date = new Date(start);
//       date.setDate(start.getDate() + index);
//       const iso = toISO(date);

//       return {
//         iso,
//         day: date.getDate(),
//         inMonth: date.getMonth() === month,
//         disabled: false,
//         selected: iso === selectedIso,
//       };
//     });
//   }, [viewDate, value]);

//   const onTextChange = (raw: string) => {
//     setText(raw);
//     setIsInvalid(false);
//   };

//   const onBlur = () => {
//     if (text.trim() === "") {
//       onChange("");
//       setIsInvalid(false);
//       return;
//     }

//     const parsed = parseDDMMYYYY(text);

//     if (!parsed) {
//       setIsInvalid(true);
//       return;
//     }

//     setIsInvalid(false);
//     onChange(text.trim());
//     setViewDate(parsed);
//   };

//   const onSelectDay = (iso: string) => {
//     const [yyyy, mm, dd] = iso.split("-");
//     const formatted = `${dd}-${mm}-${yyyy}`;
//     onChange(formatted);
//     setText(formatted);
//     setIsInvalid(false);
//     setOpen(false);
//   };

//   const onPrevMonth = () => {
//     setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
//   };

//   const onNextMonth = () => {
//     setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
//   };

//   const onClear = () => {
//     onChange("");
//     setText("");
//     setIsInvalid(false);
//     setOpen(false);
//   };

//   const onToday = () => {
//     const today = new Date();
//     const formatted = formatDDMMYYYY(today);
//     onChange(formatted);
//     setText(formatted);
//     setViewDate(today);
//     setIsInvalid(false);
//     setOpen(false);
//   };

//   return {
//     text,
//     onTextChange,
//     onBlur,
//     isInvalid,
//     open,
//     onOpenChange: setOpen,
//     monthLabel,
//     weekdayLabels,
//     cells,
//     onSelectDay,
//     onPrevMonth,
//     onNextMonth,
//     onClear,
//     onToday,
//   };
// }

// /* -------------------------------------------------------------------------- */
// /* Shared dropdown positioning — keeps small custom dropdown panels (Query,   */
// /* Year, etc.) fully on-screen the same way CheckboxDropdownFilter does.      */
// /* -------------------------------------------------------------------------- */

// function useDropdownPosition(
//   open: boolean,
//   onClose: () => void,
//   panelWidth = 224,
// ) {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const [coords, setCoords] = useState({ top: 0, left: 0 });

//   const reposition = () => {
//     const btn = buttonRef.current;
//     if (!btn) return;

//     const rect = btn.getBoundingClientRect();
//     const margin = 8;

//     let left = rect.left;
//     const maxLeft = window.innerWidth - margin - panelWidth;
//     if (left > maxLeft) left = Math.max(margin, maxLeft);
//     if (left < margin) left = margin;

//     let top = rect.bottom + 4;
//     const estimatedHeight = 260;
//     if (top + estimatedHeight > window.innerHeight - margin) {
//       const flippedTop = rect.top - 4 - estimatedHeight;
//       top = flippedTop > margin ? flippedTop : margin;
//     }

//     setCoords({ top, left });
//   };

//   useLayoutEffect(() => {
//     if (!open) return;
//     reposition();
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;

//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     const handleReposition = () => reposition();

//     document.addEventListener("mousedown", handleClickOutside);
//     window.addEventListener("resize", handleReposition);
//     window.addEventListener("scroll", handleReposition, true);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       window.removeEventListener("resize", handleReposition);
//       window.removeEventListener("scroll", handleReposition, true);
//     };
//   }, [open, onClose]);

//   return { wrapperRef, buttonRef, coords };
// }

// /* -------------------------------------------------------------------------- */
// /* Existing Audit Trail Filters                                               */
// /* -------------------------------------------------------------------------- */

// const MODULE_OPTIONS: FilterOption[] = [
//   { label: "Config", value: "config" },
//   { label: "On Board", value: "on-board" },
//   { label: "T&A", value: "t-and-a" },
//   { label: "Salary", value: "salary" },
//   { label: "Approval", value: "approval" },
//   { label: "Reports", value: "reports" },
//   { label: "Group Of Company", value: "group-of-company" },
// ];

// const EMPLOYEE_OPTIONS: FilterOption[] = [
//   {
//     label: "Anusha Mavellapalli",
//     value: "anusha-mavellapalli",
//   },
//   {
//     label: "Chandra Shekar Saka",
//     value: "chandra-shekar-saka",
//   },
//   {
//     label: "Nikhitha Narala",
//     value: "nikhitha-narala",
//   },
//   {
//     label: "Rohith Kumar Karkonda",
//     value: "rohith-kumar-karkonda",
//   },
//   {
//     label: "Praveen Kumar Yadav Arva",
//     value: "praveen-kumar-yadav-arva",
//   },
//   {
//     label: "Shamsh Tabrez Mohammed",
//     value: "shamsh-tabrez-mohammed",
//   },
//   {
//     label: "Rakesh Peddi",
//     value: "rakesh-peddi",
//   },
//   {
//     label: "Ishika Santosh Mokati",
//     value: "ishika-santosh-mokati",
//   },
//   {
//     label: "Rama Veera Manikanta Pusunuri",
//     value: "rama-veera-manikanta-pusunuri",
//   },
//   {
//     label: "Umar Sharief Shaik",
//     value: "umar-sharief-shaik",
//   },
// ];

// const PAGE_OPTIONS: FilterOption[] = [];

// const ACTION_OPTIONS: FilterOption[] = [
//   { label: "Record Created", value: "record-created" },
//   { label: "Record Updated", value: "record-updated" },
//   { label: "Record Deleted", value: "record-deleted" },
// ];

// /* -------------------------------------------------------------------------- */
// /* Existing Audit Trail Data                                                   */
// /* -------------------------------------------------------------------------- */

// type AuditRecord = {
//   pageDetails: string;
//   recordDetails: string;
//   recordChanges: string;
//   actionTime: string;
//   user: string;
//   employeeName: string;
// };

// const AUDIT_RECORDS: AuditRecord[] = [];

// const PAGE_SIZE = 50;

// /* -------------------------------------------------------------------------- */
// /* Work Flow Status Data                                                       */
// /* -------------------------------------------------------------------------- */

// type WorkflowStatus = "Approved" | "Cancelled" | "Pending" | "Rejected";

// type WorkflowRecord = {
//   employeeId: string;
//   employeeName: string;
//   workflowName: string;
//   groupName: string;
//   noOfLeaves: string;
//   submittedDate: string;
//   appliedDate: string;
//   approvedDate: string;
//   wfLevel: string;
//   approverName: string;
//   wfStatus: WorkflowStatus;
//   leaveReason: string;
//   remarks: string;
// };

// const WORKFLOW_RECORDS: WorkflowRecord[] = [];

// const WORKFLOW_GROUP_OPTIONS: FilterOption[] = [
//   {
//     label: "Casual Leave",
//     value: "casual-leave",
//   },
//   {
//     label: "Loss of Pay",
//     value: "loss-of-pay",
//   },
//   {
//     label: "Medical Wellness Leave.",
//     value: "medical-wellness-leave",
//   },
//   {
//     label: "Restricted Holiday",
//     value: "restricted-holiday",
//   },
//   {
//     label: "Sick Leave",
//     value: "sick-leave",
//   },
// ];

// const WORKFLOW_NAME_OPTIONS: FilterOption[] = [
//   {
//     label: "Leave Apply RA Level 1",
//     value: "leave-apply-ra-level-1",
//   },
// ];

// const APPROVER_OPTIONS: FilterOption[] = [
//   {
//     label: "BHAGYARAJA AVURAPALLI",
//     value: "bhagyaraja-avurapalli",
//   },
//   {
//     label: "Daniel Raju Ravi",
//     value: "daniel-raju-ravi",
//   },
//   {
//     label: "Mohd Zeeshan",
//     value: "mohd-zeeshan",
//   },
//   {
//     label: "RAJESH UBBAPALLY",
//     value: "rajesh-ubbapally",
//   },
//   {
//     label: "Surekha Jonna",
//     value: "surekha-jonna",
//   },
//   {
//     label: "Venkata Ramana Kalaga",
//     value: "venkata-ramana-kalaga",
//   },
// ];

// const WORKFLOW_STATUS_OPTIONS: FilterOption[] = [
//   {
//     label: "Approved",
//     value: "approved",
//   },
//   {
//     label: "Cancelled",
//     value: "cancelled",
//   },
//   {
//     label: "Pending",
//     value: "pending",
//   },
//   {
//     label: "Rejected",
//     value: "rejected",
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /* Attrition Report Data                                                       */
// /* -------------------------------------------------------------------------- */

// const ATTRITION_YEAR_OPTIONS = ["2026-2027", "2025-2026", "2024-2025"];

// const ATTRITION_MONTH_LABELS = [
//   "Apr/2026",
//   "May/2026",
//   "Jun/2026",
//   "Jul/2026",
//   "Aug/2026",
//   "Sep/2026",
// ];

// const ATTRITION_MONTH_SHORT = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

// const ATTRITION_TOTAL_STRENGTH = [];
// const ATTRITION_TOTAL_STRENGTH_SUM = 0;

// const ATTRITION_RESIGNED = [];
// const ATTRITION_RESIGNED_SUM = 0;

// const ATTRITION_ABSCONDING = [];
// const ATTRITION_ABSCONDING_SUM = 0;

// const ATTRITION_TERMINATION = [];
// const ATTRITION_TERMINATION_SUM = 0;

// const ATTRITION_TOTAL = [11, 3, 1, 0, 0, 0];
// const ATTRITION_TOTAL_SUM = 0;

// const ATTRITION_RECRUITMENT = [];
// const ATTRITION_RECRUITMENT_SUM = 0;

// const ATTRITION_TRANSFERRED_OUT = [];
// const ATTRITION_TRANSFERRED_OUT_SUM = 0;

// const ATTRITION_JOINED_BY_TRANSFER = [];
// const ATTRITION_JOINED_BY_TRANSFER_SUM = 0;

// const ATTRITION_TOTAL_EMP_LAST_DAY = [];
// const ATTRITION_TOTAL_EMP_LAST_DAY_SUM = 0;

// const ATTRITION_PERCENTAGE: Array<number | null> = [];
// const ATTRITION_PERCENTAGE_SUM = 0;

// const ATTRITION_CHART_MONTHS = [
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
//   "Jan",
//   "Feb",
//   "Mar",
// ];

// const ATTRITION_CHART_VALUES = [];

// const ATTRITION_BRANCH_OPTIONS: FilterOption[] = [
//   {
//     label: "Koundinyasa Technology Services Pvt. Ltd.",
//     value: "koundinyasa-technology-services-pvt-ltd",
//   },
// ];

// const ATTRITION_SALARY_STRUCTURE_OPTIONS: FilterOption[] = [
//   { label: "CTC Salary Structure", value: "ctc-salary-structure" },
//   { label: "New Salary Structure", value: "new-salary-structure" },
//   { label: "Salary structure", value: "salary-structure" },
//   { label: "Test Structure", value: "test-structure" },
//   { label: "Test Structure 2", value: "test-structure-2" },
//   { label: "TEST3", value: "test3" },
// ];

// const ATTRITION_LEAVE_OPTIONS: FilterOption[] = [
//   { label: "Employee Leave Policy", value: "employee-leave-policy" },
//   { label: "Intern Leave Policy", value: "intern-leave-policy" },
// ];

// const ATTRITION_ATTENDANCE_OPTIONS: FilterOption[] = [
//   { label: "Daily", value: "daily" },
// ];

// const ATTRITION_DESIGNATION_OPTIONS: FilterOption[] = [
//   {
//     label: "ASSOCIATE SOFTWARE ENGINEER",
//     value: "associate-software-engineer",
//   },
//   {
//     label: "BUSSINESS DEVELOPMENT EXECUTIVE",
//     value: "bussiness-development-executive",
//   },
//   {
//     label: "BUSSINESS DEVELOPMENT MANAGER",
//     value: "bussiness-development-manager",
//   },
//   { label: "Cloud DevOps Engineer", value: "cloud-devops-engineer" },
//   { label: "Data Analyst", value: "data-analyst" },
//   { label: "Devops Engineer", value: "devops-engineer" },
//   { label: "Flutter Developer", value: "flutter-developer" },
//   { label: "HR EXECUTIVE", value: "hr-executive" },
//   { label: "HR MANAGER", value: "hr-manager" },
//   { label: "HR RECRUITER", value: "hr-recruiter" },
//   { label: "OFFICE BOY", value: "office-boy" },
//   { label: "PROJECT LEAD", value: "project-lead" },
//   { label: "PROJECT MANAGER", value: "project-manager" },
//   { label: "Quality Analyst", value: "quality-analyst" },
//   { label: "React Developer", value: "react-developer" },
// ];

// const ATTRITION_EMP_STATUS_OPTIONS: FilterOption[] = [
//   { label: "Current Employees", value: "current-employees" },
//   { label: "Left Employees", value: "left-employees" },
// ];

// /* -------------------------------------------------------------------------- */
// /* Main Page                                                                   */
// /* -------------------------------------------------------------------------- */

// export default function OthersPage() {
//   const [activeTab, setActiveTab] = useState("Audit Trail");

//   const [searchText, setSearchText] = useState("");
//   const [fromDate, setFromDate] = useState("25-07-2026");
//   const [toDate, setToDate] = useState("02-09-2026");

//   const fromDatePicker = useDateField(fromDate, setFromDate);
//   const toDatePicker = useDateField(toDate, setToDate);

//   const [moduleFilter, setModuleFilter] = useState<string[]>([]);
//   const [employeeFilter, setEmployeeFilter] = useState<string[]>([]);
//   const [pageFilter, setPageFilter] = useState<string[]>([]);
//   const [actionFilter, setActionFilter] = useState<string[]>([]);

//   const [page, setPage] = useState(1);

//   // Attrition Report drill-down state
//   const [attritionView, setAttritionView] = useState<"menu" | "detail">(
//     "menu",
//   );
//   const [attritionReportTitle, setAttritionReportTitle] = useState(
//     "Attrition Report",
//   );
//   const [attritionYear, setAttritionYear] = useState("2026-2027");
//   const [isAttritionYearOpen, setIsAttritionYearOpen] = useState(false);
//   const [attritionSearchText, setAttritionSearchText] = useState("");
//   const [attritionBranchFilter, setAttritionBranchFilter] = useState<
//     string[]
//   >([]);
//   const [attritionSalaryStructureFilter, setAttritionSalaryStructureFilter] =
//     useState<string[]>([]);
//   const [attritionLeaveFilter, setAttritionLeaveFilter] = useState<
//     string[]
//   >([]);
//   const [attritionAttendanceFilter, setAttritionAttendanceFilter] =
//     useState<string[]>([]);
//   const [attritionDesignationFilter, setAttritionDesignationFilter] =
//     useState<string[]>([]);
//   const [attritionEmpStatusFilter, setAttritionEmpStatusFilter] = useState<
//     string[]
//   >([]);

//   const isAuditTrail = activeTab === "Audit Trail";

//   const isAuditTrailForImport =
//     activeTab === "Audit Trail For Import";

//   const isWorkFlowStatus = activeTab === "Work Flow Status";

//   const isAttritionReport = activeTab === "Attrition Report";

//   const filteredRecords = useMemo(() => {
//     const searchValue = searchText.toLowerCase().trim();

//     if (!searchValue) {
//       return AUDIT_RECORDS;
//     }

//     return AUDIT_RECORDS.filter((record) =>
//       Object.values(record).some((value) =>
//         value.toLowerCase().includes(searchValue),
//       ),
//     );
//   }, [searchText]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredRecords.length / PAGE_SIZE),
//   );

//   const currentPage = Math.min(page, totalPages);

//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE,
//   );

//   const handleSearch = (value: string) => {
//     setSearchText(value);
//     setPage(1);
//   };

//   const handleExport = () => {
//     const headers = [
//       "Page Details",
//       "Record Details",
//       "Record Changes",
//       "Action Time",
//       "User",
//       "Employee Name",
//     ];

//     const rows = filteredRecords.map((record) => [
//       record.pageDetails,
//       record.recordDetails,
//       record.recordChanges,
//       record.actionTime,
//       record.user,
//       record.employeeName,
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) =>
//         row
//           .map((value) => `"${value.replaceAll('"', '""')}"`)
//           .join(","),
//       )
//       .join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "audit-trail.csv";
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   const openAttritionDetail = (title: string) => {
//     setAttritionReportTitle(title);
//     setAttritionView("detail");
//   };

//   const closeAttritionDetail = () => {
//     setAttritionView("menu");
//   };

//   const clearAttritionFilters = () => {
//     setAttritionSearchText("");
//     setAttritionBranchFilter([]);
//     setAttritionSalaryStructureFilter([]);
//     setAttritionLeaveFilter([]);
//     setAttritionAttendanceFilter([]);
//     setAttritionDesignationFilter([]);
//     setAttritionEmpStatusFilter([]);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#f4f8fe] p-4">
//       <div className="rounded-xl bg-white p-4 shadow-sm">
//         {/* Top tabs */}
//         <div className="rounded-xl border border-[#c96f58] bg-[#fff8f5] p-2">
//   <div className="flex w-full items-center gap-2 overflow-visible max-[768px]:overflow-x-auto">
//     {[
//       {
//         label: "Audit Trail",
//         icon: <Clock size={15} />,
//       },
//       {
//         label: "Audit Trail For Import",
//         icon: <Download size={15} />,
//       },
//       {
//         label: "Work Flow Status",
//         icon: <Activity size={15} />,
//       },
//       {
//         label: "Attrition Report",
//         icon: <BarChart3 size={15} />,
//       },
//     ].map((tab) => (
//       <button
//         key={tab.label}
//         type="button"
//         onClick={() => {
//           setActiveTab(tab.label);
//           setPage(1);

//           if (tab.label === "Attrition Report") {
//             setAttritionView("menu");
//           }
//         }}
//         className={`flex h-10 min-w-fit flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-xs font-medium transition ${activeTab === tab.label
//           ? "border-[#b85c45] bg-white text-[#984936]"
//           : "border-[#d6d9df] bg-white text-[#26364d] hover:border-[#b85c45] hover:text-[#984936]"
//           }`}
//       >
//         {tab.icon}
//         <span>{tab.label}</span>
//       </button>
//     ))}

//     {!isWorkFlowStatus &&
//       !(isAttritionReport && attritionView === "detail") && (
//         <button
//           type="button"
//           onClick={handleExport}
//           title="Export to Excel"
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
//         >
//           <FileSpreadsheet size={20} />
//         </button>
//       )}
//   </div>
// </div>

//         {/* Audit Trail For Import - unchanged */}
//         {isAuditTrailForImport && (
//           <>
//             <div className="mt-3 flex items-center gap-4 rounded-lg border border-[#f1e4c2] bg-[#fffaf0] px-5 py-4 text-[#8a7444]">
//               <span className="text-2xl text-[#e7c85c]">⚠</span>

//               <span className="text-base">
//                 Select any module to list the data in the audit trail for
//                 import.
//               </span>
//             </div>

//             <div className="mt-4 flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 bg-white px-4 py-3">
//               <CheckboxDropdownFilter
//                 label="Module"
//                 options={MODULE_OPTIONS}
//                 selected={moduleFilter}
//                 onChange={setModuleFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Employee"
//                 options={EMPLOYEE_OPTIONS}
//                 selected={employeeFilter}
//                 onChange={setEmployeeFilter}
//               />

//               <div className="relative w-[240px] shrink-0 sm:w-[310px]">
//                 <Search
//                   size={20}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Search RefNo or Empname..."
//                   className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
//                 />
//               </div>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...fromDatePicker} />
//               </div>

//               <span className="shrink-0 text-sm font-medium text-gray-700">
//                 To
//               </span>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...toDatePicker} />
//               </div>
//             </div>

//             {/* Same image for Audit Trail For Import */}
//             <div className="flex min-h-[520px] items-center justify-center">
//               <img
//                 src={contactImage}
//                 alt="Audit Trail For Import"
//                 className="max-h-[430px] w-auto object-contain"
//               />
//             </div>
//           </>
//         )}

//         {/* Work Flow Status - new UI */}
//         {isWorkFlowStatus && <WorkFlowStatus />}

//         {/* Attrition Report - menu of tiles, OR the detailed report */}
//         {isAttritionReport && attritionView === "menu" && (
//           <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-[780px]">
//             <button
//               type="button"
//               onClick={() => openAttritionDetail("Attrition Report")}
//               className="w-full overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
//             >
//               <div className="bg-[#e8edf5] px-4 py-3">
//                 <h2 className="text-base font-semibold text-[#102c49]">
//                   Attrition Report
//                 </h2>
//               </div>

//               <div className="px-4 py-4">
//                 <p className="text-sm text-gray-600">
//                   Attrition Report
//                 </p>
//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 openAttritionDetail("Attrition Report(Quarterly)")
//               }
//               className="w-full overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
//             >
//               <div className="bg-[#e8edf5] px-4 py-3">
//                 <h2 className="text-base font-semibold text-[#102c49]">
//                   Attrition Report(Quarterly)
//                 </h2>
//               </div>

//               <div className="px-4 py-4">
//                 <p className="text-sm text-gray-600">
//                   Attrition Report(Quarterly)
//                 </p>
//               </div>
//             </button>
//           </div>
//         )}

//         {isAttritionReport && attritionView === "detail" && (
//           <AttritionReportDetail
//             title={attritionReportTitle}
//             monthsToShow={
//               attritionReportTitle.includes("Quarterly") ? 3 : 6
//             }
//             year={attritionYear}
//             onYearChange={setAttritionYear}
//             isYearOpen={isAttritionYearOpen}
//             onToggleYearOpen={() =>
//               setIsAttritionYearOpen((value) => !value)
//             }
//             onCloseYear={() => setIsAttritionYearOpen(false)}
//             onBack={closeAttritionDetail}
//             searchText={attritionSearchText}
//             onSearchChange={setAttritionSearchText}
//             branchFilter={attritionBranchFilter}
//             onBranchFilterChange={setAttritionBranchFilter}
//             salaryStructureFilter={attritionSalaryStructureFilter}
//             onSalaryStructureFilterChange={setAttritionSalaryStructureFilter}
//             leaveFilter={attritionLeaveFilter}
//             onLeaveFilterChange={setAttritionLeaveFilter}
//             attendanceFilter={attritionAttendanceFilter}
//             onAttendanceFilterChange={setAttritionAttendanceFilter}
//             designationFilter={attritionDesignationFilter}
//             onDesignationFilterChange={setAttritionDesignationFilter}
//             empStatusFilter={attritionEmpStatusFilter}
//             onEmpStatusFilterChange={setAttritionEmpStatusFilter}
//             onClearFilters={clearAttritionFilters}
//           />
//         )}

//         {/* Original Audit Trail UI - unchanged */}
//         {isAuditTrail && (
//           <>
//             <div className="mt-3 flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 bg-white p-2">
//               <div className="relative w-[220px] shrink-0">
//                 <Search
//                   size={20}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   value={searchText}
//                   onChange={(event) =>
//                     handleSearch(event.target.value)
//                   }
//                   placeholder="Start Typing..."
//                   className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...fromDatePicker} />
//               </div>

//               <span className="shrink-0 text-sm font-medium text-gray-700">
//                 To
//               </span>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...toDatePicker} />
//               </div>

//               <CheckboxDropdownFilter
//                 label="Module"
//                 options={MODULE_OPTIONS}
//                 selected={moduleFilter}
//                 onChange={setModuleFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Employee"
//                 options={EMPLOYEE_OPTIONS}
//                 selected={employeeFilter}
//                 onChange={setEmployeeFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Page"
//                 options={PAGE_OPTIONS}
//                 selected={pageFilter}
//                 onChange={setPageFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Action"
//                 options={ACTION_OPTIONS}
//                 selected={actionFilter}
//                 onChange={setActionFilter}
//                 showSearch={false}
//               />
//             </div>

//             <div className="overflow-x-auto rounded-xl border border-[#cfd6df] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
//               <table className="w-full min-w-[900px] border-collapse text-left">
//                 <thead>
//                   <tr className="bg-white text-xs font-semibold text-[#26364d]">
//                     <th className="px-3 py-3 text-left">
//                       Page Details
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       Record Details
//                     </th>

//                     <th className="px-3 py-3 text-center">
//                       Record Changes
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       Action Time
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       User
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       Employee Name
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {visibleRecords.map((record, index) => (
//                     <tr
//                       key={`${record.pageDetails}-${index}`}
//                       className="border-b border-[#e5e7eb] bg-white text-[11px] text-[#26364d] transition hover:bg-[#f8fafc]"
//                     >
//                       <td className="rounded-l-lg px-4 py-4">
//                         {record.pageDetails}
//                       </td>

//                       <td className="px-4 py-4">
//                         {record.recordDetails}
//                       </td>

//                       <td className="px-3 py-4">
//                         <div className="flex items-center justify-center">
//                           <Eye
//                             size={17}
//                             strokeWidth={2}
//                             className="text-[#26364d]"
//                           />
//                         </div>
//                       </td>

//                       <td className="whitespace-nowrap px-4 py-4">
//                         {record.actionTime}
//                       </td>

//                       <td className="px-4 py-4">
//                         {record.user}
//                       </td>

//                       <td className="rounded-r-lg px-4 py-4">
//                         {record.employeeName}
//                       </td>
//                     </tr>
//                   ))}

//                   {visibleRecords.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className="px-4 py-10">
//                         <div className="flex min-h-[180px] items-center justify-center sm:min-h-[220px] md:min-h-[260px]">
//                           <img
//                             src={contactImage}
//                             alt="No data available"
//                             className="h-auto w-[120px] object-contain sm:w-[150px] md:w-[180px] lg:w-[200px]"
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex flex-wrap items-center justify-end gap-5 text-sm text-gray-700">
//               <div className="flex items-center gap-2">
//                 <span>Rows per page</span>
//                 <span>50</span>
//                 <ChevronDown size={16} />
//               </div>

//               <span>
//                 {visibleRecords.length === 0
//                   ? "0"
//                   : `${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(
//                     currentPage * PAGE_SIZE,
//                     filteredRecords.length,
//                   )}`}{" "}
//                 of {filteredRecords.length}
//               </span>

//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() => setPage(1)}
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronsLeft size={18} />
//                 </button>

//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() =>
//                     setPage((value) => Math.max(1, value - 1))
//                   }
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>

//                 <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-blue-700">
//                   {currentPage}
//                 </span>

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setPage((value) =>
//                       Math.min(totalPages, value + 1),
//                     )
//                   }
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronRight size={18} />
//                 </button>

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setPage(totalPages)}
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronsRight size={18} />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Attrition Report Detail                                                     */
// /* -------------------------------------------------------------------------- */

// type AttritionReportDetailProps = {
//   title: string;
//   monthsToShow: number;
//   year: string;
//   onYearChange: (value: string) => void;
//   isYearOpen: boolean;
//   onToggleYearOpen: () => void;
//   onCloseYear: () => void;
//   onBack: () => void;
//   searchText: string;
//   onSearchChange: (value: string) => void;
//   branchFilter: string[];
//   onBranchFilterChange: (values: string[]) => void;
//   salaryStructureFilter: string[];
//   onSalaryStructureFilterChange: (values: string[]) => void;
//   leaveFilter: string[];
//   onLeaveFilterChange: (values: string[]) => void;
//   attendanceFilter: string[];
//   onAttendanceFilterChange: (values: string[]) => void;
//   designationFilter: string[];
//   onDesignationFilterChange: (values: string[]) => void;
//   empStatusFilter: string[];
//   onEmpStatusFilterChange: (values: string[]) => void;
//   onClearFilters: () => void;
// };

// function AttritionReportDetail({
//   title,
//   monthsToShow,
//   year,
//   onYearChange,
//   isYearOpen,
//   onToggleYearOpen,
//   onCloseYear,
//   onBack,
//   searchText,
//   onSearchChange,
//   branchFilter,
//   onBranchFilterChange,
//   salaryStructureFilter,
//   onSalaryStructureFilterChange,
//   leaveFilter,
//   onLeaveFilterChange,
//   attendanceFilter,
//   onAttendanceFilterChange,
//   designationFilter,
//   onDesignationFilterChange,
//   empStatusFilter,
//   onEmpStatusFilterChange,
//   onClearFilters,
// }: AttritionReportDetailProps) {
//   const visibleMonthLabels = ATTRITION_MONTH_LABELS.slice(0, monthsToShow);

//   const sumMonths = (values: Array<number | null>) =>
//     Math.round(
//       values
//         .slice(0, monthsToShow)
//         .reduce((sum: number, value) => sum + (value ?? 0), 0) * 100,
//     ) / 100;

//   const visible = (values: Array<number | null>) =>
//     values.slice(0, monthsToShow);

//   return (
//     <div className="mt-3">
//       {/* Header row: title / back / year / export icons */}
//       <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
//         <h2 className="border-b-4 border-[#2699e8] pb-2 text-base font-semibold text-[#2699e8]">
//           {title}
//         </h2>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             onClick={onBack}
//             className="flex items-center gap-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             <ChevronLeft size={16} />
//             Back
//           </button>

//           <YearDropdown
//             year={year}
//             onYearChange={onYearChange}
//             isOpen={isYearOpen}
//             onToggleOpen={onToggleYearOpen}
//             onClose={onCloseYear}
//           />

//           <button
//             type="button"
//             title="Export to PDF"
//             className="rounded-md p-2 text-red-600 hover:bg-red-50"
//           >
//             <FileText size={26} />
//           </button>

//           <button
//             type="button"
//             title="Export to Excel"
//             className="rounded-md p-2 text-green-700 hover:bg-green-50"
//           >
//             <FileSpreadsheet size={26} />
//           </button>
//         </div>
//       </div>

//       {/* Filter bar */}
//       <div className="mt-3 w-full min-w-0 overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 bg-white p-2">
//         <div className="flex w-max min-w-full flex-nowrap items-center gap-2 overflow-visible pb-2">
//           <div className="relative w-[200px] shrink-0">
//           <Search
//             size={20}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             type="text"
//             value={searchText}
//             onChange={(event) => onSearchChange(event.target.value)}
//             placeholder="Start Typing..."
//             className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
//           />
//         </div>

//         <button
//           type="button"
//           className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
//         >
//           <Plus size={18} />
//           Add Filter
//         </button>

//         <AttritionQueryFilter />

//         <CheckboxDropdownFilter
//           label="Branch"
//           options={ATTRITION_BRANCH_OPTIONS}
//           selected={branchFilter}
//           onChange={onBranchFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Salary Structure"
//           options={ATTRITION_SALARY_STRUCTURE_OPTIONS}
//           selected={salaryStructureFilter}
//           onChange={onSalaryStructureFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Leave"
//           options={ATTRITION_LEAVE_OPTIONS}
//           selected={leaveFilter}
//           onChange={onLeaveFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Attendance"
//           options={ATTRITION_ATTENDANCE_OPTIONS}
//           selected={attendanceFilter}
//           onChange={onAttendanceFilterChange}
//           showSearch={false}
//         />

//         <CheckboxDropdownFilter
//           label="Designation"
//           options={ATTRITION_DESIGNATION_OPTIONS}
//           selected={designationFilter}
//           onChange={onDesignationFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Emp Status"
//           options={ATTRITION_EMP_STATUS_OPTIONS}
//           selected={empStatusFilter}
//           onChange={onEmpStatusFilterChange}
//           showSearch={false}
//         />

//         <button
//           type="button"
//           title="More options"
//           aria-label="More options"
//           className="shrink-0 rounded-md p-2 text-gray-500 hover:bg-gray-50"
//         >
//           <MoreVertical size={20} />
//         </button>

//         <button
//           type="button"
//           onClick={onClearFilters}
//           className="shrink-0 rounded-md p-2 text-red-500 hover:bg-red-50"
//           title="Clear filters"
//         >
//           <X size={22} />
//         </button>
//           </div>
//         </div>

//       {/* Attrition Calendar table */}
//       <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
//         <table
//           className="w-full border-collapse text-left text-sm"
//           style={{ minWidth: `${360 + monthsToShow * 110}px` }}
//         >
//           <thead>
//             <tr>
//               <th
//                 colSpan={monthsToShow + 2}
//                 className="bg-[#dceafb] px-4 py-3 text-center text-base font-bold text-[#d0342c]"
//               >
//                 ATTRITION CALENDAR
//               </th>
//             </tr>

//             <tr className="text-gray-700">
//               <th className="w-[200px] px-4 py-3 font-medium sm:w-[260px]">
//                 As on date
//               </th>

//               {visibleMonthLabels.map((label) => (
//                 <th
//                   key={label}
//                   className="px-4 py-3 text-right font-medium"
//                 >
//                   {label}
//                 </th>
//               ))}

//               <th className="px-4 py-3 text-right font-semibold">
//                 Total
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {ATTRITION_TOTAL_STRENGTH.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={monthsToShow + 2}
//                   className="px-4 py-10 text-center"
//                 >
//                   <img
//                     src={contactImage}
//                     alt="No data available"
//                     className="mx-auto h-24 w-24 object-contain"
//                   />
//                 </td>
//               </tr>
//             ) : (
//               <>
//             <AttritionRow
//               label="Total strength of Employees"
//               values={visible(ATTRITION_TOTAL_STRENGTH)}
//               total={sumMonths(ATTRITION_TOTAL_STRENGTH)}
//               bold
//             />

//             <AttritionSectionRow label="Attrition details:" monthsToShow={monthsToShow} />

//             <AttritionRow
//               label="Resigned"
//               values={visible(ATTRITION_RESIGNED)}
//               total={sumMonths(ATTRITION_RESIGNED)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Absconding"
//               values={visible(ATTRITION_ABSCONDING)}
//               total={sumMonths(ATTRITION_ABSCONDING)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Termination"
//               values={visible(ATTRITION_TERMINATION)}
//               total={sumMonths(ATTRITION_TERMINATION)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Total Attrition"
//               values={visible(ATTRITION_TOTAL)}
//               total={sumMonths(ATTRITION_TOTAL)}
//               indent
//               highlight
//               labelColor="text-[#8a6d1a]"
//             />

//             <AttritionSectionRow label="Recruitment" monthsToShow={monthsToShow} />

//             <AttritionRow
//               label="Total recruitment"
//               values={visible(ATTRITION_RECRUITMENT)}
//               total={sumMonths(ATTRITION_RECRUITMENT)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionSectionRow label="Transfers" monthsToShow={monthsToShow} />

//             <AttritionRow
//               label="Transferred to Other branch/ unit"
//               values={visible(ATTRITION_TRANSFERRED_OUT)}
//               total={sumMonths(ATTRITION_TRANSFERRED_OUT)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Joined the team by transfer"
//               values={visible(ATTRITION_JOINED_BY_TRANSFER)}
//               total={sumMonths(ATTRITION_JOINED_BY_TRANSFER)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Total Employees on last day of the month"
//               values={visible(ATTRITION_TOTAL_EMP_LAST_DAY)}
//               total={sumMonths(ATTRITION_TOTAL_EMP_LAST_DAY)}
//               indent
//               highlight
//               labelColor="text-[#8a6d1a]"
//             />

//             <AttritionRow
//               label="Attrition %age - Month Wise"
//               values={visible(ATTRITION_PERCENTAGE)}
//               total={sumMonths(ATTRITION_PERCENTAGE)}
//               indent
//               highlight
//               labelColor="text-[#8a6d1a]"
//             />
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Attrition line chart */}
//       <div className="mt-4 rounded-lg border border-gray-200 p-4">
//         <AttritionChart
//           months={ATTRITION_CHART_MONTHS}
//           values={ATTRITION_CHART_VALUES}
//         />
//       </div>
//     </div>
//   );
// }

// type AttritionRowProps = {
//   label: string;
//   values: Array<number | null>;
//   total: number;
//   bold?: boolean;
//   indent?: boolean;
//   highlight?: boolean;
//   labelColor?: string;
// };

// function AttritionRow({
//   label,
//   values,
//   total,
//   bold,
//   indent,
//   highlight,
//   labelColor,
// }: AttritionRowProps) {
//   return (
//     <tr className={highlight ? "bg-[#fdf6db]" : "bg-white"}>
//       <td
//         className={`px-4 py-3 ${indent ? "pl-10" : ""} ${bold ? "font-semibold text-[#102c49]" : labelColor ?? "text-gray-700"
//           }`}
//       >
//         {label}
//       </td>

//       {values.map((value, index) => (
//         <td
//           key={`${label}-${ATTRITION_MONTH_SHORT[index]}`}
//           className={`px-4 py-3 text-right ${bold ? "font-semibold text-[#102c49]" : "text-gray-800"
//             }`}
//         >
//           {value === null ? "" : value}
//         </td>
//       ))}

//       <td
//         className={`px-4 py-3 text-right font-semibold ${bold ? "text-[#102c49]" : "text-gray-800"
//           }`}
//       >
//         {total}
//       </td>
//     </tr>
//   );
// }

// type YearDropdownProps = {
//   year: string;
//   onYearChange: (value: string) => void;
//   isOpen: boolean;
//   onToggleOpen: () => void;
//   onClose: () => void;
// };

// function YearDropdown({
//   year,
//   onYearChange,
//   isOpen,
//   onToggleOpen,
//   onClose,
// }: YearDropdownProps) {
//   const { wrapperRef, buttonRef, coords } = useDropdownPosition(
//     isOpen,
//     onClose,
//     140,
//   );

//   return (
//     <div ref={wrapperRef} className="relative shrink-0">
//       <button
//         ref={buttonRef}
//         type="button"
//         onClick={onToggleOpen}
//         className="flex w-[140px] items-center justify-between rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//       >
//         {year}
//         <ChevronDown size={16} />
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: coords.top,
//             left: coords.left,
//             width: 140,
//           }}
//           className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
//         >
//           {ATTRITION_YEAR_OPTIONS.map((option) => (
//             <button
//               key={option}
//               type="button"
//               onClick={() => {
//                 onYearChange(option);
//                 onClose();
//               }}
//               className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 ${option === year ? "bg-[#eaf4ff]" : ""
//                 }`}
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function AttritionQueryFilter() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [queryText, setQueryText] = useState("");
//   const containerRef = useDropdownPosition(isOpen, () => setIsOpen(false), 192);

//   return (
//     <div ref={containerRef.wrapperRef} className="relative shrink-0">
//       <button
//         ref={containerRef.buttonRef}
//         type="button"
//         onClick={() => setIsOpen((value) => !value)}
//         className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
//       >
//         Query
//         <ChevronDown size={16} />
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: containerRef.coords.top,
//             left: containerRef.coords.left,
//             width: 192,
//           }}
//           className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
//         >
//           <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
//             Query
//           </div>

//           <div className="p-3">
//             <input
//               type="text"
//               value={queryText}
//               onChange={(event) => setQueryText(event.target.value)}
//               placeholder="Enter query"
//               className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setQueryText("");
//               setIsOpen(false);
//             }}
//             className="flex w-full items-center gap-2 border-t border-gray-200 px-3 py-3 text-sm text-gray-400 hover:bg-gray-50"
//           >
//             <X size={16} />
//             Clear
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function AttritionSectionRow({
//   label,
//   monthsToShow,
// }: {
//   label: string;
//   monthsToShow: number;
// }) {
//   return (
//     <tr className="bg-[#eef2f8]">
//       <td
//         colSpan={monthsToShow + 2}
//         className="px-4 py-3 font-semibold text-[#102c49]"
//       >
//         {label}
//       </td>
//     </tr>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Attrition Chart (plain SVG, no extra dependencies)                          */
// /* -------------------------------------------------------------------------- */

// type AttritionChartProps = {
//   months: string[];
//   values: number[];
// };

// function AttritionChart({ months, values }: AttritionChartProps) {
//   const width = 1000;
//   const height = 300;

//   const paddingLeft = 40;
//   const paddingRight = 20;
//   const paddingTop = 10;
//   const paddingBottom = 40;

//   const chartWidth = width - paddingLeft - paddingRight;
//   const chartHeight = height - paddingTop - paddingBottom;

//   const yTicks = [0, 3, 6, 9, 12];
//   const yMax = 12;

//   if (values.length === 0) {
//     return (
//       <div className="flex min-h-[220px] items-center justify-center">
//         <img
//           src={contactImage}
//           alt="No data available"
//           className="h-24 w-24 object-contain"
//         />
//       </div>
//     );
//   }

//   const points = values.map((value, index) => {
//     const x =
//       paddingLeft +
//       (index / Math.max(1, values.length - 1)) * chartWidth;

//     const y =
//       paddingTop + chartHeight - (value / yMax) * chartHeight;

//     return { x, y };
//   });

//   const linePath = points
//     .map((point, index) =>
//       index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
//     )
//     .join(" ");

//   const areaPath = `${linePath} L ${points[points.length - 1].x
//     } ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight
//     } Z`;

//   return (
//     <div>
//       <div className="flex items-center gap-2 pl-2 text-xs font-medium text-gray-600">
//         <span
//           className="-rotate-90"
//           style={{ writingMode: "vertical-rl" }}
//         >
//           Total Attrition
//         </span>
//       </div>

//       <svg
//         viewBox={`0 0 ${width} ${height}`}
//         className="w-full"
//         preserveAspectRatio="none"
//       >
//         {/* Gridlines + y-axis labels */}
//         {yTicks.map((tick) => {
//           const y =
//             paddingTop + chartHeight - (tick / yMax) * chartHeight;

//           return (
//             <g key={tick}>
//               <line
//                 x1={paddingLeft}
//                 x2={width - paddingRight}
//                 y1={y}
//                 y2={y}
//                 stroke="#e5e7eb"
//                 strokeWidth={1}
//               />

//               <text
//                 x={paddingLeft - 10}
//                 y={y + 4}
//                 textAnchor="end"
//                 fontSize={12}
//                 fill="#6b7280"
//               >
//                 {tick}
//               </text>
//             </g>
//           );
//         })}

//         {/* Area + line */}
//         <path d={areaPath} fill="#2699e8" fillOpacity={0.08} />
//         <path d={linePath} fill="none" stroke="#2699e8" strokeWidth={3} />

//         {/* X-axis labels */}
//         {months.map((month, index) => {
//           const x =
//             paddingLeft +
//             (index / Math.max(1, months.length - 1)) * chartWidth;

//           return (
//             <text
//               key={month}
//               x={x}
//               y={height - paddingBottom + 20}
//               textAnchor="middle"
//               fontSize={12}
//               fill="#6b7280"
//             >
//               {month}
//             </text>
//           );
//         })}
//       </svg>

//       <div className="text-center text-xs font-medium text-gray-600">
//         Month
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Work Flow Status Component                                                  */
// /* -------------------------------------------------------------------------- */

// function WorkFlowStatus() {
//   const [searchText, setSearchText] = useState("");

//   const [groupFilter, setGroupFilter] = useState<string[]>([]);
//   const [workflowNameFilter, setWorkflowNameFilter] = useState<string[]>(
//     [],
//   );
//   const [approverFilter, setApproverFilter] = useState<string[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string[]>([]);
//   const [selectedModule, setSelectedModule] = useState("");

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const fromDatePicker = useDateField(fromDate, setFromDate);
//   const toDatePicker = useDateField(toDate, setToDate);

//   const [page, setPage] = useState(1);

//   const pageSize = 10;

//   const filteredRecords = useMemo(() => {
//     const searchValue = searchText.toLowerCase().trim();

//     return WORKFLOW_RECORDS.filter((record) => {
//       const matchesSearch =
//         !searchValue ||
//         Object.values(record).some((value) =>
//           value.toLowerCase().includes(searchValue),
//         );

//       const matchesGroup =
//         groupFilter.length === 0 ||
//         groupFilter.includes(
//           record.groupName.toLowerCase().replaceAll(" ", "-"),
//         );

//       const matchesWorkflowName =
//         workflowNameFilter.length === 0 ||
//         workflowNameFilter.includes(
//           record.workflowName.toLowerCase().replaceAll(" ", "-"),
//         );

//       const matchesApprover =
//         approverFilter.length === 0 ||
//         approverFilter.includes(
//           record.approverName.toLowerCase().replaceAll(" ", "-"),
//         );

//       const matchesStatus =
//         statusFilter.length === 0 ||
//         statusFilter.includes(record.wfStatus.toLowerCase());

//       return (
//         matchesSearch &&
//         matchesGroup &&
//         matchesWorkflowName &&
//         matchesApprover &&
//         matchesStatus
//       );
//     });
//   }, [
//     searchText,
//     groupFilter,
//     workflowNameFilter,
//     approverFilter,
//     statusFilter,
//   ]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredRecords.length / pageSize),
//   );

//   const currentPage = Math.min(page, totalPages);

//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   const handleExportWorkflow = () => {
//     const headers = [
//       "Emp.ID / Name",
//       "WF Name",
//       "Group Name",
//       "No. Of Leaves",
//       "Submitted Date",
//       "Applied Date",
//       "Approved Date",
//       "WF Level",
//       "Approver Name",
//       "WF Status",
//       "Leave Reason",
//       "Remarks",
//     ];

//     const rows = filteredRecords.map((record) => [
//       `${record.employeeId} ${record.employeeName}`,
//       record.workflowName,
//       record.groupName,
//       record.noOfLeaves,
//       record.submittedDate,
//       record.appliedDate,
//       record.approvedDate,
//       record.wfLevel,
//       record.approverName,
//       record.wfStatus,
//       record.leaveReason,
//       record.remarks,
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) =>
//         row
//           .map((value) => `"${value.replaceAll('"', '""')}"`)
//           .join(","),
//       )
//       .join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "workflow-status.csv";
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   const clearWorkflowFilters = () => {
//     setSearchText("");
//     setGroupFilter([]);
//     setWorkflowNameFilter([]);
//     setApproverFilter([]);
//     setStatusFilter([]);
//     setFromDate("");
//     setToDate("");
//     setPage(1);
//   };

//   return (
//     <div className="mt-4 overflow-hidden rounded-xl border border-[#e1e5eb] bg-white shadow-sm">
//       {/* Top workflow filters */}
//       <div className="flex w-full min-w-0 flex-nowrap items-end gap-3 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible border-b border-[#e5e8ed] px-4 py-3">
//        <div className="w-[290px] shrink-0">
//   <label className="mb-1 block text-sm font-medium text-gray-700">
//     Module
//   </label>

//   <select
//     value={selectedModule}
//     onChange={(event) => {
//       setSelectedModule(event.target.value);
//       setPage(1);
//     }}
//     className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
//   >
//     <option value="">Select Module</option>
//     <option value="all">All</option>
//     <option value="leave-apply-ess">Leave Apply (ESS)</option>
//     <option value="on-boarding-hrms">On Boarding (HRMS)</option>
//     <option value="employee-profile-ess">
//       Employee Profile (ESS)
//     </option>
//     <option value="punches-ess">Punches (ESS)</option>
//     <option value="face-template-punches-ess">
//       Face Template - Punches (ESS)
//     </option>
//   </select>
// </div>

//         <div className="w-[155px] shrink-0">
//           <label className="mb-1 block text-xs font-medium text-[#26364d]">
//             From Date<span className="text-red-500">*</span>
//           </label>

//           <DatePicker {...fromDatePicker} />
//         </div>

//         <div className="w-[155px] shrink-0">
//           <label className="mb-1 block text-xs font-medium text-[#26364d]">
//             To Date<span className="text-red-500">*</span>
//           </label>

//           <DatePicker {...toDatePicker} />
//         </div>

//         <div className="ml-auto flex items-center gap-2">
//           <button
//             type="button"
//             onClick={handleExportWorkflow}
//             title="Export to Excel"
//             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
//           >
//             <FileSpreadsheet size={21} />
//           </button>

//           <button
//             type="button"
//             title="Filter"
//             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#8d9ab8] transition hover:bg-blue-50"
//           >
//             <Filter size={21} />
//           </button>
//         </div>
//       </div>

//       {/* Search and workflow filters */}
//       <div className="flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible border-b border-[#e5e8ed] px-4 py-3">
//         <div className="relative w-[220px] shrink-0">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9ab8]"
//           />

//           <input
//             type="text"
//             value={searchText}
//             onChange={(event) => {
//               setSearchText(event.target.value);
//               setPage(1);
//             }}
//             placeholder="Start Typing..."
//             className="h-10 w-full rounded-lg border-0 bg-white py-2 pl-10 pr-3 text-xs text-[#26364d] outline-none placeholder:text-[#9aa5b5] focus:ring-1 focus:ring-[#dce8f5]"
//           />
//         </div>

//         <button
//           type="button"
//           className="flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium text-[#26364d] transition hover:bg-[#f5f8fb]"
//         >
//           <Plus size={16} />
//           Add Filter
//         </button>

//         <CheckboxDropdownFilter
//           label="WF Name"
//           options={WORKFLOW_NAME_OPTIONS}
//           selected={workflowNameFilter}
//           onChange={(values) => {
//             setWorkflowNameFilter(values);
//             setPage(1);
//           }}
//         />

//         <CheckboxDropdownFilter
//           label="Group Name"
//           options={WORKFLOW_GROUP_OPTIONS}
//           selected={groupFilter}
//           onChange={(values) => {
//             setGroupFilter(values);
//             setPage(1);
//           }}
//         />

//         <CheckboxDropdownFilter
//           label="Approver Name"
//           options={APPROVER_OPTIONS}
//           selected={approverFilter}
//           onChange={(values) => {
//             setApproverFilter(values);
//             setPage(1);
//           }}
//         />

//         <CheckboxDropdownFilter
//           label="WF Status"
//           options={WORKFLOW_STATUS_OPTIONS}
//           selected={statusFilter}
//           onChange={(values) => {
//             setStatusFilter(values);
//             setPage(1);
//           }}
//           showSearch={false}
//         />

//         <button
//           type="button"
//           onClick={clearWorkflowFilters}
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
//           title="Clear filters"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {/* Workflow table */}
//       <div className="overflow-x-auto bg-white px-3 py-3">
//         <table className="w-full min-w-[1500px] border-separate border-spacing-y-2 text-left">
//           <thead>
//             <tr className="bg-[#f1f3f6] text-xs font-semibold text-[#26364d]">
//               <th className="rounded-l-lg px-3 py-3">
//                 Emp.ID / Name
//               </th>
//               <th className="px-3 py-3">WF Name</th>
//               <th className="px-3 py-3">Group Name</th>
//               <th className="px-3 py-3">No. Of Leaves</th>
//               <th className="px-3 py-3">Submitted Date</th>
//               <th className="px-3 py-3">Applied Date</th>
//               <th className="px-3 py-3">Approved Date</th>
//               <th className="px-3 py-3">WF Level</th>
//               <th className="px-3 py-3">Approver Name</th>
//               <th className="px-3 py-3">WF Status</th>
//               <th className="px-3 py-3">Leave Reason</th>
//               <th className="rounded-r-lg px-3 py-3">
//                 Remarks
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {visibleRecords.map((record, index) => (
//               <tr
//                 key={`${record.employeeId}-${record.submittedDate}-${index}`}
//                 className={`text-xs text-[#26364d] ${index % 2 === 0 ? "bg-white" : "bg-[#f3f5f7]"
//                   }`}
//               >
//                 <td className="rounded-l-lg px-3 py-4">
//                   <div className="flex flex-col gap-1">
//                     <span className="w-fit rounded bg-[#eef2f7] px-2 py-1 font-semibold">
//                       {record.employeeId}
//                     </span>

//                     <span className="font-semibold leading-4">
//                       {record.employeeName}
//                     </span>
//                   </div>
//                 </td>

//                 <td className="px-3 py-4 font-semibold">
//                   {record.workflowName}
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.groupName}
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.noOfLeaves}
//                 </td>

//                 <td className="whitespace-nowrap px-3 py-4">
//                   {record.submittedDate}
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.appliedDate}
//                 </td>

//                 <td className="whitespace-nowrap px-3 py-4">
//                   {record.approvedDate}
//                 </td>

//                 <td className="px-3 py-4">
//                   <span className="inline-flex rounded-full bg-[#49a9e8] px-4 py-2 font-semibold text-white">
//                     {record.wfLevel}
//                   </span>
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.approverName}
//                 </td>

//                 <td className="px-3 py-4">
//                   <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f5ea] px-3 py-2 font-semibold text-[#3d9153]">
//                     <span className="text-[10px]">●</span>
//                     {record.wfStatus}
//                   </span>
//                 </td>

//                 <td className="max-w-[180px] px-3 py-4">
//                   {record.leaveReason}
//                 </td>

//                 <td className="rounded-r-lg px-3 py-4">
//                   {record.remarks}
//                 </td>
//               </tr>
//             ))}

//             {visibleRecords.length === 0 && (
//               <tr>
//                 <td colSpan={12} className="px-4 py-10">
//                   <div className="flex min-h-[180px] items-center justify-center sm:min-h-[220px] md:min-h-[260px]">
//                     <img
//                       src={contactImage}
//                       alt="No data available"
//                       className="h-auto w-[120px] object-contain sm:w-[150px] md:w-[180px] lg:w-[200px]"
//                     />
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Workflow pagination */}
//       <div className="flex flex-wrap items-center justify-end gap-5 border-t border-[#edf0f4] px-4 py-3 text-xs text-[#26364d]">
//         <div className="flex items-center gap-2">
//           <span>Rows per page</span>
//           <span>10</span>
//           <ChevronDown size={14} />
//         </div>

//         <span>
//           {visibleRecords.length === 0
//             ? "0"
//             : `${(currentPage - 1) * pageSize + 1} to ${Math.min(
//               currentPage * pageSize,
//               filteredRecords.length,
//             )}`}{" "}
//           of {filteredRecords.length}
//         </span>

//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() => setPage(1)}
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronsLeft size={17} />
//           </button>

//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() =>
//               setPage((value) => Math.max(1, value - 1))
//             }
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronLeft size={17} />
//           </button>

//           <span className="rounded-md bg-[#8b4b3b] px-3 py-1.5 text-white">
//             {currentPage}
//           </span>

//           <button
//             type="button"
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setPage((value) => Math.min(totalPages, value + 1))
//             }
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronRight size={17} />
//           </button>

//           <button
//             type="button"
//             disabled={currentPage === totalPages}
//             onClick={() => setPage(totalPages)}
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronsRight size={17} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


// import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
// import {
//   ChevronDown,
//   ChevronsLeft,
//   ChevronsRight,
//   ChevronLeft,
//   ChevronRight,
//   FileSpreadsheet,
//   FileText,
//   Search,
//   Filter,
//   X,
//   Plus,
//   MoreVertical,
//   Clock,
//   Eye
// } from "lucide-react";

// import {
//   Activity,
//   BarChart3,
//   Download,
// } from "lucide-react";
// import DatePicker, {
//   type DatePickerCell,
// } from "@/components/ui/datepicker";
// import CheckboxDropdownFilter from "../pages/CheckboxDropdownFilter";
// import contactImage from "../../../../assets/images/contactimage.png";

// type FilterOption = {
//   label: string;
//   value: string;
// };

// function parseDDMMYYYY(value: string): Date | null {
//   const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
//   if (!match) return null;

//   const [, dd, mm, yyyy] = match;
//   const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

//   if (
//     date.getFullYear() !== Number(yyyy) ||
//     date.getMonth() !== Number(mm) - 1 ||
//     date.getDate() !== Number(dd)
//   ) {
//     return null;
//   }

//   return date;
// }

// function toISO(date: Date): string {
//   const yyyy = date.getFullYear();
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const dd = String(date.getDate()).padStart(2, "0");
//   return `${yyyy}-${mm}-${dd}`;
// }

// function formatDDMMYYYY(date: Date): string {
//   const dd = String(date.getDate()).padStart(2, "0");
//   const mm = String(date.getMonth() + 1).padStart(2, "0");
//   const yyyy = date.getFullYear();
//   return `${dd}-${mm}-${yyyy}`;
// }

// function useDateField(value: string, onChange: (value: string) => void) {
//   const [text, setText] = useState(value);
//   const [open, setOpen] = useState(false);
//   const [isInvalid, setIsInvalid] = useState(false);
//   const [viewDate, setViewDate] = useState<Date>(
//     () => parseDDMMYYYY(value) ?? new Date(),
//   );

//   // Keep local text/view in sync if the value is changed from outside.
//   useMemo(() => {
//     setText(value);
//     const parsed = parseDDMMYYYY(value);
//     if (parsed) setViewDate(parsed);
//   }, [value]);

//   const monthLabel = viewDate.toLocaleString("en-US", {
//     month: "long",
//     year: "numeric",
//   });

//   const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

//   const cells: DatePickerCell[] = useMemo(() => {
//     const year = viewDate.getFullYear();
//     const month = viewDate.getMonth();
//     const firstOfMonth = new Date(year, month, 1);
//     const startOffset = firstOfMonth.getDay();
//     const start = new Date(year, month, 1 - startOffset);

//     const selected = parseDDMMYYYY(value);
//     const selectedIso = selected ? toISO(selected) : "";

//     return Array.from({ length: 42 }, (_, index) => {
//       const date = new Date(start);
//       date.setDate(start.getDate() + index);
//       const iso = toISO(date);

//       return {
//         iso,
//         day: date.getDate(),
//         inMonth: date.getMonth() === month,
//         disabled: false,
//         selected: iso === selectedIso,
//       };
//     });
//   }, [viewDate, value]);

//   const onTextChange = (raw: string) => {
//     setText(raw);
//     setIsInvalid(false);
//   };

//   const onBlur = () => {
//     if (text.trim() === "") {
//       onChange("");
//       setIsInvalid(false);
//       return;
//     }

//     const parsed = parseDDMMYYYY(text);

//     if (!parsed) {
//       setIsInvalid(true);
//       return;
//     }

//     setIsInvalid(false);
//     onChange(text.trim());
//     setViewDate(parsed);
//   };

//   const onSelectDay = (iso: string) => {
//     const [yyyy, mm, dd] = iso.split("-");
//     const formatted = `${dd}-${mm}-${yyyy}`;
//     onChange(formatted);
//     setText(formatted);
//     setIsInvalid(false);
//     setOpen(false);
//   };

//   const onPrevMonth = () => {
//     setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
//   };

//   const onNextMonth = () => {
//     setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
//   };

//   const onClear = () => {
//     onChange("");
//     setText("");
//     setIsInvalid(false);
//     setOpen(false);
//   };

//   const onToday = () => {
//     const today = new Date();
//     const formatted = formatDDMMYYYY(today);
//     onChange(formatted);
//     setText(formatted);
//     setViewDate(today);
//     setIsInvalid(false);
//     setOpen(false);
//   };

//   return {
//     text,
//     onTextChange,
//     onBlur,
//     isInvalid,
//     open,
//     onOpenChange: setOpen,
//     monthLabel,
//     weekdayLabels,
//     cells,
//     onSelectDay,
//     onPrevMonth,
//     onNextMonth,
//     onClear,
//     onToday,
//   };
// }

// function useDropdownPosition(
//   open: boolean,
//   onClose: () => void,
//   panelWidth = 224,
// ) {
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const buttonRef = useRef<HTMLButtonElement>(null);
//   const [coords, setCoords] = useState({ top: 0, left: 0 });

//   const reposition = () => {
//     const btn = buttonRef.current;
//     if (!btn) return;

//     const rect = btn.getBoundingClientRect();
//     const margin = 8;

//     let left = rect.left;
//     const maxLeft = window.innerWidth - margin - panelWidth;
//     if (left > maxLeft) left = Math.max(margin, maxLeft);
//     if (left < margin) left = margin;

//     let top = rect.bottom + 4;
//     const estimatedHeight = 260;
//     if (top + estimatedHeight > window.innerHeight - margin) {
//       const flippedTop = rect.top - 4 - estimatedHeight;
//       top = flippedTop > margin ? flippedTop : margin;
//     }

//     setCoords({ top, left });
//   };

//   useLayoutEffect(() => {
//     if (!open) return;
//     reposition();
//   }, [open]);

//   useEffect(() => {
//     if (!open) return;

//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         wrapperRef.current &&
//         !wrapperRef.current.contains(event.target as Node)
//       ) {
//         onClose();
//       }
//     };

//     const handleReposition = () => reposition();

//     document.addEventListener("mousedown", handleClickOutside);
//     window.addEventListener("resize", handleReposition);
//     window.addEventListener("scroll", handleReposition, true);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       window.removeEventListener("resize", handleReposition);
//       window.removeEventListener("scroll", handleReposition, true);
//     };
//   }, [open, onClose]);

//   return { wrapperRef, buttonRef, coords };
// }

// /* -------------------------------------------------------------------------- */
// /* Existing Audit Trail Filters                                               */
// /* -------------------------------------------------------------------------- */

// const MODULE_OPTIONS: FilterOption[] = [
//   { label: "Config", value: "config" },
//   { label: "On Board", value: "on-board" },
//   { label: "T&A", value: "t-and-a" },
//   { label: "Salary", value: "salary" },
//   { label: "Approval", value: "approval" },
//   { label: "Reports", value: "reports" },
//   { label: "Group Of Company", value: "group-of-company" },
// ];

// const EMPLOYEE_OPTIONS: FilterOption[] = [
//   {
//     label: "Anusha Mavellapalli",
//     value: "anusha-mavellapalli",
//   },
//   {
//     label: "Chandra Shekar Saka",
//     value: "chandra-shekar-saka",
//   },
//   {
//     label: "Nikhitha Narala",
//     value: "nikhitha-narala",
//   },
//   {
//     label: "Rohith Kumar Karkonda",
//     value: "rohith-kumar-karkonda",
//   },
//   {
//     label: "Praveen Kumar Yadav Arva",
//     value: "praveen-kumar-yadav-arva",
//   },
//   {
//     label: "Shamsh Tabrez Mohammed",
//     value: "shamsh-tabrez-mohammed",
//   },
//   {
//     label: "Rakesh Peddi",
//     value: "rakesh-peddi",
//   },
//   {
//     label: "Ishika Santosh Mokati",
//     value: "ishika-santosh-mokati",
//   },
//   {
//     label: "Rama Veera Manikanta Pusunuri",
//     value: "rama-veera-manikanta-pusunuri",
//   },
//   {
//     label: "Umar Sharief Shaik",
//     value: "umar-sharief-shaik",
//   },
// ];

// const PAGE_OPTIONS: FilterOption[] = [];

// const ACTION_OPTIONS: FilterOption[] = [
//   { label: "Record Created", value: "record-created" },
//   { label: "Record Updated", value: "record-updated" },
//   { label: "Record Deleted", value: "record-deleted" },
// ];

// /* -------------------------------------------------------------------------- */
// /* Existing Audit Trail Data                                                   */
// /* -------------------------------------------------------------------------- */

// type AuditRecord = {
//   pageDetails: string;
//   recordDetails: string;
//   recordChanges: string;
//   actionTime: string;
//   user: string;
//   employeeName: string;
// };

// const AUDIT_RECORDS: AuditRecord[] = [];

// const PAGE_SIZE = 50;

// /* -------------------------------------------------------------------------- */
// /* Work Flow Status Data                                                       */
// /* -------------------------------------------------------------------------- */

// type WorkflowStatus = "Approved" | "Cancelled" | "Pending" | "Rejected";

// type WorkflowRecord = {
//   employeeId: string;
//   employeeName: string;
//   workflowName: string;
//   groupName: string;
//   noOfLeaves: string;
//   submittedDate: string;
//   appliedDate: string;
//   approvedDate: string;
//   wfLevel: string;
//   approverName: string;
//   wfStatus: WorkflowStatus;
//   leaveReason: string;
//   remarks: string;
// };

// const WORKFLOW_RECORDS: WorkflowRecord[] = [];

// const WORKFLOW_GROUP_OPTIONS: FilterOption[] = [
//   {
//     label: "Casual Leave",
//     value: "casual-leave",
//   },
//   {
//     label: "Loss of Pay",
//     value: "loss-of-pay",
//   },
//   {
//     label: "Medical Wellness Leave.",
//     value: "medical-wellness-leave",
//   },
//   {
//     label: "Restricted Holiday",
//     value: "restricted-holiday",
//   },
//   {
//     label: "Sick Leave",
//     value: "sick-leave",
//   },
// ];

// const WORKFLOW_NAME_OPTIONS: FilterOption[] = [
//   {
//     label: "Leave Apply RA Level 1",
//     value: "leave-apply-ra-level-1",
//   },
// ];

// const APPROVER_OPTIONS: FilterOption[] = [
//   {
//     label: "BHAGYARAJA AVURAPALLI",
//     value: "bhagyaraja-avurapalli",
//   },
//   {
//     label: "Daniel Raju Ravi",
//     value: "daniel-raju-ravi",
//   },
//   {
//     label: "Mohd Zeeshan",
//     value: "mohd-zeeshan",
//   },
//   {
//     label: "RAJESH UBBAPALLY",
//     value: "rajesh-ubbapally",
//   },
//   {
//     label: "Surekha Jonna",
//     value: "surekha-jonna",
//   },
//   {
//     label: "Venkata Ramana Kalaga",
//     value: "venkata-ramana-kalaga",
//   },
// ];

// const WORKFLOW_STATUS_OPTIONS: FilterOption[] = [
//   {
//     label: "Approved",
//     value: "approved",
//   },
//   {
//     label: "Cancelled",
//     value: "cancelled",
//   },
//   {
//     label: "Pending",
//     value: "pending",
//   },
//   {
//     label: "Rejected",
//     value: "rejected",
//   },
// ];

// /* -------------------------------------------------------------------------- */
// /* Attrition Report Data                                                       */
// /* -------------------------------------------------------------------------- */

// const ATTRITION_YEAR_OPTIONS = ["2026-2027", "2025-2026", "2024-2025"];

// const ATTRITION_MONTH_LABELS = [
//   "Apr/2026",
//   "May/2026",
//   "Jun/2026",
//   "Jul/2026",
//   "Aug/2026",
//   "Sep/2026",
// ];

// const ATTRITION_MONTH_SHORT = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

// const ATTRITION_TOTAL_STRENGTH = [];
// const ATTRITION_TOTAL_STRENGTH_SUM = 0;

// const ATTRITION_RESIGNED = [];
// const ATTRITION_RESIGNED_SUM = 0;

// const ATTRITION_ABSCONDING = [];
// const ATTRITION_ABSCONDING_SUM = 0;

// const ATTRITION_TERMINATION = [];
// const ATTRITION_TERMINATION_SUM = 0;

// const ATTRITION_TOTAL = [11, 3, 1, 0, 0, 0];
// const ATTRITION_TOTAL_SUM = 0;

// const ATTRITION_RECRUITMENT = [];
// const ATTRITION_RECRUITMENT_SUM = 0;

// const ATTRITION_TRANSFERRED_OUT = [];
// const ATTRITION_TRANSFERRED_OUT_SUM = 0;

// const ATTRITION_JOINED_BY_TRANSFER = [];
// const ATTRITION_JOINED_BY_TRANSFER_SUM = 0;

// const ATTRITION_TOTAL_EMP_LAST_DAY = [];
// const ATTRITION_TOTAL_EMP_LAST_DAY_SUM = 0;

// const ATTRITION_PERCENTAGE: Array<number | null> = [];
// const ATTRITION_PERCENTAGE_SUM = 0;

// const ATTRITION_CHART_MONTHS = [
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
//   "Jan",
//   "Feb",
//   "Mar",
// ];

// const ATTRITION_CHART_VALUES = [];

// const ATTRITION_BRANCH_OPTIONS: FilterOption[] = [
//   {
//     label: "Koundinyasa Technology Services Pvt. Ltd.",
//     value: "koundinyasa-technology-services-pvt-ltd",
//   },
// ];

// const ATTRITION_SALARY_STRUCTURE_OPTIONS: FilterOption[] = [
//   { label: "CTC Salary Structure", value: "ctc-salary-structure" },
//   { label: "New Salary Structure", value: "new-salary-structure" },
//   { label: "Salary structure", value: "salary-structure" },
//   { label: "Test Structure", value: "test-structure" },
//   { label: "Test Structure 2", value: "test-structure-2" },
//   { label: "TEST3", value: "test3" },
// ];

// const ATTRITION_LEAVE_OPTIONS: FilterOption[] = [
//   { label: "Employee Leave Policy", value: "employee-leave-policy" },
//   { label: "Intern Leave Policy", value: "intern-leave-policy" },
// ];

// const ATTRITION_ATTENDANCE_OPTIONS: FilterOption[] = [
//   { label: "Daily", value: "daily" },
// ];

// const ATTRITION_DESIGNATION_OPTIONS: FilterOption[] = [
//   {
//     label: "ASSOCIATE SOFTWARE ENGINEER",
//     value: "associate-software-engineer",
//   },
//   {
//     label: "BUSSINESS DEVELOPMENT EXECUTIVE",
//     value: "bussiness-development-executive",
//   },
//   {
//     label: "BUSSINESS DEVELOPMENT MANAGER",
//     value: "bussiness-development-manager",
//   },
//   { label: "Cloud DevOps Engineer", value: "cloud-devops-engineer" },
//   { label: "Data Analyst", value: "data-analyst" },
//   { label: "Devops Engineer", value: "devops-engineer" },
//   { label: "Flutter Developer", value: "flutter-developer" },
//   { label: "HR EXECUTIVE", value: "hr-executive" },
//   { label: "HR MANAGER", value: "hr-manager" },
//   { label: "HR RECRUITER", value: "hr-recruiter" },
//   { label: "OFFICE BOY", value: "office-boy" },
//   { label: "PROJECT LEAD", value: "project-lead" },
//   { label: "PROJECT MANAGER", value: "project-manager" },
//   { label: "Quality Analyst", value: "quality-analyst" },
//   { label: "React Developer", value: "react-developer" },
// ];

// const ATTRITION_EMP_STATUS_OPTIONS: FilterOption[] = [
//   { label: "Current Employees", value: "current-employees" },
//   { label: "Left Employees", value: "left-employees" },
// ];

// /* -------------------------------------------------------------------------- */
// /* Main Page                                                                   */
// /* -------------------------------------------------------------------------- */

// export default function OthersPage() {
//   const [activeTab, setActiveTab] = useState("Audit Trail");

//   const [searchText, setSearchText] = useState("");
//   const [fromDate, setFromDate] = useState("25-07-2026");
//   const [toDate, setToDate] = useState("02-09-2026");

//   const fromDatePicker = useDateField(fromDate, setFromDate);
//   const toDatePicker = useDateField(toDate, setToDate);

//   const [moduleFilter, setModuleFilter] = useState<string[]>([]);
//   const [employeeFilter, setEmployeeFilter] = useState<string[]>([]);
//   const [pageFilter, setPageFilter] = useState<string[]>([]);
//   const [actionFilter, setActionFilter] = useState<string[]>([]);

//   const [page, setPage] = useState(1);

//   // Attrition Report drill-down state
//   const [attritionView, setAttritionView] = useState<"menu" | "detail">(
//     "menu",
//   );
//   const [attritionReportTitle, setAttritionReportTitle] = useState(
//     "Attrition Report",
//   );
//   const [attritionYear, setAttritionYear] = useState("2026-2027");
//   const [isAttritionYearOpen, setIsAttritionYearOpen] = useState(false);
//   const [attritionSearchText, setAttritionSearchText] = useState("");
//   const [attritionBranchFilter, setAttritionBranchFilter] = useState<
//     string[]
//   >([]);
//   const [attritionSalaryStructureFilter, setAttritionSalaryStructureFilter] =
//     useState<string[]>([]);
//   const [attritionLeaveFilter, setAttritionLeaveFilter] = useState<
//     string[]
//   >([]);
//   const [attritionAttendanceFilter, setAttritionAttendanceFilter] =
//     useState<string[]>([]);
//   const [attritionDesignationFilter, setAttritionDesignationFilter] =
//     useState<string[]>([]);
//   const [attritionEmpStatusFilter, setAttritionEmpStatusFilter] = useState<
//     string[]
//   >([]);

//   const isAuditTrail = activeTab === "Audit Trail";

//   const isAuditTrailForImport =
//     activeTab === "Audit Trail For Import";

//   const isWorkFlowStatus = activeTab === "Work Flow Status";

//   const isAttritionReport = activeTab === "Attrition Report";

//   const filteredRecords = useMemo(() => {
//     const searchValue = searchText.toLowerCase().trim();

//     if (!searchValue) {
//       return AUDIT_RECORDS;
//     }

//     return AUDIT_RECORDS.filter((record) =>
//       Object.values(record).some((value) =>
//         value.toLowerCase().includes(searchValue),
//       ),
//     );
//   }, [searchText]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredRecords.length / PAGE_SIZE),
//   );

//   const currentPage = Math.min(page, totalPages);

//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * PAGE_SIZE,
//     currentPage * PAGE_SIZE,
//   );

//   const handleSearch = (value: string) => {
//     setSearchText(value);
//     setPage(1);
//   };

//   const handleExport = () => {
//     const headers = [
//       "Page Details",
//       "Record Details",
//       "Record Changes",
//       "Action Time",
//       "User",
//       "Employee Name",
//     ];

//     const rows = filteredRecords.map((record) => [
//       record.pageDetails,
//       record.recordDetails,
//       record.recordChanges,
//       record.actionTime,
//       record.user,
//       record.employeeName,
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) =>
//         row
//           .map((value) => `"${value.replaceAll('"', '""')}"`)
//           .join(","),
//       )
//       .join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "audit-trail.csv";
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   const openAttritionDetail = (title: string) => {
//     setAttritionReportTitle(title);
//     setAttritionView("detail");
//   };

//   const closeAttritionDetail = () => {
//     setAttritionView("menu");
//   };

//   const clearAttritionFilters = () => {
//     setAttritionSearchText("");
//     setAttritionBranchFilter([]);
//     setAttritionSalaryStructureFilter([]);
//     setAttritionLeaveFilter([]);
//     setAttritionAttendanceFilter([]);
//     setAttritionDesignationFilter([]);
//     setAttritionEmpStatusFilter([]);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#f4f8fe] p-4">
//       <div className="rounded-xl bg-white p-4 shadow-sm">
//         {/* Top tabs */}
//         <div className="rounded-xl border border-[#c96f58] bg-[#fff8f5] p-2">
//   <div className="flex w-full items-center gap-2 overflow-visible max-[768px]:overflow-x-auto">
//     {[
//       {
//         label: "Audit Trail",
//         icon: <Clock size={15} />,
//       },
//       {
//         label: "Audit Trail For Import",
//         icon: <Download size={15} />,
//       },
//       {
//         label: "Work Flow Status",
//         icon: <Activity size={15} />,
//       },
//       {
//         label: "Attrition Report",
//         icon: <BarChart3 size={15} />,
//       },
//     ].map((tab) => (
//       <button
//         key={tab.label}
//         type="button"
//         onClick={() => {
//           setActiveTab(tab.label);
//           setPage(1);

//           if (tab.label === "Attrition Report") {
//             setAttritionView("menu");
//           }
//         }}
//         className={`flex h-10 min-w-fit flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-xs font-medium transition ${activeTab === tab.label
//           ? "border-[#b85c45] bg-white text-[#984936]"
//           : "border-[#d6d9df] bg-white text-[#26364d] hover:border-[#b85c45] hover:text-[#984936]"
//           }`}
//       >
//         {tab.icon}
//         <span>{tab.label}</span>
//       </button>
//     ))}

//     {!isWorkFlowStatus &&
//       !(isAttritionReport && attritionView === "detail") && (
//         <button
//           type="button"
//           onClick={handleExport}
//           title="Export to Excel"
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
//         >
//           <FileSpreadsheet size={20} />
//         </button>
//       )}
//   </div>
// </div>

//         {/* Audit Trail For Import - unchanged */}
//         {isAuditTrailForImport && (
//           <>
//             <div className="mt-3 flex items-center gap-4 rounded-lg border border-[#f1e4c2] bg-[#fffaf0] px-5 py-4 text-[#8a7444]">
//               <span className="text-2xl text-[#e7c85c]">⚠</span>

//               <span className="text-base">
//                 Select any module to list the data in the audit trail for
//                 import.
//               </span>
//             </div>

//             <div className="mt-4 flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 bg-white px-4 py-3">
//               <CheckboxDropdownFilter
//                 label="Module"
//                 options={MODULE_OPTIONS}
//                 selected={moduleFilter}
//                 onChange={setModuleFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Employee"
//                 options={EMPLOYEE_OPTIONS}
//                 selected={employeeFilter}
//                 onChange={setEmployeeFilter}
//               />

//               <div className="relative w-[240px] shrink-0 sm:w-[310px]">
//                 <Search
//                   size={20}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   placeholder="Search RefNo or Empname..."
//                   className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
//                 />
//               </div>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...fromDatePicker} />
//               </div>

//               <span className="shrink-0 text-sm font-medium text-gray-700">
//                 To
//               </span>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...toDatePicker} />
//               </div>
//             </div>

//             {/* Same image for Audit Trail For Import */}
//             <div className="flex min-h-[520px] items-center justify-center">
//               <img
//                 src={contactImage}
//                 alt="Audit Trail For Import"
//                 className="max-h-[430px] w-auto object-contain"
//               />
//             </div>
//           </>
//         )}

//         {/* Work Flow Status - new UI */}
//         {isWorkFlowStatus && <WorkFlowStatus />}

//         {/* Attrition Report - menu of tiles, OR the detailed report */}
//         {isAttritionReport && attritionView === "menu" && (
//           <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-[780px]">
//             <button
//               type="button"
//               onClick={() => openAttritionDetail("Attrition Report")}
//               className="w-full overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
//             >
//               <div className="bg-[#e8edf5] px-4 py-3">
//                 <h2 className="text-base font-semibold text-[#102c49]">
//                   Attrition Report
//                 </h2>
//               </div>

//               <div className="px-4 py-4">
//                 <p className="text-sm text-gray-600">
//                   Attrition Report
//                 </p>
//               </div>
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 openAttritionDetail("Attrition Report(Quarterly)")
//               }
//               className="w-full overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
//             >
//               <div className="bg-[#e8edf5] px-4 py-3">
//                 <h2 className="text-base font-semibold text-[#102c49]">
//                   Attrition Report(Quarterly)
//                 </h2>
//               </div>

//               <div className="px-4 py-4">
//                 <p className="text-sm text-gray-600">
//                   Attrition Report(Quarterly)
//                 </p>
//               </div>
//             </button>
//           </div>
//         )}

//         {isAttritionReport && attritionView === "detail" && (
//           <AttritionReportDetail
//             title={attritionReportTitle}
//             monthsToShow={
//               attritionReportTitle.includes("Quarterly") ? 3 : 6
//             }
//             year={attritionYear}
//             onYearChange={setAttritionYear}
//             isYearOpen={isAttritionYearOpen}
//             onToggleYearOpen={() =>
//               setIsAttritionYearOpen((value) => !value)
//             }
//             onCloseYear={() => setIsAttritionYearOpen(false)}
//             onBack={closeAttritionDetail}
//             searchText={attritionSearchText}
//             onSearchChange={setAttritionSearchText}
//             branchFilter={attritionBranchFilter}
//             onBranchFilterChange={setAttritionBranchFilter}
//             salaryStructureFilter={attritionSalaryStructureFilter}
//             onSalaryStructureFilterChange={setAttritionSalaryStructureFilter}
//             leaveFilter={attritionLeaveFilter}
//             onLeaveFilterChange={setAttritionLeaveFilter}
//             attendanceFilter={attritionAttendanceFilter}
//             onAttendanceFilterChange={setAttritionAttendanceFilter}
//             designationFilter={attritionDesignationFilter}
//             onDesignationFilterChange={setAttritionDesignationFilter}
//             empStatusFilter={attritionEmpStatusFilter}
//             onEmpStatusFilterChange={setAttritionEmpStatusFilter}
//             onClearFilters={clearAttritionFilters}
//           />
//         )}

//         {/* Original Audit Trail UI - unchanged */}
//         {isAuditTrail && (
//           <>
//             <div className="mt-3 flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 bg-white p-2">
//               <div className="relative w-[220px] shrink-0">
//                 <Search
//                   size={20}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />

//                 <input
//                   type="text"
//                   value={searchText}
//                   onChange={(event) =>
//                     handleSearch(event.target.value)
//                   }
//                   placeholder="Start Typing..."
//                   className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
//                 />
//               </div>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...fromDatePicker} />
//               </div>

//               <span className="shrink-0 text-sm font-medium text-gray-700">
//                 To
//               </span>

//               <div className="w-[170px] shrink-0">
//                 <DatePicker {...toDatePicker} />
//               </div>

//               <CheckboxDropdownFilter
//                 label="Module"
//                 options={MODULE_OPTIONS}
//                 selected={moduleFilter}
//                 onChange={setModuleFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Employee"
//                 options={EMPLOYEE_OPTIONS}
//                 selected={employeeFilter}
//                 onChange={setEmployeeFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Page"
//                 options={PAGE_OPTIONS}
//                 selected={pageFilter}
//                 onChange={setPageFilter}
//               />

//               <CheckboxDropdownFilter
//                 label="Action"
//                 options={ACTION_OPTIONS}
//                 selected={actionFilter}
//                 onChange={setActionFilter}
//                 showSearch={false}
//               />
//             </div>

//             <div className="overflow-x-auto rounded-xl border border-[#cfd6df] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
//               <table className="w-full min-w-[900px] border-collapse text-left">
//                 <thead>
//                   <tr className="bg-white text-xs font-semibold text-[#26364d]">
//                     <th className="px-3 py-3 text-left">
//                       Page Details
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       Record Details
//                     </th>

//                     <th className="px-3 py-3 text-center">
//                       Record Changes
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       Action Time
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       User
//                     </th>

//                     <th className="px-3 py-3 text-left">
//                       Employee Name
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {visibleRecords.map((record, index) => (
//                     <tr
//                       key={`${record.pageDetails}-${index}`}
//                       className="border-b border-[#e5e7eb] bg-white text-[11px] text-[#26364d] transition hover:bg-[#f8fafc]"
//                     >
//                       <td className="rounded-l-lg px-4 py-4">
//                         {record.pageDetails}
//                       </td>

//                       <td className="px-4 py-4">
//                         {record.recordDetails}
//                       </td>

//                       <td className="px-3 py-4">
//                         <div className="flex items-center justify-center">
//                           <Eye
//                             size={17}
//                             strokeWidth={2}
//                             className="text-[#26364d]"
//                           />
//                         </div>
//                       </td>

//                       <td className="whitespace-nowrap px-4 py-4">
//                         {record.actionTime}
//                       </td>

//                       <td className="px-4 py-4">
//                         {record.user}
//                       </td>

//                       <td className="rounded-r-lg px-4 py-4">
//                         {record.employeeName}
//                       </td>
//                     </tr>
//                   ))}

//                   {visibleRecords.length === 0 && (
//                     <tr>
//                       <td colSpan={6} className="px-4 py-10">
//                         <div className="flex min-h-[180px] items-center justify-center sm:min-h-[220px] md:min-h-[260px]">
//                           <img
//                             src={contactImage}
//                             alt="No data available"
//                             className="h-auto w-[120px] object-contain sm:w-[150px] md:w-[180px] lg:w-[200px]"
//                           />
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             <div className="mt-4 flex flex-wrap items-center justify-end gap-5 text-sm text-gray-700">
//               <div className="flex items-center gap-2">
//                 <span>Rows per page</span>
//                 <span>50</span>
//                 <ChevronDown size={16} />
//               </div>

//               <span>
//                 {visibleRecords.length === 0
//                   ? "0"
//                   : `${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(
//                     currentPage * PAGE_SIZE,
//                     filteredRecords.length,
//                   )}`}{" "}
//                 of {filteredRecords.length}
//               </span>

//               <div className="flex items-center gap-3">
//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() => setPage(1)}
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronsLeft size={18} />
//                 </button>

//                 <button
//                   type="button"
//                   disabled={currentPage === 1}
//                   onClick={() =>
//                     setPage((value) => Math.max(1, value - 1))
//                   }
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronLeft size={18} />
//                 </button>

//                 <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-blue-700">
//                   {currentPage}
//                 </span>

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() =>
//                     setPage((value) =>
//                       Math.min(totalPages, value + 1),
//                     )
//                   }
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronRight size={18} />
//                 </button>

//                 <button
//                   type="button"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setPage(totalPages)}
//                   className="disabled:cursor-not-allowed disabled:text-gray-300"
//                 >
//                   <ChevronsRight size={18} />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Attrition Report Detail                                                     */
// /* -------------------------------------------------------------------------- */

// type AttritionReportDetailProps = {
//   title: string;
//   monthsToShow: number;
//   year: string;
//   onYearChange: (value: string) => void;
//   isYearOpen: boolean;
//   onToggleYearOpen: () => void;
//   onCloseYear: () => void;
//   onBack: () => void;
//   searchText: string;
//   onSearchChange: (value: string) => void;
//   branchFilter: string[];
//   onBranchFilterChange: (values: string[]) => void;
//   salaryStructureFilter: string[];
//   onSalaryStructureFilterChange: (values: string[]) => void;
//   leaveFilter: string[];
//   onLeaveFilterChange: (values: string[]) => void;
//   attendanceFilter: string[];
//   onAttendanceFilterChange: (values: string[]) => void;
//   designationFilter: string[];
//   onDesignationFilterChange: (values: string[]) => void;
//   empStatusFilter: string[];
//   onEmpStatusFilterChange: (values: string[]) => void;
//   onClearFilters: () => void;
// };

// function AttritionReportDetail({
//   title,
//   monthsToShow,
//   year,
//   onYearChange,
//   isYearOpen,
//   onToggleYearOpen,
//   onCloseYear,
//   onBack,
//   searchText,
//   onSearchChange,
//   branchFilter,
//   onBranchFilterChange,
//   salaryStructureFilter,
//   onSalaryStructureFilterChange,
//   leaveFilter,
//   onLeaveFilterChange,
//   attendanceFilter,
//   onAttendanceFilterChange,
//   designationFilter,
//   onDesignationFilterChange,
//   empStatusFilter,
//   onEmpStatusFilterChange,
//   onClearFilters,
// }: AttritionReportDetailProps) {
//   const visibleMonthLabels = ATTRITION_MONTH_LABELS.slice(0, monthsToShow);

//   const sumMonths = (values: Array<number | null>) =>
//     Math.round(
//       values
//         .slice(0, monthsToShow)
//         .reduce((sum: number, value) => sum + (value ?? 0), 0) * 100,
//     ) / 100;

//   const visible = (values: Array<number | null>) =>
//     values.slice(0, monthsToShow);

//   return (
//     <div className="mt-3">
//       {/* Header row: title / back / year / export icons */}
//       <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
//         <h2 className="border-b-4 border-[#2699e8] pb-2 text-base font-semibold text-[#2699e8]">
//           {title}
//         </h2>

//         <div className="flex flex-wrap items-center gap-3">
//           <button
//             type="button"
//             onClick={onBack}
//             className="flex items-center gap-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
//           >
//             <ChevronLeft size={16} />
//             Back
//           </button>

//           <YearDropdown
//             year={year}
//             onYearChange={onYearChange}
//             isOpen={isYearOpen}
//             onToggleOpen={onToggleYearOpen}
//             onClose={onCloseYear}
//           />

//           <button
//             type="button"
//             title="Export to PDF"
//             className="rounded-md p-2 text-red-600 hover:bg-red-50"
//           >
//             <FileText size={26} />
//           </button>

//           <button
//             type="button"
//             title="Export to Excel"
//             className="rounded-md p-2 text-green-700 hover:bg-green-50"
//           >
//             <FileSpreadsheet size={26} />
//           </button>
//         </div>
//       </div>

//       {/* Filter bar */}
//       <div className="mt-3 flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible rounded-lg border border-gray-200 bg-white p-2">
//         <div className="relative w-[200px] shrink-0">
//           <Search
//             size={20}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             type="text"
//             value={searchText}
//             onChange={(event) => onSearchChange(event.target.value)}
//             placeholder="Start Typing..."
//             className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
//           />
//         </div>

//         <button
//           type="button"
//           className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
//         >
//           <Plus size={18} />
//           Add Filter
//         </button>

//         <AttritionQueryFilter />

//         <CheckboxDropdownFilter
//           label="Branch"
//           options={ATTRITION_BRANCH_OPTIONS}
//           selected={branchFilter}
//           onChange={onBranchFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Salary Structure"
//           options={ATTRITION_SALARY_STRUCTURE_OPTIONS}
//           selected={salaryStructureFilter}
//           onChange={onSalaryStructureFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Leave"
//           options={ATTRITION_LEAVE_OPTIONS}
//           selected={leaveFilter}
//           onChange={onLeaveFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Attendance"
//           options={ATTRITION_ATTENDANCE_OPTIONS}
//           selected={attendanceFilter}
//           onChange={onAttendanceFilterChange}
//           showSearch={false}
//         />

//         <CheckboxDropdownFilter
//           label="Designation"
//           options={ATTRITION_DESIGNATION_OPTIONS}
//           selected={designationFilter}
//           onChange={onDesignationFilterChange}
//         />

//         <CheckboxDropdownFilter
//           label="Emp Status"
//           options={ATTRITION_EMP_STATUS_OPTIONS}
//           selected={empStatusFilter}
//           onChange={onEmpStatusFilterChange}
//           showSearch={false}
//         />

//         <button
//           type="button"
//           title="More options"
//           aria-label="More options"
//           className="shrink-0 rounded-md p-2 text-gray-500 hover:bg-gray-50"
//         >
//           <MoreVertical size={20} />
//         </button>

//         <button
//           type="button"
//           onClick={onClearFilters}
//           className="shrink-0 rounded-md p-2 text-red-500 hover:bg-red-50"
//           title="Clear filters"
//         >
//           <X size={22} />
//         </button>
//       </div>

//       {/* Attrition Calendar table */}
//       <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
//         <table
//           className="w-full border-collapse text-left text-sm"
//           style={{ minWidth: `${360 + monthsToShow * 110}px` }}
//         >
//           <thead>
//             <tr>
//               <th
//                 colSpan={monthsToShow + 2}
//                 className="bg-[#dceafb] px-4 py-3 text-center text-base font-bold text-[#d0342c]"
//               >
//                 ATTRITION CALENDAR
//               </th>
//             </tr>

//             <tr className="text-gray-700">
//               <th className="w-[200px] px-4 py-3 font-medium sm:w-[260px]">
//                 As on date
//               </th>

//               {visibleMonthLabels.map((label) => (
//                 <th
//                   key={label}
//                   className="px-4 py-3 text-right font-medium"
//                 >
//                   {label}
//                 </th>
//               ))}

//               <th className="px-4 py-3 text-right font-semibold">
//                 Total
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {ATTRITION_TOTAL_STRENGTH.length === 0 ? (
//               <tr>
//                 <td
//                   colSpan={monthsToShow + 2}
//                   className="px-4 py-10 text-center"
//                 >
//                   <img
//                     src={contactImage}
//                     alt="No data available"
//                     className="mx-auto h-24 w-24 object-contain"
//                   />
//                 </td>
//               </tr>
//             ) : (
//               <>
//             <AttritionRow
//               label="Total strength of Employees"
//               values={visible(ATTRITION_TOTAL_STRENGTH)}
//               total={sumMonths(ATTRITION_TOTAL_STRENGTH)}
//               bold
//             />

//             <AttritionSectionRow label="Attrition details:" monthsToShow={monthsToShow} />

//             <AttritionRow
//               label="Resigned"
//               values={visible(ATTRITION_RESIGNED)}
//               total={sumMonths(ATTRITION_RESIGNED)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Absconding"
//               values={visible(ATTRITION_ABSCONDING)}
//               total={sumMonths(ATTRITION_ABSCONDING)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Termination"
//               values={visible(ATTRITION_TERMINATION)}
//               total={sumMonths(ATTRITION_TERMINATION)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Total Attrition"
//               values={visible(ATTRITION_TOTAL)}
//               total={sumMonths(ATTRITION_TOTAL)}
//               indent
//               highlight
//               labelColor="text-[#8a6d1a]"
//             />

//             <AttritionSectionRow label="Recruitment" monthsToShow={monthsToShow} />

//             <AttritionRow
//               label="Total recruitment"
//               values={visible(ATTRITION_RECRUITMENT)}
//               total={sumMonths(ATTRITION_RECRUITMENT)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionSectionRow label="Transfers" monthsToShow={monthsToShow} />

//             <AttritionRow
//               label="Transferred to Other branch/ unit"
//               values={visible(ATTRITION_TRANSFERRED_OUT)}
//               total={sumMonths(ATTRITION_TRANSFERRED_OUT)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Joined the team by transfer"
//               values={visible(ATTRITION_JOINED_BY_TRANSFER)}
//               total={sumMonths(ATTRITION_JOINED_BY_TRANSFER)}
//               indent
//               labelColor="text-[#b0473f]"
//             />

//             <AttritionRow
//               label="Total Employees on last day of the month"
//               values={visible(ATTRITION_TOTAL_EMP_LAST_DAY)}
//               total={sumMonths(ATTRITION_TOTAL_EMP_LAST_DAY)}
//               indent
//               highlight
//               labelColor="text-[#8a6d1a]"
//             />

//             <AttritionRow
//               label="Attrition %age - Month Wise"
//               values={visible(ATTRITION_PERCENTAGE)}
//               total={sumMonths(ATTRITION_PERCENTAGE)}
//               indent
//               highlight
//               labelColor="text-[#8a6d1a]"
//             />
//               </>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Attrition line chart */}
//       <div className="mt-4 rounded-lg border border-gray-200 p-4">
//         <AttritionChart
//           months={ATTRITION_CHART_MONTHS}
//           values={ATTRITION_CHART_VALUES}
//         />
//       </div>
//     </div>
//   );
// }

// type AttritionRowProps = {
//   label: string;
//   values: Array<number | null>;
//   total: number;
//   bold?: boolean;
//   indent?: boolean;
//   highlight?: boolean;
//   labelColor?: string;
// };

// function AttritionRow({
//   label,
//   values,
//   total,
//   bold,
//   indent,
//   highlight,
//   labelColor,
// }: AttritionRowProps) {
//   return (
//     <tr className={highlight ? "bg-[#fdf6db]" : "bg-white"}>
//       <td
//         className={`px-4 py-3 ${indent ? "pl-10" : ""} ${bold ? "font-semibold text-[#102c49]" : labelColor ?? "text-gray-700"
//           }`}
//       >
//         {label}
//       </td>

//       {values.map((value, index) => (
//         <td
//           key={`${label}-${ATTRITION_MONTH_SHORT[index]}`}
//           className={`px-4 py-3 text-right ${bold ? "font-semibold text-[#102c49]" : "text-gray-800"
//             }`}
//         >
//           {value === null ? "" : value}
//         </td>
//       ))}

//       <td
//         className={`px-4 py-3 text-right font-semibold ${bold ? "text-[#102c49]" : "text-gray-800"
//           }`}
//       >
//         {total}
//       </td>
//     </tr>
//   );
// }

// type YearDropdownProps = {
//   year: string;
//   onYearChange: (value: string) => void;
//   isOpen: boolean;
//   onToggleOpen: () => void;
//   onClose: () => void;
// };

// function YearDropdown({
//   year,
//   onYearChange,
//   isOpen,
//   onToggleOpen,
//   onClose,
// }: YearDropdownProps) {
//   const { wrapperRef, buttonRef, coords } = useDropdownPosition(
//     isOpen,
//     onClose,
//     140,
//   );

//   return (
//     <div ref={wrapperRef} className="relative shrink-0">
//       <button
//         ref={buttonRef}
//         type="button"
//         onClick={onToggleOpen}
//         className="flex w-[140px] items-center justify-between rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
//       >
//         {year}
//         <ChevronDown size={16} />
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: coords.top,
//             left: coords.left,
//             width: 140,
//           }}
//           className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
//         >
//           {ATTRITION_YEAR_OPTIONS.map((option) => (
//             <button
//               key={option}
//               type="button"
//               onClick={() => {
//                 onYearChange(option);
//                 onClose();
//               }}
//               className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 ${option === year ? "bg-[#eaf4ff]" : ""
//                 }`}
//             >
//               {option}
//             </button>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function AttritionQueryFilter() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [queryText, setQueryText] = useState("");
//   const containerRef = useDropdownPosition(isOpen, () => setIsOpen(false), 192);

//   return (
//     <div ref={containerRef.wrapperRef} className="relative shrink-0">
//       <button
//         ref={containerRef.buttonRef}
//         type="button"
//         onClick={() => setIsOpen((value) => !value)}
//         className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
//       >
//         Query
//         <ChevronDown size={16} />
//       </button>

//       {isOpen && (
//         <div
//           style={{
//             position: "fixed",
//             top: containerRef.coords.top,
//             left: containerRef.coords.left,
//             width: 192,
//           }}
//           className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
//         >
//           <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
//             Query
//           </div>

//           <div className="p-3">
//             <input
//               type="text"
//               value={queryText}
//               onChange={(event) => setQueryText(event.target.value)}
//               placeholder="Enter query"
//               className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               setQueryText("");
//               setIsOpen(false);
//             }}
//             className="flex w-full items-center gap-2 border-t border-gray-200 px-3 py-3 text-sm text-gray-400 hover:bg-gray-50"
//           >
//             <X size={16} />
//             Clear
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// function AttritionSectionRow({
//   label,
//   monthsToShow,
// }: {
//   label: string;
//   monthsToShow: number;
// }) {
//   return (
//     <tr className="bg-[#eef2f8]">
//       <td
//         colSpan={monthsToShow + 2}
//         className="px-4 py-3 font-semibold text-[#102c49]"
//       >
//         {label}
//       </td>
//     </tr>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Attrition Chart (plain SVG, no extra dependencies)                          */
// /* -------------------------------------------------------------------------- */

// type AttritionChartProps = {
//   months: string[];
//   values: number[];
// };

// function AttritionChart({ months, values }: AttritionChartProps) {
//   const width = 1000;
//   const height = 300;

//   const paddingLeft = 40;
//   const paddingRight = 20;
//   const paddingTop = 10;
//   const paddingBottom = 40;

//   const chartWidth = width - paddingLeft - paddingRight;
//   const chartHeight = height - paddingTop - paddingBottom;

//   const yTicks = [0, 3, 6, 9, 12];
//   const yMax = 12;

//   if (values.length === 0) {
//     return (
//       <div className="flex min-h-[220px] items-center justify-center">
//         <img
//           src={contactImage}
//           alt="No data available"
//           className="h-24 w-24 object-contain"
//         />
//       </div>
//     );
//   }

//   const points = values.map((value, index) => {
//     const x =
//       paddingLeft +
//       (index / Math.max(1, values.length - 1)) * chartWidth;

//     const y =
//       paddingTop + chartHeight - (value / yMax) * chartHeight;

//     return { x, y };
//   });

//   const linePath = points
//     .map((point, index) =>
//       index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
//     )
//     .join(" ");

//   const areaPath = `${linePath} L ${points[points.length - 1].x
//     } ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight
//     } Z`;

//   return (
//     <div>
//       <div className="flex items-center gap-2 pl-2 text-xs font-medium text-gray-600">
//         <span
//           className="-rotate-90"
//           style={{ writingMode: "vertical-rl" }}
//         >
//           Total Attrition
//         </span>
//       </div>

//       <svg
//         viewBox={`0 0 ${width} ${height}`}
//         className="w-full"
//         preserveAspectRatio="none"
//       >
//         {/* Gridlines + y-axis labels */}
//         {yTicks.map((tick) => {
//           const y =
//             paddingTop + chartHeight - (tick / yMax) * chartHeight;

//           return (
//             <g key={tick}>
//               <line
//                 x1={paddingLeft}
//                 x2={width - paddingRight}
//                 y1={y}
//                 y2={y}
//                 stroke="#e5e7eb"
//                 strokeWidth={1}
//               />

//               <text
//                 x={paddingLeft - 10}
//                 y={y + 4}
//                 textAnchor="end"
//                 fontSize={12}
//                 fill="#6b7280"
//               >
//                 {tick}
//               </text>
//             </g>
//           );
//         })}

//         {/* Area + line */}
//         <path d={areaPath} fill="#2699e8" fillOpacity={0.08} />
//         <path d={linePath} fill="none" stroke="#2699e8" strokeWidth={3} />

//         {/* X-axis labels */}
//         {months.map((month, index) => {
//           const x =
//             paddingLeft +
//             (index / Math.max(1, months.length - 1)) * chartWidth;

//           return (
//             <text
//               key={month}
//               x={x}
//               y={height - paddingBottom + 20}
//               textAnchor="middle"
//               fontSize={12}
//               fill="#6b7280"
//             >
//               {month}
//             </text>
//           );
//         })}
//       </svg>

//       <div className="text-center text-xs font-medium text-gray-600">
//         Month
//       </div>
//     </div>
//   );
// }

// /* -------------------------------------------------------------------------- */
// /* Work Flow Status Component                                                  */
// /* -------------------------------------------------------------------------- */

// function WorkFlowStatus() {
//   const [searchText, setSearchText] = useState("");

//   const [groupFilter, setGroupFilter] = useState<string[]>([]);
//   const [workflowNameFilter, setWorkflowNameFilter] = useState<string[]>(
//     [],
//   );
//   const [approverFilter, setApproverFilter] = useState<string[]>([]);
//   const [statusFilter, setStatusFilter] = useState<string[]>([]);
//   const [selectedModule, setSelectedModule] = useState("");

//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const fromDatePicker = useDateField(fromDate, setFromDate);
//   const toDatePicker = useDateField(toDate, setToDate);

//   const [page, setPage] = useState(1);

//   const pageSize = 10;

//   const filteredRecords = useMemo(() => {
//     const searchValue = searchText.toLowerCase().trim();

//     return WORKFLOW_RECORDS.filter((record) => {
//       const matchesSearch =
//         !searchValue ||
//         Object.values(record).some((value) =>
//           value.toLowerCase().includes(searchValue),
//         );

//       const matchesGroup =
//         groupFilter.length === 0 ||
//         groupFilter.includes(
//           record.groupName.toLowerCase().replaceAll(" ", "-"),
//         );

//       const matchesWorkflowName =
//         workflowNameFilter.length === 0 ||
//         workflowNameFilter.includes(
//           record.workflowName.toLowerCase().replaceAll(" ", "-"),
//         );

//       const matchesApprover =
//         approverFilter.length === 0 ||
//         approverFilter.includes(
//           record.approverName.toLowerCase().replaceAll(" ", "-"),
//         );

//       const matchesStatus =
//         statusFilter.length === 0 ||
//         statusFilter.includes(record.wfStatus.toLowerCase());

//       return (
//         matchesSearch &&
//         matchesGroup &&
//         matchesWorkflowName &&
//         matchesApprover &&
//         matchesStatus
//       );
//     });
//   }, [
//     searchText,
//     groupFilter,
//     workflowNameFilter,
//     approverFilter,
//     statusFilter,
//   ]);

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredRecords.length / pageSize),
//   );

//   const currentPage = Math.min(page, totalPages);

//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * pageSize,
//     currentPage * pageSize,
//   );

//   const handleExportWorkflow = () => {
//     const headers = [
//       "Emp.ID / Name",
//       "WF Name",
//       "Group Name",
//       "No. Of Leaves",
//       "Submitted Date",
//       "Applied Date",
//       "Approved Date",
//       "WF Level",
//       "Approver Name",
//       "WF Status",
//       "Leave Reason",
//       "Remarks",
//     ];

//     const rows = filteredRecords.map((record) => [
//       `${record.employeeId} ${record.employeeName}`,
//       record.workflowName,
//       record.groupName,
//       record.noOfLeaves,
//       record.submittedDate,
//       record.appliedDate,
//       record.approvedDate,
//       record.wfLevel,
//       record.approverName,
//       record.wfStatus,
//       record.leaveReason,
//       record.remarks,
//     ]);

//     const csvContent = [headers, ...rows]
//       .map((row) =>
//         row
//           .map((value) => `"${value.replaceAll('"', '""')}"`)
//           .join(","),
//       )
//       .join("\n");

//     const blob = new Blob([csvContent], {
//       type: "text/csv;charset=utf-8;",
//     });

//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");

//     link.href = url;
//     link.download = "workflow-status.csv";
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   const clearWorkflowFilters = () => {
//     setSearchText("");
//     setGroupFilter([]);
//     setWorkflowNameFilter([]);
//     setApproverFilter([]);
//     setStatusFilter([]);
//     setFromDate("");
//     setToDate("");
//     setPage(1);
//   };

//   return (
//     <div className="mt-4 overflow-hidden rounded-xl border border-[#e1e5eb] bg-white shadow-sm">
//       {/* Top workflow filters */}
//       <div className="flex w-full min-w-0 flex-nowrap items-end gap-3 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible border-b border-[#e5e8ed] px-4 py-3">
//        <div className="w-[290px] shrink-0">
//   <label className="mb-1 block text-sm font-medium text-gray-700">
//     Module
//   </label>

//   <select
//     value={selectedModule}
//     onChange={(event) => {
//       setSelectedModule(event.target.value);
//       setPage(1);
//     }}
//     className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
//   >
//     <option value="">Select Module</option>
//     <option value="all">All</option>
//     <option value="leave-apply-ess">Leave Apply (ESS)</option>
//     <option value="on-boarding-hrms">On Boarding (HRMS)</option>
//     <option value="employee-profile-ess">
//       Employee Profile (ESS)
//     </option>
//     <option value="punches-ess">Punches (ESS)</option>
//     <option value="face-template-punches-ess">
//       Face Template - Punches (ESS)
//     </option>
//   </select>
// </div>

//         <div className="w-[155px] shrink-0">
//           <label className="mb-1 block text-xs font-medium text-[#26364d]">
//             From Date<span className="text-red-500">*</span>
//           </label>

//           <DatePicker {...fromDatePicker} />
//         </div>

//         <div className="w-[155px] shrink-0">
//           <label className="mb-1 block text-xs font-medium text-[#26364d]">
//             To Date<span className="text-red-500">*</span>
//           </label>

//           <DatePicker {...toDatePicker} />
//         </div>

//         <div className="ml-auto flex items-center gap-2">
//           <button
//             type="button"
//             onClick={handleExportWorkflow}
//             title="Export to Excel"
//             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
//           >
//             <FileSpreadsheet size={21} />
//           </button>

//           <button
//             type="button"
//             title="Filter"
//             className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#8d9ab8] transition hover:bg-blue-50"
//           >
//             <Filter size={21} />
//           </button>
//         </div>
//       </div>

//       {/* Search and workflow filters */}
//       <div className="flex w-full min-w-0 flex-nowrap items-center gap-2 overflow-visible max-[768px]:overflow-x-auto overflow-y-visible border-b border-[#e5e8ed] px-4 py-3">
//         <div className="relative w-[220px] shrink-0">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9ab8]"
//           />

//           <input
//             type="text"
//             value={searchText}
//             onChange={(event) => {
//               setSearchText(event.target.value);
//               setPage(1);
//             }}
//             placeholder="Start Typing..."
//             className="h-10 w-full rounded-lg border-0 bg-white py-2 pl-10 pr-3 text-xs text-[#26364d] outline-none placeholder:text-[#9aa5b5] focus:ring-1 focus:ring-[#dce8f5]"
//           />
//         </div>

//         <button
//           type="button"
//           className="flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium text-[#26364d] transition hover:bg-[#f5f8fb]"
//         >
//           <Plus size={16} />
//           Add Filter
//         </button>

//         <CheckboxDropdownFilter
//           label="WF Name"
//           options={WORKFLOW_NAME_OPTIONS}
//           selected={workflowNameFilter}
//           onChange={(values) => {
//             setWorkflowNameFilter(values);
//             setPage(1);
//           }}
//         />

//         <CheckboxDropdownFilter
//           label="Group Name"
//           options={WORKFLOW_GROUP_OPTIONS}
//           selected={groupFilter}
//           onChange={(values) => {
//             setGroupFilter(values);
//             setPage(1);
//           }}
//         />

//         <CheckboxDropdownFilter
//           label="Approver Name"
//           options={APPROVER_OPTIONS}
//           selected={approverFilter}
//           onChange={(values) => {
//             setApproverFilter(values);
//             setPage(1);
//           }}
//         />

//         <CheckboxDropdownFilter
//           label="WF Status"
//           options={WORKFLOW_STATUS_OPTIONS}
//           selected={statusFilter}
//           onChange={(values) => {
//             setStatusFilter(values);
//             setPage(1);
//           }}
//           showSearch={false}
//         />

//         <button
//           type="button"
//           onClick={clearWorkflowFilters}
//           className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
//           title="Clear filters"
//         >
//           <X size={20} />
//         </button>
//       </div>

//       {/* Workflow table */}
//       <div className="overflow-x-auto bg-white px-3 py-3">
//         <table className="w-full min-w-[1500px] border-separate border-spacing-y-2 text-left">
//           <thead>
//             <tr className="bg-[#f1f3f6] text-xs font-semibold text-[#26364d]">
//               <th className="rounded-l-lg px-3 py-3">
//                 Emp.ID / Name
//               </th>
//               <th className="px-3 py-3">WF Name</th>
//               <th className="px-3 py-3">Group Name</th>
//               <th className="px-3 py-3">No. Of Leaves</th>
//               <th className="px-3 py-3">Submitted Date</th>
//               <th className="px-3 py-3">Applied Date</th>
//               <th className="px-3 py-3">Approved Date</th>
//               <th className="px-3 py-3">WF Level</th>
//               <th className="px-3 py-3">Approver Name</th>
//               <th className="px-3 py-3">WF Status</th>
//               <th className="px-3 py-3">Leave Reason</th>
//               <th className="rounded-r-lg px-3 py-3">
//                 Remarks
//               </th>
//             </tr>
//           </thead>

//           <tbody>
//             {visibleRecords.map((record, index) => (
//               <tr
//                 key={`${record.employeeId}-${record.submittedDate}-${index}`}
//                 className={`text-xs text-[#26364d] ${index % 2 === 0 ? "bg-white" : "bg-[#f3f5f7]"
//                   }`}
//               >
//                 <td className="rounded-l-lg px-3 py-4">
//                   <div className="flex flex-col gap-1">
//                     <span className="w-fit rounded bg-[#eef2f7] px-2 py-1 font-semibold">
//                       {record.employeeId}
//                     </span>

//                     <span className="font-semibold leading-4">
//                       {record.employeeName}
//                     </span>
//                   </div>
//                 </td>

//                 <td className="px-3 py-4 font-semibold">
//                   {record.workflowName}
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.groupName}
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.noOfLeaves}
//                 </td>

//                 <td className="whitespace-nowrap px-3 py-4">
//                   {record.submittedDate}
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.appliedDate}
//                 </td>

//                 <td className="whitespace-nowrap px-3 py-4">
//                   {record.approvedDate}
//                 </td>

//                 <td className="px-3 py-4">
//                   <span className="inline-flex rounded-full bg-[#49a9e8] px-4 py-2 font-semibold text-white">
//                     {record.wfLevel}
//                   </span>
//                 </td>

//                 <td className="px-3 py-4">
//                   {record.approverName}
//                 </td>

//                 <td className="px-3 py-4">
//                   <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f5ea] px-3 py-2 font-semibold text-[#3d9153]">
//                     <span className="text-[10px]">●</span>
//                     {record.wfStatus}
//                   </span>
//                 </td>

//                 <td className="max-w-[180px] px-3 py-4">
//                   {record.leaveReason}
//                 </td>

//                 <td className="rounded-r-lg px-3 py-4">
//                   {record.remarks}
//                 </td>
//               </tr>
//             ))}

//             {visibleRecords.length === 0 && (
//               <tr>
//                 <td colSpan={12} className="px-4 py-10">
//                   <div className="flex min-h-[180px] items-center justify-center sm:min-h-[220px] md:min-h-[260px]">
//                     <img
//                       src={contactImage}
//                       alt="No data available"
//                       className="h-auto w-[120px] object-contain sm:w-[150px] md:w-[180px] lg:w-[200px]"
//                     />
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Workflow pagination */}
//       <div className="flex flex-wrap items-center justify-end gap-5 border-t border-[#edf0f4] px-4 py-3 text-xs text-[#26364d]">
//         <div className="flex items-center gap-2">
//           <span>Rows per page</span>
//           <span>10</span>
//           <ChevronDown size={14} />
//         </div>

//         <span>
//           {visibleRecords.length === 0
//             ? "0"
//             : `${(currentPage - 1) * pageSize + 1} to ${Math.min(
//               currentPage * pageSize,
//               filteredRecords.length,
//             )}`}{" "}
//           of {filteredRecords.length}
//         </span>

//         <div className="flex items-center gap-3">
//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() => setPage(1)}
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronsLeft size={17} />
//           </button>

//           <button
//             type="button"
//             disabled={currentPage === 1}
//             onClick={() =>
//               setPage((value) => Math.max(1, value - 1))
//             }
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronLeft size={17} />
//           </button>

//           <span className="rounded-md bg-[#8b4b3b] px-3 py-1.5 text-white">
//             {currentPage}
//           </span>

//           <button
//             type="button"
//             disabled={currentPage === totalPages}
//             onClick={() =>
//               setPage((value) => Math.min(totalPages, value + 1))
//             }
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronRight size={17} />
//           </button>

//           <button
//             type="button"
//             disabled={currentPage === totalPages}
//             onClick={() => setPage(totalPages)}
//             className="disabled:cursor-not-allowed disabled:text-gray-300"
//           >
//             <ChevronsRight size={17} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Search,
  Filter,
  X,
  Plus,
  MoreVertical,
  Clock,
  Eye
} from "lucide-react";

import {
  Activity,
  BarChart3,
  Download,
} from "lucide-react";
import DatePicker, {
  type DatePickerCell,
} from "@/components/ui/datepicker";
import CheckboxDropdownFilter, { type FilterOption } from "./CheckboxDropdownFilter";

import contactImage from "../../../../assets/images/contactimage.png";


/* -------------------------------------------------------------------------- */
/* Date field hook — drives the real DatePicker component off a plain         */
/* "DD-MM-YYYY" string, the same format the rest of this page already uses.   */
/* -------------------------------------------------------------------------- */

function parseDDMMYYYY(value: string): Date | null {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!match) return null;

  const [, dd, mm, yyyy] = match;
  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));

  if (
    date.getFullYear() !== Number(yyyy) ||
    date.getMonth() !== Number(mm) - 1 ||
    date.getDate() !== Number(dd)
  ) {
    return null;
  }

  return date;
}

function toISO(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function useDateField(value: string, onChange: (value: string) => void) {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(
    () => parseDDMMYYYY(value) ?? new Date(),
  );

  // Keep local text/view in sync if the value is changed from outside.
  useMemo(() => {
    setText(value);
    const parsed = parseDDMMYYYY(value);
    if (parsed) setViewDate(parsed);
  }, [value]);

  const monthLabel = viewDate.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const weekdayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const cells: DatePickerCell[] = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startOffset = firstOfMonth.getDay();
    const start = new Date(year, month, 1 - startOffset);

    const selected = parseDDMMYYYY(value);
    const selectedIso = selected ? toISO(selected) : "";

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      const iso = toISO(date);

      return {
        iso,
        day: date.getDate(),
        inMonth: date.getMonth() === month,
        disabled: false,
        selected: iso === selectedIso,
      };
    });
  }, [viewDate, value]);

  const onTextChange = (raw: string) => {
    setText(raw);
    setIsInvalid(false);
  };

  const onBlur = () => {
    if (text.trim() === "") {
      onChange("");
      setIsInvalid(false);
      return;
    }

    const parsed = parseDDMMYYYY(text);

    if (!parsed) {
      setIsInvalid(true);
      return;
    }

    setIsInvalid(false);
    onChange(text.trim());
    setViewDate(parsed);
  };

  const onSelectDay = (iso: string) => {
    const [yyyy, mm, dd] = iso.split("-");
    const formatted = `${dd}-${mm}-${yyyy}`;
    onChange(formatted);
    setText(formatted);
    setIsInvalid(false);
    setOpen(false);
  };

  const onPrevMonth = () => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  };

  const onNextMonth = () => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  };

  const onClear = () => {
    onChange("");
    setText("");
    setIsInvalid(false);
    setOpen(false);
  };

  const onToday = () => {
    const today = new Date();
    const formatted = formatDDMMYYYY(today);
    onChange(formatted);
    setText(formatted);
    setViewDate(today);
    setIsInvalid(false);
    setOpen(false);
  };

  return {
    text,
    onTextChange,
    onBlur,
    isInvalid,
    open,
    onOpenChange: setOpen,
    monthLabel,
    weekdayLabels,
    cells,
    onSelectDay,
    onPrevMonth,
    onNextMonth,
    onClear,
    onToday,
  };
}

/* -------------------------------------------------------------------------- */
/* Shared dropdown positioning — keeps small custom dropdown panels (Query,   */
/* Year, etc.) fully on-screen the same way CheckboxDropdownFilter does.      */
/* -------------------------------------------------------------------------- */

function useDropdownPosition(
  open: boolean,
  onClose: () => void,
  panelWidth = 224,
) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const reposition = () => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const margin = 8;

    let left = rect.left;
    const maxLeft = window.innerWidth - margin - panelWidth;
    if (left > maxLeft) left = Math.max(margin, maxLeft);
    if (left < margin) left = margin;

    let top = rect.bottom + 4;
    const estimatedHeight = 260;
    if (top + estimatedHeight > window.innerHeight - margin) {
      const flippedTop = rect.top - 4 - estimatedHeight;
      top = flippedTop > margin ? flippedTop : margin;
    }

    setCoords({ top, left });
  };

  useLayoutEffect(() => {
    if (!open) return;
    reposition();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const handleReposition = () => reposition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, onClose]);

  return { wrapperRef, buttonRef, coords };
}

/* -------------------------------------------------------------------------- */
/* Existing Audit Trail Filters                                               */
/* -------------------------------------------------------------------------- */

const MODULE_OPTIONS: FilterOption[] = [
  { label: "Config", value: "config" },
  { label: "On Board", value: "on-board" },
  { label: "T&A", value: "t-and-a" },
  { label: "Salary", value: "salary" },
  { label: "Approval", value: "approval" },
  { label: "Reports", value: "reports" },
  { label: "Group Of Company", value: "group-of-company" },
];


const PAGE_OPTIONS: FilterOption[] = [];

const ACTION_OPTIONS: FilterOption[] = [
  { label: "Record Created", value: "record-created" },
  { label: "Record Updated", value: "record-updated" },
  { label: "Record Deleted", value: "record-deleted" },
];

/* -------------------------------------------------------------------------- */
/* Existing Audit Trail Data                                                   */
/* -------------------------------------------------------------------------- */

type AuditRecord = {
  pageDetails: string;
  recordDetails: string;
  recordChanges: string;
  actionTime: string;
  user: string;
  employeeName: string;
};

const AUDIT_RECORDS: AuditRecord[] = [
  {
    pageDetails: "Date-Wise Onboard (Detailed)",
    recordDetails: "Date-Wise Onboard (Detailed) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Date-Wise Onboard (Detailed)",
    recordDetails: "Date-Wise Onboard (Detailed) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Date-Wise Onboard (Summary)",
    recordDetails: "Date-Wise Onboard (Summary) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Month-Wise Onboard (Detailed)",
    recordDetails: "Month-Wise Onboard (Detailed) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Month-Wise Onboard (Summary)",
    recordDetails: "Month-Wise Onboard (Summary) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Form-11 Revised Reports",
    recordDetails:
      "Form-11 Revised - PDF Viewed-(294769) Pavankumar Reddy",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:15",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Date-Wise Onboard (Detailed)",
    recordDetails: "Date-Wise Onboard (Detailed) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Date-Wise Onboard (Detailed)",
    recordDetails: "Date-Wise Onboard (Detailed) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Date-Wise Onboard (Summary)",
    recordDetails: "Date-Wise Onboard (Summary) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Month-Wise Onboard (Detailed)",
    recordDetails: "Month-Wise Onboard (Detailed) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Month-Wise Onboard (Summary)",
    recordDetails: "Month-Wise Onboard (Summary) Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:16",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Form-11 Revised Reports",
    recordDetails:
      "Form-11 Revised - PDF Viewed-(294769) Pavankumar Reddy",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:15",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
  {
    pageDetails: "Form-11 Revised",
    recordDetails: "Form-11 Revised Viewed",
    recordChanges: "",
    actionTime: "02/Sep/2026, 3:15",
    user: "aparna.karigam@koundinyasatech.com",
    employeeName: "",
  },
];

const PAGE_SIZE = 50;

/* -------------------------------------------------------------------------- */
/* Work Flow Status Data                                                       */
/* -------------------------------------------------------------------------- */

type WorkflowStatus = "Approved" | "Cancelled" | "Pending" | "Rejected";

type WorkflowRecord = {
  employeeId: string;
  employeeName: string;
  workflowName: string;
  groupName: string;
  noOfLeaves: string;
  submittedDate: string;
  appliedDate: string;
  approvedDate: string;
  wfLevel: string;
  approverName: string;
  wfStatus: WorkflowStatus;
  leaveReason: string;
  remarks: string;
};

const WORKFLOW_RECORDS: WorkflowRecord[] = [
  {
    employeeId: "294743",
    employeeName: "Ram Bhupal Reddy Sanki",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Restricted Holiday",
    noOfLeaves: "1",
    submittedDate: "25/Jun/2026",
    appliedDate: "2026-06-26 to 2026-06-26",
    approvedDate: "25/Jun/2026",
    wfLevel: "L1",
    approverName: "Venkata Ramana Kalaga",
    wfStatus: "Approved",
    leaveReason: "Going Home town",
    remarks: "Approved",
  },
  {
    employeeId: "294743",
    employeeName: "Ram Bhupal Reddy Sanki",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Sick Leave",
    noOfLeaves: "0.5",
    submittedDate: "24/Aug/2026",
    appliedDate: "2026-08-24 to 2026-08-24",
    approvedDate: "24/Aug/2026",
    wfLevel: "L1",
    approverName: "Venkata Ramana Kalaga",
    wfStatus: "Approved",
    leaveReason: "Suffering with fever and cold",
    remarks: "NA",
  },
  {
    employeeId: "294722",
    employeeName: "Varalaxmi Gumudala",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Restricted Holiday",
    noOfLeaves: "1",
    submittedDate: "25/Jun/2026",
    appliedDate: "2026-06-26 to 2026-06-26",
    approvedDate: "25/Jun/2026",
    wfLevel: "L1",
    approverName: "BHAGYARAJA AVURAPALLI",
    wfStatus: "Approved",
    leaveReason: "NA",
    remarks: "Approved.",
  },
  {
    employeeId: "284513",
    employeeName: "Nikhitha Narala",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Sick Leave",
    noOfLeaves: "0.5",
    submittedDate: "29/Apr/2026",
    appliedDate: "2026-04-30 to 2026-04-30",
    approvedDate: "30/Apr/2026",
    wfLevel: "L1",
    approverName: "RAJESH UBBAPALLY",
    wfStatus: "Approved",
    leaveReason: "NA",
    remarks: "NA",
  },
  {
    employeeId: "284513",
    employeeName: "Nikhitha Narala",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Sick Leave",
    noOfLeaves: "0.5",
    submittedDate: "12/May/2026",
    appliedDate: "2026-05-12 to 2026-05-12",
    approvedDate: "12/May/2026",
    wfLevel: "L1",
    approverName: "RAJESH UBBAPALLY",
    wfStatus: "Approved",
    leaveReason: "NA",
    remarks: "NA",
  },
  {
    employeeId: "284513",
    employeeName: "Nikhitha Narala",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Sick Leave",
    noOfLeaves: "0.5",
    submittedDate: "13/Aug/2026",
    appliedDate: "2026-08-13 to 2026-08-13",
    approvedDate: "13/Aug/2026",
    wfLevel: "L1",
    approverName: "Surekha Jonna",
    wfStatus: "Approved",
    leaveReason:
      "I am feeling unwell and I will resume work from the afternoon.",
    remarks: "NA",
  },
  {
    employeeId: "294723",
    employeeName: "Sreya Chaluvadi",
    workflowName: "Leave Apply RA Level 1",
    groupName: "Restricted Holiday",
    noOfLeaves: "1",
    submittedDate: "25/Jun/2026",
    appliedDate: "2026-06-26 to 2026-06-26",
    approvedDate: "25/Jun/2026",
    wfLevel: "L1",
    approverName: "Venkata Ramana Kalaga",
    wfStatus: "Approved",
    leaveReason: "Going to home town",
    remarks: "Approved",
  },
];

const WORKFLOW_GROUP_OPTIONS: FilterOption[] = [
  {
    label: "Casual Leave",
    value: "casual-leave",
  },
  {
    label: "Loss of Pay",
    value: "loss-of-pay",
  },
  {
    label: "Medical Wellness Leave.",
    value: "medical-wellness-leave",
  },
  {
    label: "Restricted Holiday",
    value: "restricted-holiday",
  },
  {
    label: "Sick Leave",
    value: "sick-leave",
  },
];

const WORKFLOW_NAME_OPTIONS: FilterOption[] = [
  {
    label: "Leave Apply RA Level 1",
    value: "leave-apply-ra-level-1",
  },
];

const APPROVER_OPTIONS: FilterOption[] = [
  {
    label: "BHAGYARAJA AVURAPALLI",
    value: "bhagyaraja-avurapalli",
  },
  {
    label: "Daniel Raju Ravi",
    value: "daniel-raju-ravi",
  },
  {
    label: "Mohd Zeeshan",
    value: "mohd-zeeshan",
  },
  {
    label: "RAJESH UBBAPALLY",
    value: "rajesh-ubbapally",
  },
  {
    label: "Surekha Jonna",
    value: "surekha-jonna",
  },
  {
    label: "Venkata Ramana Kalaga",
    value: "venkata-ramana-kalaga",
  },
];

const WORKFLOW_STATUS_OPTIONS: FilterOption[] = [
  {
    label: "Approved",
    value: "approved",
  },
  {
    label: "Cancelled",
    value: "cancelled",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Rejected",
    value: "rejected",
  },
];

/* -------------------------------------------------------------------------- */
/* Attrition Report Data                                                       */
/* -------------------------------------------------------------------------- */

const ATTRITION_YEAR_OPTIONS = ["2026-2027", "2025-2026", "2024-2025"];

const ATTRITION_MONTH_LABELS = [
  "Apr/2026",
  "May/2026",
  "Jun/2026",
  "Jul/2026",
  "Aug/2026",
  "Sep/2026",
];

const ATTRITION_MONTH_SHORT = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];

const ATTRITION_TOTAL_STRENGTH = [45, 52, 89, 133, 181, 196];
const ATTRITION_TOTAL_STRENGTH_SUM = 696;

const ATTRITION_RESIGNED = [11, 3, 1, 0, 0, 0];
const ATTRITION_RESIGNED_SUM = 15;

const ATTRITION_ABSCONDING = [0, 0, 0, 0, 0, 0];
const ATTRITION_ABSCONDING_SUM = 0;

const ATTRITION_TERMINATION = [0, 0, 0, 0, 0, 0];
const ATTRITION_TERMINATION_SUM = 0;

const ATTRITION_TOTAL = [11, 3, 1, 0, 0, 0];
const ATTRITION_TOTAL_SUM = 15;

const ATTRITION_RECRUITMENT = [18, 40, 45, 48, 15, 1];
const ATTRITION_RECRUITMENT_SUM = 167;

const ATTRITION_TRANSFERRED_OUT = [0, 0, 0, 0, 0, 0];
const ATTRITION_TRANSFERRED_OUT_SUM = 0;

const ATTRITION_JOINED_BY_TRANSFER = [10, 25, 71, 88, 1, 0];
const ATTRITION_JOINED_BY_TRANSFER_SUM = 195;

const ATTRITION_TOTAL_EMP_LAST_DAY = [52, 89, 133, 181, 196, 197];
const ATTRITION_TOTAL_EMP_LAST_DAY_SUM = 848;

const ATTRITION_PERCENTAGE: Array<number | null> = [
  22.68,
  4.26,
  0.9,
  null,
  null,
  null,
];
const ATTRITION_PERCENTAGE_SUM = 27.84;

const ATTRITION_CHART_MONTHS = [
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
];

const ATTRITION_CHART_VALUES = [
  11, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

const ATTRITION_BRANCH_OPTIONS: FilterOption[] = [
  {
    label: "Koundinyasa Technology Services Pvt. Ltd.",
    value: "koundinyasa-technology-services-pvt-ltd",
  },
];

const ATTRITION_SALARY_STRUCTURE_OPTIONS: FilterOption[] = [
  { label: "CTC Salary Structure", value: "ctc-salary-structure" },
  { label: "New Salary Structure", value: "new-salary-structure" },
  { label: "Salary structure", value: "salary-structure" },
  { label: "Test Structure", value: "test-structure" },
  { label: "Test Structure 2", value: "test-structure-2" },
  { label: "TEST3", value: "test3" },
];

const ATTRITION_LEAVE_OPTIONS: FilterOption[] = [
  { label: "Employee Leave Policy", value: "employee-leave-policy" },
  { label: "Intern Leave Policy", value: "intern-leave-policy" },
];

const ATTRITION_ATTENDANCE_OPTIONS: FilterOption[] = [
  { label: "Daily", value: "daily" },
];

const ATTRITION_DESIGNATION_OPTIONS: FilterOption[] = [
  {
    label: "ASSOCIATE SOFTWARE ENGINEER",
    value: "associate-software-engineer",
  },
  {
    label: "BUSSINESS DEVELOPMENT EXECUTIVE",
    value: "bussiness-development-executive",
  },
  {
    label: "BUSSINESS DEVELOPMENT MANAGER",
    value: "bussiness-development-manager",
  },
  { label: "Cloud DevOps Engineer", value: "cloud-devops-engineer" },
  { label: "Data Analyst", value: "data-analyst" },
  { label: "Devops Engineer", value: "devops-engineer" },
  { label: "Flutter Developer", value: "flutter-developer" },
  { label: "HR EXECUTIVE", value: "hr-executive" },
  { label: "HR MANAGER", value: "hr-manager" },
  { label: "HR RECRUITER", value: "hr-recruiter" },
  { label: "OFFICE BOY", value: "office-boy" },
  { label: "PROJECT LEAD", value: "project-lead" },
  { label: "PROJECT MANAGER", value: "project-manager" },
  { label: "Quality Analyst", value: "quality-analyst" },
  { label: "React Developer", value: "react-developer" },
];

const ATTRITION_EMP_STATUS_OPTIONS: FilterOption[] = [
  { label: "Current Employees", value: "current-employees" },
  { label: "Left Employees", value: "left-employees" },
];

/* -------------------------------------------------------------------------- */
/* Main Page                                                                   */
/* -------------------------------------------------------------------------- */

export default function OthersPage() {
  const [activeTab, setActiveTab] = useState("Audit Trail");

  const [searchText, setSearchText] = useState("");
  const [fromDate, setFromDate] = useState("25-07-2026");
  const [toDate, setToDate] = useState("02-09-2026");

  const fromDatePicker = useDateField(fromDate, setFromDate);
  const toDatePicker = useDateField(toDate, setToDate);

  const [moduleFilter, setModuleFilter] = useState<string[]>([]);
  const [employeeFilter, setEmployeeFilter] = useState<string[]>([]);
  const [employeeOptions, setEmployeeOptions] =
    useState<FilterOption[]>([]);

  const handleAddEmployee = (newEmployee: FilterOption) => {
    setEmployeeOptions((previousEmployees) => {
      const alreadyExists = previousEmployees.some(
        (employee) =>
          employee.label.trim().toLowerCase() ===
            newEmployee.label.trim().toLowerCase() ||
          employee.value.trim().toLowerCase() ===
            newEmployee.value.trim().toLowerCase(),
      );

      return alreadyExists
        ? previousEmployees
        : [...previousEmployees, newEmployee];
    });
  };
  const [pageFilter, setPageFilter] = useState<string[]>([]);
  const [actionFilter, setActionFilter] = useState<string[]>([]);

  const [page, setPage] = useState(1);

  // Attrition Report drill-down state
  const [attritionView, setAttritionView] = useState<"menu" | "detail">(
    "menu",
  );
  const [attritionReportTitle, setAttritionReportTitle] = useState(
    "Attrition Report",
  );
  const [attritionYear, setAttritionYear] = useState("2026-2027");
  const [isAttritionYearOpen, setIsAttritionYearOpen] = useState(false);
  const [attritionSearchText, setAttritionSearchText] = useState("");
  const [attritionBranchFilter, setAttritionBranchFilter] = useState<
    string[]
  >([]);
  const [attritionSalaryStructureFilter, setAttritionSalaryStructureFilter] =
    useState<string[]>([]);
  const [attritionLeaveFilter, setAttritionLeaveFilter] = useState<
    string[]
  >([]);
  const [attritionAttendanceFilter, setAttritionAttendanceFilter] =
    useState<string[]>([]);
  const [attritionDesignationFilter, setAttritionDesignationFilter] =
    useState<string[]>([]);
  const [attritionEmpStatusFilter, setAttritionEmpStatusFilter] = useState<
    string[]
  >([]);

  const isAuditTrail = activeTab === "Audit Trail";

  const isAuditTrailForImport =
    activeTab === "Audit Trail For Import";

  const isWorkFlowStatus = activeTab === "Work Flow Status";

  const isAttritionReport = activeTab === "Attrition Report";

  const filteredRecords = useMemo(() => {
    const searchValue = searchText.toLowerCase().trim();

    if (!searchValue) {
      return AUDIT_RECORDS;
    }

    return AUDIT_RECORDS.filter((record) =>
      Object.values(record).some((value) =>
        value.toLowerCase().includes(searchValue),
      ),
    );
  }, [searchText]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / PAGE_SIZE),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1);
  };

  const handleExport = () => {
    const headers = [
      "Page Details",
      "Record Details",
      "Record Changes",
      "Action Time",
      "User",
      "Employee Name",
    ];

    const rows = filteredRecords.map((record) => [
      record.pageDetails,
      record.recordDetails,
      record.recordChanges,
      record.actionTime,
      record.user,
      record.employeeName,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${value.replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "audit-trail.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const openAttritionDetail = (title: string) => {
    setAttritionReportTitle(title);
    setAttritionView("detail");
  };

  const closeAttritionDetail = () => {
    setAttritionView("menu");
  };

  const clearAttritionFilters = () => {
    setAttritionSearchText("");
    setAttritionBranchFilter([]);
    setAttritionSalaryStructureFilter([]);
    setAttritionLeaveFilter([]);
    setAttritionAttendanceFilter([]);
    setAttritionDesignationFilter([]);
    setAttritionEmpStatusFilter([]);
  };

  return (
    <div className="min-h-screen w-full bg-[#f4f8fe] p-4">
      <div className="rounded-xl bg-white p-4 shadow-sm">
        {/* Top tabs */}
        <div className="rounded-xl border border-[#c96f58] bg-[#fff8f5] p-2">
  <div className="flex w-full items-center gap-2 overflow-x-auto">
    {[
      {
        label: "Audit Trail",
        icon: <Clock size={15} />,
      },
      {
        label: "Audit Trail For Import",
        icon: <Download size={15} />,
      },
      {
        label: "Work Flow Status",
        icon: <Activity size={15} />,
      },
      {
        label: "Attrition Report",
        icon: <BarChart3 size={15} />,
      },
    ].map((tab) => (
      <button
        key={tab.label}
        type="button"
        onClick={() => {
          setActiveTab(tab.label);
          setPage(1);

          if (tab.label === "Attrition Report") {
            setAttritionView("menu");
          }
        }}
        className={`flex h-10 min-w-fit flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg border px-3 text-xs font-medium transition ${activeTab === tab.label
          ? "border-[#b85c45] bg-white text-[#984936]"
          : "border-[#d6d9df] bg-white text-[#26364d] hover:border-[#b85c45] hover:text-[#984936]"
          }`}
      >
        {tab.icon}
        <span>{tab.label}</span>
      </button>
    ))}

    {!isWorkFlowStatus &&
      !(isAttritionReport && attritionView === "detail") && (
        <button
          type="button"
          onClick={handleExport}
          title="Export to Excel"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
        >
          <FileSpreadsheet size={20} />
        </button>
      )}
  </div>
</div>

        {/* Audit Trail For Import - unchanged */}
        {isAuditTrailForImport && (
          <>
            <div className="mt-3 flex items-center gap-4 rounded-lg border border-[#f1e4c2] bg-[#fffaf0] px-5 py-4 text-[#8a7444]">
              <span className="text-2xl text-[#e7c85c]">⚠</span>

              <span className="text-base">
                Select any module to list the data in the audit trail for
                import.
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg border border-gray-200 bg-white px-4 py-5">
              <CheckboxDropdownFilter
                label="Module"
                options={MODULE_OPTIONS}
                selected={moduleFilter}
                onChange={setModuleFilter}
              />

              <CheckboxDropdownFilter
                label="Employee"
                options={employeeOptions}
                selected={employeeFilter}
                onChange={setEmployeeFilter}
                showSearch
                allowAdd
                addOptionLabel="Add Employee"
                addInputPlaceholder="Enter employee name"
                onAddOption={handleAddEmployee}
              />

              <div className="relative w-[240px] shrink-0 sm:w-[310px]">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search RefNo or Empname..."
                  className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-400"
                />
              </div>

              <div className="w-[170px] shrink-0">
                <DatePicker {...fromDatePicker} />
              </div>

              <span className="shrink-0 text-sm font-medium text-gray-700">
                To
              </span>

              <div className="w-[170px] shrink-0">
                <DatePicker {...toDatePicker} />
              </div>
            </div>

            {/* Same image for Audit Trail For Import */}
            <div className="flex min-h-[520px] items-center justify-center">
              <img
                src={contactImage}
                alt="Audit Trail For Import"
                className="max-h-[430px] w-auto object-contain"
              />
            </div>
          </>
        )}

        {/* Work Flow Status - new UI */}
        {isWorkFlowStatus && <WorkFlowStatus />}

        {/* Attrition Report - menu of tiles, OR the detailed report */}
        {isAttritionReport && attritionView === "menu" && (
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-[780px]">
            <button
              type="button"
              onClick={() => openAttritionDetail("Attrition Report")}
              className="w-full overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
            >
              <div className="bg-[#e8edf5] px-4 py-3">
                <h2 className="text-base font-semibold text-[#102c49]">
                  Attrition Report
                </h2>
              </div>

              <div className="px-4 py-4">
                <p className="text-sm text-gray-600">
                  Attrition Report
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() =>
                openAttritionDetail("Attrition Report(Quarterly)")
              }
              className="w-full overflow-hidden rounded-lg bg-white text-left shadow-sm transition hover:shadow-md"
            >
              <div className="bg-[#e8edf5] px-4 py-3">
                <h2 className="text-base font-semibold text-[#102c49]">
                  Attrition Report(Quarterly)
                </h2>
              </div>

              <div className="px-4 py-4">
                <p className="text-sm text-gray-600">
                  Attrition Report(Quarterly)
                </p>
              </div>
            </button>
          </div>
        )}

        {isAttritionReport && attritionView === "detail" && (
          <AttritionReportDetail
            title={attritionReportTitle}
            monthsToShow={
              attritionReportTitle.includes("Quarterly") ? 3 : 6
            }
            year={attritionYear}
            onYearChange={setAttritionYear}
            isYearOpen={isAttritionYearOpen}
            onToggleYearOpen={() =>
              setIsAttritionYearOpen((value) => !value)
            }
            onCloseYear={() => setIsAttritionYearOpen(false)}
            onBack={closeAttritionDetail}
            searchText={attritionSearchText}
            onSearchChange={setAttritionSearchText}
            branchFilter={attritionBranchFilter}
            onBranchFilterChange={setAttritionBranchFilter}
            salaryStructureFilter={attritionSalaryStructureFilter}
            onSalaryStructureFilterChange={setAttritionSalaryStructureFilter}
            leaveFilter={attritionLeaveFilter}
            onLeaveFilterChange={setAttritionLeaveFilter}
            attendanceFilter={attritionAttendanceFilter}
            onAttendanceFilterChange={setAttritionAttendanceFilter}
            designationFilter={attritionDesignationFilter}
            onDesignationFilterChange={setAttritionDesignationFilter}
            empStatusFilter={attritionEmpStatusFilter}
            onEmpStatusFilterChange={setAttritionEmpStatusFilter}
            onClearFilters={clearAttritionFilters}
          />
        )}

        {/* Original Audit Trail UI - unchanged */}
        {isAuditTrail && (
          <>
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-white p-2">
              <div className="relative w-[220px] shrink-0">
                <Search
                  size={20}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  value={searchText}
                  onChange={(event) =>
                    handleSearch(event.target.value)
                  }
                  placeholder="Start Typing..."
                  className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div className="w-[170px] shrink-0">
                <DatePicker {...fromDatePicker} />
              </div>

              <span className="shrink-0 text-sm font-medium text-gray-700">
                To
              </span>

              <div className="w-[170px] shrink-0">
                <DatePicker {...toDatePicker} />
              </div>

              <CheckboxDropdownFilter
                label="Module"
                options={MODULE_OPTIONS}
                selected={moduleFilter}
                onChange={setModuleFilter}
              />

              <CheckboxDropdownFilter
                label="Employee"
                options={employeeOptions}
                selected={employeeFilter}
                onChange={setEmployeeFilter}
                showSearch
                allowAdd
                addOptionLabel="Add Employee"
                addInputPlaceholder="Enter employee name"
                onAddOption={handleAddEmployee}
              />

              <CheckboxDropdownFilter
                label="Page"
                options={PAGE_OPTIONS}
                selected={pageFilter}
                onChange={setPageFilter}
              />

              <CheckboxDropdownFilter
                label="Action"
                options={ACTION_OPTIONS}
                selected={actionFilter}
                onChange={setActionFilter}
                showSearch={false}
              />
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#cfd6df] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.12)]">
              <table className="w-full min-w-[900px] border-collapse text-left">
                <thead>
                  <tr className="bg-white text-xs font-semibold text-[#26364d]">
                    <th className="px-3 py-3 text-left">
                      Page Details
                    </th>

                    <th className="px-3 py-3 text-left">
                      Record Details
                    </th>

                    <th className="px-3 py-3 text-center">
                      Record Changes
                    </th>

                    <th className="px-3 py-3 text-left">
                      Action Time
                    </th>

                    <th className="px-3 py-3 text-left">
                      User
                    </th>

                    <th className="px-3 py-3 text-left">
                      Employee Name
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {visibleRecords.map((record, index) => (
                    <tr
                      key={`${record.pageDetails}-${index}`}
                      className="border-b border-[#e5e7eb] bg-white text-[11px] text-[#26364d] transition hover:bg-[#f8fafc]"
                    >
                      <td className="rounded-l-lg px-4 py-4">
                        {record.pageDetails}
                      </td>

                      <td className="px-4 py-4">
                        {record.recordDetails}
                      </td>

                      <td className="px-3 py-4">
                        <div className="flex items-center justify-center">
                          <Eye
                            size={17}
                            strokeWidth={2}
                            className="text-[#26364d]"
                          />
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        {record.actionTime}
                      </td>

                      <td className="px-4 py-4">
                        {record.user}
                      </td>

                      <td className="rounded-r-lg px-4 py-4">
                        {record.employeeName}
                      </td>
                    </tr>
                  ))}

                  {visibleRecords.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-10 text-center text-gray-500"
                      >
                        No records found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-5 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <span>Rows per page</span>
                <span>50</span>
                <ChevronDown size={16} />
              </div>

              <span>
                {visibleRecords.length === 0
                  ? "0"
                  : `${(currentPage - 1) * PAGE_SIZE + 1} to ${Math.min(
                    currentPage * PAGE_SIZE,
                    filteredRecords.length,
                  )}`}{" "}
                of {filteredRecords.length}
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage(1)}
                  className="disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <ChevronsLeft size={18} />
                </button>

                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((value) => Math.max(1, value - 1))
                  }
                  className="disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-blue-700">
                  {currentPage}
                </span>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(totalPages, value + 1),
                    )
                  }
                  className="disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <ChevronRight size={18} />
                </button>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="disabled:cursor-not-allowed disabled:text-gray-300"
                >
                  <ChevronsRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Attrition Report Detail                                                     */
/* -------------------------------------------------------------------------- */

type AttritionReportDetailProps = {
  title: string;
  monthsToShow: number;
  year: string;
  onYearChange: (value: string) => void;
  isYearOpen: boolean;
  onToggleYearOpen: () => void;
  onCloseYear: () => void;
  onBack: () => void;
  searchText: string;
  onSearchChange: (value: string) => void;
  branchFilter: string[];
  onBranchFilterChange: (values: string[]) => void;
  salaryStructureFilter: string[];
  onSalaryStructureFilterChange: (values: string[]) => void;
  leaveFilter: string[];
  onLeaveFilterChange: (values: string[]) => void;
  attendanceFilter: string[];
  onAttendanceFilterChange: (values: string[]) => void;
  designationFilter: string[];
  onDesignationFilterChange: (values: string[]) => void;
  empStatusFilter: string[];
  onEmpStatusFilterChange: (values: string[]) => void;
  onClearFilters: () => void;
};

function AttritionReportDetail({
  title,
  monthsToShow,
  year,
  onYearChange,
  isYearOpen,
  onToggleYearOpen,
  onCloseYear,
  onBack,
  searchText,
  onSearchChange,
  branchFilter,
  onBranchFilterChange,
  salaryStructureFilter,
  onSalaryStructureFilterChange,
  leaveFilter,
  onLeaveFilterChange,
  attendanceFilter,
  onAttendanceFilterChange,
  designationFilter,
  onDesignationFilterChange,
  empStatusFilter,
  onEmpStatusFilterChange,
  onClearFilters,
}: AttritionReportDetailProps) {
  const visibleMonthLabels = ATTRITION_MONTH_LABELS.slice(0, monthsToShow);

  const sumMonths = (values: Array<number | null>) =>
    Math.round(
      values
        .slice(0, monthsToShow)
        .reduce((sum: number, value) => sum + (value ?? 0), 0) * 100,
    ) / 100;

  const visible = (values: Array<number | null>) =>
    values.slice(0, monthsToShow);

  return (
    <div className="mt-3">
      {/* Header row: title / back / year / export icons */}
      <div className="flex flex-col gap-3 border-b border-gray-200 pb-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="border-b-4 border-[#2699e8] pb-2 text-base font-semibold text-[#2699e8]">
          {title}
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1 rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <YearDropdown
            year={year}
            onYearChange={onYearChange}
            isOpen={isYearOpen}
            onToggleOpen={onToggleYearOpen}
            onClose={onCloseYear}
          />

          <button
            type="button"
            title="Export to PDF"
            className="rounded-md p-2 text-red-600 hover:bg-red-50"
          >
            <FileText size={26} />
          </button>

          <button
            type="button"
            title="Export to Excel"
            className="rounded-md p-2 text-green-700 hover:bg-green-50"
          >
            <FileSpreadsheet size={26} />
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mt-3 flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white p-2 sm:gap-3">
        <div className="relative w-[200px] shrink-0">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchText}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Start Typing..."
            className="w-full rounded-lg border-0 py-3 pl-10 pr-3 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <button
          type="button"
          className="flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
        >
          <Plus size={18} />
          Add Filter
        </button>

        <AttritionQueryFilter />

        <CheckboxDropdownFilter
          label="Branch"
          options={ATTRITION_BRANCH_OPTIONS}
          selected={branchFilter}
          onChange={onBranchFilterChange}
        />

        <CheckboxDropdownFilter
          label="Salary Structure"
          options={ATTRITION_SALARY_STRUCTURE_OPTIONS}
          selected={salaryStructureFilter}
          onChange={onSalaryStructureFilterChange}
        />

        <CheckboxDropdownFilter
          label="Leave"
          options={ATTRITION_LEAVE_OPTIONS}
          selected={leaveFilter}
          onChange={onLeaveFilterChange}
        />

        <CheckboxDropdownFilter
          label="Attendance"
          options={ATTRITION_ATTENDANCE_OPTIONS}
          selected={attendanceFilter}
          onChange={onAttendanceFilterChange}
          showSearch={false}
        />

        <CheckboxDropdownFilter
          label="Designation"
          options={ATTRITION_DESIGNATION_OPTIONS}
          selected={designationFilter}
          onChange={onDesignationFilterChange}
        />

        <CheckboxDropdownFilter
          label="Emp Status"
          options={ATTRITION_EMP_STATUS_OPTIONS}
          selected={empStatusFilter}
          onChange={onEmpStatusFilterChange}
          showSearch={false}
        />

        <button
          type="button"
          title="More options"
          aria-label="More options"
          className="shrink-0 rounded-md p-2 text-gray-500 hover:bg-gray-50"
        >
          <MoreVertical size={20} />
        </button>

        <button
          type="button"
          onClick={onClearFilters}
          className="shrink-0 rounded-md p-2 text-red-500 hover:bg-red-50"
          title="Clear filters"
        >
          <X size={22} />
        </button>
      </div>

      {/* Attrition Calendar table */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-gray-200">
        <table
          className="w-full border-collapse text-left text-sm"
          style={{ minWidth: `${360 + monthsToShow * 110}px` }}
        >
          <thead>
            <tr>
              <th
                colSpan={monthsToShow + 2}
                className="bg-[#dceafb] px-4 py-3 text-center text-base font-bold text-[#d0342c]"
              >
                ATTRITION CALENDAR
              </th>
            </tr>

            <tr className="text-gray-700">
              <th className="w-[200px] px-4 py-3 font-medium sm:w-[260px]">
                As on date
              </th>

              {visibleMonthLabels.map((label) => (
                <th
                  key={label}
                  className="px-4 py-3 text-right font-medium"
                >
                  {label}
                </th>
              ))}

              <th className="px-4 py-3 text-right font-semibold">
                Total
              </th>
            </tr>
          </thead>

          <tbody>
            <AttritionRow
              label="Total strength of Employees"
              values={visible(ATTRITION_TOTAL_STRENGTH)}
              total={sumMonths(ATTRITION_TOTAL_STRENGTH)}
              bold
            />

            <AttritionSectionRow label="Attrition details:" monthsToShow={monthsToShow} />

            <AttritionRow
              label="Resigned"
              values={visible(ATTRITION_RESIGNED)}
              total={sumMonths(ATTRITION_RESIGNED)}
              indent
              labelColor="text-[#b0473f]"
            />

            <AttritionRow
              label="Absconding"
              values={visible(ATTRITION_ABSCONDING)}
              total={sumMonths(ATTRITION_ABSCONDING)}
              indent
              labelColor="text-[#b0473f]"
            />

            <AttritionRow
              label="Termination"
              values={visible(ATTRITION_TERMINATION)}
              total={sumMonths(ATTRITION_TERMINATION)}
              indent
              labelColor="text-[#b0473f]"
            />

            <AttritionRow
              label="Total Attrition"
              values={visible(ATTRITION_TOTAL)}
              total={sumMonths(ATTRITION_TOTAL)}
              indent
              highlight
              labelColor="text-[#8a6d1a]"
            />

            <AttritionSectionRow label="Recruitment" monthsToShow={monthsToShow} />

            <AttritionRow
              label="Total recruitment"
              values={visible(ATTRITION_RECRUITMENT)}
              total={sumMonths(ATTRITION_RECRUITMENT)}
              indent
              labelColor="text-[#b0473f]"
            />

            <AttritionSectionRow label="Transfers" monthsToShow={monthsToShow} />

            <AttritionRow
              label="Transferred to Other branch/ unit"
              values={visible(ATTRITION_TRANSFERRED_OUT)}
              total={sumMonths(ATTRITION_TRANSFERRED_OUT)}
              indent
              labelColor="text-[#b0473f]"
            />

            <AttritionRow
              label="Joined the team by transfer"
              values={visible(ATTRITION_JOINED_BY_TRANSFER)}
              total={sumMonths(ATTRITION_JOINED_BY_TRANSFER)}
              indent
              labelColor="text-[#b0473f]"
            />

            <AttritionRow
              label="Total Employees on last day of the month"
              values={visible(ATTRITION_TOTAL_EMP_LAST_DAY)}
              total={sumMonths(ATTRITION_TOTAL_EMP_LAST_DAY)}
              indent
              highlight
              labelColor="text-[#8a6d1a]"
            />

            <AttritionRow
              label="Attrition %age - Month Wise"
              values={visible(ATTRITION_PERCENTAGE)}
              total={sumMonths(ATTRITION_PERCENTAGE)}
              indent
              highlight
              labelColor="text-[#8a6d1a]"
            />
          </tbody>
        </table>
      </div>

      {/* Attrition line chart */}
      <div className="mt-4 rounded-lg border border-gray-200 p-4">
        <AttritionChart
          months={ATTRITION_CHART_MONTHS}
          values={ATTRITION_CHART_VALUES}
        />
      </div>
    </div>
  );
}

type AttritionRowProps = {
  label: string;
  values: Array<number | null>;
  total: number;
  bold?: boolean;
  indent?: boolean;
  highlight?: boolean;
  labelColor?: string;
};

function AttritionRow({
  label,
  values,
  total,
  bold,
  indent,
  highlight,
  labelColor,
}: AttritionRowProps) {
  return (
    <tr className={highlight ? "bg-[#fdf6db]" : "bg-white"}>
      <td
        className={`px-4 py-3 ${indent ? "pl-10" : ""} ${bold ? "font-semibold text-[#102c49]" : labelColor ?? "text-gray-700"
          }`}
      >
        {label}
      </td>

      {values.map((value, index) => (
        <td
          key={`${label}-${ATTRITION_MONTH_SHORT[index]}`}
          className={`px-4 py-3 text-right ${bold ? "font-semibold text-[#102c49]" : "text-gray-800"
            }`}
        >
          {value === null ? "" : value}
        </td>
      ))}

      <td
        className={`px-4 py-3 text-right font-semibold ${bold ? "text-[#102c49]" : "text-gray-800"
          }`}
      >
        {total}
      </td>
    </tr>
  );
}

type YearDropdownProps = {
  year: string;
  onYearChange: (value: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
  onClose: () => void;
};

function YearDropdown({
  year,
  onYearChange,
  isOpen,
  onToggleOpen,
  onClose,
}: YearDropdownProps) {
  const { wrapperRef, buttonRef, coords } = useDropdownPosition(
    isOpen,
    onClose,
    140,
  );

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      <button
        ref={buttonRef}
        type="button"
        onClick={onToggleOpen}
        className="flex w-[140px] items-center justify-between rounded-md border border-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        {year}
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: 140,
          }}
          className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          {ATTRITION_YEAR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onYearChange(option);
                onClose();
              }}
              className={`block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 ${option === year ? "bg-[#eaf4ff]" : ""
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function AttritionQueryFilter() {
  const [isOpen, setIsOpen] = useState(false);
  const [queryText, setQueryText] = useState("");
  const containerRef = useDropdownPosition(isOpen, () => setIsOpen(false), 192);

  return (
    <div ref={containerRef.wrapperRef} className="relative shrink-0">
      <button
        ref={containerRef.buttonRef}
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        Query
        <ChevronDown size={16} />
      </button>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: containerRef.coords.top,
            left: containerRef.coords.left,
            width: 192,
          }}
          className="z-50 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg"
        >
          <div className="border-b border-gray-200 px-3 py-2 text-sm font-medium text-gray-700">
            Query
          </div>

          <div className="p-3">
            <input
              type="text"
              value={queryText}
              onChange={(event) => setQueryText(event.target.value)}
              placeholder="Enter query"
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setQueryText("");
              setIsOpen(false);
            }}
            className="flex w-full items-center gap-2 border-t border-gray-200 px-3 py-3 text-sm text-gray-400 hover:bg-gray-50"
          >
            <X size={16} />
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

function AttritionSectionRow({
  label,
  monthsToShow,
}: {
  label: string;
  monthsToShow: number;
}) {
  return (
    <tr className="bg-[#eef2f8]">
      <td
        colSpan={monthsToShow + 2}
        className="px-4 py-3 font-semibold text-[#102c49]"
      >
        {label}
      </td>
    </tr>
  );
}

/* -------------------------------------------------------------------------- */
/* Attrition Chart (plain SVG, no extra dependencies)                          */
/* -------------------------------------------------------------------------- */

type AttritionChartProps = {
  months: string[];
  values: number[];
};

function AttritionChart({ months, values }: AttritionChartProps) {
  const width = 1000;
  const height = 300;

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 10;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const yTicks = [0, 3, 6, 9, 12];
  const yMax = 12;

  const points = values.map((value, index) => {
    const x =
      paddingLeft +
      (index / Math.max(1, values.length - 1)) * chartWidth;

    const y =
      paddingTop + chartHeight - (value / yMax) * chartHeight;

    return { x, y };
  });

  const linePath = points
    .map((point, index) =>
      index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`,
    )
    .join(" ");

  const areaPath = `${linePath} L ${points[points.length - 1].x
    } ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight
    } Z`;

  return (
    <div>
      <div className="flex items-center gap-2 pl-2 text-xs font-medium text-gray-600">
        <span
          className="-rotate-90"
          style={{ writingMode: "vertical-rl" }}
        >
          Total Attrition
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full"
        preserveAspectRatio="none"
      >
        {/* Gridlines + y-axis labels */}
        {yTicks.map((tick) => {
          const y =
            paddingTop + chartHeight - (tick / yMax) * chartHeight;

          return (
            <g key={tick}>
              <line
                x1={paddingLeft}
                x2={width - paddingRight}
                y1={y}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth={1}
              />

              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                fontSize={12}
                fill="#6b7280"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Area + line */}
        <path d={areaPath} fill="#2699e8" fillOpacity={0.08} />
        <path d={linePath} fill="none" stroke="#2699e8" strokeWidth={3} />

        {/* X-axis labels */}
        {months.map((month, index) => {
          const x =
            paddingLeft +
            (index / Math.max(1, months.length - 1)) * chartWidth;

          return (
            <text
              key={month}
              x={x}
              y={height - paddingBottom + 20}
              textAnchor="middle"
              fontSize={12}
              fill="#6b7280"
            >
              {month}
            </text>
          );
        })}
      </svg>

      <div className="text-center text-xs font-medium text-gray-600">
        Month
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Work Flow Status Component                                                  */
/* -------------------------------------------------------------------------- */

function WorkFlowStatus() {
  const [searchText, setSearchText] = useState("");

  const [groupFilter, setGroupFilter] = useState<string[]>([]);
  const [workflowNameFilter, setWorkflowNameFilter] = useState<string[]>(
    [],
  );
  const [approverFilter, setApproverFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selectedModule, setSelectedModule] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fromDatePicker = useDateField(fromDate, setFromDate);
  const toDatePicker = useDateField(toDate, setToDate);

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filteredRecords = useMemo(() => {
    const searchValue = searchText.toLowerCase().trim();

    return WORKFLOW_RECORDS.filter((record) => {
      const matchesSearch =
        !searchValue ||
        Object.values(record).some((value) =>
          value.toLowerCase().includes(searchValue),
        );

      const matchesGroup =
        groupFilter.length === 0 ||
        groupFilter.includes(
          record.groupName.toLowerCase().replaceAll(" ", "-"),
        );

      const matchesWorkflowName =
        workflowNameFilter.length === 0 ||
        workflowNameFilter.includes(
          record.workflowName.toLowerCase().replaceAll(" ", "-"),
        );

      const matchesApprover =
        approverFilter.length === 0 ||
        approverFilter.includes(
          record.approverName.toLowerCase().replaceAll(" ", "-"),
        );

      const matchesStatus =
        statusFilter.length === 0 ||
        statusFilter.includes(record.wfStatus.toLowerCase());

      return (
        matchesSearch &&
        matchesGroup &&
        matchesWorkflowName &&
        matchesApprover &&
        matchesStatus
      );
    });
  }, [
    searchText,
    groupFilter,
    workflowNameFilter,
    approverFilter,
    statusFilter,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredRecords.length / pageSize),
  );

  const currentPage = Math.min(page, totalPages);

  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleExportWorkflow = () => {
    const headers = [
      "Emp.ID / Name",
      "WF Name",
      "Group Name",
      "No. Of Leaves",
      "Submitted Date",
      "Applied Date",
      "Approved Date",
      "WF Level",
      "Approver Name",
      "WF Status",
      "Leave Reason",
      "Remarks",
    ];

    const rows = filteredRecords.map((record) => [
      `${record.employeeId} ${record.employeeName}`,
      record.workflowName,
      record.groupName,
      record.noOfLeaves,
      record.submittedDate,
      record.appliedDate,
      record.approvedDate,
      record.wfLevel,
      record.approverName,
      record.wfStatus,
      record.leaveReason,
      record.remarks,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${value.replaceAll('"', '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "workflow-status.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const clearWorkflowFilters = () => {
    setSearchText("");
    setGroupFilter([]);
    setWorkflowNameFilter([]);
    setApproverFilter([]);
    setStatusFilter([]);
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#e1e5eb] bg-white shadow-sm">
      {/* Top workflow filters */}
      <div className="flex flex-wrap items-end gap-3 border-b border-[#e5e8ed] px-4 py-3">
       <div className="w-[290px] shrink-0">
  <label className="mb-1 block text-sm font-medium text-gray-700">
    Module
  </label>

  <select
    value={selectedModule}
    onChange={(event) => {
      setSelectedModule(event.target.value);
      setPage(1);
    }}
    className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm outline-none focus:border-blue-400"
  >
    <option value="">Select Module</option>
    <option value="all">All</option>
    <option value="leave-apply-ess">Leave Apply (ESS)</option>
    <option value="on-boarding-hrms">On Boarding (HRMS)</option>
    <option value="employee-profile-ess">
      Employee Profile (ESS)
    </option>
    <option value="punches-ess">Punches (ESS)</option>
    <option value="face-template-punches-ess">
      Face Template - Punches (ESS)
    </option>
  </select>
</div>

        <div className="w-[155px] shrink-0">
          <label className="mb-1 block text-xs font-medium text-[#26364d]">
            From Date<span className="text-red-500">*</span>
          </label>

          <DatePicker {...fromDatePicker} />
        </div>

        <div className="w-[155px] shrink-0">
          <label className="mb-1 block text-xs font-medium text-[#26364d]">
            To Date<span className="text-red-500">*</span>
          </label>

          <DatePicker {...toDatePicker} />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportWorkflow}
            title="Export to Excel"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
          >
            <FileSpreadsheet size={21} />
          </button>

          <button
            type="button"
            title="Filter"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[#8d9ab8] transition hover:bg-blue-50"
          >
            <Filter size={21} />
          </button>
        </div>
      </div>

      {/* Search and workflow filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#e5e8ed] px-4 py-3">
        <div className="relative w-[220px] shrink-0">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8d9ab8]"
          />

          <input
            type="text"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
              setPage(1);
            }}
            placeholder="Start Typing..."
            className="h-10 w-full rounded-lg border-0 bg-white py-2 pl-10 pr-3 text-xs text-[#26364d] outline-none placeholder:text-[#9aa5b5] focus:ring-1 focus:ring-[#dce8f5]"
          />
        </div>

        <button
          type="button"
          className="flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-xs font-medium text-[#26364d] transition hover:bg-[#f5f8fb]"
        >
          <Plus size={16} />
          Add Filter
        </button>

        <CheckboxDropdownFilter
          label="WF Name"
          options={WORKFLOW_NAME_OPTIONS}
          selected={workflowNameFilter}
          onChange={(values) => {
            setWorkflowNameFilter(values);
            setPage(1);
          }}
        />

        <CheckboxDropdownFilter
          label="Group Name"
          options={WORKFLOW_GROUP_OPTIONS}
          selected={groupFilter}
          onChange={(values) => {
            setGroupFilter(values);
            setPage(1);
          }}
        />

        <CheckboxDropdownFilter
          label="Approver Name"
          options={APPROVER_OPTIONS}
          selected={approverFilter}
          onChange={(values) => {
            setApproverFilter(values);
            setPage(1);
          }}
        />

        <CheckboxDropdownFilter
          label="WF Status"
          options={WORKFLOW_STATUS_OPTIONS}
          selected={statusFilter}
          onChange={(values) => {
            setStatusFilter(values);
            setPage(1);
          }}
          showSearch={false}
        />

        <button
          type="button"
          onClick={clearWorkflowFilters}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-red-500 transition hover:bg-red-50"
          title="Clear filters"
        >
          <X size={20} />
        </button>
      </div>

      {/* Workflow table */}
      <div className="overflow-x-auto bg-white px-3 py-3">
        <table className="w-full min-w-[1500px] border-separate border-spacing-y-2 text-left">
          <thead>
            <tr className="bg-[#f1f3f6] text-xs font-semibold text-[#26364d]">
              <th className="rounded-l-lg px-3 py-3">
                Emp.ID / Name
              </th>
              <th className="px-3 py-3">WF Name</th>
              <th className="px-3 py-3">Group Name</th>
              <th className="px-3 py-3">No. Of Leaves</th>
              <th className="px-3 py-3">Submitted Date</th>
              <th className="px-3 py-3">Applied Date</th>
              <th className="px-3 py-3">Approved Date</th>
              <th className="px-3 py-3">WF Level</th>
              <th className="px-3 py-3">Approver Name</th>
              <th className="px-3 py-3">WF Status</th>
              <th className="px-3 py-3">Leave Reason</th>
              <th className="rounded-r-lg px-3 py-3">
                Remarks
              </th>
            </tr>
          </thead>

          <tbody>
            {visibleRecords.map((record, index) => (
              <tr
                key={`${record.employeeId}-${record.submittedDate}-${index}`}
                className={`text-xs text-[#26364d] ${index % 2 === 0 ? "bg-white" : "bg-[#f3f5f7]"
                  }`}
              >
                <td className="rounded-l-lg px-3 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="w-fit rounded bg-[#eef2f7] px-2 py-1 font-semibold">
                      {record.employeeId}
                    </span>

                    <span className="font-semibold leading-4">
                      {record.employeeName}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-4 font-semibold">
                  {record.workflowName}
                </td>

                <td className="px-3 py-4">
                  {record.groupName}
                </td>

                <td className="px-3 py-4">
                  {record.noOfLeaves}
                </td>

                <td className="whitespace-nowrap px-3 py-4">
                  {record.submittedDate}
                </td>

                <td className="px-3 py-4">
                  {record.appliedDate}
                </td>

                <td className="whitespace-nowrap px-3 py-4">
                  {record.approvedDate}
                </td>

                <td className="px-3 py-4">
                  <span className="inline-flex rounded-full bg-[#49a9e8] px-4 py-2 font-semibold text-white">
                    {record.wfLevel}
                  </span>
                </td>

                <td className="px-3 py-4">
                  {record.approverName}
                </td>

                <td className="px-3 py-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e5f5ea] px-3 py-2 font-semibold text-[#3d9153]">
                    <span className="text-[10px]">●</span>
                    {record.wfStatus}
                  </span>
                </td>

                <td className="max-w-[180px] px-3 py-4">
                  {record.leaveReason}
                </td>

                <td className="rounded-r-lg px-3 py-4">
                  {record.remarks}
                </td>
              </tr>
            ))}

            {visibleRecords.length === 0 && (
              <tr>
                <td
                  colSpan={12}
                  className="px-4 py-10 text-center text-sm text-gray-500"
                >
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Workflow pagination */}
      <div className="flex flex-wrap items-center justify-end gap-5 border-t border-[#edf0f4] px-4 py-3 text-xs text-[#26364d]">
        <div className="flex items-center gap-2">
          <span>Rows per page</span>
          <span>10</span>
          <ChevronDown size={14} />
        </div>

        <span>
          {visibleRecords.length === 0
            ? "0"
            : `${(currentPage - 1) * pageSize + 1} to ${Math.min(
              currentPage * pageSize,
              filteredRecords.length,
            )}`}{" "}
          of {filteredRecords.length}
        </span>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(1)}
            className="disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <ChevronsLeft size={17} />
          </button>

          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() =>
              setPage((value) => Math.max(1, value - 1))
            }
            className="disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <ChevronLeft size={17} />
          </button>

          <span className="rounded-md bg-[#8b4b3b] px-3 py-1.5 text-white">
            {currentPage}
          </span>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage((value) => Math.min(totalPages, value + 1))
            }
            className="disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <ChevronRight size={17} />
          </button>

          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage(totalPages)}
            className="disabled:cursor-not-allowed disabled:text-gray-300"
          >
            <ChevronsRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
