// import DocumentPage from "../components/DocumentPage";

// export default function CompanyDocumentsPage() {
//   return <DocumentPage />;
// }




// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Clock } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   "Document",
//   "Contact Details",
//   "Subscription Details",
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   /*
//    * Detect active tab from current URL
//    */
//   const activeTab = location.pathname.endsWith("/contact-details")
//     ? "Contact Details"
//     : location.pathname.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   /*
//    * Tab navigation
//    */
//   const handleTabClick = (tab: string) => {
//     switch (tab) {
//       case "Document":
//         navigate(basePath);
//         break;

//       case "Contact Details":
//         navigate(`${basePath}/contact-details`);
//         break;

//       case "Subscription Details":
//         navigate(`${basePath}/subscription-details`);
//         break;

//       default:
//         break;
//     }
//   };

//   return (
//     <div className="w-full min-w-0 bg-[#F7F5FF] p-3 sm:p-4 lg:p-6">
      
//       {/* =========================================================
//           TOP NAVIGATION / ACTION BAR
//       ========================================================= */}
//       <div
//         className="
//           w-full
//           rounded-xl
//           bg-[#E8E0FF]
//           px-3 py-3
//           sm:px-5 sm:py-3
//           lg:px-6 lg:py-4
//         "
//       >
//         {/* =======================================================
//             TABS + ACTIONS
//         ======================================================= */}
//         <div
//           className="
//             flex
//             w-full
//             flex-col
//             gap-3
//             lg:flex-row
//             lg:items-center
//             lg:justify-between
//           "
//         >
//           {/* =====================================================
//               TABS
//           ===================================================== */}
//           <div
//             className="
//               flex
//               min-w-0
//               max-w-full
//               items-center
//               gap-5
//               overflow-x-auto
//               pb-1
//               scrollbar-hide
//               sm:gap-8
//               lg:gap-10
//               lg:overflow-visible
//               lg:pb-0
//             "
//           >
//             {tabs.map((tab) => {
//               const isActive = activeTab === tab;

//               return (
//                 <button
//                   key={tab}
//                   type="button"
//                   onClick={() => handleTabClick(tab)}
//                   className={`
//                     relative
//                     shrink-0
//                     whitespace-nowrap
//                     pb-2
//                     text-xs
//                     font-medium
//                     transition-colors
//                     sm:text-sm
//                     lg:text-[15px]
//                     ${
//                       isActive
//                         ? "text-[#6C4BFF]"
//                         : "text-slate-800 hover:text-[#6C4BFF]"
//                     }
//                   `}
//                 >
//                   {tab}

//                   {isActive && (
//                     <span
//                       className="
//                         absolute
//                         bottom-0
//                         left-0
//                         h-[2px]
//                         w-full
//                         rounded-full
//                         bg-[#6C4BFF]
//                       "
//                     />
//                   )}
//                 </button>
//               );
//             })}
//           </div>

//           {/* =====================================================
//               RIGHT ACTIONS
//           ===================================================== */}
//           <div
//             className="
//               flex
//               w-full
//               min-w-0
//               items-center
//               gap-2
//               sm:gap-3
//               lg:w-auto
//               lg:shrink-0
//             "
//           >
//             {/* SEARCH */}
//             <div
//               className="
//                 relative
//                 min-w-0
//                 flex-1
//                 lg:flex-none
//               "
//             >
//               <Search
//                 size={16}
//                 className="
//                   absolute
//                   left-3
//                   top-1/2
//                   -translate-y-1/2
//                   text-slate-400
//                   sm:left-4
//                 "
//               />

//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search..."
//                 className="
//                   h-9
//                   w-full
//                   rounded-full
//                   border
//                   border-slate-300
//                   bg-white
//                   pl-9
//                   pr-3
//                   text-xs
//                   text-slate-700
//                   outline-none
//                   placeholder:text-slate-400
//                   focus:border-[#6C4BFF]
//                   sm:h-10
//                   sm:pl-10
//                   sm:text-sm
//                   lg:w-64
//                 "
//               />
//             </div>

//             {/* ADD DOCUMENT */}
//             <button
//               type="button"
//               className="
//                 flex
//                 h-9
//                 shrink-0
//                 items-center
//                 justify-center
//                 gap-1.5
//                 rounded-md
//                 bg-[#6C4BFF]
//                 px-3
//                 text-xs
//                 font-medium
//                 text-white
//                 transition-colors
//                 hover:bg-[#5B3FE6]
//                 sm:h-10
//                 sm:gap-2
//                 sm:px-4
//                 sm:text-sm
//                 lg:px-5
//               "
//             >
//               <Plus size={16} />

//               <span className="hidden xs:inline sm:inline">
//                 Add Document
//               </span>

//               <span className="sm:hidden">
//                 Add
//               </span>
//             </button>

//             {/* CLOCK */}
//             <button
//               type="button"
//               title="History"
//               className="
//                 flex
//                 h-9
//                 w-9
//                 shrink-0
//                 items-center
//                 justify-center
//                 rounded-full
//                 transition-colors
//                 hover:bg-white/60
//                 sm:h-10
//                 sm:w-10
//               "
//             >
//               <Clock
//                 size={19}
//                 className="text-slate-600"
//               />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* =========================================================
//           PAGE CONTENT
//       ========================================================= */}
//       <div className="mt-4 min-w-0 sm:mt-5">
//         <Outlet />
//       </div>
//     </div>
//   );
// }







// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Clock, FileText, UserRound, CreditCard } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   { label: "Document", path: "", icon: FileText },
//   { label: "Contact Details", path: "contact-details", icon: UserRound },
//   { label: "Subscription Details", path: "subscription-details", icon: CreditCard },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   const activeTab = location.pathname.endsWith("/contact-details")
//     ? "Contact Details"
//     : location.pathname.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   const handleTabClick = (path: string) => {
//     navigate(path ? `${basePath}/${path}` : basePath);
//   };

//   return (
//     <div className="w-full min-w-0">
//       {/* TOP BAR – Figma style */}
//       <div
//         className="flex w-full flex-col gap-3 rounded-2xl px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4 sm:py-3"
//         style={{
//           backgroundColor: "#F3F0FF",
//           border: "1px solid #E9E5FF",
//         }}
//       >
//         {/* PILL TABS */}
//         <div className="flex min-w-0 items-center gap-2 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.label;
//             const Icon = tab.icon;

//             return (
//               <button
//                 key={tab.label}
//                 type="button"
//                 onClick={() => handleTabClick(tab.path)}
//                 className={`
//                   flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5
//                   text-[13px] font-medium whitespace-nowrap transition-all
//                   ${
//                     isActive
//                       ? "border-[#7C3AED] bg-white text-[#7C3AED] shadow-sm"
//                       : "border-transparent bg-white/70 text-slate-600 hover:bg-white"
//                   }
//                 `}
//               >
//                 <Icon
//                   size={14}
//                   strokeWidth={isActive ? 2 : 1.75}
//                   color={isActive ? "#7C3AED" : "#64748B"}
//                 />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* RIGHT ACTIONS */}
//         <div className="flex items-center gap-2 sm:gap-2.5">
//           {/* Search */}
//           <div className="relative min-w-0 flex-1 sm:flex-none">
//             <Search
//               size={15}
//               className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="h-9 w-full rounded-full border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#7C3AED] sm:w-44"
//             />
//           </div>

//           {/* Add Document */}
//           <button
//             type="button"
//             className="flex h-9 shrink-0 items-center gap-1.5 rounded-lg px-3.5 text-[13px] font-semibold text-white transition-colors hover:opacity-90"
//             style={{ backgroundColor: "#7C3AED" }}
//             onClick={() => {
//               // Dispatch event so DocumentPage can open modal
//               window.dispatchEvent(new CustomEvent("open-add-document-modal"));
//             }}
//           >
//             <Plus size={16} />
//             <span className="hidden sm:inline">Add Document</span>
//             <span className="sm:hidden">Add</span>
//           </button>

//           {/* History */}
//           <button
//             type="button"
//             title="History"
//             className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white/70"
//           >
//             <Clock size={18} />
//           </button>
//         </div>
//       </div>

//       {/* PAGE CONTENT */}
//       <div className="mt-4 min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }







// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Clock, FileText, UserRound, CreditCard } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   { label: "Document", path: "", icon: FileText },
//   { label: "Contact Details", path: "contact-details", icon: UserRound },
//   { label: "Subscription Details", path: "subscription-details", icon: CreditCard },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   const activeTab = location.pathname.endsWith("/contact-details")
//     ? "Contact Details"
//     : location.pathname.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   const handleTabClick = (path: string) => {
//     navigate(path ? `${basePath}/${path}` : basePath);
//   };

//   return (
//     <div className="w-full min-w-0">
//       {/* ===== FIGMA TOP BAR ===== */}
//       <div
//         className="flex w-full flex-col gap-2.5 rounded-[14px] px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-3"
//         style={{
//           backgroundColor: "#F5F3FF",
//           border: "1px solid #EDE9FE",
//         }}
//       >
//         {/* LEFT – PILL TABS */}
//         <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.label;
//             const Icon = tab.icon;

//             return (
//               <button
//                 key={tab.label}
//                 type="button"
//                 onClick={() => handleTabClick(tab.path)}
//                 className="flex h-[32px] shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium whitespace-nowrap transition-all"
//                 style={
//                   isActive
//                     ? {
//                         backgroundColor: "#FFFFFF",
//                         border: "1.5px solid #7C3AED",
//                         color: "#7C3AED",
//                         boxShadow: "0 1px 2px rgba(124,58,237,0.08)",
//                       }
//                     : {
//                         backgroundColor: "#FFFFFF",
//                         border: "1px solid #EDE9FE",
//                         color: "#64748B",
//                       }
//                 }
//               >
//                 <Icon
//                   size={13}
//                   strokeWidth={isActive ? 2 : 1.7}
//                   color={isActive ? "#7C3AED" : "#94A3B8"}
//                 />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* RIGHT – SEARCH + ADD + CLOCK */}
//         <div className="flex items-center gap-1.5 sm:gap-2">
//           {/* Search */}
//           <div className="relative min-w-0 flex-1 sm:flex-none">
//             <Search
//               size={14}
//               className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="h-[32px] w-full rounded-full border border-[#E9E5FF] bg-white pl-8 pr-3 text-[12.5px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#C4B5FD] sm:w-[140px]"
//             />
//           </div>

//           {/* Add Document – outline style like Figma */}
//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(new CustomEvent("open-add-document-modal"));
//             }}
//             className="flex h-[32px] shrink-0 items-center gap-1 rounded-full border border-[#7C3AED] bg-white px-3 text-[12.5px] font-medium text-[#7C3AED] transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Plus size={14} strokeWidth={2} />
//             <span className="hidden sm:inline">Add Document</span>
//             <span className="sm:hidden">Add</span>
//           </button>

//           {/* Clock */}
//           <button
//             type="button"
//             title="History"
//             className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white"
//           >
//             <Clock size={16} strokeWidth={1.7} />
//           </button>
//         </div>
//       </div>

//       {/* CONTENT */}
//       <div className="mt-3 min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }







// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Clock, FileText, UserRound, CreditCard } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   { label: "Document", path: "", icon: FileText },
//   { label: "Contact Details", path: "contact-details", icon: UserRound },
//   { label: "Subscription Details", path: "subscription-details", icon: CreditCard },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   const activeTab = location.pathname.endsWith("/contact-details")
//     ? "Contact Details"
//     : location.pathname.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   const handleTabClick = (path: string) => {
//     navigate(path ? `${basePath}/${path}` : basePath);
//   };

//   return (
//     <div className="w-full min-w-0">
//       {/* =========================================================
//           1. MAIN PILL TAB BAR
//       ========================================================= */}
//       <div
//         className="flex w-full flex-col gap-2.5 rounded-[14px] px-2.5 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-3"
//         style={{
//           backgroundColor: "#F5F3FF",
//           border: "1px solid #EDE9FE",
//         }}
//       >
//         {/* LEFT – PILL TABS */}
//         <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.label;
//             const Icon = tab.icon;

//             return (
//               <button
//                 key={tab.label}
//                 type="button"
//                 onClick={() => handleTabClick(tab.path)}
//                 className="flex h-[32px] shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium whitespace-nowrap transition-all"
//                 style={
//                   isActive
//                     ? {
//                         backgroundColor: "#FFFFFF",
//                         border: "1.5px solid #7C3AED",
//                         color: "#7C3AED",
//                         boxShadow: "0 1px 2px rgba(124,58,237,0.08)",
//                       }
//                     : {
//                         backgroundColor: "#FFFFFF",
//                         border: "1px solid #EDE9FE",
//                         color: "#64748B",
//                       }
//                 }
//               >
//                 <Icon
//                   size={13}
//                   strokeWidth={isActive ? 2 : 1.7}
//                   color={isActive ? "#7C3AED" : "#94A3B8"}
//                 />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* RIGHT – SEARCH + ADD + CLOCK */}
//         <div className="flex items-center gap-1.5 sm:gap-2">
//           <div className="relative min-w-0 flex-1 sm:flex-none">
//             <Search
//               size={14}
//               className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="h-[32px] w-full rounded-full border border-[#E9E5FF] bg-white pl-8 pr-3 text-[12.5px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#C4B5FD] sm:w-[140px]"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(new CustomEvent("open-add-document-modal"));
//             }}
//             className="flex h-[32px] shrink-0 items-center gap-1 rounded-full border border-[#7C3AED] bg-white px-3 text-[12.5px] font-medium text-[#7C3AED] transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Plus size={14} strokeWidth={2} />
//             <span className="hidden sm:inline">Add Document</span>
//             <span className="sm:hidden">Add</span>
//           </button>

//           <button
//             type="button"
//             title="History"
//             className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white"
//           >
//             <Clock size={16} strokeWidth={1.7} />
//           </button>
//         </div>
//       </div>

//       {/* =========================================================
//           2. SECOND TOOLBAR (list + close)
//       ========================================================= */}
//       <div
//         className="mt-2 flex h-9 items-center justify-between rounded-lg px-3"
//         style={{
//           backgroundColor: "#F3F4F6",
//           border: "1px solid #E5E7EB",
//         }}
//       >
//         {/* Left – list icon */}
//         <button
//           type="button"
//           className="flex h-7 w-7 items-center justify-center rounded-md transition-colors hover:bg-white"
//           title="List view"
//         >
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
//             <rect x="2" y="3" width="12" height="2" rx="0.5" fill="#22C55E" />
//             <rect x="2" y="7" width="12" height="2" rx="0.5" fill="#22C55E" />
//             <rect x="2" y="11" width="12" height="2" rx="0.5" fill="#22C55E" />
//           </svg>
//         </button>

//         {/* Right – close */}
//         <button
//           type="button"
//           className="flex h-7 w-7 items-center justify-center rounded-md text-red-500 transition-colors hover:bg-white"
//           title="Clear"
//         >
//           <svg
//             width="14"
//             height="14"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//           >
//             <path d="M3 3l8 8M11 3l-8 8" />
//           </svg>
//         </button>
//       </div>

//       {/* =========================================================
//           3. PAGE CONTENT
//       ========================================================= */}
//       <div className="mt-3 min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }







// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Clock, FileText, UserRound, CreditCard } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   { label: "Document", path: "", icon: FileText },
//   { label: "Contact Details", path: "contact-details", icon: UserRound },
//   { label: "Subscription Details", path: "subscription-details", icon: CreditCard },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   const activeTab = location.pathname.endsWith("/contact-details")
//     ? "Contact Details"
//     : location.pathname.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   const handleTabClick = (path: string) => {
//     navigate(path ? `${basePath}/${path}` : basePath);
//   };

//   return (
//     <div className="w-full min-w-0">
//       {/* =========================================================
//           1. TOP NAV BAR – Figma
//       ========================================================= */}
//       <div
//         className="flex w-full items-center justify-between gap-3 rounded-[12px] px-2.5 py-2"
//         style={{
//           backgroundColor: "#F5F3FF",
//           border: "1px solid #EDE9FE",
//         }}
//       >
//         {/* LEFT – tabs */}
//         <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.label;
//             const Icon = tab.icon;

//             return (
//               <button
//                 key={tab.label}
//                 type="button"
//                 onClick={() => handleTabClick(tab.path)}
//                 className="flex h-[30px] shrink-0 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium whitespace-nowrap transition-all"
//                 style={
//                   isActive
//                     ? {
//                         backgroundColor: "#FFFFFF",
//                         border: "1.5px solid #7C3AED",
//                         color: "#7C3AED",
//                       }
//                     : {
//                         backgroundColor: "#FFFFFF",
//                         border: "1px solid #EDE9FE",
//                         color: "#64748B",
//                       }
//                 }
//               >
//                 <Icon
//                   size={13}
//                   strokeWidth={isActive ? 2 : 1.7}
//                   color={isActive ? "#7C3AED" : "#94A3B8"}
//                 />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* RIGHT – search + add + clock */}
//         <div className="flex shrink-0 items-center gap-1.5">
//           <div className="relative">
//             <Search
//               size={13}
//               className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="h-[30px] w-[120px] rounded-full border border-[#E9E5FF] bg-white pl-8 pr-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#C4B5FD]"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(new CustomEvent("open-add-document-modal"));
//             }}
//             className="flex h-[30px] items-center gap-1 rounded-full border border-[#7C3AED] bg-white px-3 text-[12.5px] font-medium text-[#7C3AED] transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Plus size={13} strokeWidth={2} />
//             <span>Add Document</span>
//           </button>

//           <button
//             type="button"
//             title="History"
//             className="flex h-[30px] w-[30px] items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-white"
//           >
//             <Clock size={15} strokeWidth={1.7} />
//           </button>
//         </div>
//       </div>

//       {/* =========================================================
//           2. SECOND TOOLBAR – Figma (list left, X right)
//       ========================================================= */}
//       <div
//         className="mt-2 flex h-[32px] items-center justify-between rounded-[8px] px-2.5"
//         style={{
//           backgroundColor: "#F3F4F6",
//           border: "1px solid #E5E7EB",
//         }}
//       >
//         {/* Left – green list */}
//         <button
//           type="button"
//           className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-white"
//           title="List view"
//         >
//           <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//             <rect x="2" y="3.5" width="12" height="1.8" rx="0.4" fill="#22C55E" />
//             <rect x="2" y="7.1" width="12" height="1.8" rx="0.4" fill="#22C55E" />
//             <rect x="2" y="10.7" width="12" height="1.8" rx="0.4" fill="#22C55E" />
//           </svg>
//         </button>

//         {/* Right – red X */}
//         <button
//           type="button"
//           className="flex h-6 w-6 items-center justify-center rounded text-[#EF4444] transition-colors hover:bg-white"
//           title="Clear"
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//           >
//             <path d="M3 3l8 8M11 3l-8 8" />
//           </svg>
//         </button>
//       </div>

//       {/* =========================================================
//           3. CONTENT
//       ========================================================= */}
//       <div className="mt-3 min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }








// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import { Search, Plus, Clock, FileText, UserRound, CreditCard } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   { label: "Document", path: "", icon: FileText },
//   { label: "Contact Details", path: "contact-details", icon: UserRound },
//   { label: "Subscription Details", path: "subscription-details", icon: CreditCard },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   const activeTab = location.pathname.endsWith("/contact-details")
//     ? "Contact Details"
//     : location.pathname.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   const handleTabClick = (path: string) => {
//     navigate(path ? `${basePath}/${path}` : basePath);
//   };

//   return (
//     <div className="w-full min-w-0">
//       {/* =========================================================
//           1. TOP NAV – each tab is a BOX
//       ========================================================= */}
//       <div
//         className="flex w-full items-center justify-between gap-3 rounded-[12px] px-2.5 py-2"
//         style={{
//           backgroundColor: "#F5F3FF",
//           border: "1px solid #EDE9FE",
//         }}
//       >
//         {/* LEFT – tab boxes */}
//         <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.label;
//             const Icon = tab.icon;

//             return (
//               <button
//                 key={tab.label}
//                 type="button"
//                 onClick={() => handleTabClick(tab.path)}
//                 className="flex h-[30px] shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-[12.5px] font-medium whitespace-nowrap transition-all"
//                 style={
//                   isActive
//                     ? {
//                         backgroundColor: "#FFFFFF",
//                         border: "1.5px solid #7C3AED",
//                         color: "#7C3AED",
//                         boxShadow: "0 1px 2px rgba(124,58,237,0.1)",
//                       }
//                     : {
//                         backgroundColor: "#FFFFFF",
//                         border: "1px solid #DDD6FE",
//                         color: "#64748B",
//                       }
//                 }
//               >
//                 <Icon
//                   size={13}
//                   strokeWidth={isActive ? 2 : 1.7}
//                   color={isActive ? "#7C3AED" : "#94A3B8"}
//                 />
//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* RIGHT – search + add + clock (also boxed) */}
//         <div className="flex shrink-0 items-center gap-1.5">
//           <div className="relative">
//             <Search
//               size={13}
//               className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="h-[30px] w-[120px] rounded-[8px] border border-[#DDD6FE] bg-white pl-8 pr-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#C4B5FD]"
//             />
//           </div>

//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(new CustomEvent("open-add-document-modal"));
//             }}
//             className="flex h-[30px] items-center gap-1 rounded-[8px] border border-[#7C3AED] bg-white px-3 text-[12.5px] font-medium text-[#7C3AED] transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Plus size={13} strokeWidth={2} />
//             <span>Add Document</span>
//           </button>

//           <button
//             type="button"
//             title="History"
//             className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#DDD6FE] bg-white text-slate-500 transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Clock size={15} strokeWidth={1.7} />
//           </button>
//         </div>
//       </div>

//       {/* =========================================================
//           2. SECOND BAR – list + X together on LEFT (Figma)
//       ========================================================= */}
//       <div
//         className="mt-2 flex h-[32px] items-center gap-1 rounded-[8px] px-2"
//         style={{
//           backgroundColor: "#F3F4F6",
//           border: "1px solid #E5E7EB",
//         }}
//       >
//         {/* Green list */}
//         <button
//           type="button"
//           className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-white"
//           title="List view"
//         >
//           <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
//             <rect x="2" y="3.5" width="12" height="1.8" rx="0.4" fill="#22C55E" />
//             <rect x="2" y="7.1" width="12" height="1.8" rx="0.4" fill="#22C55E" />
//             <rect x="2" y="10.7" width="12" height="1.8" rx="0.4" fill="#22C55E" />
//           </svg>
//         </button>

//         {/* Red X – next to list */}
//         <button
//           type="button"
//           className="flex h-6 w-6 items-center justify-center rounded text-[#EF4444] transition-colors hover:bg-white"
//           title="Clear"
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//           >
//             <path d="M3 3l8 8M11 3l-8 8" />
//           </svg>
//         </button>
//       </div>

//       {/* =========================================================
//           3. CONTENT
//       ========================================================= */}
//       <div className="mt-3 min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }












// import { Outlet, NavLink, useParams } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   Clock,
//   FileText,
//   UserRound,
//   CreditCard,
// } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   { label: "Document", path: "", icon: FileText },
//   {
//     label: "Contact Details",
//     path: "contact-details",
//     icon: UserRound,
//   },
//   {
//     label: "Subscription Details",
//     path: "subscription-details",
//     icon: CreditCard,
//   },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   return (
//     <div className="w-full min-w-0">

//       {/* =========================================================
//           1. TOP NAV
//       ========================================================= */}
//       <div
//         className="flex w-full items-center justify-between gap-3 rounded-[12px] px-2.5 py-2"
//         style={{
//           backgroundColor: "#F5F3FF",
//           border: "1px solid #EDE9FE",
//         }}
//       >
//         {/* LEFT - TABS */}
//         <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">

//           {tabs.map((tab) => {
//             const Icon = tab.icon;

//             const tabPath = tab.path
//               ? `${basePath}/${tab.path}`
//               : basePath;

//             return (
//               <NavLink
//                 key={tab.label}
//                 to={tabPath}
//                 end={tab.path === ""}
//                 className="shrink-0"
//               >
//                 {({ isActive }) => (
//                   <div
//                     className="flex h-[30px] items-center gap-1.5 rounded-[8px] px-3 text-[12.5px] font-medium whitespace-nowrap transition-all"
//                     style={
//                       isActive
//                         ? {
//                             backgroundColor: "#FFFFFF",
//                             border: "1px solid #7C3AED",
//                             color: "#7C3AED",
//                             boxShadow:
//                               "0 1px 2px rgba(124,58,237,0.1)",
//                           }
//                         : {
//                             backgroundColor: "#FFFFFF",
//                             border: "1px solid #DDD6FE",
//                             color: "#64748B",
//                           }
//                     }
//                   >
//                     <Icon
//                       size={13}
//                       strokeWidth={isActive ? 2 : 1.7}
//                       color={
//                         isActive
//                           ? "#7C3AED"
//                           : "#94A3B8"
//                       }
//                     />

//                     <span>{tab.label}</span>
//                   </div>
//                 )}
//               </NavLink>
//             );
//           })}

//         </div>

//         {/* RIGHT - SEARCH + ADD + HISTORY */}
//         <div className="flex shrink-0 items-center gap-1.5">

//           {/* SEARCH */}
//           <div className="relative">
//             <Search
//               size={13}
//               className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) =>
//                 setSearch(e.target.value)
//               }
//               placeholder="Search..."
//               className="h-[30px] w-[120px] rounded-[8px] border border-[#DDD6FE] bg-white pl-8 pr-3 text-[12px] text-slate-600 outline-none placeholder:text-slate-400 focus:border-[#C4B5FD]"
//             />
//           </div>

//           {/* ADD DOCUMENT */}
//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(
//                 new CustomEvent(
//                   "open-add-document-modal"
//                 )
//               );
//             }}
//             className="flex h-[30px] items-center gap-1 rounded-[8px] border border-[#7C3AED] bg-white px-3 text-[12.5px] font-medium text-[#7C3AED] transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Plus
//               size={13}
//               strokeWidth={2}
//             />

//             <span>Add Document</span>
//           </button>

//           {/* HISTORY */}
//           <button
//             type="button"
//             title="History"
//             className="flex h-[30px] w-[30px] items-center justify-center rounded-[8px] border border-[#DDD6FE] bg-white text-slate-500 transition-colors hover:bg-[#F5F3FF]"
//           >
//             <Clock
//               size={15}
//               strokeWidth={1.7}
//             />
//           </button>

//         </div>
//       </div>

//       {/* =========================================================
//           2. SECOND BAR
//       ========================================================= */}
//       <div
//         className="mt-2 flex h-[32px] items-center gap-1 rounded-[8px] px-2"
//         style={{
//           backgroundColor: "#F3F4F6",
//           border: "1px solid #E5E7EB",
//         }}
//       >

//         {/* LIST */}
//         <button
//           type="button"
//           className="flex h-6 w-6 items-center justify-center rounded transition-colors hover:bg-white"
//           title="List view"
//         >
//           <svg
//             width="14"
//             height="14"
//             viewBox="0 0 16 16"
//             fill="none"
//           >
//             <rect
//               x="2"
//               y="3.5"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />

//             <rect
//               x="2"
//               y="7.1"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />

//             <rect
//               x="2"
//               y="10.7"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//           </svg>
//         </button>

//         {/* CLEAR */}
//         <button
//           type="button"
//           className="flex h-6 w-6 items-center justify-center rounded text-[#EF4444] transition-colors hover:bg-white"
//           title="Clear"
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//           >
//             <path d="M3 3l8 8M11 3l-8 8" />
//           </svg>
//         </button>

//       </div>

//       {/* =========================================================
//           3. CONTENT
//       ========================================================= */}
//       <div className="mt-3 min-w-0">
//         <Outlet />
//       </div>

//     </div>
//   );
// }










// import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
// import {
//   Search,
//   Plus,
//   Clock,
//   FileText,
//   UserRound,
//   CreditCard,
// } from "lucide-react";
// import { useState } from "react";

// const tabs = [
//   {
//     label: "Document",
//     path: "document",
//     icon: FileText,
//   },
//   {
//     label: "Contact Details",
//     path: "contact-details",
//     icon: UserRound,
//   },
//   {
//     label: "Subscription Details",
//     path: "subscription-details",
//     icon: CreditCard,
//   },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [search, setSearch] = useState("");

//   const basePath = `/${domain}/admin/admin-center/company/documents`;

//   /*
//    * Determine the currently opened tab from the URL.
//    *
//    * /documents/document
//    * /documents/contact-details
//    * /documents/subscription-details
//    */
//   const currentPath = location.pathname;

//   const activeTab = currentPath.endsWith("/contact-details")
//     ? "Contact Details"
//     : currentPath.endsWith("/subscription-details")
//       ? "Subscription Details"
//       : "Document";

//   const handleTabClick = (path: string) => {
//     navigate(`${basePath}/${path}`);
//   };

//   return (
//     <div className="w-full min-w-0">
//       {/* =========================================================
//           TOP NAVIGATION
//       ========================================================= */}
//       <div
//         className="flex w-full items-center justify-between gap-3 rounded-[12px] px-2.5 py-2"
//         style={{
//           backgroundColor: "#F5F3FF",
//           border: "1px solid #EDE9FE",
//         }}
//       >
//         {/* LEFT - TABS */}
//         <div className="flex min-w-0 items-center gap-1.5 overflow-x-auto scrollbar-hide">
//           {tabs.map((tab) => {
//             const isActive = activeTab === tab.label;
//             const Icon = tab.icon;

//             return (
//               <button
//                 key={tab.path}
//                 type="button"
//                 onClick={() => handleTabClick(tab.path)}
//                 className="flex h-[30px] shrink-0 items-center gap-1.5 rounded-[8px] px-3 text-[12.5px] font-medium whitespace-nowrap transition-all"
//                 style={
//                   isActive
//                     ? {
//                         backgroundColor: "#FFFFFF",
//                         border: "1px solid #7C3AED",
//                         color: "#7C3AED",
//                         boxShadow:
//                           "0 1px 2px rgba(124,58,237,0.08)",
//                       }
//                     : {
//                         backgroundColor: "#FFFFFF",
//                         border: "1px solid #DDD6FE",
//                         color: "#64748B",
//                       }
//                 }
//               >
//                 <Icon
//                   size={13}
//                   strokeWidth={isActive ? 2 : 1.7}
//                   color={isActive ? "#7C3AED" : "#94A3B8"}
//                 />

//                 <span>{tab.label}</span>
//               </button>
//             );
//           })}
//         </div>

//         {/* RIGHT - SEARCH + ADD + HISTORY */}
//         <div className="flex shrink-0 items-center gap-1.5">
//           {/* Search */}
//           <div className="relative">
//             <Search
//               size={13}
//               className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search..."
//               className="
//                 h-[30px]
//                 w-[120px]
//                 rounded-[8px]
//                 border
//                 border-[#DDD6FE]
//                 bg-white
//                 pl-8
//                 pr-3
//                 text-[12px]
//                 text-slate-600
//                 outline-none
//                 placeholder:text-slate-400
//                 focus:border-[#C4B5FD]
//               "
//             />
//           </div>

//           {/* Add Document */}
//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(
//                 new CustomEvent("open-add-document-modal")
//               );
//             }}
//             className="
//               flex
//               h-[30px]
//               items-center
//               gap-1
//               rounded-[8px]
//               border
//               border-[#7C3AED]
//               bg-white
//               px-3
//               text-[12.5px]
//               font-medium
//               text-[#7C3AED]
//               transition-colors
//               hover:bg-[#F5F3FF]
//             "
//           >
//             <Plus size={13} strokeWidth={2} />
//             <span>Add Document</span>
//           </button>

//           {/* History */}
//           <button
//             type="button"
//             title="History"
//             className="
//               flex
//               h-[30px]
//               w-[30px]
//               items-center
//               justify-center
//               rounded-[8px]
//               border
//               border-[#DDD6FE]
//               bg-white
//               text-slate-500
//               transition-colors
//               hover:bg-[#F5F3FF]
//             "
//           >
//             <Clock size={15} strokeWidth={1.7} />
//           </button>
//         </div>
//       </div>

//       {/* =========================================================
//           SECOND BAR
//       ========================================================= */}
//       <div
//         className="mt-2 flex h-[32px] items-center gap-1 rounded-[8px] px-2"
//         style={{
//           backgroundColor: "#F3F4F6",
//           border: "1px solid #E5E7EB",
//         }}
//       >
//         {/* List */}
//         <button
//           type="button"
//           className="
//             flex
//             h-6
//             w-6
//             items-center
//             justify-center
//             rounded
//             transition-colors
//             hover:bg-white
//           "
//           title="List view"
//         >
//           <svg
//             width="14"
//             height="14"
//             viewBox="0 0 16 16"
//             fill="none"
//           >
//             <rect
//               x="2"
//               y="3.5"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//             <rect
//               x="2"
//               y="7.1"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//             <rect
//               x="2"
//               y="10.7"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//           </svg>
//         </button>

//         {/* X */}
//         <button
//           type="button"
//           className="
//             flex
//             h-6
//             w-6
//             items-center
//             justify-center
//             rounded
//             text-[#EF4444]
//             transition-colors
//             hover:bg-white
//           "
//           title="Clear"
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//           >
//             <path d="M3 3l8 8M11 3l-8 8" />
//           </svg>
//         </button>
//       </div>

//       {/* =========================================================
//           CONTENT
//       ========================================================= */}
//       <div className="mt-3 min-w-0">
//         <Outlet />
//       </div>
//     </div>
//   );
// }






// import {
//   Outlet,
//   NavLink,
//   useParams,
// } from "react-router-dom";

// import {
//   Search,
//   Plus,
//   Clock,
//   FileText,
//   UserRound,
//   CreditCard,
// } from "lucide-react";

// import { useState } from "react";

// const tabs = [
//   {
//     label: "Document",
//     path: "document",
//     icon: FileText,
//   },
//   {
//     label: "Contact Details",
//     path: "contact-details",
//     icon: UserRound,
//   },
//   {
//     label: "Subscription Details",
//     path: "subscription-details",
//     icon: CreditCard,
//   },
// ];

// export default function CompanyDocumentsPage() {
//   const { domain } =
//     useParams();

//   const [
//     search,
//     setSearch,
//   ] = useState("");

//   const basePath =
//     `/${domain}/admin/admin-center/company/documents`;

//   return (
//     <div
//       className="
//         w-full
//         min-w-0
//         max-w-full
//         overflow-x-hidden
//       "
//     >
//       {/* =========================================================
//           TOP NAV
//       ========================================================= */}

//       <div
//         className="
//           flex
//           w-full
//           min-w-0
//           max-w-full
//           flex-col
//           gap-2
//           rounded-[12px]
//           px-2
//           py-2
//           sm:px-2.5
//         "
//         style={{
//           backgroundColor:
//             "#F5F3FF",
//           border:
//             "1px solid #EDE9FE",
//         }}
//       >
//         {/* ==============================================
//             TABS
//         ============================================== */}

//         <div
//           className="
//             flex
//             min-w-0
//             w-full
//             items-center
//             gap-1
//             overflow-x-auto
//             scrollbar-hide
//           "
//         >
//           {tabs.map(
//             (tab) => {
//               const Icon =
//                 tab.icon;

//               return (
//                 <NavLink
//                   key={tab.path}
//                   to={`${basePath}/${tab.path}`}
//                   end
//                   className="shrink-0"
//                 >
//                   {({
//                     isActive,
//                   }) => (
//                     <div
//                       className="
//                         flex
//                         h-8
//                         shrink-0
//                         items-center
//                         gap-1.5
//                         rounded-[8px]
//                         px-2.5
//                         text-[12px]
//                         font-medium
//                         whitespace-nowrap
//                         transition-all
//                         sm:h-[30px]
//                         sm:px-3
//                         sm:text-[12.5px]
//                       "
//                       style={
//                         isActive
//                           ? {
//                               backgroundColor:
//                                 "#FFFFFF",
//                               border:
//                                 "1px solid #7C3AED",
//                               color:
//                                 "#7C3AED",
//                               fontWeight:
//                                 600,
//                             }
//                           : {
//                               backgroundColor:
//                                 "#FFFFFF",
//                               border:
//                                 "1px solid #DDD6FE",
//                               color:
//                                 "#64748B",
//                             }
//                       }
//                     >
//                       <Icon
//                         size={13}
//                         strokeWidth={
//                           isActive
//                             ? 2
//                             : 1.7
//                         }
//                         color={
//                           isActive
//                             ? "#7C3AED"
//                             : "#94A3B8"
//                         }
//                       />

//                       <span>
//                         {tab.label}
//                       </span>
//                     </div>
//                   )}
//                 </NavLink>
//               );
//             }
//           )}
//         </div>

//         {/* ==============================================
//             SEARCH + ACTIONS
//         ============================================== */}

//         <div
//           className="
//             flex
//             w-full
//             min-w-0
//             items-center
//             gap-1.5
//           "
//         >
//           {/* SEARCH */}

//           <div
//             className="
//               relative
//               min-w-0
//               flex-1
//             "
//           >
//             <Search
//               size={13}
//               className="
//                 pointer-events-none
//                 absolute
//                 left-2.5
//                 top-1/2
//                 -translate-y-1/2
//                 text-slate-400
//               "
//             />

//             <input
//               type="text"
//               value={search}
//               onChange={(e) =>
//                 setSearch(
//                   e.target.value
//                 )
//               }
//               placeholder="Search..."
//               className="
//                 h-8
//                 w-full
//                 rounded-[8px]
//                 border
//                 border-[#DDD6FE]
//                 bg-white
//                 pl-8
//                 pr-2
//                 text-[12px]
//                 text-slate-600
//                 outline-none
//                 placeholder:text-slate-400
//                 focus:border-[#C4B5FD]
//                 sm:h-[30px]
//                 sm:pr-3
//               "
//             />
//           </div>

//           {/* ADD */}

//           <button
//             type="button"
//             onClick={() => {
//               window.dispatchEvent(
//                 new CustomEvent(
//                   "open-add-document-modal"
//                 )
//               );
//             }}
//             className="
//               flex
//               h-8
//               shrink-0
//               items-center
//               justify-center
//               gap-1
//               rounded-[8px]
//               border
//               border-[#7C3AED]
//               bg-white
//               px-2.5
//               text-[12px]
//               font-medium
//               text-[#7C3AED]
//               hover:bg-[#F5F3FF]
//               sm:h-[30px]
//               sm:px-3
//               sm:text-[12.5px]
//             "
//           >
//             <Plus
//               size={13}
//               strokeWidth={2}
//             />

//             <span className="hidden xs:inline">
//               Add Document
//             </span>

//             <span className="xs:hidden">
//               Add
//             </span>
//           </button>

//           {/* HISTORY */}

//           <button
//             type="button"
//             title="History"
//             className="
//               flex
//               h-8
//               w-8
//               shrink-0
//               items-center
//               justify-center
//               rounded-[8px]
//               border
//               border-[#DDD6FE]
//               bg-white
//               text-slate-500
//               hover:bg-[#F5F3FF]
//               sm:h-[30px]
//               sm:w-[30px]
//             "
//           >
//             <Clock
//               size={15}
//               strokeWidth={1.7}
//             />
//           </button>
//         </div>
//       </div>

//       {/* =========================================================
//           SECOND BAR
//       ========================================================= */}

//       <div
//         className="
//           mt-2
//           flex
//           h-8
//           w-full
//           items-center
//           gap-1
//           rounded-[8px]
//           px-2
//         "
//         style={{
//           backgroundColor:
//             "#F3F4F6",
//           border:
//             "1px solid #E5E7EB",
//         }}
//       >
//         <button
//           type="button"
//           className="
//             flex
//             h-6
//             w-6
//             items-center
//             justify-center
//             rounded
//             hover:bg-white
//           "
//           title="List view"
//         >
//           <svg
//             width="14"
//             height="14"
//             viewBox="0 0 16 16"
//             fill="none"
//           >
//             <rect
//               x="2"
//               y="3.5"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//             <rect
//               x="2"
//               y="7.1"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//             <rect
//               x="2"
//               y="10.7"
//               width="12"
//               height="1.8"
//               rx="0.4"
//               fill="#22C55E"
//             />
//           </svg>
//         </button>

//         <button
//           type="button"
//           className="
//             flex
//             h-6
//             w-6
//             items-center
//             justify-center
//             rounded
//             text-[#EF4444]
//             hover:bg-white
//           "
//           title="Clear"
//         >
//           <svg
//             width="12"
//             height="12"
//             viewBox="0 0 14 14"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//           >
//             <path d="M3 3l8 8M11 3l-8 8" />
//           </svg>
//         </button>
//       </div>

//       {/* =========================================================
//           CONTENT
//       ========================================================= */}

//       <div
//         className="
//           mt-3
//           w-full
//           min-w-0
//           max-w-full
//           overflow-x-hidden
//         "
//       >
//         <Outlet />
//       </div>
//     </div>
//   );
// }



















import {
  Outlet,
  NavLink,
  useParams,
} from "react-router-dom";

import {
  Search,
  Plus,
  Clock,
  FileText,
  UserRound,
  CreditCard,
} from "lucide-react";

import { useState } from "react";

const tabs = [
  {
    label: "Document",
    path: "document",
    icon: FileText,
  },
  {
    label: "Contact Details",
    path: "contact-details",
    icon: UserRound,
  },
  {
    label: "Subscription Details",
    path: "subscription-details",
    icon: CreditCard,
  },
];

export default function CompanyDocumentsPage() {
  const { domain } = useParams();

  const [search, setSearch] = useState("");

  const basePath =
    `/${domain}/admin/admin-center/company/documents`;

  return (
    <div
      className="
        w-full
        min-w-0
        max-w-full
        overflow-x-hidden
      "
    >
      {/* =========================================================
          TOP NAV
      ========================================================= */}

      <div
        className="
          flex
          w-full
          min-w-0
          max-w-full
          flex-col
          gap-2
          rounded-[12px]
          px-2
          py-2
          sm:px-2.5
        "
        style={{
          backgroundColor: "#F5F3FF",
          border: "1px solid #EDE9FE",
        }}
      >
        {/* ======================================================
            TABS
        ====================================================== */}

        <div
          className="
            flex
            min-w-0
            w-full
            items-center
            gap-1
            overflow-x-auto
            scrollbar-hide
          "
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <NavLink
                key={tab.path}
                to={`${basePath}/${tab.path}`}
                end
                className="shrink-0"
              >
                {({ isActive }) => (
                  <div
                    className="
                      flex
                      h-8
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-[8px]
                      px-2.5
                      text-[12px]
                      font-medium
                      whitespace-nowrap
                      transition-all
                      sm:h-[30px]
                      sm:px-3
                      sm:text-[12.5px]
                    "
                    style={
                      isActive
                        ? {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #7C3AED",
                            color: "#7C3AED",
                            fontWeight: 600,
                          }
                        : {
                            backgroundColor: "#FFFFFF",
                            border: "1px solid #DDD6FE",
                            color: "#64748B",
                          }
                    }
                  >
                    <Icon
                      size={13}
                      strokeWidth={
                        isActive ? 2 : 1.7
                      }
                      color={
                        isActive
                          ? "#7C3AED"
                          : "#94A3B8"
                      }
                    />

                    <span>{tab.label}</span>
                  </div>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* ======================================================
            SEARCH + ACTIONS
        ====================================================== */}

        <div
          className="
            flex
            w-full
            min-w-0
            items-center
            gap-1.5
          "
        >
          {/* SEARCH */}

          <div
            className="
              relative
              min-w-0
              flex-1
            "
          >
            <Search
              size={13}
              className="
                pointer-events-none
                absolute
                left-2.5
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search..."
              className="
                h-8
                w-full
                rounded-[8px]
                border
                border-[#DDD6FE]
                bg-white
                pl-8
                pr-2
                text-[12px]
                text-slate-600
                outline-none
                placeholder:text-slate-400
                focus:border-[#C4B5FD]
                sm:h-[30px]
                sm:pr-3
              "
            />
          </div>

          {/* ==================================================
              ADD DOCUMENT BUTTON
              No popup / no modal
          ================================================== */}

          <button
            type="button"
            className="
              flex
              h-8
              shrink-0
              items-center
              justify-center
              gap-1
              rounded-[8px]
              border
              border-[#7C3AED]
              bg-white
              px-2.5
              text-[12px]
              font-medium
              text-[#7C3AED]
              hover:bg-[#F5F3FF]
              sm:h-[30px]
              sm:px-3
              sm:text-[12.5px]
            "
          >
            <Plus
              size={13}
              strokeWidth={2}
            />

            <span className="hidden xs:inline">
              Add Document
            </span>

            <span className="xs:hidden">
              Add
            </span>
          </button>

          {/* ==================================================
              HISTORY
          ================================================== */}

          <button
            type="button"
            title="History"
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-[8px]
              border
              border-[#DDD6FE]
              bg-white
              text-slate-500
              hover:bg-[#F5F3FF]
              sm:h-[30px]
              sm:w-[30px]
            "
          >
            <Clock
              size={15}
              strokeWidth={1.7}
            />
          </button>
        </div>
      </div>

      {/* =========================================================
          SECOND BAR
      ========================================================= */}

      <div
        className="
          mt-2
          flex
          h-8
          w-full
          items-center
          gap-1
          rounded-[8px]
          px-2
        "
        style={{
          backgroundColor: "#F3F4F6",
          border: "1px solid #E5E7EB",
        }}
      >
        {/* LIST VIEW */}

        <button
          type="button"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded
            hover:bg-white
          "
          title="List view"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
          >
            <rect
              x="2"
              y="3.5"
              width="12"
              height="1.8"
              rx="0.4"
              fill="#22C55E"
            />

            <rect
              x="2"
              y="7.1"
              width="12"
              height="1.8"
              rx="0.4"
              fill="#22C55E"
            />

            <rect
              x="2"
              y="10.7"
              width="12"
              height="1.8"
              rx="0.4"
              fill="#22C55E"
            />
          </svg>
        </button>

        {/* CLEAR */}

        <button
          type="button"
          className="
            flex
            h-6
            w-6
            items-center
            justify-center
            rounded
            text-[#EF4444]
            hover:bg-white
          "
          title="Clear"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <path d="M3 3l8 8M11 3l-8 8" />
          </svg>
        </button>
      </div>

      {/* =========================================================
          CONTENT
      ========================================================= */}

      <div
        className="
          mt-3
          w-full
          min-w-0
          max-w-full
          overflow-x-hidden
        "
      >
        <Outlet />
      </div>
    </div>
  );
}