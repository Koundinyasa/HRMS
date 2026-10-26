// import { useNavigate, useLocation, useParams } from "react-router-dom";
 
// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";
 
// const TAB_ITEMS = [
//   { label: "Employee", segment: "" },
//   { label: "Employee Group", segment: "employee-group" },
//   { label: "Pending Candidate", segment: "pending-candidates" },
//   { label: "Organization Chart", segment: "organization-chart" },
//   { label: "Reset Blocked User", segment: "reset-blocked-user" },
//   { label: "Import", segment: "import" },
// ] as const;
 
// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();
 
//   const basePath = `/${domain}/admin/enrollment`;
 
//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;
 
//   const isActive = (segment: string) => {
//     const path = getPath(segment);
 
//     if (!segment) {
//       return (
//         location.pathname === path ||
//         location.pathname === `${path}/` ||
//         location.pathname.startsWith(`${path}/employee/`)
//       );
//     }
 
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };
 
//   return (
//     <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//       <div className="flex items-center gap-6 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`relative whitespace-nowrap py-3 text-[13px] transition-colors ${
//                 active
//                   ? "font-semibold text-[#2D8CF0]"
//                   : "font-medium text-[#5B6B80] hover:text-[#2B3A55]"
//               }`}
//             >
//               {tab.label}
//               {active && (
//                 <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t bg-[#2D8CF0]" />
//               )}
//             </button>
//           );
//         })}
//       </div>
 
//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2.5"
//       />
//     </div>
//   );
// };
 
// export default EnrollmentTabs;














// import { useNavigate, useLocation, useParams } from "react-router-dom";
 
// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";
 
// const TAB_ITEMS = [
//   { label: "Employee", segment: "" },
//   { label: "Employee Group", segment: "employee-group" },
//   { label: "Pending Candidate", segment: "pending-candidates" },
//   { label: "Organization Chart", segment: "organization-chart" },
//   { label: "Reset Blocked User", segment: "reset-blocked-user" },
//   { label: "Import", segment: "import" },
// ] as const;
 
// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();
 
//   const basePath = `/${domain}/admin/enrollment`;
 
//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;
 
//   const isActive = (segment: string) => {
//     const path = getPath(segment);
 
//     if (!segment) {
//       return (
//         location.pathname === path ||
//         location.pathname === `${path}/` ||
//         location.pathname.startsWith(`${path}/employee/`)
//       );
//     }
 
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };
 
//   return (
//     <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//       <div className="flex items-center gap-6 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`relative whitespace-nowrap py-3 text-[13px] transition-colors ${
//                 active
//                   ? "font-semibold text-[#F97316]"
//                   : "font-medium text-[#5B6B80] hover:text-[#2B3A55]"
//               }`}
//             >
//               {tab.label}
//               {active && (
//                 <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t bg-[#F97316]" />
//               )}
//             </button>
//           );
//         })}
//       </div>
 
//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2.5"
//       />
//     </div>
//   );
// };
 
// export default EnrollmentTabs;








// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import {
//   Users,
//   UsersRound,
//   Clock,        // was UserClock — fix
//   Network,
//   ShieldOff,
//   Download,
// } from "lucide-react";

// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";

// const TAB_ITEMS = [
//   { label: "Employee", segment: "", icon: Users },
//   { label: "Employee Group", segment: "employee-group", icon: UsersRound },
//   { label: "Pending Candidate", segment: "pending-candidates", icon: Clock },
//   { label: "Organization Chart", segment: "organization-chart", icon: Network },
//   { label: "Reset Blocked User", segment: "reset-blocked-user", icon: ShieldOff },
//   { label: "Import", segment: "import", icon: Download },
// ] as const;

// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();

//   const basePath = `/${domain}/admin/enrollment`;

//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;

//   const isActive = (segment: string) => {
//     const path = getPath(segment);
//     if (!segment) {
//       return (
//         location.pathname === path ||
//         location.pathname === `${path}/` ||
//         location.pathname.startsWith(`${path}/employee/`)
//       );
//     }
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };

//   return (
//     <div className="mb-3 flex items-center justify-between gap-3 rounded-[10px] border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">
//       <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[12.5px] font-medium transition-colors ${
//                 active
//                   ? "bg-white text-[#C2410C] shadow-sm ring-1 ring-[#FDBA74]"
//                   : "text-[#9A3412]/80 hover:bg-white/70 hover:text-[#C2410C]"
//               }`}
//             >
//               <Icon size={14} strokeWidth={active ? 2.4 : 2} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2"
//       />
//     </div>
//   );
// };

// export default EnrollmentTabs;











// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import {
//   Users,
//   UsersRound,
//   Clock,
//   Network,
//   ShieldOff,
//   Download,
// } from "lucide-react";

// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";

// const TAB_ITEMS = [
//   { label: "Employee", segment: "", icon: Users },
//   { label: "Employee Group", segment: "employee-group", icon: UsersRound },
//   { label: "Pending Candidate", segment: "pending-candidates", icon: Clock },
//   { label: "Organization Chart", segment: "organization-chart", icon: Network },
//   { label: "Reset Blocked User", segment: "reset-blocked-user", icon: ShieldOff },
//   { label: "Import", segment: "import", icon: Download },
// ] as const;

// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();

//   // matches: /KOUNDINYASATECH/admin/enrollment/EmployeeDetails
//   const basePath = `/${domain}/admin/enrollment/EmployeeDetails`;

//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;

//   const isActive = (segment: string) => {
//     if (!segment) {
//       return (
//         location.pathname === basePath ||
//         location.pathname === `${basePath}/` ||
//         /\/EmployeeDetails\/?$/.test(location.pathname)
//       );
//     }
//     return location.pathname.includes(`/${segment}`);
//   };

//   return (
//     <div className="mb-2 flex items-center justify-between gap-3 rounded-[10px] border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">
//       <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[12.5px] font-medium transition-colors ${
//                 active
//                   ? "bg-white text-[#C2410C] shadow-sm ring-1 ring-[#FDBA74]"
//                   : "text-[#9A3412]/80 hover:bg-white/70 hover:text-[#C2410C]"
//               }`}
//             >
//               <Icon size={14} strokeWidth={active ? 2.4 : 2} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* portal target for + Add Employee etc. */}
//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2"
//       />
//     </div>
//   );
// };

// export default EnrollmentTabs;
























// import { useNavigate, useLocation, useParams } from "react-router-dom";
 
// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";
 
// const TAB_ITEMS = [
//   { label: "Employee", segment: "" },
//   { label: "Employee Group", segment: "employee-group" },
//   { label: "Pending Candidate", segment: "pending-candidates" },
//   { label: "Organization Chart", segment: "organization-chart" },
//   { label: "Reset Blocked User", segment: "reset-blocked-user" },
//   { label: "Import", segment: "import" },
// ] as const;
 
// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();
 
//   const basePath = `/${domain}/admin/enrollment`;
 
//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;
 
//   const isActive = (segment: string) => {
//     const path = getPath(segment);
 
//     if (!segment) {
//       return (
//         location.pathname === path ||
//         location.pathname === `${path}/` ||
//         location.pathname.startsWith(`${path}/employee/`)
//       );
//     }
 
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };
 
//   return (
//     <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//       <div className="flex items-center gap-6 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`relative whitespace-nowrap py-3 text-[13px] transition-colors ${
//                 active
//                   ? "font-semibold text-[#2D8CF0]"
//                   : "font-medium text-[#5B6B80] hover:text-[#2B3A55]"
//               }`}
//             >
//               {tab.label}
//               {active && (
//                 <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t bg-[#2D8CF0]" />
//               )}
//             </button>
//           );
//         })}
//       </div>
 
//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2.5"
//       />
//     </div>
//   );
// };
 
// export default EnrollmentTabs;














// import { useNavigate, useLocation, useParams } from "react-router-dom";
 
// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";
 
// const TAB_ITEMS = [
//   { label: "Employee", segment: "" },
//   { label: "Employee Group", segment: "employee-group" },
//   { label: "Pending Candidate", segment: "pending-candidates" },
//   { label: "Organization Chart", segment: "organization-chart" },
//   { label: "Reset Blocked User", segment: "reset-blocked-user" },
//   { label: "Import", segment: "import" },
// ] as const;
 
// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();
 
//   const basePath = `/${domain}/admin/enrollment`;
 
//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;
 
//   const isActive = (segment: string) => {
//     const path = getPath(segment);
 
//     if (!segment) {
//       return (
//         location.pathname === path ||
//         location.pathname === `${path}/` ||
//         location.pathname.startsWith(`${path}/employee/`)
//       );
//     }
 
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };
 
//   return (
//     <div className="flex items-center justify-between gap-4 rounded-[10px] bg-white px-4 shadow-[0_1px_3px_rgba(16,24,40,0.08)]">
//       <div className="flex items-center gap-6 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`relative whitespace-nowrap py-3 text-[13px] transition-colors ${
//                 active
//                   ? "font-semibold text-[#F97316]"
//                   : "font-medium text-[#5B6B80] hover:text-[#2B3A55]"
//               }`}
//             >
//               {tab.label}
//               {active && (
//                 <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-t bg-[#F97316]" />
//               )}
//             </button>
//           );
//         })}
//       </div>
 
//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2.5"
//       />
//     </div>
//   );
// };
 
// export default EnrollmentTabs;








// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import {
//   Users,
//   UsersRound,
//   Clock,        // was UserClock — fix
//   Network,
//   ShieldOff,
//   Download,
// } from "lucide-react";

// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";

// const TAB_ITEMS = [
//   { label: "Employee", segment: "", icon: Users },
//   { label: "Employee Group", segment: "employee-group", icon: UsersRound },
//   { label: "Pending Candidate", segment: "pending-candidates", icon: Clock },
//   { label: "Organization Chart", segment: "organization-chart", icon: Network },
//   { label: "Reset Blocked User", segment: "reset-blocked-user", icon: ShieldOff },
//   { label: "Import", segment: "import", icon: Download },
// ] as const;

// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();

//   const basePath = `/${domain}/admin/enrollment`;

//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;

//   const isActive = (segment: string) => {
//     const path = getPath(segment);
//     if (!segment) {
//       return (
//         location.pathname === path ||
//         location.pathname === `${path}/` ||
//         location.pathname.startsWith(`${path}/employee/`)
//       );
//     }
//     return (
//       location.pathname === path ||
//       location.pathname.startsWith(`${path}/`)
//     );
//   };

//   return (
//     <div className="mb-3 flex items-center justify-between gap-3 rounded-[10px] border border-[#FED7AA] bg-[#FFF7ED] px-3 py-2">
//       <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[12.5px] font-medium transition-colors ${
//                 active
//                   ? "bg-white text-[#C2410C] shadow-sm ring-1 ring-[#FDBA74]"
//                   : "text-[#9A3412]/80 hover:bg-white/70 hover:text-[#C2410C]"
//               }`}
//             >
//               <Icon size={14} strokeWidth={active ? 2.4 : 2} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2"
//       />
//     </div>
//   );
// };

// export default EnrollmentTabs;











// import { useNavigate, useLocation, useParams } from "react-router-dom";
// import {
//   Users,
//   UsersRound,
//   Clock,
//   Network,
//   ShieldOff,
//   Download,
// } from "lucide-react";

// export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";

// const TAB_ITEMS = [
//   { label: "Employee", segment: "", icon: Users },
//   { label: "Employee Group", segment: "employee-group", icon: UsersRound },
//   { label: "Pending Candidate", segment: "pending-candidates", icon: Clock },
//   { label: "Organization Chart", segment: "organization-chart", icon: Network },
//   { label: "Reset Blocked User", segment: "reset-blocked-user", icon: ShieldOff },
//   { label: "Import", segment: "import", icon: Download },
// ] as const;

// const EnrollmentTabs = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { domain } = useParams();

//   // matches: /KOUNDINYASATECH/admin/enrollment/EmployeeDetails
//   const basePath = `/${domain}/admin/enrollment/EmployeeDetails`;

//   const getPath = (segment: string) =>
//     segment ? `${basePath}/${segment}` : basePath;

//   const isActive = (segment: string) => {
//     if (!segment) {
//       return (
//         location.pathname === basePath ||
//         location.pathname === `${basePath}/` ||
//         /\/EmployeeDetails\/?$/.test(location.pathname)
//       );
//     }
//     return location.pathname.includes(`/${segment}`);
//   };

//   return (
//     <div className="mb-2 flex items-center justify-between gap-3 overflow-x-auto rounded-[8px] border border-[#E2E2E2] bg-[#FFF5EE] px-3 py-2">
//       <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
//         {TAB_ITEMS.map((tab) => {
//           const active = isActive(tab.segment);
//           const Icon = tab.icon;
//           return (
//             <button
//               key={tab.label}
//               type="button"
//               onClick={() => navigate(getPath(tab.segment))}
//               className={`flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[12.5px] font-medium transition-colors ${
//                 active
//                   ? "bg-white text-[#FF6200] shadow-sm ring-1 ring-[#FF6200]/35"
//                   : "text-[#626262] hover:bg-white/80 hover:text-[#FF6200]"
//               }`}
//             >
//               <Icon size={14} strokeWidth={active ? 2.4 : 2} />
//               {tab.label}
//             </button>
//           );
//         })}
//       </div>

//       {/* portal target for + Add Employee etc. */}
//       <div
//         id={ENROLLMENT_ACTIONS_SLOT_ID}
//         className="flex shrink-0 items-center gap-2"
//       />
//     </div>
//   );
// };

// export default EnrollmentTabs;




import { useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Users,
  UsersRound,
  Clock,
  Network,
  ShieldOff,
  Download,
} from "lucide-react";

export const ENROLLMENT_ACTIONS_SLOT_ID = "enrollment-toolbar-actions";

const TAB_ITEMS = [
  { label: "Employee", segment: "", icon: Users },
  { label: "Employee Group", segment: "employee-group", icon: UsersRound },
  { label: "Pending Candidate", segment: "pending-candidates", icon: Clock },
  { label: "Organization Chart", segment: "organization-chart", icon: Network },
  { label: "Reset Blocked User", segment: "reset-blocked-user", icon: ShieldOff },
  { label: "Import", segment: "import", icon: Download },
] as const;

const EnrollmentTabs = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { domain } = useParams();

  const basePath = `/${domain}/admin/enrollment/EmployeeDetails`;

  const getPath = (segment: string) =>
    segment ? `${basePath}/${segment}` : basePath;

  const isActive = (segment: string) => {
    if (!segment) {
      return (
        location.pathname === basePath ||
        location.pathname === `${basePath}/` ||
        /\/EmployeeDetails\/?$/.test(location.pathname)
      );
    }
    return location.pathname.includes(`/${segment}`);
  };

  return (
    <div className="mb-2 flex items-center justify-between gap-3 overflow-x-auto rounded-[8px] border border-[#E2E2E2] bg-[#FFF5EE] px-3 py-2">
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto">
        {TAB_ITEMS.map((tab) => {
          const active = isActive(tab.segment);
          const Icon = tab.icon;
          return (
            <button
              key={tab.label}
              type="button"
              onClick={() => navigate(getPath(tab.segment))}
              className={`flex h-[34px] items-center gap-1.5 whitespace-nowrap rounded-[8px] px-3 text-[12.5px] font-medium transition-colors ${
                active
                  ? "bg-white text-[#FF6200] shadow-sm ring-1 ring-[#FF6200]/35"
                  : "text-[#626262] hover:bg-white/80 hover:text-[#FF6200]"
              }`}
            >
              <Icon size={14} strokeWidth={active ? 2.4 : 2} />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div id={ENROLLMENT_ACTIONS_SLOT_ID} className="flex shrink-0 items-center gap-2" />
    </div>
  );
};

export default EnrollmentTabs;






