// import {
//   useCallback,
//   useEffect,
//   useMemo,
//   useRef,
//   useState,
//   type ChangeEvent,
//   type FormEvent,
//   type HTMLAttributes,
//   type MouseEvent,
//   type ReactNode,
// } from "react";
// import DatePicker2, { type DatePicker2Cell as DatePickerCell } from "@/components/ui/datepicker2";
// import { buildPayload } from "../api/api";
// import { SAMPLE_MASTER_DATA } from "../constants/masterData";
// import { RefreshCw } from "lucide-react";
// import type {
//   CreateEmployeePayload,
//   CreateEmployeeResult,
//   EmployeeFormValues,
//   ErrorKey,
//   FieldName,
//   MasterData,
//   Option,
// } from "../types/types";
// import { EMPTY_VALUES, FIELD_NAMES, RULES, generateEmployeeCode, todayISO, validateAll, validateField } from "../validation/validation";
 
// /* =====================================================================
//    Config
//    ===================================================================== */
 
// interface SectionConfig {
//   id: string;
//   title: string;
//   lead: string;
//   fields: ErrorKey[];
// }
 
// const SECTIONS: SectionConfig[] = [
//   {
//     id: "sec-personal",
//     title: "Personal details",
//     lead: "Basic identity information as it appears on official documents.",
//     fields: ["EmployeeID", "Code", "FirstName", "LastName", "DOB", "GenderID", "MaritalStatusID", "ProfilePhoto"],
//   },
//   {
//     id: "sec-job",
//     title: "Job and organisation",
//     lead: "Where the employee sits in the company and how they're employed.",
//     fields: [
//       "CompanyID", "BranchID", "DeptID", "DesignationID", "RoleID", "ReportingManagerID",
//       "Grade", "EmploymentTypeID", "EmploymentStatusID", "DOJ",
//     ],
//   },
//   {
//     id: "sec-contact",
//     title: "Contact",
//     lead: "The work email is also used to sign in unless you set a separate user ID.",
//     fields: ["Email", "AlternateEmailId", "Mobileno", "AltMobileNo", "EmergencyNo"],
//   },
//   {
//     id: "sec-statutory",
//     title: "Statutory IDs",
//     lead: "Needed for payroll, PF and tax filing. These can be added later.",
//     fields: ["AadhaarNumber", "PANNumber", "UANNumber", "PFNumber"],
//   },
//   {
//     id: "sec-login",
//     title: "Login access",
//     lead: "A first-time login is created automatically from the work email (or the user ID below).",
//     fields: ["UserID"],
//   },
// ];
 
// /** Order used to focus the first invalid field on submit */
// const FIELD_ORDER: ErrorKey[] = SECTIONS.flatMap(s => s.fields);
 
// const DIGIT_FIELDS: ReadonlySet<FieldName> = new Set(["Mobileno", "AltMobileNo", "EmergencyNo", "AadhaarNumber", "UANNumber"]);
// const UPPER_FIELDS: ReadonlySet<FieldName> = new Set(["PANNumber", "PFNumber"]);
 
// /** Every dropdown shows the same placeholder — the TL asked for plain "Select" everywhere */
// const SELECT_PLACEHOLDER = "Select";
 
// /* =====================================================================
//    Small helpers
//    ===================================================================== */
 
// const nameOf = (options: ReadonlyArray<Option<string | number>>, id: string): string =>
//   options.find(o => String(o.id) === id)?.name ?? "";
 
// const formatDate = (iso: string): string =>
//   iso
//     ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
//     : "";
 
// const describedBy = (name: string, hint?: string, error?: string): string | undefined =>
//   [hint && `${name}-hint`, error && `${name}-err`].filter(Boolean).join(" ") || undefined;
 
// /* ---- Date <-> text conversion for the DatePicker (display: dd-mm-yyyy, stored: ISO yyyy-mm-dd) ---- */
 
// const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
// const MONTH_NAMES = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December",
// ];
 
// const pad2 = (n: number): string => String(n).padStart(2, "0");
 
// const isoToDmy = (iso: string): string => {
//   const [y, m, d] = iso.split("-");
//   return y && m && d ? `${d}-${m}-${y}` : "";
// };
 
// /** Accepts dd-mm-yyyy or dd/mm/yyyy; returns null if the text isn't a full, valid date yet */
// const dmyToIso = (raw: string): string | null => {
//   const match = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(raw.trim());
//   if (!match) return null;
//   const d = Number(match[1]);
//   const m = Number(match[2]);
//   const y = Number(match[3]);
//   if (m < 1 || m > 12) return null;
//   if (d < 1 || d > new Date(y, m, 0).getDate()) return null;
//   return `${y}-${pad2(m)}-${pad2(d)}`;
// };
 
// function buildMonthCells(viewYear: number, viewMonth: number, selectedIso: string, minIso?: string, maxIso?: string): DatePickerCell[] {
//   const firstOfMonth = new Date(viewYear, viewMonth - 1, 1);
//   const gridStart = new Date(viewYear, viewMonth - 1, 1 - firstOfMonth.getDay());
//   return Array.from({ length: 42 }, (_, i) => {
//     const d = new Date(gridStart);
//     d.setDate(gridStart.getDate() + i);
//     const iso = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
//     return {
//       iso,
//       day: d.getDate(),
//       inMonth: d.getMonth() + 1 === viewMonth && d.getFullYear() === viewYear,
//       disabled: (!!minIso && iso < minIso) || (!!maxIso && iso > maxIso),
//       selected: iso === selectedIso,
//     };
//   });
// }
 
// /* =====================================================================
//    Field components
//    ===================================================================== */
 
// interface FieldShellProps {
//   /** Widened to string so it also covers derived, non-form fields like the Full Name readout */
//   name: string;
//   label: string;
//   required?: boolean;
//   hint?: string;
//   error?: string;
//   full?: boolean;
//   children: ReactNode;
// }
 
// function FieldShell({ name, label, required, hint, error, full, children }: FieldShellProps) {
//   return (
//     <div className={`flex min-w-0 flex-col gap-1.5${full ? " sm:col-span-2" : ""}`}>
//       <label htmlFor={name} className="text-[13px] font-semibold text-[#1B2230]">
//         {label}
//         {required && <span className="ml-0.5 text-[#B42318]" aria-hidden="true">*</span>}
//       </label>
//       {children}
//       {hint && <p className="m-0 text-xs text-[#5A6376]" id={`${name}-hint`}>{hint}</p>}
//       {error && <p className="m-0 text-xs text-[#B42318]" id={`${name}-err`}>{error}</p>}
//     </div>
//   );
// }
 
// interface BoundProps {
//   name: FieldName;
//   value: string;
//   error?: string;
//   onChange: (name: FieldName, value: string) => void;
//   onBlur: (name: ErrorKey) => void;
// }
 
// interface TextFieldProps extends BoundProps {
//   type?: "text" | "email" | "tel" | "date";
//   placeholder?: string;
//   maxLength?: number;
//   inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
//   autoComplete?: string;
//   max?: string;
//   hint?: string;
//   full?: boolean;
// }
 
// function TextField({
//   name, value, error, onChange, onBlur, type = "text", hint, full, autoComplete = "off", ...rest
// }: TextFieldProps) {
//   const rule = RULES[name];
//   return (
//     <FieldShell name={name} label={rule.label} required={rule.required} hint={hint} error={error} full={full}>
//       <input
//         {...rest}
//         id={name}
//         name={name}
//         type={type}
//         value={value}
//         autoComplete={autoComplete}
//         className={`w-full min-h-11 rounded-md border bg-white px-3 py-2.5 text-[#1B2230] outline-none focus:border-[var(--theme-primary,#1F5C7A)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#1F5C7A)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 ${error ? "border-[#B42318]" : "border-[#D3D9E2]"}`}
//         onChange={e => onChange(name, e.target.value)}
//         onBlur={() => onBlur(name)}
//         aria-invalid={!!error}
//         aria-describedby={describedBy(name, hint, error)}
//       />
//     </FieldShell>
//   );
// }
 
// interface SelectFieldProps extends BoundProps {
//   options: ReadonlyArray<Option<string | number>>;
//   /** Optional override; defaults to the plain "Select" placeholder used everywhere else */
//   placeholder?: string;
//   disabled?: boolean;
//   hint?: string;
// }
 
// function SelectField({ name, value, error, onChange, onBlur, options, placeholder = SELECT_PLACEHOLDER, disabled, hint }: SelectFieldProps) {
//   const rule = RULES[name];
//   const [open, setOpen] = useState(false);
//   const rootRef = useRef<HTMLDivElement>(null);
//   const selectedLabel = options.find(o => String(o.id) === String(value))?.name ?? "";
 
//   useEffect(() => {
//     if (!open) return;
//     const onDoc = (e: Event) => {
//       if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
//     };
//     document.addEventListener("mousedown", onDoc);
//     return () => document.removeEventListener("mousedown", onDoc);
//   }, [open]);
 
//   useEffect(() => {
//     if (!open) return;
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === "Escape") setOpen(false);
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, [open]);
 
//   return (
//     <FieldShell name={name} label={rule.label} required={rule.required} hint={hint} error={error}>
//       <div ref={rootRef} className="relative">
//         <button
//           type="button"
//           id={name}
//           disabled={disabled}
//           aria-haspopup="listbox"
//           aria-expanded={open}
//           aria-invalid={!!error}
//           aria-describedby={describedBy(name, hint, error)}
//           onClick={() => { if (!disabled) setOpen(v => !v); }}
//           onBlur={() => onBlur(name)}
//           className={`flex w-full min-h-11 items-center justify-between rounded-md border bg-white px-3 py-2.5 text-left text-[#1B2230] outline-none focus:border-[var(--theme-primary,#2563EB)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#2563EB)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 ${error ? "border-[#B42318]" : "border-[#D3D9E2]"}`}
//         >
//           <span className={selectedLabel ? "truncate" : "truncate text-[#5A6376]"}>
//             {selectedLabel || placeholder}
//           </span>
//           <svg className={`ml-2 h-4 w-4 shrink-0 text-[#5A6376] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
//             <path d="m6 9 6 6 6-6" />
//           </svg>
//         </button>
//         {open && !disabled && (
//           <ul role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[10.5rem] overflow-y-auto rounded-md border border-[#D3D9E2] bg-white py-1 shadow-lg">
//             {options.length === 0 ? (
//               <li className="px-3 py-2 text-sm text-[#5A6376]">No options</li>
//             ) : (
//               options.map(o => {
//                 const selected = String(o.id) === String(value);
//                 return (
//                   <li key={String(o.id)} role="option" aria-selected={selected}>
//                     <button
//                       type="button"
//                       className={`flex w-full px-3 py-2 text-left text-sm hover:bg-[#F4F8FE] ${selected ? "bg-[var(--theme-light,#DBEAFE)] font-medium text-[var(--theme-primary,#2563EB)]" : "text-[#1B2230]"}`}
//                       onMouseDown={e => e.preventDefault()}
//                       onClick={() => { onChange(name, String(o.id)); onBlur(name); setOpen(false); }}
//                     >
//                       {o.name}
//                     </button>
//                   </li>
//                 );
//               })
//             )}
//           </ul>
//         )}
//       </div>
//     </FieldShell>
//   );
// }
 
// /** DOB / DOJ / DOL — wraps the TL's DatePicker (frontend/src/components/ui/datepicker.tsx).
//  *  Owns its own text + calendar-month state; commits a plain ISO string (yyyy-mm-dd)
//  *  up to the form on every valid selection, same as the old <input type="date"> did. */
// interface DateFieldControlProps {
//   name: FieldName;
//   value: string;
//   onCommit: (iso: string) => void;
//   onFieldBlur: () => void;
//   error?: string;
//   hint?: string;
//   /** Optional bounds — dates outside these are shown disabled in the calendar grid */
//   minIso?: string;
//   maxIso?: string;
//   full?: boolean;
// }
 
// function DateFieldControl({ name, value, onCommit, onFieldBlur, error, hint, minIso, maxIso, full }: DateFieldControlProps) {
//   const rule = RULES[name];
//   const [open, setOpen] = useState(false);
//   const [text, setText] = useState(() => isoToDmy(value));
//   const [formatError, setFormatError] = useState<string | undefined>(undefined);
//   const seed = value ? new Date(`${value}T00:00:00`) : new Date();
//   const [viewYear, setViewYear] = useState(seed.getFullYear());
//   const [viewMonth, setViewMonth] = useState(seed.getMonth() + 1);
 
//   // Keep local text/view month in sync when the value changes from outside (reset, clear, prefill)
//   useEffect(() => {
//     setText(isoToDmy(value));
//     if (value) {
//       const d = new Date(`${value}T00:00:00`);
//       setViewYear(d.getFullYear());
//       setViewMonth(d.getMonth() + 1);
//     }
//   }, [value]);
 
//   const gotoIso = (iso: string) => {
//     const d = new Date(`${iso}T00:00:00`);
//     setViewYear(d.getFullYear());
//     setViewMonth(d.getMonth() + 1);
//   };
 
//   const handleTextChange = (raw: string) => {
//     setText(raw);
//     if (!raw.trim()) {
//       setFormatError(undefined);
//       onCommit("");
//       return;
//     }
//     const iso = dmyToIso(raw);
//     if (iso) {
//       setFormatError(undefined);
//       onCommit(iso);
//       gotoIso(iso);
//     }
//     // Partial/invalid input: let them keep typing — checked properly on blur.
//   };
 
//   const handleBlur = () => {
//     setFormatError(text.trim() && !dmyToIso(text) ? "Enter a date as dd-mm-yyyy." : undefined);
//     onFieldBlur();
//   };
 
//   const handleSelectDay = (iso: string) => {
//     setText(isoToDmy(iso));
//     setFormatError(undefined);
//     onCommit(iso);
//     setOpen(false);
//     onFieldBlur();
//   };
 
//   const handleClear = () => {
//     setText("");
//     setFormatError(undefined);
//     onCommit("");
//   };
 
//   const handleToday = () => {
//     const t = todayISO();
//     setText(isoToDmy(t));
//     setFormatError(undefined);
//     onCommit(t);
//     gotoIso(t);
//     setOpen(false);
//   };
 
//   const shiftMonth = (delta: number) => {
//     const d = new Date(viewYear, viewMonth - 1 + delta, 1);
//     setViewYear(d.getFullYear());
//     setViewMonth(d.getMonth() + 1);
//   };
 
//   const cells = useMemo(
//     () => buildMonthCells(viewYear, viewMonth, value, minIso, maxIso),
//     [viewYear, viewMonth, value, minIso, maxIso],
//   );
 
//   return (
//     <FieldShell name={name} label={rule.label} required={rule.required} hint={hint} error={formatError || error} full={full}>
//       <DatePicker2
//         id={name}
//         text={text}
//         onTextChange={handleTextChange}
//         onBlur={handleBlur}
//         isInvalid={!!(formatError || error)}
//         open={open}
//         onOpenChange={setOpen}
//         monthLabel={`${MONTH_NAMES[viewMonth - 1]} ${viewYear}`}
//         weekdayLabels={WEEKDAY_LABELS}
//         cells={cells}
//         onSelectDay={handleSelectDay}
//         onPrevMonth={() => shiftMonth(-1)}
//         onNextMonth={() => shiftMonth(1)}
//         onClear={handleClear}
//         onToday={handleToday}
//         viewYear={viewYear}
//         viewMonth={viewMonth}
//         onViewChange={(y, m) => {
//           setViewYear(y);
//           setViewMonth(m);
//         }}
//       />
//     </FieldShell>
//   );
// }
 
// function Section({ config, children }: { config: SectionConfig; children: ReactNode }) {
//   return (
//     <section className="mb-5 scroll-mt-6 rounded-[14px] border border-[#D3D9E2] bg-white p-[22px_24px_24px]" id={config.id}>
//       <h2 className="m-0 mb-1 text-lg font-bold">{config.title}</h2>
//       <p className="mb-[18px] mt-0 text-sm text-[#5A6376]">{config.lead}</p>
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5">{children}</div>
//     </section>
//   );
// }
 
// /* =====================================================================
//    Sidebar: live ID card + progress
//    ===================================================================== */
 
// interface IdCardProps {
//   firstName: string;
//   lastName: string;
//   designation: string;
//   employeeId: string;
//   department: string;
//   branch: string;
//   grade: string;
//   joined: string;
//   photoUrl: string | null;
// }
 
// function IdCard(p: IdCardProps) {
//   const fullName = [p.firstName, p.lastName].filter(Boolean).join(" ");
//   const initials = `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase() || "?";
//   return (
//     <div className="relative flex-none overflow-visible rounded-2xl border border-[#D3D9E2] bg-white text-center shadow-sm" aria-live="polite">
//       <div className="relative h-[72px] rounded-t-2xl bg-[var(--theme-primary,#1F5C7A)]"><span className="absolute left-1/2 top-3 h-[5px] w-9 -translate-x-1/2 rounded-[3px] bg-white/40" /></div>
//       <div className="relative z-[2] mx-auto mt-[-40px] mb-3 grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-[var(--theme-light,#E1EDF3)] text-[26px] font-bold text-[var(--theme-primary,#1F5C7A)] shadow">
//         {p.photoUrl ? <img src={p.photoUrl} alt={`Profile photo of ${fullName || "new employee"}`} /> : initials}
//       </div>
//       <div>
//         <p className="mx-4 mb-1 overflow-wrap-anywhere text-lg font-bold text-[#1B2230]">{fullName || "New employee"}</p>
//         <p className="mx-4 mb-3.5 text-[13px] text-[#5A6376]">{p.designation || "Designation not set"}</p>
//       </div>
//       <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-dashed border-[#D3D9E2] px-[18px] py-3.5 text-left text-[13px]">
//         <dt className="m-0 font-medium text-[#5A6376]">Employee ID</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.employeeId || "—"}</dd>
//         <dt className="m-0 font-medium text-[#5A6376]">Department</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.department || "—"}</dd>
//         <dt className="m-0 font-medium text-[#5A6376]">Branch</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.branch || "—"}</dd>
//         <dt className="m-0 font-medium text-[#5A6376]">Grade</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.grade || "—"}</dd>
//         <dt className="m-0 font-medium text-[#5A6376]">Joined</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.joined || "—"}</dd>
//       </dl>
//     </div>
//   );
// }
 
// /** Fields whose availability is checked against the server, beyond format rules */
// type CheckedField = "EmployeeID" | "Email";
// const CHECKED_FIELDS: CheckedField[] = ["EmployeeID", "Email"];
 
// function scrollToSection(e: MouseEvent<HTMLAnchorElement>, id: string) {
//   e.preventDefault();
//   const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//   document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
// }
 
// function Progress({ items }: { items: { id: string; title: string; state: string }[] }) {
//   return (
//     <nav className="flex-none rounded-2xl border border-[#D3D9E2] bg-white p-3.5 px-4" aria-label="Form sections">
//       <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
//         {items.map(item => (
//           <li key={item.id} className={item.state === "Complete" ? "done" : undefined}>
//             <a
//               href={`#${item.id}`}
//               onClick={e => scrollToSection(e, item.id)}
//               className="flex items-center justify-between gap-3 py-0.5 text-[13px] leading-snug text-inherit no-underline hover:text-[var(--theme-primary,#1F5C7A)]"
//             >
//               <span className="min-w-0 font-medium text-[#1B2230]">{item.title}</span>
//               <span className={`shrink-0 whitespace-nowrap font-normal ${item.state === "Complete" ? "font-semibold text-[#15724A]" : "text-[#5A6376]"}`}>{item.state}</span>
//             </a>
//           </li>
//         ))}
//       </ul>
//     </nav>
//   );
// }
 
// /* =====================================================================
//    Main component
//    ===================================================================== */
 
// export interface AddEmployeeProps {
//   /** Dropdown values; defaults to sample data */
//   masterData?: MasterData;
//   /** Logged-in user creating the record (sent as CreatedBy) */
//   createdBy?: string;
//   /**
//    * Saves the employee. If omitted, the form shows a preview of the payload instead.
//    * Typically: (payload, photo) => saveEmployee(payload, photo)
//    */
//   onSave?: (payload: CreateEmployeePayload, photo: File | null) => Promise<CreateEmployeeResult>;
//   /** Return error message if ID invalid/exists; return "" if available. */
//   checkEmployeeId?: (employeeId: string) => Promise<string>;
//   /** @deprecated use checkEmployeeId */
//   checkEmployeeIdExists?: (employeeId: string) => Promise<boolean>;
//   checkEmailExists?: (email: string) => Promise<boolean>;
// }
 
// interface DialogState {
//   title: string;
//   description: string;
//   body: string;
//   /** "success" = clear form when user clicks Done; "preview" = just close */
//   kind?: "preview" | "success";
// }
 
// interface Status {
//   text: string;
//   bad: boolean;
// }
 
// export default function AddEmployee({
//   masterData = SAMPLE_MASTER_DATA,
//   createdBy = "admin",
//   onSave,
//   checkEmployeeId,
//   checkEmployeeIdExists,
//   checkEmailExists,
// }: AddEmployeeProps) {
//   const [values, setValues] = useState<EmployeeFormValues>(EMPTY_VALUES);
//   const [photo, setPhoto] = useState<File | null>(null);
//   const [photoUrl, setPhotoUrl] = useState<string | null>(null);
//   const [touched, setTouched] = useState<Set<ErrorKey>>(new Set());
//   const [status, setStatus] = useState<Status>({ text: "", bad: false });
//   const [saving, setSaving] = useState(false);
//   const [dialog, setDialog] = useState<DialogState | null>(null);
//   const [copyLabel, setCopyLabel] = useState("Copy JSON");
//   const [asyncErrors, setAsyncErrors] = useState<Partial<Record<CheckedField, string>>>({});
//   const [checking, setChecking] = useState<Partial<Record<CheckedField, boolean>>>({});
 
//   const fileRef = useRef<HTMLInputElement>(null);
//   const dialogRef = useRef<HTMLDialogElement>(null);
 
//   /* ---------- Derived data ---------- */
 
//   const errors = useMemo(() => validateAll(values, photo), [values, photo]);
//   const visibleError = (key: ErrorKey): string | undefined => {
//     if (!touched.has(key)) return undefined;
//     if (errors[key]) return errors[key];
//     return CHECKED_FIELDS.includes(key as CheckedField) ? asyncErrors[key as CheckedField] : undefined;
//   };
//   const hasAsyncError = CHECKED_FIELDS.some(f => !!asyncErrors[f]);
//   const isChecking = CHECKED_FIELDS.some(f => !!checking[f]);
 
//   const branches = useMemo(
//     () => masterData.branches.filter(b => b.companyId === Number(values.CompanyID)),
//     [masterData.branches, values.CompanyID],
//   );
//   const managers = useMemo(
//     () => masterData.managers.filter(m => m.branchId === Number(values.BranchID)),
//     [masterData.managers, values.BranchID],
//   );
//   const designations = useMemo(
//     () => masterData.designations.filter(d => d.deptId === Number(values.DeptID)),
//     [masterData.designations, values.DeptID],
//   );
 
//   /** Full Name is derived, not typed by the user — it just mirrors First + Last name */
//   const fullName = useMemo(
//     () => [values.FirstName.trim(), values.LastName.trim()].filter(Boolean).join(" "),
//     [values.FirstName, values.LastName],
//   );
 
//   const progress = useMemo(
//     () =>
//       SECTIONS.map(sec => {
//         const fieldNames = sec.fields.filter((f): f is FieldName => f !== "ProfilePhoto");
//         const required = fieldNames.filter(f => RULES[f].required);
//         const okCount = required.filter(f => !errors[f]).length;
//         const allValid = sec.fields.every(f => !errors[f]);
//         const anyFilled =
//           fieldNames.some(f => values[f].trim()) || (sec.fields.includes("ProfilePhoto") && !!photo);
 
//         const state = required.length
//           ? okCount === required.length && allValid ? "Complete" : `${okCount} of ${required.length} required`
//           : anyFilled && allValid ? "Complete" : "Optional";
 
//         return { id: sec.id, title: sec.title, state };
//       }),
//     [errors, values, photo],
//   );
 
//   /* ---------- Effects ---------- */
 
//   // Auto-generate the employee code once
//   useEffect(() => {
//     setValues(v => (v.Code ? v : { ...v, Code: generateEmployeeCode() }));
//   }, []);
 
//   // Pick the company automatically when there is only one
//   useEffect(() => {
//     if (masterData.companies.length === 1 && !values.CompanyID) {
//       setValues(v => ({ ...v, CompanyID: String(masterData.companies[0].id) }));
//     }
//   }, [masterData.companies, values.CompanyID]);
 
//   // Default Role dropdown to "Employee" as soon as roles load (TL requirement)
//   useEffect(() => {
//     const employeeRole =
//       masterData.roles.find(
//         (r) => String(r.name).trim().toLowerCase() === "employee",
//       ) ||
//       masterData.roles.find((r) =>
//         String(r.name).trim().toLowerCase().includes("employee"),
//       );
 
//     if (!employeeRole) return;
 
//     setValues((v) => {
//       // Only set when empty so user can still change role
//       if (v.RoleID) return v;
//       return { ...v, RoleID: String(employeeRole.id) };
//     });
//   }, [masterData.roles]);
 
//   // Preview URL for the photo, cleaned up when it changes
//   useEffect(() => {
//     if (!photo || errors.ProfilePhoto) {
//       setPhotoUrl(null);
//       return;
//     }
//     const url = URL.createObjectURL(photo);
//     setPhotoUrl(url);
//     return () => URL.revokeObjectURL(url);
//   }, [photo, errors.ProfilePhoto]);
 
//   // Open / close the native dialog
//   useEffect(() => {
//     const d = dialogRef.current;
//     if (!d) return;
//     if (dialog && !d.open) d.showModal();
//     if (!dialog && d.open) d.close();
//   }, [dialog]);
 
//   /* ---------- Handlers ---------- */
 
//   const handleChange = useCallback((name: FieldName, raw: string) => {
//     let value = raw;
//     if (DIGIT_FIELDS.has(name)) value = value.replace(/\D/g, "");
//     if (UPPER_FIELDS.has(name)) value = value.toUpperCase().replace(/\s/g, "");
 
//     if (CHECKED_FIELDS.includes(name as CheckedField)) {
//       setAsyncErrors(prev => (prev[name as CheckedField] ? { ...prev, [name]: undefined } : prev));
//     }
 
//     setValues(prev => {
//       const next: EmployeeFormValues = { ...prev, [name]: value };
//       // Cascading resets
//       if (name === "CompanyID") {
//         next.BranchID = "";
//         next.ReportingManagerID = "";
//       }
//       if (name === "BranchID") next.ReportingManagerID = "";
//       if (name === "DeptID") next.DesignationID = "";
//       return next;
//     });
//   }, []);
 
//   const handleBlur = useCallback((name: ErrorKey) => {
//     setTouched(prev => (prev.has(name) ? prev : new Set(prev).add(name)));
//   }, []);
 
//   /** Employee ID / Email uniqueness check. Runs only when the field is already format-valid. */
//   const runIdentityCheck = useCallback(
//     async (name: CheckedField, rawValue: string) => {
//       const value = name === "Email" ? rawValue.trim().toLowerCase() : rawValue.trim();
//       if (!value) {
//         setAsyncErrors(prev => {
//           const next = { ...prev };
//           delete next[name];
//           return next;
//         });
//         return;
//       }
 
//       setChecking(prev => ({ ...prev, [name]: true }));
//       try {
//         if (name === "EmployeeID") {
//           if (checkEmployeeId) {
//             const message = await checkEmployeeId(value);
//             setAsyncErrors(prev => {
//               const next = { ...prev };
//               if (message) next.EmployeeID = message;
//               else delete next.EmployeeID;
//               return next;
//             });
//           } else if (checkEmployeeIdExists) {
//             const exists = await checkEmployeeIdExists(value);
//             setAsyncErrors(prev => {
//               const next = { ...prev };
//               if (exists) next.EmployeeID = "An employee already exists with this Employee ID.";
//               else delete next.EmployeeID;
//               return next;
//             });
//           }
//         } else if (name === "Email" && checkEmailExists) {
//           const exists = await checkEmailExists(value);
//           setAsyncErrors(prev => {
//             const next = { ...prev };
//             if (exists) next.Email = "This email is already in use.";
//             else delete next.Email;
//             return next;
//           });
//         }
//       } catch (err) {
//         setAsyncErrors(prev => ({
//           ...prev,
//           [name]: err instanceof Error ? err.message : "Could not verify this right now.",
//         }));
//       } finally {
//         setChecking(prev => ({ ...prev, [name]: false }));
//       }
//     },
//     [checkEmployeeId, checkEmployeeIdExists, checkEmailExists],
//   );
 
//   const handleIdentityBlur = useCallback(
//     (name: FieldName) => {
//       handleBlur(name);
//       if (!CHECKED_FIELDS.includes(name as CheckedField)) return;
//       const checkedName = name as CheckedField;
//       // Only hit the server once the field already passes its own format rules
//       if (!validateField(name, values)) runIdentityCheck(checkedName, values[name]);
//     },
//     [handleBlur, values, runIdentityCheck],
//   );
 
//   const handleRegenerateCode = useCallback(() => {
//     setValues(v => ({ ...v, Code: generateEmployeeCode() }));
//     setTouched(prev => (prev.has("Code") ? prev : new Set(prev).add("Code")));
//   }, []);
 
//   const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
//     setPhoto(e.target.files?.[0] ?? null);
//     handleBlur("ProfilePhoto");
//   };
 
//   const bind = (name: FieldName): BoundProps => ({
//     name,
//     value: values[name],
//     error: visibleError(name),
//     onChange: handleChange,
//     onBlur: CHECKED_FIELDS.includes(name as CheckedField) ? handleIdentityBlur : handleBlur,
//   });
 
//   /** Shared by the submit-without-onSave branch and the standalone Preview button */
//   const buildPreviewDialog = (payload: CreateEmployeePayload): DialogState => {
//     // Password is system-generated now — don't show it, even masked, in the preview.
//     const visible = payload;
//     return {
//       title: "Employee ready to save",
//       description: "This is the data that will be sent to the AddEmployee endpoint. A first-time password is generated automatically and isn't shown here.",
//       body: JSON.stringify(visible, null, 2),
//     };
//   };
 
//   /** Runs full validation; returns false (and updates status/focus) if the form isn't ready yet */
//   const runFullValidation = (actionLabel: string): boolean => {
//     setTouched(new Set<ErrorKey>([...FIELD_NAMES, "ProfilePhoto"]));
 
//     const invalid = FIELD_ORDER.filter(k => errors[k]);
//     if (invalid.length) {
//       setStatus({
//         text: `Fix ${invalid.length} ${invalid.length === 1 ? "field" : "fields"} to ${actionLabel}.`,
//         bad: true,
//       });
//       document.getElementById(invalid[0])?.focus();
//       return false;
//     }
//     if (isChecking) {
//       setStatus({ text: "Still checking employee ID / email availability — try again in a moment.", bad: true });
//       return false;
//     }
//     if (hasAsyncError) {
//       const badField = CHECKED_FIELDS.find(f => asyncErrors[f]) ?? "EmployeeID";
//       setStatus({ text: `Fix the ${badField === "EmployeeID" ? "employee ID" : "email"} before you ${actionLabel}.`, bad: true });
//       document.getElementById(badField)?.focus();
//       return false;
//     }
//     return true;
//   };
 
//   const handlePreview = () => {
//     if (!runFullValidation("preview it")) return;
//     const payload = buildPayload(values, photo, createdBy);
//     setDialog(buildPreviewDialog(payload));
//     setStatus({ text: "Preview generated. Nothing has been saved yet.", bad: false });
//   };
 
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!runFullValidation("create the employee")) return;
 
//     const payload = buildPayload(values, photo, createdBy);
 
//     if (!onSave) {
//       setDialog(buildPreviewDialog(payload));
//       setStatus({ text: "All fields look good.", bad: false });
//       return;
//     }
 
//     setSaving(true);
//     setStatus({ text: "Creating employee…", bad: false });
//     try {
//       const result = await onSave(payload, photo);
//       setDialog({
//         kind: "success",
//         title: "Employee created",
//         description: `${result.fullName || result.FullName || "Employee"} can now sign in as ${result.userId || result.UserID || ""}.${result.emailSent === false ? " Their login email could not be sent — share the password with them manually." : ""}`,
//         body: JSON.stringify(result, null, 2),
//       });
//       setStatus({ text: `Employee ${result.employeeId} created.`, bad: false });
//     } catch (err) {
//       setStatus({ text: err instanceof Error ? err.message : "Employee could not be created.", bad: true });
//     } finally {
//       setSaving(false);
//     }
//   };
 
//   const clearForm = () => {
//     const employeeRole =
//       masterData.roles.find(
//         (r) => String(r.name).trim().toLowerCase() === "employee",
//       ) ||
//       masterData.roles.find((r) =>
//         String(r.name).trim().toLowerCase().includes("employee"),
//       );
//     setValues({
//       ...EMPTY_VALUES,
//       Code: generateEmployeeCode(),
//       RoleID: employeeRole ? String(employeeRole.id) : "",
//     });
//     setPhoto(null);
//     setPhotoUrl(null);
//     setTouched(new Set());
//     setStatus({ text: "", bad: false });
//     setAsyncErrors({});
//     setChecking({});
//     if (fileRef.current) fileRef.current.value = "";
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };
 
//   const handleReset = () => {
//     if (!window.confirm("Clear everything you've entered?")) return;
//     clearForm();
//   };
 
//   const handleDialogDone = () => {
//     const wasSuccess = dialog?.kind === "success";
//     setDialog(null);
//     if (wasSuccess) clearForm();
//   };
 
//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(dialog?.body ?? "");
//       setCopyLabel("Copied");
//     } catch {
//       setCopyLabel("Copy failed");
//     }
//     window.setTimeout(() => setCopyLabel("Copy JSON"), 1600);
//   };
 
//   /* ---------- Render ---------- */
 
//   const companyChosen = !!values.CompanyID;
//   const branchChosen = !!values.BranchID;
//   const deptChosen = !!values.DeptID;
 
//   return (
//     <div className="text-[15px] leading-normal text-[#1B2230]">
//       <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 overflow-visible pb-6 md:grid-cols-[290px_minmax(0,1fr)]">
//         <aside className="sticky top-4 z-[5] flex max-h-[calc(100vh-32px)] flex-col gap-4 self-start overflow-y-auto">
//           <IdCard
//             firstName={values.FirstName.trim()}
//             lastName={values.LastName.trim()}
//             designation={nameOf(masterData.designations, values.DesignationID)}
//             employeeId={values.EmployeeID.trim()}
//             department={nameOf(masterData.departments, values.DeptID)}
//             branch={nameOf(masterData.branches, values.BranchID)}
//             grade={values.Grade}
//             joined={formatDate(values.DOJ)}
//             photoUrl={photoUrl}
//           />
//           <Progress items={progress} />
//         </aside>
 
//         <form onSubmit={handleSubmit} noValidate>
//           <Section config={SECTIONS[0]}>
//             <TextField
//               {...bind("EmployeeID")}
//               maxLength={50}
//               placeholder="EMP1001"
//               hint={checking.EmployeeID ? "Checking availability…" : undefined}
//             />
//             {/* <FieldShell
//               name="Code"
//               label={RULES.Code.label}
//               required={RULES.Code.required}
//               hint="Generated automatically. Click Regenerate for a different one."
//               error={visibleError("Code")}
//             >
//               <div className="relative flex items-center">
//                 <input
//                   id="Code"
//                   name="Code"
//                   className="w-full min-h-11 rounded-md border border-[#D3D9E2] bg-white px-3 py-2.5 text-[#1B2230] outline-none focus:border-[var(--theme-primary,#1F5C7A)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#1F5C7A)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 pr-12"
//                   value={values.Code}
//                   readOnly
//                   aria-invalid={!!visibleError("Code")}
//                   aria-describedby={describedBy("Code", "hint", visibleError("Code"))}
//                 />
//                 <button type="button" className="pw-toggle" onClick={handleRegenerateCode}>
//                   Regenerate
//                 </button>
//               </div>
//             </FieldShell> */}
 
 
 
 
 
//             <FieldShell
//               name="Code"
//               label={RULES.Code.label}
//               required={RULES.Code.required}
//               hint="Generated automatically. Click refresh for a different one."
//               error={visibleError("Code")}
//             >
//               <div className="relative flex w-full items-center">
//                 <input
//                   id="Code"
//                   name="Code"
//                   readOnly
//                   value={values.Code}
//                   aria-invalid={!!visibleError("Code")}
//                   aria-describedby={describedBy("Code", "hint", visibleError("Code"))}
//                   className="w-full min-h-11 rounded-md border border-[#D3D9E2] bg-white px-3 py-2.5 pr-12 text-[#1B2230] outline-none focus:border-[var(--theme-primary,#1F5C7A)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#1F5C7A)_20%,transparent)]"
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-[#D3D9E2] bg-white text-[var(--theme-primary,#1F5C7A)] hover:bg-[var(--theme-light,#E1EDF3)]"
//                   onClick={handleRegenerateCode}
//                   aria-label="Regenerate employee code"
//                   title="Regenerate"
//                 >
//                   <RefreshCw size={16} strokeWidth={2} />
//                 </button>
//               </div>
//             </FieldShell>
//             <TextField {...bind("FirstName")} maxLength={100} autoComplete="given-name" />
//             <TextField {...bind("LastName")} maxLength={100} autoComplete="family-name" />
//             <FieldShell name="FullName" label="Full Name" hint="Fills in automatically from First name + Last name.">
//               <input id="FullName" name="FullName" value={fullName} readOnly tabIndex={-1} placeholder="—" className="w-full min-h-11 rounded-md border border-[#D3D9E2] bg-[#F4F8FE] px-3 py-2.5 text-[#1B2230]" />
//             </FieldShell>
//             <DateFieldControl
//               name="DOB"
//               value={values.DOB}
//               onCommit={v => handleChange("DOB", v)}
//               onFieldBlur={() => handleBlur("DOB")}
//               error={visibleError("DOB")}
//               maxIso={todayISO()}
//             />
//             <SelectField {...bind("GenderID")} options={masterData.genders} />
//             <SelectField {...bind("MaritalStatusID")} options={masterData.maritalStatuses} />
//             <FieldShell
//               name="ProfilePhoto"
//               label="Profile photo"
//               hint="JPG, PNG or WebP, up to 2 MB."
//               error={visibleError("ProfilePhoto")}
//               full
//             >
//               <div
//                 className={`flex min-h-11 items-center gap-3 rounded-md border bg-white px-3 py-2 ${
//                   visibleError("ProfilePhoto") ? "border-[#B42318]" : "border-[#D3D9E2]"
//                 }`}
//               >
//                 <input
//                   ref={fileRef}
//                   id="ProfilePhoto"
//                   name="ProfilePhoto"
//                   type="file"
//                   accept="image/jpeg,image/png,image/webp"
//                   className="sr-only"
//                   onChange={handlePhoto}
//                   aria-invalid={!!visibleError("ProfilePhoto")}
//                   aria-describedby={describedBy("ProfilePhoto", "hint", visibleError("ProfilePhoto"))}
//                 />
//                 <button
//                   type="button"
//                   className="shrink-0 cursor-pointer rounded-md border border-[#D3D9E2] bg-[#F4F8FE] px-3 py-1.5 text-sm font-semibold text-[#1B2230] hover:bg-[#E8EEF5]"
//                   onClick={() => fileRef.current?.click()}
//                 >
//                   {photo ? "Change photo" : "Choose file"}
//                 </button>
//                 <span className="min-w-0 flex-1 truncate text-sm text-[#5A6376]">
//                   {photo ? photo.name : "No file chosen"}
//                 </span>
//                 {photo && (
//                   <button
//                     type="button"
//                     className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-[#B42318] hover:bg-[#FDF0EE]"
//                     onClick={() => {
//                       setPhoto(null);
//                       if (fileRef.current) fileRef.current.value = "";
//                       handleBlur("ProfilePhoto");
//                     }}
//                     aria-label="Remove photo"
//                   >
//                     Remove
//                   </button>
//                 )}
//               </div>
//             </FieldShell>
//           </Section>
 
//           <Section config={SECTIONS[1]}>
//             <SelectField {...bind("CompanyID")} options={masterData.companies} />
//             <SelectField {...bind("BranchID")} options={branches} disabled={!companyChosen} />
//             <SelectField {...bind("DeptID")} options={masterData.departments} />
//             <SelectField {...bind("DesignationID")} options={designations} disabled={!deptChosen} />
//             <SelectField
//               {...bind("RoleID")}
//               options={masterData.roles}
//               hint="Controls what this person can see and do after signing in."
//             />
//             <SelectField
//               {...bind("ReportingManagerID")}
//               options={managers}
//               disabled={!branchChosen || managers.length === 0}
//             />
//             <SelectField {...bind("Grade")} options={masterData.grades} />
//             <SelectField {...bind("EmploymentTypeID")} options={masterData.employmentTypes} />
//             <SelectField {...bind("EmploymentStatusID")} options={masterData.employmentStatuses} />
//             <DateFieldControl
//               name="DOJ"
//               value={values.DOJ}
//               onCommit={v => handleChange("DOJ", v)}
//               onFieldBlur={() => handleBlur("DOJ")}
//               error={visibleError("DOJ")}
//               minIso={values.DOB || undefined}
//             />
//           </Section>
 
//           <Section config={SECTIONS[2]}>
//             <TextField
//               {...bind("Email")}
//               type="email"
//               maxLength={150}
//               placeholder="name@company.com"
//               hint={checking.Email ? "Checking availability…" : undefined}
//             />
//             <TextField {...bind("AlternateEmailId")} type="email" maxLength={150} />
//             <TextField {...bind("Mobileno")} type="tel" inputMode="numeric" maxLength={10} placeholder="9876543210" />
//             <TextField {...bind("AltMobileNo")} type="tel" inputMode="numeric" maxLength={10} />
//             <TextField {...bind("EmergencyNo")} type="tel" inputMode="numeric" maxLength={10} />
//           </Section>
 
//           <Section config={SECTIONS[3]}>
//             <TextField {...bind("AadhaarNumber")} inputMode="numeric" maxLength={12} placeholder="12 digits" />
//             <TextField {...bind("PANNumber")} maxLength={10} placeholder="ABCDE1234F" />
//             <TextField {...bind("UANNumber")} inputMode="numeric" maxLength={12} placeholder="12 digits" />
//             <TextField {...bind("PFNumber")} maxLength={30} placeholder="TSHYD1234567000001234" />
//           </Section>
 
//           <Section config={SECTIONS[4]}>
//             <TextField
//               {...bind("UserID")}
//               maxLength={100}
//               placeholder="Same as work email"
//               hint="Leave blank to sign in with the work email."
//               full
//             />
//           </Section>
 
//           <div className="static z-auto mt-2 rounded-[14px] border border-[#D3D9E2] bg-white px-6 py-3.5">
//             <div className="flex flex-wrap items-center justify-end gap-3">
//               <span className={`mr-auto text-sm ${status.bad ? "font-semibold text-[#B42318]" : "text-[#5A6376]"}`} role="status">{status.text}</span>
//               <button type="button" className="min-h-11 cursor-pointer rounded-md border border-[#D3D9E2] bg-transparent px-5 py-2.5 font-semibold text-[#1B2230] hover:bg-[#F4F8FE] disabled:cursor-progress disabled:opacity-60" onClick={handlePreview} disabled={saving}>
//                 Preview
//               </button>
//               <button type="button" className="min-h-11 cursor-pointer rounded-md border border-[#D3D9E2] bg-transparent px-5 py-2.5 font-semibold text-[#1B2230] hover:bg-[#F4F8FE] disabled:cursor-progress disabled:opacity-60" onClick={handleReset} disabled={saving}>
//                 Clear form
//               </button>
//               <button type="submit" className="min-h-11 cursor-pointer rounded-md border border-[var(--theme-primary,#1F5C7A)] bg-[var(--theme-primary,#1F5C7A)] px-5 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-progress disabled:opacity-60" disabled={saving}>
//                 {saving ? "Creating…" : "Create employee"}
//               </button>
//             </div>
//           </div>
//         </form>
//       </div>
 
//       {/* Full-page loader while creating employee */}
//       {saving && (
//         <div
//           className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.5)] backdrop-blur-[2px]"
//           role="status"
//           aria-live="polite"
//           aria-busy="true"
//         >
//           <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/20 bg-white px-8 py-10 shadow-2xl">
//             <div
//               className="h-14 w-14 animate-spin rounded-full border-[3px] border-[#E2E8F0] border-t-[var(--theme-primary,#2563EB)]"
//               aria-hidden
//             />
//             <div className="text-center">
//               <p className="m-0 text-lg font-bold text-[#1B2230]">Creating employee</p>
//               <p className="mt-1.5 mb-0 text-sm text-[#5A6376]">Saving details and sending login email…</p>
//             </div>
//           </div>
//         </div>
//       )}
 
//       <dialog
//         ref={dialogRef}
//         className="fixed left-1/2 top-1/2 z-[110] m-0 w-[min(440px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-none bg-transparent p-0 text-[#1B2230] shadow-none open:flex open:flex-col backdrop:bg-[rgba(15,23,42,0.5)] backdrop:backdrop-blur-[2px]"
//         aria-labelledby="dlgTitle"
//         onClose={handleDialogDone}
//       >
//         {dialog && (
//           <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
//             {dialog.kind === "success" ? (
//               <>
//                 <div className="bg-gradient-to-r from-[var(--theme-primary,#2563EB)] to-[#00C2FF] px-6 pb-6 pt-7 text-center text-white">
//                   <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl" aria-hidden>
//                     ✓
//                   </div>
//                   <h2 id="dlgTitle" className="m-0 text-xl font-bold tracking-tight">{dialog.title}</h2>
//                   <p className="mt-2 mb-0 text-sm text-white/90">{dialog.description}</p>
//                 </div>
//                 <div className="space-y-3 px-6 py-5 text-sm text-[#5A6376]">
//                   <p className="m-0 leading-relaxed">
//                     Login credentials have been sent to the work email. The employee can sign in and change the password on first login.
//                   </p>
//                   {dialog.body && (
//                     <details className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
//                       <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold text-[#64748B]">
//                         Technical details
//                       </summary>
//                       <pre className="m-0 max-h-40 overflow-auto border-t border-[#E2E8F0] p-3 text-[11px] leading-snug text-[#334155]">{dialog.body}</pre>
//                     </details>
//                   )}
//                 </div>
//                 <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
//                   <button
//                     type="button"
//                     className="min-h-11 cursor-pointer rounded-lg border border-[#D3D9E2] bg-white px-5 py-2.5 text-sm font-semibold text-[#1B2230] hover:bg-[#F4F8FE]"
//                     onClick={handleCopy}
//                   >
//                     {copyLabel}
//                   </button>
//                   <button
//                     type="button"
//                     className="min-h-11 cursor-pointer rounded-lg border border-[var(--theme-primary,#2563EB)] bg-[var(--theme-primary,#2563EB)] px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
//                     onClick={() => dialogRef.current?.close()}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div className="px-6 pt-6">
//                   <h2 id="dlgTitle" className="mb-1 mt-0 text-xl font-bold">{dialog.title}</h2>
//                   <p className="m-0 text-sm text-[#5A6376]">{dialog.description}</p>
//                 </div>
//                 <pre className="mx-6 my-4 max-h-[40vh] overflow-auto rounded-lg bg-[#F4F8FE] p-4 text-[13px] leading-snug">{dialog.body}</pre>
//                 <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
//                   <button
//                     type="button"
//                     className="min-h-11 cursor-pointer rounded-lg border border-[#D3D9E2] bg-white px-5 py-2.5 text-sm font-semibold text-[#1B2230] hover:bg-[#F4F8FE]"
//                     onClick={handleCopy}
//                   >
//                     {copyLabel}
//                   </button>
//                   <button
//                     type="button"
//                     className="min-h-11 cursor-pointer rounded-lg border border-[var(--theme-primary,#2563EB)] bg-[var(--theme-primary,#2563EB)] px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
//                     onClick={() => dialogRef.current?.close()}
//                   >
//                     Done
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         )}
//       </dialog>
//     </div>
//   );
// }
 



 
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";
import DatePicker2, { type DatePicker2Cell as DatePickerCell } from "@/components/ui/datepicker2";
import { buildPayload } from "../api/api";
import { SAMPLE_MASTER_DATA } from "../constants/masterData";
import { RefreshCw } from "lucide-react";
import type {
  CreateEmployeePayload,
  CreateEmployeeResult,
  EmployeeFormValues,
  ErrorKey,
  FieldName,
  MasterData,
  Option,
} from "../types/types";
import { EMPTY_VALUES, FIELD_NAMES, RULES, generateEmployeeCode, todayISO, validateAll, validateField } from "../validation/validation";
 
/* =====================================================================
   Config
   ===================================================================== */
 
interface SectionConfig {
  id: string;
  title: string;
  lead: string;
  fields: ErrorKey[];
}
 
const SECTIONS: SectionConfig[] = [
  {
    id: "sec-personal",
    title: "Personal details",
    lead: "Basic identity information as it appears on official documents.",
    fields: ["EmployeeID", "Code", "FirstName", "LastName", "DOB", "GenderID", "MaritalStatusID", "ProfilePhoto"],
  },
  {
    id: "sec-job",
    title: "Job and organisation",
    lead: "Where the employee sits in the company and how they're employed.",
    fields: [
      "CompanyID", "BranchID", "DeptID", "DesignationID", "RoleID", "ReportingManagerID",
      "Grade", "EmploymentTypeID", "EmploymentStatusID", "DOJ",
    ],
  },
  {
    id: "sec-contact",
    title: "Contact",
    lead: "The work email is also used to sign in unless you set a separate user ID.",
    fields: ["Email", "AlternateEmailId", "Mobileno", "AltMobileNo", "EmergencyNo"],
  },
  {
    id: "sec-statutory",
    title: "Statutory IDs",
    lead: "Needed for payroll, PF and tax filing. These can be added later.",
    fields: ["AadhaarNumber", "PANNumber", "UANNumber", "PFNumber"],
  },
  {
    id: "sec-login",
    title: "Login access",
    lead: "A first-time login is created automatically from the work email (or the user ID below).",
    fields: ["UserID"],
  },
];
 
/** Order used to focus the first invalid field on submit */
const FIELD_ORDER: ErrorKey[] = SECTIONS.flatMap(s => s.fields);
 
const DIGIT_FIELDS: ReadonlySet<FieldName> = new Set(["Mobileno", "AltMobileNo", "EmergencyNo", "AadhaarNumber", "UANNumber"]);
const UPPER_FIELDS: ReadonlySet<FieldName> = new Set(["PANNumber", "PFNumber"]);
 
/** Every dropdown shows the same placeholder — the TL asked for plain "Select" everywhere */
const SELECT_PLACEHOLDER = "Select";
 
/* =====================================================================
   Small helpers
   ===================================================================== */
 
const nameOf = (options: ReadonlyArray<Option<string | number>>, id: string): string =>
  options.find(o => String(o.id) === id)?.name ?? "";
 
const formatDate = (iso: string): string =>
  iso
    ? new Date(`${iso}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "";
 
const describedBy = (name: string, hint?: string, error?: string): string | undefined =>
  [hint && `${name}-hint`, error && `${name}-err`].filter(Boolean).join(" ") || undefined;
 
/* ---- Date <-> text conversion for the DatePicker (display: dd-mm-yyyy, stored: ISO yyyy-mm-dd) ---- */
 
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
 
const pad2 = (n: number): string => String(n).padStart(2, "0");
 
const isoToDmy = (iso: string): string => {
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}-${m}-${y}` : "";
};
 
/** Accepts dd-mm-yyyy or dd/mm/yyyy; returns null if the text isn't a full, valid date yet */
const dmyToIso = (raw: string): string | null => {
  const match = /^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/.exec(raw.trim());
  if (!match) return null;
  const d = Number(match[1]);
  const m = Number(match[2]);
  const y = Number(match[3]);
  if (m < 1 || m > 12) return null;
  if (d < 1 || d > new Date(y, m, 0).getDate()) return null;
  return `${y}-${pad2(m)}-${pad2(d)}`;
};
 
function buildMonthCells(viewYear: number, viewMonth: number, selectedIso: string, minIso?: string, maxIso?: string): DatePickerCell[] {
  const firstOfMonth = new Date(viewYear, viewMonth - 1, 1);
  const gridStart = new Date(viewYear, viewMonth - 1, 1 - firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(gridStart);
    d.setDate(gridStart.getDate() + i);
    const iso = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    return {
      iso,
      day: d.getDate(),
      inMonth: d.getMonth() + 1 === viewMonth && d.getFullYear() === viewYear,
      disabled: (!!minIso && iso < minIso) || (!!maxIso && iso > maxIso),
      selected: iso === selectedIso,
    };
  });
}
 
/* =====================================================================
   Field components
   ===================================================================== */
 
interface FieldShellProps {
  /** Widened to string so it also covers derived, non-form fields like the Full Name readout */
  name: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}
 
function FieldShell({ name, label, required, hint, error, full, children }: FieldShellProps) {
  return (
    <div className={`flex min-w-0 flex-col gap-1.5${full ? " sm:col-span-2" : ""}`}>
      <label htmlFor={name} className="text-[13px] font-semibold text-[#1B2230]">
        {label}
        {required && <span className="ml-0.5 text-[#B42318]" aria-hidden="true">*</span>}
      </label>
      {children}
      {hint && <p className="m-0 text-xs text-[#5A6376]" id={`${name}-hint`}>{hint}</p>}
      {error && <p className="m-0 text-xs text-[#B42318]" id={`${name}-err`}>{error}</p>}
    </div>
  );
}
 
interface BoundProps {
  name: FieldName;
  value: string;
  error?: string;
  onChange: (name: FieldName, value: string) => void;
  onBlur: (name: ErrorKey) => void;
}
 
interface TextFieldProps extends BoundProps {
  type?: "text" | "email" | "tel" | "date";
  placeholder?: string;
  maxLength?: number;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  max?: string;
  hint?: string;
  full?: boolean;
}
 
function TextField({
  name, value, error, onChange, onBlur, type = "text", hint, full, autoComplete = "off", ...rest
}: TextFieldProps) {
  const rule = RULES[name];
  return (
    <FieldShell name={name} label={rule.label} required={rule.required} hint={hint} error={error} full={full}>
      <input
        {...rest}
        id={name}
        name={name}
        type={type}
        value={value}
        autoComplete={autoComplete}
        className={`w-full min-h-11 rounded-md border bg-white px-3 py-2.5 text-[#1B2230] outline-none focus:border-[var(--theme-primary,#1F5C7A)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#1F5C7A)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 ${error ? "border-[#B42318]" : "border-[#D3D9E2]"}`}
        onChange={e => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        aria-invalid={!!error}
        aria-describedby={describedBy(name, hint, error)}
      />
    </FieldShell>
  );
}
 
interface SelectFieldProps extends BoundProps {
  options: ReadonlyArray<Option<string | number>>;
  /** Optional override; defaults to the plain "Select" placeholder used everywhere else */
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
}
 
function SelectField({ name, value, error, onChange, onBlur, options, placeholder = SELECT_PLACEHOLDER, disabled, hint }: SelectFieldProps) {
  const rule = RULES[name];
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedLabel = options.find(o => String(o.id) === String(value))?.name ?? "";
 
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
 
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
 
  return (
    <FieldShell name={name} label={rule.label} required={rule.required} hint={hint} error={error}>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          id={name}
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          aria-describedby={describedBy(name, hint, error)}
          onClick={() => { if (!disabled) setOpen(v => !v); }}
          onBlur={() => onBlur(name)}
          className={`flex w-full min-h-11 items-center justify-between rounded-md border bg-white px-3 py-2.5 text-left text-[#1B2230] outline-none focus:border-[var(--theme-primary,#2563EB)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#2563EB)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 ${error ? "border-[#B42318]" : "border-[#D3D9E2]"}`}
        >
          <span className={selectedLabel ? "truncate" : "truncate text-[#5A6376]"}>
            {selectedLabel || placeholder}
          </span>
          <svg className={`ml-2 h-4 w-4 shrink-0 text-[#5A6376] transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        {open && !disabled && (
          <ul role="listbox" className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[10.5rem] overflow-y-auto rounded-md border border-[#D3D9E2] bg-white py-1 shadow-lg">
            {options.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[#5A6376]">No options</li>
            ) : (
              options.map(o => {
                const selected = String(o.id) === String(value);
                return (
                  <li key={String(o.id)} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      className={`flex w-full px-3 py-2 text-left text-sm hover:bg-[#F4F8FE] ${selected ? "bg-[var(--theme-light,#DBEAFE)] font-medium text-[var(--theme-primary,#2563EB)]" : "text-[#1B2230]"}`}
                      onMouseDown={e => e.preventDefault()}
                      onClick={() => { onChange(name, String(o.id)); onBlur(name); setOpen(false); }}
                    >
                      {o.name}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </FieldShell>
  );
}
 
/** DOB / DOJ / DOL — wraps the TL's DatePicker (frontend/src/components/ui/datepicker.tsx).
 *  Owns its own text + calendar-month state; commits a plain ISO string (yyyy-mm-dd)
 *  up to the form on every valid selection, same as the old <input type="date"> did. */
interface DateFieldControlProps {
  name: FieldName;
  value: string;
  onCommit: (iso: string) => void;
  onFieldBlur: () => void;
  error?: string;
  hint?: string;
  /** Optional bounds — dates outside these are shown disabled in the calendar grid */
  minIso?: string;
  maxIso?: string;
  full?: boolean;
}
 
function DateFieldControl({ name, value, onCommit, onFieldBlur, error, hint, minIso, maxIso, full }: DateFieldControlProps) {
  const rule = RULES[name];
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(() => isoToDmy(value));
  const [formatError, setFormatError] = useState<string | undefined>(undefined);
  const seed = value ? new Date(`${value}T00:00:00`) : new Date();
  const [viewYear, setViewYear] = useState(seed.getFullYear());
  const [viewMonth, setViewMonth] = useState(seed.getMonth() + 1);
 
  // Keep local text/view month in sync when the value changes from outside (reset, clear, prefill)
  useEffect(() => {
    setText(isoToDmy(value));
    if (value) {
      const d = new Date(`${value}T00:00:00`);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth() + 1);
    }
  }, [value]);
 
  const gotoIso = (iso: string) => {
    const d = new Date(`${iso}T00:00:00`);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth() + 1);
  };
 
  const handleTextChange = (raw: string) => {
    setText(raw);
    if (!raw.trim()) {
      setFormatError(undefined);
      onCommit("");
      return;
    }
    const iso = dmyToIso(raw);
    if (iso) {
      setFormatError(undefined);
      onCommit(iso);
      gotoIso(iso);
    }
    // Partial/invalid input: let them keep typing — checked properly on blur.
  };
 
  const handleBlur = () => {
    setFormatError(text.trim() && !dmyToIso(text) ? "Enter a date as dd-mm-yyyy." : undefined);
    onFieldBlur();
  };
 
  const handleSelectDay = (iso: string) => {
    setText(isoToDmy(iso));
    setFormatError(undefined);
    onCommit(iso);
    setOpen(false);
    onFieldBlur();
  };
 
  const handleClear = () => {
    setText("");
    setFormatError(undefined);
    onCommit("");
  };
 
  const handleToday = () => {
    const t = todayISO();
    setText(isoToDmy(t));
    setFormatError(undefined);
    onCommit(t);
    gotoIso(t);
    setOpen(false);
  };
 
  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth - 1 + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth() + 1);
  };
 
  const cells = useMemo(
    () => buildMonthCells(viewYear, viewMonth, value, minIso, maxIso),
    [viewYear, viewMonth, value, minIso, maxIso],
  );
 
  return (
    <FieldShell name={name} label={rule.label} required={rule.required} hint={hint} error={formatError || error} full={full}>
      <DatePicker2
        id={name}
        text={text}
        onTextChange={handleTextChange}
        onBlur={handleBlur}
        isInvalid={!!(formatError || error)}
        open={open}
        onOpenChange={setOpen}
        monthLabel={`${MONTH_NAMES[viewMonth - 1]} ${viewYear}`}
        weekdayLabels={WEEKDAY_LABELS}
        cells={cells}
        onSelectDay={handleSelectDay}
        onPrevMonth={() => shiftMonth(-1)}
        onNextMonth={() => shiftMonth(1)}
        onClear={handleClear}
        onToday={handleToday}
        viewYear={viewYear}
        viewMonth={viewMonth}
        onViewChange={(y, m) => {
          setViewYear(y);
          setViewMonth(m);
        }}
      />
    </FieldShell>
  );
}
 
function Section({ config, children }: { config: SectionConfig; children: ReactNode }) {
  return (
    <section className="mb-5 scroll-mt-6 rounded-[14px] border border-[#D3D9E2] bg-white p-[22px_24px_24px]" id={config.id}>
      <h2 className="m-0 mb-1 text-lg font-bold">{config.title}</h2>
      <p className="mb-[18px] mt-0 text-sm text-[#5A6376]">{config.lead}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-5">{children}</div>
    </section>
  );
}
 
/* =====================================================================
   Sidebar: live ID card + progress
   ===================================================================== */
 
interface IdCardProps {
  firstName: string;
  lastName: string;
  designation: string;
  employeeId: string;
  department: string;
  branch: string;
  grade: string;
  joined: string;
  photoUrl: string | null;
}
 
function IdCard(p: IdCardProps) {
  const fullName = [p.firstName, p.lastName].filter(Boolean).join(" ");
  const initials = `${p.firstName[0] ?? ""}${p.lastName[0] ?? ""}`.toUpperCase() || "?";
  return (
    <div className="relative flex-none overflow-visible rounded-2xl border border-[#D3D9E2] bg-white text-center shadow-sm" aria-live="polite">
      <div className="relative h-[72px] rounded-t-2xl bg-[var(--theme-primary,#1F5C7A)]"><span className="absolute left-1/2 top-3 h-[5px] w-9 -translate-x-1/2 rounded-[3px] bg-white/40" /></div>
      <div className="relative z-[2] mx-auto mt-[-40px] mb-3 grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-[var(--theme-light,#E1EDF3)] text-[26px] font-bold text-[var(--theme-primary,#1F5C7A)] shadow">
        {p.photoUrl ? <img src={p.photoUrl} alt={`Profile photo of ${fullName || "new employee"}`} /> : initials}
      </div>
      <div>
        <p className="mx-4 mb-1 overflow-wrap-anywhere text-lg font-bold text-[#1B2230]">{fullName || "New employee"}</p>
        <p className="mx-4 mb-3.5 text-[13px] text-[#5A6376]">{p.designation || "Designation not set"}</p>
      </div>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 border-t border-dashed border-[#D3D9E2] px-[18px] py-3.5 text-left text-[13px]">
        <dt className="m-0 font-medium text-[#5A6376]">Employee ID</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.employeeId || "—"}</dd>
        <dt className="m-0 font-medium text-[#5A6376]">Department</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.department || "—"}</dd>
        <dt className="m-0 font-medium text-[#5A6376]">Branch</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.branch || "—"}</dd>
        <dt className="m-0 font-medium text-[#5A6376]">Grade</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.grade || "—"}</dd>
        <dt className="m-0 font-medium text-[#5A6376]">Joined</dt><dd className="m-0 text-right font-semibold text-[#1B2230]">{p.joined || "—"}</dd>
      </dl>
    </div>
  );
}
 
/** Fields whose availability is checked against the server, beyond format rules */
type CheckedField = "EmployeeID" | "Email";
const CHECKED_FIELDS: CheckedField[] = ["EmployeeID", "Email"];
 
function scrollToSection(e: MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}
 
function Progress({ items }: { items: { id: string; title: string; state: string }[] }) {
  return (
    <nav className="flex-none rounded-2xl border border-[#D3D9E2] bg-white p-3.5 px-4" aria-label="Form sections">
      <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
        {items.map(item => (
          <li key={item.id} className={item.state === "Complete" ? "done" : undefined}>
            <a
              href={`#${item.id}`}
              onClick={e => scrollToSection(e, item.id)}
              className="flex items-center justify-between gap-3 py-0.5 text-[13px] leading-snug text-inherit no-underline hover:text-[var(--theme-primary,#1F5C7A)]"
            >
              <span className="min-w-0 font-medium text-[#1B2230]">{item.title}</span>
              <span className={`shrink-0 whitespace-nowrap font-normal ${item.state === "Complete" ? "font-semibold text-[#15724A]" : "text-[#5A6376]"}`}>{item.state}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
 
/* =====================================================================
   Main component
   ===================================================================== */
 
export interface AddEmployeeProps {
  /** Dropdown values; defaults to sample data */
  masterData?: MasterData;
  /** Logged-in user creating the record (sent as CreatedBy) */
  createdBy?: string;
  /**
   * Saves the employee. If omitted, the form shows a preview of the payload instead.
   * Typically: (payload, photo) => saveEmployee(payload, photo)
   */
  onSave?: (payload: CreateEmployeePayload, photo: File | null) => Promise<CreateEmployeeResult>;
  /** Return error message if ID invalid/exists; return "" if available. */
  checkEmployeeId?: (employeeId: string) => Promise<string>;
  /** @deprecated use checkEmployeeId */
  checkEmployeeIdExists?: (employeeId: string) => Promise<boolean>;
  checkEmailExists?: (email: string) => Promise<boolean>;
}
 
interface DialogState {
  title: string;
  description: string;
  body: string;
  /** "success" = clear form when user clicks Done; "preview" = just close */
  kind?: "preview" | "success";
}
 
interface Status {
  text: string;
  bad: boolean;
}
 
export default function AddEmployee({
  masterData = SAMPLE_MASTER_DATA,
  createdBy = "admin",
  onSave,
  checkEmployeeId,
  checkEmployeeIdExists,
  checkEmailExists,
}: AddEmployeeProps) {
  const [values, setValues] = useState<EmployeeFormValues>(EMPTY_VALUES);
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [touched, setTouched] = useState<Set<ErrorKey>>(new Set());
  const [status, setStatus] = useState<Status>({ text: "", bad: false });
  const [saving, setSaving] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [copyLabel, setCopyLabel] = useState("Copy JSON");
  const [asyncErrors, setAsyncErrors] = useState<Partial<Record<CheckedField, string>>>({});
  const [checking, setChecking] = useState<Partial<Record<CheckedField, boolean>>>({});
 
  const fileRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
 
  /* ---------- Derived data ---------- */
 
  const errors = useMemo(() => validateAll(values, photo), [values, photo]);
  const visibleError = (key: ErrorKey): string | undefined => {
    if (!touched.has(key)) return undefined;
    if (errors[key]) return errors[key];
    return CHECKED_FIELDS.includes(key as CheckedField) ? asyncErrors[key as CheckedField] : undefined;
  };
  const hasAsyncError = CHECKED_FIELDS.some(f => !!asyncErrors[f]);
  const isChecking = CHECKED_FIELDS.some(f => !!checking[f]);
 
  const branches = useMemo(
    () => masterData.branches.filter(b => b.companyId === Number(values.CompanyID)),
    [masterData.branches, values.CompanyID],
  );
  const managers = useMemo(
    () => masterData.managers.filter(m => m.branchId === Number(values.BranchID)),
    [masterData.managers, values.BranchID],
  );
  const designations = useMemo(
    () => masterData.designations.filter(d => d.deptId === Number(values.DeptID)),
    [masterData.designations, values.DeptID],
  );
 
  /** Full Name is derived, not typed by the user — it just mirrors First + Last name */
  const fullName = useMemo(
    () => [values.FirstName.trim(), values.LastName.trim()].filter(Boolean).join(" "),
    [values.FirstName, values.LastName],
  );
 
  const progress = useMemo(
    () =>
      SECTIONS.map(sec => {
        const fieldNames = sec.fields.filter((f): f is FieldName => f !== "ProfilePhoto");
        const required = fieldNames.filter(f => RULES[f].required);
        const okCount = required.filter(f => !errors[f]).length;
        const allValid = sec.fields.every(f => !errors[f]);
        const anyFilled =
          fieldNames.some(f => values[f].trim()) || (sec.fields.includes("ProfilePhoto") && !!photo);
 
        const state = required.length
          ? okCount === required.length && allValid ? "Complete" : `${okCount} of ${required.length} required`
          : anyFilled && allValid ? "Complete" : "Optional";
 
        return { id: sec.id, title: sec.title, state };
      }),
    [errors, values, photo],
  );
 
  /* ---------- Effects ---------- */
 
  // Auto-generate the employee code once
  useEffect(() => {
    setValues(v => (v.Code ? v : { ...v, Code: generateEmployeeCode() }));
  }, []);
 
  // Pick the company automatically when there is only one
  useEffect(() => {
    if (masterData.companies.length === 1 && !values.CompanyID) {
      setValues(v => ({ ...v, CompanyID: String(masterData.companies[0].id) }));
    }
  }, [masterData.companies, values.CompanyID]);
 
  // Default Role dropdown to "Employee" as soon as roles load (TL requirement)
  useEffect(() => {
    const employeeRole =
      masterData.roles.find(
        (r) => String(r.name).trim().toLowerCase() === "employee",
      ) ||
      masterData.roles.find((r) =>
        String(r.name).trim().toLowerCase().includes("employee"),
      );
 
    if (!employeeRole) return;
 
    setValues((v) => {
      // Only set when empty so user can still change role
      if (v.RoleID) return v;
      return { ...v, RoleID: String(employeeRole.id) };
    });
  }, [masterData.roles]);
 
  // Preview URL for the photo, cleaned up when it changes
  useEffect(() => {
    if (!photo || errors.ProfilePhoto) {
      setPhotoUrl(null);
      return;
    }
    const url = URL.createObjectURL(photo);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photo, errors.ProfilePhoto]);
 
  // Open / close the native dialog
  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (dialog && !d.open) d.showModal();
    if (!dialog && d.open) d.close();
  }, [dialog]);
 
  /* ---------- Handlers ---------- */
 
  const handleChange = useCallback((name: FieldName, raw: string) => {
    let value = raw;
    if (DIGIT_FIELDS.has(name)) value = value.replace(/\D/g, "");
    if (UPPER_FIELDS.has(name)) value = value.toUpperCase().replace(/\s/g, "");
 
    if (CHECKED_FIELDS.includes(name as CheckedField)) {
      setAsyncErrors(prev => (prev[name as CheckedField] ? { ...prev, [name]: undefined } : prev));
    }
 
    setValues(prev => {
      const next: EmployeeFormValues = { ...prev, [name]: value };
      // Cascading resets
      if (name === "CompanyID") {
        next.BranchID = "";
        next.ReportingManagerID = "";
      }
      if (name === "BranchID") next.ReportingManagerID = "";
      if (name === "DeptID") next.DesignationID = "";
      // ✅ FIXED: work email → Login access User ID (same mail)
      if (name === "Email") {
        next.UserID = value.trim();
      }
      return next;
    });
  }, []);
 
  const handleBlur = useCallback((name: ErrorKey) => {
    setTouched(prev => (prev.has(name) ? prev : new Set(prev).add(name)));
  }, []);
 
  /** Employee ID / Email uniqueness check. Runs only when the field is already format-valid. */
  const runIdentityCheck = useCallback(
    async (name: CheckedField, rawValue: string) => {
      const value = name === "Email" ? rawValue.trim().toLowerCase() : rawValue.trim();
      if (!value) {
        setAsyncErrors(prev => {
          const next = { ...prev };
          delete next[name];
          return next;
        });
        return;
      }
 
      setChecking(prev => ({ ...prev, [name]: true }));
      try {
        if (name === "EmployeeID") {
          if (checkEmployeeId) {
            const message = await checkEmployeeId(value);
            setAsyncErrors(prev => {
              const next = { ...prev };
              if (message) next.EmployeeID = message;
              else delete next.EmployeeID;
              return next;
            });
          } else if (checkEmployeeIdExists) {
            const exists = await checkEmployeeIdExists(value);
            setAsyncErrors(prev => {
              const next = { ...prev };
              if (exists) next.EmployeeID = "An employee already exists with this Employee ID.";
              else delete next.EmployeeID;
              return next;
            });
          }
        } else if (name === "Email" && checkEmailExists) {
          const exists = await checkEmailExists(value);
          setAsyncErrors(prev => {
            const next = { ...prev };
            if (exists) next.Email = "This email is already in use.";
            else delete next.Email;
            return next;
          });
        }
      } catch (err) {
        setAsyncErrors(prev => ({
          ...prev,
          [name]: err instanceof Error ? err.message : "Could not verify this right now.",
        }));
      } finally {
        setChecking(prev => ({ ...prev, [name]: false }));
      }
    },
    [checkEmployeeId, checkEmployeeIdExists, checkEmailExists],
  );
 
  const handleIdentityBlur = useCallback(
    (name: FieldName) => {
      handleBlur(name);
      if (!CHECKED_FIELDS.includes(name as CheckedField)) return;
      const checkedName = name as CheckedField;
      // Only hit the server once the field already passes its own format rules
      if (!validateField(name, values)) runIdentityCheck(checkedName, values[name]);
    },
    [handleBlur, values, runIdentityCheck],
  );
 
  const handleRegenerateCode = useCallback(() => {
    setValues(v => ({ ...v, Code: generateEmployeeCode() }));
    setTouched(prev => (prev.has("Code") ? prev : new Set(prev).add("Code")));
  }, []);
 
  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    setPhoto(e.target.files?.[0] ?? null);
    handleBlur("ProfilePhoto");
  };
 
  const bind = (name: FieldName): BoundProps => ({
    name,
    value: values[name],
    error: visibleError(name),
    onChange: handleChange,
    onBlur: CHECKED_FIELDS.includes(name as CheckedField) ? handleIdentityBlur : handleBlur,
  });
 
  /** Shared by the submit-without-onSave branch and the standalone Preview button */
  const buildPreviewDialog = (payload: CreateEmployeePayload): DialogState => {
    // Password is system-generated now — don't show it, even masked, in the preview.
    const visible = payload;
    return {
      title: "Employee ready to save",
      description: "This is the data that will be sent to the AddEmployee endpoint. A first-time password is generated automatically and isn't shown here.",
      body: JSON.stringify(visible, null, 2),
    };
  };
 
  /** Runs full validation; returns false (and updates status/focus) if the form isn't ready yet */
  const runFullValidation = (actionLabel: string): boolean => {
    setTouched(new Set<ErrorKey>([...FIELD_NAMES, "ProfilePhoto"]));
 
    const invalid = FIELD_ORDER.filter(k => errors[k]);
    if (invalid.length) {
      setStatus({
        text: `Fix ${invalid.length} ${invalid.length === 1 ? "field" : "fields"} to ${actionLabel}.`,
        bad: true,
      });
      document.getElementById(invalid[0])?.focus();
      return false;
    }
    if (isChecking) {
      setStatus({ text: "Still checking employee ID / email availability — try again in a moment.", bad: true });
      return false;
    }
    if (hasAsyncError) {
      const badField = CHECKED_FIELDS.find(f => asyncErrors[f]) ?? "EmployeeID";
      setStatus({ text: `Fix the ${badField === "EmployeeID" ? "employee ID" : "email"} before you ${actionLabel}.`, bad: true });
      document.getElementById(badField)?.focus();
      return false;
    }
    return true;
  };
 
  const handlePreview = () => {
    if (!runFullValidation("preview it")) return;
    const payload = buildPayload(values, photo, createdBy);
    setDialog(buildPreviewDialog(payload));
    setStatus({ text: "Preview generated. Nothing has been saved yet.", bad: false });
  };
 
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!runFullValidation("create the employee")) return;
 
    const payload = buildPayload(values, photo, createdBy);
 
    if (!onSave) {
      setDialog(buildPreviewDialog(payload));
      setStatus({ text: "All fields look good.", bad: false });
      return;
    }
 
    setSaving(true);
    setStatus({ text: "Creating employee…", bad: false });
    try {
      const result = await onSave(payload, photo);
      setDialog({
        kind: "success",
        title: "Employee created",
        description: `${result.fullName || result.FullName || "Employee"} can now sign in as ${result.userId || result.UserID || ""}.${result.emailSent === false ? " Their login email could not be sent — share the password with them manually." : ""}`,
        body: JSON.stringify(result, null, 2),
      });
      setStatus({ text: `Employee ${result.employeeId} created.`, bad: false });
    } catch (err) {
      setStatus({ text: err instanceof Error ? err.message : "Employee could not be created.", bad: true });
    } finally {
      setSaving(false);
    }
  };
 
  const clearForm = () => {
    const employeeRole =
      masterData.roles.find(
        (r) => String(r.name).trim().toLowerCase() === "employee",
      ) ||
      masterData.roles.find((r) =>
        String(r.name).trim().toLowerCase().includes("employee"),
      );
    setValues({
      ...EMPTY_VALUES,
      Code: generateEmployeeCode(),
      RoleID: employeeRole ? String(employeeRole.id) : "",
    });
    setPhoto(null);
    setPhotoUrl(null);
    setTouched(new Set());
    setStatus({ text: "", bad: false });
    setAsyncErrors({});
    setChecking({});
    if (fileRef.current) fileRef.current.value = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
 
  const handleReset = () => {
    if (!window.confirm("Clear everything you've entered?")) return;
    clearForm();
  };
 
  const handleDialogDone = () => {
    const wasSuccess = dialog?.kind === "success";
    setDialog(null);
    if (wasSuccess) clearForm();
  };
 
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(dialog?.body ?? "");
      setCopyLabel("Copied");
    } catch {
      setCopyLabel("Copy failed");
    }
    window.setTimeout(() => setCopyLabel("Copy JSON"), 1600);
  };
 
  /* ---------- Render ---------- */
 
  const companyChosen = !!values.CompanyID;
  const branchChosen = !!values.BranchID;
  const deptChosen = !!values.DeptID;
 
  return (
    <div className="text-[15px] leading-normal text-[#1B2230]">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-start gap-8 overflow-visible pb-6 md:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="sticky top-4 z-[5] flex max-h-[calc(100vh-32px)] flex-col gap-4 self-start overflow-y-auto">
          <IdCard
            firstName={values.FirstName.trim()}
            lastName={values.LastName.trim()}
            designation={nameOf(masterData.designations, values.DesignationID)}
            employeeId={values.EmployeeID.trim()}
            department={nameOf(masterData.departments, values.DeptID)}
            branch={nameOf(masterData.branches, values.BranchID)}
            grade={values.Grade}
            joined={formatDate(values.DOJ)}
            photoUrl={photoUrl}
          />
          <Progress items={progress} />
        </aside>
 
        <form onSubmit={handleSubmit} noValidate>
          <Section config={SECTIONS[0]}>
            <TextField
              {...bind("EmployeeID")}
              maxLength={10}
              placeholder="EMP1001"
              hint={checking.EmployeeID ? "Checking availability…" : undefined}
            />
            {/* <FieldShell
              name="Code"
              label={RULES.Code.label}
              required={RULES.Code.required}
              hint="Generated automatically. Click Regenerate for a different one."
              error={visibleError("Code")}
            >
              <div className="relative flex items-center">
                <input
                  id="Code"
                  name="Code"
                  className="w-full min-h-11 rounded-md border border-[#D3D9E2] bg-white px-3 py-2.5 text-[#1B2230] outline-none focus:border-[var(--theme-primary,#1F5C7A)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#1F5C7A)_20%,transparent)] disabled:cursor-not-allowed disabled:opacity-55 pr-12"
                  value={values.Code}
                  readOnly
                  aria-invalid={!!visibleError("Code")}
                  aria-describedby={describedBy("Code", "hint", visibleError("Code"))}
                />
                <button type="button" className="pw-toggle" onClick={handleRegenerateCode}>
                  Regenerate
                </button>
              </div>
            </FieldShell> */}
 
 
 
 
 
            <FieldShell
              name="Code"
              label={RULES.Code.label}
              required={RULES.Code.required}
              hint="Generated automatically. Click refresh for a different one."
              error={visibleError("Code")}
            >
              <div className="relative flex w-full items-center">
                <input
                  id="Code"
                  name="Code"
                  readOnly
                  value={values.Code}
                  aria-invalid={!!visibleError("Code")}
                  aria-describedby={describedBy("Code", "hint", visibleError("Code"))}
                  className="w-full min-h-11 rounded-md border border-[#D3D9E2] bg-white px-3 py-2.5 pr-12 text-[#1B2230] outline-none focus:border-[var(--theme-primary,#1F5C7A)] focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--theme-primary,#1F5C7A)_20%,transparent)]"
                />
                <button
                  type="button"
                  className="absolute right-1.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md border border-[#D3D9E2] bg-white text-[var(--theme-primary,#1F5C7A)] hover:bg-[var(--theme-light,#E1EDF3)]"
                  onClick={handleRegenerateCode}
                  aria-label="Regenerate employee code"
                  title="Regenerate"
                >
                  <RefreshCw size={16} strokeWidth={2} />
                </button>
              </div>
            </FieldShell>
            <TextField {...bind("FirstName")} maxLength={100} autoComplete="given-name" />
            <TextField {...bind("LastName")} maxLength={100} autoComplete="family-name" />
            <FieldShell name="FullName" label="Full Name" required hint="Fills in automatically from First name + Last name.">
              <input id="FullName" name="FullName" value={fullName} readOnly tabIndex={-1} placeholder="—" className="w-full min-h-11 rounded-md border border-[#D3D9E2] bg-[#F4F8FE] px-3 py-2.5 text-[#1B2230]" />
            </FieldShell>
            <DateFieldControl
              name="DOB"
              value={values.DOB}
              onCommit={v => handleChange("DOB", v)}
              onFieldBlur={() => handleBlur("DOB")}
              error={visibleError("DOB")}
              maxIso={todayISO()}
            />
            <SelectField {...bind("GenderID")} options={masterData.genders} />
            <SelectField {...bind("MaritalStatusID")} options={masterData.maritalStatuses} />
            <FieldShell
              name="ProfilePhoto"
              label="Profile photo"
              hint="JPG, PNG or WebP, up to 2 MB."
              error={visibleError("ProfilePhoto")}
              full
            >
              <div
                className={`flex min-h-11 items-center gap-3 rounded-md border bg-white px-3 py-2 ${
                  visibleError("ProfilePhoto") ? "border-[#B42318]" : "border-[#D3D9E2]"
                }`}
              >
                <input
                  ref={fileRef}
                  id="ProfilePhoto"
                  name="ProfilePhoto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={handlePhoto}
                  aria-invalid={!!visibleError("ProfilePhoto")}
                  aria-describedby={describedBy("ProfilePhoto", "hint", visibleError("ProfilePhoto"))}
                />
                <button
                  type="button"
                  className="shrink-0 cursor-pointer rounded-md border border-[#D3D9E2] bg-[#F4F8FE] px-3 py-1.5 text-sm font-semibold text-[#1B2230] hover:bg-[#E8EEF5]"
                  onClick={() => fileRef.current?.click()}
                >
                  {photo ? "Change photo" : "Choose file"}
                </button>
                <span className="min-w-0 flex-1 truncate text-sm text-[#5A6376]">
                  {photo ? photo.name : "No file chosen"}
                </span>
                {photo && (
                  <button
                    type="button"
                    className="shrink-0 cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-[#B42318] hover:bg-[#FDF0EE]"
                    onClick={() => {
                      setPhoto(null);
                      if (fileRef.current) fileRef.current.value = "";
                      handleBlur("ProfilePhoto");
                    }}
                    aria-label="Remove photo"
                  >
                    Remove
                  </button>
                )}
              </div>
            </FieldShell>
          </Section>
 
          <Section config={SECTIONS[1]}>
            <SelectField {...bind("CompanyID")} options={masterData.companies} />
            <SelectField {...bind("BranchID")} options={branches} disabled={!companyChosen} />
            <SelectField {...bind("DeptID")} options={masterData.departments} />
            <SelectField {...bind("DesignationID")} options={designations} disabled={!deptChosen} />
            <SelectField
              {...bind("RoleID")}
              options={masterData.roles}
              hint="Controls what this person can see and do after signing in."
            />
            <SelectField
              {...bind("ReportingManagerID")}
              options={managers}
              disabled={!branchChosen || managers.length === 0}
            />
            <SelectField {...bind("Grade")} options={masterData.grades} />
            <SelectField {...bind("EmploymentTypeID")} options={masterData.employmentTypes} />
            <SelectField {...bind("EmploymentStatusID")} options={masterData.employmentStatuses} />
            <DateFieldControl
              name="DOJ"
              value={values.DOJ}
              onCommit={v => handleChange("DOJ", v)}
              onFieldBlur={() => handleBlur("DOJ")}
              error={visibleError("DOJ")}
              minIso={values.DOB || undefined}
            />
          </Section>
 
          <Section config={SECTIONS[2]}>
            <TextField
              {...bind("Email")}
              type="email"
              maxLength={150}
              placeholder="name@company.com"
              hint={checking.Email ? "Checking availability…" : undefined}
            />
            <TextField {...bind("AlternateEmailId")} type="email" maxLength={150} />
            <TextField {...bind("Mobileno")} type="tel" inputMode="numeric" maxLength={10} placeholder="9876543210" />
            <TextField {...bind("AltMobileNo")} type="tel" inputMode="numeric" maxLength={10} />
            <TextField {...bind("EmergencyNo")} type="tel" inputMode="numeric" maxLength={10} />
          </Section>
 
          <Section config={SECTIONS[3]}>
            <TextField {...bind("AadhaarNumber")} inputMode="numeric" maxLength={12} placeholder="12 digits" />
            <TextField {...bind("PANNumber")} maxLength={10} placeholder="ABCDE1234F" />
            <TextField {...bind("UANNumber")} inputMode="numeric" maxLength={12} placeholder="12 digits" />
            <TextField {...bind("PFNumber")} maxLength={30} placeholder="TSHYD1234567000001234" />
          </Section>
 
          <Section config={SECTIONS[4]}>
            <TextField
              {...bind("UserID")}
              maxLength={100}
              placeholder="Same as work email"
              hint="Leave blank to sign in with the work email."
              full
            />
          </Section>
 
          <div className="static z-auto mt-2 rounded-[14px] border border-[#D3D9E2] bg-white px-6 py-3.5">
            <div className="flex flex-wrap items-center justify-end gap-3">
              <span className={`mr-auto text-sm ${status.bad ? "font-semibold text-[#B42318]" : "text-[#5A6376]"}`} role="status">{status.text}</span>
              <button type="button" className="min-h-11 cursor-pointer rounded-md border border-[#D3D9E2] bg-transparent px-5 py-2.5 font-semibold text-[#1B2230] hover:bg-[#F4F8FE] disabled:cursor-progress disabled:opacity-60" onClick={handlePreview} disabled={saving}>
                Preview
              </button>
              <button type="button" className="min-h-11 cursor-pointer rounded-md border border-[#D3D9E2] bg-transparent px-5 py-2.5 font-semibold text-[#1B2230] hover:bg-[#F4F8FE] disabled:cursor-progress disabled:opacity-60" onClick={handleReset} disabled={saving}>
                Clear form
              </button>
              <button type="submit" className="min-h-11 cursor-pointer rounded-md border border-[var(--theme-primary,#1F5C7A)] bg-[var(--theme-primary,#1F5C7A)] px-5 py-2.5 font-semibold text-white hover:brightness-110 disabled:cursor-progress disabled:opacity-60" disabled={saving}>
                {saving ? "Creating…" : "Create employee"}
              </button>
            </div>
          </div>
        </form>
      </div>
 
      {/* Full-page loader while creating employee */}
      {saving && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(15,23,42,0.5)] backdrop-blur-[2px]"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div className="mx-4 flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl border border-white/20 bg-white px-8 py-10 shadow-2xl">
            <div
              className="h-14 w-14 animate-spin rounded-full border-[3px] border-[#E2E8F0] border-t-[var(--theme-primary,#2563EB)]"
              aria-hidden
            />
            <div className="text-center">
              <p className="m-0 text-lg font-bold text-[#1B2230]">Creating employee</p>
              <p className="mt-1.5 mb-0 text-sm text-[#5A6376]">Saving details and sending login email…</p>
            </div>
          </div>
        </div>
      )}
 
      <dialog
        ref={dialogRef}
        className="fixed left-1/2 top-1/2 z-[110] m-0 w-[min(440px,calc(100%-32px))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-none bg-transparent p-0 text-[#1B2230] shadow-none open:flex open:flex-col backdrop:bg-[rgba(15,23,42,0.5)] backdrop:backdrop-blur-[2px]"
        aria-labelledby="dlgTitle"
        onClose={handleDialogDone}
      >
        {dialog && (
          <div className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-2xl">
            {dialog.kind === "success" ? (
              <>
                <div className="bg-gradient-to-r from-[var(--theme-primary,#2563EB)] to-[#00C2FF] px-6 pb-6 pt-7 text-center text-white">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-3xl" aria-hidden>
                    ✓
                  </div>
                  <h2 id="dlgTitle" className="m-0 text-xl font-bold tracking-tight">{dialog.title}</h2>
                  <p className="mt-2 mb-0 text-sm text-white/90">{dialog.description}</p>
                </div>
                <div className="space-y-3 px-6 py-5 text-sm text-[#5A6376]">
                  <p className="m-0 leading-relaxed">
                    Login credentials have been sent to the work email. The employee can sign in and change the password on first login.
                  </p>
                  {dialog.body && (
                    <details className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC]">
                      <summary className="cursor-pointer select-none px-3 py-2 text-xs font-semibold text-[#64748B]">
                        Technical details
                      </summary>
                      <pre className="m-0 max-h-40 overflow-auto border-t border-[#E2E8F0] p-3 text-[11px] leading-snug text-[#334155]">{dialog.body}</pre>
                    </details>
                  )}
                </div>
                <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
                  <button
                    type="button"
                    className="min-h-11 cursor-pointer rounded-lg border border-[#D3D9E2] bg-white px-5 py-2.5 text-sm font-semibold text-[#1B2230] hover:bg-[#F4F8FE]"
                    onClick={handleCopy}
                  >
                    {copyLabel}
                  </button>
                  <button
                    type="button"
                    className="min-h-11 cursor-pointer rounded-lg border border-[var(--theme-primary,#2563EB)] bg-[var(--theme-primary,#2563EB)] px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                    onClick={() => dialogRef.current?.close()}
                  >
                    Done
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-6 pt-6">
                  <h2 id="dlgTitle" className="mb-1 mt-0 text-xl font-bold">{dialog.title}</h2>
                  <p className="m-0 text-sm text-[#5A6376]">{dialog.description}</p>
                </div>
                <pre className="mx-6 my-4 max-h-[40vh] overflow-auto rounded-lg bg-[#F4F8FE] p-4 text-[13px] leading-snug">{dialog.body}</pre>
                <div className="flex justify-end gap-2 border-t border-[#E2E8F0] px-6 py-4">
                  <button
                    type="button"
                    className="min-h-11 cursor-pointer rounded-lg border border-[#D3D9E2] bg-white px-5 py-2.5 text-sm font-semibold text-[#1B2230] hover:bg-[#F4F8FE]"
                    onClick={handleCopy}
                  >
                    {copyLabel}
                  </button>
                  <button
                    type="button"
                    className="min-h-11 cursor-pointer rounded-lg border border-[var(--theme-primary,#2563EB)] bg-[var(--theme-primary,#2563EB)] px-6 py-2.5 text-sm font-semibold text-white hover:brightness-110"
                    onClick={() => dialogRef.current?.close()}
                  >
                    Done
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </dialog>
    </div>
  );
}