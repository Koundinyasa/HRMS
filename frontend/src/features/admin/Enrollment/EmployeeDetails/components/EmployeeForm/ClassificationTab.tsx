// import React, { useState } from "react";
// import { History } from "lucide-react";
// import DateField from "../DateField";
// import AddClassificationModal from "./AddClassificationModal";
// import type { NewClassificationData } from "./AddClassificationModal";
// import EmployeeSummaryCard from "./EmployeeSummaryCard";
// import type { EmployeeSummary } from "./EmployeeSummaryCard";
 
// const inputCls =
//   "border border-gray-300 rounded px-2.5 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] w-full";
// const labelCls = "block text-[12px] text-gray-500 mb-1";
 
// export interface ClassificationForm {
//   effectiveFrom: string;
//   branch: string;
//   salaryStructure: string;
//   leavePolicy: string;
//   attendanceStructure: string;
//   costCenter: string;
//   tnaPolicy: string;
//   designation: string;
//   bank: string;
//   accountNo: string;
//   ifscCode: string;
//   department: string;
//   team: string;
// }
 
// interface ClassificationTabProps {
//   employee: EmployeeSummary;
//   form: ClassificationForm;
//   set: (key: keyof ClassificationForm, value: string) => void;
//   errors: Record<string, string>;
//   onAddClassification: (data: NewClassificationData) => void;
// }
 
// export default function ClassificationTab({
//   employee,
//   form,
//   set,
//   errors,
//   onAddClassification,
// }: ClassificationTabProps) {
//   const [isModalOpen, setIsModalOpen] = useState(false);
 
//   const handleModalSave = (data: NewClassificationData) => {
//     onAddClassification(data);
//     setIsModalOpen(false);
//   };
 
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
//       <EmployeeSummaryCard employee={employee} />
 
//       {/* Right: classification form */}
//       <div>
//         <div className="flex items-center justify-center gap-2 mb-6">
//           <div className="w-[220px]">
//             <DateField
//               label="Effective From"
//               value={form.effectiveFrom}
//               onChange={(v) => set("effectiveFrom", v)}
//               error={errors.effectiveFrom}
//             />
//           </div>
//           <button
//             type="button"
//             title="View history"
//             className="mt-5 p-1.5 text-gray-400 hover:text-[#2196F3] border border-gray-200 rounded-full"
//           >
//             <History size={13} />
//           </button>
//         </div>
 
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
//           {/* Column 1 */}
//           <div>
//             <label className={labelCls}>
//               Branch <span className="text-red-500">*</span>
//             </label>
//             <select
//               className={inputCls}
//               value={form.branch}
//               onChange={(e) => set("branch", e.target.value)}
//             >
//               <option>Koundinyasa Technology Services Pvt...</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>T&amp;A Policy</label>
//             <select
//               className={inputCls}
//               value={form.tnaPolicy}
//               onChange={(e) => set("tnaPolicy", e.target.value)}
//             >
//               <option>General Policy</option>
//               <option>Shift Policy</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>Department</label>
//             <select
//               className={inputCls}
//               value={form.department}
//               onChange={(e) => set("department", e.target.value)}
//             >
//               <option value="">Select Department</option>
//               <option>Engineering</option>
//               <option>HR</option>
//               <option>Sales</option>
//             </select>
//           </div>
 
//           <div>
//             <label className={labelCls}>
//               Salary Structure <span className="text-red-500">*</span>
//             </label>
//             <select
//               className={inputCls}
//               value={form.salaryStructure}
//               onChange={(e) => set("salaryStructure", e.target.value)}
//             >
//               <option>CTC Salary Structure</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>
//               Designation <span className="text-red-500">*</span>
//             </label>
//             <select
//               className={inputCls}
//               value={form.designation}
//               onChange={(e) => set("designation", e.target.value)}
//             >
//               <option>{form.designation || "Select Designation"}</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>Team</label>
//             <select
//               className={inputCls}
//               value={form.team}
//               onChange={(e) => set("team", e.target.value)}
//             >
//               <option value="">Select Team</option>
//             </select>
//           </div>
 
//           <div>
//             <label className={labelCls}>
//               Leave Policy <span className="text-red-500">*</span>
//             </label>
//             <select
//               className={inputCls}
//               value={form.leavePolicy}
//               onChange={(e) => set("leavePolicy", e.target.value)}
//             >
//               <option>Employee Leave Policy</option>
//               <option>Intern Leave Policy</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>Bank</label>
//             <select
//               className={inputCls}
//               value={form.bank}
//               onChange={(e) => set("bank", e.target.value)}
//             >
//               <option>{form.bank || "Select Bank"}</option>
//             </select>
//           </div>
//           <div />
 
//           <div>
//             <label className={labelCls}>
//               Attendance Structure <span className="text-red-500">*</span>
//             </label>
//             <select
//               className={inputCls}
//               value={form.attendanceStructure}
//               onChange={(e) => set("attendanceStructure", e.target.value)}
//             >
//               <option>Daily</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>A/C No.</label>
//             <input
//               className={inputCls}
//               value={form.accountNo}
//               onChange={(e) => set("accountNo", e.target.value)}
//             />
//           </div>
//           <div />
 
//           <div>
//             <label className={labelCls}>Cost Center</label>
//             <select
//               className={inputCls}
//               value={form.costCenter}
//               onChange={(e) => set("costCenter", e.target.value)}
//             >
//               <option value="">Select Cost Center</option>
//             </select>
//           </div>
//           <div>
//             <label className={labelCls}>IFSC Code</label>
//             <input
//               className={inputCls}
//               value={form.ifscCode}
//               onChange={(e) => set("ifscCode", e.target.value)}
//             />
//           </div>
//           <div className="flex items-end justify-end">
//             <button
//               type="button"
//               onClick={() => setIsModalOpen(true)}
//               className="h-[34px] px-4 text-[12px] font-medium text-[#2196F3] border border-[#2196F3] rounded hover:bg-[#E3F2FD]"
//             >
//               Add Classifications
//             </button>
//           </div>
//         </div>
//       </div>
 
//       <AddClassificationModal
//         open={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onSave={handleModalSave}
//       />
//     </div>
//   );
// }
 















import React, { useState } from "react";
import { History } from "lucide-react";
import DateField from "../DateField";
import AddClassificationModal from "./AddClassificationModal";
import type { NewClassificationData } from "./AddClassificationModal";
import EmployeeSummaryCard from "./EmployeeSummaryCard";
import type { EmployeeSummary } from "./EmployeeSummaryCard";
 
const inputCls =
  "border border-[#E2E2E2] rounded-[4px] px-2.5 py-1.5 text-[13px] text-[#131313] bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6200]/20 focus:border-[#FF6200] w-full";
const labelCls = "block text-[12px] text-[#626262] mb-1";
 
export interface ClassificationForm {
  effectiveFrom: string;
  branch: string;
  salaryStructure: string;
  leavePolicy: string;
  attendanceStructure: string;
  costCenter: string;
  tnaPolicy: string;
  designation: string;
  bank: string;
  accountNo: string;
  ifscCode: string;
  department: string;
  team: string;
}
 
interface ClassificationTabProps {
  employee: EmployeeSummary;
  form: ClassificationForm;
  set: (key: keyof ClassificationForm, value: string) => void;
  errors: Record<string, string>;
  onAddClassification: (data: NewClassificationData) => void;
}
 
export default function ClassificationTab({
  employee,
  form,
  set,
  errors,
  onAddClassification,
}: ClassificationTabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
 
  const handleModalSave = (data: NewClassificationData) => {
    onAddClassification(data);
    setIsModalOpen(false);
  };
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
      <EmployeeSummaryCard employee={employee} />
 
      {/* Right: classification form */}
      <div>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-[220px]">
            <DateField
              label="Effective From"
              value={form.effectiveFrom}
              onChange={(v) => set("effectiveFrom", v)}
              error={errors.effectiveFrom}
            />
          </div>
          <button
            type="button"
            title="View history"
            className="mt-5 p-1.5 text-gray-400 hover:text-[#F97316] border border-gray-200 rounded-full"
          >
            <History size={13} />
          </button>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
          {/* Column 1 */}
          <div>
            <label className={labelCls}>
              Branch <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls}
              value={form.branch}
              onChange={(e) => set("branch", e.target.value)}
            >
              <option>Koundinyasa Technology Services Pvt...</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>T&amp;A Policy</label>
            <select
              className={inputCls}
              value={form.tnaPolicy}
              onChange={(e) => set("tnaPolicy", e.target.value)}
            >
              <option>General Policy</option>
              <option>Shift Policy</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Department</label>
            <select
              className={inputCls}
              value={form.department}
              onChange={(e) => set("department", e.target.value)}
            >
              <option value="">Select Department</option>
              <option>Engineering</option>
              <option>HR</option>
              <option>Sales</option>
            </select>
          </div>
 
          <div>
            <label className={labelCls}>
              Salary Structure <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls}
              value={form.salaryStructure}
              onChange={(e) => set("salaryStructure", e.target.value)}
            >
              <option>CTC Salary Structure</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls}
              value={form.designation}
              onChange={(e) => set("designation", e.target.value)}
            >
              <option>{form.designation || "Select Designation"}</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Team</label>
            <select
              className={inputCls}
              value={form.team}
              onChange={(e) => set("team", e.target.value)}
            >
              <option value="">Select Team</option>
            </select>
          </div>
 
          <div>
            <label className={labelCls}>
              Leave Policy <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls}
              value={form.leavePolicy}
              onChange={(e) => set("leavePolicy", e.target.value)}
            >
              <option>Employee Leave Policy</option>
              <option>Intern Leave Policy</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Bank</label>
            <select
              className={inputCls}
              value={form.bank}
              onChange={(e) => set("bank", e.target.value)}
            >
              <option>{form.bank || "Select Bank"}</option>
            </select>
          </div>
          <div />
 
          <div>
            <label className={labelCls}>
              Attendance Structure <span className="text-red-500">*</span>
            </label>
            <select
              className={inputCls}
              value={form.attendanceStructure}
              onChange={(e) => set("attendanceStructure", e.target.value)}
            >
              <option>Daily</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>A/C No.</label>
            <input
              className={inputCls}
              value={form.accountNo}
              onChange={(e) => set("accountNo", e.target.value)}
            />
          </div>
          <div />
 
          <div>
            <label className={labelCls}>Cost Center</label>
            <select
              className={inputCls}
              value={form.costCenter}
              onChange={(e) => set("costCenter", e.target.value)}
            >
              <option value="">Select Cost Center</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>IFSC Code</label>
            <input
              className={inputCls}
              value={form.ifscCode}
              onChange={(e) => set("ifscCode", e.target.value)}
            />
          </div>
          <div className="flex items-end justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="h-[34px] px-4 text-[12px] font-medium text-[#F97316] border border-[#F97316] rounded hover:bg-[#E3F2FD]"
            >
              Add Classifications
            </button>
          </div>
        </div>
      </div>
 
      <AddClassificationModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleModalSave}
      />
    </div>
  );
}