// import React from "react";
// import { Pencil } from "lucide-react";
// import DateField, { parseDDMMYYYY } from "../DateField";
 
// const inputCls =
//   "border border-gray-300 rounded px-2.5 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] w-full";
 
// /** Used for auto-populated / readonly-style fields (Employee ID, Full Name, Reporting Authority) */
// const highlightInputCls =
//   "border border-gray-300 rounded px-2.5 py-1.5 text-[13px] bg-[#FAF6EC] focus:outline-none focus:ring-1 focus:ring-[#90CAF9] focus:border-[#2196F3] w-full";
 
// const labelCls = "block text-[12px] text-gray-500 mb-1";
// const errorTextCls = "text-[11px] text-red-500 mt-1";
// const errorBorderCls = "border-red-400 focus:border-red-500 focus:ring-red-200";
 
// export interface GeneralForm {
//   empId: string;
//   title: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   fullName: string;
//   gender: string;
//   fatherName: string;
//   maritalStatus: string;
//   spouseName: string;
//   dateOfJoining: string;
//   dateOfSalary: string;
//   probationPeriod: string;
//   confirmationDate: string;
//   reportingAuthority: string;
// }
 
// interface GeneralTabProps {
//   form: GeneralForm;
//   set: (key: keyof GeneralForm, value: string) => void;
//   errors: Record<string, string>;
// }
 
// export default function GeneralTab({ form, set, errors }: GeneralTabProps) {
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_200px] gap-x-8 gap-y-4 max-w-5xl">
//       {/* Column 1 */}
//       <div>
//         <label className={labelCls}>Employee ID</label>
//         <input className={highlightInputCls} value={form.empId} readOnly disabled />
//       </div>
 
//       {/* Column 2 */}
//       <div>
//         <label className={labelCls}>Father Name</label>
//         <input
//           className={inputCls}
//           value={form.fatherName}
//           onChange={(e) => set("fatherName", e.target.value)}
//         />
//       </div>
 
//       {/* Column 3 (spans photo rows) */}
//       <div className="row-span-3">
//         <div className="text-[12px] text-gray-500 mb-1.5">EMP Photo 1</div>
//         <div className="w-[140px] h-[160px] border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center overflow-hidden relative">
//           <div className="text-center text-gray-400 text-[12px] px-2">
//             <div className="w-14 h-14 rounded-full bg-gray-200 mx-auto mb-2" />
//             No photo
//           </div>
//           <button
//             type="button"
//             className="absolute top-1 right-1.5 text-[10px] text-red-500 hover:underline"
//           >
//             remove
//           </button>
//         </div>
//       </div>
 
//       <div className="grid grid-cols-[80px_1fr] gap-3">
//         <div>
//           <label className={labelCls}>
//             Title <span className="text-red-500">*</span>
//           </label>
//           <select
//             className={inputCls}
//             value={form.title}
//             onChange={(e) => set("title", e.target.value)}
//           >
//             <option>Mr.</option>
//             <option>Ms.</option>
//             <option>Mrs.</option>
//             <option>Dr.</option>
//           </select>
//         </div>
//         <div>
//           <label className={labelCls}>
//             First Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             className={`${inputCls} ${errors.firstName ? errorBorderCls : ""}`}
//             value={form.firstName}
//             onChange={(e) => set("firstName", e.target.value)}
//           />
//           {errors.firstName && <p className={errorTextCls}>{errors.firstName}</p>}
//         </div>
//       </div>
 
//       <div>
//         <label className={labelCls}>
//           Marital Status <span className="text-red-500">*</span>
//         </label>
//         <select
//           className={`${inputCls} ${errors.maritalStatus ? errorBorderCls : ""}`}
//           value={form.maritalStatus}
//           onChange={(e) => set("maritalStatus", e.target.value)}
//         >
//           <option>Single</option>
//           <option>Married</option>
//           <option>Divorced</option>
//           <option>Widowed</option>
//         </select>
//         {errors.maritalStatus && <p className={errorTextCls}>{errors.maritalStatus}</p>}
//       </div>
 
//       <div>
//         <label className={labelCls}>Middle Name</label>
//         <input
//           className={inputCls}
//           value={form.middleName}
//           onChange={(e) => set("middleName", e.target.value)}
//         />
//       </div>
 
//       <div>
//         <label className={labelCls}>
//           Spouse Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           className={`${inputCls} ${errors.spouseName ? errorBorderCls : ""}`}
//           value={form.spouseName}
//           onChange={(e) => set("spouseName", e.target.value)}
//         />
//         {errors.spouseName && <p className={errorTextCls}>{errors.spouseName}</p>}
//       </div>
 
//       <div>
//         <label className={labelCls}>
//           Last Name <span className="text-red-500">*</span>
//         </label>
//         <input
//           className={`${inputCls} ${errors.lastName ? errorBorderCls : ""}`}
//           value={form.lastName}
//           onChange={(e) => set("lastName", e.target.value)}
//         />
//         {errors.lastName && <p className={errorTextCls}>{errors.lastName}</p>}
//       </div>
 
//       <DateField
//         label="Date of Joining"
//         required
//         value={form.dateOfJoining}
//         onChange={(v) => set("dateOfJoining", v)}
//         error={errors.dateOfJoining}
//         maxDate={new Date()}
//       />
 
//       <DateField
//         label="Confirmation date"
//         value={form.confirmationDate}
//         onChange={(v) => set("confirmationDate", v)}
//         error={errors.confirmationDate}
//         minDate={parseDDMMYYYY(form.dateOfJoining) || undefined}
//       />
 
//       <div>
//         <label className={labelCls}>Full Name</label>
//         <input
//           className={highlightInputCls}
//           value={form.fullName}
//           onChange={(e) => set("fullName", e.target.value)}
//         />
//       </div>
 
//       <DateField
//         label="Date of Salary"
//         required
//         value={form.dateOfSalary}
//         onChange={(v) => set("dateOfSalary", v)}
//         error={errors.dateOfSalary}
//         minDate={parseDDMMYYYY(form.dateOfJoining) || undefined}
//       />
 
//       <div>
//         <label className={labelCls}>Reporting Authority</label>
//         <div className="relative">
//           <input
//             className={`${highlightInputCls} pr-7`}
//             value={form.reportingAuthority}
//             onChange={(e) => set("reportingAuthority", e.target.value)}
//           />
//           <Pencil size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
//         </div>
//       </div>
 
//       <div>
//         <label className={labelCls}>
//           Gender <span className="text-red-500">*</span>
//         </label>
//         <select
//           className={`${inputCls} ${errors.gender ? errorBorderCls : ""}`}
//           value={form.gender}
//           onChange={(e) => set("gender", e.target.value)}
//         >
//           <option>Male</option>
//           <option>Female</option>
//           <option>Other</option>
//         </select>
//         {errors.gender && <p className={errorTextCls}>{errors.gender}</p>}
//       </div>
 
//       <div>
//         <label className={labelCls}>Probation Period (in days)</label>
//         <input
//           className={inputCls}
//           value={form.probationPeriod}
//           onChange={(e) => set("probationPeriod", e.target.value)}
//         />
//       </div>
 
//       <div>
//         <label className={labelCls}>Notes</label>
//         <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="Notes..." />
//       </div>
//     </div>
//   );
// }
 















import React from "react";
import { Pencil } from "lucide-react";
import DateField, { parseDDMMYYYY } from "../DateField";
 
const inputCls =
  "border border-[#E2E2E2] rounded-[4px] px-2.5 py-1.5 text-[13px] text-[#131313] bg-white focus:outline-none focus:ring-1 focus:ring-[#FF6200]/20 focus:border-[#FF6200] w-full";
 
/** Used for auto-populated / readonly-style fields (Employee ID, Full Name, Reporting Authority) */
const highlightInputCls =
  "border border-[#E2E2E2] rounded-[4px] px-2.5 py-1.5 text-[13px] text-[#131313] bg-[#FFF5EE] focus:outline-none focus:ring-1 focus:ring-[#FF6200]/20 focus:border-[#FF6200] w-full";
 
const labelCls = "block text-[12px] text-gray-500 mb-1";
const errorTextCls = "text-[11px] text-red-500 mt-1";
const errorBorderCls = "border-red-400 focus:border-red-500 focus:ring-red-200";
 
export interface GeneralForm {
  empId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: string;
  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  dateOfJoining: string;
  dateOfSalary: string;
  probationPeriod: string;
  confirmationDate: string;
  reportingAuthority: string;
}
 
interface GeneralTabProps {
  form: GeneralForm;
  set: (key: keyof GeneralForm, value: string) => void;
  errors: Record<string, string>;
}
 
export default function GeneralTab({ form, set, errors }: GeneralTabProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_200px] gap-x-8 gap-y-4 max-w-5xl">
      {/* Column 1 */}
      <div>
        <label className={labelCls}>Employee ID</label>
        <input className={highlightInputCls} value={form.empId} readOnly disabled />
      </div>
 
      {/* Column 2 */}
      <div>
        <label className={labelCls}>Father Name</label>
        <input
          className={inputCls}
          value={form.fatherName}
          onChange={(e) => set("fatherName", e.target.value)}
        />
      </div>
 
      {/* Column 3 (spans photo rows) */}
      <div className="row-span-3">
        <div className="text-[12px] text-gray-500 mb-1.5">EMP Photo 1</div>
        <div className="w-[140px] h-[160px] border border-dashed border-gray-300 rounded bg-gray-50 flex items-center justify-center overflow-hidden relative">
          <div className="text-center text-gray-400 text-[12px] px-2">
            <div className="w-14 h-14 rounded-full bg-gray-200 mx-auto mb-2" />
            No photo
          </div>
          <button
            type="button"
            className="absolute top-1 right-1.5 text-[10px] text-red-500 hover:underline"
          >
            remove
          </button>
        </div>
      </div>
 
      <div className="grid grid-cols-[80px_1fr] gap-3">
        <div>
          <label className={labelCls}>
            Title <span className="text-red-500">*</span>
          </label>
          <select
            className={inputCls}
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
          >
            <option>Mr.</option>
            <option>Ms.</option>
            <option>Mrs.</option>
            <option>Dr.</option>
          </select>
        </div>
        <div>
          <label className={labelCls}>
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            className={`${inputCls} ${errors.firstName ? errorBorderCls : ""}`}
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
          />
          {errors.firstName && <p className={errorTextCls}>{errors.firstName}</p>}
        </div>
      </div>
 
      <div>
        <label className={labelCls}>
          Marital Status <span className="text-red-500">*</span>
        </label>
        <select
          className={`${inputCls} ${errors.maritalStatus ? errorBorderCls : ""}`}
          value={form.maritalStatus}
          onChange={(e) => set("maritalStatus", e.target.value)}
        >
          <option>Single</option>
          <option>Married</option>
          <option>Divorced</option>
          <option>Widowed</option>
        </select>
        {errors.maritalStatus && <p className={errorTextCls}>{errors.maritalStatus}</p>}
      </div>
 
      <div>
        <label className={labelCls}>Middle Name</label>
        <input
          className={inputCls}
          value={form.middleName}
          onChange={(e) => set("middleName", e.target.value)}
        />
      </div>
 
      <div>
        <label className={labelCls}>
          Spouse Name <span className="text-red-500">*</span>
        </label>
        <input
          className={`${inputCls} ${errors.spouseName ? errorBorderCls : ""}`}
          value={form.spouseName}
          onChange={(e) => set("spouseName", e.target.value)}
        />
        {errors.spouseName && <p className={errorTextCls}>{errors.spouseName}</p>}
      </div>
 
      <div>
        <label className={labelCls}>
          Last Name <span className="text-red-500">*</span>
        </label>
        <input
          className={`${inputCls} ${errors.lastName ? errorBorderCls : ""}`}
          value={form.lastName}
          onChange={(e) => set("lastName", e.target.value)}
        />
        {errors.lastName && <p className={errorTextCls}>{errors.lastName}</p>}
      </div>
 
      <DateField
        label="Date of Joining"
        required
        value={form.dateOfJoining}
        onChange={(v) => set("dateOfJoining", v)}
        error={errors.dateOfJoining}
        maxDate={new Date()}
      />
 
      <DateField
        label="Confirmation date"
        value={form.confirmationDate}
        onChange={(v) => set("confirmationDate", v)}
        error={errors.confirmationDate}
        minDate={parseDDMMYYYY(form.dateOfJoining) || undefined}
      />
 
      <div>
        <label className={labelCls}>Full Name</label>
        <input
          className={highlightInputCls}
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
      </div>
 
      <DateField
        label="Date of Salary"
        required
        value={form.dateOfSalary}
        onChange={(v) => set("dateOfSalary", v)}
        error={errors.dateOfSalary}
        minDate={parseDDMMYYYY(form.dateOfJoining) || undefined}
      />
 
      <div>
        <label className={labelCls}>Reporting Authority</label>
        <div className="relative">
          <input
            className={`${highlightInputCls} pr-7`}
            value={form.reportingAuthority}
            onChange={(e) => set("reportingAuthority", e.target.value)}
          />
          <Pencil size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>
 
      <div>
        <label className={labelCls}>
          Gender <span className="text-red-500">*</span>
        </label>
        <select
          className={`${inputCls} ${errors.gender ? errorBorderCls : ""}`}
          value={form.gender}
          onChange={(e) => set("gender", e.target.value)}
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        {errors.gender && <p className={errorTextCls}>{errors.gender}</p>}
      </div>
 
      <div>
        <label className={labelCls}>Probation Period (in days)</label>
        <input
          className={inputCls}
          value={form.probationPeriod}
          onChange={(e) => set("probationPeriod", e.target.value)}
        />
      </div>
 
      <div>
        <label className={labelCls}>Notes</label>
        <textarea className={`${inputCls} min-h-[70px] resize-y`} placeholder="Notes..." />
      </div>
    </div>
  );
}