// import { useState } from "react";

// import {
//   Bookmark,
//   ChevronLeft,
//   Clock,
//   FileText,
//   ClipboardList,
//   Mail,
//   LayoutGrid,
//   Search,
//   X,
//   UploadCloud,
//   Menu,
//   Plus,
//   Filter,
//   Copy,
//   ChevronDown,
// } from "lucide-react";

// import {
//   useLocation,
//   useNavigate,
// } from "react-router-dom";

// import { saveGeneralReport } from "../api/generalReport.api";
// import { getFactoryActForms } from "../api/factoryAct.api";

// import ReportHeader from "../components/ReportHeader";
// import ReportConfiguration from "../components/ReportConfiguration";
// import SelectedColumns from "../components/SelectedColumns";

// import FormMasterPage from "./FormMasterPage";
// import MailMergePage from "./MailMergePage";
// import FactoryActFormsPage from "./FactoryActFormsPage";

// /* =====================================================
//    TOP NAVIGATION TABS
// ===================================================== */

// const TABS = [
//   {
//     label: "Report Writer",
//     icon: FileText,
//   },
//   {
//     label: "Form Master",
//     icon: LayoutGrid,
//   },
//   {
//     label: "Mail Merge",
//     icon: Mail,
//   },
//   {
//     label: "Factory Act Forms",
//     icon: ClipboardList,
//   },
// ];

// /* =====================================================
//    GENERAL REPORT
// ===================================================== */

// export default function GeneralReport() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* =====================================================
//      ACTIVE TOP TAB

//      URL is used so that nested pages such as
//      Form Master and Mail Merge work correctly.
//   ===================================================== */

//   const getActiveTab = () => {
//     if (
//       location.pathname.includes(
//         "/form_master"
//       )
//     ) {
//       return "Form Master";
//     }

//     if (
//       location.pathname.includes(
//         "/mail_merge"
//       )
//     ) {
//       return "Mail Merge";
//     }

//     if (
//       location.pathname.includes(
//         "/factory_act_forms"
//       )
//     ) {
//       return "Factory Act Forms";
//     }

//     return "Report Writer";
//   };

//   const [activeTab, setActiveTab] =
//     useState(getActiveTab());

//   /* =====================================================
//      SAVE STATE
//   ===================================================== */

//   const [saving, setSaving] =
//     useState(false);

//   /* =====================================================
//      BACK CONFIRMATION MODAL
//   ===================================================== */

//   const [showBackConfirm, setShowBackConfirm] =
//     useState(false);

//   /* =====================================================
//      DISCARD RESULT

//      This is intentionally separate from the normal Report
//      Writer state. The first screen remains unchanged.
//      After Discard, the empty Report Writer screen shown in
//      the reference image is displayed.
//   ===================================================== */

//   const [showDiscardedReportWriter, setShowDiscardedReportWriter] =
//     useState(false);

//   const handleBackClick = () => {
//     setShowBackConfirm(true);
//   };

//   const handleCancelBack = () => {
//     setShowBackConfirm(false);
//   };

//   const handleDiscardBack = () => {
//     // Close the confirmation modal.
//     setShowBackConfirm(false);

//     // Return to Report Writer and show the exact empty state
//     // requested for the Discard action.
//     setActiveTab("Report Writer");
//     setShowDiscardedReportWriter(true);
//   };

//   /* =====================================================
//      STORE TEMPLATE MODAL
//   ===================================================== */

//   const [showStoreTemplates, setShowStoreTemplates] =
//     useState(false);

//   const [storeTemplates, setStoreTemplates] =
//     useState<Array<{ id: string | number; name: string }>>([]);

//   const [storeLoading, setStoreLoading] =
//     useState(false);

//   const [storeSearch, setStoreSearch] =
//     useState("");

//   const [selectedTemplateIds, setSelectedTemplateIds] =
//     useState<Array<string | number>>([]);

//   const [selectedState, setSelectedState] =
//     useState("");

//   /* =====================================================
//      CREATE NEW FACTORY ACT FILE MODAL
//   ===================================================== */

//   const [showCreateFile, setShowCreateFile] =
//     useState(false);

//   const [newFileName, setNewFileName] =
//     useState("");

//   const [selectedFile, setSelectedFile] =
//     useState<File | null>(null);

//   const openCreateFile = () => {
//     setNewFileName("");
//     setSelectedFile(null);
//     setShowCreateFile(true);
//   };

//   const closeCreateFile = () => {
//     setShowCreateFile(false);
//     setNewFileName("");
//     setSelectedFile(null);
//   };

//   const handleFileSelection = (
//     file: File | null,
//   ) => {
//     if (!file) return;

//     setSelectedFile(file);

//     if (!newFileName) {
//       setNewFileName(file.name);
//     }
//   };

//   const openStoreTemplates = async () => {
//     setShowStoreTemplates(true);
//     setStoreSearch("");
//     setSelectedState("");
//     setSelectedTemplateIds([]);

//     try {
//       setStoreLoading(true);
//       const result = await getFactoryActForms();
//       setStoreTemplates(result);
//     } catch (error) {
//       console.error("Unable to load store templates:", error);
//       setStoreTemplates([]);
//     } finally {
//       setStoreLoading(false);
//     }
//   };

//   const toggleTemplate = (id: string | number) => {
//     setSelectedTemplateIds((current) =>
//       current.includes(id)
//         ? current.filter((item) => item !== id)
//         : [...current, id],
//     );
//   };

//   const filteredStoreTemplates = storeTemplates.filter((template) =>
//     template.name
//       .toLowerCase()
//       .includes(storeSearch.toLowerCase()),
//   );

//   /* =====================================================
//      SAVE REPORT
//      EXISTING FUNCTIONALITY PRESERVED
//   ===================================================== */

//   const handleSave = async () => {
//     try {
//       setSaving(true);

//       const reportData = {
//         reportName:
//           "Employee Audit Report_v2",

//         customQuery: false,

//         pinReportTo:
//           "General Report / Analytics",

//         selectedFields: [
//           "Ref No.",
//           "Employee name",
//         ],

//         selectedColumns: [
//           "Ref No",
//           "Empname",
//           "Month Name",
//         ],
//       };

//       const response =
//         await saveGeneralReport(
//           reportData
//         );

//       console.log(
//         "General Report saved:",
//         response
//       );

//       alert(
//         "General Report saved successfully."
//       );
//     } catch (error) {
//       console.error(
//         "Save General Report error:",
//         error
//       );

//       alert(
//         "Unable to save General Report."
//       );
//     } finally {
//       setSaving(false);
//     }
//   };

//   /* =====================================================
//      TAB NAVIGATION
//   ===================================================== */

//   const handleTabClick = (
//     label: string
//   ) => {
//     setActiveTab(label);

//     // Any manual tab selection returns to the normal page state.
//     setShowDiscardedReportWriter(false);

//     if (
//       label ===
//       "Report Writer"
//     ) {
//       navigate(
//         "/koundinyasatech/admin/insights/general-report"
//       );

//       return;
//     }

//     if (
//       label ===
//       "Form Master"
//     ) {
//       navigate(
//         "/koundinyasatech/admin/insights/general-report/form_master"
//       );

//       return;
//     }

//     if (
//       label ===
//       "Mail Merge"
//     ) {
//       navigate(
//         "/koundinyasatech/admin/insights/general-report/mail_merge"
//       );

//       return;
//     }

//     if (
//       label ===
//       "Factory Act Forms"
//     ) {
//       navigate(
//         "/koundinyasatech/admin/insights/general-report/factory_act_forms"
//       );

//       return;
//     }
//   };

//   return (
//     <div
//       className="
//         min-h-screen
//         w-full
//         bg-[#f5f6f8]
//         p-3
//         sm:p-4
//         overflow-x-hidden
//       "
//     >
//       {/* =====================================================
//           TOP NAVIGATION
//       ===================================================== */}

//       <div
//         className="
//           flex
//           min-h-[58px]
//           w-full
//           items-center
//           justify-between
//           gap-3
//           rounded-[12px]
//           border
//           border-[#c9a79d]
//           bg-[#fff9f7]
//           px-4
//           py-2
//         "
//       >
//         {/* =================================================
//             LEFT NAVIGATION TABS
//         ================================================= */}

//         <div
//           className="
//             flex
//             min-w-0
//             flex-1
//             items-center
//             gap-4
//             overflow-x-auto
//             overflow-y-hidden
//             scrollbar-none
//           "
//         >
//           {TABS.map(
//             ({
//               label,
//               icon: Icon,
//             }) => {
//               const isActive =
//                 activeTab === label;

//               return (
//                 <button
//                   key={label}
//                   type="button"
//                   onClick={() =>
//                     handleTabClick(
//                       label
//                     )
//                   }
//                   className={`
//                     flex
//                     h-[37px]
//                     min-w-[182px]
//                     shrink-0
//                     items-center
//                     justify-center
//                     gap-2
//                     rounded-[7px]
//                     border
//                     px-4
//                     text-[13px]
//                     font-medium
//                     transition-all

//                     ${
//                       isActive
//                         ? label === "Factory Act Forms"
//                           ? `
//                               border-[#b17869]
//                               bg-white
//                               text-[#7e4031]
//                               shadow-sm
//                             `
//                           : `
//                               border-[#b17869]
//                               bg-white
//                               text-[#956050]
//                               shadow-sm
//                             `
//                         : `
//                           border-[#e2e2e2]
//                           bg-white
//                           text-[#5d6268]
//                           hover:border-[#c9a79d]
//                         `
//                     }
//                   `}
//                 >
//                   <Icon
//                     size={15}
//                     strokeWidth={1.8}
//                   />

//                   <span>
//                     {label}
//                   </span>
//                 </button>
//               );
//             }
//           )}
//         </div>

//         {/* =================================================
//             RIGHT ACTION BUTTONS
//         ================================================= */}

//         <div
//           className="
//             flex
//             shrink-0
//             items-center
//             gap-3
//           "
//         >
//           {showDiscardedReportWriter && activeTab === "Report Writer" ? (
//             <>
//               {/* PAYMONTH */}
//               <button
//                 type="button"
//                 className="
//                   flex
//                   h-[38px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[7px]
//                   bg-[#7e4031]
//                   px-4
//                   text-[13px]
//                   font-medium
//                   text-white
//                   shadow-sm
//                 "
//               >
//                 Paymonth
//                 <ChevronDown size={15} strokeWidth={2} />
//               </button>

//               {/* CLOCK */}
//               <button
//                 type="button"
//                 title="History"
//                 className="
//                   flex
//                   h-[37px]
//                   w-[32px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   text-[#5d6268]
//                 "
//               >
//                 <Clock size={18} strokeWidth={1.8} />
//               </button>

//               {/* FILTER */}
//               <button
//                 type="button"
//                 title="Filter"
//                 className="
//                   flex
//                   h-[37px]
//                   w-[28px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   text-[#5d6268]
//                 "
//               >
//                 <Filter size={17} strokeWidth={1.8} />
//               </button>

//               {/* COPY */}
//               <button
//                 type="button"
//                 title="Copy"
//                 className="
//                   flex
//                   h-[37px]
//                   w-[28px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   text-[#5d6268]
//                 "
//               >
//                 <Copy size={17} strokeWidth={1.8} />
//               </button>
//             </>
//           ) : activeTab === "Factory Act Forms" ? (
//             <>
//               <button
//                 type="button"
//                 onClick={openStoreTemplates}
//                 className="
//                   flex
//                   h-[38px]
//                   items-center
//                   rounded-full
//                   bg-[#f1f1f1]
//                   px-5
//                   text-[14px]
//                   font-medium
//                   text-[#202124]
//                   shadow-sm
//                   transition
//                   hover:bg-[#e7e7e7]
//                 "
//               >
//                 Download Template From Store
//               </button>

//               <button
//                 type="button"
//                 title="Add Factory Act Form"
//                 onClick={openCreateFile}
//                 className="
//                   flex
//                   h-[38px]
//                   w-[38px]
//                   items-center
//                   justify-center
//                   rounded-full
//                   text-[#7e4031]
//                   transition
//                   hover:bg-[#f8eeeb]
//                 "
//               >
//                 <span className="text-[25px] leading-none">
//                   +
//                 </span>
//               </button>
//             </>
//           ) : (
//             <>
//               {/* BACK */}

//               <button
//                 type="button"
//                 onClick={handleBackClick}
//                 className="
//                   flex
//                   h-[37px]
//                   min-w-[84px]
//                   items-center
//                   justify-center
//                   gap-1
//                   rounded-[7px]
//                   bg-[#7e4031]
//                   px-4
//                   text-[13px]
//                   font-medium
//                   text-white
//                   transition-all
//                   hover:bg-[#6c3428]
//                 "
//               >
//                 <ChevronLeft size={15} />
//                 Back
//               </button>

//               {/* SAVE */}

//               <button
//                 type="button"
//                 disabled={saving}
//                 onClick={handleSave}
//                 className="
//                   flex
//                   h-[37px]
//                   min-w-[84px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[7px]
//                   bg-[#7e4031]
//                   px-4
//                   text-[13px]
//                   font-semibold
//                   text-white
//                   shadow-sm
//                   transition-all
//                   hover:bg-[#6c3428]
//                   disabled:cursor-not-allowed
//                   disabled:opacity-60
//                 "
//               >
//                 <Bookmark
//                   size={15}
//                   strokeWidth={1.8}
//                 />

//                 {saving
//                   ? "Saving..."
//                   : "Save"}
//               </button>

//               {/* HISTORY */}

//               <button
//                 type="button"
//                 title="History"
//                 className="
//                   flex
//                   h-[37px]
//                   w-[32px]
//                   shrink-0
//                   items-center
//                   justify-center
//                   text-[#5d6268]
//                 "
//               >
//                 <Clock
//                   size={18}
//                   strokeWidth={1.8}
//                 />
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       {/* =====================================================
//           REPORT WRITER
//       ===================================================== */}

//       {activeTab === "Report Writer" && showDiscardedReportWriter ? (
//         /* =====================================================
//            REPORT WRITER EMPTY STATE AFTER DISCARD
//         ===================================================== */
//         <div className="mt-4 w-full">
//           {/* FILTER / QUERY AREA */}
//           <div className="grid grid-cols-1 gap-3 lg:grid-cols-[198px_minmax(0,1fr)]">
//             {/* QUERY SIDEBAR */}
//             <div
//               className="
//                 min-h-[614px]
//                 rounded-[10px]
//                 border
//                 border-[#dedede]
//                 bg-white
//               "
//             >
//               <div className="flex h-[50px] items-center justify-between border-b border-[#dedede] px-3">
//                 <span className="text-[13px] font-medium text-[#202124]">
//                   Query
//                 </span>
//                 <button
//                   type="button"
//                   title="Add Query"
//                   className="
//                     flex h-[25px] w-[25px] items-center justify-center
//                     rounded-[6px] border border-[#b17869] bg-white
//                     text-[#7e4031]
//                   "
//                 >
//                   <Plus size={17} strokeWidth={2} />
//                 </button>
//               </div>
//             </div>

//             {/* RIGHT CONTENT */}
//             <div className="min-w-0">
//               <div
//                 className="
//                   rounded-[10px]
//                   border
//                   border-[#dedede]
//                   bg-white
//                   px-2.5
//                   py-2.5
//                 "
//               >
//                 {/* FILTER BUTTONS */}
//                 <div className="flex flex-wrap items-center gap-2">
//                   {[
//                     "Branch",
//                     "Salary Structure",
//                     "Leave",
//                     "Attendance",
//                     "Designation",
//                     "Emp Status",
//                   ].map((item) => (
//                     <button
//                       key={item}
//                       type="button"
//                       className="
//                         flex h-[28px] items-center gap-1.5 rounded-[6px]
//                         border border-[#e4e8ef] bg-white px-2.5
//                         text-[11px] font-medium text-[#344054]
//                       "
//                     >
//                       {item}
//                       <ChevronDown size={12} strokeWidth={1.8} />
//                     </button>
//                   ))}

//                   <button
//                     type="button"
//                     className="ml-1 text-[11px] font-medium text-[#7e4031]"
//                   >
//                     <span className="mr-1 text-[15px]">×</span>Clear
//                   </button>
//                 </div>

//                 {/* SEARCH + ADD FILTER + QUERY */}
//                 <div className="mt-2.5 flex flex-wrap items-center gap-2">
//                   <div className="relative min-w-[220px] flex-1">
//                     <Search
//                       size={15}
//                       className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Search..."
//                       className="
//                         h-[28px] w-full rounded-[6px] border border-[#dfe4ec]
//                         bg-white pl-8 pr-3 text-[11px] text-[#344054]
//                         outline-none
//                         placeholder:text-[#b0b6bf]
//                       "
//                     />
//                   </div>

//                   <button
//                     type="button"
//                     className="
//                       flex h-[28px] items-center gap-1.5 rounded-[6px]
//                       bg-[#9b6656] px-3 text-[11px] font-medium text-white
//                     "
//                   >
//                     <Plus size={14} strokeWidth={2.2} />
//                     Add Filter
//                   </button>

//                   <button
//                     type="button"
//                     className="
//                       flex h-[28px] items-center gap-1.5 rounded-[6px]
//                       border border-[#e4e8ef] bg-white px-3
//                       text-[11px] font-medium text-[#344054]
//                     "
//                   >
//                     Query
//                     <ChevronDown size={12} strokeWidth={1.8} />
//                   </button>
//                 </div>
//               </div>

//               {/* GROUP BY / ORDER BY */}
//               <div
//                 className="
//                   mt-3 flex min-h-[47px] items-center justify-between
//                   rounded-[10px] border border-[#dedede] bg-white px-2.5
//                 "
//               >
//                 <button
//                   type="button"
//                   className="
//                     flex h-[28px] items-center rounded-[6px] border
//                     border-[#e4e8ef] bg-white px-2.5 text-[11px]
//                     font-medium text-[#344054]
//                   "
//                 >
//                   Group By :&nbsp; None
//                 </button>

//                 <button
//                   type="button"
//                   className="
//                     flex h-[28px] items-center rounded-[6px] border
//                     border-[#e4e8ef] bg-white px-2.5 text-[11px]
//                     font-medium text-[#344054]
//                   "
//                 >
//                   Order By :&nbsp; None
//                 </button>
//               </div>

//               {/* EMPTY REPORT WRITER CARD */}
//               <div
//                 className="
//                   mt-3 flex min-h-[440px] items-center justify-center
//                   rounded-[12px] border border-[#dedede] bg-white
//                   shadow-[0_2px_8px_rgba(0,0,0,0.16)]
//                 "
//               >
//                 <div className="flex flex-col items-center justify-center text-center">
//                   <img
//                     src="/report-writer-empty.png"
//                     alt=""
//                     className="mb-1 h-[190px] w-[270px] object-contain"
//                   />
//                   <p className="text-[12px] font-medium text-[#333333]">
//                     Did not find any report writer
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : activeTab ===
//         "Report Writer" && (
//         <div
//           className="
//             mt-4
//             grid
//             grid-cols-1
//             items-start
//             gap-4
//             xl:grid-cols-[minmax(0,1fr)_350px]
//           "
//         >
//           {/* LEFT REPORT PANEL */}

//           <div
//             className="
//               min-w-0
//               w-full
//               overflow-visible
//               rounded-[14px]
//               border
//               border-[#d9d9d9]
//               bg-white
//               shadow-[0_2px_7px_rgba(0,0,0,0.18)]
//             "
//           >
//             <ReportHeader />

//             <ReportConfiguration />
//           </div>

//           {/* RIGHT SELECTED COLUMNS PANEL */}

//           <div
//             className="
//               min-w-0
//               w-full
//             "
//           >
//             <SelectedColumns />
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           FORM MASTER
          
//           IMPORTANT:
//           Existing FormMasterPage is rendered here when
//           Form Master tab is selected.
//       ===================================================== */}

//       {activeTab ===
//         "Form Master" && (
//         <div
//           className="
//             mt-4
//             w-full
//           "
//         >
//           <FormMasterPage />
//         </div>
//       )}

//       {/* =====================================================
//           MAIL MERGE
          
//           Existing MailMergePage is rendered here when
//           Mail Merge tab is selected.
//       ===================================================== */}

//       {activeTab ===
//         "Mail Merge" && (
//         <div
//           className="
//             mt-4
//             w-full
//           "
//         >
//           <MailMergePage />
//         </div>
//       )}

//       {/* =====================================================
//           FACTORY ACT FORMS
          
//           Existing functionality preserved.
//           No new functionality added here.
//       ===================================================== */}

//       {activeTab ===
//         "Factory Act Forms" && (
//         <div
//           className="
//             mt-0
//             w-full
//           "
//         >
//           <FactoryActFormsPage />
//         </div>
//       )}

//       {/* =====================================================
//           BACK CONFIRMATION MODAL
//       ===================================================== */}

//       {showBackConfirm && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-[10002]
//             flex
//             h-screen
//             w-screen
//             items-center
//             justify-center
//             bg-black/45
//             p-4
//           "
//           role="dialog"
//           aria-modal="true"
//           aria-labelledby="discard-confirm-title"
//         >
//           <div
//             className="
//               w-[min(480px,92vw)]
//               overflow-hidden
//               rounded-[7px]
//               bg-white
//               shadow-[0_12px_35px_rgba(0,0,0,0.28)]
//             "
//           >
//             {/* HEADER */}

//             <div
//               className="
//                 flex
//                 items-center
//                 gap-3
//                 border-b
//                 border-[#e6e8ec]
//                 bg-[#f8f9fc]
//                 px-5
//                 py-4
//               "
//             >
//               <Menu
//                 size={24}
//                 strokeWidth={2.5}
//                 className="text-[#e6c542]"
//               />

//               <h2
//                 id="discard-confirm-title"
//                 className="
//                   text-[20px]
//                   font-semibold
//                   text-[#e6c542]
//                 "
//               >
//                 Form Confirm
//               </h2>
//             </div>

//             {/* MESSAGE */}

//             <div
//               className="
//                 flex
//                 min-h-[95px]
//                 items-center
//                 justify-center
//                 border-b
//                 border-[#eee9d7]
//                 bg-[#fffdf2]
//                 px-5
//                 text-center
//               "
//             >
//               <p
//                 className="
//                   text-[19px]
//                   font-semibold
//                   leading-8
//                   text-[#e6c542]
//                 "
//               >
//                 Are you sure
//                 <br />
//                 You want to Discard your Changes!
//               </p>
//             </div>

//             {/* ACTIONS */}

//             <div
//               className="
//                 flex
//                 justify-end
//                 gap-3
//                 bg-[#f8f9fc]
//                 px-5
//                 py-4
//               "
//             >
//               <button
//                 type="button"
//                 onClick={handleCancelBack}
//                 className="
//                   flex
//                   h-[49px]
//                   min-w-[133px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[8px]
//                   border
//                   border-[#b9bec8]
//                   bg-white
//                   px-5
//                   text-[18px]
//                   font-medium
//                   text-[#667085]
//                   transition
//                   hover:bg-[#f8f9fb]
//                 "
//               >
//                 <X size={21} />
//                 Cancel
//               </button>

//               <button
//                 type="button"
//                 onClick={handleDiscardBack}
//                 className="
//                   flex
//                   h-[49px]
//                   min-w-[140px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[8px]
//                   bg-[#ffd400]
//                   px-5
//                   text-[18px]
//                   font-semibold
//                   text-[#111111]
//                   shadow-sm
//                   transition
//                   hover:bg-[#f0c900]
//                 "
//               >
//                 <Menu
//                   size={21}
//                   strokeWidth={2.5}
//                 />
//                 Discard
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           CREATE NEW FILE MODAL
//       ===================================================== */}

//       {showCreateFile && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-[10001]
//             flex
//             h-screen
//             w-screen
//             items-center
//             justify-center
//             overflow-auto
//             bg-black/45
//             p-5
//           "
//           role="dialog"
//           aria-modal="true"
//           aria-label="Create New File"
//         >
//           <div
//             className="
//               flex
//               h-[min(620px,88vh)]
//               max-h-[620px]
//               w-[min(610px,94vw)]
//               min-h-0
//               flex-col
//               overflow-hidden
//               rounded-[8px]
//               border
//               border-[#d8dce5]
//               bg-white
//               shadow-[0_12px_35px_rgba(0,0,0,0.22)]
//             "
//           >
//             {/* HEADER */}

//             <div
//               className="
//                 flex
//                 min-h-[60px]
//                 shrink-0
//                 items-center
//                 border-b
//                 border-[#e6e8ec]
//                 bg-[#f8f9fc]
//                 px-5
//               "
//             >
//               <h2
//                 className="
//                   text-[20px]
//                   font-semibold
//                   text-[#172033]
//                 "
//               >
//                 Create New File
//               </h2>
//             </div>

//             {/* BODY */}

//             <div
//               className="
//                 min-h-0
//                 flex-1
//                 overflow-y-auto
//                 bg-white
//                 px-6
//                 py-5
//               "
//             >
//               {/* SELECT STATE */}

//               <div className="mb-5">
//                 <label
//                   className="
//                     mb-2
//                     block
//                     text-[15px]
//                     font-medium
//                     text-[#202124]
//                   "
//                 >
//                   Select State
//                 </label>

//                 <select
//                   value={selectedState}
//                   onChange={(event) =>
//                     setSelectedState(
//                       event.target.value,
//                     )
//                   }
//                   className="
//                     h-[46px]
//                     w-full
//                     rounded-[6px]
//                     border
//                     border-[#dfe4ec]
//                     bg-[#f0f3f9]
//                     px-4
//                     text-[15px]
//                     text-[#344054]
//                     outline-none
//                     focus:border-[#b17869]
//                     focus:ring-1
//                     focus:ring-[#b17869]
//                   "
//                 >
//                   <option value="">
//                     Select State
//                   </option>
//                 </select>
//               </div>

//               {/* FILE NAME */}

//               <div className="mb-6">
//                 <label
//                   className="
//                     mb-2
//                     block
//                     text-[15px]
//                     font-medium
//                     text-[#202124]
//                   "
//                 >
//                   File Name
//                   <span className="text-[#c94a4a]">
//                     *
//                   </span>
//                 </label>

//                 <input
//                   value={newFileName}
//                   onChange={(event) =>
//                     setNewFileName(
//                       event.target.value,
//                     )
//                   }
//                   placeholder=""
//                   className="
//                     h-[46px]
//                     w-full
//                     rounded-[6px]
//                     border
//                     border-[#dfe4ec]
//                     bg-[#f0f3f9]
//                     px-4
//                     text-[15px]
//                     text-[#344054]
//                     outline-none
//                     focus:border-[#b17869]
//                     focus:ring-1
//                     focus:ring-[#b17869]
//                   "
//                 />
//               </div>

//               {/* FILE UPLOAD */}

//               <label
//                 htmlFor="factory-act-file-upload"
//                 onDragOver={(event) =>
//                   event.preventDefault()
//                 }
//                 onDrop={(event) => {
//                   event.preventDefault();
//                   handleFileSelection(
//                     event.dataTransfer.files?.[0] ??
//                       null,
//                   );
//                 }}
//                 className="
//                   flex
//                   min-h-[285px]
//                   cursor-pointer
//                   flex-col
//                   items-center
//                   justify-center
//                   rounded-[6px]
//                   border-2
//                   border-dashed
//                   border-[#b8b8b8]
//                   bg-white
//                   px-5
//                   text-center
//                   transition
//                   hover:border-[#b17869]
//                   hover:bg-[#fffaf8]
//                 "
//               >
//                 <UploadCloud
//                   size={31}
//                   strokeWidth={1.8}
//                   className="mb-3 text-[#b8b8b8]"
//                 />

//                 <span
//                   className="
//                     text-[17px]
//                     font-medium
//                     text-[#b8b8b8]
//                   "
//                 >
//                   Drag and drop
//                 </span>

//                 <span
//                   className="
//                     my-1
//                     text-[16px]
//                     text-[#b8b8b8]
//                   "
//                 >
//                   - or -
//                 </span>

//                 <span
//                   className="
//                     text-[17px]
//                     font-semibold
//                     text-[#b17869]
//                   "
//                 >
//                   Browse
//                 </span>

//                 {selectedFile && (
//                   <span
//                     className="
//                       mt-4
//                       max-w-full
//                       truncate
//                       text-[14px]
//                       font-medium
//                       text-[#7e4031]
//                     "
//                   >
//                     {selectedFile.name}
//                   </span>
//                 )}

//                 <input
//                   id="factory-act-file-upload"
//                   type="file"
//                   className="hidden"
//                   onChange={(event) => {
//                     handleFileSelection(
//                       event.target.files?.[0] ??
//                         null,
//                     );
//                   }}
//                 />
//               </label>
//             </div>

//             {/* FOOTER */}

//             <div
//               className="
//                 flex
//                 shrink-0
//                 justify-end
//                 gap-4
//                 border-t
//                 border-[#e6e8ec]
//                 bg-[#f8f9fc]
//                 px-5
//                 py-3
//               "
//             >
//               <button
//                 type="button"
//                 onClick={closeCreateFile}
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[120px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[8px]
//                   border
//                   border-[#b9bec8]
//                   bg-white
//                   px-5
//                   text-[16px]
//                   font-medium
//                   text-[#667085]
//                   transition
//                   hover:bg-[#f9fafb]
//                 "
//               >
//                 <X size={20} />
//                 Close
//               </button>

//               <button
//                 type="button"
//                 onClick={closeCreateFile}
//                 disabled={!newFileName.trim()}
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[120px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[8px]
//                   bg-[#7e4031]
//                   px-5
//                   text-[16px]
//                   font-semibold
//                   text-white
//                   shadow-sm
//                   transition
//                   hover:bg-[#6c3428]
//                   disabled:cursor-not-allowed
//                   disabled:opacity-50
//                 "
//               >
//                 <Bookmark
//                   size={19}
//                   strokeWidth={1.8}
//                 />
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* =====================================================
//           STORE TEMPLATE LIST MODAL
//       ===================================================== */}

//       {showStoreTemplates && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-[10000]
//             flex
//             h-screen
//             w-screen
//             items-center
//             justify-center
//             overflow-auto
//             bg-black/40
//             p-6
//           "
//           role="dialog"
//           aria-modal="true"
//           aria-label="Store Template List"
//         >
//           <div
//             className="
//               flex
//               h-[min(680px,82vh)]
//               max-h-[680px]
//               w-[min(1050px,92vw)]
//               max-w-[1050px]
//               min-h-0
//               flex-col
//               overflow-hidden
//               rounded-[8px]
//               border
//               border-[#d8dce5]
//               bg-white
//               shadow-[0_12px_35px_rgba(0,0,0,0.18)]
//             "
//           >
//             {/* HEADER */}
//             <div
//               className="
//                 flex
//                 min-h-[62px]
//                 shrink-0
//                 items-center
//                 justify-between
//                 border-b
//                 border-[#e6e8ec]
//                 bg-[#f8f9fc]
//                 px-5
//               "
//             >
//               <h2
//                 className="
//                   text-[19px]
//                   font-semibold
//                   text-[#172033]
//                 "
//               >
//                 Store Template List
//               </h2>

//               <select
//                 value={selectedState}
//                 onChange={(event) =>
//                   setSelectedState(event.target.value)
//                 }
//                 className="
//                   h-[40px]
//                   min-w-[190px]
//                   rounded-[8px]
//                   border
//                   border-[#e1e5ee]
//                   bg-[#f0f3f9]
//                   px-4
//                   text-[15px]
//                   text-[#344054]
//                   outline-none
//                   focus:border-[#b17869]
//                   focus:ring-1
//                   focus:ring-[#b17869]
//                 "
//               >
//                 <option value="">
//                   Select Select State
//                 </option>
//               </select>
//             </div>

//             {/* SEARCH + SELECT */}
//             <div
//               className="
//                 flex
//                 shrink-0
//                 items-center
//                 gap-4
//                 border-b
//                 border-[#e6e8ec]
//                 px-4
//                 py-3
//               "
//             >
//               <div className="relative flex-1">
//                 <Search
//                   size={21}
//                   className="
//                     pointer-events-none
//                     absolute
//                     left-4
//                     top-1/2
//                     -translate-y-1/2
//                     text-[#98a2b3]
//                   "
//                 />

//                 <input
//                   value={storeSearch}
//                   onChange={(event) =>
//                     setStoreSearch(event.target.value)
//                   }
//                   placeholder="Start Typing..."
//                   className="
//                     h-[42px]
//                     w-full
//                     rounded-[7px]
//                     border
//                     border-[#b17869]
//                     bg-[#fffaf8]
//                     pl-12
//                     pr-4
//                     text-[15px]
//                     text-[#344054]
//                     outline-none
//                     ring-1
//                     ring-[#b17869]
//                   "
//                 />
//               </div>

//               <input
//                 type="checkbox"
//                 checked={
//                   filteredStoreTemplates.length > 0 &&
//                   filteredStoreTemplates.every((template) =>
//                     selectedTemplateIds.includes(template.id),
//                   )
//                 }
//                 onChange={(event) => {
//                   if (event.target.checked) {
//                     setSelectedTemplateIds(
//                       filteredStoreTemplates.map(
//                         (template) => template.id,
//                       ),
//                     );
//                   } else {
//                     setSelectedTemplateIds([]);
//                   }
//                 }}
//                 className="
//                   h-[19px]
//                   w-[19px]
//                   shrink-0
//                   accent-[#7e4031]
//                 "
//               />
//             </div>

//             {/* CONTENT */}
//             <div className="min-h-0 flex-1 overflow-y-auto bg-white px-5 py-3">
//               {storeLoading && (
//                 <p className="text-[16px] text-[#667085]">
//                   Loading...
//                 </p>
//               )}

//               {!storeLoading &&
//                 filteredStoreTemplates.length === 0 && (
//                   <p
//                     className="
//                       text-[17px]
//                       font-medium
//                       text-[#667085]
//                     "
//                   >
//                     No Files found for this state
//                   </p>
//                 )}

//               {!storeLoading &&
//                 filteredStoreTemplates.map((template) => (
//                   <label
//                     key={template.id}
//                     className="
//                       flex
//                       min-h-[48px]
//                       cursor-pointer
//                       items-center
//                       gap-3
//                       border-b
//                       border-[#eef0f3]
//                       text-[15px]
//                       text-[#344054]
//                     "
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedTemplateIds.includes(
//                         template.id,
//                       )}
//                       onChange={() =>
//                         toggleTemplate(template.id)
//                       }
//                       className="
//                         h-[19px]
//                         w-[19px]
//                         accent-[#7e4031]
//                       "
//                     />

//                     {template.name}
//                   </label>
//                 ))}
//             </div>

//             {/* FOOTER */}
//             <div
//               className="
//                 flex
//                 shrink-0
//                 justify-end
//                 gap-4
//                 border-t
//                 border-[#e6e8ec]
//                 bg-[#f8f9fc]
//                 px-5
//                 py-3
//               "
//             >
//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowStoreTemplates(false)
//                 }
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[110px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[8px]
//                   border
//                   border-[#b9bec8]
//                   bg-white
//                   px-5
//                   text-[16px]
//                   font-medium
//                   text-[#667085]
//                   hover:bg-[#f9fafb]
//                 "
//               >
//                 <X size={20} />
//                 Close
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setShowStoreTemplates(false)
//                 }
//                 className="
//                   flex
//                   h-[42px]
//                   min-w-[110px]
//                   items-center
//                   justify-center
//                   gap-2
//                   rounded-[8px]
//                   bg-[#7e4031]
//                   px-5
//                   text-[16px]
//                   font-semibold
//                   text-white
//                   shadow-sm
//                   hover:bg-[#6c3428]
//                 "
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";

import {
  Bookmark,
  ChevronLeft,
  Clock,
  FileText,
  ClipboardList,
  Mail,
  LayoutGrid,
  Search,
  X,
  UploadCloud,
  Menu,
  Plus,
  Filter,
  Copy,
  ChevronDown,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

import { saveGeneralReport } from "../api/generalReport.api";
import { getFactoryActForms } from "../api/factoryAct.api";

import ReportHeader from "../components/ReportHeader";
import ReportConfiguration from "../components/ReportConfiguration";
import SelectedColumns from "../components/SelectedColumns";

import FormMasterPage from "./FormMasterPage";
import MailMergePage from "./MailMergePage";
import FactoryActFormsPage from "./FactoryActFormsPage";


/* =====================================================
   MOBILE-SAFE STATE DROPDOWN

   Uses a normal-flow custom menu instead of the browser
   native select popup. This keeps the dropdown inside
   the responsive modal and avoids the default blue popup.
===================================================== */

type MobileSafeStateDropdownProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
};

function MobileSafeStateDropdown({
  value,
  placeholder,
  onChange,
  className = "",
}: MobileSafeStateDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    globalThis.document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      globalThis.document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, []);

  const handleSelect = (nextValue: string) => {
    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`w-full min-w-0 ${className}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`
          flex
          h-[46px]
          w-full
          min-w-0
          items-center
          justify-between
          gap-2
          rounded-[6px]
          border
          bg-[#f0f3f9]
          px-4
          text-left
          text-[15px]
          text-[#344054]
          outline-none
          transition
          ${
            open
              ? "border-[#7e4031] ring-1 ring-[#7e4031]"
              : "border-[#b17869]"
          }
        `}
      >
        <span className="min-w-0 flex-1 truncate">
          {value || placeholder}
        </span>

        <ChevronDown
          size={16}
          strokeWidth={1.8}
          className={`
            shrink-0
            text-[#555]
            transition-transform
            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="
            mt-1
            max-h-[150px]
            w-full
            min-w-0
            overflow-y-auto
            overflow-x-hidden
            rounded-[6px]
            border
            border-[#b17869]
            bg-white
            shadow-[0_4px_12px_rgba(0,0,0,0.18)]
          "
        >
          <button
            type="button"
            role="option"
            aria-selected={value === ""}
            onClick={() => handleSelect("")}
            className={`
              block
              min-h-[38px]
              w-full
              px-4
              py-2
              text-left
              text-[15px]
              transition
              ${
                value === ""
                  ? "bg-[#7e4031] font-medium text-white"
                  : "bg-white text-[#344054] hover:bg-[#f5ebe8]"
              }
            `}
          >
            {placeholder}
          </button>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   TOP NAVIGATION TABS
===================================================== */

const TABS = [
  {
    label: "Report Writer",
    icon: FileText,
  },
  {
    label: "Form Master",
    icon: LayoutGrid,
  },
  {
    label: "Mail Merge",
    icon: Mail,
  },
  {
    label: "Factory Act Forms",
    icon: ClipboardList,
  },
];

/* =====================================================
   GENERAL REPORT
===================================================== */

export default function GeneralReport() {
  const [selectedMailMergeMonth, setSelectedMailMergeMonth] =
    useState("Sep/2026");

  const [selectedMailMergeDocument, setSelectedMailMergeDocument] =
    useState("");

  const [openMailMergeDropdown, setOpenMailMergeDropdown] =
    useState<"document" | "month" | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  /* =====================================================
     ACTIVE TOP TAB

     URL is used so that nested pages such as
     Form Master and Mail Merge work correctly.
  ===================================================== */

  const getActiveTab = () => {
    if (
      location.pathname.includes(
        "/form_master"
      )
    ) {
      return "Form Master";
    }

    if (
      location.pathname.includes(
        "/mail_merge"
      )
    ) {
      return "Mail Merge";
    }

    if (
      location.pathname.includes(
        "/factory_act_forms"
      )
    ) {
      return "Factory Act Forms";
    }

    return "Report Writer";
  };

  const [activeTab, setActiveTab] =
    useState(getActiveTab());

  /* =====================================================
     SAVE STATE
  ===================================================== */

  const [saving, setSaving] =
    useState(false);

  /* =====================================================
     BACK CONFIRMATION MODAL
  ===================================================== */

  const [showBackConfirm, setShowBackConfirm] =
    useState(false);

  /* =====================================================
     DISCARD RESULT

     This is intentionally separate from the normal Report
     Writer state. The first screen remains unchanged.
     After Discard, the empty Report Writer screen shown in
     the reference image is displayed.
  ===================================================== */

  const [showDiscardedReportWriter, setShowDiscardedReportWriter] =
    useState(false);

  const handleBackClick = () => {
    setShowBackConfirm(true);
  };

  const handleCancelBack = () => {
    setShowBackConfirm(false);
  };

  const handleDiscardBack = () => {
    // Close the confirmation modal.
    setShowBackConfirm(false);

    // Return to Report Writer and show the exact empty state
    // requested for the Discard action.
    setActiveTab("Report Writer");
    setShowDiscardedReportWriter(true);
  };

  /* =====================================================
     STORE TEMPLATE MODAL
  ===================================================== */

  const [showStoreTemplates, setShowStoreTemplates] =
    useState(false);

  const [storeTemplates, setStoreTemplates] =
    useState<Array<{ id: string | number; name: string }>>([]);

  const [storeLoading, setStoreLoading] =
    useState(false);

  const [storeSearch, setStoreSearch] =
    useState("");

  const [selectedTemplateIds, setSelectedTemplateIds] =
    useState<Array<string | number>>([]);

  const [selectedState, setSelectedState] =
    useState("");

  /* =====================================================
     CREATE NEW FACTORY ACT FILE MODAL
  ===================================================== */

  const [showCreateFile, setShowCreateFile] =
    useState(false);

  const [newFileName, setNewFileName] =
    useState("");

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const openCreateFile = () => {
    setNewFileName("");
    setSelectedFile(null);
    setShowCreateFile(true);
  };

  const closeCreateFile = () => {
    setShowCreateFile(false);
    setNewFileName("");
    setSelectedFile(null);
  };

  const handleFileSelection = (
    file: File | null,
  ) => {
    if (!file) return;

    setSelectedFile(file);

    if (!newFileName) {
      setNewFileName(file.name);
    }
  };

  const openStoreTemplates = async () => {
    setShowStoreTemplates(true);
    setStoreSearch("");
    setSelectedState("");
    setSelectedTemplateIds([]);

    try {
      setStoreLoading(true);
      const result = await getFactoryActForms();
      setStoreTemplates(result);
    } catch (error) {
      console.error("Unable to load store templates:", error);
      setStoreTemplates([]);
    } finally {
      setStoreLoading(false);
    }
  };

  const toggleTemplate = (id: string | number) => {
    setSelectedTemplateIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  const filteredStoreTemplates = storeTemplates.filter((template) =>
    template.name
      .toLowerCase()
      .includes(storeSearch.toLowerCase()),
  );

  /* =====================================================
     SAVE REPORT
     EXISTING FUNCTIONALITY PRESERVED
  ===================================================== */

  const handleSave = async () => {
    try {
      setSaving(true);

      const reportData = {
        reportName:
          "Employee Audit Report_v2",

        customQuery: false,

        pinReportTo:
          "General Report / Analytics",

        selectedFields: [
          "Ref No.",
          "Employee name",
        ],

        selectedColumns: [
          "Ref No",
          "Empname",
          "Month Name",
        ],
      };

      const response =
        await saveGeneralReport(
          reportData
        );

      console.log(
        "General Report saved:",
        response
      );

      alert(
        "General Report saved successfully."
      );
    } catch (error) {
      console.error(
        "Save General Report error:",
        error
      );

      alert(
        "Unable to save General Report."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     TAB NAVIGATION
  ===================================================== */

  const handleTabClick = (
    label: string
  ) => {
    setActiveTab(label);

    // Any manual tab selection returns to the normal page state.
    setShowDiscardedReportWriter(false);

    if (
      label ===
      "Report Writer"
    ) {
      navigate(
        "/koundinyasatech/admin/insights/general-report"
      );

      return;
    }

    if (
      label ===
      "Form Master"
    ) {
      navigate(
        "/koundinyasatech/admin/insights/general-report/form_master"
      );

      return;
    }

    if (
      label ===
      "Mail Merge"
    ) {
      navigate(
        "/koundinyasatech/admin/insights/general-report/mail_merge"
      );

      return;
    }

    if (
      label ===
      "Factory Act Forms"
    ) {
      navigate(
        "/koundinyasatech/admin/insights/general-report/factory_act_forms"
      );

      return;
    }
  };

  return (
    <div
      className="
        min-h-screen
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
        bg-[#f5f6f8]
        p-3
        sm:p-4
      "
    >
      {/* =====================================================
          TOP NAVIGATION
      ===================================================== */}

      <div
        className="
          flex
          min-h-[58px]
          w-full
          min-w-0
          max-w-full
          flex-col
          items-stretch
          justify-between
          gap-2
          overflow-hidden
          rounded-[12px]
          border
          border-[#c9a79d]
          bg-[#fff9f7]
          px-2
          py-2
          sm:flex-row
          sm:items-center
          sm:gap-3
          sm:px-4
        "
      >
        {/* =================================================
            LEFT NAVIGATION TABS
        ================================================= */}

        <div
          className="
            flex
            w-full
            min-w-0
            max-w-full
            flex-1
            items-center
            gap-2
            overflow-x-auto
            overflow-y-hidden
            scrollbar-none
          "
        >
          {TABS.map(
            ({
              label,
              icon: Icon,
            }) => {
              const isActive =
                activeTab === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    handleTabClick(
                      label
                    )
                  }
                  className={`
                    flex
                    h-[36px]
                    min-w-[145px]
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-[7px]
                    border
                    px-3
                    text-[12px]
                    sm:min-w-[182px]
                    sm:px-4
                    sm:text-[13px]
                    font-medium
                    transition-all

                    ${
                      isActive
                        ? label === "Factory Act Forms"
                          ? `
                              border-[#b17869]
                              bg-white
                              text-[#7e4031]
                              shadow-sm
                            `
                          : `
                              border-[#b17869]
                              bg-white
                              text-[#956050]
                              shadow-sm
                            `
                        : `
                          border-[#e2e2e2]
                          bg-white
                          text-[#5d6268]
                          hover:border-[#c9a79d]
                        `
                    }
                  `}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.8}
                  />

                  <span>
                    {label}
                  </span>
                </button>
              );
            }
          )}
        </div>

        {/* =================================================
            RIGHT ACTION BUTTONS
        ================================================= */}

        <div
          className="
            flex
            w-full
            min-w-0
            shrink-0
            flex-wrap
            items-center
            justify-start
            gap-2
            border-t
            border-[#ead9d4]
            pt-2
            sm:w-auto
            sm:justify-end
            sm:border-t-0
            sm:pt-0
          "
        >
          {activeTab === "Mail Merge" ? (
            <>
              {/* SELECT DOCUMENT */}
              <div className="relative z-[60]">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMailMergeDropdown((current) =>
                      current === "document" ? null : "document"
                    )
                  }
                  className={`
                    flex
                    h-[38px]
                    w-[190px]
                    items-center
                    justify-between
                    rounded-[7px]
                    border
                    bg-white
                    px-3
                    text-left
                    text-[13px]
                    font-medium
                    outline-none
                    transition
                    ${
                      openMailMergeDropdown === "document"
                        ? "border-[#7e4031] ring-1 ring-[#7e4031]"
                        : "border-[#e1e4e8]"
                    }
                  `}
                >
                  <span className="truncate text-[#555]">
                    {selectedMailMergeDocument || "Select Document"}
                  </span>
                  <ChevronDown
                    size={15}
                    className={`shrink-0 text-[#777] transition-transform ${
                      openMailMergeDropdown === "document" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMailMergeDropdown === "document" && (
                  <div className="absolute left-0 top-[42px] z-[100] w-[190px] overflow-hidden rounded-[6px] border border-[#d8d8d8] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.16)]">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedMailMergeDocument("");
                        setOpenMailMergeDropdown(null);
                      }}
                      className={`block w-full px-3 py-2 text-left text-[13px] transition ${
                        selectedMailMergeDocument === ""
                          ? "bg-[#7e4031] text-white"
                          : "text-[#555] hover:bg-[#f5ebe8]"
                      }`}
                    >
                      Select Document
                    </button>
                  </div>
                )}
              </div>

              {/* MONTH */}
              <div className="relative z-[60]">
                <button
                  type="button"
                  onClick={() =>
                    setOpenMailMergeDropdown((current) =>
                      current === "month" ? null : "month"
                    )
                  }
                  className={`
                    flex
                    h-[38px]
                    w-[155px]
                    items-center
                    justify-between
                    rounded-[7px]
                    border
                    bg-white
                    px-3
                    text-left
                    text-[13px]
                    font-medium
                    text-[#555]
                    outline-none
                    transition
                    ${
                      openMailMergeDropdown === "month"
                        ? "border-[#7e4031] ring-1 ring-[#7e4031]"
                        : "border-[#e1e4e8]"
                    }
                  `}
                >
                  <span>{selectedMailMergeMonth || "Select"}</span>
                  <ChevronDown
                    size={15}
                    className={`shrink-0 text-[#777] transition-transform ${
                      openMailMergeDropdown === "month" ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {openMailMergeDropdown === "month" && (
                  <div className="absolute left-0 top-[42px] z-[100] w-[155px] overflow-hidden rounded-[6px] border border-[#d8d8d8] bg-white shadow-[0_6px_16px_rgba(0,0,0,0.16)]">
                    {[
                      "Select",
                      "Sep/2026",
                      "Aug/2026",
                      "Jul/2026",
                      "Jun/2026",
                      "May/2026",
                      "Apr/2026",
                      "Mar/2026",
                      "Feb/2026",
                    ].map((month) => {
                      const value = month === "Select" ? "" : month;
                      const isSelected = selectedMailMergeMonth === value;

                      return (
                        <button
                          key={month}
                          type="button"
                          onClick={() => {
                            setSelectedMailMergeMonth(value);
                            setOpenMailMergeDropdown(null);
                          }}
                          className={`block w-full px-3 py-2 text-left text-[13px] transition ${
                            isSelected
                              ? "bg-[#7e4031] font-semibold text-white"
                              : "text-[#555] hover:bg-[#f5ebe8]"
                          }`}
                        >
                          {month}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ATTACH DOCUMENT TO ESS */}
              <button
                type="button"
                disabled
                className="
                  flex
                  h-[38px]
                  w-[170px]
                  items-center
                  justify-center
                  rounded-[7px]
                  bg-[#d8d8d8]
                  px-3
                  text-[12px]
                  font-medium
                  leading-4
                  text-[#999]
                "
              >
                Attach Document To
                <br />
                ESS
              </button>

              {/* GENERATE */}
              <button
                type="button"
                disabled
                className="
                  h-[38px]
                  min-w-[105px]
                  rounded-[7px]
                  bg-[#d8d8d8]
                  px-4
                  text-[13px]
                  font-medium
                  text-[#999]
                "
              >
                Generate
              </button>

              {/* SEND MAIL */}
              <button
                type="button"
                disabled
                className="
                  h-[38px]
                  min-w-[105px]
                  rounded-[7px]
                  bg-[#d8d8d8]
                  px-4
                  text-[13px]
                  font-medium
                  text-[#999]
                "
              >
                Send Mail
              </button>

              {/* FILTER */}
              <button
                type="button"
                title="Filter"
                className="
                  flex
                  h-[37px]
                  w-[28px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#667085]
                "
              >
                <Filter size={18} strokeWidth={1.8} />
              </button>

              {/* CLOCK */}
              <button
                type="button"
                title="History"
                className="
                  flex
                  h-[37px]
                  w-[28px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#667085]
                "
              >
                <Clock size={19} strokeWidth={1.8} />
              </button>
            </>
          ) : showDiscardedReportWriter && activeTab === "Report Writer" ? (
            <>
              {/* PAYMONTH */}
              <button
                type="button"
                className="
                  flex
                  h-[38px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[7px]
                  bg-[#7e4031]
                  px-4
                  text-[13px]
                  font-medium
                  text-white
                  shadow-sm
                "
              >
                Paymonth
                <ChevronDown size={15} strokeWidth={2} />
              </button>

              {/* CLOCK */}
              <button
                type="button"
                title="History"
                className="
                  flex
                  h-[37px]
                  w-[32px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#5d6268]
                "
              >
                <Clock size={18} strokeWidth={1.8} />
              </button>

              {/* FILTER */}
              <button
                type="button"
                title="Filter"
                className="
                  flex
                  h-[37px]
                  w-[28px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#5d6268]
                "
              >
                <Filter size={17} strokeWidth={1.8} />
              </button>

              {/* COPY */}
              <button
                type="button"
                title="Copy"
                className="
                  flex
                  h-[37px]
                  w-[28px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#5d6268]
                "
              >
                <Copy size={17} strokeWidth={1.8} />
              </button>
            </>
          ) : activeTab === "Factory Act Forms" ? (
            <>
              <button
                type="button"
                onClick={openStoreTemplates}
                className="
                  flex
                  h-[38px]
                  items-center
                  rounded-full
                  bg-[#f1f1f1]
                  px-5
                  text-[14px]
                  font-medium
                  text-[#202124]
                  shadow-sm
                  transition
                  hover:bg-[#e7e7e7]
                "
              >
                Download Template From Store
              </button>

              <button
                type="button"
                title="Add Factory Act Form"
                onClick={openCreateFile}
                className="
                  flex
                  h-[38px]
                  w-[38px]
                  items-center
                  justify-center
                  rounded-full
                  text-[#7e4031]
                  transition
                  hover:bg-[#f8eeeb]
                "
              >
                <span className="text-[25px] leading-none">+</span>
              </button>
            </>
          ) : (
            <>
              {/* BACK */}
              <button
                type="button"
                onClick={handleBackClick}
                className="
                  flex
                  h-[37px]
                  min-w-[84px]
                  items-center
                  justify-center
                  gap-1
                  rounded-[7px]
                  bg-[#7e4031]
                  px-4
                  text-[13px]
                  font-medium
                  text-white
                  transition-all
                  hover:bg-[#6c3428]
                "
              >
                <ChevronLeft size={15} />
                Back
              </button>

              {/* SAVE */}
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="
                  flex
                  h-[37px]
                  min-w-[84px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[7px]
                  bg-[#7e4031]
                  px-4
                  text-[13px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition-all
                  hover:bg-[#6c3428]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                <Bookmark size={15} strokeWidth={1.8} />
                {saving ? "Saving..." : "Save"}
              </button>

              {/* HISTORY */}
              <button
                type="button"
                title="History"
                className="
                  flex
                  h-[37px]
                  w-[32px]
                  shrink-0
                  items-center
                  justify-center
                  text-[#5d6268]
                "
              >
                <Clock size={18} strokeWidth={1.8} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* =====================================================
          REPORT WRITER
      ===================================================== */}

      {activeTab === "Report Writer" && showDiscardedReportWriter ? (
        /* =====================================================
           REPORT WRITER EMPTY STATE AFTER DISCARD
        ===================================================== */
        <div className="mt-4 w-full">
          {/* FILTER / QUERY AREA */}
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[198px_minmax(0,1fr)]">
            {/* QUERY SIDEBAR */}
            <div
              className="
                min-h-[70px]
                rounded-[10px]
                border
                border-[#dedede]
                bg-white
                lg:min-h-[614px]
              "
            >
              <div className="flex h-[50px] items-center justify-between border-b border-[#dedede] px-3">
                <span className="text-[13px] font-medium text-[#202124]">
                  Query
                </span>
                <button
                  type="button"
                  title="Add Query"
                  className="
                    flex h-[25px] w-[25px] items-center justify-center
                    rounded-[6px] border border-[#b17869] bg-white
                    text-[#7e4031]
                  "
                >
                  <Plus size={17} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* RIGHT CONTENT */}
            <div className="min-w-0">
              <div
                className="
                  rounded-[10px]
                  border
                  border-[#dedede]
                  bg-white
                  px-2.5
                  py-2.5
                "
              >
                {/* FILTER BUTTONS */}
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    "Branch",
                    "Salary Structure",
                    "Leave",
                    "Attendance",
                    "Designation",
                    "Emp Status",
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="
                        flex h-[28px] items-center gap-1.5 rounded-[6px]
                        border border-[#e4e8ef] bg-white px-2.5
                        text-[11px] font-medium text-[#344054]
                      "
                    >
                      {item}
                      <ChevronDown size={12} strokeWidth={1.8} />
                    </button>
                  ))}

                  <button
                    type="button"
                    className="ml-1 text-[11px] font-medium text-[#7e4031]"
                  >
                    <span className="mr-1 text-[15px]">×</span>Clear
                  </button>
                </div>

                {/* SEARCH + ADD FILTER + QUERY */}
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[220px] flex-1">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a2b3]"
                    />
                    <input
                      type="text"
                      placeholder="Search..."
                      className="
                        h-[28px] w-full rounded-[6px] border border-[#dfe4ec]
                        bg-white pl-8 pr-3 text-[11px] text-[#344054]
                        outline-none
                        placeholder:text-[#b0b6bf]
                      "
                    />
                  </div>

                  <button
                    type="button"
                    className="
                      flex h-[28px] items-center gap-1.5 rounded-[6px]
                      bg-[#9b6656] px-3 text-[11px] font-medium text-white
                    "
                  >
                    <Plus size={14} strokeWidth={2.2} />
                    Add Filter
                  </button>

                  <button
                    type="button"
                    className="
                      flex h-[28px] items-center gap-1.5 rounded-[6px]
                      border border-[#e4e8ef] bg-white px-3
                      text-[11px] font-medium text-[#344054]
                    "
                  >
                    Query
                    <ChevronDown size={12} strokeWidth={1.8} />
                  </button>
                </div>
              </div>

              {/* GROUP BY / ORDER BY */}
              <div
                className="
                  mt-3 flex min-h-[47px] items-center justify-between
                  rounded-[10px] border border-[#dedede] bg-white px-2.5
                "
              >
                <button
                  type="button"
                  className="
                    flex h-[28px] items-center rounded-[6px] border
                    border-[#e4e8ef] bg-white px-2.5 text-[11px]
                    font-medium text-[#344054]
                  "
                >
                  Group By :&nbsp; None
                </button>

                <button
                  type="button"
                  className="
                    flex h-[28px] items-center rounded-[6px] border
                    border-[#e4e8ef] bg-white px-2.5 text-[11px]
                    font-medium text-[#344054]
                  "
                >
                  Order By :&nbsp; None
                </button>
              </div>

              {/* EMPTY REPORT WRITER CARD */}
              <div
                className="
                  mt-3 flex min-h-[440px] items-center justify-center
                  rounded-[12px] border border-[#dedede] bg-white
                  shadow-[0_2px_8px_rgba(0,0,0,0.16)]
                "
              >
                <div className="flex flex-col items-center justify-center px-4 text-center">
                  <img
                    src="/report-writer-empty.png"
                    alt=""
                    className="mb-1 h-auto max-h-[190px] w-[270px] max-w-full object-contain"
                  />
                  <p className="text-[12px] font-medium text-[#333333]">
                    Did not find any report writer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab ===
        "Report Writer" && (
        <div
          className="
            mt-3
            grid
            w-full
            min-w-0
            max-w-full
            grid-cols-1
            items-start
            gap-3
            sm:mt-4
            sm:gap-4
            xl:grid-cols-[minmax(0,1fr)_350px]
          "
        >
          {/* LEFT REPORT PANEL */}

          <div
            className="
              order-1
              min-w-0
              w-full
              max-w-full
              overflow-visible
              rounded-[14px]
              border
              border-[#d9d9d9]
              bg-white
              shadow-[0_2px_7px_rgba(0,0,0,0.18)]
            "
          >
            <ReportHeader />

            <ReportConfiguration />
          </div>

          {/* RIGHT SELECTED COLUMNS PANEL */}

          <div
            className="
              order-2
              min-w-0
              w-full
              max-w-full
              pb-2
            "
          >
            <SelectedColumns />
          </div>
        </div>
      )}

      {/* =====================================================
          FORM MASTER
          
          IMPORTANT:
          Existing FormMasterPage is rendered here when
          Form Master tab is selected.
      ===================================================== */}

      {activeTab ===
        "Form Master" && (
        <div
          className="
            mt-4
            w-full
          "
        >
          <FormMasterPage />
        </div>
      )}

      {/* =====================================================
          MAIL MERGE
          
          Existing MailMergePage is rendered here when
          Mail Merge tab is selected.
      ===================================================== */}

      {activeTab ===
        "Mail Merge" && (
        <div
          className="
            mt-4
            w-full
          "
        >
          <MailMergePage />
        </div>
      )}

      {/* =====================================================
          FACTORY ACT FORMS
          
          Existing functionality preserved.
          No new functionality added here.
      ===================================================== */}

      {activeTab ===
        "Factory Act Forms" && (
        <div
          className="
            mt-0
            w-full
          "
        >
          <FactoryActFormsPage />
        </div>
      )}

      {/* =====================================================
          BACK CONFIRMATION MODAL
      ===================================================== */}

      {showBackConfirm && (
        <div
          className="
            fixed
            inset-0
            z-[10002]
            flex
            h-screen
            w-screen
            items-center
            justify-center
            bg-black/45
            p-4
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="discard-confirm-title"
        >
          <div
            className="
              w-[min(480px,92vw)]
              overflow-hidden
              rounded-[7px]
              bg-white
              shadow-[0_12px_35px_rgba(0,0,0,0.28)]
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                items-center
                gap-3
                border-b
                border-[#e6e8ec]
                bg-[#f8f9fc]
                px-4
                py-3
                sm:px-5
                sm:py-4
              "
            >
              <Menu
                size={24}
                strokeWidth={2.5}
                className="text-[#e6c542]"
              />

              <h2
                id="discard-confirm-title"
                className="
                  text-[20px]
                  font-semibold
                  text-[#e6c542]
                "
              >
                Form Confirm
              </h2>
            </div>

            {/* MESSAGE */}

            <div
              className="
                flex
                min-h-[95px]
                items-center
                justify-center
                border-b
                border-[#eee9d7]
                bg-[#fffdf2]
                px-5
                text-center
              "
            >
              <p
                className="
                  text-[19px]
                  font-semibold
                  leading-8
                  text-[#e6c542]
                "
              >
                Are you sure
                <br />
                You want to Discard your Changes!
              </p>
            </div>

            {/* ACTIONS */}

            <div
              className="
                flex
                flex-wrap
                justify-end
                gap-3
                bg-[#f8f9fc]
                px-5
                py-4
              "
            >
              <button
                type="button"
                onClick={handleCancelBack}
                className="
                  flex
                  h-[49px]
                  min-w-[133px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#b9bec8]
                  bg-white
                  px-5
                  text-[18px]
                  font-medium
                  text-[#667085]
                  transition
                  hover:bg-[#f8f9fb]
                "
              >
                <X size={21} />
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDiscardBack}
                className="
                  flex
                  h-[49px]
                  min-w-[140px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  bg-[#ffd400]
                  px-5
                  text-[18px]
                  font-semibold
                  text-[#111111]
                  shadow-sm
                  transition
                  hover:bg-[#f0c900]
                "
              >
                <Menu
                  size={21}
                  strokeWidth={2.5}
                />
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          CREATE NEW FILE MODAL
      ===================================================== */}

      {showCreateFile && (
        <div
          className="
            fixed
            inset-0
            z-[10001]
            flex
            h-screen
            w-screen
            items-center
            justify-center
            overflow-auto
            bg-black/45
            p-3
            sm:p-5
          "
          role="dialog"
          aria-modal="true"
          aria-label="Create New File"
        >
          <div
            className="
              flex
              h-[min(620px,90vh)]
              max-h-[620px]
              w-[calc(100vw-24px)]
              max-w-[610px]
              sm:w-[min(610px,94vw)]
              min-h-0
              flex-col
              overflow-hidden
              rounded-[8px]
              border
              border-[#d8dce5]
              bg-white
              shadow-[0_12px_35px_rgba(0,0,0,0.22)]
            "
          >
            {/* HEADER */}

            <div
              className="
                flex
                min-h-[56px]
                shrink-0
                items-center
                border-b
                border-[#e6e8ec]
                bg-[#f8f9fc]
                px-4
                sm:min-h-[60px]
                sm:px-5
              "
            >
              <h2
                className="
                  text-[17px]
                  font-semibold
                  text-[#172033]
                  sm:text-[20px]
                "
              >
                Create New File
              </h2>
            </div>

            {/* BODY */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                bg-white
                px-4
                py-4
                sm:px-6
                sm:py-5
              "
            >
              {/* SELECT STATE */}

              <div className="mb-5">
                <label
                  className="
                    mb-2
                    block
                    text-[15px]
                    font-medium
                    text-[#202124]
                  "
                >
                  Select State
                </label>

                <MobileSafeStateDropdown
                  value={selectedState}
                  placeholder="Select State"
                  onChange={setSelectedState}
                  className="w-full"
                />
              </div>

              {/* FILE NAME */}

              <div className="mb-6">
                <label
                  className="
                    mb-2
                    block
                    text-[15px]
                    font-medium
                    text-[#202124]
                  "
                >
                  File Name
                  <span className="text-[#c94a4a]">
                    *
                  </span>
                </label>

                <input
                  value={newFileName}
                  onChange={(event) =>
                    setNewFileName(
                      event.target.value,
                    )
                  }
                  placeholder=""
                  className="
                    h-[46px]
                    w-full
                    rounded-[6px]
                    border
                    border-[#dfe4ec]
                    bg-[#f0f3f9]
                    px-4
                    text-[15px]
                    text-[#344054]
                    outline-none
                    focus:border-[#b17869]
                    focus:ring-1
                    focus:ring-[#b17869]
                  "
                />
              </div>

              {/* FILE UPLOAD */}

              <label
                htmlFor="factory-act-file-upload"
                onDragOver={(event) =>
                  event.preventDefault()
                }
                onDrop={(event) => {
                  event.preventDefault();
                  handleFileSelection(
                    event.dataTransfer.files?.[0] ??
                      null,
                  );
                }}
                className="
                  flex
                  min-h-[285px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-[6px]
                  border-2
                  border-dashed
                  border-[#b8b8b8]
                  bg-white
                  px-5
                  text-center
                  transition
                  hover:border-[#b17869]
                  hover:bg-[#fffaf8]
                "
              >
                <UploadCloud
                  size={31}
                  strokeWidth={1.8}
                  className="mb-3 text-[#b8b8b8]"
                />

                <span
                  className="
                    text-[17px]
                    font-medium
                    text-[#b8b8b8]
                  "
                >
                  Drag and drop
                </span>

                <span
                  className="
                    my-1
                    text-[16px]
                    text-[#b8b8b8]
                  "
                >
                  - or -
                </span>

                <span
                  className="
                    text-[17px]
                    font-semibold
                    text-[#b17869]
                  "
                >
                  Browse
                </span>

                {selectedFile && (
                  <span
                    className="
                      mt-4
                      max-w-full
                      truncate
                      text-[14px]
                      font-medium
                      text-[#7e4031]
                    "
                  >
                    {selectedFile.name}
                  </span>
                )}

                <input
                  id="factory-act-file-upload"
                  type="file"
                  className="hidden"
                  onChange={(event) => {
                    handleFileSelection(
                      event.target.files?.[0] ??
                        null,
                    );
                  }}
                />
              </label>
            </div>

            {/* FOOTER */}

            <div
              className="
                flex
                shrink-0
                flex-wrap
                justify-end
                gap-3
                border-t
                border-[#e6e8ec]
                bg-[#f8f9fc]
                px-4
                py-3
                sm:gap-4
                sm:px-5
              "
            >
              <button
                type="button"
                onClick={closeCreateFile}
                className="
                  flex
                  h-[42px]
                  min-w-[120px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#b9bec8]
                  bg-white
                  px-5
                  text-[16px]
                  font-medium
                  text-[#667085]
                  transition
                  hover:bg-[#f9fafb]
                "
              >
                <X size={20} />
                Close
              </button>

              <button
                type="button"
                onClick={closeCreateFile}
                disabled={!newFileName.trim()}
                className="
                  flex
                  h-[42px]
                  min-w-[120px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  bg-[#7e4031]
                  px-5
                  text-[16px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#6c3428]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Bookmark
                  size={19}
                  strokeWidth={1.8}
                />
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          STORE TEMPLATE LIST MODAL
      ===================================================== */}

      {showStoreTemplates && (
        <div
          className="
            fixed
            inset-0
            z-[10000]
            flex
            h-screen
            w-screen
            items-center
            justify-center
            overflow-auto
            bg-black/40
            p-3
            sm:p-6
          "
          role="dialog"
          aria-modal="true"
          aria-label="Store Template List"
        >
          <div
            className="
              flex
              h-[min(680px,90vh)]
              max-h-[680px]
              w-[calc(100vw-24px)]
              max-w-[1050px]
              sm:w-[min(1050px,94vw)]
              min-h-0
              flex-col
              overflow-hidden
              rounded-[8px]
              border
              border-[#d8dce5]
              bg-white
              shadow-[0_12px_35px_rgba(0,0,0,0.18)]
            "
          >
            {/* HEADER */}
            <div
              className="
                flex
                min-h-[56px]
                w-full
                min-w-0
                shrink-0
                flex-col
                items-stretch
                justify-center
                gap-2
                border-b
                border-[#e6e8ec]
                bg-[#f8f9fc]
                px-4
                py-3
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-5
                sm:py-0
              "
            >
              <h2
                className="
                  text-[17px]
                  font-semibold
                  text-[#172033]
                  sm:text-[19px]
                "
              >
                Store Template List
              </h2>

              <MobileSafeStateDropdown
                value={selectedState}
                placeholder="Select Select State"
                onChange={setSelectedState}
                className="w-full sm:w-[190px]"
              />
            </div>

            {/* SEARCH + SELECT */}
            <div
              className="
                flex
                shrink-0
                items-center
                gap-4
                border-b
                border-[#e6e8ec]
                px-4
                py-3
              "
            >
              <div className="relative flex-1">
                <Search
                  size={21}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-[#98a2b3]
                  "
                />

                <input
                  value={storeSearch}
                  onChange={(event) =>
                    setStoreSearch(event.target.value)
                  }
                  placeholder="Start Typing..."
                  className="
                    h-[42px]
                    w-full
                    rounded-[7px]
                    border
                    border-[#b17869]
                    bg-[#fffaf8]
                    pl-12
                    pr-4
                    text-[15px]
                    text-[#344054]
                    outline-none
                    ring-1
                    ring-[#b17869]
                  "
                />
              </div>

              <input
                type="checkbox"
                checked={
                  filteredStoreTemplates.length > 0 &&
                  filteredStoreTemplates.every((template) =>
                    selectedTemplateIds.includes(template.id),
                  )
                }
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelectedTemplateIds(
                      filteredStoreTemplates.map(
                        (template) => template.id,
                      ),
                    );
                  } else {
                    setSelectedTemplateIds([]);
                  }
                }}
                className="
                  h-[19px]
                  w-[19px]
                  shrink-0
                  accent-[#7e4031]
                "
              />
            </div>

            {/* CONTENT */}
            <div className="min-h-0 flex-1 overflow-y-auto bg-white px-4 py-3 sm:px-5">
              {storeLoading && (
                <p className="text-[16px] text-[#667085]">
                  Loading...
                </p>
              )}

              {!storeLoading &&
                filteredStoreTemplates.length === 0 && (
                  <p
                    className="
                      text-[17px]
                      font-medium
                      text-[#667085]
                    "
                  >
                    No Files found for this state
                  </p>
                )}

              {!storeLoading &&
                filteredStoreTemplates.map((template) => (
                  <label
                    key={template.id}
                    className="
                      flex
                      min-h-[48px]
                      cursor-pointer
                      items-center
                      gap-3
                      border-b
                      border-[#eef0f3]
                      text-[15px]
                      text-[#344054]
                    "
                  >
                    <input
                      type="checkbox"
                      checked={selectedTemplateIds.includes(
                        template.id,
                      )}
                      onChange={() =>
                        toggleTemplate(template.id)
                      }
                      className="
                        h-[19px]
                        w-[19px]
                        accent-[#7e4031]
                      "
                    />

                    {template.name}
                  </label>
                ))}
            </div>

            {/* FOOTER */}
            <div
              className="
                flex
                shrink-0
                flex-wrap
                justify-end
                gap-3
                border-t
                border-[#e6e8ec]
                bg-[#f8f9fc]
                px-4
                py-3
                sm:gap-4
                sm:px-5
              "
            >
              <button
                type="button"
                onClick={() =>
                  setShowStoreTemplates(false)
                }
                className="
                  flex
                  h-[42px]
                  min-w-[110px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  border
                  border-[#b9bec8]
                  bg-white
                  px-5
                  text-[16px]
                  font-medium
                  text-[#667085]
                  hover:bg-[#f9fafb]
                "
              >
                <X size={20} />
                Close
              </button>

              <button
                type="button"
                onClick={() =>
                  setShowStoreTemplates(false)
                }
                className="
                  flex
                  h-[42px]
                  min-w-[110px]
                  items-center
                  justify-center
                  gap-2
                  rounded-[8px]
                  bg-[#7e4031]
                  px-5
                  text-[16px]
                  font-semibold
                  text-white
                  shadow-sm
                  hover:bg-[#6c3428]
                "
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}