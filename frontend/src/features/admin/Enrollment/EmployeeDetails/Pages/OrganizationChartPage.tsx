// import React, { useState } from "react";
// import { ChevronDown, Download, Clock } from "lucide-react";

// /**
//  * OrganizationChartPage
//  * -------------------------------------------------------------
//  * Renders a manager -> reports tree using the classic pure-CSS
//  * "connector line" pattern (see <style> block in OrgTree below),
//  * so any depth / branching factor lays out correctly without a
//  * charting library.
//  * -------------------------------------------------------------
//  */

// export interface OrgNode {
//   id: string;
//   name: string;
//   title: string;
//   initials: string;
//   /** Tailwind gradient classes, e.g. "from-indigo-500 to-purple-500" */
//   gradient: string;
//   children?: OrgNode[];
// }

// // Sample data matching the screenshot — swap for your API response.
// const sampleOrgData: OrgNode = {
//   id: "1",
//   name: "Kavya N",
//   title: "Project Manager",
//   initials: "KN",
//   gradient: "from-indigo-500 to-purple-500",
//   children: [
//     {
//       id: "2",
//       name: "Daniel Raju Ravi",
//       title: "Project Manager",
//       initials: "DR",
//       gradient: "from-pink-400 to-rose-500",
//       children: [
//         {
//           id: "4",
//           name: "Sample Report 1",
//           title: "Software Engineer",
//           initials: "SR",
//           gradient: "from-emerald-400 to-teal-500",
//         },
//         {
//           id: "5",
//           name: "Sample Report 2",
//           title: "Software Engineer",
//           initials: "SR",
//           gradient: "from-emerald-400 to-teal-500",
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "Yogesh Kumar K",
//       title: "Bussiness Development Manager",
//       initials: "YK",
//       gradient: "from-orange-400 to-amber-500",
//     },
//   ],
// };

// const OrganizationChartPage = () => {
//   const [view, setView] = useState("Employee View");
//   const [layout, setLayout] = useState("Standard View");
//   const [branch, setBranch] = useState("");

//   return (
//     <div className="bg-white min-h-screen">
//       {/* Common Tabs */}
//       <div className="flex items-center justify-between border-b border-gray-200 px-1">
       
//         <Clock size={16} className="text-gray-400 mr-4" />
//       </div>

//       <div className="p-4">
//         {/* Breadcrumb chip */}
//         <div className="mb-3">
//           <span className="inline-block bg-blue-50 text-blue-600 text-[12px] font-medium px-3 py-1.5 rounded">
//             {sampleOrgData.name} Team
//           </span>
//         </div>

//         {/* Toolbar */}
//         <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-400 via-purple-400 to-purple-300 rounded-lg px-4 py-3 mb-6">
//           <ToolbarDropdown label={view} onClick={() => {}} />
//           <ToolbarDropdown label={layout} onClick={() => {}} italic />
//           <ToolbarDropdown
//             label={branch || "Select Branch / Department"}
//             onClick={() => {}}
//             italic
//             placeholder={!branch}
//           />
//           <button
//             type="button"
//             className="ml-auto w-8 h-8 flex items-center justify-center rounded bg-white/30 hover:bg-white/50 text-white transition-colors"
//             aria-label="Download chart"
//           >
//             <Download size={15} />
//           </button>
//         </div>

//         {/* Chart canvas */}
//         <div className="bg-gray-50 rounded-lg border border-gray-100 min-h-[500px] overflow-x-auto flex items-start justify-center pt-12 pb-16">
//           <OrgTree node={sampleOrgData} />
//         </div>
//       </div>
//     </div>
//   );
// };

// /* ---------------- Toolbar dropdown ---------------- */

// const ToolbarDropdown: React.FC<{
//   label: string;
//   onClick: () => void;
//   italic?: boolean;
//   placeholder?: boolean;
// }> = ({ label, onClick, italic, placeholder }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className={`flex items-center gap-2 bg-white/25 hover:bg-white/35 text-white text-[13px] font-medium px-3 py-1.5 rounded transition-colors ${
//       italic ? "italic" : ""
//     } ${placeholder ? "text-white/80" : ""}`}
//   >
//     {label}
//     <ChevronDown size={13} />
//   </button>
// );

// /* ---------------- Recursive tree ---------------- */

// const OrgTree: React.FC<{ node: OrgNode }> = ({ node }) => {
//   return (
//     <>
//       {/* Scoped connector-line styles — classic pure-CSS org chart pattern */}
//       <style>{`
//         .org-tree, .org-tree ul, .org-tree li {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//           position: relative;
//         }
//         .org-tree {
//           display: flex;
//           justify-content: center;
//         }
//         .org-tree ul {
//           display: flex;
//           justify-content: center;
//           padding-top: 28px;
//         }
//         .org-tree li {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 28px 14px 0 14px;
//         }
//         .org-tree li::before,
//         .org-tree li::after {
//           content: "";
//           position: absolute;
//           top: 0;
//           right: 50%;
//           width: 50%;
//           height: 28px;
//           border-top: 2px solid #c7d2e0;
//         }
//         .org-tree li::after {
//           right: auto;
//           left: 50%;
//           border-left: 2px solid #c7d2e0;
//         }
//         .org-tree li:only-child::before,
//         .org-tree li:only-child::after {
//           display: none;
//         }
//         .org-tree li:only-child {
//           padding-top: 0;
//         }
//         .org-tree li:first-child::before,
//         .org-tree li:last-child::after {
//           border: 0 none;
//         }
//         .org-tree li:last-child::before {
//           border-right: 2px solid #c7d2e0;
//           border-radius: 0 6px 0 0;
//         }
//         .org-tree li:first-child::after {
//           border-radius: 6px 0 0 0;
//         }
//         .org-tree > li {
//           padding-top: 0;
//         }
//         .org-tree > li::before,
//         .org-tree > li::after {
//           display: none;
//         }
//         .org-tree ul::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: 50%;
//           width: 0;
//           height: 28px;
//           border-left: 2px solid #c7d2e0;
//         }
//       `}</style>

//       <ul className="org-tree">
//         <OrgTreeNode node={node} />
//       </ul>
//     </>
//   );
// };

// const OrgTreeNode: React.FC<{ node: OrgNode }> = ({ node }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const hasChildren = !!node.children?.length;

//   return (
//     <li>
//       <OrgCard node={node} />

//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() => setCollapsed((c) => !c)}
//           className="mt-1.5 flex items-center gap-0.5 bg-white border border-gray-200 shadow-sm rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-500 hover:bg-gray-50 z-10"
//         >
//           <ChevronDown
//             size={11}
//             className={`transition-transform ${collapsed ? "-rotate-90" : ""}`}
//           />
//           {node.children!.length}
//         </button>
//       )}

//       {hasChildren && !collapsed && (
//         <ul>
//           {node.children!.map((child) => (
//             <OrgTreeNode key={child.id} node={child} />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// /* ---------------- Card ---------------- */

// const OrgCard: React.FC<{ node: OrgNode }> = ({ node }) => (
//   <div className="flex items-center gap-3 bg-white rounded-lg shadow-sm border border-gray-100 px-4 py-3 w-64">
//     <div
//       className={`flex-shrink-0 w-11 h-11 rounded-lg bg-gradient-to-br ${node.gradient} text-white text-[13px] font-semibold flex items-center justify-center`}
//     >
//       {node.initials}
//     </div>
//     <div className="min-w-0">
//       <div className="text-[13px] font-semibold text-gray-800 truncate">
//         {node.name}
//       </div>
//       <div className="text-[11px] text-gray-400 uppercase tracking-wide leading-tight">
//         {node.title}
//       </div>
//     </div>
//   </div>
// );

// export default OrganizationChartPage;






// import React, { useState } from "react";
// import { ChevronDown, Download } from "lucide-react";

// /* =========================================================
//    TYPES
// ========================================================= */

// export interface OrgNode {
//   id: string;
//   name: string;
//   title: string;
//   initials: string;
//   gradient: string;
//   children?: OrgNode[];
// }

// /* =========================================================
//    SAMPLE DATA
// ========================================================= */

// const sampleOrgData: OrgNode = {
//   id: "1",
//   name: "Kavya N",
//   title: "PROJECT MANAGER",
//   initials: "KN",
//   gradient: "from-[#7C3AED] to-[#A855F7]",
//   children: [
//     {
//       id: "2",
//       name: "Daniel Raju Ravi",
//       title: "PROJECT MANAGER",
//       initials: "DR",
//       gradient: "from-[#EC4899] to-[#F472B6]",
//       children: [
//         {
//           id: "4",
//           name: "Sample Report 1",
//           title: "SOFTWARE ENGINEER",
//           initials: "SR",
//           gradient: "from-[#10B981] to-[#34D399]",
//         },
//         {
//           id: "5",
//           name: "Sample Report 2",
//           title: "SOFTWARE ENGINEER",
//           initials: "SR",
//           gradient: "from-[#10B981] to-[#34D399]",
//         },
//       ],
//     },
//     {
//       id: "3",
//       name: "Yogesh Kumar K",
//       title: "BUSINESS DEVELOPMENT MANAGER",
//       initials: "YK",
//       gradient: "from-[#F97316] to-[#FB923C]",
//     },
//   ],
// };

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [view] = useState("Employee View");
//   const [layout] = useState("Standard View");
//   const [branch] = useState("");

//   return (
//     <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC]">

//       {/* =====================================================
//           CONTENT
//           IMPORTANT:
//           Navigation tabs are intentionally REMOVED here.
//           The parent Enrollment layout already renders them.
//       ===================================================== */}

//       <div className="w-full px-[14px] pt-[14px] pb-[22px]">

//         {/* ===================================================
//             TEAM CHIP
//         =================================================== */}

//         <div className="mb-[10px]">
//           <span
//             className="
//               inline-flex
//               items-center
//               rounded-[6px]
//               border border-[#E0ECFF]
//               bg-[#EFF6FF]
//               px-[10px]
//               py-[5px]
//               text-[11px]
//               font-medium
//               text-[#2563EB]
//               shadow-[0_1px_2px_rgba(37,99,235,0.04)]
//             "
//           >
//             Kavya N Team
//           </span>
//         </div>

//         {/* ===================================================
//             TOOLBAR
//         =================================================== */}

//         <div
//           className="
//             mb-[14px]
//             flex
//             h-[38px]
//             items-center
//             gap-[6px]
//             rounded-[9px]
//             border
//             border-[#B7B1F8]
//             bg-gradient-to-r
//             from-[#A5B4FC]
//             via-[#C4B5FD]
//             to-[#DDD6FE]
//             px-[10px]
//             shadow-[0_2px_8px_rgba(99,102,241,0.18)]
//           "
//         >
//           {/* Employee View */}

//           <ToolbarDropdown label={view} />

//           {/* Standard View */}

//           <ToolbarDropdown label={layout} />

//           {/* Branch */}

//           <ToolbarDropdown
//             label={branch || "Select Branch / Department"}
//             placeholder={!branch}
//           />

//           {/* Download */}

//           <button
//             type="button"
//             aria-label="Download chart"
//             className="
//               ml-auto
//               flex
//               h-[28px]
//               w-[28px]
//               items-center
//               justify-center
//               rounded-[7px]
//               border
//               border-white/40
//               bg-white/45
//               text-[#5B21B6]
//               shadow-[0_1px_3px_rgba(76,29,149,0.08)]
//               transition-all
//               hover:bg-white/70
//               hover:shadow-[0_2px_5px_rgba(76,29,149,0.12)]
//               active:scale-95
//             "
//           >
//             <Download
//               size={14}
//               strokeWidth={2}
//             />
//           </button>
//         </div>

//         {/* ===================================================
//             CHART CARD
//         =================================================== */}

//         <div
//           className="
//             relative
//             min-h-[540px]
//             w-full
//             overflow-x-auto
//             overflow-y-hidden
//             rounded-[10px]
//             border
//             border-[#DCE4EE]
//             bg-white
//             shadow-[0_1px_3px_rgba(16,24,40,0.04),0_4px_12px_rgba(16,24,40,0.03)]
//           "
//         >
//           {/* subtle inner border */}

//           <div
//             className="
//               absolute
//               inset-[1px]
//               pointer-events-none
//               rounded-[9px]
//               border
//               border-[#F5F7FA]
//             "
//           />

//           {/* Chart */}

//           <div
//             className="
//               relative
//               flex
//               min-w-[850px]
//               justify-center
//               px-[40px]
//               pt-[36px]
//               pb-[70px]
//             "
//           >
//             <OrgTree node={sampleOrgData} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    TOOLBAR DROPDOWN
// ========================================================= */

// interface ToolbarDropdownProps {
//   label: string;
//   placeholder?: boolean;
// }

// const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
//   label,
//   placeholder = false,
// }) => {
//   return (
//     <button
//       type="button"
//       className={`
//         flex
//         h-[27px]
//         items-center
//         gap-[5px]
//         rounded-[6px]
//         border
//         border-white/50
//         bg-white/45
//         px-[9px]
//         text-[10.5px]
//         font-medium
//         shadow-[0_1px_2px_rgba(0,0,0,0.04)]
//         transition-all
//         hover:bg-white/70
//         hover:shadow-[0_1px_4px_rgba(0,0,0,0.08)]
//         ${
//           placeholder
//             ? "text-[#6366F1]"
//             : "text-[#4338CA]"
//         }
//       `}
//     >
//       <span className="whitespace-nowrap">
//         {label}
//       </span>

//       <ChevronDown
//         size={11}
//         strokeWidth={2.3}
//         className="opacity-70"
//       />
//     </button>
//   );
// };

// /* =========================================================
//    ORGANIZATION TREE
// ========================================================= */

// const OrgTree: React.FC<{ node: OrgNode }> = ({
//   node,
// }) => {
//   return (
//     <>
//       <style>{`
//         .org-tree,
//         .org-tree ul,
//         .org-tree li {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//           position: relative;
//         }

//         .org-tree {
//           display: flex;
//           justify-content: center;
//           width: max-content;
//           min-width: 100%;
//         }

//         .org-tree ul {
//           display: flex;
//           justify-content: center;
//           padding-top: 30px;
//         }

//         .org-tree li {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 30px 16px 0 16px;
//         }

//         /* horizontal + vertical connectors */

//         .org-tree li::before,
//         .org-tree li::after {
//           content: "";
//           position: absolute;
//           top: 0;
//           width: 50%;
//           height: 30px;
//           border-top: 1px solid #CBD5E1;
//         }

//         .org-tree li::before {
//           right: 50%;
//         }

//         .org-tree li::after {
//           left: 50%;
//           border-left: 1px solid #CBD5E1;
//         }

//         /* only child */

//         .org-tree li:only-child::before,
//         .org-tree li:only-child::after {
//           display: none;
//         }

//         .org-tree li:only-child {
//           padding-top: 0;
//         }

//         /* first child */

//         .org-tree li:first-child::before {
//           border: 0;
//         }

//         /* last child */

//         .org-tree li:last-child::after {
//           border: 0;
//         }

//         /* last child right connector */

//         .org-tree li:last-child::before {
//           border-right: 1px solid #CBD5E1;
//           border-radius: 0 5px 0 0;
//         }

//         /* first child left connector */

//         .org-tree li:first-child::after {
//           border-radius: 5px 0 0 0;
//         }

//         /* root */

//         .org-tree > li {
//           padding-top: 0;
//         }

//         .org-tree > li::before,
//         .org-tree > li::after {
//           display: none;
//         }

//         /* vertical connector from parent */

//         .org-tree ul::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: 50%;
//           width: 0;
//           height: 30px;
//           border-left: 1px solid #CBD5E1;
//         }
//       `}</style>

//       <ul className="org-tree">
//         <OrgTreeNode node={node} />
//       </ul>
//     </>
//   );
// };

// /* =========================================================
//    TREE NODE
// ========================================================= */

// const OrgTreeNode: React.FC<{ node: OrgNode }> = ({
//   node,
// }) => {
//   const [collapsed, setCollapsed] =
//     useState(false);

//   const hasChildren =
//     !!node.children &&
//     node.children.length > 0;

//   return (
//     <li>
//       {/* Employee Card */}

//       <OrgCard node={node} />

//       {/* Child count */}

//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed((value) => !value)
//           }
//           className="
//             z-20
//             mt-[7px]
//             flex
//             h-[19px]
//             min-w-[30px]
//             items-center
//             justify-center
//             gap-[2px]
//             rounded-full
//             border
//             border-[#DCE4EE]
//             bg-white
//             px-[6px]
//             text-[9px]
//             font-medium
//             text-[#64748B]
//             shadow-[0_1px_3px_rgba(16,24,40,0.08)]
//             transition-all
//             hover:border-[#C7D2E0]
//             hover:bg-[#F8FAFC]
//             hover:shadow-[0_2px_5px_rgba(16,24,40,0.10)]
//           "
//         >
//           <ChevronDown
//             size={10}
//             strokeWidth={2.5}
//             className={`
//               transition-transform
//               duration-200
//               ${
//                 collapsed
//                   ? "-rotate-90"
//                   : "rotate-0"
//               }
//             `}
//           />

//           {node.children!.length}
//         </button>
//       )}

//       {/* Children */}

//       {hasChildren && !collapsed && (
//         <ul>
//           {node.children!.map((child) => (
//             <OrgTreeNode
//               key={child.id}
//               node={child}
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// /* =========================================================
//    ORGANIZATION CARD
// ========================================================= */

// const OrgCard: React.FC<{
//   node: OrgNode;
// }> = ({ node }) => {
//   return (
//     <div
//       className="
//         flex
//         h-[45px]
//         min-w-[173px]
//         items-center
//         gap-[9px]
//         rounded-[7px]
//         border
//         border-[#DCE4EE]
//         bg-white
//         px-[10px]
//         py-[6px]
//         shadow-[0_1px_3px_rgba(16,24,40,0.05)]
//         transition-all
//         duration-200
//         hover:-translate-y-[1px]
//         hover:border-[#CBD5E1]
//         hover:shadow-[0_4px_10px_rgba(16,24,40,0.09)]
//       "
//     >
//       {/* Avatar */}

//       <div
//         className={`
//           flex
//           h-[28px]
//           w-[28px]
//           shrink-0
//           items-center
//           justify-center
//           rounded-[6px]
//           bg-gradient-to-br
//           ${node.gradient}
//           text-[9px]
//           font-semibold
//           text-white
//           shadow-[0_1px_3px_rgba(0,0,0,0.12)]
//         `}
//       >
//         {node.initials}
//       </div>

//       {/* Employee Details */}

//       <div className="min-w-0 flex-1">
//         <div
//           className="
//             truncate
//             text-[10.5px]
//             font-semibold
//             leading-[14px]
//             text-[#1E293B]
//           "
//         >
//           {node.name}
//         </div>

//         <div
//           className="
//             mt-[1px]
//             truncate
//             text-[7.5px]
//             font-medium
//             uppercase
//             leading-[10px]
//             tracking-[0.02em]
//             text-[#94A3B8]
//           "
//         >
//           {node.title}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationChartPage;















// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
// } from "lucide-react";
// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";
// import {
//   useGetOrganizationChartQuery,
//   type OrgChartEmployeeDTO,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    UI-SIDE TREE SHAPE
// ========================================================= */

// interface OrgNode {
//   id: string | number;
//   name: string;
//   title: string;
//   initials: string;
//   photoUrl: string | null;
//   gradient: string;
//   children: OrgNode[];
// }

// /* =========================================================
//    DTO (flat, backend) -> TREE (nested, UI)
// ========================================================= */

// // Purely visual — cycles per-employee so sibling cards are easy to tell apart.
// // This does not affect the page chrome (toolbar/badges/borders), which uses
// // the orange theme throughout.
// const AVATAR_GRADIENTS = [
//   "from-[#7C3AED] to-[#A855F7]",
//   "from-[#EC4899] to-[#F472B6]",
//   "from-[#F97316] to-[#FB923C]",
//   "from-[#10B981] to-[#34D399]",
//   "from-[#0EA5E9] to-[#38BDF8]",
//   "from-[#EAB308] to-[#FACC15]",
// ];

// const gradientFor = (id: string | number): string => {
//   const s = String(id);
//   let hash = 0;
//   for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
//   return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
// };

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// /**
//  * Backend returns a flat list of employees, each pointing at its manager via
//  * ReportingAuthorityID. Build the nested tree the renderer needs from that,
//  * rooted at `rootId` (or the first employee with no manager if omitted).
//  */
// function buildTree(
//   employees: OrgChartEmployeeDTO[],
//   rootId?: string | number | null
// ): OrgNode | null {
//   if (!employees.length) return null;

//   const byParent = new Map<string, OrgChartEmployeeDTO[]>();
//   employees.forEach((e) => {
//     const key =
//       e.ReportingAuthorityID === null || e.ReportingAuthorityID === undefined
//         ? "__root__"
//         : String(e.ReportingAuthorityID);
//     if (!byParent.has(key)) byParent.set(key, []);
//     byParent.get(key)!.push(e);
//   });

//   const toNode = (e: OrgChartEmployeeDTO): OrgNode => ({
//     id: e.EmployeeID,
//     name: e.EmployeeName,
//     title: e.DesignationName ?? "",
//     initials: initialsFor(e.EmployeeName),
//     photoUrl: e.ProfilePhoto,
//     gradient: gradientFor(e.EmployeeID),
//     children: (byParent.get(String(e.EmployeeID)) ?? []).map(toNode),
//   });

//   const rootDto =
//     (rootId != null
//       ? employees.find((e) => String(e.EmployeeID) === String(rootId))
//       : undefined) ??
//     (byParent.get("__root__") ?? [])[0] ??
//     employees[0];

//   return rootDto ? toNode(rootDto) : null;
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   // debounce the search box before it hits the backend
//   useEffect(() => {
//     const t = setTimeout(() => setSearch(searchInput.trim()), 400);
//     return () => clearTimeout(t);
//   }, [searchInput]);

//   const [cardDensity, setCardDensity] = useState<"standard" | "compact">(
//     "standard"
//   );
//   const [avatarMode, setAvatarMode] = useState<"initials" | "photo">(
//     "initials"
//   );

//   const { data, isLoading, isFetching, isError, refetch } =
//     useGetOrganizationChartQuery({ search: search || undefined });

//   const chart = data?.data;

//   const tree = useMemo(
//     () => (chart ? buildTree(chart.Employees, undefined) : null),
//     [chart]
//   );

//   const handlePrint = () => window.print();

//   return (
//     <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
//       {/* Top tabs — same bar every other Enrollment page uses */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       {/* Search + actions, portalled into the tab bar's action slot */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />
//           <input
//             value={searchInput}
//             onChange={(e) => setSearchInput(e.target.value)}
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E4E7EC] bg-white pl-7 pr-2 text-[12px] text-[#344054] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15"
//           />
//         </div>
//         <button
//           type="button"
//           onClick={handlePrint}
//           title="Download / print chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C] hover:bg-[#FFEDD5]"
//         >
//           <Download size={14} />
//         </button>
//         <button
//           type="button"
//           title="Chart settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]"
//         >
//           <Settings size={14} />
//         </button>
//         <button
//           type="button"
//           title="View history"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="w-full px-[14px] pt-[14px] pb-[22px]">
//         {isLoading ? (
//           <div className="flex h-[500px] items-center justify-center text-[13px] text-[#98A2B3]">
//             Loading organization chart…
//           </div>
//         ) : isError ? (
//           <div className="flex h-[500px] flex-col items-center justify-center gap-2 text-[13px] text-[#D92D20]">
//             Couldn't load the organization chart.
//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="text-[12px] font-medium text-[#C2410C] underline"
//             >
//               Retry
//             </button>
//           </div>
//         ) : !tree ? (
//           <div className="flex h-[500px] items-center justify-center text-[13px] text-[#98A2B3]">
//             No organization data to show{search ? ` for "${search}"` : ""}.
//           </div>
//         ) : (
//           <>
//             {/* Team chip */}
//             <div className="mb-[10px]">
//               <span className="inline-flex items-center rounded-[6px] border border-[#FED7AA] bg-[#FFF7ED] px-[10px] py-[5px] text-[11px] font-medium text-[#C2410C] shadow-[0_1px_2px_rgba(249,115,22,0.06)]">
//                 {chart?.TeamLabel || `${tree.name} Team`}
//               </span>
//             </div>

//             {/* Toolbar */}
//             <div className="mb-[14px] flex h-[38px] items-center gap-[6px] rounded-[9px] border border-[#FDBA74] bg-gradient-to-r from-[#FDBA74] via-[#FB923C] to-[#F97316] px-[10px] shadow-[0_2px_8px_rgba(249,115,22,0.22)]">
//               <ToolbarDropdown
//                 label={
//                   avatarMode === "initials" ? "Employee View" : "Photo View"
//                 }
//                 onClick={() =>
//                   setAvatarMode((m) =>
//                     m === "initials" ? "photo" : "initials"
//                   )
//                 }
//               />
//               <ToolbarDropdown
//                 label={
//                   cardDensity === "standard" ? "Standard View" : "Compact View"
//                 }
//                 onClick={() =>
//                   setCardDensity((d) =>
//                     d === "standard" ? "compact" : "standard"
//                   )
//                 }
//               />
//               {isFetching && !isLoading && (
//                 <span className="ml-1 text-[10.5px] font-medium text-white/90">
//                   Refreshing…
//                 </span>
//               )}
//               <button
//                 type="button"
//                 onClick={handlePrint}
//                 aria-label="Download chart"
//                 className="ml-auto flex h-[28px] w-[28px] items-center justify-center rounded-[7px] border border-white/40 bg-white/45 text-[#9A3412] shadow-[0_1px_3px_rgba(154,52,18,0.10)] transition-all hover:bg-white/70 hover:shadow-[0_2px_5px_rgba(154,52,18,0.14)] active:scale-95"
//               >
//                 <Download size={14} strokeWidth={2} />
//               </button>
//             </div>

//             {/* Header — organization name + total strength, from backend */}
//             <div className="mb-[10px] px-[2px]">
//               <h2 className="text-[14px] font-semibold text-[#1D2939]">
//                 Organization {chart?.OrganizationName}
//               </h2>
//               <p className="text-[12px] text-[#667085]">
//                 Total Strength:{" "}
//                 <span className="font-semibold text-[#C2410C]">
//                   {chart?.TotalStrength}
//                 </span>
//               </p>
//             </div>

//             {/* Chart card */}
//             <div className="relative min-h-[540px] w-full overflow-x-auto overflow-y-hidden rounded-[10px] border border-[#DCE4EE] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04),0_4px_12px_rgba(16,24,40,0.03)]">
//               <div className="absolute inset-[1px] pointer-events-none rounded-[9px] border border-[#F5F7FA]" />

//               <div className="relative flex min-w-[850px] justify-center px-[40px] pt-[36px] pb-[70px]">
//                 <OrgTree
//                   node={tree}
//                   compact={cardDensity === "compact"}
//                   showPhoto={avatarMode === "photo"}
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    TOOLBAR DROPDOWN
// ========================================================= */

// interface ToolbarDropdownProps {
//   label: string;
//   onClick?: () => void;
// }

// const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
//   label,
//   onClick,
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="flex h-[27px] items-center gap-[5px] rounded-[6px] border border-white/50 bg-white/45 px-[9px] text-[10.5px] font-medium text-[#7C2D12] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-white/70 hover:shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
//   >
//     <span className="whitespace-nowrap">{label}</span>
//     <ChevronDown size={11} strokeWidth={2.3} className="opacity-70" />
//   </button>
// );

// /* =========================================================
//    ORGANIZATION TREE (pure-CSS connector-line pattern)
// ========================================================= */

// const OrgTree: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   return (
//     <>
//       <style>{`
//         .org-tree, .org-tree ul, .org-tree li {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//           position: relative;
//         }
//         .org-tree {
//           display: flex;
//           justify-content: center;
//           width: max-content;
//           min-width: 100%;
//         }
//         .org-tree ul {
//           display: flex;
//           justify-content: center;
//           padding-top: 30px;
//         }
//         .org-tree li {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 30px 16px 0 16px;
//         }
//         .org-tree li::before, .org-tree li::after {
//           content: "";
//           position: absolute;
//           top: 0;
//           width: 50%;
//           height: 30px;
//           border-top: 1px solid #FDBA74;
//         }
//         .org-tree li::before { right: 50%; }
//         .org-tree li::after { left: 50%; border-left: 1px solid #FDBA74; }
//         .org-tree li:only-child::before, .org-tree li:only-child::after { display: none; }
//         .org-tree li:only-child { padding-top: 0; }
//         .org-tree li:first-child::before { border: 0; }
//         .org-tree li:last-child::after { border: 0; }
//         .org-tree li:last-child::before {
//           border-right: 1px solid #FDBA74;
//           border-radius: 0 5px 0 0;
//         }
//         .org-tree li:first-child::after { border-radius: 5px 0 0 0; }
//         .org-tree > li { padding-top: 0; }
//         .org-tree > li::before, .org-tree > li::after { display: none; }
//         .org-tree ul::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: 50%;
//           width: 0;
//           height: 30px;
//           border-left: 1px solid #FDBA74;
//         }
//       `}</style>

//       <ul className="org-tree">
//         <OrgTreeNode node={node} compact={compact} showPhoto={showPhoto} />
//       </ul>
//     </>
//   );
// };

// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const hasChildren = node.children.length > 0;

//   return (
//     <li>
//       <OrgCard node={node} compact={compact} showPhoto={showPhoto} />

//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() => setCollapsed((v) => !v)}
//           className="z-20 mt-[7px] flex h-[19px] min-w-[30px] items-center justify-center gap-[2px] rounded-full border border-[#FED7AA] bg-white px-[6px] text-[9px] font-medium text-[#C2410C] shadow-[0_1px_3px_rgba(16,24,40,0.08)] transition-all hover:border-[#FDBA74] hover:bg-[#FFF7ED]"
//         >
//           <ChevronDown
//             size={10}
//             strokeWidth={2.5}
//             className={`transition-transform duration-200 ${
//               collapsed ? "-rotate-90" : "rotate-0"
//             }`}
//           />
//           {node.children.length}
//         </button>
//       )}

//       {hasChildren && !collapsed && (
//         <ul>
//           {node.children.map((child) => (
//             <OrgTreeNode
//               key={child.id}
//               node={child}
//               compact={compact}
//               showPhoto={showPhoto}
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// /* =========================================================
//    ORGANIZATION CARD
// ========================================================= */

// const OrgCard: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const canShowPhoto = showPhoto && !!node.photoUrl;

//   return (
//     <div
//       className={`flex items-center gap-[9px] rounded-[7px] border border-[#DCE4EE] bg-white px-[10px] shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#FDBA74] hover:shadow-[0_4px_10px_rgba(249,115,22,0.12)] ${
//         compact ? "h-[38px] min-w-[150px] py-[4px]" : "h-[45px] min-w-[173px] py-[6px]"
//       }`}
//     >
//       {canShowPhoto ? (
//         <img
//           src={node.photoUrl!}
//           alt={node.name}
//           className={`shrink-0 rounded-[6px] object-cover shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
//             compact ? "h-[24px] w-[24px]" : "h-[28px] w-[28px]"
//           }`}
//         />
//       ) : (
//         <div
//           className={`flex shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br ${node.gradient} font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
//             compact ? "h-[24px] w-[24px] text-[8px]" : "h-[28px] w-[28px] text-[9px]"
//           }`}
//         >
//           {node.initials}
//         </div>
//       )}

//       <div className="min-w-0 flex-1">
//         <div className="truncate text-[10.5px] font-semibold leading-[14px] text-[#1E293B]">
//           {node.name}
//         </div>
//         <div className="mt-[1px] truncate text-[7.5px] font-medium uppercase leading-[10px] tracking-[0.02em] text-[#94A3B8]">
//           {node.title}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationChartPage;
















// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// import {
//   useGetOrganizationChartQuery,
//   type OrgChartEmployeeDTO,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    UI-SIDE TREE SHAPE
// ========================================================= */

// interface OrgNode {
//   id: string | number;
//   name: string;
//   title: string;
//   initials: string;
//   photoUrl: string | null;
//   gradient: string;
//   children: OrgNode[];
// }

// /* =========================================================
//    AVATAR COLORS
// ========================================================= */

// const AVATAR_GRADIENTS = [
//   "from-[#7C3AED] to-[#A855F7]",
//   "from-[#EC4899] to-[#F472B6]",
//   "from-[#F97316] to-[#FB923C]",
//   "from-[#10B981] to-[#34D399]",
//   "from-[#0EA5E9] to-[#38BDF8]",
//   "from-[#EAB308] to-[#FACC15]",
// ];

// const gradientFor = (id: string | number): string => {
//   const s = String(id);
//   let hash = 0;

//   for (let i = 0; i < s.length; i++) {
//     hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
//   }

//   return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
// };

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// /* =========================================================
//    BACKEND DTO -> ORGANIZATION TREE

//    Supports both:
//    EmployeeID / EmployeeName
//    Employee ID / Employee Name

//    ManagerID / ManagerName
//    Manager ID / Manager Name

//    Also supports ReportingAuthorityID.
// ========================================================= */

// function buildTree(
//   employees: OrgChartEmployeeDTO[],
//   rootId?: string | number | null
// ): OrgNode | null {
//   if (!employees?.length) return null;

//   type Employee = OrgChartEmployeeDTO & {
//     [key: string]: unknown;
//   };

//   const getValue = (
//     employee: Employee,
//     ...keys: string[]
//   ): string => {
//     for (const key of keys) {
//       const value = employee[key];

//       if (
//         value !== null &&
//         value !== undefined &&
//         value !== ""
//       ) {
//         return String(value).trim();
//       }
//     }

//     return "";
//   };

//   const normalized = (employees as Employee[])
//     .map((employee) => {
//       const id = getValue(
//         employee,
//         "EmployeeID",
//         "EmployeeId",
//         "Employee ID",
//         "employeeId"
//       );

//       const name = getValue(
//         employee,
//         "EmployeeName",
//         "Employee Name",
//         "employeeName"
//       );

//       const managerId = getValue(
//         employee,
//         "ReportingAuthorityID",
//         "ReportingAuthorityId",
//         "ManagerID",
//         "ManagerId",
//         "Manager ID",
//         "managerId"
//       );

//       const managerName = getValue(
//         employee,
//         "ManagerName",
//         "Manager Name",
//         "managerName"
//       );

//       const title = getValue(
//         employee,
//         "DesignationName",
//         "Designation",
//         "Designation Name",
//         "designation"
//       );

//       const photo = getValue(
//         employee,
//         "ProfilePhoto",
//         "ProfilePhotoUrl",
//         "PhotoUrl"
//       );

//       return {
//         id,
//         name,
//         managerId,
//         managerName,
//         title,
//         photo,
//       };
//     })
//     .filter((employee) => employee.id && employee.name);

//   if (!normalized.length) return null;

//   const byId = new Map(
//     normalized.map((employee) => [
//       employee.id,
//       employee,
//     ])
//   );

//   const byParent = new Map<
//     string,
//     (typeof normalized)[number][]
//   >();

//   normalized.forEach((employee) => {
//     const parentId = employee.managerId || "__root__";

//     if (!byParent.has(parentId)) {
//       byParent.set(parentId, []);
//     }

//     byParent.get(parentId)!.push(employee);
//   });

//   const visited = new Set<string>();

//   const toNode = (
//     employee: (typeof normalized)[number]
//   ): OrgNode => {
//     visited.add(employee.id);

//     const children = (
//       byParent.get(employee.id) ?? []
//     )
//       .filter((child) => !visited.has(child.id))
//       .map(toNode);

//     return {
//       id: employee.id,
//       name: employee.name,
//       title: employee.title,
//       initials: initialsFor(employee.name),
//       photoUrl: employee.photo || null,
//       gradient: gradientFor(employee.id),
//       children,
//     };
//   };

//   /* -------------------------------------------------------
//      1. Requested root employee
//   ------------------------------------------------------- */

//   if (rootId !== undefined && rootId !== null) {
//     const selected = byId.get(String(rootId));

//     if (selected) {
//       return toNode(selected);
//     }
//   }

//   /* -------------------------------------------------------
//      2. Find employees with no manager in the response

//      These can be actual organization roots or employees
//      whose manager is missing from the API result.
//   ------------------------------------------------------- */

//   const roots = normalized.filter(
//     (employee) =>
//       !employee.managerId ||
//       !byId.has(employee.managerId)
//   );

//   /* -------------------------------------------------------
//      3. Single root
//   ------------------------------------------------------- */

//   if (roots.length === 1) {
//     const root = roots[0];

//     // Manager information exists, but the manager employee
//     // record itself is missing from the API response.
//     if (root.managerId && !byId.has(root.managerId)) {
//       const managerChildren = normalized.filter(
//         (employee) =>
//           employee.managerId === root.managerId
//       );

//       return {
//         id: root.managerId,
//         name: root.managerName || "Reporting Manager",
//         title: "Manager",
//         initials: initialsFor(
//           root.managerName || "Manager"
//         ),
//         photoUrl: null,
//         gradient: "from-[#7C3AED] to-[#A855F7]",
//         children: managerChildren.map(toNode),
//       };
//     }

//     return toNode(root);
//   }

//   /* -------------------------------------------------------
//      4. Multiple roots
//   ------------------------------------------------------- */

//   if (roots.length > 1) {
//     const children = roots.map(toNode);

//     return {
//       id: "organization-root",
//       name: "Organization",
//       title: "Organization",
//       initials: "OR",
//       photoUrl: null,
//       gradient: "from-[#7C3AED] to-[#A855F7]",
//       children,
//     };
//   }

//   /* -------------------------------------------------------
//      5. No root employee found

//      All employees have a manager, but those managers
//      aren't present in the employee response.

//      Create a synthetic manager root.
//   ------------------------------------------------------- */

//   const first = normalized[0];

//   const managerChildren = normalized.filter(
//     (employee) =>
//       employee.managerId === first.managerId
//   );

//   return {
//     id: first.managerId || "manager-root",
//     name: first.managerName || "Reporting Manager",
//     title: "Manager",
//     initials: initialsFor(
//       first.managerName || "Manager"
//     ),
//     photoUrl: null,
//     gradient: "from-[#7C3AED] to-[#A855F7]",
//     children: managerChildren.map(toNode),
//   };
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   // Debounce the search box before it hits the backend.
//   useEffect(() => {
//     const t = setTimeout(
//       () => setSearch(searchInput.trim()),
//       400
//     );

//     return () => clearTimeout(t);
//   }, [searchInput]);

//   const [cardDensity, setCardDensity] = useState<
//     "standard" | "compact"
//   >("standard");

//   const [avatarMode, setAvatarMode] = useState<
//     "initials" | "photo"
//   >("initials");

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetOrganizationChartQuery({
//     search: search || undefined,
//   });

//   const chart = data?.data;

//   const tree = useMemo(
//     () =>
//       chart
//         ? buildTree(chart.Employees, undefined)
//         : null,
//     [chart]
//   );

//   const handlePrint = () => window.print();

//   return (
//     <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC]">
//       {/* Top tabs */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       {/* Search + actions */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />

//           <input
//             value={searchInput}
//             onChange={(e) =>
//               setSearchInput(e.target.value)
//             }
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E4E7EC] bg-white pl-7 pr-2 text-[12px] text-[#344054] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handlePrint}
//           title="Download / print chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C] hover:bg-[#FFEDD5]"
//         >
//           <Download size={14} />
//         </button>

//         <button
//           type="button"
//           title="Chart settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]"
//         >
//           <Settings size={14} />
//         </button>

//         <button
//           type="button"
//           title="View history"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="w-full px-[14px] pt-[14px] pb-[22px]">
//         {isLoading ? (
//           <div className="flex h-[500px] items-center justify-center text-[13px] text-[#98A2B3]">
//             Loading organization chart…
//           </div>
//         ) : isError ? (
//           <div className="flex h-[500px] flex-col items-center justify-center gap-2 text-[13px] text-[#D92D20]">
//             Couldn't load the organization chart.

//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="text-[12px] font-medium text-[#C2410C] underline"
//             >
//               Retry
//             </button>
//           </div>
//         ) : !tree ? (
//           <div className="flex h-[500px] items-center justify-center text-[13px] text-[#98A2B3]">
//             No organization data to show
//             {search ? ` for "${search}"` : ""}.
//           </div>
//         ) : (
//           <>
//             {/* Team chip */}
//             <div className="mb-[10px]">
//               <span className="inline-flex items-center rounded-[6px] border border-[#FED7AA] bg-[#FFF7ED] px-[10px] py-[5px] text-[11px] font-medium text-[#C2410C] shadow-[0_1px_2px_rgba(249,115,22,0.06)]">
//                 {chart?.TeamLabel || `${tree.name} Team`}
//               </span>
//             </div>

//             {/* Toolbar */}
//             <div className="mb-[14px] flex h-[38px] items-center gap-[6px] rounded-[9px] border border-[#FDBA74] bg-gradient-to-r from-[#FDBA74] via-[#FB923C] to-[#F97316] px-[10px] shadow-[0_2px_8px_rgba(249,115,22,0.22)]">
//               <ToolbarDropdown
//                 label={
//                   avatarMode === "initials"
//                     ? "Employee View"
//                     : "Photo View"
//                 }
//                 onClick={() =>
//                   setAvatarMode((m) =>
//                     m === "initials"
//                       ? "photo"
//                       : "initials"
//                   )
//                 }
//               />

//               <ToolbarDropdown
//                 label={
//                   cardDensity === "standard"
//                     ? "Standard View"
//                     : "Compact View"
//                 }
//                 onClick={() =>
//                   setCardDensity((d) =>
//                     d === "standard"
//                       ? "compact"
//                       : "standard"
//                   )
//                 }
//               />

//               {isFetching && !isLoading && (
//                 <span className="ml-1 text-[10.5px] font-medium text-white/90">
//                   Refreshing…
//                 </span>
//               )}

//               <button
//                 type="button"
//                 onClick={handlePrint}
//                 aria-label="Download chart"
//                 className="ml-auto flex h-[28px] w-[28px] items-center justify-center rounded-[7px] border border-white/40 bg-white/45 text-[#9A3412] shadow-[0_1px_3px_rgba(154,52,18,0.10)] transition-all hover:bg-white/70 hover:shadow-[0_2px_5px_rgba(154,52,18,0.14)] active:scale-95"
//               >
//                 <Download
//                   size={14}
//                   strokeWidth={2}
//                 />
//               </button>
//             </div>

//             {/* Organization header */}
//             <div className="mb-[10px] px-[2px]">
//               <h2 className="text-[14px] font-semibold text-[#1D2939]">
//                 Organization {chart?.OrganizationName}
//               </h2>

//               <p className="text-[12px] text-[#667085]">
//                 Total Strength:{" "}
//                 <span className="font-semibold text-[#C2410C]">
//                   {chart?.TotalStrength}
//                 </span>
//               </p>
//             </div>

//             {/* Chart card */}
//             <div className="relative min-h-[540px] w-full overflow-x-auto overflow-y-hidden rounded-[10px] border border-[#DCE4EE] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04),0_4px_12px_rgba(16,24,40,0.03)]">
//               <div className="absolute inset-[1px] pointer-events-none rounded-[9px] border border-[#F5F7FA]" />

//               <div className="relative flex min-w-[850px] justify-center px-[40px] pt-[36px] pb-[70px]">
//                 <OrgTree
//                   node={tree}
//                   compact={cardDensity === "compact"}
//                   showPhoto={avatarMode === "photo"}
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    TOOLBAR DROPDOWN
// ========================================================= */

// interface ToolbarDropdownProps {
//   label: string;
//   onClick?: () => void;
// }

// const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
//   label,
//   onClick,
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="flex h-[27px] items-center gap-[5px] rounded-[6px] border border-white/50 bg-white/45 px-[9px] text-[10.5px] font-medium text-[#7C2D12] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-white/70 hover:shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
//   >
//     <span className="whitespace-nowrap">
//       {label}
//     </span>

//     <ChevronDown
//       size={11}
//       strokeWidth={2.3}
//       className="opacity-70"
//     />
//   </button>
// );

// /* =========================================================
//    ORGANIZATION TREE
// ========================================================= */

// const OrgTree: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   return (
//     <>
//       <style>{`
//         .org-tree, .org-tree ul, .org-tree li {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//           position: relative;
//         }

//         .org-tree {
//           display: flex;
//           justify-content: center;
//           width: max-content;
//           min-width: 100%;
//         }

//         .org-tree ul {
//           display: flex;
//           justify-content: center;
//           padding-top: 30px;
//         }

//         .org-tree li {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 30px 16px 0 16px;
//         }

//         .org-tree li::before,
//         .org-tree li::after {
//           content: "";
//           position: absolute;
//           top: 0;
//           width: 50%;
//           height: 30px;
//           border-top: 1px solid #FDBA74;
//         }

//         .org-tree li::before {
//           right: 50%;
//         }

//         .org-tree li::after {
//           left: 50%;
//           border-left: 1px solid #FDBA74;
//         }

//         .org-tree li:only-child::before,
//         .org-tree li:only-child::after {
//           display: none;
//         }

//         .org-tree li:only-child {
//           padding-top: 0;
//         }

//         .org-tree li:first-child::before {
//           border: 0;
//         }

//         .org-tree li:last-child::after {
//           border: 0;
//         }

//         .org-tree li:last-child::before {
//           border-right: 1px solid #FDBA74;
//           border-radius: 0 5px 0 0;
//         }

//         .org-tree li:first-child::after {
//           border-radius: 5px 0 0 0;
//         }

//         .org-tree > li {
//           padding-top: 0;
//         }

//         .org-tree > li::before,
//         .org-tree > li::after {
//           display: none;
//         }

//         .org-tree ul::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: 50%;
//           width: 0;
//           height: 30px;
//           border-left: 1px solid #FDBA74;
//         }
//       `}</style>

//       <ul className="org-tree">
//         <OrgTreeNode
//           node={node}
//           compact={compact}
//           showPhoto={showPhoto}
//         />
//       </ul>
//     </>
//   );
// };

// /* =========================================================
//    ORGANIZATION TREE NODE
// ========================================================= */

// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const [collapsed, setCollapsed] = useState(false);

//   const hasChildren = node.children.length > 0;

//   return (
//     <li>
//       <OrgCard
//         node={node}
//         compact={compact}
//         showPhoto={showPhoto}
//       />

//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed((v) => !v)
//           }
//           className="z-20 mt-[7px] flex h-[19px] min-w-[30px] items-center justify-center gap-[2px] rounded-full border border-[#FED7AA] bg-white px-[6px] text-[9px] font-medium text-[#C2410C] shadow-[0_1px_3px_rgba(16,24,40,0.08)] transition-all hover:border-[#FDBA74] hover:bg-[#FFF7ED]"
//         >
//           <ChevronDown
//             size={10}
//             strokeWidth={2.5}
//             className={`transition-transform duration-200 ${
//               collapsed
//                 ? "-rotate-90"
//                 : "rotate-0"
//             }`}
//           />

//           {node.children.length}
//         </button>
//       )}

//       {hasChildren && !collapsed && (
//         <ul>
//           {node.children.map((child) => (
//             <OrgTreeNode
//               key={child.id}
//               node={child}
//               compact={compact}
//               showPhoto={showPhoto}
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// /* =========================================================
//    ORGANIZATION CARD
// ========================================================= */

// const OrgCard: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const canShowPhoto =
//     showPhoto && !!node.photoUrl;

//   return (
//     <div
//       className={`flex items-center gap-[9px] rounded-[7px] border border-[#DCE4EE] bg-white px-[10px] shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#FDBA74] hover:shadow-[0_4px_10px_rgba(249,115,22,0.12)] ${
//         compact
//           ? "h-[38px] min-w-[150px] py-[4px]"
//           : "h-[45px] min-w-[173px] py-[6px]"
//       }`}
//     >
//       {canShowPhoto ? (
//         <img
//           src={node.photoUrl!}
//           alt={node.name}
//           className={`shrink-0 rounded-[6px] object-cover shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
//             compact
//               ? "h-[24px] w-[24px]"
//               : "h-[28px] w-[28px]"
//           }`}
//         />
//       ) : (
//         <div
//           className={`flex shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br ${node.gradient} font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
//             compact
//               ? "h-[24px] w-[24px] text-[8px]"
//               : "h-[28px] w-[28px] text-[9px]"
//           }`}
//         >
//           {node.initials}
//         </div>
//       )}

//       <div className="min-w-0 flex-1">
//         <div className="truncate text-[10.5px] font-semibold leading-[14px] text-[#1E293B]">
//           {node.name}
//         </div>

//         <div className="mt-[1px] truncate text-[7.5px] font-medium uppercase leading-[10px] tracking-[0.02em] text-[#94A3B8]">
//           {node.title}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationChartPage;

















// import React, { useEffect, useMemo, useState } from "react";
// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// import {
//   useGetOrganizationChartQuery,
//   type OrgChartEmployeeDTO,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface OrgNode {
//   id: string;
//   name: string;
//   title: string;
//   initials: string;
//   photoUrl: string | null;
//   gradient: string;
//   children: OrgNode[];
// }

// type EmployeeRecord = Record<string, unknown>;

// interface NormalizedEmployee {
//   id: string;
//   name: string;
//   managerId: string;
//   managerName: string;
//   title: string;
//   photo: string;
// }

// /* =========================================================
//    AVATAR COLORS
// ========================================================= */

// const AVATAR_GRADIENTS = [
//   "from-[#7C3AED] to-[#A855F7]",
//   "from-[#EC4899] to-[#F472B6]",
//   "from-[#F97316] to-[#FB923C]",
//   "from-[#10B981] to-[#34D399]",
//   "from-[#0EA5E9] to-[#38BDF8]",
//   "from-[#EAB308] to-[#FACC15]",
// ];

// const gradientFor = (id: string | number): string => {
//   const value = String(id);
//   let hash = 0;

//   for (let i = 0; i < value.length; i++) {
//     hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
//   }

//   return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
// };

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// /* =========================================================
//    BACKEND FIELD MAPPING

//    Supports:
//    Employee ID / EmployeeID / EmployeeId
//    Employee Name / EmployeeName
//    Manager ID / ManagerID / ReportingAuthorityID
//    Manager Name / ManagerName
//    Designation / DesignationName
// ========================================================= */

// const getValue = (
//   employee: EmployeeRecord,
//   ...keys: string[]
// ): string => {
//   for (const key of keys) {
//     const value = employee[key];

//     if (value !== null && value !== undefined) {
//       const result = String(value).trim();

//       if (result !== "") {
//         return result;
//       }
//     }
//   }

//   return "";
// };

// const normalizeEmployee = (
//   employee: EmployeeRecord
// ): NormalizedEmployee => {
//   return {
//     id: getValue(
//       employee,
//       "Employee ID",
//       "EmployeeID",
//       "EmployeeId",
//       "employeeId"
//     ),

//     name: getValue(
//       employee,
//       "Employee Name",
//       "EmployeeName",
//       "EmployeeFullName",
//       "employeeName"
//     ),

//     managerId: getValue(
//       employee,
//       "Manager ID",
//       "ManagerID",
//       "ManagerId",
//       "ReportingAuthorityID",
//       "ReportingAuthorityId",
//       "managerId"
//     ),

//     managerName: getValue(
//       employee,
//       "Manager Name",
//       "ManagerName",
//       "managerName"
//     ),

//     title: getValue(
//       employee,
//       "Designation",
//       "DesignationName",
//       "Designation Name",
//       "designation"
//     ),

//     photo: getValue(
//       employee,
//       "ProfilePhoto",
//       "ProfilePhotoUrl",
//       "PhotoUrl"
//     ),
//   };
// };

// /* =========================================================
//    EXTRACT EMPLOYEE ARRAY

//    Handles:
//    1. Direct API array
//    2. { data: [...] }
//    3. { data: { Employees: [...] } }
//    4. { Employees: [...] }
// ========================================================= */

// const extractEmployees = (
//   response: unknown
// ): EmployeeRecord[] => {
//   if (Array.isArray(response)) {
//     return response as EmployeeRecord[];
//   }

//   if (
//     !response ||
//     typeof response !== "object"
//   ) {
//     return [];
//   }

//   const result = response as Record<string, unknown>;

//   if (Array.isArray(result.Employees)) {
//     return result.Employees as EmployeeRecord[];
//   }

//   if (Array.isArray(result.data)) {
//     return result.data as EmployeeRecord[];
//   }

//   if (
//     result.data &&
//     typeof result.data === "object"
//   ) {
//     const nested = result.data as Record<string, unknown>;

//     if (Array.isArray(nested.Employees)) {
//       return nested.Employees as EmployeeRecord[];
//     }

//     if (Array.isArray(nested.data)) {
//       return nested.data as EmployeeRecord[];
//     }
//   }

//   if (Array.isArray(result.Data)) {
//     return result.Data as EmployeeRecord[];
//   }

//   return [];
// };

// /* =========================================================
//    ORGANIZATION TREE BUILDER

//    - Matches manager IDs to employee IDs.
//    - Trims IDs before matching.
//    - Supports managers missing from the response.
//    - Preserves employees with null managers.
//    - Prevents circular references.
//    - Supports multiple organization roots.
// ========================================================= */

// function buildTree(
//   employees: OrgChartEmployeeDTO[],
//   rootId?: string | number | null
// ): OrgNode | null {
//   if (!employees?.length) {
//     return null;
//   }

//   const normalized = (
//     employees as EmployeeRecord[]
//   )
//     .map(normalizeEmployee)
//     .filter((employee) => employee.id && employee.name);

//   if (!normalized.length) {
//     return null;
//   }

//   const byId = new Map<string, NormalizedEmployee>();

//   normalized.forEach((employee) => {
//     byId.set(employee.id, employee);
//   });

//   const childrenByManager = new Map<
//     string,
//     NormalizedEmployee[]
//   >();

//   normalized.forEach((employee) => {
//     if (!employee.managerId) {
//       return;
//     }

//     const managerId = employee.managerId;

//     if (!childrenByManager.has(managerId)) {
//       childrenByManager.set(managerId, []);
//     }

//     childrenByManager.get(managerId)!.push(employee);
//   });

//   const visited = new Set<string>();

//   const toNode = (
//     employee: NormalizedEmployee
//   ): OrgNode => {
//     visited.add(employee.id);

//     const children = (
//       childrenByManager.get(employee.id) ?? []
//     )
//       .filter((child) => !visited.has(child.id))
//       .map(toNode);

//     return {
//       id: employee.id,
//       name: employee.name,
//       title: employee.title,
//       initials: initialsFor(employee.name),
//       photoUrl: employee.photo || null,
//       gradient: gradientFor(employee.id),
//       children,
//     };
//   };

//   /* -------------------------------------------------------
//      1. Explicitly requested employee root
//   ------------------------------------------------------- */

//   if (rootId !== undefined && rootId !== null) {
//     const selected = byId.get(String(rootId).trim());

//     if (selected) {
//       return toNode(selected);
//     }
//   }

//   /* -------------------------------------------------------
//      2. Find actual organization roots and missing managers
//   ------------------------------------------------------- */

//   const actualRoots = normalized.filter(
//     (employee) => !employee.managerId
//   );

//   const missingManagerGroups = new Map<
//     string,
//     NormalizedEmployee[]
//   >();

//   normalized.forEach((employee) => {
//     if (
//       employee.managerId &&
//       !byId.has(employee.managerId)
//     ) {
//       const key = employee.managerId;

//       if (!missingManagerGroups.has(key)) {
//         missingManagerGroups.set(key, []);
//       }

//       missingManagerGroups.get(key)!.push(employee);
//     }
//   });

//   /* -------------------------------------------------------
//      3. Build roots

//      Employees with null Manager ID are real roots.

//      When the manager isn't included in the employee list,
//      create a synthetic manager card.
//   ------------------------------------------------------- */

//   const roots: OrgNode[] = actualRoots.map(toNode);

//   missingManagerGroups.forEach(
//     (managerEmployees, managerId) => {
//       const managerName =
//         managerEmployees.find(
//           (employee) => employee.managerName
//         )?.managerName || "Reporting Manager";

//       const managerNode: OrgNode = {
//         id: `manager-${managerId}`,
//         name: managerName,
//         title: "Manager",
//         initials: initialsFor(managerName),
//         photoUrl: null,
//         gradient: gradientFor(managerId),
//         children: managerEmployees
//           .filter(
//             (employee) => !visited.has(employee.id)
//           )
//           .map(toNode),
//       };

//       roots.push(managerNode);
//     }
//   );

//   /* -------------------------------------------------------
//      4. If no roots were found, handle circular/orphan data
//   ------------------------------------------------------- */

//   if (roots.length === 0) {
//     const remaining = normalized.filter(
//       (employee) => !visited.has(employee.id)
//     );

//     remaining.forEach((employee) => {
//       roots.push(toNode(employee));
//     });
//   }

//   /* -------------------------------------------------------
//      5. Return a single root or a shared organization root
//   ------------------------------------------------------- */

//   if (roots.length === 1) {
//     return roots[0];
//   }

//   return {
//     id: "organization-root",
//     name: "Organization",
//     title: "Organization",
//     initials: "OR",
//     photoUrl: null,
//     gradient: "from-[#7C3AED] to-[#A855F7]",
//     children: roots,
//   };
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setSearch(searchInput.trim());
//     }, 400);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   const [cardDensity, setCardDensity] = useState<
//     "standard" | "compact"
//   >("standard");

//   const [avatarMode, setAvatarMode] = useState<
//     "initials" | "photo"
//   >("initials");

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetOrganizationChartQuery({
//     search: search || undefined,
//   });

//   /* -------------------------------------------------------
//      FIX: API response may be a direct array.
//   ------------------------------------------------------- */

//   const employees = useMemo(
//     () => extractEmployees(data),
//     [data]
//   );

//   const tree = useMemo(
//     () => buildTree(employees),
//     [employees]
//   );

//   const handlePrint = () => {
//     window.print();
//   };

//   return (
//     <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC]">

//       {/* Enrollment tabs */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       {/* Search + actions */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />

//           <input
//             value={searchInput}
//             onChange={(e) =>
//               setSearchInput(e.target.value)
//             }
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E4E7EC] bg-white pl-7 pr-2 text-[12px] text-[#344054] outline-none transition focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/15"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handlePrint}
//           title="Download / print chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#FED7AA] bg-[#FFF7ED] text-[#C2410C] hover:bg-[#FFEDD5]"
//         >
//           <Download size={14} />
//         </button>

//         <button
//           type="button"
//           title="Chart settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]"
//         >
//           <Settings size={14} />
//         </button>

//         <button
//           type="button"
//           title="View history"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] hover:bg-[#F9FAFB]"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="w-full px-[14px] pt-[14px] pb-[22px]">

//         {isLoading ? (
//           <div className="flex h-[500px] items-center justify-center text-[13px] text-[#98A2B3]">
//             Loading organization chart…
//           </div>
//         ) : isError ? (
//           <div className="flex h-[500px] flex-col items-center justify-center gap-2 text-[13px] text-[#D92D20]">
//             Couldn't load the organization chart.

//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="text-[12px] font-medium text-[#C2410C] underline"
//             >
//               Retry
//             </button>
//           </div>
//         ) : !tree ? (
//           <div className="flex h-[500px] items-center justify-center text-[13px] text-[#98A2B3]">
//             {search
//               ? `No organization data to show for "${search}".`
//               : "No organization data to show."}
//           </div>
//         ) : (
//           <>
//             {/* Team chip */}
//             <div className="mb-[10px]">
//               <span className="inline-flex items-center rounded-[6px] border border-[#FED7AA] bg-[#FFF7ED] px-[10px] py-[5px] text-[11px] font-medium text-[#C2410C] shadow-[0_1px_2px_rgba(249,115,22,0.06)]">
//                 Organization Team
//               </span>
//             </div>

//             {/* Chart toolbar */}
//             <div className="mb-[14px] flex h-[38px] items-center gap-[6px] rounded-[9px] border border-[#FDBA74] bg-gradient-to-r from-[#FDBA74] via-[#FB923C] to-[#F97316] px-[10px] shadow-[0_2px_8px_rgba(249,115,22,0.22)]">

//               <ToolbarDropdown
//                 label={
//                   avatarMode === "initials"
//                     ? "Employee View"
//                     : "Photo View"
//                 }
//                 onClick={() =>
//                   setAvatarMode((mode) =>
//                     mode === "initials"
//                       ? "photo"
//                       : "initials"
//                   )
//                 }
//               />

//               <ToolbarDropdown
//                 label={
//                   cardDensity === "standard"
//                     ? "Standard View"
//                     : "Compact View"
//                 }
//                 onClick={() =>
//                   setCardDensity((density) =>
//                     density === "standard"
//                       ? "compact"
//                       : "standard"
//                   )
//                 }
//               />

//               {isFetching && !isLoading && (
//                 <span className="ml-1 text-[10.5px] font-medium text-white/90">
//                   Refreshing…
//                 </span>
//               )}

//               <button
//                 type="button"
//                 onClick={handlePrint}
//                 aria-label="Download chart"
//                 className="ml-auto flex h-[28px] w-[28px] items-center justify-center rounded-[7px] border border-white/40 bg-white/45 text-[#9A3412] shadow-[0_1px_3px_rgba(154,52,18,0.10)] transition-all hover:bg-white/70 hover:shadow-[0_2px_5px_rgba(154,52,18,0.14)] active:scale-95"
//               >
//                 <Download size={14} strokeWidth={2} />
//               </button>
//             </div>

//             {/* Organization heading */}
//             <div className="mb-[10px] px-[2px]">
//               <h2 className="text-[14px] font-semibold text-[#1D2939]">
//                 Organization Chart
//               </h2>

//               <p className="text-[12px] text-[#667085]">
//                 Total Strength:{" "}
//                 <span className="font-semibold text-[#C2410C]">
//                   {employees.length}
//                 </span>
//               </p>
//             </div>

//             {/* Chart card */}
//             <div className="relative min-h-[540px] w-full overflow-auto rounded-[10px] border border-[#DCE4EE] bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04),0_4px_12px_rgba(16,24,40,0.03)]">

//               <div className="pointer-events-none absolute inset-[1px] rounded-[9px] border border-[#F5F7FA]" />

//               <div className="relative flex min-w-[850px] justify-center px-[40px] pt-[36px] pb-[70px]">
//                 <OrgTree
//                   node={tree}
//                   compact={cardDensity === "compact"}
//                   showPhoto={avatarMode === "photo"}
//                 />
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    TOOLBAR DROPDOWN
// ========================================================= */

// interface ToolbarDropdownProps {
//   label: string;
//   onClick?: () => void;
// }

// const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
//   label,
//   onClick,
// }) => (
//   <button
//     type="button"
//     onClick={onClick}
//     className="flex h-[27px] items-center gap-[5px] rounded-[6px] border border-white/50 bg-white/45 px-[9px] text-[10.5px] font-medium text-[#7C2D12] shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:bg-white/70 hover:shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
//   >
//     <span className="whitespace-nowrap">{label}</span>

//     <ChevronDown
//       size={11}
//       strokeWidth={2.3}
//       className="opacity-70"
//     />
//   </button>
// );

// /* =========================================================
//    ORGANIZATION TREE
// ========================================================= */

// const OrgTree: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   return (
//     <>
//       <style>{`
//         .org-tree,
//         .org-tree ul,
//         .org-tree li {
//           list-style: none;
//           margin: 0;
//           padding: 0;
//           position: relative;
//         }

//         .org-tree {
//           display: flex;
//           justify-content: center;
//           width: max-content;
//           min-width: 100%;
//         }

//         .org-tree ul {
//           display: flex;
//           justify-content: center;
//           padding-top: 30px;
//         }

//         .org-tree li {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           padding: 30px 16px 0 16px;
//         }

//         .org-tree li::before,
//         .org-tree li::after {
//           content: "";
//           position: absolute;
//           top: 0;
//           width: 50%;
//           height: 30px;
//           border-top: 1px solid #FDBA74;
//         }

//         .org-tree li::before {
//           right: 50%;
//         }

//         .org-tree li::after {
//           left: 50%;
//           border-left: 1px solid #FDBA74;
//         }

//         .org-tree li:only-child::before,
//         .org-tree li:only-child::after {
//           display: none;
//         }

//         .org-tree li:only-child {
//           padding-top: 0;
//         }

//         .org-tree li:first-child::before {
//           border: 0;
//         }

//         .org-tree li:last-child::after {
//           border: 0;
//         }

//         .org-tree li:last-child::before {
//           border-right: 1px solid #FDBA74;
//           border-radius: 0 5px 0 0;
//         }

//         .org-tree li:first-child::after {
//           border-radius: 5px 0 0 0;
//         }

//         .org-tree > li {
//           padding-top: 0;
//         }

//         .org-tree > li::before,
//         .org-tree > li::after {
//           display: none;
//         }

//         .org-tree ul::before {
//           content: "";
//           position: absolute;
//           top: 0;
//           left: 50%;
//           width: 0;
//           height: 30px;
//           border-left: 1px solid #FDBA74;
//         }
//       `}</style>

//       <ul className="org-tree">
//         <OrgTreeNode
//           node={node}
//           compact={compact}
//           showPhoto={showPhoto}
//         />
//       </ul>
//     </>
//   );
// };

// /* =========================================================
//    ORGANIZATION TREE NODE
// ========================================================= */

// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const [collapsed, setCollapsed] = useState(false);

//   const hasChildren = node.children.length > 0;

//   return (
//     <li>
//       <OrgCard
//         node={node}
//         compact={compact}
//         showPhoto={showPhoto}
//       />

//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed((value) => !value)
//           }
//           className="z-20 mt-[7px] flex h-[19px] min-w-[30px] items-center justify-center gap-[2px] rounded-full border border-[#FED7AA] bg-white px-[6px] text-[9px] font-medium text-[#C2410C] shadow-[0_1px_3px_rgba(16,24,40,0.08)] transition-all hover:border-[#FDBA74] hover:bg-[#FFF7ED]"
//         >
//           <ChevronDown
//             size={10}
//             strokeWidth={2.5}
//             className={`transition-transform duration-200 ${
//               collapsed
//                 ? "-rotate-90"
//                 : "rotate-0"
//             }`}
//           />

//           {node.children.length}
//         </button>
//       )}

//       {hasChildren && !collapsed && (
//         <ul>
//           {node.children.map((child) => (
//             <OrgTreeNode
//               key={child.id}
//               node={child}
//               compact={compact}
//               showPhoto={showPhoto}
//             />
//           ))}
//         </ul>
//       )}
//     </li>
//   );
// };

// /* =========================================================
//    ORGANIZATION CARD
// ========================================================= */

// const OrgCard: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const canShowPhoto =
//     showPhoto && !!node.photoUrl;

//   return (
//     <div
//       className={`flex items-center gap-[9px] rounded-[7px] border border-[#DCE4EE] bg-white px-[10px] shadow-[0_1px_3px_rgba(16,24,40,0.05)] transition-all duration-200 hover:-translate-y-[1px] hover:border-[#FDBA74] hover:shadow-[0_4px_10px_rgba(249,115,22,0.12)] ${
//         compact
//           ? "h-[38px] min-w-[150px] py-[4px]"
//           : "h-[45px] min-w-[173px] py-[6px]"
//       }`}
//     >
//       {canShowPhoto ? (
//         <img
//           src={node.photoUrl!}
//           alt={node.name}
//           className={`shrink-0 rounded-[6px] object-cover shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
//             compact
//               ? "h-[24px] w-[24px]"
//               : "h-[28px] w-[28px]"
//           }`}
//         />
//       ) : (
//         <div
//           className={`flex shrink-0 items-center justify-center rounded-[6px] bg-gradient-to-br ${node.gradient} font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.12)] ${
//             compact
//               ? "h-[24px] w-[24px] text-[8px]"
//               : "h-[28px] w-[28px] text-[9px]"
//           }`}
//         >
//           {node.initials}
//         </div>
//       )}

//       <div className="min-w-0 flex-1">
//         <div className="truncate text-[10.5px] font-semibold leading-[14px] text-[#1E293B]">
//           {node.name}
//         </div>

//         <div className="mt-[1px] truncate text-[7.5px] font-medium uppercase leading-[10px] tracking-[0.02em] text-[#94A3B8]">
//           {node.title}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizationChartPage;























// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";

// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
//   Users,
//   Loader2,
//   AlertTriangle,
//   ImageOff,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// import {
//   useGetOrganizationChartQuery,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface EmployeeRecord {
//   [key: string]: unknown;
// }

// interface Employee {
//   id: string;
//   name: string;
//   managerId: string;
//   managerName: string;
//   designation: string;
//   photo: string;
// }

// interface OrgNode {
//   id: string;
//   name: string;
//   designation: string;
//   photo: string;
//   children: OrgNode[];
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getValue = (
//   employee: EmployeeRecord,
//   ...keys: string[]
// ): string => {
//   for (const key of keys) {
//     const value = employee[key];

//     if (value !== null && value !== undefined) {
//       const text = String(value).trim();

//       if (text !== "") {
//         return text;
//       }
//     }
//   }

//   return "";
// };

// const normalizeEmployee = (
//   record: EmployeeRecord
// ): Employee => ({
//   id: getValue(
//     record,
//     "Employee ID",
//     "EmployeeID",
//     "EmployeeId",
//     "employeeId"
//   ),

//   name: getValue(
//     record,
//     "Employee Name",
//     "EmployeeName",
//     "EmployeeFullName",
//     "employeeName"
//   ),

//   managerId: getValue(
//     record,
//     "Manager ID",
//     "ManagerID",
//     "ManagerId",
//     "ReportingAuthorityID",
//     "ReportingAuthorityId",
//     "managerId"
//   ),

//   managerName: getValue(
//     record,
//     "Manager Name",
//     "ManagerName",
//     "managerName"
//   ),

//   designation: getValue(
//     record,
//     "Designation",
//     "Designation Name",
//     "DesignationName",
//     "designation"
//   ),

//   photo: getValue(
//     record,
//     "ProfilePhotoUrl",
//     "ProfilePhoto",
//     "PhotoUrl",
//     "photo"
//   ),
// });

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// /* Deterministic color pair for avatar fallback, based on name */
// const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
//   { bg: "#E0F2FE", text: "#0369A1" },
//   { bg: "#FEF3C7", text: "#B45309" },
//   { bg: "#DCFCE7", text: "#15803D" },
//   { bg: "#FCE7F3", text: "#BE185D" },
//   { bg: "#EDE9FE", text: "#6D28D9" },
//   { bg: "#FFE4E6", text: "#BE123C" },
// ];

// const avatarColorFor = (name: string) => {
//   let hash = 0;

//   for (let i = 0; i < name.length; i += 1) {
//     hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
//   }

//   return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
// };

// /* =========================================================
//    API RESPONSE EXTRACTION

//    Supports:
//    [...]
//    { data: [...] }
//    { Employees: [...] }
//    { data: { Employees: [...] } }
// ========================================================= */

// const extractEmployees = (
//   response: unknown
// ): EmployeeRecord[] => {
//   if (Array.isArray(response)) {
//     return response as EmployeeRecord[];
//   }

//   if (!response || typeof response !== "object") {
//     return [];
//   }

//   const result = response as Record<string, unknown>;

//   if (Array.isArray(result.Employees)) {
//     return result.Employees as EmployeeRecord[];
//   }

//   if (Array.isArray(result.data)) {
//     return result.data as EmployeeRecord[];
//   }

//   if (Array.isArray(result.Data)) {
//     return result.Data as EmployeeRecord[];
//   }

//   if (
//     result.data &&
//     typeof result.data === "object"
//   ) {
//     const nested = result.data as Record<string, unknown>;

//     if (Array.isArray(nested.Employees)) {
//       return nested.Employees as EmployeeRecord[];
//     }

//     if (Array.isArray(nested.data)) {
//       return nested.data as EmployeeRecord[];
//     }
//   }

//   return [];
// };

// /* =========================================================
//    BUILD ORGANIZATION TREE

//    No synthetic Organization card.
//    No synthetic Reporting Manager card.

//    Employees with missing manager records are displayed
//    as standalone roots using their actual employee data.
// ========================================================= */

// function buildTree(records: EmployeeRecord[]): OrgNode[] {
//   const employees = records
//     .map(normalizeEmployee)
//     .filter((employee) => employee.id && employee.name);

//   const employeeById = new Map<string, Employee>();

//   employees.forEach((employee) => {
//     employeeById.set(employee.id, employee);
//   });

//   const nodeById = new Map<string, OrgNode>();

//   employees.forEach((employee) => {
//     nodeById.set(employee.id, {
//       id: employee.id,
//       name: employee.name,
//       designation: employee.designation,
//       photo: employee.photo,
//       children: [],
//     });
//   });

//   const roots: OrgNode[] = [];
//   const attached = new Set<string>();

//   employees.forEach((employee) => {
//     const node = nodeById.get(employee.id)!;
//     const managerId = employee.managerId.trim();

//     // Actual root employee from the backend.
//     if (!managerId) {
//       roots.push(node);
//       attached.add(employee.id);
//       return;
//     }

//     // Attach only when the manager exists in API response.
//     const manager = employeeById.get(managerId);

//     if (manager && manager.id !== employee.id) {
//       const managerNode = nodeById.get(manager.id)!;

//       managerNode.children.push(node);
//       attached.add(employee.id);
//     }
//   });

//   // Promote employees whose manager is missing from
//   // the backend response to standalone actual employee roots.
//   employees.forEach((employee) => {
//     if (!attached.has(employee.id)) {
//       const node = nodeById.get(employee.id)!;

//       if (!roots.some((root) => root.id === node.id)) {
//         roots.push(node);
//       }

//       attached.add(employee.id);
//     }
//   });

//   // Prevent circular parent-child relationships from
//   // causing recursive rendering loops.
//   const visited = new Set<string>();

//   const cleanTree = (node: OrgNode): OrgNode => {
//     if (visited.has(node.id)) {
//       return {
//         ...node,
//         children: [],
//       };
//     }

//     visited.add(node.id);

//     return {
//       ...node,
//       children: node.children
//         .filter((child) => !visited.has(child.id))
//         .map(cleanTree),
//     };
//   };

//   return roots.map(cleanTree);
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   const [compact, setCompact] = useState(false);
//   const [showPhoto, setShowPhoto] = useState(false);

//   const [zoom, setZoom] = useState(1);
//   const [fitScale, setFitScale] = useState(1);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setSearch(searchInput.trim());
//     }, 350);

//     return () => window.clearTimeout(timer);
//   }, [searchInput]);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetOrganizationChartQuery({
//     search: search || undefined,
//   });

//   const employees = useMemo(
//     () => extractEmployees(data),
//     [data]
//   );

//   const tree = useMemo(
//     () => buildTree(employees),
//     [employees]
//   );

//   /* =======================================================
//      RESPONSIVE FIT TO AVAILABLE WIDTH
//   ======================================================= */

//   const calculateFit = useCallback(() => {
//     const container = containerRef.current;
//     const content = contentRef.current;

//     if (!container || !content) return;

//     // Measure the natural, unscaled content.
//     const previousTransform = content.style.transform;

//     content.style.transform = "none";

//     const contentWidth = content.scrollWidth;
//     const availableWidth = container.clientWidth - 32;

//     content.style.transform = previousTransform;

//     if (contentWidth > 0 && availableWidth > 0) {
//       const nextScale = Math.min(
//         1,
//         availableWidth / contentWidth
//       );

//       setFitScale(nextScale);
//     }
//   }, []);

//   useEffect(() => {
//     calculateFit();

//     const container = containerRef.current;

//     if (!container) return;

//     const observer = new ResizeObserver(() => {
//       calculateFit();
//     });

//     observer.observe(container);

//     if (contentRef.current) {
//       observer.observe(contentRef.current);
//     }

//     window.addEventListener("resize", calculateFit);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("resize", calculateFit);
//     };
//   }, [calculateFit, tree, compact, showPhoto]);

//   const handleZoomIn = () => {
//     setZoom((current) =>
//       Math.min(2, current + 0.1)
//     );
//   };

//   const handleZoomOut = () => {
//     setZoom((current) =>
//       Math.max(0.3, current - 0.1)
//     );
//   };

//   const handleFit = () => {
//     setZoom(1);
//     calculateFit();
//   };

//   const handleDownload = () => {
//     window.print();
//   };

//   const displayedScale = Math.min(
//     1,
//     fitScale * zoom
//   );

//   return (
//     <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-[#F4F8FE] to-[#EFF4FC]">

//       {/* ENROLLMENT TABS */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       {/* TOP TOOLBAR */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />

//           <input
//             value={searchInput}
//             onChange={(event) =>
//               setSearchInput(event.target.value)
//             }
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E4E7EC] bg-white pl-7 pr-2 text-[12px] text-[#1D2939] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleDownload}
//           title="Download chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#FED7AA] bg-white text-[#C2410C] transition-all hover:bg-[#FFF7ED] hover:shadow-sm active:scale-95"
//         >
//           <Download size={14} />
//         </button>

//         <button
//           type="button"
//           title="Settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] transition-all hover:border-[#D0D5DD] hover:bg-[#F9FAFB] active:scale-95"
//         >
//           <Settings size={14} />
//         </button>

//         <button
//           type="button"
//           title="History"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] transition-all hover:border-[#D0D5DD] hover:bg-[#F9FAFB] active:scale-95"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="px-3 pb-6 pt-3">

//         {/* HEADER */}
//         <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//           <div className="flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#C2410C]">
//               <Users size={17} />
//             </div>

//             <div>
//               <h2 className="text-[14px] font-semibold leading-tight text-[#1D2939]">
//                 Organization Chart
//               </h2>

//               <p className="text-[12px] leading-tight text-[#667085]">
//                 Total Strength:{" "}
//                 <span className="font-semibold text-[#C2410C]">
//                   {employees.length}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1.5 rounded-lg border border-[#DCE4EE] bg-white p-1 shadow-sm">
//             <button
//               type="button"
//               onClick={handleZoomOut}
//               title="Zoom out"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#F2F4F7] active:scale-95"
//             >
//               <ZoomOut size={14} />
//             </button>

//             <span className="min-w-[42px] text-center text-[11px] font-medium tabular-nums text-[#475467]">
//               {Math.round(displayedScale * 100)}%
//             </span>

//             <button
//               type="button"
//               onClick={handleZoomIn}
//               title="Zoom in"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#F2F4F7] active:scale-95"
//             >
//               <ZoomIn size={14} />
//             </button>

//             <div className="mx-0.5 h-4 w-px bg-[#E4E7EC]" />

//             <button
//               type="button"
//               onClick={handleFit}
//               title="Fit to screen"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#F2F4F7] active:scale-95"
//             >
//               <Maximize2 size={14} />
//             </button>
//           </div>
//         </div>

//         {/* VIEW CONTROLS */}
//         <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">

//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setShowPhoto((value) => !value)
//               }
//               aria-pressed={showPhoto}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 showPhoto
//                   ? "border-[#FB923C] bg-[#C2410C] text-white shadow-sm"
//                   : "border-[#FDBA74] bg-white text-[#9A3412] hover:bg-[#FFF1E4]"
//               }`}
//             >
//               {showPhoto ? "Photo View" : "Employee View"}
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setCompact((value) => !value)
//               }
//               aria-pressed={compact}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 compact
//                   ? "border-[#FB923C] bg-[#C2410C] text-white shadow-sm"
//                   : "border-[#FDBA74] bg-white text-[#9A3412] hover:bg-[#FFF1E4]"
//               }`}
//             >
//               {compact ? "Compact View" : "Standard View"}
//             </button>
//           </div>

//           {isFetching && !isLoading && (
//             <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#9A3412]">
//               <Loader2 size={12} className="animate-spin" />
//               Refreshing...
//             </span>
//           )}
//         </div>

//         {/* CHART */}
//         {isLoading ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-[#DCE4EE] bg-white text-[13px] text-[#98A2B3]">
//             <Loader2 size={22} className="animate-spin text-[#FB923C]" />
//             Loading organization chart...
//           </div>
//         ) : isError ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-[#FECDCA] bg-[#FFFBFA] text-[13px] text-[#D92D20]">
//             <AlertTriangle size={22} />
//             Failed to load organization chart.

//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="rounded-md bg-[#FFF7ED] px-3.5 py-1.5 font-medium text-[#C2410C] transition-colors hover:bg-[#FFE9D5] active:scale-95"
//             >
//               Retry
//             </button>
//           </div>
//         ) : tree.length === 0 ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCE4EE] bg-white text-[13px] text-[#98A2B3]">
//             <Users size={22} className="text-[#D0D5DD]" />
//             No organization data to show.
//           </div>
//         ) : (
//           <div
//             ref={containerRef}
//             className="relative min-h-[440px] w-full overflow-auto rounded-xl border border-[#DCE4EE] bg-white p-6 shadow-sm [scrollbar-width:thin]"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, #EEF2F6 1px, transparent 1px)",
//               backgroundSize: "18px 18px",
//             }}
//           >
//             <div
//               ref={contentRef}
//               className="mx-auto w-max min-w-full origin-top transition-transform duration-150 ease-out"
//               style={{
//                 transform: `scale(${displayedScale})`,
//                 transformOrigin: "top center",
//               }}
//             >
//               <div className="flex w-max min-w-full flex-col items-center gap-10">

//                 {tree.map((root) => (
//                   <OrgTreeNode
//                     key={root.id}
//                     node={root}
//                     compact={compact}
//                     showPhoto={showPhoto}
//                   />
//                 ))}

//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    TREE NODE
// ========================================================= */

// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [photoFailed, setPhotoFailed] = useState(false);

//   const hasChildren = node.children.length > 0;
//   const avatarColor = avatarColorFor(node.name || node.id);
//   const showRealPhoto = showPhoto && !!node.photo && !photoFailed;

//   return (
//     <div className="flex flex-col items-center">

//       {/* EMPLOYEE CARD */}
//       <div
//         className={`group relative z-10 flex items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#FDBA74] hover:shadow-md ${
//           compact
//             ? "min-h-[38px] w-[160px] px-2 py-1"
//             : "min-h-[48px] w-[196px] px-2.5 py-2"
//         }`}
//       >
//         {showRealPhoto ? (
//           <img
//             src={node.photo}
//             alt={node.name}
//             onError={() => setPhotoFailed(true)}
//             className={`shrink-0 rounded-md object-cover ring-1 ring-black/5 ${
//               compact ? "h-6 w-6" : "h-8 w-8"
//             }`}
//           />
//         ) : showPhoto && node.photo && photoFailed ? (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-md bg-[#F2F4F7] text-[#98A2B3] ${
//               compact ? "h-6 w-6" : "h-8 w-8"
//             }`}
//           >
//             <ImageOff size={compact ? 11 : 13} />
//           </div>
//         ) : (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-md font-semibold ring-1 ring-black/5 ${
//               compact
//                 ? "h-6 w-6 text-[9px]"
//                 : "h-8 w-8 text-[10px]"
//             }`}
//             style={{
//               backgroundColor: avatarColor.bg,
//               color: avatarColor.text,
//             }}
//           >
//             {initialsFor(node.name)}
//           </div>
//         )}

//         <div className="min-w-0 flex-1">
//           <p className="truncate text-[11px] font-semibold leading-4 text-[#1D2939]">
//             {node.name}
//           </p>

//           <p className="truncate text-[9px] leading-3 text-[#98A2B3]">
//             {node.designation || " "}
//           </p>
//         </div>
//       </div>

//       {/* CHILDREN TOGGLE */}
//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed((value) => !value)
//           }
//           className="relative z-10 mt-1.5 flex h-5 min-w-[32px] items-center justify-center gap-1 rounded-full border border-[#FDBA74] bg-white px-2 text-[10px] font-medium text-[#C2410C] shadow-sm transition-all hover:bg-[#FFF7ED] active:scale-95"
//           aria-label={
//             collapsed
//               ? "Expand employees"
//               : "Collapse employees"
//           }
//         >
//           <ChevronDown
//             size={11}
//             className={`transition-transform duration-150 ${
//               collapsed ? "-rotate-90" : ""
//             }`}
//           />

//           {node.children.length}
//         </button>
//       )}

//       {/* CHILDREN */}
//       {hasChildren && !collapsed && (
//         <>
//           <div className="h-5 w-px bg-[#FDBA74]/70" />

//           <div className="relative flex flex-wrap justify-center gap-x-5 gap-y-7 border-t border-[#FDBA74]/70 pt-5">

//             {node.children.map((child) => (
//               <div
//                 key={child.id}
//                 className="relative flex flex-col items-center"
//               >
//                 <div className="absolute -top-5 h-5 w-px bg-[#FDBA74]/70" />

//                 <OrgTreeNode
//                   node={child}
//                   compact={compact}
//                   showPhoto={showPhoto}
//                 />
//               </div>
//             ))}

//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default OrganizationChartPage;
















// import React, {
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";

// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
//   Users,
//   Loader2,
//   AlertTriangle,
//   ImageOff,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// import {
//   useGetOrganizationChartQuery,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface EmployeeRecord {
//   [key: string]: unknown;
// }

// interface Employee {
//   id: string;
//   name: string;
//   managerId: string;
//   managerName: string;
//   designation: string;
//   photo: string;
// }

// interface OrgNode {
//   id: string;
//   name: string;
//   designation: string;
//   photo: string;
//   children: OrgNode[];
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getValue = (
//   employee: EmployeeRecord,
//   ...keys: string[]
// ): string => {
//   for (const key of keys) {
//     const value = employee[key];

//     if (value !== null && value !== undefined) {
//       const text = String(value).trim();

//       if (text !== "") {
//         return text;
//       }
//     }
//   }

//   return "";
// };

// const normalizeEmployee = (
//   record: EmployeeRecord
// ): Employee => ({
//   id: getValue(
//     record,
//     "Employee ID",
//     "EmployeeID",
//     "EmployeeId",
//     "employeeId"
//   ),

//   name: getValue(
//     record,
//     "Employee Name",
//     "EmployeeName",
//     "EmployeeFullName",
//     "employeeName"
//   ),

//   managerId: getValue(
//     record,
//     "Manager ID",
//     "ManagerID",
//     "ManagerId",
//     "ReportingAuthorityID",
//     "ReportingAuthorityId",
//     "managerId"
//   ),

//   managerName: getValue(
//     record,
//     "Manager Name",
//     "ManagerName",
//     "managerName"
//   ),

//   designation: getValue(
//     record,
//     "Designation",
//     "Designation Name",
//     "DesignationName",
//     "designation"
//   ),

//   photo: getValue(
//     record,
//     "ProfilePhotoUrl",
//     "ProfilePhoto",
//     "PhotoUrl",
//     "photo"
//   ),
// });

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// /* Deterministic color pair for avatar fallback, based on name */
// const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
//   { bg: "#E0F2FE", text: "#0369A1" },
//   { bg: "#FEF3C7", text: "#B45309" },
//   { bg: "#DCFCE7", text: "#15803D" },
//   { bg: "#FCE7F3", text: "#BE185D" },
//   { bg: "#EDE9FE", text: "#6D28D9" },
//   { bg: "#FFE4E6", text: "#BE123C" },
// ];

// const avatarColorFor = (name: string) => {
//   let hash = 0;

//   for (let i = 0; i < name.length; i += 1) {
//     hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
//   }

//   return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
// };

// /* =========================================================
//    API RESPONSE EXTRACTION

//    Supports:
//    [...]
//    { data: [...] }
//    { Employees: [...] }
//    { data: { Employees: [...] } }
// ========================================================= */

// const extractEmployees = (
//   response: unknown
// ): EmployeeRecord[] => {
//   if (Array.isArray(response)) {
//     return response as EmployeeRecord[];
//   }

//   if (!response || typeof response !== "object") {
//     return [];
//   }

//   const result = response as Record<string, unknown>;

//   if (Array.isArray(result.Employees)) {
//     return result.Employees as EmployeeRecord[];
//   }

//   if (Array.isArray(result.data)) {
//     return result.data as EmployeeRecord[];
//   }

//   if (Array.isArray(result.Data)) {
//     return result.Data as EmployeeRecord[];
//   }

//   if (
//     result.data &&
//     typeof result.data === "object"
//   ) {
//     const nested = result.data as Record<string, unknown>;

//     if (Array.isArray(nested.Employees)) {
//       return nested.Employees as EmployeeRecord[];
//     }

//     if (Array.isArray(nested.data)) {
//       return nested.data as EmployeeRecord[];
//     }
//   }

//   return [];
// };

// /* =========================================================
//    BUILD ORGANIZATION TREE

//    No synthetic Organization card.
//    No synthetic Reporting Manager card.

//    Employees with missing manager records are displayed
//    as standalone roots using their actual employee data.
// ========================================================= */

// function buildTree(records: EmployeeRecord[]): OrgNode[] {
//   const employees = records
//     .map(normalizeEmployee)
//     .filter((employee) => employee.id && employee.name);

//   const employeeById = new Map<string, Employee>();

//   employees.forEach((employee) => {
//     employeeById.set(employee.id, employee);
//   });

//   const nodeById = new Map<string, OrgNode>();

//   employees.forEach((employee) => {
//     nodeById.set(employee.id, {
//       id: employee.id,
//       name: employee.name,
//       designation: employee.designation,
//       photo: employee.photo,
//       children: [],
//     });
//   });

//   const roots: OrgNode[] = [];
//   const attached = new Set<string>();

//   employees.forEach((employee) => {
//     const node = nodeById.get(employee.id)!;
//     const managerId = employee.managerId.trim();

//     // Actual root employee from the backend.
//     if (!managerId) {
//       roots.push(node);
//       attached.add(employee.id);
//       return;
//     }

//     // Attach only when the manager exists in API response.
//     const manager = employeeById.get(managerId);

//     if (manager && manager.id !== employee.id) {
//       const managerNode = nodeById.get(manager.id)!;

//       managerNode.children.push(node);
//       attached.add(employee.id);
//     }
//   });

//   // Promote employees whose manager is missing from
//   // the backend response to standalone actual employee roots.
//   employees.forEach((employee) => {
//     if (!attached.has(employee.id)) {
//       const node = nodeById.get(employee.id)!;

//       if (!roots.some((root) => root.id === node.id)) {
//         roots.push(node);
//       }

//       attached.add(employee.id);
//     }
//   });

//   // Prevent circular parent-child relationships from
//   // causing recursive rendering loops.
//   const visited = new Set<string>();

//   const cleanTree = (node: OrgNode): OrgNode => {
//     if (visited.has(node.id)) {
//       return {
//         ...node,
//         children: [],
//       };
//     }

//     visited.add(node.id);

//     return {
//       ...node,
//       children: node.children
//         .filter((child) => !visited.has(child.id))
//         .map(cleanTree),
//     };
//   };

//   return roots.map(cleanTree);
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   const [compact, setCompact] = useState(false);
//   const [showPhoto, setShowPhoto] = useState(false);

//   const [zoom, setZoom] = useState(1);
//   const [fitScale, setFitScale] = useState(1);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setSearch(searchInput.trim());
//     }, 350);

//     return () => window.clearTimeout(timer);
//   }, [searchInput]);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetOrganizationChartQuery({
//     search: search || undefined,
//   });

//   const employees = useMemo(
//     () => extractEmployees(data),
//     [data]
//   );

//   const tree = useMemo(
//     () => buildTree(employees),
//     [employees]
//   );

//   /* =======================================================
//      RESPONSIVE FIT TO AVAILABLE WIDTH
//   ======================================================= */

//   const calculateFit = useCallback(() => {
//     const container = containerRef.current;
//     const content = contentRef.current;

//     if (!container || !content) return;

//     // Measure the natural, unscaled content.
//     const previousTransform = content.style.transform;

//     content.style.transform = "none";

//     const contentWidth = content.scrollWidth;
//     const availableWidth = container.clientWidth - 32;

//     content.style.transform = previousTransform;

//     if (contentWidth > 0 && availableWidth > 0) {
//       const nextScale = Math.min(
//         1,
//         availableWidth / contentWidth
//       );

//       setFitScale(nextScale);
//     }
//   }, []);

//   useEffect(() => {
//     calculateFit();

//     const container = containerRef.current;

//     if (!container) return;

//     const observer = new ResizeObserver(() => {
//       calculateFit();
//     });

//     observer.observe(container);

//     if (contentRef.current) {
//       observer.observe(contentRef.current);
//     }

//     window.addEventListener("resize", calculateFit);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("resize", calculateFit);
//     };
//   }, [calculateFit, tree, compact, showPhoto]);

//   const handleZoomIn = () => {
//     setZoom((current) =>
//       Math.min(2, current + 0.1)
//     );
//   };

//   const handleZoomOut = () => {
//     setZoom((current) =>
//       Math.max(0.3, current - 0.1)
//     );
//   };

//   const handleFit = () => {
//     setZoom(1);
//     calculateFit();
//   };

//   const handleDownload = () => {
//     window.print();
//   };

//   const displayedScale = Math.min(
//     1,
//     fitScale * zoom
//   );

//   return (
//     <div className="min-h-[calc(100vh-80px)] w-full bg-gradient-to-b from-[#F4F8FE] to-[#EFF4FC]">

//       {/* ENROLLMENT TABS */}
//       <div className="px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       {/* TOP TOOLBAR */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />

//           <input
//             value={searchInput}
//             onChange={(event) =>
//               setSearchInput(event.target.value)
//             }
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E4E7EC] bg-white pl-7 pr-2 text-[12px] text-[#1D2939] outline-none transition-colors placeholder:text-[#98A2B3] focus:border-[#FB923C] focus:ring-2 focus:ring-[#FED7AA]"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleDownload}
//           title="Download chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#FED7AA] bg-white text-[#C2410C] transition-all hover:bg-[#FFF7ED] hover:shadow-sm active:scale-95"
//         >
//           <Download size={14} />
//         </button>

//         <button
//           type="button"
//           title="Settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] transition-all hover:border-[#D0D5DD] hover:bg-[#F9FAFB] active:scale-95"
//         >
//           <Settings size={14} />
//         </button>

//         <button
//           type="button"
//           title="History"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E4E7EC] bg-white text-[#667085] transition-all hover:border-[#D0D5DD] hover:bg-[#F9FAFB] active:scale-95"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="px-3 pb-6 pt-3">

//         {/* HEADER */}
//         <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
//           <div className="flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF7ED] text-[#C2410C]">
//               <Users size={17} />
//             </div>

//             <div>
//               <h2 className="text-[14px] font-semibold leading-tight text-[#1D2939]">
//                 Organization Chart
//               </h2>

//               <p className="text-[12px] leading-tight text-[#667085]">
//                 Total Strength:{" "}
//                 <span className="font-semibold text-[#C2410C]">
//                   {employees.length}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1.5 rounded-lg border border-[#DCE4EE] bg-white p-1 shadow-sm">
//             <button
//               type="button"
//               onClick={handleZoomOut}
//               title="Zoom out"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#F2F4F7] active:scale-95"
//             >
//               <ZoomOut size={14} />
//             </button>

//             <span className="min-w-[42px] text-center text-[11px] font-medium tabular-nums text-[#475467]">
//               {Math.round(displayedScale * 100)}%
//             </span>

//             <button
//               type="button"
//               onClick={handleZoomIn}
//               title="Zoom in"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#F2F4F7] active:scale-95"
//             >
//               <ZoomIn size={14} />
//             </button>

//             <div className="mx-0.5 h-4 w-px bg-[#E4E7EC]" />

//             <button
//               type="button"
//               onClick={handleFit}
//               title="Fit to screen"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#475467] transition-colors hover:bg-[#F2F4F7] active:scale-95"
//             >
//               <Maximize2 size={14} />
//             </button>
//           </div>
//         </div>

//         {/* VIEW CONTROLS */}
//         <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">

//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setShowPhoto((value) => !value)
//               }
//               aria-pressed={showPhoto}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 showPhoto
//                   ? "border-[#FB923C] bg-[#C2410C] text-white shadow-sm"
//                   : "border-[#FDBA74] bg-white text-[#9A3412] hover:bg-[#FFF1E4]"
//               }`}
//             >
//               {showPhoto ? "Photo View" : "Employee View"}
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setCompact((value) => !value)
//               }
//               aria-pressed={compact}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 compact
//                   ? "border-[#FB923C] bg-[#C2410C] text-white shadow-sm"
//                   : "border-[#FDBA74] bg-white text-[#9A3412] hover:bg-[#FFF1E4]"
//               }`}
//             >
//               {compact ? "Compact View" : "Standard View"}
//             </button>
//           </div>

//           {isFetching && !isLoading && (
//             <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#9A3412]">
//               <Loader2 size={12} className="animate-spin" />
//               Refreshing...
//             </span>
//           )}
//         </div>

//         {/* CHART */}
//         {isLoading ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-[#DCE4EE] bg-white text-[13px] text-[#98A2B3]">
//             <Loader2 size={22} className="animate-spin text-[#FB923C]" />
//             Loading organization chart...
//           </div>
//         ) : isError ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-xl border border-[#FECDCA] bg-[#FFFBFA] text-[13px] text-[#D92D20]">
//             <AlertTriangle size={22} />
//             Failed to load organization chart.

//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="rounded-md bg-[#FFF7ED] px-3.5 py-1.5 font-medium text-[#C2410C] transition-colors hover:bg-[#FFE9D5] active:scale-95"
//             >
//               Retry
//             </button>
//           </div>
//         ) : tree.length === 0 ? (
//           <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCE4EE] bg-white text-[13px] text-[#98A2B3]">
//             <Users size={22} className="text-[#D0D5DD]" />
//             No organization data to show.
//           </div>
//         ) : (
//           <div
//             ref={containerRef}
//             className="relative min-h-[440px] w-full overflow-auto rounded-xl border border-[#DCE4EE] bg-white p-6 shadow-sm [scrollbar-width:thin]"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, #EEF2F6 1px, transparent 1px)",
//               backgroundSize: "18px 18px",
//             }}
//           >
//             <div
//               ref={contentRef}
//               className="mx-auto w-max min-w-full origin-top transition-transform duration-150 ease-out"
//               style={{
//                 transform: `scale(${displayedScale})`,
//                 transformOrigin: "top center",
//               }}
//             >
//               <div className="flex w-max min-w-full flex-col items-center gap-10">

//                 {tree.map((root) => (
//                   <OrgTreeNode
//                     key={root.id}
//                     node={root}
//                     compact={compact}
//                     showPhoto={showPhoto}
//                   />
//                 ))}

//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// /* =========================================================
//    TREE NODE
// ========================================================= */

// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
// }> = ({ node, compact, showPhoto }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [photoFailed, setPhotoFailed] = useState(false);

//   const hasChildren = node.children.length > 0;
//   const avatarColor = avatarColorFor(node.name || node.id);
//   const showRealPhoto = showPhoto && !!node.photo && !photoFailed;

//   return (
//     <div className="flex flex-col items-center">

//       {/* EMPLOYEE CARD */}
//       <div
//         className={`group relative z-10 flex items-center gap-2 rounded-lg border border-[#E4E7EC] bg-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:border-[#FDBA74] hover:shadow-md ${
//           compact
//             ? "min-h-[38px] w-[160px] px-2 py-1"
//             : "min-h-[48px] w-[196px] px-2.5 py-2"
//         }`}
//       >
//         {showRealPhoto ? (
//           <img
//             src={node.photo}
//             alt={node.name}
//             onError={() => setPhotoFailed(true)}
//             className={`shrink-0 rounded-md object-cover ring-1 ring-black/5 ${
//               compact ? "h-6 w-6" : "h-8 w-8"
//             }`}
//           />
//         ) : showPhoto && node.photo && photoFailed ? (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-md bg-[#F2F4F7] text-[#98A2B3] ${
//               compact ? "h-6 w-6" : "h-8 w-8"
//             }`}
//           >
//             <ImageOff size={compact ? 11 : 13} />
//           </div>
//         ) : (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-md font-semibold ring-1 ring-black/5 ${
//               compact
//                 ? "h-6 w-6 text-[9px]"
//                 : "h-8 w-8 text-[10px]"
//             }`}
//             style={{
//               backgroundColor: avatarColor.bg,
//               color: avatarColor.text,
//             }}
//           >
//             {initialsFor(node.name)}
//           </div>
//         )}

//         <div className="min-w-0 flex-1">
//           <p className="truncate text-[11px] font-semibold leading-4 text-[#1D2939]">
//             {node.name}
//           </p>

//           <p className="truncate text-[9px] leading-3 text-[#98A2B3]">
//             {node.designation || " "}
//           </p>
//         </div>
//       </div>

//       {/* CHILDREN TOGGLE */}
//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed((value) => !value)
//           }
//           className="relative z-10 mt-1.5 flex h-5 min-w-[32px] items-center justify-center gap-1 rounded-full border border-[#FDBA74] bg-white px-2 text-[10px] font-medium text-[#C2410C] shadow-sm transition-all hover:bg-[#FFF7ED] active:scale-95"
//           aria-label={
//             collapsed
//               ? "Expand employees"
//               : "Collapse employees"
//           }
//         >
//           <ChevronDown
//             size={11}
//             className={`transition-transform duration-150 ${
//               collapsed ? "-rotate-90" : ""
//             }`}
//           />

//           {node.children.length}
//         </button>
//       )}

//       {/* CHILDREN */}
//       {hasChildren && !collapsed && (
//         <>
//           <div className="h-5 w-px bg-[#FDBA74]/70" />

//           <div className="relative flex flex-wrap justify-center gap-x-5 gap-y-7 border-t border-[#FDBA74]/70 pt-5">

//             {node.children.map((child) => (
//               <div
//                 key={child.id}
//                 className="relative flex flex-col items-center"
//               >
//                 <div className="absolute -top-5 h-5 w-px bg-[#FDBA74]/70" />

//                 <OrgTreeNode
//                   node={child}
//                   compact={compact}
//                   showPhoto={showPhoto}
//                 />
//               </div>
//             ))}

//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default OrganizationChartPage;


















import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";

import {
  ChevronDown,
  Download,
  Search,
  Settings,
  History,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Users,
  Loader2,
  AlertTriangle,
  ImageOff,
} from "lucide-react";

import EnrollmentTabs from "../components/EnrollmentTabs";
import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

import {
  useGetOrganizationChartQuery,
} from "../api/employeedetailsApi";

/* =========================================================
   TYPES
========================================================= */

interface EmployeeRecord {
  [key: string]: unknown;
}

interface Employee {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  designation: string;
  photo: string;
}

interface OrgNode {
  id: string;
  name: string;
  designation: string;
  photo: string;
  children: OrgNode[];
}

/* =========================================================
   HELPERS
========================================================= */

const getValue = (
  employee: EmployeeRecord,
  ...keys: string[]
): string => {
  for (const key of keys) {
    const value = employee[key];

    if (value !== null && value !== undefined) {
      const text = String(value).trim();

      if (text !== "") {
        return text;
      }
    }
  }

  return "";
};

const normalizeEmployee = (
  record: EmployeeRecord
): Employee => ({
  id: getValue(
    record,
    "Employee ID",
    "EmployeeID",
    "EmployeeId",
    "employeeId"
  ),

  name: getValue(
    record,
    "Employee Name",
    "EmployeeName",
    "EmployeeFullName",
    "employeeName"
  ),

  managerId: getValue(
    record,
    "Manager ID",
    "ManagerID",
    "ManagerId",
    "ReportingAuthorityID",
    "ReportingAuthorityId",
    "managerId"
  ),

  managerName: getValue(
    record,
    "Manager Name",
    "ManagerName",
    "managerName"
  ),

  designation: getValue(
    record,
    "Designation",
    "Designation Name",
    "DesignationName",
    "designation"
  ),

  photo: getValue(
    record,
    "ProfilePhotoUrl",
    "ProfilePhoto",
    "PhotoUrl",
    "photo"
  ),
});

const initialsFor = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "?";

/* Deterministic soft-orange-family color pair for the avatar fallback */
const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
  { bg: "#FFEDD5", text: "#C2410C" },
  { bg: "#FEF3C7", text: "#B45309" },
  { bg: "#FFE4E6", text: "#BE123C" },
  { bg: "#FFF7ED", text: "#9A3412" },
  { bg: "#FED7AA", text: "#7C2D12" },
  { bg: "#FFEEDD", text: "#C2660C" },
];

const avatarColorFor = (name: string) => {
  let hash = 0;

  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }

  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
};

/* =========================================================
   API RESPONSE EXTRACTION

   Supports:
   [...]
   { data: [...] }
   { Employees: [...] }
   { data: { Employees: [...] } }
========================================================= */

const extractEmployees = (
  response: unknown
): EmployeeRecord[] => {
  if (Array.isArray(response)) {
    return response as EmployeeRecord[];
  }

  if (!response || typeof response !== "object") {
    return [];
  }

  const result = response as Record<string, unknown>;

  if (Array.isArray(result.Employees)) {
    return result.Employees as EmployeeRecord[];
  }

  if (Array.isArray(result.data)) {
    return result.data as EmployeeRecord[];
  }

  if (Array.isArray(result.Data)) {
    return result.Data as EmployeeRecord[];
  }

  if (
    result.data &&
    typeof result.data === "object"
  ) {
    const nested = result.data as Record<string, unknown>;

    if (Array.isArray(nested.Employees)) {
      return nested.Employees as EmployeeRecord[];
    }

    if (Array.isArray(nested.data)) {
      return nested.data as EmployeeRecord[];
    }
  }

  return [];
};

/* =========================================================
   BUILD ORGANIZATION TREE

   No synthetic Organization card.
   No synthetic Reporting Manager card.

   Employees with missing manager records are displayed
   as standalone roots using their actual employee data.
========================================================= */

function buildTree(records: EmployeeRecord[]): OrgNode[] {
  const employees = records
    .map(normalizeEmployee)
    .filter((employee) => employee.id && employee.name);

  const employeeById = new Map<string, Employee>();

  employees.forEach((employee) => {
    employeeById.set(employee.id, employee);
  });

  const nodeById = new Map<string, OrgNode>();

  employees.forEach((employee) => {
    nodeById.set(employee.id, {
      id: employee.id,
      name: employee.name,
      designation: employee.designation,
      photo: employee.photo,
      children: [],
    });
  });

  const roots: OrgNode[] = [];
  const attached = new Set<string>();

  employees.forEach((employee) => {
    const node = nodeById.get(employee.id)!;
    const managerId = employee.managerId.trim();

    // Actual root employee from the backend.
    if (!managerId) {
      roots.push(node);
      attached.add(employee.id);
      return;
    }

    // Attach only when the manager exists in API response.
    const manager = employeeById.get(managerId);

    if (manager && manager.id !== employee.id) {
      const managerNode = nodeById.get(manager.id)!;

      managerNode.children.push(node);
      attached.add(employee.id);
    }
  });

  // Promote employees whose manager is missing from
  // the backend response to standalone actual employee roots.
  employees.forEach((employee) => {
    if (!attached.has(employee.id)) {
      const node = nodeById.get(employee.id)!;

      if (!roots.some((root) => root.id === node.id)) {
        roots.push(node);
      }

      attached.add(employee.id);
    }
  });

  // Prevent circular parent-child relationships from
  // causing recursive rendering loops.
  const visited = new Set<string>();

  const cleanTree = (node: OrgNode): OrgNode => {
    if (visited.has(node.id)) {
      return {
        ...node,
        children: [],
      };
    }

    visited.add(node.id);

    return {
      ...node,
      children: node.children
        .filter((child) => !visited.has(child.id))
        .map(cleanTree),
    };
  };

  return roots.map(cleanTree);
}

/* =========================================================
   ZOOM SETTINGS
========================================================= */

const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

/* Card sizing — the connector lines are measured from real DOM
   positions (see useConnectorPaths below), so a wide subtree on
   one branch can never overlap its neighbors. */
const CARD_SIZE = {
  standard: { width: 286, gapX: 44, connectorHeight: 48 },
  compact: { width: 220, gapX: 30, connectorHeight: 38 },
};

/* =========================================================
   CONNECTOR MEASUREMENT HOOK

   Measures the real rendered position of the children row and
  each child card, so the SVG connectors always line up
   exactly — even when one branch is much wider than another.
========================================================= */

function useConnectorPaths(
  childCount: number,
  connectorHeight: number,
  active: boolean
) {
  const rowRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [state, setState] = useState<{ width: number; paths: string[] }>({
    width: 0,
    paths: [],
  });

  childRefs.current = [];

  const registerChild = useCallback(
    (index: number) => (element: HTMLDivElement | null) => {
      childRefs.current[index] = element;
    },
    []
  );

  useLayoutEffect(() => {
    if (!active || childCount === 0) return;

    const row = rowRef.current;

    if (!row) return;

    const measure = () => {
      const rowRect = row.getBoundingClientRect();
      const width = rowRect.width;
      const parentX = width / 2;

      const paths = childRefs.current.map((element) => {
        if (!element) return "";

        const rect = element.getBoundingClientRect();
        const childX = rect.left - rowRect.left + rect.width / 2;

        if (childCount === 1) {
          return `M ${parentX} 0 V ${connectorHeight}`;
        }

        const branchY = Math.round(connectorHeight / 2);

        return `M ${parentX} 0 V ${branchY} H ${childX} V ${connectorHeight}`;
      });

      setState({ width, paths });
    };

    measure();

    const observer = new ResizeObserver(measure);

    observer.observe(row);
    childRefs.current.forEach((element) => {
      if (element) observer.observe(element);
    });

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [active, childCount, connectorHeight]);

  return { rowRef, registerChild, ...state };
}

/* =========================================================
   PAGE
========================================================= */

const OrganizationChartPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [compact, setCompact] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);

  const [zoom, setZoom] = useState(1);

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetOrganizationChartQuery({
    search: search || undefined,
  });

  const employees = useMemo(
    () => extractEmployees(data),
    [data]
  );

  const tree = useMemo(
    () => buildTree(employees),
    [employees]
  );

  /* =======================================================
     ZOOM CONTROLS
  ======================================================= */

  const handleZoomIn = () => {
    setZoom((current) =>
      Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2)))
    );
  };

  const handleZoomOut = () => {
    setZoom((current) =>
      Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2)))
    );
  };

  // "Fit to screen" measures the natural width of the tree and
  // scales it down (never up) so the whole chart is visible at once.
  const handleFit = useCallback(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return;

    const previousTransform = content.style.transform;

    content.style.transform = "none";

    const contentWidth = content.scrollWidth;
    const availableWidth = container.clientWidth - 48;

    content.style.transform = previousTransform;

    if (contentWidth > 0 && availableWidth > 0) {
      const nextScale = Math.min(
        1,
        Math.max(MIN_ZOOM, availableWidth / contentWidth)
      );

      setZoom(Number(nextScale.toFixed(2)));
    }
  }, []);

  const handleResetZoom = () => setZoom(1);

  const handleDownload = () => {
    window.print();
  };

  return (
    <div
      className="flex h-[calc(100vh-80px)] w-full flex-col bg-[#F7F7F7]"
      style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
    >

      {/* ENROLLMENT TABS */}
      <div className="shrink-0 px-3 pt-2">
        <EnrollmentTabs />
      </div>

      {/* TOP TOOLBAR */}
      <EnrollmentToolbarPortal>
        <div className="relative">
          <Search
            size={13}
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
          />

          <input
            value={searchInput}
            onChange={(event) =>
              setSearchInput(event.target.value)
            }
            placeholder="Search name / designation"
            className="h-[30px] w-[190px] rounded-[6px] border border-[#E2E2E2] bg-white pl-7 pr-2 text-[12px] text-[#131313] outline-none transition-colors placeholder:text-[#626262] focus:border-[#FF6200] focus:ring-2 focus:ring-[#FFF5EE]"
          />
        </div>

        <button
          type="button"
          onClick={handleDownload}
          title="Download chart"
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#FF6200] transition-all hover:bg-[#FFF5EE] hover:shadow-sm active:scale-95"
        >
          <Download size={14} />
        </button>

        <button
          type="button"
          title="Settings"
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#626262] transition-all hover:border-[#BFBFBF] hover:bg-[#F5F5F5] active:scale-95"
        >
          <Settings size={14} />
        </button>

        <button
          type="button"
          title="History"
          className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#626262] transition-all hover:border-[#BFBFBF] hover:bg-[#F5F5F5] active:scale-95"
        >
          <History size={14} />
        </button>
      </EnrollmentToolbarPortal>

      <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3">

        {/* HEADER */}
        <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EE] text-[#FF6200]">
              <Users size={17} />
            </div>

            <div>
              <h2 className="text-[15px] font-semibold leading-tight text-[#131313]">
                Organization Chart
              </h2>

              <p className="text-[12px] leading-tight text-[#626262]">
                Total Strength:{" "}
                  <span className="font-semibold text-[#FF6200]">
                  {employees.length}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 rounded-lg border border-[#E2E2E2] bg-white p-1 shadow-sm">
            <button
              type="button"
              onClick={handleZoomOut}
              title="Zoom out"
              disabled={zoom <= MIN_ZOOM}
              className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#FF6200] transition-colors hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomOut size={14} />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              title="Reset zoom to 100%"
              className="min-w-[42px] text-center text-[11px] font-medium tabular-nums text-[#FF6200] hover:text-[#131313]"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              type="button"
              onClick={handleZoomIn}
              title="Zoom in"
              disabled={zoom >= MAX_ZOOM}
              className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#FF6200] transition-colors hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <ZoomIn size={14} />
            </button>

            <div className="mx-0.5 h-4 w-px bg-[#E4E7EC]" />

            <button
              type="button"
              onClick={handleFit}
              title="Fit to screen"
              className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#626262] transition-colors hover:bg-[#FFF5EE] hover:text-[#FF6200] active:scale-95"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* VIEW CONTROLS */}
        <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E2E2E2] bg-[#FFF5EE] px-3 py-2">

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                setShowPhoto((value) => !value)
              }
              aria-pressed={showPhoto}
              className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                showPhoto
                  ? "border-[#FF6200] bg-[#FF6200] text-white shadow-sm"
                  : "border-[#E2E2E2] bg-white text-[#626262] hover:bg-[#FFF5EE]"
              }`}
            >
              {showPhoto ? "Photo View" : "Employee View"}
            </button>

            <button
              type="button"
              onClick={() =>
                setCompact((value) => !value)
              }
              aria-pressed={compact}
              className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
                compact
                  ? "border-[#FF6200] bg-[#FF6200] text-white shadow-sm"
                  : "border-[#E2E2E2] bg-white text-[#626262] hover:bg-[#FFF5EE]"
              }`}
            >
              {compact ? "Compact View" : "Standard View"}
            </button>
          </div>

          {isFetching && !isLoading && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#FF6200]">
              <Loader2 size={12} className="animate-spin" />
              Refreshing...
            </span>
          )}
        </div>

        {/* CHART */}
        {isLoading ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#E2E2E2] bg-white text-[13px] text-[#626262]">
            <Loader2 size={22} className="animate-spin text-[#FF6200]" />
            Loading organization chart...
          </div>
        ) : isError ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#FECDCA] bg-[#FFFBFA] text-[13px] text-[#D92D20]">
            <AlertTriangle size={22} />
            Failed to load organization chart.

            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-md bg-[#FFF5EE] px-3.5 py-1.5 font-medium text-[#FF6200] transition-colors hover:bg-[#FFE5D6] active:scale-95"
            >
              Retry
            </button>
          </div>
        ) : tree.length === 0 ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E2E2E2] bg-white text-[13px] text-[#626262]">
            <Users size={22} className="text-[#BFBFBF]" />
            No organization data to show.
          </div>
        ) : (
          <div
            ref={containerRef}
              className="occ-scroll relative min-h-0 flex-1 overflow-auto rounded-xl border border-[#E2E2E2] bg-[#F5F5F5] p-10 shadow-[inset_0_1px_3px_rgba(19,19,19,0.04)]"
          >
            <div
              ref={contentRef}
              className="inline-block origin-top-left transition-transform duration-150 ease-out"
              style={{ transform: `scale(${zoom})` }}
            >
              <div className="flex w-max items-start gap-14">
                {tree.map((root) => (
                  <OrgTreeNode
                    key={root.id}
                    node={root}
                    compact={compact}
                    showPhoto={showPhoto}
                    depth={0}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Keep chart panning available while hiding scrollbar chrome. */}
      <style>{`
        .occ-scroll::-webkit-scrollbar {
          display: none;
        }
        .occ-scroll {
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

/* =========================================================
   TREE NODE
========================================================= */

const OrgTreeNode: React.FC<{
  node: OrgNode;
  compact: boolean;
  showPhoto: boolean;
  depth: number;
}> = ({ node, compact, showPhoto, depth }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [photoFailed, setPhotoFailed] = useState(false);

  const hasChildren = node.children.length > 0;
  const avatarColor = avatarColorFor(node.name || node.id);
  const showRealPhoto = showPhoto && !!node.photo && !photoFailed;

  // Slightly deeper orange accent for higher levels of the tree.
  const accentColor = "#FF6200";

  const size = compact ? CARD_SIZE.compact : CARD_SIZE.standard;

  const { rowRef, registerChild, width, paths } = useConnectorPaths(
    node.children.length,
    size.connectorHeight,
    hasChildren && !collapsed
  );

  return (
    <div className="flex flex-col items-center">

      {/* EMPLOYEE CARD */}
      <div
        className={`group relative z-10 flex items-center justify-center gap-3 overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_2px_8px_rgba(19,19,19,0.08)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#FF6200] hover:shadow-[0_8px_20px_rgba(255,98,0,0.14)] ${
            compact
              ? "min-h-[48px] py-2 pl-3.5 pr-3"
              : "min-h-[72px] py-3 pl-4 pr-3.5"
        }`}
        style={{
          borderLeft: `4px solid ${accentColor}`,
          width: size.width,
        }}
      >
        {showRealPhoto ? (
          <img
            src={node.photo}
            alt={node.name}
            onError={() => setPhotoFailed(true)}
            className={`shrink-0 rounded-lg object-cover ring-1 ring-black/5 ${
              !showPhoto ? "hidden" : ""
            } ${
              compact ? "h-7 w-7" : "h-9 w-9"
            }`}
          />
        ) : showPhoto && node.photo && photoFailed ? (
          <div
            className={`flex shrink-0 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#98A2B3] ${
              !showPhoto ? "hidden" : ""
            } ${
              compact ? "h-7 w-7" : "h-9 w-9"
            }`}
          >
            <ImageOff size={compact ? 12 : 14} />
          </div>
        ) : (
          <div
            className={`flex shrink-0 items-center justify-center rounded-lg font-semibold ring-1 ring-black/5 ${
              !showPhoto ? "hidden" : ""
            } ${
              compact ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[12px]"
            }`}
            style={{
              backgroundColor: avatarColor.bg,
              color: avatarColor.text,
            }}
          >
            {initialsFor(node.name)}
          </div>
        )}

        <div className={`min-w-0 ${showPhoto ? "flex-1 text-left" : "text-center"}`}>
          <p
            className={`truncate font-semibold leading-4 text-[#131313] ${
              compact ? "text-[11px]" : "text-[13px]"
            }`}
            title={node.name}
          >
            {node.name}
          </p>

          <p
            className={`truncate font-semibold uppercase leading-4 tracking-wide ${
              compact ? "text-[8.5px]" : "text-[9.5px]"
            }`}
            style={{ color: accentColor }}
            title={node.designation}
          >
            {node.designation || "\u00A0"}
          </p>
        </div>
      </div>

      {/* CHILDREN TOGGLE */}
      {hasChildren && (
        <button
          type="button"
          onClick={() =>
            setCollapsed((value) => !value)
          }
          className="relative z-10 -mt-2.5 flex h-6 min-w-[38px] items-center justify-center gap-1 rounded-[5px] border border-[#E2E2E2] bg-white px-2 text-[10.5px] font-semibold text-[#FF6200] shadow-[0_1px_3px_rgba(19,19,19,0.12)] transition-all hover:border-[#FF6200] hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95"
          aria-expanded={!collapsed}
          aria-label={
            collapsed
              ? "Expand employees"
              : "Collapse employees"
          }
        >
          <ChevronDown
            size={12}
            className={`transition-transform duration-300 ease-in-out ${
              collapsed ? "-rotate-90" : ""
            }`}
          />

          {node.children.length}
        </button>
      )}

      {/* CHILDREN — each child keeps its natural width (so a branch
          with many grandchildren of its own can grow freely without
          overlapping its neighbors), and the SVG connector is drawn
          from real measured positions rather than assumed widths. */}
      {hasChildren && (
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`flex flex-col items-center transition-opacity duration-200 ${
                collapsed ? "opacity-0" : "opacity-100 delay-100"
              }`}
            >
              <svg
                width={width || undefined}
                height={size.connectorHeight}
                className="block shrink-0"
                style={{ width: width || "100%" }}
              >
                {paths.map((d, index) =>
                  d ? (
                    <path
                      key={index}
                      d={d}
                      stroke="#E2E2E2"
                      strokeOpacity={1}
                      strokeWidth={2}
                      fill="none"
                      strokeLinecap="round"
                    />
                  ) : null
                )}
              </svg>

              <div
                ref={rowRef}
                className="flex items-start"
                style={{ gap: size.gapX }}
              >
                {node.children.map((child, index) => (
                  <div
                    key={child.id}
                    ref={registerChild(index)}
                    className="flex flex-col items-center"
                  >
                    <OrgTreeNode
                      node={child}
                      compact={compact}
                      showPhoto={showPhoto}
                      depth={depth + 1}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationChartPage;



















// import React, {
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";

// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
//   Users,
//   Loader2,
//   AlertTriangle,
//   ImageOff,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// import {
//   useGetOrganizationChartQuery,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface EmployeeRecord {
//   [key: string]: unknown;
// }

// interface Employee {
//   id: string;
//   name: string;
//   managerId: string;
//   managerName: string;
//   designation: string;
//   photo: string;
// }

// interface OrgNode {
//   id: string;
//   name: string;
//   designation: string;
//   photo: string;
//   children: OrgNode[];
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getValue = (
//   employee: EmployeeRecord,
//   ...keys: string[]
// ): string => {
//   for (const key of keys) {
//     const value = employee[key];

//     if (value !== null && value !== undefined) {
//       const text = String(value).trim();

//       if (text !== "") {
//         return text;
//       }
//     }
//   }

//   return "";
// };

// const normalizeEmployee = (
//   record: EmployeeRecord
// ): Employee => ({
//   id: getValue(
//     record,
//     "Employee ID",
//     "EmployeeID",
//     "EmployeeId",
//     "employeeId"
//   ),

//   name: getValue(
//     record,
//     "Employee Name",
//     "EmployeeName",
//     "EmployeeFullName",
//     "employeeName"
//   ),

//   managerId: getValue(
//     record,
//     "Manager ID",
//     "ManagerID",
//     "ManagerId",
//     "ReportingAuthorityID",
//     "ReportingAuthorityId",
//     "managerId"
//   ),

//   managerName: getValue(
//     record,
//     "Manager Name",
//     "ManagerName",
//     "managerName"
//   ),

//   designation: getValue(
//     record,
//     "Designation",
//     "Designation Name",
//     "DesignationName",
//     "designation"
//   ),

//   photo: getValue(
//     record,
//     "ProfilePhotoUrl",
//     "ProfilePhoto",
//     "PhotoUrl",
//     "photo"
//   ),
// });

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// /* Deterministic soft-orange-family color pair for the avatar fallback */
// const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
//   { bg: "#FFEDD5", text: "#C2410C" },
//   { bg: "#FEF3C7", text: "#B45309" },
//   { bg: "#FFE4E6", text: "#BE123C" },
//   { bg: "#FFF7ED", text: "#9A3412" },
//   { bg: "#FED7AA", text: "#7C2D12" },
//   { bg: "#FFEEDD", text: "#C2660C" },
// ];

// const avatarColorFor = (name: string) => {
//   let hash = 0;

//   for (let i = 0; i < name.length; i += 1) {
//     hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
//   }

//   return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
// };

// /* =========================================================
//    API RESPONSE EXTRACTION

//    Supports:
//    [...]
//    { data: [...] }
//    { Employees: [...] }
//    { data: { Employees: [...] } }
// ========================================================= */

// const extractEmployees = (
//   response: unknown
// ): EmployeeRecord[] => {
//   if (Array.isArray(response)) {
//     return response as EmployeeRecord[];
//   }

//   if (!response || typeof response !== "object") {
//     return [];
//   }

//   const result = response as Record<string, unknown>;

//   if (Array.isArray(result.Employees)) {
//     return result.Employees as EmployeeRecord[];
//   }

//   if (Array.isArray(result.data)) {
//     return result.data as EmployeeRecord[];
//   }

//   if (Array.isArray(result.Data)) {
//     return result.Data as EmployeeRecord[];
//   }

//   if (
//     result.data &&
//     typeof result.data === "object"
//   ) {
//     const nested = result.data as Record<string, unknown>;

//     if (Array.isArray(nested.Employees)) {
//       return nested.Employees as EmployeeRecord[];
//     }

//     if (Array.isArray(nested.data)) {
//       return nested.data as EmployeeRecord[];
//     }
//   }

//   return [];
// };

// /* =========================================================
//    BUILD ORGANIZATION TREE

//    No synthetic Organization card.
//    No synthetic Reporting Manager card.

//    Employees with missing manager records are displayed
//    as standalone roots using their actual employee data.
// ========================================================= */

// function buildTree(records: EmployeeRecord[]): OrgNode[] {
//   const employees = records
//     .map(normalizeEmployee)
//     .filter((employee) => employee.id && employee.name);

//   const employeeById = new Map<string, Employee>();

//   employees.forEach((employee) => {
//     employeeById.set(employee.id, employee);
//   });

//   const nodeById = new Map<string, OrgNode>();

//   employees.forEach((employee) => {
//     nodeById.set(employee.id, {
//       id: employee.id,
//       name: employee.name,
//       designation: employee.designation,
//       photo: employee.photo,
//       children: [],
//     });
//   });

//   const roots: OrgNode[] = [];
//   const attached = new Set<string>();

//   employees.forEach((employee) => {
//     const node = nodeById.get(employee.id)!;
//     const managerId = employee.managerId.trim();

//     // Actual root employee from the backend.
//     if (!managerId) {
//       roots.push(node);
//       attached.add(employee.id);
//       return;
//     }

//     // Attach only when the manager exists in API response.
//     const manager = employeeById.get(managerId);

//     if (manager && manager.id !== employee.id) {
//       const managerNode = nodeById.get(manager.id)!;

//       managerNode.children.push(node);
//       attached.add(employee.id);
//     }
//   });

//   // Promote employees whose manager is missing from
//   // the backend response to standalone actual employee roots.
//   employees.forEach((employee) => {
//     if (!attached.has(employee.id)) {
//       const node = nodeById.get(employee.id)!;

//       if (!roots.some((root) => root.id === node.id)) {
//         roots.push(node);
//       }

//       attached.add(employee.id);
//     }
//   });

//   // Prevent circular parent-child relationships from
//   // causing recursive rendering loops.
//   const visited = new Set<string>();

//   const cleanTree = (node: OrgNode): OrgNode => {
//     if (visited.has(node.id)) {
//       return {
//         ...node,
//         children: [],
//       };
//     }

//     visited.add(node.id);

//     return {
//       ...node,
//       children: node.children
//         .filter((child) => !visited.has(child.id))
//         .map(cleanTree),
//     };
//   };

//   return roots.map(cleanTree);
// }

// /* =========================================================
//    ZOOM SETTINGS
// ========================================================= */

// const MIN_ZOOM = 0.3;
// const MAX_ZOOM = 2;
// const ZOOM_STEP = 0.1;

// /* Card sizing — the connector lines are measured from real DOM
//    positions (see useConnectorPaths below), so a wide subtree on
//    one branch can never overlap its neighbors. */
// const CARD_SIZE = {
//   standard: { width: 286, gapX: 44, connectorHeight: 48 },
//   compact: { width: 220, gapX: 30, connectorHeight: 38 },
// };

// /* =========================================================
//    CONNECTOR MEASUREMENT HOOK

//    Measures the real rendered position of the children row and
//   each child card, so the SVG connectors always line up
//    exactly — even when one branch is much wider than another.
// ========================================================= */

// function useConnectorPaths(
//   childCount: number,
//   connectorHeight: number,
//   active: boolean
// ) {
//   const rowRef = useRef<HTMLDivElement>(null);
//   const childRefs = useRef<Array<HTMLDivElement | null>>([]);
//   const [state, setState] = useState<{ width: number; paths: string[] }>({
//     width: 0,
//     paths: [],
//   });

//   childRefs.current = [];

//   const registerChild = useCallback(
//     (index: number) => (element: HTMLDivElement | null) => {
//       childRefs.current[index] = element;
//     },
//     []
//   );

//   useLayoutEffect(() => {
//     if (!active || childCount === 0) return;

//     const row = rowRef.current;

//     if (!row) return;

//     const measure = () => {
//       const rowRect = row.getBoundingClientRect();
//       const width = rowRect.width;
//       const parentX = width / 2;

//       const paths = childRefs.current.map((element) => {
//         if (!element) return "";

//         const rect = element.getBoundingClientRect();
//         const childX = rect.left - rowRect.left + rect.width / 2;

//         if (childCount === 1) {
//           return `M ${parentX} 0 V ${connectorHeight}`;
//         }

//         const branchY = Math.round(connectorHeight / 2);

//         return `M ${parentX} 0 V ${branchY} H ${childX} V ${connectorHeight}`;
//       });

//       setState({ width, paths });
//     };

//     measure();

//     const observer = new ResizeObserver(measure);

//     observer.observe(row);
//     childRefs.current.forEach((element) => {
//       if (element) observer.observe(element);
//     });

//     window.addEventListener("resize", measure);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("resize", measure);
//     };
//   }, [active, childCount, connectorHeight]);

//   return { rowRef, registerChild, ...state };
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   const [compact, setCompact] = useState(false);
//   const [showPhoto, setShowPhoto] = useState(false);

//   const [zoom, setZoom] = useState(1);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setSearch(searchInput.trim());
//     }, 350);

//     return () => window.clearTimeout(timer);
//   }, [searchInput]);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetOrganizationChartQuery({
//     search: search || undefined,
//   });

//   const employees = useMemo(
//     () => extractEmployees(data),
//     [data]
//   );

//   const tree = useMemo(
//     () => buildTree(employees),
//     [employees]
//   );

//   /* =======================================================
//      ZOOM CONTROLS
//   ======================================================= */

//   const handleZoomIn = () => {
//     setZoom((current) =>
//       Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2)))
//     );
//   };

//   const handleZoomOut = () => {
//     setZoom((current) =>
//       Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2)))
//     );
//   };

//   // "Fit to screen" measures the natural width of the tree and
//   // scales it down (never up) so the whole chart is visible at once.
//   const handleFit = useCallback(() => {
//     const container = containerRef.current;
//     const content = contentRef.current;

//     if (!container || !content) return;

//     const previousTransform = content.style.transform;

//     content.style.transform = "none";

//     const contentWidth = content.scrollWidth;
//     const availableWidth = container.clientWidth - 48;

//     content.style.transform = previousTransform;

//     if (contentWidth > 0 && availableWidth > 0) {
//       const nextScale = Math.min(
//         1,
//         Math.max(MIN_ZOOM, availableWidth / contentWidth)
//       );

//       setZoom(Number(nextScale.toFixed(2)));
//     }
//   }, []);

//   const handleResetZoom = () => setZoom(1);

//   const handleDownload = () => {
//     window.print();
//   };

//   /* Fit chart to screen once when data is ready —
//      top hierarchy only (sub-branches collapsed), no scrollbar needed */
//   useEffect(() => {
//     if (isLoading || isError || tree.length === 0) return;

//     const timer = window.setTimeout(() => {
//       handleFit();
//     }, 100);

//     return () => window.clearTimeout(timer);
//   }, [isLoading, isError, tree.length, handleFit]);

//   return (
//     <div
//       className="flex h-[calc(100vh-80px)] w-full flex-col bg-[#F7F7F7]"
//       style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
//     >

//       {/* ENROLLMENT TABS */}
//       <div className="shrink-0 px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       {/* TOP TOOLBAR */}
//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />

//           <input
//             value={searchInput}
//             onChange={(event) =>
//               setSearchInput(event.target.value)
//             }
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E2E2E2] bg-white pl-7 pr-2 text-[12px] text-[#131313] outline-none transition-colors placeholder:text-[#626262] focus:border-[#FF6200] focus:ring-2 focus:ring-[#FFF5EE]"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleDownload}
//           title="Download chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#FF6200] transition-all hover:bg-[#FFF5EE] hover:shadow-sm active:scale-95"
//         >
//           <Download size={14} />
//         </button>

//         <button
//           type="button"
//           title="Settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#626262] transition-all hover:border-[#BFBFBF] hover:bg-[#F5F5F5] active:scale-95"
//         >
//           <Settings size={14} />
//         </button>

//         <button
//           type="button"
//           title="History"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#626262] transition-all hover:border-[#BFBFBF] hover:bg-[#F5F5F5] active:scale-95"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3">

//         {/* HEADER */}
//         <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
//           <div className="flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EE] text-[#FF6200]">
//               <Users size={17} />
//             </div>

//             <div>
//               <h2 className="text-[15px] font-semibold leading-tight text-[#131313]">
//                 Organization Chart
//               </h2>

//               <p className="text-[12px] leading-tight text-[#626262]">
//                 Total Strength:{" "}
//                   <span className="font-semibold text-[#FF6200]">
//                   {employees.length}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1.5 rounded-lg border border-[#E2E2E2] bg-white p-1 shadow-sm">
//             <button
//               type="button"
//               onClick={handleZoomOut}
//               title="Zoom out"
//               disabled={zoom <= MIN_ZOOM}
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#FF6200] transition-colors hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
//             >
//               <ZoomOut size={14} />
//             </button>

//             <button
//               type="button"
//               onClick={handleResetZoom}
//               title="Reset zoom to 100%"
//               className="min-w-[42px] text-center text-[11px] font-medium tabular-nums text-[#FF6200] hover:text-[#131313]"
//             >
//               {Math.round(zoom * 100)}%
//             </button>

//             <button
//               type="button"
//               onClick={handleZoomIn}
//               title="Zoom in"
//               disabled={zoom >= MAX_ZOOM}
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#FF6200] transition-colors hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
//             >
//               <ZoomIn size={14} />
//             </button>

//             <div className="mx-0.5 h-4 w-px bg-[#E4E7EC]" />

//             <button
//               type="button"
//               onClick={handleFit}
//               title="Fit to screen"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#626262] transition-colors hover:bg-[#FFF5EE] hover:text-[#FF6200] active:scale-95"
//             >
//               <Maximize2 size={14} />
//             </button>
//           </div>
//         </div>

//         {/* VIEW CONTROLS */}
//         <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E2E2E2] bg-[#FFF5EE] px-3 py-2">

//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setShowPhoto((value) => !value)
//               }
//               aria-pressed={showPhoto}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 showPhoto
//                   ? "border-[#FF6200] bg-[#FF6200] text-white shadow-sm"
//                   : "border-[#E2E2E2] bg-white text-[#626262] hover:bg-[#FFF5EE]"
//               }`}
//             >
//               {showPhoto ? "Photo View" : "Employee View"}
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setCompact((value) => !value)
//               }
//               aria-pressed={compact}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 compact
//                   ? "border-[#FF6200] bg-[#FF6200] text-white shadow-sm"
//                   : "border-[#E2E2E2] bg-white text-[#626262] hover:bg-[#FFF5EE]"
//               }`}
//             >
//               {compact ? "Compact View" : "Standard View"}
//             </button>
//           </div>

//           {isFetching && !isLoading && (
//             <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#FF6200]">
//               <Loader2 size={12} className="animate-spin" />
//               Refreshing...
//             </span>
//           )}
//         </div>

//         {/* CHART */}
//         {isLoading ? (
//           <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#E2E2E2] bg-white text-[13px] text-[#626262]">
//             <Loader2 size={22} className="animate-spin text-[#FF6200]" />
//             Loading organization chart...
//           </div>
//         ) : isError ? (
//           <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#FECDCA] bg-[#FFFBFA] text-[13px] text-[#D92D20]">
//             <AlertTriangle size={22} />
//             Failed to load organization chart.

//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="rounded-md bg-[#FFF5EE] px-3.5 py-1.5 font-medium text-[#FF6200] transition-colors hover:bg-[#FFE5D6] active:scale-95"
//             >
//               Retry
//             </button>
//           </div>
//         ) : tree.length === 0 ? (
//           <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E2E2E2] bg-white text-[13px] text-[#626262]">
//             <Users size={22} className="text-[#BFBFBF]" />
//             No organization data to show.
//           </div>
//         ) : (
//           <div
//             ref={containerRef}
//               className="occ-scroll relative min-h-0 flex-1 overflow-auto rounded-xl border border-[#E2E2E2] bg-[#F5F5F5] p-10 shadow-[inset_0_1px_3px_rgba(19,19,19,0.04)]"
//           >
//             <div
//               ref={contentRef}
//               className="inline-block origin-top-left transition-transform duration-150 ease-out"
//               style={{ transform: `scale(${zoom})` }}
//             >
//               <div className="flex w-max items-start gap-14">
//                 {tree.map((root) => (
//                   <OrgTreeNode
//                     key={root.id}
//                     node={root}
//                     compact={compact}
//                     showPhoto={showPhoto}
//                     depth={0}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Keep chart panning available while hiding scrollbar chrome. */}
//       <style>{`
//         .occ-scroll::-webkit-scrollbar {
//           display: none;
//         }
//         .occ-scroll {
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };
// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
//   depth: number;
// }> = ({ node, compact, showPhoto, depth }) => {
//   /* Sub-branches closed on page load — only top hierarchy visible */
//   const [collapsed, setCollapsed] = useState(true);
//   const [photoFailed, setPhotoFailed] = useState(false);

//   const hasChildren = node.children.length > 0;
//   const avatarColor = avatarColorFor(node.name || node.id);
//   const showRealPhoto = showPhoto && !!node.photo && !photoFailed;
//   const accentColor = "#FF6200";
//   const size = compact ? CARD_SIZE.compact : CARD_SIZE.standard;

//   const { rowRef, registerChild, width, paths } = useConnectorPaths(
//     node.children.length,
//     size.connectorHeight,
//     hasChildren && !collapsed
//   );

//   return (
//     <div className="flex flex-col items-center">
//       {/* EMPLOYEE CARD */}
//       <div
//         className={`group relative z-10 flex items-center justify-center gap-3 overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_2px_8px_rgba(19,19,19,0.08)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#FF6200] hover:shadow-[0_8px_20px_rgba(255,98,0,0.14)] ${
//           compact
//             ? "min-h-[48px] py-2 pl-3.5 pr-3"
//             : "min-h-[72px] py-3 pl-4 pr-3.5"
//         }`}
//         style={{
//           borderLeft: `4px solid ${accentColor}`,
//           width: size.width,
//         }}
//       >
//         {showRealPhoto ? (
//           <img
//             src={node.photo}
//             alt={node.name}
//             onError={() => setPhotoFailed(true)}
//             className={`shrink-0 rounded-lg object-cover ring-1 ring-black/5 ${
//               !showPhoto ? "hidden" : ""
//             } ${compact ? "h-7 w-7" : "h-9 w-9"}`}
//           />
//         ) : showPhoto && node.photo && photoFailed ? (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#98A2B3] ${
//               !showPhoto ? "hidden" : ""
//             } ${compact ? "h-7 w-7" : "h-9 w-9"}`}
//           >
//             <ImageOff size={compact ? 12 : 14} />
//           </div>
//         ) : (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-lg font-semibold ring-1 ring-black/5 ${
//               !showPhoto ? "hidden" : ""
//             } ${compact ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[12px]"}`}
//             style={{
//               backgroundColor: avatarColor.bg,
//               color: avatarColor.text,
//             }}
//           >
//             {initialsFor(node.name)}
//           </div>
//         )}

//         <div className={`min-w-0 ${showPhoto ? "flex-1 text-left" : "text-center"}`}>
//           <p
//             className={`truncate font-semibold leading-4 text-[#131313] ${
//               compact ? "text-[11px]" : "text-[13px]"
//             }`}
//             title={node.name}
//           >
//             {node.name}
//           </p>
//           <p
//             className={`truncate font-semibold uppercase leading-4 tracking-wide ${
//               compact ? "text-[8.5px]" : "text-[9.5px]"
//             }`}
//             style={{ color: accentColor }}
//             title={node.designation}
//           >
//             {node.designation || "\u00A0"}
//           </p>
//         </div>
//       </div>

//       {/* CHILDREN TOGGLE */}
//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() => setCollapsed((value) => !value)}
//           className="relative z-10 -mt-2.5 flex h-6 min-w-[38px] items-center justify-center gap-1 rounded-[5px] border border-[#E2E2E2] bg-white px-2 text-[10.5px] font-semibold text-[#FF6200] shadow-[0_1px_3px_rgba(19,19,19,0.12)] transition-all hover:border-[#FF6200] hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95"
//           aria-expanded={!collapsed}
//           aria-label={collapsed ? "Expand employees" : "Collapse employees"}
//         >
//           <ChevronDown
//             size={12}
//             className={`transition-transform duration-300 ease-in-out ${
//               collapsed ? "-rotate-90" : ""
//             }`}
//           />
//           {node.children.length}
//         </button>
//       )}

//       {/* CHILDREN + CONNECTOR LINES */}
//       {hasChildren && (
//         <div
//           className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
//             collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
//           }`}
//         >
//           <div className="overflow-hidden">
//             <div
//               className={`flex flex-col items-center transition-opacity duration-200 ${
//                 collapsed ? "opacity-0" : "opacity-100 delay-100"
//               }`}
//             >
//               {/* Vertical stub from card/toggle down to the branch line */}
//               <div
//                 className="w-px shrink-0 bg-[#D0D5DD]"
//                 style={{ height: 8 }}
//               />

//               <svg
//                 width={Math.max(width, size.width) || size.width}
//                 height={size.connectorHeight}
//                 className="block shrink-0 overflow-visible"
//                 style={{
//                   width: Math.max(width, size.width) || size.width,
//                   minWidth: size.width,
//                 }}
//               >
//                 {paths.map((d, index) =>
//                   d ? (
//                     <path
//                       key={index}
//                       d={d}
//                       stroke="#98A2B3"
//                       strokeWidth={1.75}
//                       fill="none"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   ) : null
//                 )}
//               </svg>

//               <div
//                 ref={rowRef}
//                 className="flex items-start justify-center"
//                 style={{ gap: size.gapX }}
//               >
//                 {node.children.map((child, index) => (
//                   <div
//                     key={child.id}
//                     ref={registerChild(index)}
//                     className="flex flex-col items-center"
//                   >
//                     <OrgTreeNode
//                       node={child}
//                       compact={compact}
//                       showPhoto={showPhoto}
//                       depth={depth + 1}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrganizationChartPage;



















// import React, {
//   useEffect,
//   useLayoutEffect,
//   useMemo,
//   useRef,
//   useState,
//   useCallback,
// } from "react";

// import {
//   ChevronDown,
//   Download,
//   Search,
//   Settings,
//   History,
//   ZoomIn,
//   ZoomOut,
//   Maximize2,
//   Users,
//   Loader2,
//   AlertTriangle,
//   ImageOff,
// } from "lucide-react";

// import EnrollmentTabs from "../components/EnrollmentTabs";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// import {
//   useGetOrganizationChartQuery,
// } from "../api/employeedetailsApi";

// /* =========================================================
//    TYPES
// ========================================================= */

// interface EmployeeRecord {
//   [key: string]: unknown;
// }

// interface Employee {
//   id: string;
//   name: string;
//   managerId: string;
//   managerName: string;
//   designation: string;
//   photo: string;
// }

// interface OrgNode {
//   id: string;
//   name: string;
//   designation: string;
//   photo: string;
//   children: OrgNode[];
// }

// /* =========================================================
//    HELPERS
// ========================================================= */

// const getValue = (
//   employee: EmployeeRecord,
//   ...keys: string[]
// ): string => {
//   for (const key of keys) {
//     const value = employee[key];

//     if (value !== null && value !== undefined) {
//       const text = String(value).trim();

//       if (text !== "") {
//         return text;
//       }
//     }
//   }

//   return "";
// };

// const normalizeEmployee = (
//   record: EmployeeRecord
// ): Employee => ({
//   id: getValue(
//     record,
//     "Employee ID",
//     "EmployeeID",
//     "EmployeeId",
//     "employeeId"
//   ),

//   name: getValue(
//     record,
//     "Employee Name",
//     "EmployeeName",
//     "EmployeeFullName",
//     "employeeName"
//   ),

//   managerId: getValue(
//     record,
//     "Manager ID",
//     "ManagerID",
//     "ManagerId",
//     "ReportingAuthorityID",
//     "ReportingAuthorityId",
//     "managerId"
//   ),

//   managerName: getValue(
//     record,
//     "Manager Name",
//     "ManagerName",
//     "managerName"
//   ),

//   designation: getValue(
//     record,
//     "Designation",
//     "Designation Name",
//     "DesignationName",
//     "designation"
//   ),

//   photo: getValue(
//     record,
//     "ProfilePhotoUrl",
//     "ProfilePhoto",
//     "PhotoUrl",
//     "photo"
//   ),
// });

// const initialsFor = (name: string): string =>
//   name
//     .trim()
//     .split(/\s+/)
//     .slice(0, 2)
//     .map((part) => part[0]?.toUpperCase() ?? "")
//     .join("") || "?";

// const AVATAR_PALETTE: Array<{ bg: string; text: string }> = [
//   { bg: "#FFEDD5", text: "#C2410C" },
//   { bg: "#FEF3C7", text: "#B45309" },
//   { bg: "#FFE4E6", text: "#BE123C" },
//   { bg: "#FFF7ED", text: "#9A3412" },
//   { bg: "#FED7AA", text: "#7C2D12" },
//   { bg: "#FFEEDD", text: "#C2660C" },
// ];

// const avatarColorFor = (name: string) => {
//   let hash = 0;

//   for (let i = 0; i < name.length; i += 1) {
//     hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
//   }

//   return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
// };

// /* =========================================================
//    API RESPONSE EXTRACTION
// ========================================================= */

// const extractEmployees = (
//   response: unknown
// ): EmployeeRecord[] => {
//   if (Array.isArray(response)) {
//     return response as EmployeeRecord[];
//   }

//   if (!response || typeof response !== "object") {
//     return [];
//   }

//   const result = response as Record<string, unknown>;

//   if (Array.isArray(result.Employees)) {
//     return result.Employees as EmployeeRecord[];
//   }

//   if (Array.isArray(result.data)) {
//     return result.data as EmployeeRecord[];
//   }

//   if (Array.isArray(result.Data)) {
//     return result.Data as EmployeeRecord[];
//   }

//   if (
//     result.data &&
//     typeof result.data === "object"
//   ) {
//     const nested = result.data as Record<string, unknown>;

//     if (Array.isArray(nested.Employees)) {
//       return nested.Employees as EmployeeRecord[];
//     }

//     if (Array.isArray(nested.data)) {
//       return nested.data as EmployeeRecord[];
//     }
//   }

//   return [];
// };

// /* =========================================================
//    BUILD ORGANIZATION TREE
// ========================================================= */

// function buildTree(records: EmployeeRecord[]): OrgNode[] {
//   const employees = records
//     .map(normalizeEmployee)
//     .filter((employee) => employee.id && employee.name);

//   const employeeById = new Map<string, Employee>();

//   employees.forEach((employee) => {
//     employeeById.set(employee.id, employee);
//   });

//   const nodeById = new Map<string, OrgNode>();

//   employees.forEach((employee) => {
//     nodeById.set(employee.id, {
//       id: employee.id,
//       name: employee.name,
//       designation: employee.designation,
//       photo: employee.photo,
//       children: [],
//     });
//   });

//   const roots: OrgNode[] = [];
//   const attached = new Set<string>();

//   employees.forEach((employee) => {
//     const node = nodeById.get(employee.id)!;
//     const managerId = employee.managerId.trim();

//     if (!managerId) {
//       roots.push(node);
//       attached.add(employee.id);
//       return;
//     }

//     const manager = employeeById.get(managerId);

//     if (manager && manager.id !== employee.id) {
//       const managerNode = nodeById.get(manager.id)!;

//       managerNode.children.push(node);
//       attached.add(employee.id);
//     }
//   });

//   employees.forEach((employee) => {
//     if (!attached.has(employee.id)) {
//       const node = nodeById.get(employee.id)!;

//       if (!roots.some((root) => root.id === node.id)) {
//         roots.push(node);
//       }

//       attached.add(employee.id);
//     }
//   });

//   const visited = new Set<string>();

//   const cleanTree = (node: OrgNode): OrgNode => {
//     if (visited.has(node.id)) {
//       return {
//         ...node,
//         children: [],
//       };
//     }

//     visited.add(node.id);

//     return {
//       ...node,
//       children: node.children
//         .filter((child) => !visited.has(child.id))
//         .map(cleanTree),
//     };
//   };

//   return roots.map(cleanTree);
// }

// /* =========================================================
//    ZOOM SETTINGS
// ========================================================= */

// const MIN_ZOOM = 0.3;
// const MAX_ZOOM = 2;
// const ZOOM_STEP = 0.1;

// const CARD_SIZE = {
//   standard: { width: 286, gapX: 44, connectorHeight: 48 },
//   compact: { width: 220, gapX: 30, connectorHeight: 38 },
// };

// /* =========================================================
//    CONNECTOR MEASUREMENT HOOK
// ========================================================= */

// function useConnectorPaths(
//   childCount: number,
//   connectorHeight: number,
//   active: boolean
// ) {
//   const rowRef = useRef<HTMLDivElement>(null);
//   const childRefs = useRef<Array<HTMLDivElement | null>>([]);
//   const [state, setState] = useState<{ width: number; paths: string[] }>({
//     width: 0,
//     paths: [],
//   });

//   childRefs.current = [];

//   const registerChild = useCallback(
//     (index: number) => (element: HTMLDivElement | null) => {
//       childRefs.current[index] = element;
//     },
//     []
//   );

//   useLayoutEffect(() => {
//     if (!active || childCount === 0) return;

//     const row = rowRef.current;

//     if (!row) return;

//     const measure = () => {
//       const rowRect = row.getBoundingClientRect();
//       const width = rowRect.width;
//       const parentX = width / 2;

//       const paths = childRefs.current.map((element) => {
//         if (!element) return "";

//         const rect = element.getBoundingClientRect();
//         const childX = rect.left - rowRect.left + rect.width / 2;

//         if (childCount === 1) {
//           return `M ${parentX} 0 V ${connectorHeight}`;
//         }

//         const branchY = Math.round(connectorHeight / 2);

//         return `M ${parentX} 0 V ${branchY} H ${childX} V ${connectorHeight}`;
//       });

//       setState({ width, paths });
//     };

//     measure();

//     const observer = new ResizeObserver(measure);

//     observer.observe(row);
//     childRefs.current.forEach((element) => {
//       if (element) observer.observe(element);
//     });

//     window.addEventListener("resize", measure);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("resize", measure);
//     };
//   }, [active, childCount, connectorHeight]);

//   return { rowRef, registerChild, ...state };
// }

// /* =========================================================
//    PAGE
// ========================================================= */

// const OrganizationChartPage: React.FC = () => {
//   const [searchInput, setSearchInput] = useState("");
//   const [search, setSearch] = useState("");

//   const [compact, setCompact] = useState(false);
//   const [showPhoto, setShowPhoto] = useState(false);

//   const [zoom, setZoom] = useState(1);

//   const containerRef = useRef<HTMLDivElement>(null);
//   const contentRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const timer = window.setTimeout(() => {
//       setSearch(searchInput.trim());
//     }, 350);

//     return () => window.clearTimeout(timer);
//   }, [searchInput]);

//   const {
//     data,
//     isLoading,
//     isFetching,
//     isError,
//     refetch,
//   } = useGetOrganizationChartQuery({
//     search: search || undefined,
//   });

//   const employees = useMemo(
//     () => extractEmployees(data),
//     [data]
//   );

//   const tree = useMemo(
//     () => buildTree(employees),
//     [employees]
//   );

//   const handleZoomIn = () => {
//     setZoom((current) =>
//       Math.min(MAX_ZOOM, Number((current + ZOOM_STEP).toFixed(2)))
//     );
//   };

//   const handleZoomOut = () => {
//     setZoom((current) =>
//       Math.max(MIN_ZOOM, Number((current - ZOOM_STEP).toFixed(2)))
//     );
//   };

//   const handleFit = useCallback(() => {
//     const container = containerRef.current;
//     const content = contentRef.current;

//     if (!container || !content) return;

//     const previousTransform = content.style.transform;

//     content.style.transform = "none";

//     const contentWidth = content.scrollWidth;
//     const availableWidth = container.clientWidth - 48;

//     content.style.transform = previousTransform;

//     if (contentWidth > 0 && availableWidth > 0) {
//       const nextScale = Math.min(
//         1,
//         Math.max(MIN_ZOOM, availableWidth / contentWidth)
//       );

//       setZoom(Number(nextScale.toFixed(2)));
//     }
//   }, []);

//   const handleResetZoom = () => setZoom(1);

//   const handleDownload = () => {
//     window.print();
//   };

//   /* UX (video-like): fit chart once data is ready — top level only, no scrollbar needed */
//   useEffect(() => {
//     if (isLoading || isError || tree.length === 0) return;

//     const timer = window.setTimeout(() => {
//       handleFit();
//     }, 150);

//     return () => window.clearTimeout(timer);
//   }, [isLoading, isError, tree.length, handleFit]);

//   return (
//     <div
//       className="flex h-[calc(100vh-80px)] w-full flex-col bg-[#F7F7F7]"
//       style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
//     >
//       <div className="shrink-0 px-3 pt-2">
//         <EnrollmentTabs />
//       </div>

//       <EnrollmentToolbarPortal>
//         <div className="relative">
//           <Search
//             size={13}
//             className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3]"
//           />

//           <input
//             value={searchInput}
//             onChange={(event) =>
//               setSearchInput(event.target.value)
//             }
//             placeholder="Search name / designation"
//             className="h-[30px] w-[190px] rounded-[6px] border border-[#E2E2E2] bg-white pl-7 pr-2 text-[12px] text-[#131313] outline-none transition-colors placeholder:text-[#626262] focus:border-[#FF6200] focus:ring-2 focus:ring-[#FFF5EE]"
//           />
//         </div>

//         <button
//           type="button"
//           onClick={handleDownload}
//           title="Download chart"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#FF6200] transition-all hover:bg-[#FFF5EE] hover:shadow-sm active:scale-95"
//         >
//           <Download size={14} />
//         </button>

//         <button
//           type="button"
//           title="Settings"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#626262] transition-all hover:border-[#BFBFBF] hover:bg-[#F5F5F5] active:scale-95"
//         >
//           <Settings size={14} />
//         </button>

//         <button
//           type="button"
//           title="History"
//           className="flex h-[30px] w-[30px] items-center justify-center rounded-[6px] border border-[#E2E2E2] bg-white text-[#626262] transition-all hover:border-[#BFBFBF] hover:bg-[#F5F5F5] active:scale-95"
//         >
//           <History size={14} />
//         </button>
//       </EnrollmentToolbarPortal>

//       <div className="flex min-h-0 flex-1 flex-col px-3 pb-3 pt-3">
//         <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2">
//           <div className="flex items-center gap-2.5">
//             <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FFF5EE] text-[#FF6200]">
//               <Users size={17} />
//             </div>

//             <div>
//               <h2 className="text-[15px] font-semibold leading-tight text-[#131313]">
//                 Organization Chart
//               </h2>

//               <p className="text-[12px] leading-tight text-[#626262]">
//                 Total Strength:{" "}
//                 <span className="font-semibold text-[#FF6200]">
//                   {employees.length}
//                 </span>
//               </p>
//             </div>
//           </div>

//           <div className="flex items-center gap-1.5 rounded-lg border border-[#E2E2E2] bg-white p-1 shadow-sm">
//             <button
//               type="button"
//               onClick={handleZoomOut}
//               title="Zoom out"
//               disabled={zoom <= MIN_ZOOM}
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#FF6200] transition-colors hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
//             >
//               <ZoomOut size={14} />
//             </button>

//             <button
//               type="button"
//               onClick={handleResetZoom}
//               title="Reset zoom to 100%"
//               className="min-w-[42px] text-center text-[11px] font-medium tabular-nums text-[#FF6200] hover:text-[#131313]"
//             >
//               {Math.round(zoom * 100)}%
//             </button>

//             <button
//               type="button"
//               onClick={handleZoomIn}
//               title="Zoom in"
//               disabled={zoom >= MAX_ZOOM}
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#FF6200] transition-colors hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
//             >
//               <ZoomIn size={14} />
//             </button>

//             <div className="mx-0.5 h-4 w-px bg-[#E4E7EC]" />

//             <button
//               type="button"
//               onClick={handleFit}
//               title="Fit to screen"
//               className="flex h-[28px] w-[28px] items-center justify-center rounded-md text-[#626262] transition-colors hover:bg-[#FFF5EE] hover:text-[#FF6200] active:scale-95"
//             >
//               <Maximize2 size={14} />
//             </button>
//           </div>
//         </div>

//         <div className="mb-3 flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E2E2E2] bg-[#FFF5EE] px-3 py-2">
//           <div className="flex flex-wrap gap-2">
//             <button
//               type="button"
//               onClick={() =>
//                 setShowPhoto((value) => !value)
//               }
//               aria-pressed={showPhoto}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 showPhoto
//                   ? "border-[#FF6200] bg-[#FF6200] text-white shadow-sm"
//                   : "border-[#E2E2E2] bg-white text-[#626262] hover:bg-[#FFF5EE]"
//               }`}
//             >
//               {showPhoto ? "Photo View" : "Employee View"}
//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 setCompact((value) => !value)
//               }
//               aria-pressed={compact}
//               className={`rounded-md border px-3 py-1.5 text-[11px] font-medium transition-all active:scale-95 ${
//                 compact
//                   ? "border-[#FF6200] bg-[#FF6200] text-white shadow-sm"
//                   : "border-[#E2E2E2] bg-white text-[#626262] hover:bg-[#FFF5EE]"
//               }`}
//             >
//               {compact ? "Compact View" : "Standard View"}
//             </button>
//           </div>

//           {isFetching && !isLoading && (
//             <span className="flex items-center gap-1.5 text-[11px] font-medium text-[#FF6200]">
//               <Loader2 size={12} className="animate-spin" />
//               Refreshing...
//             </span>
//           )}
//         </div>

//         {isLoading ? (
//           <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#E2E2E2] bg-white text-[13px] text-[#626262]">
//             <Loader2 size={22} className="animate-spin text-[#FF6200]" />
//             Loading organization chart...
//           </div>
//         ) : isError ? (
//           <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 rounded-xl border border-[#FECDCA] bg-[#FFFBFA] text-[13px] text-[#D92D20]">
//             <AlertTriangle size={22} />
//             Failed to load organization chart.

//             <button
//               type="button"
//               onClick={() => refetch()}
//               className="rounded-md bg-[#FFF5EE] px-3.5 py-1.5 font-medium text-[#FF6200] transition-colors hover:bg-[#FFE5D6] active:scale-95"
//             >
//               Retry
//             </button>
//           </div>
//         ) : tree.length === 0 ? (
//           <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#E2E2E2] bg-white text-[13px] text-[#626262]">
//             <Users size={22} className="text-[#BFBFBF]" />
//             No organization data to show.
//           </div>
//         ) : (
//           <div
//             ref={containerRef}
//             className="occ-scroll relative min-h-0 flex-1 overflow-auto rounded-xl border border-[#E2E2E2] bg-[#F5F5F5] p-10 shadow-[inset_0_1px_3px_rgba(19,19,19,0.04)]"
//           >
//             <div
//               ref={contentRef}
//               className="inline-block origin-top-left transition-transform duration-150 ease-out"
//               style={{ transform: `scale(${zoom})` }}
//             >
//               <div className="flex w-max items-start gap-14">
//                 {tree.map((root) => (
//                   <OrgTreeNode
//                     key={root.id}
//                     node={root}
//                     compact={compact}
//                     showPhoto={showPhoto}
//                     depth={0}
//                   />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       <style>{`
//         .occ-scroll::-webkit-scrollbar {
//           display: none;
//         }
//         .occ-scroll {
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// /* =========================================================
//    TREE NODE
// ========================================================= */

// const OrgTreeNode: React.FC<{
//   node: OrgNode;
//   compact: boolean;
//   showPhoto: boolean;
//   depth: number;
// }> = ({ node, compact, showPhoto, depth }) => {
//   /* UX (video-like): sub-branches closed on load — only top hierarchy visible */
//   const [collapsed, setCollapsed] = useState(true);
//   const [photoFailed, setPhotoFailed] = useState(false);

//   const hasChildren = node.children.length > 0;
//   const avatarColor = avatarColorFor(node.name || node.id);
//   const showRealPhoto = showPhoto && !!node.photo && !photoFailed;
//   const accentColor = "#FF6200";
//   const size = compact ? CARD_SIZE.compact : CARD_SIZE.standard;

//   const { rowRef, registerChild, width, paths } = useConnectorPaths(
//     node.children.length,
//     size.connectorHeight,
//     hasChildren && !collapsed
//   );

//   return (
//     <div className="flex flex-col items-center">
//       <div
//         className={`group relative z-10 flex items-center justify-center gap-3 overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_2px_8px_rgba(19,19,19,0.08)] transition-all duration-150 hover:-translate-y-0.5 hover:border-[#FF6200] hover:shadow-[0_8px_20px_rgba(255,98,0,0.14)] ${
//           compact
//             ? "min-h-[48px] py-2 pl-3.5 pr-3"
//             : "min-h-[72px] py-3 pl-4 pr-3.5"
//         }`}
//         style={{
//           borderLeft: `4px solid ${accentColor}`,
//           width: size.width,
//         }}
//       >
//         {showRealPhoto ? (
//           <img
//             src={node.photo}
//             alt={node.name}
//             onError={() => setPhotoFailed(true)}
//             className={`shrink-0 rounded-lg object-cover ring-1 ring-black/5 ${
//               !showPhoto ? "hidden" : ""
//             } ${compact ? "h-7 w-7" : "h-9 w-9"}`}
//           />
//         ) : showPhoto && node.photo && photoFailed ? (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-lg bg-[#F2F4F7] text-[#98A2B3] ${
//               !showPhoto ? "hidden" : ""
//             } ${compact ? "h-7 w-7" : "h-9 w-9"}`}
//           >
//             <ImageOff size={compact ? 12 : 14} />
//           </div>
//         ) : (
//           <div
//             className={`flex shrink-0 items-center justify-center rounded-lg font-semibold ring-1 ring-black/5 ${
//               !showPhoto ? "hidden" : ""
//             } ${compact ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-[12px]"}`}
//             style={{
//               backgroundColor: avatarColor.bg,
//               color: avatarColor.text,
//             }}
//           >
//             {initialsFor(node.name)}
//           </div>
//         )}

//         <div className={`min-w-0 ${showPhoto ? "flex-1 text-left" : "text-center"}`}>
//           <p
//             className={`truncate font-semibold leading-4 text-[#131313] ${
//               compact ? "text-[11px]" : "text-[13px]"
//             }`}
//             title={node.name}
//           >
//             {node.name}
//           </p>

//           <p
//             className={`truncate font-semibold uppercase leading-4 tracking-wide ${
//               compact ? "text-[8.5px]" : "text-[9.5px]"
//             }`}
//             style={{ color: accentColor }}
//             title={node.designation}
//           >
//             {node.designation || "\u00A0"}
//           </p>
//         </div>
//       </div>

//       {hasChildren && (
//         <button
//           type="button"
//           onClick={() =>
//             setCollapsed((value) => !value)
//           }
//           className="relative z-10 -mt-2.5 flex h-6 min-w-[38px] items-center justify-center gap-1 rounded-[5px] border border-[#E2E2E2] bg-white px-2 text-[10.5px] font-semibold text-[#FF6200] shadow-[0_1px_3px_rgba(19,19,19,0.12)] transition-all hover:border-[#FF6200] hover:bg-[#FFF5EE] hover:text-[#131313] active:scale-95"
//           aria-expanded={!collapsed}
//           aria-label={
//             collapsed
//               ? "Expand employees"
//               : "Collapse employees"
//           }
//         >
//           <ChevronDown
//             size={12}
//             className={`transition-transform duration-300 ease-in-out ${
//               collapsed ? "-rotate-90" : ""
//             }`}
//           />

//           {node.children.length}
//         </button>
//       )}

//       {hasChildren && (
//         <div
//           className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
//             collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
//           }`}
//         >
//           <div className="overflow-hidden">
//             <div
//               className={`flex flex-col items-center transition-opacity duration-200 ${
//                 collapsed ? "opacity-0" : "opacity-100 delay-100"
//               }`}
//             >
//               <svg
//                 width={width || undefined}
//                 height={size.connectorHeight}
//                 className="block shrink-0"
//                 style={{ width: width || "100%" }}
//               >
//                 {paths.map((d, index) =>
//                   d ? (
//                     <path
//                       key={index}
//                       d={d}
//                       stroke="#98A2B3"
//                       strokeWidth={1.75}
//                       fill="none"
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                     />
//                   ) : null
//                 )}
//               </svg>

//               <div
//                 ref={rowRef}
//                 className="flex items-start"
//                 style={{ gap: size.gapX }}
//               >
//                 {node.children.map((child, index) => (
//                   <div
//                     key={child.id}
//                     ref={registerChild(index)}
//                     className="flex flex-col items-center"
//                   >
//                     <OrgTreeNode
//                       node={child}
//                       compact={compact}
//                       showPhoto={showPhoto}
//                       depth={depth + 1}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrganizationChartPage;