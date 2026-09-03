// import React, { useRef, useState } from "react";
// import { Calendar, ChevronDown, Plus } from "lucide-react";
// import AddEmployeeWizard, { type EmployeeFormData } from "./AddEmployeeWizard";
// import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

// /* =========================================================
//    TYPES
// ========================================================= */

// type CandidateForm = {
//   title: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   fullName: string;
//   fatherName: string;
//   maritalStatus: string;
//   spouseName: string;
//   dob: string;
//   gender: string;
//   physicallyChallenged: boolean;
//   photoUrl: string;
// };

// /* =========================================================
//    DESIGN TOKENS  — sized to the Figma
// ========================================================= */

// const FIELD = `
//   h-[40px] w-full rounded-[4px] border border-[#E8E2D6]
//   bg-[#FEFAF2] px-[12px] text-[13px] text-[#5B6572]
//   outline-none transition-all duration-150
//   placeholder:text-[#BEB4A4]
//   focus:border-[#2D8CF0] focus:ring-2 focus:ring-[#2D8CF0]/15
// `;

// const LABEL =
//   "mb-[6px] block text-[12px] leading-[15px] font-medium text-[#596273]";

// /* =========================================================
//    DATE HELPERS
// ========================================================= */

// const toISO = (ddmmyyyy: string): string => {
//   if (!ddmmyyyy || ddmmyyyy.length !== 10) return "";
//   const [dd, mm, yyyy] = ddmmyyyy.split("-");
//   return dd && mm && yyyy ? `${yyyy}-${mm}-${dd}` : "";
// };

// const toDisplay = (iso: string): string => {
//   if (!iso || iso.length !== 10) return "";
//   const [yyyy, mm, dd] = iso.split("-");
//   return yyyy && mm && dd ? `${dd}-${mm}-${yyyy}` : "";
// };

// /* =========================================================
//    FIELD
// ========================================================= */

// interface FieldProps {
//   label: string;
//   children: React.ReactNode;
//   className?: string;
// }

// const Field: React.FC<FieldProps> = ({ label, children, className = "" }) => (
//   <div className={className}>
//     <label className={LABEL}>{label}</label>
//     {children}
//   </div>
// );

// /* =========================================================
//    DATE INPUT
// ========================================================= */

// interface DateInputProps {
//   value: string;
//   onChange: (value: string) => void;
// }

// const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
//   const hiddenDateRef = useRef<HTMLInputElement>(null);

//   const openPicker = () => {
//     const el = hiddenDateRef.current;
//     if (!el) return;
//     if (typeof (el as any).showPicker === "function") (el as any).showPicker();
//     else {
//       el.focus();
//       el.click();
//     }
//   };

//   return (
//     <div className="relative">
//       <input
//         type="text"
//         value={value}
//         readOnly
//         onClick={openPicker}
//         placeholder="DD-MM-YYYY"
//         className={`${FIELD} pr-[36px] cursor-pointer`}
//       />
//       <button
//         type="button"
//         onClick={openPicker}
//         className="absolute right-2 top-1/2 -translate-y-1/2 flex h-[24px] w-[24px] items-center justify-center rounded text-[#A98A5A] hover:bg-[#F5F0E8]"
//       >
//         <Calendar size={15} />
//       </button>
//       <input
//         ref={hiddenDateRef}
//         type="date"
//         value={toISO(value)}
//         onChange={(e) => {
//           const iso = e.target.value;
//           onChange(iso ? toDisplay(iso) : "");
//         }}
//         className="absolute opacity-0 pointer-events-none w-0 h-0"
//         tabIndex={-1}
//       />
//     </div>
//   );
// };

// /* =========================================================
//    PAGE
// ========================================================= */

// const PendingCandidatePage: React.FC = () => {
//   const [wizardOpen, setWizardOpen] = useState(false);
//   const [selectedCandidate, setSelectedCandidate] = useState("Vakati Nandhini");

//   const [form, setForm] = useState<CandidateForm>({
//     title: "Ms",
//     firstName: "Vakati",
//     middleName: "Kumar",
//     lastName: "Nandhini",
//     fullName: "Vakati Nandhini",
//     fatherName: "Vakati Vijaya Bhaskar Reddy",
//     maritalStatus: "Unmarried",
//     spouseName: "Khushaboo Sharma",
//     dob: "16-08-2002",
//     gender: "Female",
//     physicallyChallenged: true,
//     photoUrl: "https://randomuser.me/api/portraits/women/68.jpg",
//   });

//   const candidates = ["Vakati Nandhini"];

//   const handleChange = (field: keyof CandidateForm, value: string | boolean) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const wizardPrefill: Partial<EmployeeFormData> = {
//     employeeId: "344913",
//     title: form.title,
//     firstName: form.firstName,
//     middleName: form.middleName,
//     lastName: form.lastName,
//     fullName: form.fullName,
//     gender: form.gender,
//     fatherName: form.fatherName,
//     maritalStatus: form.maritalStatus,
//     spouseName: form.spouseName,
//     photoUrl: form.photoUrl,
//     confirmationDate: "",
//     notes: "",
//     dateOfJoining: "",
//     dateOfSalary: "",
//     prefix: "",
//     probationPeriod: 30,
//     panNumber: "",
//     aadhaarNumber: "",
//     uanNumber: "",
//     pfApplicable: true,
//     pfNumber: "",
//     esiApplicable: false,
//     esiNumber: "",
//     bankAccountNumber: "",
//     bankIfsc: "",
//     bankName: "",
//     documents: [],
//   };

//   const handleWizardSubmit = (data: EmployeeFormData) => {
//     console.log("Employee created:", data);
//     setWizardOpen(false);
//   };

//   return (
//     <div className="relative h-[calc(100vh-80px)] w-full bg-[#F5F7FA] flex flex-col overflow-hidden">
//       <EnrollmentToolbarPortal>
//         <button
//           type="button"
//           onClick={() => setWizardOpen(true)}
//           className="flex h-[32px] items-center gap-1.5 rounded-[5px] bg-[#2589E8] px-3.5 text-[12.5px] font-semibold text-white shadow-[0_1px_3px_rgba(37,137,232,0.3)] hover:bg-[#147BD8]"
//         >
//           <Plus size={14} strokeWidth={2.5} />
//           <span>Add Employee</span>
//         </button>
//       </EnrollmentToolbarPortal>

//       {/* FULL HEIGHT CARD — stretches to fill the viewport */}
//       <div className="flex-1 min-h-0 flex overflow-hidden rounded-[6px] border border-[#E7E9ED] bg-white m-2 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
//         {/* LEFT SIDEBAR — full height */}
//         <aside className="w-[190px] shrink-0 border-r border-[#EEF0F3] bg-white overflow-y-auto">
//           <div className="py-1.5">
//             {candidates.map((candidate) => {
//               const active = candidate === selectedCandidate;
//               return (
//                 <button
//                   key={candidate}
//                   type="button"
//                   onClick={() => setSelectedCandidate(candidate)}
//                   className={`
//                     relative flex h-[42px] w-full items-center px-4 text-left text-[13px] transition-colors
//                     ${
//                       active
//                         ? "bg-[#F5F8FC] font-semibold text-[#2589E8]"
//                         : "text-[#687384] hover:bg-[#F8FAFC]"
//                     }
//                   `}
//                 >
//                   {candidate}
//                   {active && (
//                     <span className="absolute right-0 top-0 h-full w-[3px] bg-[#2589E8]" />
//                   )}
//                 </button>
//               );
//             })}
//           </div>
//         </aside>

//         {/* MAIN CONTENT — fills remaining width + height */}
//         <main className="flex-1 min-w-0 overflow-y-auto bg-white">
//           <div className="flex h-full gap-10 px-10 py-7">
//             {/* PHOTO */}
//             <div className="flex-shrink-0 pt-[26px]">
//               <div className="flex h-[190px] w-[160px] items-center justify-center rounded-[3px] border border-dashed border-[#D6D9DE] bg-white p-2">
//                 <img
//                   src={form.photoUrl}
//                   alt="Candidate"
//                   className="h-full w-full object-cover"
//                 />
//               </div>
//             </div>

//             {/* FORM — grows to fill available width */}
//             <section className="flex-1 min-w-0">
//               <div className="mb-5 border-b border-[#ECEEF2] pb-3">
//                 <h2 className="text-[15px] font-semibold text-[#38455A]">
//                   General Details
//                 </h2>
//               </div>

//               <div className="grid grid-cols-2 gap-x-10 gap-y-[18px]">
//                 <div className="flex items-end gap-3">
//                   <Field label="Title" className="w-[70px] shrink-0">
//                     <input
//                       value={form.title}
//                       onChange={(e) => handleChange("title", e.target.value)}
//                       className={FIELD}
//                     />
//                   </Field>
//                   <Field label="First Name" className="min-w-0 flex-1">
//                     <input
//                       value={form.firstName}
//                       onChange={(e) => handleChange("firstName", e.target.value)}
//                       className={FIELD}
//                     />
//                   </Field>
//                 </div>

//                 <Field label="Father Name">
//                   <input
//                     value={form.fatherName}
//                     onChange={(e) => handleChange("fatherName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Middle Name">
//                   <input
//                     value={form.middleName}
//                     onChange={(e) => handleChange("middleName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Marital Status">
//                   <div className="relative">
//                     <select
//                       value={form.maritalStatus}
//                       onChange={(e) => handleChange("maritalStatus", e.target.value)}
//                       className={`${FIELD} cursor-pointer appearance-none pr-9`}
//                     >
//                       <option>Unmarried</option>
//                       <option>Married</option>
//                       <option>Divorced</option>
//                       <option>Widowed</option>
//                     </select>
//                     <ChevronDown
//                       size={15}
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
//                     />
//                   </div>
//                 </Field>

//                 <Field label="Last Name">
//                   <input
//                     value={form.lastName}
//                     onChange={(e) => handleChange("lastName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Spouse Name">
//                   <input
//                     value={form.spouseName}
//                     onChange={(e) => handleChange("spouseName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Full Name">
//                   <input
//                     value={form.fullName}
//                     onChange={(e) => handleChange("fullName", e.target.value)}
//                     className={FIELD}
//                   />
//                 </Field>

//                 <Field label="Date Of Birth">
//                   <DateInput value={form.dob} onChange={(v) => handleChange("dob", v)} />
//                 </Field>

//                 <Field label="Gender">
//                   <div className="relative">
//                     <select
//                       value={form.gender}
//                       onChange={(e) => handleChange("gender", e.target.value)}
//                       className={`${FIELD} cursor-pointer appearance-none pr-9`}
//                     >
//                       <option>Female</option>
//                       <option>Male</option>
//                       <option>Other</option>
//                     </select>
//                     <ChevronDown
//                       size={15}
//                       className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
//                     />
//                   </div>
//                 </Field>

//                 <label
//                   htmlFor="physically-challenged"
//                   className="flex cursor-pointer items-center gap-2.5 pt-[27px] text-[13px] text-[#596273]"
//                 >
//                   <input
//                     id="physically-challenged"
//                     type="checkbox"
//                     checked={form.physicallyChallenged}
//                     onChange={(e) =>
//                       handleChange("physicallyChallenged", e.target.checked)
//                     }
//                     className="h-4 w-4 cursor-pointer rounded-[3px] accent-[#2589E8]"
//                   />
//                   Physically Challenged
//                 </label>
//               </div>
//             </section>
//           </div>
//         </main>
//       </div>

//       <AddEmployeeWizard
//         open={wizardOpen}
//         onClose={() => setWizardOpen(false)}
//         onSubmit={handleWizardSubmit}
//         initialData={wizardPrefill}
//       />
//     </div>
//   );
// };

// export default PendingCandidatePage;











import React, { useState } from "react";
import { ChevronDown, Plus } from "lucide-react";
import DatePicker from "../../../../../components/ui/datepicker";
import AddEmployeeWizard, { type EmployeeFormData } from "./AddEmployeeWizard";
import EnrollmentToolbarPortal from "../components/EnrollmentToolbarPortal";

/* =========================================================
   TYPES
========================================================= */

type CandidateForm = {
  title: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  fatherName: string;
  maritalStatus: string;
  spouseName: string;
  dob: string;
  gender: string;
  physicallyChallenged: boolean;
  photoUrl: string;
};

/* =========================================================
   DESIGN TOKENS
========================================================= */

const FIELD = `
  h-[40px] w-full rounded-[4px] border border-[#E8E2D6]
  bg-[#FEFAF2] px-[12px] text-[13px] text-[#5B6572]
  outline-none transition-all duration-150
  placeholder:text-[#BEB4A4]
  focus:border-[#2D8CF0] focus:ring-2 focus:ring-[#2D8CF0]/15
`;

const LABEL =
  "mb-[6px] block text-[12px] leading-[15px] font-medium text-[#596273]";

/* =========================================================
   DATE HELPERS
========================================================= */

const toISO = (ddmmyyyy: string): string => {
  if (!ddmmyyyy || ddmmyyyy.length !== 10) return "";

  const [dd, mm, yyyy] = ddmmyyyy.split("-");

  return dd && mm && yyyy
    ? `${yyyy}-${mm}-${dd}`
    : "";
};

const toDisplay = (iso: string): string => {
  if (!iso || iso.length !== 10) return "";

  const [yyyy, mm, dd] = iso.split("-");

  return yyyy && mm && dd
    ? `${dd}-${mm}-${yyyy}`
    : "";
};

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

const isoToDate = (
  iso: string
): Date | null => {
  if (!iso) return null;

  const [yyyy, mm, dd] = iso
    .split("-")
    .map(Number);

  if (!yyyy || !mm || !dd) {
    return null;
  }

  return new Date(
    yyyy,
    mm - 1,
    dd
  );
};

const formatISO = (date: Date): string => {
  const yyyy =
    date.getFullYear();

  const mm = String(
    date.getMonth() + 1
  ).padStart(2, "0");

  const dd = String(
    date.getDate()
  ).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}`;
};

/* =========================================================
   COMMON DATE PICKER
========================================================= */

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  placeholder = "DD-MM-YYYY",
}) => {
  const selectedISO = toISO(value);

  const [open, setOpen] =
    useState(false);

  const [currentMonth, setCurrentMonth] =
    useState<Date>(() => {
      return (
        isoToDate(selectedISO) ??
        new Date()
      );
    });

  const cells = React.useMemo(() => {
    const year =
      currentMonth.getFullYear();

    const month =
      currentMonth.getMonth();

    const firstDay =
      new Date(
        year,
        month,
        1
      ).getDay();

    const daysInMonth =
      new Date(
        year,
        month + 1,
        0
      ).getDate();

    const previousMonthDays =
      new Date(
        year,
        month,
        0
      ).getDate();

    const result: Array<{
      iso: string;
      day: number;
      inMonth: boolean;
      disabled: boolean;
      selected: boolean;
    }> = [];

    for (
      let i = firstDay - 1;
      i >= 0;
      i--
    ) {
      const day =
        previousMonthDays - i;

      const date = new Date(
        year,
        month - 1,
        day
      );

      const iso =
        formatISO(date);

      result.push({
        iso,
        day,
        inMonth: false,
        disabled: false,
        selected:
          iso === selectedISO,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const date = new Date(
        year,
        month,
        day
      );

      const iso =
        formatISO(date);

      result.push({
        iso,
        day,
        inMonth: true,
        disabled: false,
        selected:
          iso === selectedISO,
      });
    }

    let nextDay = 1;

    while (
      result.length < 42
    ) {
      const date = new Date(
        year,
        month + 1,
        nextDay
      );

      const iso =
        formatISO(date);

      result.push({
        iso,
        day: nextDay,
        inMonth: false,
        disabled: false,
        selected:
          iso === selectedISO,
      });

      nextDay++;
    }

    return result;
  }, [
    currentMonth,
    selectedISO,
  ]);

  const monthLabel = `${
    MONTHS[
      currentMonth.getMonth()
    ]
  } ${currentMonth.getFullYear()}`;

  const handleOpenChange = (
    nextOpen: boolean
  ) => {
    if (nextOpen) {
      const selectedDate =
        isoToDate(selectedISO);

      if (selectedDate) {
        setCurrentMonth(
          selectedDate
        );
      }
    }

    setOpen(nextOpen);
  };

  const handleSelectDay = (
    iso: string
  ) => {
    onChange(
      toDisplay(iso)
    );

    setOpen(false);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  const handleClear = () => {
    onChange("");

    setOpen(false);
  };

  const handleToday = () => {
    const today =
      new Date();

    onChange(
      toDisplay(
        formatISO(today)
      )
    );

    setCurrentMonth(
      today
    );

    setOpen(false);
  };

  return (
    <DatePicker
      text={value}
      onTextChange={onChange}
      onBlur={() => {}}
      placeholder={placeholder}
      open={open}
      onOpenChange={
        handleOpenChange
      }
      monthLabel={
        monthLabel
      }
      weekdayLabels={
        WEEKDAYS
      }
      cells={cells}
      onSelectDay={
        handleSelectDay
      }
      onPrevMonth={
        handlePrevMonth
      }
      onNextMonth={
        handleNextMonth
      }
      onClear={
        handleClear
      }
      onToday={
        handleToday
      }
    />
  );
};

/* =========================================================
   PAGE
========================================================= */

const PendingCandidatePage: React.FC =
  () => {
    const [
      wizardOpen,
      setWizardOpen,
    ] = useState(false);

    const [
      selectedCandidate,
      setSelectedCandidate,
    ] = useState(
      "Vakati Nandhini"
    );

    const [form, setForm] =
      useState<CandidateForm>({
        title: "Ms",
        firstName: "Vakati",
        middleName: "Kumar",
        lastName: "Nandhini",
        fullName:
          "Vakati Nandhini",
        fatherName:
          "Vakati Vijaya Bhaskar Reddy",
        maritalStatus:
          "Unmarried",
        spouseName:
          "Khushaboo Sharma",
        dob: "16-08-2002",
        gender: "Female",
        physicallyChallenged:
          true,
        photoUrl:
          "https://randomuser.me/api/portraits/women/68.jpg",
      });

    const candidates = [
      "Vakati Nandhini",
    ];

    const handleChange = (
      field: keyof CandidateForm,
      value:
        | string
        | boolean
    ) => {
      setForm(
        (prev) => ({
          ...prev,
          [field]: value,
        })
      );
    };

    const wizardPrefill:
      Partial<EmployeeFormData> =
      {
        employeeId:
          "344913",
        title:
          form.title,
        firstName:
          form.firstName,
        middleName:
          form.middleName,
        lastName:
          form.lastName,
        fullName:
          form.fullName,
        gender:
          form.gender,
        fatherName:
          form.fatherName,
        maritalStatus:
          form.maritalStatus,
        spouseName:
          form.spouseName,
        photoUrl:
          form.photoUrl,
        confirmationDate:
          "",
        notes: "",
        dateOfJoining:
          "",
        dateOfSalary:
          "",
        prefix: "",
        probationPeriod:
          30,
        panNumber: "",
        aadhaarNumber:
          "",
        uanNumber: "",
        pfApplicable:
          true,
        pfNumber: "",
        esiApplicable:
          false,
        esiNumber: "",
        bankAccountNumber:
          "",
        bankIfsc: "",
        bankName: "",
        documents: [],
      };

    const handleWizardSubmit = (
      data: EmployeeFormData
    ) => {
      console.log(
        "Employee created:",
        data
      );

      setWizardOpen(false);
    };

    return (
      <div className="relative h-[calc(100vh-80px)] w-full bg-[#F5F7FA] flex flex-col overflow-hidden">

        <EnrollmentToolbarPortal>
          <button
            type="button"
            onClick={() =>
              setWizardOpen(
                true
              )
            }
            className="flex h-[32px] items-center gap-1.5 rounded-[5px] bg-[#2589E8] px-3.5 text-[12.5px] font-semibold text-white shadow-[0_1px_3px_rgba(37,137,232,0.3)] hover:bg-[#147BD8]"
          >
            <Plus
              size={14}
              strokeWidth={
                2.5
              }
            />

            <span>
              Add Employee
            </span>
          </button>
        </EnrollmentToolbarPortal>

        <div className="flex-1 min-h-0 flex overflow-hidden rounded-[6px] border border-[#E7E9ED] bg-white m-2 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">

          <aside className="w-[190px] shrink-0 border-r border-[#EEF0F3] bg-white overflow-y-auto">
            <div className="py-1.5">
              {candidates.map(
                (
                  candidate
                ) => {
                  const active =
                    candidate ===
                    selectedCandidate;

                  return (
                    <button
                      key={
                        candidate
                      }
                      type="button"
                      onClick={() =>
                        setSelectedCandidate(
                          candidate
                        )
                      }
                      className={`
                        relative flex h-[42px] w-full items-center px-4 text-left text-[13px] transition-colors
                        ${
                          active
                            ? "bg-[#F5F8FC] font-semibold text-[#2589E8]"
                            : "text-[#687384] hover:bg-[#F8FAFC]"
                        }
                      `}
                    >
                      {
                        candidate
                      }

                      {active && (
                        <span className="absolute right-0 top-0 h-full w-[3px] bg-[#2589E8]" />
                      )}
                    </button>
                  );
                }
              )}
            </div>
          </aside>

          <main className="flex-1 min-w-0 overflow-y-auto bg-white">

            <div className="flex h-full gap-10 px-10 py-7">

              <div className="flex-shrink-0 pt-[26px]">
                <div className="flex h-[190px] w-[160px] items-center justify-center rounded-[3px] border border-dashed border-[#D6D9DE] bg-white p-2">

                  <img
                    src={
                      form.photoUrl
                    }
                    alt="Candidate"
                    className="h-full w-full object-cover"
                  />

                </div>
              </div>

              <section className="flex-1 min-w-0">

                <div className="mb-5 border-b border-[#ECEEF2] pb-3">

                  <h2 className="text-[15px] font-semibold text-[#38455A]">
                    General Details
                  </h2>

                </div>

                <div className="grid grid-cols-2 gap-x-10 gap-y-[18px]">

                  <div className="flex items-end gap-3">

                    <Field
                      label="Title"
                      className="w-[70px] shrink-0"
                    >
                      <input
                        value={
                          form.title
                        }
                        onChange={(e) =>
                          handleChange(
                            "title",
                            e.target
                              .value
                          )
                        }
                        className={
                          FIELD
                        }
                      />
                    </Field>

                    <Field
                      label="First Name"
                      className="min-w-0 flex-1"
                    >
                      <input
                        value={
                          form.firstName
                        }
                        onChange={(e) =>
                          handleChange(
                            "firstName",
                            e.target
                              .value
                          )
                        }
                        className={
                          FIELD
                        }
                      />
                    </Field>

                  </div>

                  <Field label="Father Name">
                    <input
                      value={
                        form.fatherName
                      }
                      onChange={(e) =>
                        handleChange(
                          "fatherName",
                          e.target
                            .value
                        )
                      }
                      className={
                        FIELD
                      }
                    />
                  </Field>

                  <Field label="Middle Name">
                    <input
                      value={
                        form.middleName
                      }
                      onChange={(e) =>
                        handleChange(
                          "middleName",
                          e.target
                            .value
                        )
                      }
                      className={
                        FIELD
                      }
                    />
                  </Field>

                  <Field label="Marital Status">
                    <div className="relative">

                      <select
                        value={
                          form.maritalStatus
                        }
                        onChange={(e) =>
                          handleChange(
                            "maritalStatus",
                            e.target
                              .value
                          )
                        }
                        className={`${FIELD} cursor-pointer appearance-none pr-9`}
                      >
                        <option>
                          Unmarried
                        </option>

                        <option>
                          Married
                        </option>

                        <option>
                          Divorced
                        </option>

                        <option>
                          Widowed
                        </option>
                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
                      />

                    </div>
                  </Field>

                  <Field label="Last Name">
                    <input
                      value={
                        form.lastName
                      }
                      onChange={(e) =>
                        handleChange(
                          "lastName",
                          e.target
                            .value
                        )
                      }
                      className={
                        FIELD
                      }
                    />
                  </Field>

                  <Field label="Spouse Name">
                    <input
                      value={
                        form.spouseName
                      }
                      onChange={(e) =>
                        handleChange(
                          "spouseName",
                          e.target
                            .value
                        )
                      }
                      className={
                        FIELD
                      }
                    />
                  </Field>

                  <Field label="Full Name">
                    <input
                      value={
                        form.fullName
                      }
                      onChange={(e) =>
                        handleChange(
                          "fullName",
                          e.target
                            .value
                        )
                      }
                      className={
                        FIELD
                      }
                    />
                  </Field>

                  <Field label="Date Of Birth">
                    <DateInput
                      value={
                        form.dob
                      }
                      onChange={(
                        value
                      ) =>
                        handleChange(
                          "dob",
                          value
                        )
                      }
                    />
                  </Field>

                  <Field label="Gender">
                    <div className="relative">

                      <select
                        value={
                          form.gender
                        }
                        onChange={(e) =>
                          handleChange(
                            "gender",
                            e.target
                              .value
                          )
                        }
                        className={`${FIELD} cursor-pointer appearance-none pr-9`}
                      >
                        <option>
                          Female
                        </option>

                        <option>
                          Male
                        </option>

                        <option>
                          Other
                        </option>
                      </select>

                      <ChevronDown
                        size={15}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8C97A6]"
                      />

                    </div>
                  </Field>

                  <label
                    htmlFor="physically-challenged"
                    className="flex cursor-pointer items-center gap-2.5 pt-[27px] text-[13px] text-[#596273]"
                  >
                    <input
                      id="physically-challenged"
                      type="checkbox"
                      checked={
                        form.physicallyChallenged
                      }
                      onChange={(e) =>
                        handleChange(
                          "physicallyChallenged",
                          e.target
                            .checked
                        )
                      }
                      className="h-4 w-4 cursor-pointer rounded-[3px] accent-[#2589E8]"
                    />

                    Physically
                    Challenged
                  </label>

                </div>

              </section>

            </div>

          </main>

        </div>

        <AddEmployeeWizard
          open={
            wizardOpen
          }
          onClose={() =>
            setWizardOpen(
              false
            )
          }
          onSubmit={
            handleWizardSubmit
          }
          initialData={
            wizardPrefill
          }
        />

      </div>
    );
  };

/* =========================================================
   FIELD
========================================================= */

interface FieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const Field: React.FC<
  FieldProps
> = ({
  label,
  children,
  className = "",
}) => {
  return (
    <div
      className={
        className
      }
    >
      <label
        className={
          LABEL
        }
      >
        {label}
      </label>

      {children}
    </div>
  );
};

export default PendingCandidatePage;