import React, {useEffect,useMemo,useRef,useState,} from "react";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import EnrollmentTabs from "../components/EnrollmentTabs";
import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";
import noDataImage from "../../../../../assets/images/no-data.png";
import {
  useGetEmployeeDetailQuery,
  type EmployeeDetailData,
} from "../api/employeedetailsApi";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Plus,
  Bookmark,
  CalendarDays,
  UploadCloud,
  History,
  ArrowRight,
  Pencil,
  Download,
  Trash2,
  FileText,
  Info,
} from "lucide-react";

/* ============================================================================
   TYPES
============================================================================ */

export interface EmployeeFormData {
  /* General */
  prefix: string;
  employeeId: string;
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  gender: string;
  dateOfBirth: string;

  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  dateOfJoining: string;
  dateOfSalary: string;
  probationPeriod: string;
  probationCompletionDate: string;

  photoName: string;
  confirmationDate: string;
  notes: string;
  physicallyChallenged: boolean;

  /* Classification */
  effectiveFrom: string;
  branch: string;
  salaryStructure: string;
  leavePolicy: string;
  attendanceStructure: string;
  costCenter: string;
  taPolicy: string;
  designation: string;
  bank: string;
  accountNo: string;
  ifscCode: string;
  department: string;
  team: string;

  /* Statutory */
  aadharNo: string;
  tdsApplicable: boolean;
  financialYear: string;
  pan: string;
  pfNumber: string;
  departmentFileNo: string;
  uan: string;
  esiNo: string;
  statutoryEffectiveFrom: string;
  pfApplicable: boolean;
  pfVoluntary: boolean;
  zeroPension: boolean;
  restrictEmployeePf: boolean;
  restrictEmployerPf: boolean;
  zeroPt: boolean;
  esiApplicable: boolean;
  internationalWorker: boolean;
  lwfApplicable: boolean;

  /* Address */
  present: AddressBlock;
  permanent: AddressBlock;
  mobileNo: string;
  altMobileNo: string;
  officialEmail: string;
  alternateEmail: string;
  emergencyNo: string;

  /* HR Category - Personal */
  bloodGroup: string;
  casteCategory: string;
  qualification: string;
  nationality: string;
  drivingLicNo: string;

  /* Documents */
  fetchDocumentsFrom: string;
  documents: DocumentRow[];

  /* Salary Rate */
  earnings: Record<string, string>;
  deductions: Record<string, string>;
  lumpsumFromDate: string;
  annualCtc: string;
}

export interface AddressBlock {
  residentialNo: string;
  residentialName: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface DocumentRow {
  id: string;
  type: string;
  fileName: string;
  description: string;
}

interface AddEmployeeWizardProps {
  /** Modal mode only. Leave undefined when used as a route element. */
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (data: EmployeeFormData) => void;
  initialData?: Partial<EmployeeFormData>;
}

/* ============================================================================
   STEPS
============================================================================ */

const STEPS = [
  "General",
  "Classification",
  "Statutory",
  "Address",
  "HR/Category",
  "Documents",
  "Salary Req",
] as const;

type Step = (typeof STEPS)[number];

/* ============================================================================
   OPTION LISTS  —  STATIC PLACEHOLDER DATA
   ----------------------------------------------------------------------------
   ⚠ BACKEND TEAM: every array below is fake data so the UI has something to
   show while there is no API yet. None of it is wired to a server. When a
   real endpoint exists for a field, replace ONLY that array's contents with
   the fetched list — the JSX that renders the dropdown does not need to
   change, since it just reads from this constant.

   Suggested pattern for wiring later (per field):

     const [BRANCHES, setBranches] = useState<string[]>([]);
     useEffect(() => {
       api.get("/enrollment/masterdata/branches")
         .then((res) => setBranches(res.data.map((b) => b.name)))
         .catch(() => setBranches([])); // keep UI usable if the call fails
     }, []);

   Each field below is tagged with [WIRE: <suggested endpoint>] so whoever
   connects the backend can find every spot without reading the whole file.
============================================================================ */

const PREFIXES = ["Mr", "Ms", "Mrs", "Dr"]; // [WIRE: GET /enrollment/masterdata/prefixes]
const TITLES = ["Ms.", "Ms", "Mr", "MRS", "Y", "MR", "MS", "Mrs", "Miss"]; // [WIRE: GET /enrollment/masterdata/titles]
const GENDERS = ["Male", "Female", "Transgender"]; // [WIRE: GET /enrollment/masterdata/genders]
const MARITAL_STATUS = ["Unmarried", "Married", "Divorced", "Widowed"]; // [WIRE: GET /enrollment/masterdata/marital-status]

const BRANCHES = [
  // [WIRE: GET /enrollment/masterdata/branches]
  "Koundinyasa Technology Services Pvt. Ltd.",
  "Hyderabad Head Office",
  "Bangalore Development Center",
  "Visakhapatnam Branch",
];

const SALARY_STRUCTURES = [
  // [WIRE: GET /enrollment/masterdata/salary-structures]
  "CTC Salary Structure",
  "New Salary Structure",
  "Salary structure",
  "Test Structure",
  "Test Structure 2",
  "TEST3",
];

const LEAVE_POLICIES = [
  // [WIRE: GET /enrollment/masterdata/leave-policies]
  "Employee Leave Policy",
  "Permanent Employee Policy",
  "Intern Leave Policy",
];

const ATTENDANCE_STRUCTURES = ["Daily", "Monthly", "Shift Based"]; // [WIRE: GET /enrollment/masterdata/attendance-structures]
const COST_CENTERS = ["Delivery", "Support", "R&D"]; // [WIRE: GET /enrollment/masterdata/cost-centers]
const TA_POLICIES = ["General Policy", "Shift Policy", "Flexi Policy"]; // [WIRE: GET /enrollment/masterdata/ta-policies]

const DESIGNATIONS = [
  // [WIRE: GET /enrollment/masterdata/designations]
  "ASSOCIATE SOFTWARE ENGINEER",
  "BUSSINESS DEVELOPMENT EXECUTIVE",
  "BUSSINESS DEVELOPMENT MANAGER",
  "Cloud DevOps Engineer",
  "Data Analyst",
  "Devops Engineer",
  "Flutter Developer",
  "HR EXECUTIVE",
  "HR MANAGER",
  "HR RECRUITER",
  "OFFICE BOY",
  "PROJECT LEAD",
  "PROJECT MANAGER",
  "Quality Analyst",
  "React Developer",
  "Senior QA Engineer",
  "Senior Security Test Engineer",
  "Senior Software Engineer",
  "Senior Test Engineer",
  "SOFTWARE DEVELOPER",
  "SOFTWARE ENGINEER",
  "TEAM LEAD",
];

const BANKS = ["IDBI Bank", "HDFC Bank", "ICICI Bank", "State Bank of India"]; // [WIRE: GET /enrollment/masterdata/banks]
const DEPARTMENTS = ["Engineering", "Human Resources", "Finance", "Sales"]; // [WIRE: GET /enrollment/masterdata/departments]
const TEAMS = ["Shouryas", "Dhanvis", "Shared Resources", "Vaidhes", "Virat"]; // [WIRE: GET /enrollment/masterdata/teams]

const FINANCIAL_YEARS = ["2024-2025", "2025-2026", "2026-2027", "2027-2028"]; // [WIRE: GET /enrollment/masterdata/financial-years]

const STATES = [
  // [WIRE: GET /enrollment/masterdata/states — India state list, usually static enough to keep hardcoded]

  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli",
  "Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

const BLOOD_GROUPS = [
  // [WIRE: GET /enrollment/masterdata/blood-groups]
  "A +ve",
  "A -ve",
  "AB +ve",
  "AB -ve",
  "B +ve",
  "B -ve",
  "O +ve",
  "O -ve",
  "A1 +ve",
  "A1 -ve",
  "A2B +ve",
  "A1B +ve",
  "A1B -ve",
  "A2 +ve",
  "A2 -ve",
  "A2B -ve",
  "B1 +ve",
  "B1 -ve",
];

const QUALIFICATIONS = [
  // [WIRE: GET /enrollment/masterdata/qualifications]
  "Below Secondary Education",
  "Secondary Education",
  "Diploma",
  "Under Graduate",
  "Graduate",
  "Post Graduate",
  "PhD",
  "Others",
];

const HR_CATEGORIES = [
  // [WIRE: GET /enrollment/employeedetails/hr-category-types — also each row's
  //  Family/Education/Training/etc records need their own CRUD endpoints,
  //  since "Multiple" categories currently show an empty state with no data]
  { label: "Personal", kind: "Single" },
  { label: "Passport", kind: "Single" },
  { label: "Family", kind: "Multiple" },
  { label: "Education", kind: "Multiple" },
  { label: "Training", kind: "Multiple" },
  { label: "Accident", kind: "Multiple" },
  { label: "Disciplinary Actions", kind: "Multiple" },
  { label: "Extracurricular Event", kind: "Multiple" },
] as const;

const DOCUMENT_TYPES = [
  // [WIRE: GET /enrollment/employeedetails/document-types]
  { label: "Aadhar", required: true },
  { label: "PAN Card", required: false },
  { label: "Passport", required: false },
  { label: "Driving License", required: false },
  { label: "High school education", required: false },
  { label: "Senior secondary/ Diploma", required: false },
  { label: "Graduation certificate", required: false },
  { label: "Post graduation certificate", required: false },
  { label: "Experience letter", required: false },
  { label: "Relieving letter", required: false },
  { label: "Last 3 month's pay slips", required: false },
  { label: "Form 16", required: false },
  { label: "Resume", required: false },
];

const EARNING_HEADS = [
  "Basic",
  "Special Allow",
  "HRA",
  "Annual CTC",
  "Monthly CTC",
  "Holiday Allow",
  "Food Wallet",
  "Compensatory Al",
  "Net Monthly",
];

const DEDUCTION_HEADS = ["Other Deduction", "Medical Benefit", "Employer PF"];

/* ============================================================================
   SHARED CLASSNAMES
============================================================================ */

const CARD =
  // "rounded-[8px] border border-[#E7ECF2] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]";
  "rounded-[8px] border border-[#E2E2E2] bg-white shadow-[0_1px_2px_rgba(19,19,19,0.06)]";

// const LABEL = "mb-[6px] block text-[12.5px] font-normal text-[#475467]";



const LABEL = "mb-[6px] block text-[12.5px] font-medium text-[#626262]";

// const INPUT_BASE =
//   "h-[44px] w-full rounded-[6px] border bg-white px-[12px] text-[13.5px] text-[#27364D] outline-none transition-colors placeholder:text-[#8592A6] disabled:cursor-not-allowed";



const INPUT_BASE =
  "h-[44px] w-full rounded-[6px] border bg-white px-[12px] text-[13.5px] text-[#131313] outline-none transition-colors placeholder:text-[#626262] disabled:cursor-not-allowed";
const INPUT_IDLE = "border-[#E3E8EF] focus:border-[#F97316]";
const INPUT_ERROR = "border-[#DD3232] focus:border-[#DD3232]";

// /** cream / read-only look used for Employee ID, Full Name, Spouse Name */
// const INPUT_COMPUTED = "bg-[#FDF8EC] border-[#EDE3CE] text-[#4A4132]";



const INPUT_COMPUTED = "bg-[#FFF5EE] border-[#E2E2E2] text-[#131313]";



// const ERROR_TEXT = "mt-[5px] block text-[11.5px] text-[#E5484D]";

const ERROR_TEXT = "mt-[5px] block text-[11.5px] text-[#DD3232]";

// const SECTION_HEAD =
//   "flex h-[42px] items-center justify-center rounded-[6px] bg-[#DCEAF7] px-[14px] text-[13.5px] font-medium text-[#27364D]";


const SECTION_HEAD =
  "flex h-[42px] items-center justify-center rounded-[6px] bg-[#FFF5EE] px-[14px] text-[13.5px] font-medium text-[#131313]";

/* ============================================================================
   DATE HELPERS  (dd-mm-yyyy everywhere, matching the recording)
============================================================================ */

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatDate(d: Date) {
  return `${pad(d.getDate())}-${pad(d.getMonth() + 1)}-${d.getFullYear()}`;
}

function parseDate(value: string): Date | null {
  if (!value) return null;
  const parts = value.split("-");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map((p) => Number(p));
  if (!dd || !mm || !yyyy) return null;
  const d = new Date(yyyy, mm - 1, dd);
  return Number.isNaN(d.getTime()) ? null : d;
}

function addDays(value: string, days: number) {
  const d = parseDate(value);
  if (!d) return "";
  d.setDate(d.getDate() + days);
  return formatDate(d);
}

/**
 * The backend sends dates as ISO strings ("2024-05-01" / "2024-05-01T00:00:00.000Z"),
 * but every date field in this form is stored/displayed as "DD-MM-YYYY" (see
 * formatDate/parseDate above). Convert incoming API dates to that shape so
 * prefilled fields render correctly instead of showing "Invalid Date".
 */
function apiDateToFormDate(value: string | null | undefined): string {
  if (!value) return "";
  // Already in DD-MM-YYYY form (defensive, in case backend changes shape later)
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) return value;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return formatDate(d);
}

/* ============================================================================
   VALIDATORS
============================================================================ */

const REQUIRED_MSG = "Field Required";

const isBlank = (v: string) => !v || !v.trim();

/** City must be letters / spaces / hyphens - "4444" is rejected in the video. */
const isValidCity = (v: string) => /^[A-Za-z][A-Za-z\s.'-]*$/.test(v.trim());

const isValidPan = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim());

const isDigits = (v: string, len: number) =>
  new RegExp(`^\\d{${len}}$`).test(v.trim());

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/* ============================================================================
   PRIMITIVES
============================================================================ */

const Field: React.FC<{
  label?: string;
  required?: boolean;
  error?: string;
  action?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ label, required, error, action, className = "", children }) => (
  <div className={className}>
    {(label || action) && (
      <div className="flex items-baseline justify-between">
        <label className={LABEL}>
          {label}
          {required && <span className="ml-[2px] text-[#E5484D]">*</span>}
        </label>
        {action}
      </div>
    )}
    {children}
    {error && <span className={ERROR_TEXT}>{error}</span>}
  </div>
);

const TextInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
  computed?: boolean;
  disabled?: boolean;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "email" | "tel";
  uppercase?: boolean;
  suffix?: React.ReactNode;
}> = ({
  value,
  onChange,
  placeholder,
  error,
  computed,
  disabled,
  maxLength,
  inputMode = "text",
  uppercase,
  suffix,
}) => (
  <div className="relative">
    <input
      value={value}
      disabled={disabled}
      maxLength={maxLength}
      inputMode={inputMode}
      placeholder={placeholder}
      onChange={(e) =>
        onChange(uppercase ? e.target.value.toUpperCase() : e.target.value)
      }
      className={[
        INPUT_BASE,
        error ? INPUT_ERROR : INPUT_IDLE,
        computed ? INPUT_COMPUTED : "",
        suffix ? "pr-[34px]" : "",
      ].join(" ")}
    />
    {suffix && (
      <span className="absolute right-[10px] top-1/2 -translate-y-1/2">
        {suffix}
      </span>
    )}
  </div>
);

const TextArea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}> = ({ value, onChange, rows = 5 }) => (
  <textarea
    rows={rows}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full resize-none rounded-[6px] border border-[#E3E8EF] bg-white px-[12px] py-[10px] text-[13.5px] text-[#27364D] outline-none transition-colors focus:border-[#F97316]"
  />
);

/** Select with the sticky "Add New ..." footer seen in the recording. */
const SelectInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  addNewLabel?: string;
  onAddNew?: () => void;
  computed?: boolean;
  /** shows an X button to clear the value, like Title in the recording */
  clearable?: boolean;
}> = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  error,
  disabled,
  addNewLabel,
  onAddNew,
  computed,
  clearable,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className={[
          INPUT_BASE,
          "flex items-center justify-between text-left",
          error ? INPUT_ERROR : open ? "border-[#F97316]" : INPUT_IDLE,
          computed ? INPUT_COMPUTED : "",
          disabled ? "bg-[#F6F8FA] text-[#626262]" : "",
        ].join(" ")}
      >
        <span className={value ? "text-[#27364D]" : "text-[#626262]"}>
          {value || placeholder}
        </span>
        <span className="flex shrink-0 items-center gap-[6px]">
          {clearable && value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="text-[#697586] hover:text-[#475467]"
            >
              <X size={14} />
            </span>
          )}
          {open ? (
            <ChevronUp size={16} className="text-[#697586]" />
          ) : (
            <ChevronDown size={16} className="text-[#697586]" />
          )}
        </span>
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[48px] z-40 max-h-[250px] overflow-y-auto rounded-[6px] border border-[#E3E8EF] bg-white py-[4px] shadow-[0_8px_24px_rgba(16,24,40,0.12)]">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={[
                "block w-full px-[14px] py-[9px] text-left text-[13.5px] hover:bg-[#F2F7FD]",
                opt === value ? "bg-[#FFF1E6] text-[#27364D]" : "text-[#475467]",
              ].join(" ")}
            >
              {opt}
            </button>
          ))}

          {addNewLabel && (
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onAddNew?.();
              }}
              className="block w-full border-t border-[#EDF1F6] px-[14px] py-[10px] text-left text-[13.5px] font-medium text-[#FF6200] hover:bg-[#F2F7FD]"
            >
              {addNewLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/** dd-mm-yyyy field with the month / year / day popover from the recording. */
const DateInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  error?: boolean;
  computed?: boolean;
  disabled?: boolean;
  placeholder?: string;
}> = ({ value, onChange, error, computed, disabled, placeholder = "dd-mm-yyyy" }) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"days" | "months" | "years">("days");
  const [cursor, setCursor] = useState(() => parseDate(value) ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setView("days");
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  useEffect(() => {
    const parsed = parseDate(value);
    if (parsed) setCursor(parsed);
  }, [value]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const selected = parseDate(value);
  const yearBlockStart = Math.floor(year / 12) * 12;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={[
          INPUT_BASE,
          "flex items-center justify-between text-left",
          error ? INPUT_ERROR : open ? "border-[#F97316]" : INPUT_IDLE,
          computed ? INPUT_COMPUTED : "",
          disabled ? "bg-[#F6F8FA]" : "",
        ].join(" ")}
      >
        <span className={value ? "text-[#27364D]" : "text-[#8592A6]"}>
          {value || placeholder}
        </span>
        <CalendarDays size={16} className="shrink-0 text-[#626262]" />
      </button>

      {open && (
        <div className="absolute left-0 top-[48px] z-50 w-[272px] rounded-[8px] border border-[#E3E8EF] bg-white p-[10px] shadow-[0_12px_32px_rgba(16,24,40,0.16)]">
          <div className="mb-[8px] flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(
                    view === "years" ? year - 12 : year,
                    view === "days" ? month - 1 : month,
                    1
                  )
                )
              }
              className="flex h-[26px] w-[26px] items-center justify-center rounded text-[#667085] hover:bg-[#F2F7FD]"
            >
              <ChevronLeft size={15} />
            </button>

            <button
              type="button"
              onClick={() =>
                setView(view === "days" ? "months" : view === "months" ? "years" : "days")
              }
              className="rounded px-[8px] py-[3px] text-[13px] font-medium text-[#27364D] hover:bg-[#F2F7FD]"
            >
              {view === "days"
                ? `${MONTHS[month]} ${year}`
                : view === "months"
                ? year
                : `${yearBlockStart} - ${yearBlockStart + 11}`}
            </button>

            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(
                    view === "years" ? year + 12 : year,
                    view === "days" ? month + 1 : month,
                    1
                  )
                )
              }
              className="flex h-[26px] w-[26px] items-center justify-center rounded text-[#667085] hover:bg-[#F2F7FD]"
            >
              <ChevronLeft size={15} className="rotate-180" />
            </button>
          </div>

          {view === "days" && (
            <>
              <div className="grid grid-cols-7 gap-[2px]">
                {WEEKDAYS.map((w) => (
                  <div
                    key={w}
                    className="flex h-[28px] items-center justify-center text-[11px] font-medium text-[#697586]"
                  >
                    {w}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-[2px]">
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`blank-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const isSelected =
                    selected &&
                    selected.getDate() === day &&
                    selected.getMonth() === month &&
                    selected.getFullYear() === year;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        onChange(formatDate(new Date(year, month, day)));
                        setOpen(false);
                      }}
                      className={[
                        "flex h-[30px] items-center justify-center rounded text-[12.5px]",
                        isSelected
                          ? "bg-[#F97316] font-semibold text-white"
                          : "text-[#626262] hover:bg-[#F2F7FD]",
                      ].join(" ")}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {view === "months" && (
            <div className="grid grid-cols-3 gap-[4px]">
              {MONTHS.map((m, i) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setCursor(new Date(year, i, 1));
                    setView("days");
                  }}
                  className={[
                    "rounded py-[9px] text-[12.5px]",
                    i === month
                      ? "bg-[#FFF1E6] font-medium text-[#F97316]"
                      : "text-[#475467] hover:bg-[#F2F7FD]",
                  ].join(" ")}
                >
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {view === "years" && (
            <div className="grid grid-cols-3 gap-[4px]">
              {Array.from({ length: 12 }).map((_, i) => {
                const y = yearBlockStart + i;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => {
                      setCursor(new Date(y, month, 1));
                      setView("months");
                    }}
                    className={[
                      "rounded py-[9px] text-[12.5px]",
                      y === year
                        ? "bg-[#FFF1E6] font-medium text-[#F97316]"
                        : "text-[#475467] hover:bg-[#F2F7FD]",
                    ].join(" ")}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const CheckBox: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  disabled?: boolean;
}> = ({ checked, onChange, label, disabled }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className="flex items-center gap-[10px] py-[7px] text-left disabled:cursor-not-allowed"
  >
    <span
      className={[
        "flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[3px] border transition-colors",
        checked
          ? "border-[#F97316] bg-[#F97316] text-white"
          : "border-[#C9D2DD] bg-white",
        disabled ? "opacity-45" : "",
      ].join(" ")}
    >
      {checked && <Check size={12} strokeWidth={3.2} />}
    </span>
    <span
      className={[
        "text-[13.5px]",
        disabled ? "text-[#8592A6]" : "text-[#475467]",
      ].join(" ")}
    >
      {label}
    </span>
  </button>
);

/* ============================================================================
   ⚠ BACKEND TEAM — WIRE HERE: file upload (photo + every document).
   ----------------------------------------------------------------------------
   `onPick` below only receives a FILE NAME string, not the file's bytes, and
   stores that name in form state (see `photoName` in EmployeeFormData and
   `DocumentRow.fileName`). Nothing is actually uploaded anywhere yet.

   When an upload endpoint exists, the caller of `onPick` needs the raw
   File object too — change `onPick: (fileName: string) => void` to
   `onPick: (file: File) => void`, then at each call site do something like:

     uploadEmployeeFile(file)                 // POST .../employees/files (or similar)
       .unwrap()
       .then((res) => set("photoName", res.url));

   `useUploadEmployeeDetailsMutation` in api/employeedetailsApi.ts already
   uploads a File as multipart/form-data — same shape works here, just
   confirm the route with backend since that one is scoped to bulk import.
============================================================================ */
const DropZone: React.FC<{
  value: string;
  onPick: (fileName: string) => void;
  height?: string;
  error?: boolean;
}> = ({ value, onPick, height = "h-[160px]", error }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onPick(f.name);
      }}
      className={[
        height,
        "flex flex-col items-center justify-center rounded-[6px] border border-dashed transition-colors",
        error
          ? "border-[#E5484D] bg-[#FEF4F4]"
          : hover
          ? "border-[#F97316] bg-[#F5FAFF]"
          : "border-[#CFD8E3] bg-white",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f.name);
        }}
      />

      {value ? (
        <div className="flex flex-col items-center gap-[6px] px-[10px] text-center">
          <FileText size={20} className="text-[#F97316]" />
          <span className="max-w-full truncate text-[12px] text-[#475467]">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onPick("")}
            className="text-[12px] font-medium text-[#E5484D]"
          >
            Remove
          </button>
        </div>
      ) : (
        <>
          <UploadCloud size={21} className="text-[#697586]" />
          <span className="mt-[8px] text-[12.5px] text-[#697586]">
            Drag and drop
          </span>
          <span className="text-[12px] text-[#8592A6]">- or -</span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-[13px] font-medium text-[#F97316] hover:underline"
          >
            Browse
          </button>
        </>
      )}
    </div>
  );
};

/* ============================================================================
   DEFAULT FORM
============================================================================ */

const emptyAddress: AddressBlock = {
  residentialNo: "",
  residentialName: "",
  street: "",
  locality: "",
  city: "",
  state: "",
  pinCode: "",
};

const defaultFormData: EmployeeFormData = {
  prefix: "Mr",
  employeeId: "344913",
  title: "Mr",
  firstName: "",
  middleName: "",
  lastName: "",
  fullName: "",
  gender: "",
  dateOfBirth: "",

  fatherName: "",
  maritalStatus: "Unmarried",
  spouseName: "",
  dateOfJoining: "",
  dateOfSalary: "",
  probationPeriod: "90",
  probationCompletionDate: "",

  photoName: "",
  confirmationDate: "",
  notes: "",
  physicallyChallenged: false,

  effectiveFrom: formatDate(new Date()),
  branch: "",
  salaryStructure: "",
  leavePolicy: "",
  attendanceStructure: "",
  costCenter: "",
  taPolicy: "General Policy",
  designation: "",
  bank: "",
  accountNo: "",
  ifscCode: "",
  department: "",
  team: "",

  aadharNo: "",
  tdsApplicable: true,
  financialYear: "2026-2027",
  pan: "",
  pfNumber: "",
  departmentFileNo: "",
  uan: "",
  esiNo: "",
  statutoryEffectiveFrom: "",
  pfApplicable: true,
  pfVoluntary: false,
  zeroPension: false,
  restrictEmployeePf: false,
  restrictEmployerPf: false,
  zeroPt: false,
  esiApplicable: true,
  internationalWorker: false,
  lwfApplicable: false,

  present: { ...emptyAddress },
  permanent: { ...emptyAddress },
  mobileNo: "",
  altMobileNo: "",
  officialEmail: "",
  alternateEmail: "",
  emergencyNo: "",

  bloodGroup: "",
  casteCategory: "",
  qualification: "",
  nationality: "",
  drivingLicNo: "",

  fetchDocumentsFrom: "",
  documents: [],

  earnings: Object.fromEntries(EARNING_HEADS.map((h) => [h, "0.00"])),
  deductions: Object.fromEntries(DEDUCTION_HEADS.map((h) => [h, "0.00"])),
  lumpsumFromDate: formatDate(new Date()),
  annualCtc: "0",
};

type Errors = Record<string, string>;

/* ============================================================================
   MAP  GET /api/admin/employee-details/:employeeId  ->  EmployeeFormData
   ----------------------------------------------------------------------------
   Used by the "Edit employee" flow: the row action loads the employee's
   details from the backend and this function reshapes that response into
   the flat structure the wizard's fields already expect (same structure as
   `defaultFormData` above), so every step just works with no special-casing.
============================================================================ */

function mapEmployeeDetailToFormData(
  detail: EmployeeDetailData
): Partial<EmployeeFormData> {
  const g = detail.general?.[0];
  const c = detail.classification?.[0];
  const s = detail.statutory?.[0];

  const addresses = detail.address ?? [];
  const presentAddr =
    addresses.find((a) => (a.AddressType ?? "").toLowerCase() === "present") ??
    addresses[0];
  const permanentAddr =
    addresses.find((a) => (a.AddressType ?? "").toLowerCase() === "permanent") ??
    addresses[1] ??
    addresses[0];

  const toAddressBlock = (a?: typeof addresses[number]): AddressBlock => ({
    residentialNo: a?.ResidentialNameNo ?? "",
    residentialName: a?.ResidentialNameNo ?? "",
    street: a?.Street ?? "",
    locality: a?.Locality ?? "",
    city: a?.City ?? "",
    state: a?.State ?? "",
    pinCode: a?.PinCode ?? "",
  });

  const documents: DocumentRow[] = (detail.documents ?? []).map((doc) => ({
    id: String(doc.ID),
    type: doc.DocumentType ?? "",
    fileName: doc.FileName ?? doc.DocumentName ?? "",
    description: doc.DocumentName ?? "",
  }));

  const toBool = (v: 0 | 1 | undefined) => v === 1;

  const mapped: Partial<EmployeeFormData> = {
    ...(g && {
      employeeId: g.EmployeeID ?? "",
      firstName: g.FirstName ?? "",
      lastName: g.LastName ?? "",
      fullName: g.FullName ?? "",
      gender: g.Gender ?? "",
      dateOfBirth: apiDateToFormDate(g.DateofBirth),
      dateOfJoining: apiDateToFormDate(g.DateofJoining),
      fatherName: g.FatherName ?? "",
      maritalStatus: g.MaritalStatus ?? "",
      spouseName: g.SpouseName ?? "",
      photoName: g.ProfilePhoto ?? "",
    }),

    ...(c && {
      branch: c.BranchName ?? "",
      bank: c.BankName ?? "",
      accountNo: c.AccountNumber ?? "",
      ifscCode: c.IFSC ?? "",
      leavePolicy: c.LeavePolicy ?? "",
      department: c.Department ?? "",
      designation: c.DesignationName ?? "",
    }),

    ...(s && {
      aadharNo: s.AadhaarNumber ?? "",
      pan: s.PANNumber ?? "",
      pfNumber: s.PFNumber ?? "",
      uan: s.UANNumber ?? "",
      esiNo: s.ESINumber ?? "",
      financialYear: s.FinancialYear ?? "",
      statutoryEffectiveFrom: apiDateToFormDate(s.EffectiveFrom),
      pfApplicable: toBool(s.PFApplicable),
      pfVoluntary: toBool(s.PFVoluntary),
      zeroPension: toBool(s.ZeroPension),
      restrictEmployeePf: toBool(s.RestrictEmployeePF),
      zeroPt: toBool(s.ZeroPT),
      esiApplicable: toBool(s.ESIApplicable),
      internationalWorker: toBool(s.InternationalWorker),
      lwfApplicable: toBool(s.LWFApplicable),
    }),

    present: toAddressBlock(presentAddr),
    permanent: toAddressBlock(permanentAddr),
    mobileNo: presentAddr?.MobileNo ?? "",
    altMobileNo: presentAddr?.AltMobileNo ?? "",
    officialEmail: presentAddr?.OfficialEmailId ?? g?.Email ?? "",
    alternateEmail: presentAddr?.AlternateEmailId ?? "",
    emergencyNo: presentAddr?.EmergencyNo ?? "",

    documents,
  };

  return mapped;
}

/* ============================================================================
   MAIN COMPONENT
============================================================================ */

const AddEmployeeWizard: React.FC<AddEmployeeWizardProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  /** page mode when `open` is not supplied (route element) */
  const isModal = typeof open === "boolean";

  /* ==========================================================================
     EDIT MODE
     --------------------------------------------------------------------------
     Row "Edit" action navigates to .../add-employee with the employee ID
     stored in React Router navigation state. The ID is therefore NOT exposed
     in the browser URL. We still load the employee's data via
     GET /api/admin/employee-details/:employeeId and prefill every step.
  ========================================================================== */
  const routeEmployeeId = (
    location.state as { employeeId?: string | number } | null
  )?.employeeId;

  const isEditMode = !isModal && Boolean(routeEmployeeId);

  const {
    data: employeeDetail,
    isLoading: isLoadingEmployee,
    isFetching: isFetchingEmployee,
    isError: isEmployeeError,
    refetch: refetchEmployee,
  } = useGetEmployeeDetailQuery(routeEmployeeId ?? "", {
    skip: !isEditMode,
  });

  const editInitialData = useMemo<Partial<EmployeeFormData> | undefined>(
    () => (employeeDetail ? mapEmployeeDetailToFormData(employeeDetail) : undefined),
    [employeeDetail]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState<EmployeeFormData>({
    ...defaultFormData,
    ...initialData,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [toast, setToast] = useState<string | null>(null);
  const [hrCategory, setHrCategory] = useState<string>("Personal");
  const [showDocumentForm, setShowDocumentForm] = useState(false);

  /** extra options added at runtime via the "Add New ..." popups */
  const [customLists, setCustomLists] = useState<{
    salaryStructure: string[];
    costCenter: string[];
    bank: string[];
    department: string[];
    team: string[];
    attendanceStructure: string[];
  }>({
    salaryStructure: [],
    costCenter: [],
    bank: [],
    department: [],
    team: [],
    attendanceStructure: [],
  });

  type SimpleAddKey = "salaryStructure" | "costCenter" | "bank" | "department" | "team";
  const [simpleAddTarget, setSimpleAddTarget] = useState<SimpleAddKey | null>(null);
  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);

  const salaryStructureOptions = [...SALARY_STRUCTURES, ...customLists.salaryStructure];
  const costCenterOptions = [...COST_CENTERS, ...customLists.costCenter];
  const bankOptions = [...BANKS, ...customLists.bank];
  const departmentOptions = [...DEPARTMENTS, ...customLists.department];
  const teamOptions = [...TEAMS, ...customLists.team];
  const attendanceStructureOptions = [
    ...ATTENDANCE_STRUCTURES,
    ...customLists.attendanceStructure,
  ];

  useEffect(() => {
    if (open) {
      setStepIndex(0);
      setErrors({});
      setFormData({ ...defaultFormData, ...initialData });
    }
  }, [open, initialData]);

  /** Page mode + editing: prefill the form once the employee's data arrives. */
  useEffect(() => {
    if (isEditMode && editInitialData) {
      setStepIndex(0);
      setErrors({});
      setFormData({ ...defaultFormData, ...editInitialData });
    }
  }, [isEditMode, editInitialData]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const currentStep: Step = STEPS[stepIndex];
  const isLast = stepIndex === STEPS.length - 1;

  /* ---------------------------------------------------------------- setters */

  const set = <K extends keyof EmployeeFormData>(
    key: K,
    value: EmployeeFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key as string]) return prev;
      const next = { ...prev };
      delete next[key as string];
      return next;
    });
  };

  const setAddress = (
    block: "present" | "permanent",
    key: keyof AddressBlock,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [block]: { ...prev[block], [key]: value },
    }));
    setErrors((prev) => {
      const k = `${block}.${key}`;
      if (!prev[k]) return prev;
      const next = { ...prev };
      delete next[k];
      return next;
    });
  };

  /* ------------------------------------------------- derived / auto-fields */

  const fullName = useMemo(
    () =>
      [formData.firstName, formData.middleName, formData.lastName]
        .filter(Boolean)
        .join(" ")
        .trim(),
    [formData.firstName, formData.middleName, formData.lastName]
  );

  useEffect(() => {
    setFormData((prev) => (prev.fullName === fullName ? prev : { ...prev, fullName }));
  }, [fullName]);

  /** Probation completion + confirmation date follow joining + probation days */
  useEffect(() => {
    const days = Number(formData.probationPeriod) || 0;
    if (!formData.dateOfJoining || !days) return;
    const completion = addDays(formData.dateOfJoining, days);
    setFormData((prev) =>
      prev.probationCompletionDate === completion
        ? prev
        : { ...prev, probationCompletionDate: completion }
    );
  }, [formData.dateOfJoining, formData.probationPeriod]);

  /** Prefix mirrors Title (Title is the interactive dropdown) */
  useEffect(() => {
    setFormData((prev) =>
      prev.prefix === prev.title ? prev : { ...prev, prefix: prev.title }
    );
  }, [formData.title]);

  /** Spouse Name only applies to Married */
  const spouseDisabled = formData.maritalStatus !== "Married";

  const totalEarning = useMemo(
    () =>
      EARNING_HEADS.reduce(
        (sum, h) => sum + (Number(formData.earnings[h]) || 0),
        0
      ),
    [formData.earnings]
  );

  const totalDeduction = useMemo(
    () =>
      DEDUCTION_HEADS.reduce(
        (sum, h) => sum + (Number(formData.deductions[h]) || 0),
        0
      ),
    [formData.deductions]
  );

  /* Modal mode only: bail out after every hook has run, so hook order stays
     stable across renders (the old file returned early at the top). */
  if (isModal && !open) return null;

  /* ------------------------------------------------------------ validation */

  const validateStep = (step: Step): Errors => {
    const e: Errors = {};

    if (step === "General") {
      if (isBlank(formData.firstName)) e.firstName = REQUIRED_MSG;
      if (isBlank(formData.gender)) e.gender = REQUIRED_MSG;
      if (isBlank(formData.dateOfBirth)) e.dateOfBirth = REQUIRED_MSG;
      if (isBlank(formData.maritalStatus)) e.maritalStatus = REQUIRED_MSG;
      if (isBlank(formData.dateOfJoining)) e.dateOfJoining = REQUIRED_MSG;
      if (isBlank(formData.dateOfSalary)) e.dateOfSalary = REQUIRED_MSG;
    }

    if (step === "Classification") {
      if (isBlank(formData.branch)) e.branch = REQUIRED_MSG;
      if (isBlank(formData.salaryStructure)) e.salaryStructure = REQUIRED_MSG;
      if (isBlank(formData.leavePolicy)) e.leavePolicy = REQUIRED_MSG;
      if (isBlank(formData.attendanceStructure))
        e.attendanceStructure = REQUIRED_MSG;
      if (isBlank(formData.designation)) e.designation = REQUIRED_MSG;
    }

    if (step === "Statutory") {
      if (isBlank(formData.financialYear)) e.financialYear = REQUIRED_MSG;
      if (isBlank(formData.pan)) {
        e.pan = REQUIRED_MSG;
      } else if (
        formData.pan.trim().toUpperCase() !== "PANAPPLIED" &&
        !isValidPan(formData.pan)
      ) {
        e.pan = "Invalid PAN";
      }
      if (formData.aadharNo && !isDigits(formData.aadharNo, 12))
        e.aadharNo = "Exact 12 digits we need";
      if (formData.uan && !isDigits(formData.uan, 12))
        e.uan = "Exact 12 digits we need";
    }

    if (step === "Address") {
      (["present", "permanent"] as const).forEach((block) => {
        const city = formData[block].city;
        if (city && !isValidCity(city)) e[`${block}.city`] = "Invalid city";
        const pin = formData[block].pinCode;
        if (pin && !isDigits(pin, 6)) e[`${block}.pinCode`] = "Invalid PIN code";
      });

      if (formData.mobileNo && !isDigits(formData.mobileNo, 10))
        e.mobileNo = "Exact 10 digits we need";
      if (formData.altMobileNo && !isDigits(formData.altMobileNo, 10))
        e.altMobileNo = "Exact 10 digits we need";
      if (formData.emergencyNo && !isDigits(formData.emergencyNo, 10))
        e.emergencyNo = "Exact 10 digits we need";
      if (formData.officialEmail && !isValidEmail(formData.officialEmail))
        e.officialEmail = "Invalid email";
      if (formData.alternateEmail && !isValidEmail(formData.alternateEmail))
        e.alternateEmail = "Invalid email";
    }

    return e;
  };

  /* ------------------------------------------------------------ navigation */

  const closeWizard = () => {
    if (onClose) onClose();
    else navigate(-1);
  };

  const goNext = () => {
    const e = validateStep(currentStep);

    if (Object.keys(e).length) {
      setErrors(e);
      setToast("Please Fill the Required Fields");
      return;
    }

    setErrors({});

    if (isLast) {
      /* ====================================================================
         ⚠ BACKEND TEAM — WIRE HERE: final Save.
         ----------------------------------------------------------------------
         This is the ONE place the whole form gets submitted. Right now it
         just hands `formData` to the optional `onSubmit` prop (modal mode)
         or silently navigates back (page mode) — nothing is sent anywhere.

         When the real endpoint exists, replace this block with something like:

           createEmployee(formData)          // POST enrollment/employeedetails/employees
             .unwrap()
             .then(() => {
               setToast("Employee saved");
               navigate(-1);
             })
             .catch(() => setToast("Could not save employee. Please try again."));

         `useCreateEmployeeMutation` already exists in
         api/employeedetailsApi.ts — its URL is marked "best guess" there and
         must be confirmed against the real route before use.

         Also note: photo + all documents are only held as filenames in
         memory (see DropZone below) — they still need their own upload call,
         normally fired either right here alongside createEmployee, or
         earlier at the moment each file is picked.
      ==================================================================== */
      onSubmit?.(formData);
      if (!onSubmit) navigate(-1);
      return;
    }

    setStepIndex((i) => i + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (stepIndex === 0) {
      closeWizard();
      return;
    }
    setErrors({});
    setStepIndex((i) => i - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const copyPresentToPermanent = () => {
    setFormData((prev) => ({ ...prev, permanent: { ...prev.present } }));
  };

  /* ========================================================================
     STEP: GENERAL
  ======================================================================== */

  const GeneralStep = (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3">
      {/* Card 1 */}
      <div className={`${CARD} p-[20px]`}>
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)_34px] items-end gap-[12px]">
          <Field label="Prefix">
            <TextInput value={formData.prefix} onChange={() => {}} computed disabled />
          </Field>

          <Field
            label="Employee ID"
            action={
              <button
                type="button"
                className="text-[12.5px] font-medium text-[#F97316] hover:underline"
              >
                Re-join?
              </button>
            }
          >
            <TextInput
              value={formData.employeeId}
              onChange={(v) => set("employeeId", v)}
              computed
            />
          </Field>

          <button
            type="button"
            className="mb-[1px] flex h-[44px] w-[34px] items-center justify-center rounded-[6px] text-[#8B97A8] hover:bg-[#F2F7FD]"
            title="Edit employee ID"
          >
            <Pencil size={15} />
          </button>
        </div>

        <div className="mt-[16px] grid grid-cols-[86px_minmax(0,1fr)] gap-[12px]">
          <Field label="Title">
            <SelectInput
              value={formData.title}
              onChange={(v) => set("title", v)}
              options={TITLES}
              placeholder=""
              clearable
            />
          </Field>

          <Field label="First Name" required error={errors.firstName}>
            <TextInput
              value={formData.firstName}
              onChange={(v) => set("firstName", v)}
              error={!!errors.firstName}
            />
          </Field>
        </div>

        <Field label="Middle Name" className="mt-[16px]">
          <TextInput
            value={formData.middleName}
            onChange={(v) => set("middleName", v)}
          />
        </Field>

        <Field label="Last Name" className="mt-[16px]">
          <TextInput
            value={formData.lastName}
            onChange={(v) => set("lastName", v)}
          />
        </Field>

        <Field label="Full Name" className="mt-[16px]">
          <TextInput
            value={formData.fullName}
            onChange={() => {}}
            placeholder="One Nn Mm"
            computed
            disabled
          />
        </Field>

        <Field label="Gender" required error={errors.gender} className="mt-[16px]">
          <SelectInput
            value={formData.gender}
            onChange={(v) => set("gender", v)}
            options={GENDERS}
            placeholder="Select Gender"
            error={!!errors.gender}
          />
        </Field>

        <Field
          label="Date Of Birth"
          required
          error={errors.dateOfBirth}
          className="mt-[16px]"
        >
          <DateInput
            value={formData.dateOfBirth}
            onChange={(v) => set("dateOfBirth", v)}
            error={!!errors.dateOfBirth}
          />
        </Field>
      </div>

      {/* Card 2 */}
      <div className={`${CARD} p-[20px]`}>
        <Field label="Father Name">
          <TextInput
            value={formData.fatherName}
            onChange={(v) => set("fatherName", v)}
          />
        </Field>

        <Field
          label="Marital Status"
          required
          error={errors.maritalStatus}
          className="mt-[16px]"
        >
          <SelectInput
            value={formData.maritalStatus}
            onChange={(v) => set("maritalStatus", v)}
            options={MARITAL_STATUS}
            error={!!errors.maritalStatus}
          />
        </Field>

        <Field label="Spouse Name" className="mt-[16px]">
          <TextInput
            value={formData.spouseName}
            onChange={(v) => set("spouseName", v)}
            placeholder="Khushaboo Sharma"
            computed={spouseDisabled}
            disabled={spouseDisabled}
          />
        </Field>

        <Field
          label="Date of Joining"
          required
          error={errors.dateOfJoining}
          className="mt-[16px]"
        >
          <DateInput
            value={formData.dateOfJoining}
            onChange={(v) => set("dateOfJoining", v)}
            error={!!errors.dateOfJoining}
          />
        </Field>

        <Field
          label="Date of Salary"
          required
          error={errors.dateOfSalary}
          className="mt-[16px]"
        >
          <DateInput
            value={formData.dateOfSalary}
            onChange={(v) => set("dateOfSalary", v)}
            error={!!errors.dateOfSalary}
          />
        </Field>

        <Field label="Probation Period (In days)" className="mt-[16px]">
          <TextInput
            value={formData.probationPeriod}
            onChange={(v) => set("probationPeriod", v.replace(/\D/g, ""))}
            inputMode="numeric"
          />
        </Field>

        <Field label="Probation Completion Date" className="mt-[16px]">
          <DateInput
            value={formData.probationCompletionDate}
            onChange={(v) => set("probationCompletionDate", v)}
            computed
            disabled
          />
        </Field>
      </div>

      {/* Card 3 */}
      <div className={`${CARD} p-[20px]`}>
        <Field label="EMP Photo 1">
          <DropZone
            value={formData.photoName}
            onPick={(name) => set("photoName", name)}
            height="h-[176px]"
          />
        </Field>

        <Field label="Confirmation date" className="mt-[16px]">
          <DateInput
            value={formData.confirmationDate}
            onChange={(v) => set("confirmationDate", v)}
          />
        </Field>

        <Field label="Notes" className="mt-[16px]">
          <TextArea value={formData.notes} onChange={(v) => set("notes", v)} />
        </Field>

        <div className="mt-[14px]">
          <CheckBox
            checked={formData.physicallyChallenged}
            onChange={(v) => set("physicallyChallenged", v)}
            label="Physically Challenged"
          />
        </div>
      </div>
    </div>
  );

  /* ========================================================================
     STEP: CLASSIFICATION
  ======================================================================== */

  const ClassificationStep = (
    <>
      <div className={`${CARD} mb-[18px] flex items-center justify-center gap-[14px] px-[20px] py-[18px]`}>
        <span className="text-[13.5px] text-[#475467]">Effective From</span>
        <div className="w-[230px]">
          <DateInput
            value={formData.effectiveFrom}
            onChange={(v) => set("effectiveFrom", v)}
            computed
          />
        </div>
        <button
          type="button"
          title="History"
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-dashed border-[#CFD8E3] text-[#8B97A8] hover:bg-[#F2F7FD]"
        >
          <History size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3">
        <div className={`${CARD} p-[20px]`}>
          <Field label="Branch" required error={errors.branch}>
            <SelectInput
              value={formData.branch}
              onChange={(v) => set("branch", v)}
              options={BRANCHES}
              placeholder="Select Branch"
              error={!!errors.branch}
            />
          </Field>

          <Field
            label="Salary Structure"
            required
            error={errors.salaryStructure}
            className="mt-[16px]"
          >
            <SelectInput
              value={formData.salaryStructure}
              onChange={(v) => set("salaryStructure", v)}
              options={salaryStructureOptions}
              placeholder="Select Salary Structure"
              error={!!errors.salaryStructure}
              addNewLabel="Add New Salary Structure"
              onAddNew={() => setSimpleAddTarget("salaryStructure")}
            />
          </Field>

          <Field
            label="Leave Policy"
            required
            error={errors.leavePolicy}
            className="mt-[16px]"
          >
            <SelectInput
              value={formData.leavePolicy}
              onChange={(v) => set("leavePolicy", v)}
              options={LEAVE_POLICIES}
              placeholder="Select Leave Policy"
              error={!!errors.leavePolicy}
            />
          </Field>

          <Field
            label="Attendance Structure"
            required
            error={errors.attendanceStructure}
            className="mt-[16px]"
          >
            <SelectInput
              value={formData.attendanceStructure}
              onChange={(v) => set("attendanceStructure", v)}
              options={attendanceStructureOptions}
              placeholder=""
              error={!!errors.attendanceStructure}
              addNewLabel="Add New Attendance Structure"
              onAddNew={() => setAttendanceModalOpen(true)}
            />
          </Field>

          <Field label="Cost Center" className="mt-[16px]">
            <SelectInput
              value={formData.costCenter}
              onChange={(v) => set("costCenter", v)}
              options={costCenterOptions}
              placeholder="Select Cost Center"
              addNewLabel="Add New Cost Center"
              onAddNew={() => setSimpleAddTarget("costCenter")}
            />
          </Field>
        </div>

        <div className={`${CARD} p-[20px]`}>
          <Field label="T&A Policy">
            <SelectInput
              value={formData.taPolicy}
              onChange={(v) => set("taPolicy", v)}
              options={TA_POLICIES}
              placeholder="Select T&A Policy"
            />
          </Field>

          <Field
            label="Designation"
            required
            error={errors.designation}
            className="mt-[16px]"
          >
            <SelectInput
              value={formData.designation}
              onChange={(v) => set("designation", v)}
              options={DESIGNATIONS}
              placeholder="Select Designation"
              error={!!errors.designation}
            />
          </Field>

          <Field label="Bank" className="mt-[16px]">
            <SelectInput
              value={formData.bank}
              onChange={(v) => set("bank", v)}
              options={bankOptions}
              placeholder="Select Bank"
              addNewLabel="Add New Bank"
              onAddNew={() => setSimpleAddTarget("bank")}
            />
          </Field>

          <Field label="A/C No." className="mt-[16px]">
            <TextInput
              value={formData.accountNo}
              onChange={(v) => set("accountNo", v.replace(/\D/g, ""))}
              placeholder="123456789676"
              inputMode="numeric"
            />
          </Field>

          <Field label="IFSC Code" className="mt-[16px]">
            <TextInput
              value={formData.ifscCode}
              onChange={(v) => set("ifscCode", v)}
              placeholder="IBKL0000002"
              uppercase
            />
          </Field>
        </div>

        <div className={`${CARD} p-[20px]`}>
          <Field label="Department">
            <SelectInput
              value={formData.department}
              onChange={(v) => set("department", v)}
              options={departmentOptions}
              placeholder="Select Department"
              addNewLabel="Add New"
              onAddNew={() => setSimpleAddTarget("department")}
            />
          </Field>

          <Field label="Team" className="mt-[16px]">
            <SelectInput
              value={formData.team}
              onChange={(v) => set("team", v)}
              options={teamOptions}
              placeholder="Select Team"
              addNewLabel="Add Team"
              onAddNew={() => setSimpleAddTarget("team")}
            />
          </Field>
        </div>
      </div>
    </>
  );

  /* ========================================================================
     STEP: STATUTORY
  ======================================================================== */

  const StatutoryStep = (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
      <div className={`${CARD} p-[20px]`}>
        <Field label="Aadhar No." error={errors.aadharNo}>
          <TextInput
            value={formData.aadharNo}
            onChange={(v) => set("aadharNo", v.replace(/\D/g, ""))}
            placeholder="444433332222"
            maxLength={12}
            inputMode="numeric"
            error={!!errors.aadharNo}
          />
        </Field>

        <div className="mt-[16px] grid grid-cols-[minmax(0,1fr)_200px] items-end gap-[12px]">
          <div className="pb-[11px]">
            <CheckBox
              checked={formData.tdsApplicable}
              onChange={(v) => set("tdsApplicable", v)}
              label="TDS Applicable"
            />
          </div>

          <Field label="Financial Year" required error={errors.financialYear}>
            <SelectInput
              value={formData.financialYear}
              onChange={(v) => set("financialYear", v)}
              options={FINANCIAL_YEARS}
              error={!!errors.financialYear}
            />
          </Field>
        </div>

        <Field
          label="PAN"
          required
          error={errors.pan}
          className="mt-[16px]"
          action={
            <button
              type="button"
              className="text-[12.5px] font-medium text-[#F97316] hover:underline"
            >
              Verify Pan
            </button>
          }
        >
          <TextInput
            value={formData.pan}
            onChange={(v) => set("pan", v)}
            uppercase
            maxLength={10}
            error={!!errors.pan}
            suffix={
              formData.pan ? (
                <button
                  type="button"
                  onClick={() => set("pan", "")}
                  className="text-[#8B97A8] hover:text-[#475467]"
                >
                  <X size={14} />
                </button>
              ) : null
            }
          />
        </Field>

        <Field label="PF Number" className="mt-[16px]">
          <TextInput
            value={formData.pfNumber}
            onChange={(v) => set("pfNumber", v)}
          />
        </Field>

        <Field label="Department File No." className="mt-[16px]">
          <TextInput
            value={formData.departmentFileNo}
            onChange={(v) => set("departmentFileNo", v)}
          />
        </Field>

        <Field label="UAN" error={errors.uan} className="mt-[16px]">
          <TextInput
            value={formData.uan}
            onChange={(v) => set("uan", v.replace(/\D/g, ""))}
            inputMode="numeric"
            maxLength={12}
            error={!!errors.uan}
          />
        </Field>

        <Field label="ESI No." className="mt-[16px]">
          <TextInput value={formData.esiNo} onChange={(v) => set("esiNo", v)} />
        </Field>
      </div>

      <div className="flex flex-col gap-[18px]">
        <div className={`${CARD} flex items-center justify-center gap-[14px] px-[20px] py-[18px]`}>
          <span className="text-[13.5px] text-[#475467]">Effective From</span>
          <div className="w-[190px]">
            <DateInput
              value={formData.statutoryEffectiveFrom}
              onChange={(v) => set("statutoryEffectiveFrom", v)}
              computed
              placeholder=""
            />
          </div>
          <button
            type="button"
            title="History"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-dashed border-[#CFD8E3] text-[#8B97A8] hover:bg-[#F2F7FD]"
          >
            <History size={15} />
          </button>
        </div>

        <div className={`${CARD} flex-1 px-[24px] py-[16px]`}>
          <CheckBox
            checked={formData.pfApplicable}
            onChange={(v) => set("pfApplicable", v)}
            label="PF Applicable"
          />
          <CheckBox
            checked={formData.pfVoluntary}
            onChange={(v) => set("pfVoluntary", v)}
            label="PF Voluntary"
            disabled={!formData.pfApplicable}
          />
          <CheckBox
            checked={formData.zeroPension}
            onChange={(v) => set("zeroPension", v)}
            label="Zero Pension"
            disabled={!formData.pfApplicable}
          />
          <CheckBox
            checked={formData.restrictEmployeePf}
            onChange={(v) => set("restrictEmployeePf", v)}
            label="Restrict Employee PF Contribution"
            disabled={!formData.pfApplicable}
          />
          <CheckBox
            checked={formData.restrictEmployerPf}
            onChange={(v) => set("restrictEmployerPf", v)}
            label="Restrict Employer PF Contribution"
            disabled={!formData.pfApplicable || formData.restrictEmployeePf}
          />
          <CheckBox
            checked={formData.zeroPt}
            onChange={(v) => set("zeroPt", v)}
            label="Zero PT"
          />
          <CheckBox
            checked={formData.esiApplicable}
            onChange={(v) => set("esiApplicable", v)}
            label="ESI Applicable"
          />
          <CheckBox
            checked={formData.internationalWorker}
            onChange={(v) => set("internationalWorker", v)}
            label="International Worker"
          />
          <CheckBox
            checked={formData.lwfApplicable}
            onChange={(v) => set("lwfApplicable", v)}
            label="LWF Applicable"
          />
        </div>
      </div>
    </div>
  );

  /* ========================================================================
     STEP: ADDRESS
  ======================================================================== */

  const addressFields: Array<{
    key: keyof AddressBlock;
    label: string;
    placeholder: string;
    type?: "select";
  }> = [
    { key: "residentialNo", label: "Residential No.", placeholder: "#89" },
    {
      key: "residentialName",
      label: "Residential Name",
      placeholder: "Sai Residency",
    },
    {
      key: "street",
      label: "Street",
      placeholder: "Mahalakshami Layout Rajaji nagar",
    },
    { key: "locality", label: "Locality", placeholder: "Near Metro Station" },
    { key: "city", label: "City", placeholder: "Bangalore" },
    { key: "state", label: "State", placeholder: "Select State", type: "select" },
    { key: "pinCode", label: "PIN Code", placeholder: "560010" },
  ];

  const renderAddressBlock = (block: "present" | "permanent") => (
    <div className={`${CARD} p-[20px]`}>
      <div className={`${SECTION_HEAD} relative`}>
        <span>{block === "present" ? "Present Address" : "Permanent Address"}</span>
        {block === "present" && (
          <button
            type="button"
            onClick={copyPresentToPermanent}
            title="Copy to permanent address"
            className="absolute right-[12px] flex h-[26px] w-[26px] items-center justify-center rounded text-[#F97316] hover:bg-white/60"
          >
            <ArrowRight size={18} strokeWidth={2.6} />
          </button>
        )}
      </div>

      <div className="mt-[16px] space-y-[16px]">
        {addressFields.map((f) => {
          const errKey = `${block}.${f.key}`;
          return (
            <Field key={f.key} label={f.label} error={errors[errKey]}>
              {f.type === "select" ? (
                <SelectInput
                  value={formData[block][f.key]}
                  onChange={(v) => setAddress(block, f.key, v)}
                  options={STATES}
                  placeholder={f.placeholder}
                />
              ) : (
                <TextInput
                  value={formData[block][f.key]}
                  onChange={(v) =>
                    setAddress(
                      block,
                      f.key,
                      f.key === "pinCode" ? v.replace(/\D/g, "") : v
                    )
                  }
                  placeholder={f.placeholder}
                  maxLength={f.key === "pinCode" ? 6 : undefined}
                  inputMode={f.key === "pinCode" ? "numeric" : "text"}
                  error={!!errors[errKey]}
                />
              )}
            </Field>
          );
        })}
      </div>
    </div>
  );

  const AddressStep = (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-3">
      {renderAddressBlock("present")}
      {renderAddressBlock("permanent")}

      <div className={`${CARD} p-[20px]`}>
        <div className={SECTION_HEAD}>Contact Info.</div>

        <div className="mt-[16px] space-y-[16px]">
          <Field label="Mobile No." error={errors.mobileNo}>
            <TextInput
              value={formData.mobileNo}
              onChange={(v) => set("mobileNo", v.replace(/\D/g, ""))}
              placeholder="9876XXXX89"
              maxLength={10}
              inputMode="tel"
              error={!!errors.mobileNo}
            />
          </Field>

          <Field label="Alt Mobile No." error={errors.altMobileNo}>
            <TextInput
              value={formData.altMobileNo}
              onChange={(v) => set("altMobileNo", v.replace(/\D/g, ""))}
              placeholder="9876XXXX89"
              maxLength={10}
              inputMode="tel"
              error={!!errors.altMobileNo}
            />
          </Field>

          <Field label="Official Email Id" error={errors.officialEmail}>
            <TextInput
              value={formData.officialEmail}
              onChange={(v) => set("officialEmail", v)}
              placeholder="abcd@relyon.com"
              inputMode="email"
              error={!!errors.officialEmail}
            />
          </Field>

          <Field label="Alternate Email Id" error={errors.alternateEmail}>
            <TextInput
              value={formData.alternateEmail}
              onChange={(v) => set("alternateEmail", v)}
              placeholder="abcd@relyon.com"
              inputMode="email"
              error={!!errors.alternateEmail}
            />
          </Field>

          <Field label="Emergency No." error={errors.emergencyNo}>
            <TextInput
              value={formData.emergencyNo}
              onChange={(v) => set("emergencyNo", v.replace(/\D/g, ""))}
              placeholder="9876XXXX89"
              maxLength={10}
              inputMode="tel"
              error={!!errors.emergencyNo}
            />
          </Field>
        </div>
      </div>
    </div>
  );

  /* ========================================================================
     STEP: HR CATEGORY
  ======================================================================== */

  const HRCategoryStep = (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-[320px_minmax(0,1fr)]">
      <div className={`${CARD} overflow-hidden`}>
        {HR_CATEGORIES.map((c) => {
          const active = c.label === hrCategory;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => setHrCategory(c.label)}
              className={[
                "flex w-full items-center gap-[12px] border-b border-[#EDF1F6] px-[16px] py-[12px] text-left last:border-b-0",
                active ? "bg-[#FFF1E6]" : "bg-white hover:bg-[#F7FAFD]",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[4px] text-[12px] font-semibold",
                  active
                    ? "bg-[#CFE6FB] text-[#F97316]"
                    : "bg-[#F1F4F8] text-[#8B97A8]",
                ].join(" ")}
              >
                {c.label.charAt(0)}
              </span>

              <span className="min-w-0">
                <span
                  className={[
                    "block truncate text-[13.5px]",
                    active ? "font-medium text-[#F97316]" : "text-[#475467]",
                  ].join(" ")}
                >
                  {c.label}
                </span>
                <span className="mt-[3px] inline-block rounded-[3px] bg-[#F1F4F8] px-[6px] py-[1px] text-[11px] text-[#8B97A8]">
                  {c.kind}
                </span>
              </span>

              {active && (
                <span className="ml-auto h-[36px] w-[3px] rounded-l bg-[#F97316]" />
              )}
            </button>
          );
        })}
      </div>

      <div className={`${CARD} min-h-[420px] p-[24px]`}>
        {hrCategory === "Personal" ? (
          <div className="grid grid-cols-1 gap-x-[36px] gap-y-[18px] md:grid-cols-2">
            <Field label="Blood Group">
              <SelectInput
                value={formData.bloodGroup}
                onChange={(v) => set("bloodGroup", v)}
                options={BLOOD_GROUPS}
                placeholder="Select Blood Group"
              />
            </Field>

            <Field label="Caste Category">
              <TextInput
                value={formData.casteCategory}
                onChange={(v) => set("casteCategory", v)}
              />
            </Field>

            <Field label="Qualification">
              <SelectInput
                value={formData.qualification}
                onChange={(v) => set("qualification", v)}
                options={QUALIFICATIONS}
                placeholder="Select Qualification"
              />
            </Field>

            <Field label="Nationality">
              <TextInput
                value={formData.nationality}
                onChange={(v) => set("nationality", v)}
              />
            </Field>

            <Field label="Driving Lic No">
              <TextInput
                value={formData.drivingLicNo}
                onChange={(v) => set("drivingLicNo", v)}
              />
            </Field>
          </div>
        ) : (
          <div className="flex h-[360px] flex-col items-center justify-center gap-[14px]">
            <p className="text-[13.5px] text-[#8B97A8]">
              No {hrCategory.toLowerCase()} records yet.
            </p>
            <button
              type="button"
              className="flex h-[36px] items-center gap-[6px] rounded-[6px] bg-[#F97316] px-[16px] text-[13px] font-medium text-white hover:bg-[#C2410C]"
            >
              <Plus size={15} strokeWidth={2.6} />
              Add {hrCategory}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  /* ========================================================================
     STEP: DOCUMENTS
  ======================================================================== */

  const DocumentsStep = (
    <>
      <div className={`${CARD} mb-[18px] flex items-center justify-end gap-[14px] px-[20px] py-[16px]`}>
        <span className="text-[13.5px] text-[#475467]">Fetch Documents From</span>
        <div className="w-[210px]">
          <SelectInput
            value={formData.fetchDocumentsFrom}
            onChange={(v) => set("fetchDocumentsFrom", v)}
            options={["Select", "Onboarding", "BGV"]}
            placeholder="Select"
          />
        </div>
      </div>

      {formData.documents.length === 0 ? (
        <div className="flex h-[420px] flex-col items-center justify-center gap-[14px]">
          <img
            src={noDataImage}
            alt="No documents"
            className="h-[150px] w-auto object-contain"
          />
          <p className="text-[14px] text-[#67758A]">Did Not Find Any Employee</p>
        </div>
      ) : (
        <div className={`${CARD} overflow-hidden`}>
          <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_110px] border-b border-[#EDF1F6] bg-[#F7FAFD] px-[18px] py-[11px] text-[12.5px] font-medium text-[#67758A]">
            <span>Document Type</span>
            <span>File</span>
            <span>Description</span>
            <span className="text-right">Action</span>
          </div>

          {formData.documents.map((d) => (
            <div
              key={d.id}
              className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_minmax(0,1.4fr)_110px] items-center border-b border-[#F2F5F9] px-[18px] py-[12px] text-[13px] text-[#475467] last:border-b-0"
            >
              <span className="truncate">{d.type}</span>
              <span className="truncate text-[#F97316]">{d.fileName}</span>
              <span className="truncate">{d.description || "-"}</span>
              <span className="flex justify-end gap-[8px]">
                <button
                  type="button"
                  className="flex h-[28px] w-[28px] items-center justify-center rounded text-[#8B97A8] hover:bg-[#F2F7FD]"
                >
                  <Download size={15} />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    set(
                      "documents",
                      formData.documents.filter((x) => x.id !== d.id)
                    )
                  }
                  className="flex h-[28px] w-[28px] items-center justify-center rounded text-[#E5484D] hover:bg-[#FEF3F3]"
                >
                  <Trash2 size={15} />
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );

  /* ========================================================================
     STEP: SALARY RATE
  ======================================================================== */

  const SalaryRateStep = (
    <div className="grid grid-cols-1 gap-[18px] lg:grid-cols-2">
      <div className={`${CARD} overflow-hidden`}>
        <div className="  bg-[#FFF5EE] py-[11px] text-center text-[13.5px] font-medium text-[#27364D]">
          Salary Details
        </div>

        <div className="grid grid-cols-2 border-b border-[#E2E2E2] bg-[#EFF6FC] text-[13px] font-medium text-[#27364D]">
          <span className="py-[10px] text-center">Earning</span>
          <span className="border-l border-[#E7ECF2] py-[10px] text-center">
            Deduction
          </span>
        </div>

        <div className="grid grid-cols-2">
          <div>
            {EARNING_HEADS.map((h) => (
              <div
                key={h}
                className="flex items-center justify-between border-b border-[#F2F5F9] px-[16px] py-[9px]"
              >
                <span className="text-[13px] text-[#F97316]">{h}</span>
                <input
                  value={formData.earnings[h]}
                  onChange={(e) =>
                    set("earnings", {
                      ...formData.earnings,
                      [h]: e.target.value,
                    })
                  }
                  className="w-[80px] rounded border border-transparent bg-transparent px-[6px] py-[2px] text-right text-[13px] text-[#475467] outline-none hover:border-[#E2E2E2] focus:border-[#F97316]"
                />
              </div>
            ))}
          </div>

          <div className="border-l border-[#E7ECF2]">
            {DEDUCTION_HEADS.map((h) => (
              <div
                key={h}
                className="flex items-center justify-between border-b border-[#F2F5F9] px-[16px] py-[9px]"
              >
                <span className="text-[13px] text-[#DD3232]">{h}</span>
                <input
                  value={formData.deductions[h]}
                  onChange={(e) =>
                    set("deductions", {
                      ...formData.deductions,
                      [h]: e.target.value,
                    })
                  }
                  className="w-[80px] rounded border border-transparent bg-transparent px-[6px] py-[2px] text-right text-[13px] text-[#475467] outline-none hover:border-[#E3E8EF] focus:border-[#F97316]"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 text-[13px] font-medium">
          <div className="flex items-center justify-between bg-[#EAF7EE] px-[16px] py-[11px] text-[#1F7A45]">
            <span>Total Earning</span>
            <span>{totalEarning.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between border-l border-[#E7ECF2] bg-[#FDECEE] px-[16px] py-[11px] text-[#C2333A]">
            <span>Total Deduction</span>
            <span>{totalDeduction.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className={`${CARD} h-fit overflow-hidden`}>
        <div className="bg-[#E9EDF2] py-[11px] text-center text-[13.5px] font-medium text-[#27364D]">
          Lumpsum Entries
        </div>

        <div className="px-[24px] py-[20px]">
          <div className="grid grid-cols-[130px_minmax(0,1fr)] items-center gap-[16px]">
            <span className="text-[13.5px] text-[#475467]">From Date</span>
            <DateInput
              value={formData.lumpsumFromDate}
              onChange={(v) => set("lumpsumFromDate", v)}
              computed
            />
          </div>

          <div className="mt-[16px] grid grid-cols-[130px_minmax(0,1fr)] items-center gap-[16px]">
            <span className="text-[13.5px] text-[#475467]">Annual CTC</span>
            <div className="flex h-[44px] items-center justify-end rounded-[6px] bg-[#F4F6F9] px-[12px] text-[13.5px] text-[#475467]">
              {formData.annualCtc || "0"}
            </div>
          </div>

          <div className="mt-[16px] text-center">
            <button
              type="button"
              className="text-[13.5px] font-medium text-[#F97316] hover:underline"
            >
              Show Salary Calculation
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  /* ========================================================================
     STEPPER BAR
  ======================================================================== */

  const StepperBar = (
    <div className={`${CARD} mb-[18px] flex items-center gap-[10px] overflow-x-auto px-[20px] py-[14px]`}>
      <div className="flex min-w-max flex-1 items-center">
        {STEPS.map((step, index) => {
          const active = index === stepIndex;
          const done = index < stepIndex;

          return (
            <React.Fragment key={step}>
              <button
                type="button"
                onClick={() => index < stepIndex && setStepIndex(index)}
                className="flex shrink-0 items-center gap-[9px]"
              >
                <span
                  className={[
                    "flex h-[26px] w-[26px] items-center justify-center rounded-full text-[12px] font-semibold",
                    active || done
                      ? "bg-[#F97316] text-white"
                      : "bg-[#EEF1F5] text-[#697586]",
                  ].join(" ")}
                >
                  {done ? <Check size={14} strokeWidth={3} /> : index + 1}
                </span>

                <span
                  className={[
                    "whitespace-nowrap text-[13.5px]",
                    active
                      ? "font-semibold text-[#F97316]"
                      : done
                      ? "text-[#344054]"
                      : "text-[#697586]",
                  ].join(" ")}
                >
                  {step}
                </span>
              </button>

              {index < STEPS.length - 1 && (
                <span className="mx-[10px] h-px min-w-[16px] flex-1 bg-[#E4E7EC]" />
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex shrink-0 items-center gap-[10px]">
        <button
          type="button"
          onClick={goBack}
          className="flex h-[38px] items-center gap-[6px] rounded-[6px] border border-[#D7DEE7] bg-white px-[16px] text-[13.5px] font-medium text-[#475467] hover:bg-[#F7FAFD]"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {currentStep === "Documents" && (
          <button
            type="button"
            onClick={() => setShowDocumentForm(true)}
            className="flex h-[38px] items-center gap-[6px] rounded-[6px] bg-[#F97316] px-[16px] text-[13.5px] font-medium text-white hover:bg-[#C2410C]"
          >
            <Plus size={16} strokeWidth={2.6} />
            Add
          </button>
        )}

        <button
          type="button"
          onClick={goNext}
          className="flex h-[38px] items-center gap-[7px] rounded-[6px] bg-[#F97316] px-[18px] text-[13.5px] font-medium text-white hover:bg-[#C2410C]"
        >
          <Bookmark size={15} />
          {isLast ? "Save And Continue" : "Next"}
        </button>
      </div>
    </div>
  );

  /* ========================================================================
     BODY
  ======================================================================== */

  const body = (
    <div className="w-full px-[18px] pb-[40px] pt-[16px]">
      {StepperBar}

      {currentStep === "General" && GeneralStep}
      {currentStep === "Classification" && ClassificationStep}
      {currentStep === "Statutory" && StatutoryStep}
      {currentStep === "Address" && AddressStep}
      {currentStep === "HR/Category" && HRCategoryStep}
      {currentStep === "Documents" && DocumentsStep}
      {currentStep === "Salary Req" && SalaryRateStep}

      {showDocumentForm && (
        <DocumentFormModal
          onClose={() => setShowDocumentForm(false)}
          onSave={(rows) => {
            set("documents", [...formData.documents, ...rows]);
            setShowDocumentForm(false);
          }}
        />
      )}

      {simpleAddTarget && (
        <SimpleAddModal
          onClose={() => setSimpleAddTarget(null)}
          onSave={(name) => {
            setCustomLists((prev) => ({
              ...prev,
              [simpleAddTarget]: [...prev[simpleAddTarget], name],
            }));
            set(simpleAddTarget, name);
            setSimpleAddTarget(null);
          }}
        />
      )}

      {attendanceModalOpen && (
        <AddAttendanceModal
          onClose={() => setAttendanceModalOpen(false)}
          onSave={(name) => {
            setCustomLists((prev) => ({
              ...prev,
              attendanceStructure: [...prev.attendanceStructure, name],
            }));
            set("attendanceStructure", name);
            setAttendanceModalOpen(false);
          }}
        />
      )}
    </div>
  );

  const toastNode = toast && (
    <div className="fixed left-1/2 top-[14px] z-[9999] flex -translate-x-1/2 items-center gap-[10px] rounded-[6px] border border-[#F5C2C4] bg-white px-[16px] py-[10px] text-[13px] text-[#C2333A] shadow-[0_8px_24px_rgba(16,24,40,0.14)]">
      <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#E5484D] text-white">
        <X size={12} strokeWidth={3} />
      </span>
      {toast}
      <button
        type="button"
        onClick={() => setToast(null)}
        className="ml-[4px] text-[#8592A6] hover:text-[#475467]"
      >
        <X size={14} />
      </button>
    </div>
  );

  /* page mode (route element) */
  if (!isModal) {
    /* EDIT MODE: fetching GET /api/admin/employee-details/:employeeId */
    if (isEditMode && (isLoadingEmployee || isFetchingEmployee) && !employeeDetail) {
      return (
        <div
          className="min-h-full w-full bg-[#EDEDED] p-[14px] text-[#131313]"
          style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
        >
          <EnrollmentTabs />
          <div className="flex min-h-[400px] items-center justify-center text-[12px] text-[#68798E]">
            Loading employee details...
          </div>
        </div>
      );
    }

    if (isEditMode && isEmployeeError) {
      return (
        <div
          className="min-h-full w-full bg-[#EDEDED] p-[14px] text-[#131313]"
          style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
        >
          <EnrollmentTabs />
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-[10px] text-[12px] text-[#F04438]">
            Could not load employee details.
            <button
              type="button"
              onClick={() => refetchEmployee()}
              className="rounded-[5px] border border-[#F04438] px-[12px] py-[6px] text-[11.5px] font-medium text-[#F04438] hover:bg-[#FEF3F2]"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return (
      <div
        className="min-h-full w-full bg-[#EDEDED] p-[14px] text-[#131313]"
        style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
      >
        {toastNode}

        <EnrollmentTabs />

        <EnrollmentToolbarPortal>
          <button
            type="button"
            disabled
            className="flex h-[27px] items-center gap-[6px] rounded-[5px] bg-[#FF6200] px-[12px] text-[11.5px] font-semibold text-white shadow-[0_2px_5px_rgba(255,98,0,0.2)]"
          >
            <Plus size={14} strokeWidth={2.8} />
            {isEditMode ? "Edit Employee" : "Add Employee"}
          </button>
        </EnrollmentToolbarPortal>

        {body}
      </div>
    );
  }

  /* modal mode (kept for backwards compatibility) */
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.48)] p-[20px]">
      {toastNode}
      <div
        className="w-full max-w-[1500px] rounded-[8px] bg-[#EDEDED] shadow-[0_20px_60px_rgba(19,19,19,0.18)]"
        style={{ fontFamily: "Urbanist, Geist Variable, sans-serif" }}
      >
        <div className="flex h-[48px] items-center justify-between border-b border-[#E9EDF2] bg-white px-[18px]">
          <span className="text-[14px] font-semibold text-[#27364D]">
            Add Employee
          </span>
          <button
            type="button"
            onClick={closeWizard}
            className="flex h-[28px] w-[28px] items-center justify-center rounded text-[#667085] hover:bg-[#F2F5F7]"
          >
            <X size={16} />
          </button>
        </div>
        {body}
      </div>
    </div>
  );
};

/* ============================================================================
   DOCUMENT FORM MODAL
============================================================================ */

const DocumentFormModal: React.FC<{
  onClose: () => void;
  onSave: (rows: DocumentRow[]) => void;
}> = ({ onClose, onSave }) => {
  const [tab, setTab] = useState<"form" | "new">("form");
  const [files, setFiles] = useState<Record<string, string>>({});
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [newType, setNewType] = useState("");
  const [types, setTypes] = useState(DOCUMENT_TYPES);
  const [error, setError] = useState(false);

  /* [WIRE: this is where each document's actual bytes would be uploaded —
     see the DropZone note above for the endpoint shape. Right now `save`
     only moves filenames into the wizard's local state via `onSave`.] */
  const save = () => {
    if (!files["Aadhar"]) {
      setError(true);
      return;
    }

    const rows: DocumentRow[] = (Object.entries(files) as [string, string][])
      .filter(([, fileName]) => !!fileName)
      .map(([type, fileName]) => ({
        id: `${type}-${Date.now()}`,
        type,
        fileName,
        description: descriptions[type] || "",
      }));

    onSave(rows);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(15,23,42,0.42)] p-[20px]">
      <div className="flex h-[calc(100vh-90px)] w-full max-w-[1480px] flex-col overflow-hidden rounded-[8px] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.28)]">
        <div className="flex h-[54px] shrink-0 items-center gap-[26px] border-b border-[#EDF1F6] bg-[#F7FAFD] px-[24px]">
          <button
            type="button"
            onClick={() => setTab("form")}
            className={[
              "text-[14px]",
              tab === "form"
                ? "font-medium text-[#27364D]"
                : "text-[#8B97A8] hover:text-[#475467]",
            ].join(" ")}
          >
            Document Form
          </button>
          <button
            type="button"
            onClick={() => setTab("new")}
            className={[
              "text-[14px]",
              tab === "new"
                ? "font-medium text-[#27364D]"
                : "text-[#F97316] hover:underline",
            ].join(" ")}
          >
            Add New Document Type
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-[24px] py-[20px]">
          {tab === "form" ? (
            <div className="grid grid-cols-2 gap-x-[20px] gap-y-[26px] md:grid-cols-3 xl:grid-cols-6">
              {types.map((t) => (
                <div key={t.label}>
                  <label className="mb-[8px] block text-[13px] text-[#475467]">
                    {t.label}
                    {t.required && (
                      <span className="ml-[2px] text-[#E5484D]">*</span>
                    )}
                  </label>

                  <DropZone
                    value={files[t.label] || ""}
                    onPick={(name) => {
                      setFiles((p) => ({ ...p, [t.label]: name }));
                      if (t.label === "Aadhar") setError(false);
                    }}
                    height="h-[230px]"
                    error={t.required && error && !files[t.label]}
                  />

                  <input
                    value={descriptions[t.label] || ""}
                    onChange={(e) =>
                      setDescriptions((p) => ({
                        ...p,
                        [t.label]: e.target.value,
                      }))
                    }
                    placeholder="description"
                    className="mt-[12px] h-[38px] w-full rounded-[5px] bg-[#F2F5F9] px-[12px] text-[13px] text-[#475467] outline-none placeholder:text-[#8592A6] focus:ring-1 focus:ring-[#F97316]"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="max-w-[420px]">
              <label className={LABEL}>Document Type Name</label>
              <div className="flex gap-[10px]">
                <input
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className={`${INPUT_BASE} ${INPUT_IDLE}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newType.trim()) return;
                    setTypes((p) => [...p, { label: newType.trim(), required: false }]);
                    setNewType("");
                    setTab("form");
                  }}
                  className="h-[44px] shrink-0 rounded-[6px] bg-[#F97316] px-[18px] text-[13.5px] font-medium text-white hover:bg-[#C2410C]"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex h-[62px] shrink-0 items-center justify-end gap-[10px] border-t border-[#EDF1F6] bg-white px-[24px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[38px] items-center gap-[6px] rounded-[6px] border border-[#D7DEE7] bg-white px-[18px] text-[13.5px] font-medium text-[#475467] hover:bg-[#F7FAFD]"
          >
            <X size={15} />
            Close
          </button>
          <button
            type="button"
            onClick={save}
            className="flex h-[38px] items-center gap-[7px] rounded-[6px] bg-[#F97316] px-[20px] text-[13.5px] font-medium text-white hover:bg-[#C2410C]"
          >
            <Bookmark size={15} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   SIMPLE "ADD NEW ..." MODAL
   ----------------------------------------------------------------------------
   Used by Salary Structure / Cost Center / Bank / Department / Team — a
   single Name field, matching "New classification Details" in the recording.
   [WIRE: on Save this only pushes the name into local state (customLists).
   Hook it up to the real create-master-data endpoint for that field, then
   call onSave with the name the backend confirms — or the whole new record
   if the dropdown needs more than just a name later.]
============================================================================ */

const SimpleAddModal: React.FC<{
  onClose: () => void;
  onSave: (name: string) => void;
}> = ({ onClose, onSave }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(false);

  const save = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    onSave(name.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(15,23,42,0.42)] p-[20px]">
      <div className="w-full max-w-[420px] overflow-hidden rounded-[8px] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.28)]">
        <div className="border-b border-[#EDF1F6] px-[20px] py-[16px]">
          <span className="text-[15px] font-semibold text-[#27364D]">
            New classification Details
          </span>
        </div>

        <div className="px-[20px] py-[20px]">
          <Field label="Name" required error={error ? REQUIRED_MSG : undefined}>
            <TextInput
              value={name}
              onChange={(v) => {
                setName(v);
                setError(false);
              }}
              error={error}
            />
          </Field>
        </div>

        <div className="flex items-center justify-end gap-[10px] border-t border-[#EDF1F6] px-[20px] py-[14px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[38px] items-center gap-[6px] rounded-[6px] border border-[#D7DEE7] bg-white px-[18px] text-[13.5px] font-medium text-[#475467] hover:bg-[#F7FAFD]"
          >
            <X size={15} />
            Close
          </button>
          <button
            type="button"
            onClick={save}
            className="flex h-[38px] items-center gap-[7px] rounded-[6px] bg-[#F97316] px-[20px] text-[13.5px] font-medium text-white hover:bg-[#C2410C]"
          >
            <Bookmark size={15} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   ADD ATTENDANCE MODAL
   ----------------------------------------------------------------------------
   Matches the "Add Attendance" popup from the recording: Attendance Name,
   Short Name, Salary Calendar Days, Attendance Type, and 4 checkboxes.
   [WIRE: GET for the two dropdown option lists below, and POST to create the
   attendance structure — on success call onSave with the confirmed name.]
============================================================================ */

const SALARY_CALENDAR_DAYS_OPTIONS = ["Calendar Days", "Present Days", "Fixed Days"];
const ATTENDANCE_TYPE_OPTIONS = ["Fixed", "Flexible", "Shift Based"];

const AddAttendanceModal: React.FC<{
  onClose: () => void;
  onSave: (name: string) => void;
}> = ({ onClose, onSave }) => {
  const [attendanceName, setAttendanceName] = useState("");
  const [shortName, setShortName] = useState("");
  const [salaryCalendarDays, setSalaryCalendarDays] = useState("");
  const [attendanceType, setAttendanceType] = useState("");
  const [independent, setIndependent] = useState(false);
  const [overtime, setOvertime] = useState(false);
  const [ot2Enable, setOt2Enable] = useState(false);
  const [lateInEarlyOut, setLateInEarlyOut] = useState(false);
  const [errors, setErrors] = useState<{ name?: boolean; short?: boolean }>({});

  const save = () => {
    const e: { name?: boolean; short?: boolean } = {};
    if (!attendanceName.trim()) e.name = true;
    if (!shortName.trim()) e.short = true;
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    onSave(attendanceName.trim());
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(15,23,42,0.42)] p-[20px]">
      <div className="w-full max-w-[640px] overflow-hidden rounded-[8px] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.28)]">
        <div className="border-b border-[#EDF1F6] px-[20px] py-[16px]">
          <span className="text-[15px] font-semibold text-[#27364D]">
            Add Attendance
          </span>
        </div>

        <div className="grid grid-cols-1 gap-x-[20px] gap-y-[16px] px-[20px] py-[20px] md:grid-cols-2">
          <Field
            label="Attendance Name"
            required
            error={errors.name ? REQUIRED_MSG : undefined}
          >
            <TextInput
              value={attendanceName}
              onChange={(v) => {
                setAttendanceName(v);
                setErrors((p) => ({ ...p, name: false }));
              }}
              placeholder="Monthly,Leave Register,karnataka"
              error={errors.name}
            />
          </Field>

          <Field
            label="Short Name"
            required
            error={errors.short ? REQUIRED_MSG : undefined}
          >
            <TextInput
              value={shortName}
              onChange={(v) => {
                setShortName(v);
                setErrors((p) => ({ ...p, short: false }));
              }}
              placeholder="Monthly,LR,KA"
              error={errors.short}
            />
          </Field>

          <Field label="Salary Calendar Days" required>
            <SelectInput
              value={salaryCalendarDays}
              onChange={setSalaryCalendarDays}
              options={SALARY_CALENDAR_DAYS_OPTIONS}
              placeholder="Select Salary Calendar Days"
            />
          </Field>

          <Field label="Attendance Type" required>
            <SelectInput
              value={attendanceType}
              onChange={setAttendanceType}
              options={ATTENDANCE_TYPE_OPTIONS}
              placeholder="Select Attendance Type"
            />
          </Field>

          <div className="flex items-center gap-[8px]">
            <CheckBox
              checked={independent}
              onChange={setIndependent}
              label="Independent"
            />
            <span title="Runs on its own attendance cycle, independent of others.">
              <Info size={14} className="text-[#8B97A8]" />
            </span>
          </div>

          <CheckBox checked={overtime} onChange={setOvertime} label="Overtime (OT)" />
          <CheckBox checked={ot2Enable} onChange={setOt2Enable} label="OT2 Enable" />
          <CheckBox
            checked={lateInEarlyOut}
            onChange={setLateInEarlyOut}
            label="Late In Early Out"
          />
        </div>

        <div className="flex items-center justify-end gap-[10px] border-t border-[#EDF1F6] px-[20px] py-[14px]">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[38px] items-center gap-[6px] rounded-[6px] border border-[#D7DEE7] bg-white px-[18px] text-[13.5px] font-medium text-[#475467] hover:bg-[#F7FAFD]"
          >
            <X size={15} />
            Close
          </button>
          <button
            type="button"
            onClick={save}
            className="flex h-[38px] items-center gap-[7px] rounded-[6px] bg-[#F97316] px-[20px] text-[13.5px] font-medium text-white hover:bg-[#C2410C]"
          >
            <Bookmark size={15} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeWizard;