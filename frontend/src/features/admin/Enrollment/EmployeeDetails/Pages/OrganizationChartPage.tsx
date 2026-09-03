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






import React, { useState } from "react";
import { ChevronDown, Download } from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

export interface OrgNode {
  id: string;
  name: string;
  title: string;
  initials: string;
  gradient: string;
  children?: OrgNode[];
}

/* =========================================================
   SAMPLE DATA
========================================================= */

const sampleOrgData: OrgNode = {
  id: "1",
  name: "Kavya N",
  title: "PROJECT MANAGER",
  initials: "KN",
  gradient: "from-[#7C3AED] to-[#A855F7]",
  children: [
    {
      id: "2",
      name: "Daniel Raju Ravi",
      title: "PROJECT MANAGER",
      initials: "DR",
      gradient: "from-[#EC4899] to-[#F472B6]",
      children: [
        {
          id: "4",
          name: "Sample Report 1",
          title: "SOFTWARE ENGINEER",
          initials: "SR",
          gradient: "from-[#10B981] to-[#34D399]",
        },
        {
          id: "5",
          name: "Sample Report 2",
          title: "SOFTWARE ENGINEER",
          initials: "SR",
          gradient: "from-[#10B981] to-[#34D399]",
        },
      ],
    },
    {
      id: "3",
      name: "Yogesh Kumar K",
      title: "BUSINESS DEVELOPMENT MANAGER",
      initials: "YK",
      gradient: "from-[#F97316] to-[#FB923C]",
    },
  ],
};

/* =========================================================
   PAGE
========================================================= */

const OrganizationChartPage: React.FC = () => {
  const [view] = useState("Employee View");
  const [layout] = useState("Standard View");
  const [branch] = useState("");

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#F8FAFC]">

      {/* =====================================================
          CONTENT
          IMPORTANT:
          Navigation tabs are intentionally REMOVED here.
          The parent Enrollment layout already renders them.
      ===================================================== */}

      <div className="w-full px-[14px] pt-[14px] pb-[22px]">

        {/* ===================================================
            TEAM CHIP
        =================================================== */}

        <div className="mb-[10px]">
          <span
            className="
              inline-flex
              items-center
              rounded-[6px]
              border border-[#E0ECFF]
              bg-[#EFF6FF]
              px-[10px]
              py-[5px]
              text-[11px]
              font-medium
              text-[#2563EB]
              shadow-[0_1px_2px_rgba(37,99,235,0.04)]
            "
          >
            Kavya N Team
          </span>
        </div>

        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div
          className="
            mb-[14px]
            flex
            h-[38px]
            items-center
            gap-[6px]
            rounded-[9px]
            border
            border-[#B7B1F8]
            bg-gradient-to-r
            from-[#A5B4FC]
            via-[#C4B5FD]
            to-[#DDD6FE]
            px-[10px]
            shadow-[0_2px_8px_rgba(99,102,241,0.18)]
          "
        >
          {/* Employee View */}

          <ToolbarDropdown label={view} />

          {/* Standard View */}

          <ToolbarDropdown label={layout} />

          {/* Branch */}

          <ToolbarDropdown
            label={branch || "Select Branch / Department"}
            placeholder={!branch}
          />

          {/* Download */}

          <button
            type="button"
            aria-label="Download chart"
            className="
              ml-auto
              flex
              h-[28px]
              w-[28px]
              items-center
              justify-center
              rounded-[7px]
              border
              border-white/40
              bg-white/45
              text-[#5B21B6]
              shadow-[0_1px_3px_rgba(76,29,149,0.08)]
              transition-all
              hover:bg-white/70
              hover:shadow-[0_2px_5px_rgba(76,29,149,0.12)]
              active:scale-95
            "
          >
            <Download
              size={14}
              strokeWidth={2}
            />
          </button>
        </div>

        {/* ===================================================
            CHART CARD
        =================================================== */}

        <div
          className="
            relative
            min-h-[540px]
            w-full
            overflow-x-auto
            overflow-y-hidden
            rounded-[10px]
            border
            border-[#DCE4EE]
            bg-white
            shadow-[0_1px_3px_rgba(16,24,40,0.04),0_4px_12px_rgba(16,24,40,0.03)]
          "
        >
          {/* subtle inner border */}

          <div
            className="
              absolute
              inset-[1px]
              pointer-events-none
              rounded-[9px]
              border
              border-[#F5F7FA]
            "
          />

          {/* Chart */}

          <div
            className="
              relative
              flex
              min-w-[850px]
              justify-center
              px-[40px]
              pt-[36px]
              pb-[70px]
            "
          >
            <OrgTree node={sampleOrgData} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TOOLBAR DROPDOWN
========================================================= */

interface ToolbarDropdownProps {
  label: string;
  placeholder?: boolean;
}

const ToolbarDropdown: React.FC<ToolbarDropdownProps> = ({
  label,
  placeholder = false,
}) => {
  return (
    <button
      type="button"
      className={`
        flex
        h-[27px]
        items-center
        gap-[5px]
        rounded-[6px]
        border
        border-white/50
        bg-white/45
        px-[9px]
        text-[10.5px]
        font-medium
        shadow-[0_1px_2px_rgba(0,0,0,0.04)]
        transition-all
        hover:bg-white/70
        hover:shadow-[0_1px_4px_rgba(0,0,0,0.08)]
        ${
          placeholder
            ? "text-[#6366F1]"
            : "text-[#4338CA]"
        }
      `}
    >
      <span className="whitespace-nowrap">
        {label}
      </span>

      <ChevronDown
        size={11}
        strokeWidth={2.3}
        className="opacity-70"
      />
    </button>
  );
};

/* =========================================================
   ORGANIZATION TREE
========================================================= */

const OrgTree: React.FC<{ node: OrgNode }> = ({
  node,
}) => {
  return (
    <>
      <style>{`
        .org-tree,
        .org-tree ul,
        .org-tree li {
          list-style: none;
          margin: 0;
          padding: 0;
          position: relative;
        }

        .org-tree {
          display: flex;
          justify-content: center;
          width: max-content;
          min-width: 100%;
        }

        .org-tree ul {
          display: flex;
          justify-content: center;
          padding-top: 30px;
        }

        .org-tree li {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 30px 16px 0 16px;
        }

        /* horizontal + vertical connectors */

        .org-tree li::before,
        .org-tree li::after {
          content: "";
          position: absolute;
          top: 0;
          width: 50%;
          height: 30px;
          border-top: 1px solid #CBD5E1;
        }

        .org-tree li::before {
          right: 50%;
        }

        .org-tree li::after {
          left: 50%;
          border-left: 1px solid #CBD5E1;
        }

        /* only child */

        .org-tree li:only-child::before,
        .org-tree li:only-child::after {
          display: none;
        }

        .org-tree li:only-child {
          padding-top: 0;
        }

        /* first child */

        .org-tree li:first-child::before {
          border: 0;
        }

        /* last child */

        .org-tree li:last-child::after {
          border: 0;
        }

        /* last child right connector */

        .org-tree li:last-child::before {
          border-right: 1px solid #CBD5E1;
          border-radius: 0 5px 0 0;
        }

        /* first child left connector */

        .org-tree li:first-child::after {
          border-radius: 5px 0 0 0;
        }

        /* root */

        .org-tree > li {
          padding-top: 0;
        }

        .org-tree > li::before,
        .org-tree > li::after {
          display: none;
        }

        /* vertical connector from parent */

        .org-tree ul::before {
          content: "";
          position: absolute;
          top: 0;
          left: 50%;
          width: 0;
          height: 30px;
          border-left: 1px solid #CBD5E1;
        }
      `}</style>

      <ul className="org-tree">
        <OrgTreeNode node={node} />
      </ul>
    </>
  );
};

/* =========================================================
   TREE NODE
========================================================= */

const OrgTreeNode: React.FC<{ node: OrgNode }> = ({
  node,
}) => {
  const [collapsed, setCollapsed] =
    useState(false);

  const hasChildren =
    !!node.children &&
    node.children.length > 0;

  return (
    <li>
      {/* Employee Card */}

      <OrgCard node={node} />

      {/* Child count */}

      {hasChildren && (
        <button
          type="button"
          onClick={() =>
            setCollapsed((value) => !value)
          }
          className="
            z-20
            mt-[7px]
            flex
            h-[19px]
            min-w-[30px]
            items-center
            justify-center
            gap-[2px]
            rounded-full
            border
            border-[#DCE4EE]
            bg-white
            px-[6px]
            text-[9px]
            font-medium
            text-[#64748B]
            shadow-[0_1px_3px_rgba(16,24,40,0.08)]
            transition-all
            hover:border-[#C7D2E0]
            hover:bg-[#F8FAFC]
            hover:shadow-[0_2px_5px_rgba(16,24,40,0.10)]
          "
        >
          <ChevronDown
            size={10}
            strokeWidth={2.5}
            className={`
              transition-transform
              duration-200
              ${
                collapsed
                  ? "-rotate-90"
                  : "rotate-0"
              }
            `}
          />

          {node.children!.length}
        </button>
      )}

      {/* Children */}

      {hasChildren && !collapsed && (
        <ul>
          {node.children!.map((child) => (
            <OrgTreeNode
              key={child.id}
              node={child}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

/* =========================================================
   ORGANIZATION CARD
========================================================= */

const OrgCard: React.FC<{
  node: OrgNode;
}> = ({ node }) => {
  return (
    <div
      className="
        flex
        h-[45px]
        min-w-[173px]
        items-center
        gap-[9px]
        rounded-[7px]
        border
        border-[#DCE4EE]
        bg-white
        px-[10px]
        py-[6px]
        shadow-[0_1px_3px_rgba(16,24,40,0.05)]
        transition-all
        duration-200
        hover:-translate-y-[1px]
        hover:border-[#CBD5E1]
        hover:shadow-[0_4px_10px_rgba(16,24,40,0.09)]
      "
    >
      {/* Avatar */}

      <div
        className={`
          flex
          h-[28px]
          w-[28px]
          shrink-0
          items-center
          justify-center
          rounded-[6px]
          bg-gradient-to-br
          ${node.gradient}
          text-[9px]
          font-semibold
          text-white
          shadow-[0_1px_3px_rgba(0,0,0,0.12)]
        `}
      >
        {node.initials}
      </div>

      {/* Employee Details */}

      <div className="min-w-0 flex-1">
        <div
          className="
            truncate
            text-[10.5px]
            font-semibold
            leading-[14px]
            text-[#1E293B]
          "
        >
          {node.name}
        </div>

        <div
          className="
            mt-[1px]
            truncate
            text-[7.5px]
            font-medium
            uppercase
            leading-[10px]
            tracking-[0.02em]
            text-[#94A3B8]
          "
        >
          {node.title}
        </div>
      </div>
    </div>
  );
};

export default OrganizationChartPage;