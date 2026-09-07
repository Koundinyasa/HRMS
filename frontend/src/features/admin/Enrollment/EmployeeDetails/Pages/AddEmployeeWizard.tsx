








import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CalendarDays,
  Upload,
  Save,
  Pencil,
  X,
  Check,
  UserRound,
  FileText,
  MapPin,
  BriefcaseBusiness,
  ShieldCheck,
  Banknote,
} from "lucide-react";

/* ============================================================
   COMPLETE ADD EMPLOYEE WIZARD
   ============================================================ */

export interface EmployeeFormData {
  prefix: string;
  employeeId: string;
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
  probationPeriod: number;

  panNumber: string;
  aadhaarNumber: string;
  uanNumber: string;
  pfApplicable: boolean;
  pfNumber: string;
  esiApplicable: boolean;
  esiNumber: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankName: string;

  photoUrl?: string;
  confirmationDate: string;
  notes: string;

  department: string;
  designation: string;
  employmentType: string;
  workLocation: string;

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;

  hrCategory: string;
  employeeCategory: string;
  reportingManager: string;

  salaryType: string;
  salaryAmount: string;
  payFrequency: string;

  documents: File[];
}

interface AddEmployeeWizardProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  initialData?: Partial<EmployeeFormData>;
}

/* ============================================================
   DEFAULT FORM
============================================================ */

const defaultFormData: EmployeeFormData = {
  prefix: "",
  employeeId: "344913",
  title: "Ms",
  firstName: "",
  middleName: "",
  lastName: "",
  fullName: "",
  gender: "Female",

  fatherName: "",
  maritalStatus: "Unmarried",
  spouseName: "",
  dateOfJoining: "",
  dateOfSalary: "",
  probationPeriod: 30,

  panNumber: "",
  aadhaarNumber: "",
  uanNumber: "",
  pfApplicable: true,
  pfNumber: "",
  esiApplicable: false,
  esiNumber: "",
  bankAccountNumber: "",
  bankIfsc: "",
  bankName: "",

  photoUrl: "",
  confirmationDate: "",
  notes: "",

  department: "",
  designation: "",
  employmentType: "Permanent",
  workLocation: "",

  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "Telangana",
  pincode: "",

  hrCategory: "",
  employeeCategory: "",
  reportingManager: "",

  salaryType: "Monthly",
  salaryAmount: "",
  payFrequency: "Monthly",

  documents: [],
};

/* ============================================================
   STEPS
============================================================ */

const STEPS = [
  "General",
  "Classification",
  "Statutory",
  "Address",
  "HR Category",
  "Documents",
  "Salary Rate",
] as const;

type Step = (typeof STEPS)[number];

/* ============================================================
   STYLES
============================================================ */

const FIELD =
  "h-[40px] w-full rounded-[4px] border border-[#E2E5E9] bg-white px-3 text-[13px] text-[#475467] outline-none transition-all duration-150 placeholder:text-[#B6BDC7] focus:border-[#2589E8] focus:ring-2 focus:ring-[#2589E8]/15";

const LABEL =
  "mb-[6px] block text-[12px] leading-[15px] font-medium text-[#667085]";

const SELECT_FIELD =
  `${FIELD} appearance-none cursor-pointer pr-9`;

/* ============================================================
   DATE HELPERS
============================================================ */

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

const WEEKDAYS = [
  "Su",
  "Mo",
  "Tu",
  "We",
  "Th",
  "Fr",
  "Sa",
];

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatDate(date: Date) {
  return `${pad(date.getDate())}-${pad(
    date.getMonth() + 1
  )}-${date.getFullYear()}`;
}

function parseDate(value: string) {
  const parts = value.split("-");

  if (parts.length !== 3) {
    return null;
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (
    !day ||
    !month ||
    !year ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31
  ) {
    return null;
  }

  return new Date(year, month - 1, day);
}

/* ============================================================
   DATE PICKER
============================================================ */

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DatePickerField: React.FC<
  DatePickerFieldProps
> = ({
  value,
  onChange,
  placeholder = "dd-mm-yyyy",
}) => {
  const [open, setOpen] = useState(false);

  const [viewDate, setViewDate] =
    useState<Date>(() => {
      return parseDate(value) || new Date();
    });

  const selectedDate = parseDate(value);

  useEffect(() => {
    if (value) {
      const parsed = parseDate(value);

      if (parsed) {
        setViewDate(parsed);
      }
    }
  }, [value]);

  const cells = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(
      year,
      month,
      1
    ).getDay();

    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    const daysInPreviousMonth = new Date(
      year,
      month,
      0
    ).getDate();

    const result: Array<{
      date: Date;
      day: number;
      inMonth: boolean;
    }> = [];

    for (
      let i = firstDay - 1;
      i >= 0;
      i--
    ) {
      result.push({
        date: new Date(
          year,
          month - 1,
          daysInPreviousMonth - i
        ),
        day:
          daysInPreviousMonth - i,
        inMonth: false,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      result.push({
        date: new Date(
          year,
          month,
          day
        ),
        day,
        inMonth: true,
      });
    }

    let nextDay = 1;

    while (result.length < 42) {
      result.push({
        date: new Date(
          year,
          month + 1,
          nextDay
        ),
        day: nextDay,
        inMonth: false,
      });

      nextDay++;
    }

    return result;
  }, [viewDate]);

  const isSameDate = (
    first: Date | null,
    second: Date
  ) => {
    if (!first) return false;

    return (
      first.getFullYear() ===
        second.getFullYear() &&
      first.getMonth() ===
        second.getMonth() &&
      first.getDate() ===
        second.getDate()
    );
  };

  const selectDate = (date: Date) => {
    onChange(formatDate(date));
    setOpen(false);
  };

  const previousMonth = () => {
    setViewDate(
      new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() - 1,
        1
      )
    );
  };

  const nextMonth = () => {
    setViewDate(
      new Date(
        viewDate.getFullYear(),
        viewDate.getMonth() + 1,
        1
      )
    );
  };

  const clearDate = () => {
    onChange("");
    setOpen(false);
  };

  const today = () => {
    const now = new Date();

    onChange(formatDate(now));
    setViewDate(now);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
        onFocus={() => setOpen(true)}
        className={`${FIELD} pr-10`}
      />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-[#667085] hover:bg-[#F3F6FA] hover:text-[#2589E8]"
        aria-label="Open calendar"
      >
        <CalendarDays size={16} />
      </button>

      {open && (
        <div className="absolute left-0 top-[44px] z-[200] w-[280px] rounded-[8px] border border-[#E2E5E9] bg-white p-3 shadow-[0_8px_30px_rgba(16,24,40,0.15)]">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#F3F6FA]"
            >
              <ChevronLeft size={15} />
            </button>

            <span className="text-[13px] font-semibold text-[#344054]">
              {MONTHS[
                viewDate.getMonth()
              ]}{" "}
              {viewDate.getFullYear()}
            </span>

            <button
              type="button"
              onClick={nextMonth}
              className="flex h-7 w-7 items-center justify-center rounded hover:bg-[#F3F6FA]"
            >
              <ChevronRight size={15} />
            </button>
          </div>

          <div className="mb-1 grid grid-cols-7">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 text-center text-[10px] font-semibold text-[#98A2B3]"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((cell) => {
              const selected =
                isSameDate(
                  selectedDate,
                  cell.date
                );

              return (
                <button
                  type="button"
                  key={cell.date.toISOString()}
                  onClick={() =>
                    selectDate(cell.date)
                  }
                  className={`
                    mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[11px]
                    ${
                      selected
                        ? "bg-[#2589E8] font-semibold text-white"
                        : cell.inMonth
                        ? "text-[#475467] hover:bg-[#EEF6FF]"
                        : "text-[#C4CAD2]"
                    }
                  `}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between border-t border-[#EEF0F3] pt-2">
            <button
              type="button"
              onClick={clearDate}
              className="text-[10px] font-medium text-[#667085] hover:text-[#344054]"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={today}
              className="text-[10px] font-semibold text-[#2D8CF0] hover:text-[#1B7BE0]"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ============================================================
   MAIN WIZARD
============================================================ */

const AddEmployeeWizard: React.FC<
  AddEmployeeWizardProps
> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [stepIndex, setStepIndex] =
    useState(0);

  const [formData, setFormData] =
    useState<EmployeeFormData>({
      ...defaultFormData,
      ...initialData,
    });

  useEffect(() => {
    if (open) {
      setStepIndex(0);

      setFormData({
        ...defaultFormData,
        ...initialData,
      });
    }
  }, [open, initialData]);

  if (!open) return null;

  const currentStep =
    STEPS[stepIndex];

  const isFirst =
    stepIndex === 0;

  const isLast =
    stepIndex === STEPS.length - 1;

  const handleChange = <
    K extends keyof EmployeeFormData
  >(
    field: K,
    value: EmployeeFormData[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const canAdvance =
    currentStep !== "General" ||
    Boolean(
      formData.firstName.trim() &&
        formData.gender &&
        formData.maritalStatus &&
        formData.dateOfJoining &&
        formData.dateOfSalary
    );

  const goNext = () => {
    if (!canAdvance) return;

    if (isLast) {
      onSubmit(formData);
      onClose();
      return;
    }

    setStepIndex(
      (index) => index + 1
    );
  };

  const goBack = () => {
    if (isFirst) {
      onClose();
      return;
    }

    setStepIndex(
      (index) => index - 1
    );
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-[rgba(15,23,42,0.48)]
        backdrop-blur-[1px]
      "
    >
      <div
        className="
          flex h-[calc(100vh-70px)] w-[calc(100vw-42px)]
          max-w-[1500px]
          flex-col overflow-hidden
          rounded-[4px]
          border border-[#DCE1E8]
          bg-white
          shadow-[0_20px_60px_rgba(15,23,42,0.24),0_5px_15px_rgba(15,23,42,0.12)]
        "
      >
        {/* TOP HEADER */}

        <div
          className="
            flex h-[48px] shrink-0
            items-center justify-between
            border-b border-[#E9EDF2]
            bg-white px-4
          "
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[4px] bg-[#2D8CF0] text-white">
                <UserRound size={13} />
              </div>

              <span className="truncate text-[13px] font-semibold text-[#27364D]">
                Koundinyasa Technology Services Pvt. Ltd.
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded text-[#667085] hover:bg-[#F3F5F7] hover:text-[#344054]"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* PROGRESS BAR */}

        <div className="flex h-[54px] shrink-0 items-center border-b border-[#E9EDF2] bg-[#FAFBFC] px-6">
          <div className="flex w-full items-center">
            {STEPS.map(
              (
                step,
                index
              ) => {
                const active =
                  index ===
                  stepIndex;

                const completed =
                  index <
                  stepIndex;

                return (
                  <React.Fragment
                    key={step}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (
                          index <=
                          stepIndex
                        ) {
                          setStepIndex(
                            index
                          );
                        }
                      }}
                      className="flex min-w-0 items-center gap-2"
                    >
                      <span
                        className={`
                          flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold
                          ${
                            active
                              ? "border-[#2D8CF0] bg-[#2D8CF0] text-white"
                              : completed
                              ? "border-[#2D8CF0] bg-[#EAF4FF] text-[#2D8CF0]"
                              : "border-[#D0D5DD] bg-white text-[#98A2B3]"
                          }
                        `}
                      >
                        {completed ? (
                          <Check
                            size={13}
                          />
                        ) : (
                          index + 1
                        )}
                      </span>

                      <span
                        className={`
                          hidden text-[11px] font-medium lg:block
                          ${
                            active
                              ? "text-[#2D8CF0]"
                              : completed
                              ? "text-[#475467]"
                              : "text-[#98A2B3]"
                          }
                        `}
                      >
                        {step}
                      </span>
                    </button>

                    {index <
                      STEPS.length -
                        1 && (
                      <div
                        className={`
                          mx-2 h-px flex-1
                          ${
                            index <
                            stepIndex
                              ? "bg-[#2D8CF0]"
                              : "bg-[#E4E7EC]"
                          }
                        `}
                      />
                    )}
                  </React.Fragment>
                );
              }
            )}
          </div>
        </div>

        {/* CONTENT */}

        <div className="min-h-0 flex-1 overflow-y-auto bg-white p-5">
          {/* ==================================================
              GENERAL
          ================================================== */}

          {currentStep === "General" && (
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  General Information
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Enter the employee's basic personal and joining details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* EMPLOYEE ID */}

                <div>
                  <label className={LABEL}>
                    Employee ID
                  </label>

                  <input
                    className={`${FIELD} bg-[#F9FAFB]`}
                    value={formData.employeeId}
                    readOnly
                  />
                </div>

                {/* TITLE */}

                <div>
                  <label className={LABEL}>
                    Title
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={formData.title}
                      onChange={(e) =>
                        handleChange(
                          "title",
                          e.target.value
                        )
                      }
                    >
                      <option value="Mr">
                        Mr
                      </option>

                      <option value="Ms">
                        Ms
                      </option>

                      <option value="Mrs">
                        Mrs
                      </option>

                      <option value="Dr">
                        Dr
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* FIRST NAME */}

                <div>
                  <label className={LABEL}>
                    First Name{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    className={FIELD}
                    value={formData.firstName}
                    placeholder="Enter first name"
                    onChange={(e) =>
                      handleChange(
                        "firstName",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* MIDDLE NAME */}

                <div>
                  <label className={LABEL}>
                    Middle Name
                  </label>

                  <input
                    className={FIELD}
                    value={formData.middleName}
                    placeholder="Enter middle name"
                    onChange={(e) =>
                      handleChange(
                        "middleName",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* LAST NAME */}

                <div>
                  <label className={LABEL}>
                    Last Name
                  </label>

                  <input
                    className={FIELD}
                    value={formData.lastName}
                    placeholder="Enter last name"
                    onChange={(e) =>
                      handleChange(
                        "lastName",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* FULL NAME */}

                <div>
                  <label className={LABEL}>
                    Full Name
                  </label>

                  <input
                    className={FIELD}
                    value={formData.fullName}
                    placeholder="Full name"
                    onChange={(e) =>
                      handleChange(
                        "fullName",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* GENDER */}

                <div>
                  <label className={LABEL}>
                    Gender{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={formData.gender}
                      onChange={(e) =>
                        handleChange(
                          "gender",
                          e.target.value
                        )
                      }
                    >
                      <option value="Male">
                        Male
                      </option>

                      <option value="Female">
                        Female
                      </option>

                      <option value="Other">
                        Other
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* FATHER NAME */}

                <div>
                  <label className={LABEL}>
                    Father Name
                  </label>

                  <input
                    className={FIELD}
                    value={formData.fatherName}
                    placeholder="Enter father name"
                    onChange={(e) =>
                      handleChange(
                        "fatherName",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* MARITAL STATUS */}

                <div>
                  <label className={LABEL}>
                    Marital Status
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={
                        formData.maritalStatus
                      }
                      onChange={(e) =>
                        handleChange(
                          "maritalStatus",
                          e.target.value
                        )
                      }
                    >
                      <option value="Unmarried">
                        Unmarried
                      </option>

                      <option value="Married">
                        Married
                      </option>

                      <option value="Divorced">
                        Divorced
                      </option>

                      <option value="Widowed">
                        Widowed
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* SPOUSE */}

                <div>
                  <label className={LABEL}>
                    Spouse Name
                  </label>

                  <input
                    className={FIELD}
                    value={formData.spouseName}
                    placeholder="Enter spouse name"
                    onChange={(e) =>
                      handleChange(
                        "spouseName",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* DATE OF JOINING */}

                <div>
                  <label className={LABEL}>
                    Date of Joining{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <DatePickerField
                    value={
                      formData.dateOfJoining
                    }
                    onChange={(value) =>
                      handleChange(
                        "dateOfJoining",
                        value
                      )
                    }
                  />
                </div>

                {/* DATE OF SALARY */}

                <div>
                  <label className={LABEL}>
                    Date of Salary{" "}
                    <span className="text-red-500">
                      *
                    </span>
                  </label>

                  <DatePickerField
                    value={
                      formData.dateOfSalary
                    }
                    onChange={(value) =>
                      handleChange(
                        "dateOfSalary",
                        value
                      )
                    }
                  />
                </div>

                {/* PROBATION */}

                <div>
                  <label className={LABEL}>
                    Probation Period
                    {" "}
                    <span className="text-[#98A2B3]">
                      (days)
                    </span>
                  </label>

                  <input
                    type="number"
                    min={0}
                    className={FIELD}
                    value={
                      formData.probationPeriod
                    }
                    onChange={(e) =>
                      handleChange(
                        "probationPeriod",
                        Number(
                          e.target.value
                        )
                      )
                    }
                  />
                </div>

                {/* CONFIRMATION DATE */}

                <div>
                  <label className={LABEL}>
                    Confirmation Date
                  </label>

                  <DatePickerField
                    value={
                      formData.confirmationDate
                    }
                    onChange={(value) =>
                      handleChange(
                        "confirmationDate",
                        value
                      )
                    }
                  />
                </div>

                {/* NOTES */}

                <div className="md:col-span-2">
                  <label className={LABEL}>
                    Notes
                  </label>

                  <textarea
                    className={`${FIELD} h-[90px] resize-none py-2.5`}
                    value={formData.notes}
                    placeholder="Enter notes..."
                    onChange={(e) =>
                      handleChange(
                        "notes",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              CLASSIFICATION
          ================================================== */}

          {currentStep === "Classification" && (
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  Classification
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Define the employee's organizational and employment details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* DEPARTMENT */}

                <div>
                  <label className={LABEL}>
                    Department
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={
                        formData.department
                      }
                      onChange={(e) =>
                        handleChange(
                          "department",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select department
                      </option>

                      <option value="IT">
                        IT
                      </option>

                      <option value="HR">
                        HR
                      </option>

                      <option value="Finance">
                        Finance
                      </option>

                      <option value="Operations">
                        Operations
                      </option>

                      <option value="Administration">
                        Administration
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* DESIGNATION */}

                <div>
                  <label className={LABEL}>
                    Designation
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.designation
                    }
                    placeholder="Enter designation"
                    onChange={(e) =>
                      handleChange(
                        "designation",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* EMPLOYMENT TYPE */}

                <div>
                  <label className={LABEL}>
                    Employment Type
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={
                        formData.employmentType
                      }
                      onChange={(e) =>
                        handleChange(
                          "employmentType",
                          e.target.value
                        )
                      }
                    >
                      <option value="Permanent">
                        Permanent
                      </option>

                      <option value="Contract">
                        Contract
                      </option>

                      <option value="Intern">
                        Intern
                      </option>

                      <option value="Temporary">
                        Temporary
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* WORK LOCATION */}

                <div>
                  <label className={LABEL}>
                    Work Location
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.workLocation
                    }
                    placeholder="Enter work location"
                    onChange={(e) =>
                      handleChange(
                        "workLocation",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* REPORTING MANAGER */}

                <div>
                  <label className={LABEL}>
                    Reporting Manager
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.reportingManager
                    }
                    placeholder="Enter reporting manager"
                    onChange={(e) =>
                      handleChange(
                        "reportingManager",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* EMPLOYEE CATEGORY */}

                <div>
                  <label className={LABEL}>
                    Employee Category
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={
                        formData.employeeCategory
                      }
                      onChange={(e) =>
                        handleChange(
                          "employeeCategory",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select category
                      </option>

                      <option value="Staff">
                        Staff
                      </option>

                      <option value="Management">
                        Management
                      </option>

                      <option value="Worker">
                        Worker
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              STATUTORY
          ================================================== */}

          {currentStep === "Statutory" && (
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  Statutory Information
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Enter statutory, tax, PF, ESI and bank information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* PAN */}

                <div>
                  <label className={LABEL}>
                    PAN Number
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.panNumber
                    }
                    placeholder="Enter PAN number"
                    onChange={(e) =>
                      handleChange(
                        "panNumber",
                        e.target.value.toUpperCase()
                      )
                    }
                  />
                </div>

                {/* AADHAAR */}

                <div>
                  <label className={LABEL}>
                    Aadhaar Number
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.aadhaarNumber
                    }
                    placeholder="Enter Aadhaar number"
                    onChange={(e) =>
                      handleChange(
                        "aadhaarNumber",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* UAN */}

                <div>
                  <label className={LABEL}>
                    UAN Number
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.uanNumber
                    }
                    placeholder="Enter UAN number"
                    onChange={(e) =>
                      handleChange(
                        "uanNumber",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* PF */}

                <div>
                  <label className={LABEL}>
                    PF Number
                  </label>

                  <input
                    className={`${FIELD} ${
                      !formData.pfApplicable
                        ? "bg-[#F9FAFB]"
                        : ""
                    }`}
                    disabled={
                      !formData.pfApplicable
                    }
                    value={
                      formData.pfNumber
                    }
                    placeholder="Enter PF number"
                    onChange={(e) =>
                      handleChange(
                        "pfNumber",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* PF TOGGLE */}

                <div className="flex items-end">
                  <label className="flex h-[40px] cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        formData.pfApplicable
                      }
                      onChange={(e) =>
                        handleChange(
                          "pfApplicable",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#2589E8] focus:ring-[#2589E8]"
                    />

                    <span className="text-[12px] font-medium text-[#475467]">
                      PF Applicable
                    </span>
                  </label>
                </div>

                {/* ESI */}

                <div>
                  <label className={LABEL}>
                    ESI Number
                  </label>

                  <input
                    className={`${FIELD} ${
                      !formData.esiApplicable
                        ? "bg-[#F9FAFB]"
                        : ""
                    }`}
                    disabled={
                      !formData.esiApplicable
                    }
                    value={
                      formData.esiNumber
                    }
                    placeholder="Enter ESI number"
                    onChange={(e) =>
                      handleChange(
                        "esiNumber",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* ESI TOGGLE */}

                <div className="flex items-end">
                  <label className="flex h-[40px] cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={
                        formData.esiApplicable
                      }
                      onChange={(e) =>
                        handleChange(
                          "esiApplicable",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-[#2589E8] focus:ring-[#2589E8]"
                    />

                    <span className="text-[12px] font-medium text-[#475467]">
                      ESI Applicable
                    </span>
                  </label>
                </div>

                {/* BANK ACCOUNT */}

                <div>
                  <label className={LABEL}>
                    Bank Account Number
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.bankAccountNumber
                    }
                    placeholder="Enter account number"
                    onChange={(e) =>
                      handleChange(
                        "bankAccountNumber",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* IFSC */}

                <div>
                  <label className={LABEL}>
                    Bank IFSC
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.bankIfsc
                    }
                    placeholder="Enter IFSC"
                    onChange={(e) =>
                      handleChange(
                        "bankIfsc",
                        e.target.value.toUpperCase()
                      )
                    }
                  />
                </div>

                {/* BANK NAME */}

                <div>
                  <label className={LABEL}>
                    Bank Name
                  </label>

                  <input
                    className={FIELD}
                    value={
                      formData.bankName
                    }
                    placeholder="Enter bank name"
                    onChange={(e) =>
                      handleChange(
                        "bankName",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              ADDRESS
          ================================================== */}

          {currentStep === "Address" && (
            <div className="mx-auto max-w-[1200px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  Address Information
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Enter the employee's residential and contact address.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {/* PRESENT ADDRESS */}

                <div className="rounded-lg border border-[#E2E5E9] bg-white p-4">
                  <div className="mb-4 flex h-[34px] items-center justify-center rounded-[4px] bg-[#DCEEFB]">
                    <span className="text-[13px] font-medium text-[#4A6B85]">
                      Present Address
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className={LABEL}>
                        Address Line 1
                      </label>

                      <input
                        className={FIELD}
                        value={
                          formData.addressLine1
                        }
                        placeholder="Address line 1"
                        onChange={(e) =>
                          handleChange(
                            "addressLine1",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        Address Line 2
                      </label>

                      <input
                        className={FIELD}
                        value={
                          formData.addressLine2
                        }
                        placeholder="Address line 2"
                        onChange={(e) =>
                          handleChange(
                            "addressLine2",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        City
                      </label>

                      <input
                        className={FIELD}
                        value={
                          formData.city
                        }
                        placeholder="City"
                        onChange={(e) =>
                          handleChange(
                            "city",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        State
                      </label>

                      <input
                        className={FIELD}
                        value={
                          formData.state
                        }
                        placeholder="State"
                        onChange={(e) =>
                          handleChange(
                            "state",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        Pincode
                      </label>

                      <input
                        className={FIELD}
                        value={
                          formData.pincode
                        }
                        placeholder="Pincode"
                        onChange={(e) =>
                          handleChange(
                            "pincode",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>

                {/* CONTACT INFORMATION */}

                <div className="rounded-lg border border-[#E2E5E9] bg-white p-4">
                  <div className="mb-4 flex h-[34px] items-center justify-center rounded-[4px] bg-[#DCEEFB]">
                    <span className="text-[13px] font-medium text-[#4A6B85]">
                      Contact Information
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={LABEL}>
                        Mobile Number
                      </label>

                      <input
                        className={FIELD}
                        placeholder="Enter mobile number"
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        Alternate Mobile Number
                      </label>

                      <input
                        className={FIELD}
                        placeholder="Enter alternate number"
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        Email Address
                      </label>

                      <input
                        type="email"
                        className={FIELD}
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className={LABEL}>
                        Emergency Contact
                      </label>

                      <input
                        className={FIELD}
                        placeholder="Emergency contact number"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {/* ==================================================
              HR CATEGORY
          ================================================== */}

          {currentStep === "HR Category" && (
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  HR Category
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Select the employee's HR category and related information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* HR CATEGORY */}

                <div>
                  <label className={LABEL}>
                    HR Category
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={formData.hrCategory}
                      onChange={(e) =>
                        handleChange(
                          "hrCategory",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select HR Category
                      </option>

                      <option value="Extracurricular Event">
                        Extracurricular Event
                      </option>

                      <option value="Award">
                        Award
                      </option>

                      <option value="General">
                        General
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* EMPLOYEE CATEGORY */}

                <div>
                  <label className={LABEL}>
                    Employee Category
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={formData.employeeCategory}
                      onChange={(e) =>
                        handleChange(
                          "employeeCategory",
                          e.target.value
                        )
                      }
                    >
                      <option value="">
                        Select Employee Category
                      </option>

                      <option value="Staff">
                        Staff
                      </option>

                      <option value="Management">
                        Management
                      </option>

                      <option value="Worker">
                        Worker
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* REPORTING MANAGER */}

                <div>
                  <label className={LABEL}>
                    Reporting Manager
                  </label>

                  <input
                    className={FIELD}
                    value={formData.reportingManager}
                    placeholder="Enter reporting manager"
                    onChange={(e) =>
                      handleChange(
                        "reportingManager",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* ==================================================
              DOCUMENTS
          ================================================== */}

          {currentStep === "Documents" && (
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  Documents
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Upload documents associated with this employee.
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#FAFBFC] p-8">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF4FF] text-[#2589E8]">
                    <Upload size={19} />
                  </div>

                  <h3 className="text-[13px] font-semibold text-[#344054]">
                    Upload Employee Documents
                  </h3>

                  <p className="mt-1 max-w-[450px] text-[11px] leading-5 text-[#98A2B3]">
                    Select one or more files to attach to the employee
                    profile.
                  </p>

                  <label className="mt-4 inline-flex h-[36px] cursor-pointer items-center gap-2 rounded-[5px] bg-[#2589E8] px-4 text-[12px] font-medium text-white shadow-sm transition hover:bg-[#1E7DD4]">
                    <Upload size={14} />

                    Choose Files

                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        handleChange(
                          "documents",
                          Array.from(
                            e.target.files || []
                          )
                        )
                      }
                    />
                  </label>
                </div>
              </div>

              {/* SELECTED FILES */}

              {formData.documents.length > 0 && (
                <div className="mt-5 rounded-lg border border-[#E2E5E9] bg-white">
                  <div className="border-b border-[#EEF0F3] px-4 py-3">
                    <span className="text-[12px] font-semibold text-[#344054]">
                      Selected Documents
                    </span>
                  </div>

                  <div className="divide-y divide-[#EEF0F3]">
                    {formData.documents.map(
                      (file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex items-center justify-between px-4 py-3"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-[#F2F4F7] text-[#667085]">
                              <FileText size={15} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-[12px] font-medium text-[#344054]">
                                {file.name}
                              </p>

                              <p className="mt-0.5 text-[10px] text-[#98A2B3]">
                                {(
                                  file.size /
                                  1024
                                ).toFixed(1)}{" "}
                                KB
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              handleChange(
                                "documents",
                                formData.documents.filter(
                                  (_, fileIndex) =>
                                    fileIndex !==
                                    index
                                )
                              )
                            }
                            className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded text-[#98A2B3] hover:bg-[#FEF3F2] hover:text-[#D92D20]"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ==================================================
              SALARY RATE
          ================================================== */}

          {currentStep === "Salary Rate" && (
            <div className="mx-auto max-w-[1100px]">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#344054]">
                  Salary Rate
                </h2>

                <p className="mt-1 text-[11px] text-[#98A2B3]">
                  Enter the employee's salary and payment information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                {/* SALARY TYPE */}

                <div>
                  <label className={LABEL}>
                    Salary Type
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={formData.salaryType}
                      onChange={(e) =>
                        handleChange(
                          "salaryType",
                          e.target.value
                        )
                      }
                    >
                      <option value="Monthly">
                        Monthly
                      </option>

                      <option value="Annual">
                        Annual
                      </option>

                      <option value="Hourly">
                        Hourly
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>

                {/* SALARY AMOUNT */}

                <div>
                  <label className={LABEL}>
                    Salary Amount
                  </label>

                  <input
                    type="number"
                    min={0}
                    className={FIELD}
                    value={formData.salaryAmount}
                    placeholder="Enter salary amount"
                    onChange={(e) =>
                      handleChange(
                        "salaryAmount",
                        e.target.value
                      )
                    }
                  />
                </div>

                {/* PAY FREQUENCY */}

                <div>
                  <label className={LABEL}>
                    Pay Frequency
                  </label>

                  <div className="relative">
                    <select
                      className={SELECT_FIELD}
                      value={formData.payFrequency}
                      onChange={(e) =>
                        handleChange(
                          "payFrequency",
                          e.target.value
                        )
                      }
                    >
                      <option value="Monthly">
                        Monthly
                      </option>

                      <option value="Weekly">
                        Weekly
                      </option>

                      <option value="Bi-Weekly">
                        Bi-Weekly
                      </option>

                      <option value="Daily">
                        Daily
                      </option>
                    </select>

                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                    />
                  </div>
                </div>
              </div>

              {/* SUMMARY */}

              <div className="mt-7 rounded-lg border border-[#D9E8F7] bg-[#F7FBFF] p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Banknote
                    size={16}
                    className="text-[#2589E8]"
                  />

                  <span className="text-[13px] font-semibold text-[#344054]">
                    Employee Summary
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] text-[#98A2B3]">
                      Employee ID
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#475467]">
                      {formData.employeeId ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#98A2B3]">
                      Employee Name
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#475467]">
                      {[
                        formData.firstName,
                        formData.middleName,
                        formData.lastName,
                      ]
                        .filter(Boolean)
                        .join(" ") ||
                        "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-[#98A2B3]">
                      Designation
                    </p>

                    <p className="mt-1 text-[12px] font-medium text-[#475467]">
                      {formData.designation ||
                        "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <div className="flex h-[56px] shrink-0 items-center justify-between border-t border-[#E9EDF2] bg-white px-5">
          {/* LEFT */}

          <div>
            <span className="text-[11px] text-[#98A2B3]">
              Step {stepIndex + 1} of{" "}
              {STEPS.length}
            </span>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="inline-flex h-[34px] items-center gap-1.5 rounded-[5px] border border-[#D0D5DD] bg-white px-4 text-[12px] font-medium text-[#475467] transition hover:bg-[#F9FAFB]"
            >
              <ChevronLeft size={14} />

              {isFirst
                ? "Cancel"
                : "Previous"}
            </button>

            <button
              type="button"
              onClick={goNext}
              disabled={!canAdvance}
              className={`
                inline-flex h-[34px] items-center gap-1.5 rounded-[5px] px-4 text-[12px] font-medium text-white transition
                ${
                  canAdvance
                    ? "bg-[#2589E8] shadow-[0_2px_4px_rgba(37,137,232,0.22)] hover:bg-[#1E7DD4]"
                    : "cursor-not-allowed bg-[#B8C7D8]"
                }
              `}
            >
              {isLast ? (
                <>
                  <Save size={14} />
                  Save Employee
                </>
              ) : (
                <>
                  Next
                  <ChevronRight
                    size={14}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeWizard;







