// import {
//   Save,
//   RotateCcw,
//   ChevronDown,
// } from "lucide-react";

// export interface DefinitionValues {
//   accrualFrequency: string;
//   accrualDaysPerCycle: number | "";
//   creditDay: number | "";

//   prorateOnJoining: boolean;
//   prorateOnExit: boolean;

//   carryForwardAllowed: boolean;
//   carryForwardLimit: number | "";

//   encashmentAllowed: boolean;
//   encashmentLimit: number | "";

//   allowNegativeBalance: boolean;
//   maxNegativeBalance: number | "";

//   isPaidLeave: boolean;
//   isHalfDayAllowed: boolean;

//   probationEligible: boolean;
//   noticePeriodEligible: boolean;
//   sandwichApplicable: boolean;

//   includeHoliday: boolean;
//   includeWeekOff: boolean;

//   documentRequired: boolean;
//   documentAfterDays: number | "";
// }

// interface DefinitionsPanelProps {
//   policyId: number | null;
//   leaveId: number | null;

//   leaveName?: string;
//   policyName?: string;

//   values: DefinitionValues;

//   onChange: (
//     field: keyof DefinitionValues,
//     value: DefinitionValues[keyof DefinitionValues],
//   ) => void;

//   onSave?: () => void;
//   onReset?: () => void;

//   loading?: boolean;
//   saving?: boolean;
// }

// const Toggle = ({
//   checked,
//   onChange,
//   disabled,
// }: {
//   checked: boolean;
//   onChange: (value: boolean) => void;
//   disabled?: boolean;
// }) => {
//   return (
//     <button
//       type="button"
//       role="switch"
//       aria-checked={checked}
//       disabled={disabled}
//       onClick={() => onChange(!checked)}
//       className={[
//         "relative h-[22px] w-[40px] shrink-0 rounded-full",
//         "transition-colors duration-150",
//         checked
//           ? "bg-[#009B57]"
//           : "bg-[#C9D2CD]",
//         "disabled:cursor-not-allowed disabled:opacity-50",
//       ].join(" ")}
//     >
//       <span
//         className={[
//           "absolute top-[3px] h-[16px] w-[16px]",
//           "rounded-full bg-white shadow-sm",
//           "transition-transform duration-150",
//           checked
//             ? "translate-x-[21px]"
//             : "translate-x-[3px]",
//         ].join(" ")}
//       />
//     </button>
//   );
// };

// const FieldLabel = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => (
//   <label className="mb-1.5 block font-[Urbanist] text-[12px] font-medium text-[#4D5752]">
//     {children}
//   </label>
// );

// const NumberInput = ({
//   value,
//   onChange,
//   disabled,
//   placeholder = "0",
// }: {
//   value: number | "";
//   onChange: (value: number | "") => void;
//   disabled?: boolean;
//   placeholder?: string;
// }) => (
//   <input
//     type="number"
//     min={0}
//     step="0.01"
//     value={value}
//     placeholder={placeholder}
//     disabled={disabled}
//     onChange={(event) => {
//       const nextValue = event.target.value;

//       onChange(
//         nextValue === ""
//           ? ""
//           : Number(nextValue),
//       );
//     }}
//     className="
//       h-[38px] w-full
//       rounded-[7px]
//       border border-[#D5DED9]
//       bg-white px-3
//       font-[Urbanist]
//       text-[13px]
//       text-[#303532]
//       outline-none
//       transition
//       placeholder:text-[#A0A8A4]
//       focus:border-[#009B57]
//       focus:ring-2
//       focus:ring-[#009B57]/10
//       disabled:bg-[#F5F7F6]
//     "
//   />
// );

// const RuleRow = ({
//   label,
//   description,
//   checked,
//   onChange,
//   disabled,
// }: {
//   label: string;
//   description?: string;
//   checked: boolean;
//   onChange: (value: boolean) => void;
//   disabled?: boolean;
// }) => (
//   <div
//     className="
//       flex min-h-[52px]
//       items-center justify-between
//       gap-4
//       rounded-[8px]
//       border border-[#E1E8E4]
//       bg-white
//       px-3 py-2.5
//       sm:px-3.5
//     "
//   >
//     <div className="min-w-0">
//       <p className="font-[Urbanist] text-[12px] font-medium text-[#3F4743]">
//         {label}
//       </p>

//       {description && (
//         <p className="mt-0.5 font-[Urbanist] text-[10px] leading-4 text-[#8A938F]">
//           {description}
//         </p>
//       )}
//     </div>

//     <Toggle
//       checked={checked}
//       onChange={onChange}
//       disabled={disabled}
//     />
//   </div>
// );

// export default function DefinitionsPanel({
//   policyId,
//   leaveId,
//   leaveName,
//   policyName,
//   values,
//   onChange,
//   onSave,
//   onReset,
//   loading = false,
//   saving = false,
// }: DefinitionsPanelProps) {
//   const disabled =
//     loading || saving || !policyId || !leaveId;

//   if (!policyId || !leaveId) {
//     return (
//       <section className="flex min-h-[420px] min-w-0 flex-1 items-center justify-center rounded-[10px] border border-[#D9E6DF] bg-white p-6">
//         <div className="max-w-[380px] text-center">
//           <div className="mx-auto flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#EEF9F3]">
//             <span className="font-serif text-[20px] text-[#009B57]">
//               i
//             </span>
//           </div>

//           <h2 className="mt-3 font-serif text-[19px] font-semibold text-[#303532]">
//             Select a Leave Type
//           </h2>

//           <p className="mt-1 font-[Urbanist] text-[13px] leading-5 text-[#7A8580]">
//             Select a policy and leave type to view or
//             configure its definitions.
//           </p>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#D9E6DF] bg-white">
//       {/* =====================================================
//           HEADER
//       ====================================================== */}
//       <div
//         className="
//           flex flex-col gap-3
//           border-b border-[#E4EAE7]
//           px-4 py-3.5
//           sm:px-5
//           md:flex-row
//           md:items-center
//           md:justify-between
//         "
//       >
//         <div className="min-w-0">
//           <p className="font-[Urbanist] text-[11px] text-[#7A8580]">
//             {policyName || "Leave Policy"}
//           </p>

//           <h2 className="truncate font-serif text-[19px] font-semibold text-[#303532] sm:text-[20px]">
//             {leaveName || "Leave Definition"}
//           </h2>

//           <div className="mt-1.5 h-[2px] w-[45px] rounded-full bg-[#009B57]" />
//         </div>

//         <div className="flex shrink-0 items-center gap-2">
//           {onReset && (
//             <button
//               type="button"
//               onClick={onReset}
//               disabled={disabled}
//               className="
//                 flex h-[36px]
//                 items-center justify-center
//                 gap-1.5
//                 rounded-[7px]
//                 border border-[#D5DED9]
//                 bg-white px-3
//                 font-[Urbanist]
//                 text-[12px]
//                 font-medium
//                 text-[#59645F]
//                 transition
//                 hover:border-[#009B57]
//                 hover:text-[#009B57]
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               <RotateCcw
//                 size={14}
//                 strokeWidth={1.8}
//               />

//               <span>Reset</span>
//             </button>
//           )}

//           {onSave && (
//             <button
//               type="button"
//               onClick={onSave}
//               disabled={disabled}
//               className="
//                 flex h-[36px]
//                 items-center justify-center
//                 gap-1.5
//                 rounded-[7px]
//                 bg-[#009B57]
//                 px-3.5
//                 font-[Urbanist]
//                 text-[12px]
//                 font-medium
//                 text-white
//                 transition
//                 hover:bg-[#00854A]
//                 disabled:cursor-not-allowed
//                 disabled:opacity-50
//               "
//             >
//               <Save
//                 size={14}
//                 strokeWidth={1.9}
//               />

//               <span>
//                 {saving ? "Saving..." : "Save"}
//               </span>
//             </button>
//           )}
//         </div>
//       </div>

//       {/* =====================================================
//           BODY
//       ====================================================== */}
//       <div className="min-h-0 flex-1 overflow-y-auto">
//         <div className="space-y-4 p-4 sm:p-5">

//           {/* =================================================
//               QUOTA & ACCRUAL
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <div>
//               <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//                 Quota & Accrual
//               </h3>

//               <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#8A938F]">
//                 Configure how leave is credited to the employee.
//               </p>
//             </div>

//             <div
//               className="
//                 mt-3
//                 grid grid-cols-1
//                 gap-3
//                 sm:grid-cols-2
//                 lg:grid-cols-3
//               "
//             >
//               {/* Accrual Frequency */}
//               <div>
//                 <FieldLabel>
//                   Accrual Frequency
//                 </FieldLabel>

//                 <div className="relative">
//                   <select
//                     value={values.accrualFrequency}
//                     disabled={disabled}
//                     onChange={(event) =>
//                       onChange(
//                         "accrualFrequency",
//                         event.target.value,
//                       )
//                     }
//                     className="
//                       h-[38px] w-full
//                       appearance-none
//                       rounded-[7px]
//                       border border-[#D5DED9]
//                       bg-white
//                       px-3 pr-8
//                       font-[Urbanist]
//                       text-[13px]
//                       text-[#303532]
//                       outline-none
//                       focus:border-[#009B57]
//                       focus:ring-2
//                       focus:ring-[#009B57]/10
//                       disabled:bg-[#F5F7F6]
//                     "
//                   >
//                     <option value="">
//                       Select
//                     </option>
//                     <option value="Daily">
//                       Daily
//                     </option>
//                     <option value="Weekly">
//                       Weekly
//                     </option>
//                     <option value="Monthly">
//                       Monthly
//                     </option>
//                     <option value="Quarterly">
//                       Quarterly
//                     </option>
//                     <option value="Half-Yearly">
//                       Half-Yearly
//                     </option>
//                     <option value="Yearly">
//                       Yearly
//                     </option>
//                   </select>

//                   <ChevronDown
//                     size={14}
//                     className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#7A8580]"
//                   />
//                 </div>
//               </div>

//               {/* Accrual Days */}
//               <div>
//                 <FieldLabel>
//                   Accrual Days Per Cycle
//                 </FieldLabel>

//                 <NumberInput
//                   value={
//                     values.accrualDaysPerCycle
//                   }
//                   disabled={disabled}
//                   onChange={(value) =>
//                     onChange(
//                       "accrualDaysPerCycle",
//                       value,
//                     )
//                   }
//                 />
//               </div>

//               {/* Credit Day */}
//               <div>
//                 <FieldLabel>
//                   Credit Day
//                 </FieldLabel>

//                 <input
//                   type="number"
//                   min={1}
//                   max={31}
//                   value={values.creditDay}
//                   disabled={disabled}
//                   onChange={(event) => {
//                     const value =
//                       event.target.value;

//                     onChange(
//                       "creditDay",
//                       value === ""
//                         ? ""
//                         : Number(value),
//                     );
//                   }}
//                   className="
//                     h-[38px] w-full
//                     rounded-[7px]
//                     border border-[#D5DED9]
//                     bg-white px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     outline-none
//                     focus:border-[#009B57]
//                     focus:ring-2
//                     focus:ring-[#009B57]/10
//                     disabled:bg-[#F5F7F6]
//                   "
//                 />
//               </div>
//             </div>
//           </section>

//           {/* =================================================
//               PRORATING
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//               Prorating
//             </h3>

//             <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
//               <RuleRow
//                 label="Prorate on Joining"
//                 description="Calculate entitlement proportionately when an employee joins."
//                 checked={
//                   values.prorateOnJoining
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "prorateOnJoining",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Prorate on Exit"
//                 description="Calculate entitlement proportionately when an employee exits."
//                 checked={
//                   values.prorateOnExit
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "prorateOnExit",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />
//             </div>
//           </section>

//           {/* =================================================
//               BALANCE & CARRY FORWARD
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//               Balance & Carry Forward
//             </h3>

//             <div className="mt-3 space-y-3">
//               <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[1fr_220px]">
//                 <RuleRow
//                   label="Carry Forward Allowed"
//                   description="Allow unused leave balance to move into the next period."
//                   checked={
//                     values.carryForwardAllowed
//                   }
//                   onChange={(value) =>
//                     onChange(
//                       "carryForwardAllowed",
//                       value,
//                     )
//                   }
//                   disabled={disabled}
//                 />

//                 <div>
//                   <FieldLabel>
//                     Carry Forward Limit
//                   </FieldLabel>

//                   <NumberInput
//                     value={
//                       values.carryForwardLimit
//                     }
//                     disabled={
//                       disabled ||
//                       !values.carryForwardAllowed
//                     }
//                     onChange={(value) =>
//                       onChange(
//                         "carryForwardLimit",
//                         value,
//                       )
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 gap-2.5 lg:grid-cols-[1fr_220px]">
//                 <RuleRow
//                   label="Encashment Allowed"
//                   description="Allow eligible leave balance to be encashed."
//                   checked={
//                     values.encashmentAllowed
//                   }
//                   onChange={(value) =>
//                     onChange(
//                       "encashmentAllowed",
//                       value,
//                     )
//                   }
//                   disabled={disabled}
//                 />

//                 <div>
//                   <FieldLabel>
//                     Encashment Limit
//                   </FieldLabel>

//                   <NumberInput
//                     value={
//                       values.encashmentLimit
//                     }
//                     disabled={
//                       disabled ||
//                       !values.encashmentAllowed
//                     }
//                     onChange={(value) =>
//                       onChange(
//                         "encashmentLimit",
//                         value,
//                       )
//                     }
//                   />
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* =================================================
//               NEGATIVE BALANCE
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//               Negative Balance
//             </h3>

//             <div className="mt-3 grid grid-cols-1 gap-2.5 lg:grid-cols-[1fr_220px]">
//               <RuleRow
//                 label="Allow Negative Balance"
//                 description="Allow an employee to apply leave beyond the available balance."
//                 checked={
//                   values.allowNegativeBalance
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "allowNegativeBalance",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <div>
//                 <FieldLabel>
//                   Max Negative Balance
//                 </FieldLabel>

//                 <NumberInput
//                   value={
//                     values.maxNegativeBalance
//                   }
//                   disabled={
//                     disabled ||
//                     !values.allowNegativeBalance
//                   }
//                   onChange={(value) =>
//                     onChange(
//                       "maxNegativeBalance",
//                       value,
//                     )
//                   }
//                 />
//               </div>
//             </div>
//           </section>

//           {/* =================================================
//               OPERATIONAL RULES
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//               Operational Rules
//             </h3>

//             <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-2">
//               <RuleRow
//                 label="Paid Leave"
//                 checked={
//                   values.isPaidLeave
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "isPaidLeave",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Half Day Allowed"
//                 checked={
//                   values.isHalfDayAllowed
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "isHalfDayAllowed",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Probation Eligible"
//                 checked={
//                   values.probationEligible
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "probationEligible",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Notice Period Eligible"
//                 checked={
//                   values.noticePeriodEligible
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "noticePeriodEligible",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Sandwich Applicable"
//                 checked={
//                   values.sandwichApplicable
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "sandwichApplicable",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Include Holiday"
//                 checked={
//                   values.includeHoliday
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "includeHoliday",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <RuleRow
//                 label="Include Week Off"
//                 checked={
//                   values.includeWeekOff
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "includeWeekOff",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />
//             </div>
//           </section>

//           {/* =================================================
//               DOCUMENT CONTROL
//           ================================================== */}
//           <section
//             className="
//               rounded-[9px]
//               border border-[#E0E8E3]
//               bg-[#F9FCFA]
//               p-3.5
//               sm:p-4
//             "
//           >
//             <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
//               Document Control
//             </h3>

//             <div className="mt-3 grid grid-cols-1 gap-2.5 lg:grid-cols-[1fr_220px]">
//               <RuleRow
//                 label="Document Required"
//                 description="Require supporting documents for this leave type."
//                 checked={
//                   values.documentRequired
//                 }
//                 onChange={(value) =>
//                   onChange(
//                     "documentRequired",
//                     value,
//                   )
//                 }
//                 disabled={disabled}
//               />

//               <div>
//                 <FieldLabel>
//                   Document After Days
//                 </FieldLabel>

//                 <input
//                   type="number"
//                   min={0}
//                   value={
//                     values.documentAfterDays
//                   }
//                   disabled={
//                     disabled ||
//                     !values.documentRequired
//                   }
//                   onChange={(event) => {
//                     const value =
//                       event.target.value;

//                     onChange(
//                       "documentAfterDays",
//                       value === ""
//                         ? ""
//                         : Number(value),
//                     );
//                   }}
//                   className="
//                     h-[38px] w-full
//                     rounded-[7px]
//                     border border-[#D5DED9]
//                     bg-white px-3
//                     font-[Urbanist]
//                     text-[13px]
//                     outline-none
//                     focus:border-[#009B57]
//                     focus:ring-2
//                     focus:ring-[#009B57]/10
//                     disabled:bg-[#F5F7F6]
//                   "
//                 />
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </section>
//   );
// }

export interface DefinitionLeave {
  id: number;
  leaveName: string;
  shortName: string;
  showForSelectedEmployees?: string;
  affectSalary?: boolean;
  allot?: boolean;
  leave?: boolean;
}

interface DefinitionsPanelProps {
  leaves?: DefinitionLeave[];
  loading?: boolean;
  searchValue?: string;
}

export default function DefinitionsPanel({
  leaves = [],
  loading = false,
  searchValue = "",
}: DefinitionsPanelProps) {
  const filteredLeaves = leaves.filter((leave) => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return true;

    return (
      leave.leaveName.toLowerCase().includes(value) ||
      leave.shortName.toLowerCase().includes(value)
    );
  });

  return (
      <section className="mt-3 w-full rounded-[8px] bg-white shadow-[0_1px_5px_rgba(15,23,42,0.08)]">
        {/* =====================================================
            DEFINITIONS CONTENT
        ====================================================== */}
        <div className="w-full">
          {!loading && filteredLeaves.length === 0 ? (
            <div className="flex min-h-[380px] flex-col items-center justify-center px-6">
              <img
                src="/no-data.png"
                alt="No data"
                className="h-[180px] w-[180px] object-contain"
              />
              <p className="mt-3 font-[Urbanist] text-[14px] text-[#667085]">
                No leave definitions found.
              </p>
            </div>
          ) : (
            <>
          {/* TABLE HEADER */}
          <div
            className="
              grid
              grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_180px_180px]
              items-center
              border-b
              border-[#E7EBF0]
              bg-[#F8FAFC]
              px-6
              py-4
              font-[Urbanist]
              text-[13px]
              font-semibold
              text-[#475467]
            "
          >
            <span>Leave Name</span>
            <span>Short Name</span>
            <span className="text-center">
              Active
            </span>
            <span className="text-center">
              Action
            </span>
          </div>

          {/* LOADING */}
          {loading && (
            <div className="flex min-h-[280px] items-center justify-center">
              <span className="font-[Urbanist] text-[14px] text-[#667085]">
                Loading...
              </span>
            </div>
          )}

          {/* DATA */}
          {!loading &&
            filteredLeaves.length > 0 &&
            filteredLeaves.map((leave) => (
              <div
                key={leave.id}
                className="
                  grid
                  grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_180px_180px]
                  items-center
                  border-b
                  border-[#EEF1F4]
                  px-6
                  py-4
                  font-[Urbanist]
                  text-[14px]
                  text-[#344054]
                "
              >
                <span className="font-medium">
                  {leave.leaveName}
                </span>

                <span className="text-[#667085]">
                  {leave.shortName}
                </span>

                <div className="flex justify-center">
                  <span
                    className={`
                      rounded-full
                      px-4
                      py-1
                      text-[12px]
                      font-semibold
                      ${
                        leave.leave !== false
                          ? "bg-[#ECFDF3] text-[#039855]"
                          : "bg-[#F2F4F7] text-[#667085]"
                      }
                    `}
                  >
                    {leave.leave !== false
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    className="
                      rounded-[6px]
                      px-3
                      py-1.5
                      text-[13px]
                      font-medium
                      text-[#269BD7]
                      hover:bg-[#EFF8FF]
                    "
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
            </>
          )}
        </div>
      </section>
  );
}

