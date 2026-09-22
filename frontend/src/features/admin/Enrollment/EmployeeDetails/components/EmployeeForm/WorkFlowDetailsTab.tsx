// import React, { useState } from "react";
// import { ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";

// interface WorkFlowDetailsTabProps {
//   form: any;
// }

// const WorkFlowDetailsTab: React.FC<WorkFlowDetailsTabProps> = ({ form }) => {
//   const [openLeave, setOpenLeave] = useState(true);

//   return (
//     <div className="flex gap-5 min-h-[480px]">
//       {/* ===== LEFT SIDEBAR ===== */}
//       <div className="w-[210px] shrink-0">
//         <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
//           {/* Photo */}
//           <div className="pt-4 px-4 flex justify-center">
//             <div className="w-[158px] h-[188px] rounded-md overflow-hidden border border-gray-200 bg-gray-50">
//               {form.photoUrl ? (
//                 <img
//                   src={form.photoUrl}
//                   alt={form.fullName}
//                   className="w-full h-full object-cover"
//                 />
//               ) : (
//                 <img
//                   src="https://i.pravatar.cc/300?u=294640"
//                   alt="Employee"
//                   className="w-full h-full object-cover"
//                 />
//               )}
//             </div>
//           </div>

//           {/* Info */}
//           <div className="px-4 pt-3 pb-4 text-center">
//             <h3 className="text-[13.5px] font-semibold text-gray-800 leading-tight tracking-tight">
//               {form.fullName || "BHAGYARAJA AVURAPALLI"}
//             </h3>

//             <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium">
//               {form.empId || "294640"}
//             </div>

//             <p className="mt-2 text-[11px] text-gray-500 leading-[1.35]">
//               {form.designation || "Senior Software Engineer"} |{" "}
//               {form.branch || "Koundinyasa Technology Services Pvt. Ltd."}
//             </p>

//             <p className="mt-1 text-[11px] text-gray-400">
//               DOJ {form.dateOfJoining || "31/Mar/2026"}
//             </p>

//             <div className="mt-3 space-y-1.5 text-left pl-1">
//               <div className="flex items-center gap-2 text-[12px] text-gray-600">
//                 <Phone size={12} className="text-gray-400 shrink-0" />
//                 <span>{form.mobile || "9491964186"}</span>
//               </div>
//               <div className="flex items-center gap-2 text-[12px] text-gray-600">
//                 <Mail size={12} className="text-gray-400 shrink-0" />
//                 <span className="truncate">
//                   {form.email || "bhagyaraja.a@koundinyasatech.com"}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ===== RIGHT CONTENT ===== */}
//       <div className="flex-1 min-w-0">
//         {/* Leave Module Accordion */}
//         <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">
//           {/* Header */}
//           <button
//             type="button"
//             onClick={() => setOpenLeave((v) => !v)}
//             className="w-full flex items-center justify-between px-4 py-[11px] hover:bg-gray-50/60 transition-colors"
//           >
//             <span className="inline-flex items-center px-3 py-[3px] rounded-full bg-[#ECEFF1] text-[#546E7A] text-[12.5px] font-medium">
//               Leave Module
//             </span>
//             {openLeave ? (
//               <ChevronUp size={15} className="text-gray-400" />
//             ) : (
//               <ChevronDown size={15} className="text-gray-400" />
//             )}
//           </button>

//           {/* Body */}
//           {openLeave && (
//             <div className="px-4 pb-4">
//               <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] px-4 py-3">
//                 <div className="text-[13px] font-medium text-gray-800 mb-1.5">
//                   Leave Apply RA Level 1
//                 </div>
//                 <div className="text-[12px] text-gray-500 leading-relaxed flex flex-wrap gap-x-1">
//                   <span>SI No : <span className="text-gray-700">1</span></span>
//                   <span className="text-gray-300">|</span>
//                   <span>Approver : <span className="text-gray-700">Daniel Raju Ravi</span></span>
//                   <span className="text-gray-300">|</span>
//                   <span>Level : <span className="text-gray-700">1</span></span>
//                   <span className="text-gray-300">|</span>
//                   <span>Employee Group Name : <span className="text-gray-700">All Employees</span></span>
//                   <span className="text-gray-300">|</span>
//                   <span>Group Name : <span className="text-gray-700">CL, CO, CW, LOP, OOD, RH, SL</span></span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WorkFlowDetailsTab;


















import React, { useState } from "react";
import { ChevronDown, ChevronUp, Phone, Mail } from "lucide-react";

interface WorkFlowDetailsTabProps {
  form: any;
}

const WorkFlowDetailsTab: React.FC<WorkFlowDetailsTabProps> = ({ form }) => {
  const [openLeave, setOpenLeave] = useState(true);

  return (
    <div className="flex gap-5 min-h-[480px]">
      {/* ===== LEFT SIDEBAR ===== */}
      <div className="w-[210px] shrink-0">
        <div className="overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
          {/* Photo */}
          <div className="pt-4 px-4 flex justify-center">
            <div className="h-[188px] w-[158px] overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-[#F5F5F5]">
              {form.photoUrl ? (
                <img
                  src={form.photoUrl}
                  alt={form.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://i.pravatar.cc/300?u=294640"
                  alt="Employee"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Info */}
          <div className="px-4 pt-3 pb-4 text-center">
            <h3 className="text-[13.5px] font-semibold leading-tight tracking-tight text-[#131313]">
              {form.fullName || "BHAGYARAJA AVURAPALLI"}
            </h3>

            <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium">
              {form.empId || "294640"}
            </div>

            <p className="mt-2 text-[11px] leading-[1.35] text-[#626262]">
              {form.designation || "Senior Software Engineer"} |{" "}
              {form.branch || "Koundinyasa Technology Services Pvt. Ltd."}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              DOJ {form.dateOfJoining || "31/Mar/2026"}
            </p>

            <div className="mt-3 space-y-1.5 text-left pl-1">
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Phone size={12} className="text-gray-400 shrink-0" />
                <span>{form.mobile || "9491964186"}</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Mail size={12} className="text-gray-400 shrink-0" />
                <span className="truncate">
                  {form.email || "bhagyaraja.a@koundinyasatech.com"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== RIGHT CONTENT ===== */}
      <div className="flex-1 min-w-0">
        {/* Leave Module Accordion */}
        <div className="overflow-hidden rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_1px_3px_rgba(19,19,19,0.07)]">
          {/* Header */}
          <button
            type="button"
            onClick={() => setOpenLeave((v) => !v)}
            className="w-full flex items-center justify-between px-4 py-[11px] hover:bg-gray-50/60 transition-colors"
          >
            <span className="inline-flex items-center rounded-full bg-[#FFF5EE] px-3 py-[3px] text-[12.5px] font-medium text-[#FF6200]">
              Leave Module
            </span>
            {openLeave ? (
              <ChevronUp size={15} className="text-gray-400" />
            ) : (
              <ChevronDown size={15} className="text-gray-400" />
            )}
          </button>

          {/* Body */}
          {openLeave && (
            <div className="px-4 pb-4">
              <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] px-4 py-3">
                <div className="text-[13px] font-medium text-gray-800 mb-1.5">
                  Leave Apply RA Level 1
                </div>
                <div className="text-[12px] text-gray-500 leading-relaxed flex flex-wrap gap-x-1">
                  <span>SI No : <span className="text-gray-700">1</span></span>
                  <span className="text-gray-300">|</span>
                  <span>Approver : <span className="text-gray-700">Daniel Raju Ravi</span></span>
                  <span className="text-gray-300">|</span>
                  <span>Level : <span className="text-gray-700">1</span></span>
                  <span className="text-gray-300">|</span>
                  <span>Employee Group Name : <span className="text-gray-700">All Employees</span></span>
                  <span className="text-gray-300">|</span>
                  <span>Group Name : <span className="text-gray-700">CL, CO, CW, LOP, OOD, RH, SL</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkFlowDetailsTab;