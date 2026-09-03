import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  Phone,
  Mail,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Plus,
  Save,
  X,
  Info,
  Pencil,
  Trash2,
} from "lucide-react";

/* ============================================================
   HEADER PORTAL SLOTS
============================================================ */

export const HR_ACTIONS_SLOT_ID =
  "employee-detail-actions";

export const HR_EXPORT_SLOT_ID =
  "employee-detail-export";

/* ============================================================
   SCHEMA
============================================================ */

type FieldType =
  | "text"
  | "select"
  | "date";

interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  full?: boolean;
}

interface CategoryDef {
  id: string;
  label: string;
  mode: "Single" | "Multiple";
  fields: FieldDef[];
}

/* ============================================================
   OPTIONS
============================================================ */

const BLOOD_GROUPS = [
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
  "Below Secondary Education",
  "Secondary Education",
  "Diploma",
  "Under Graduate",
  "Graduate",
  "Post Graduate",
  "PhD",
  "Others",
];

const YES_NO = [
  "Yes",
  "No",
];

/* ============================================================
   CATEGORIES
============================================================ */

const CATEGORIES: CategoryDef[] = [
  {
    id: "personal",
    label: "Personal",
    mode: "Single",
    fields: [
      {
        key: "bloodGroup",
        label: "Blood Group",
        type: "select",
        options: BLOOD_GROUPS,
        placeholder: "Select Blood Group",
      },
      {
        key: "casteCategory",
        label: "Caste Category",
        type: "text",
      },
      {
        key: "qualification",
        label: "Qualification",
        type: "select",
        options: QUALIFICATIONS,
        placeholder: "Select Qualification",
      },
      {
        key: "nationality",
        label: "Nationality",
        type: "text",
      },
      {
        key: "drivingLicNo",
        label: "Driving Lic No",
        type: "text",
      },
    ],
  },

  {
    id: "passport",
    label: "Passport",
    mode: "Single",
    fields: [
      {
        key: "number",
        label: "Number",
        type: "text",
        required: true,
      },
      {
        key: "issuedAt",
        label: "Issued At",
        type: "text",
        required: true,
      },
      {
        key: "issuedDate",
        label: "Issued date",
        type: "date",
        required: true,
      },
      {
        key: "expiryDate",
        label: "Expiry Date",
        type: "date",
        required: true,
      },
    ],
  },

  {
    id: "family",
    label: "Family",
    mode: "Multiple",
    fields: [
      {
        key: "nameOfRelative",
        label: "Name Of Relative",
        type: "text",
        required: true,
      },
      {
        key: "relation",
        label: "Relation",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "text",
      },
      {
        key: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
      },
      {
        key: "dependent",
        label: "Dependent",
        type: "select",
        options: YES_NO,
        placeholder: "Select Dependent",
      },
      {
        key: "nominee",
        label: "Nominee",
        type: "select",
        options: YES_NO,
        placeholder: "Select Nominee",
      },
      {
        key: "nominationPct",
        label: "Nomination%",
        type: "text",
      },
      {
        key: "nomineeAddress",
        label: "Nominee Address",
        type: "text",
      },
    ],
  },

  {
    id: "education",
    label: "Education",
    mode: "Multiple",
    fields: [
      {
        key: "university",
        label: "University",
        type: "text",
        required: true,
      },
      {
        key: "percentage",
        label: "Percentage",
        type: "text",
      },
      {
        key: "yearPassed",
        label: "Year Passed",
        type: "text",
      },
      {
        key: "qualification",
        label: "Qualification",
        type: "select",
        options: QUALIFICATIONS,
        placeholder: "Select Qualification",
      },
    ],
  },

  {
    id: "training",
    label: "Training",
    mode: "Multiple",
    fields: [
      {
        key: "trainingName",
        label: "Training Name",
        type: "text",
        required: true,
      },
      {
        key: "location",
        label: "Location",
        type: "text",
      },
      {
        key: "comments",
        label: "Comments",
        type: "text",
      },
      {
        key: "fromDate",
        label: "From Date",
        type: "date",
      },
      {
        key: "toDate",
        label: "To Date",
        type: "date",
      },
    ],
  },

  {
    id: "accident",
    label: "Accident",
    mode: "Multiple",
    fields: [
      {
        key: "accidentDate",
        label: "Accident Date",
        type: "date",
        required: true,
      },
      {
        key: "location",
        label: "Location",
        type: "text",
      },
      {
        key: "natureOfInjury",
        label: "Nature Of Injury",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "text",
      },
    ],
  },

  {
    id: "disciplinary",
    label: "Disciplinary Actions",
    mode: "Multiple",
    fields: [
      {
        key: "actionTaken",
        label: "Action Taken",
        type: "text",
        required: true,
      },
      {
        key: "actionDate",
        label: "Date",
        type: "date",
      },
      {
        key: "reason",
        label: "Reason",
        type: "text",
      },
      {
        key: "remarks",
        label: "Remarks",
        type: "text",
      },
    ],
  },

  {
    id: "extraEvent",
    label: "Extracurricular Event",
    mode: "Multiple",
    fields: [
      {
        key: "gameActivity",
        label: "Game/Activity",
        type: "text",
        required: true,
      },
      {
        key: "event",
        label: "Event",
        type: "text",
        required: true,
      },
    ],
  },

  {
    id: "extraAward",
    label: "Extracurricular Award",
    mode: "Multiple",
    fields: [
      {
        key: "award",
        label: "Award",
        type: "text",
        required: true,
      },
    ],
  },

  {
    id: "general",
    label: "General",
    mode: "Multiple",
    fields: [
      {
        key: "description",
        label: "Description",
        type: "text",
        required: true,
      },
      {
        key: "details",
        label: "Details",
        type: "text",
        required: true,
      },
    ],
  },
];

/* ============================================================
   STYLE
============================================================ */

const labelCls =
  "block text-[12.5px] text-[#4A5561] mb-1.5";

const panelInput =
  "w-full h-[40px] px-3 text-[13px] text-gray-700 bg-white border border-[#E3E7EC] rounded-[4px] placeholder:text-[#B6BFC9] focus:outline-none focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/15 transition-all";

const modalInput =
  "w-full h-[34px] px-3 text-[13px] text-gray-700 bg-[#EDF1F6] border border-transparent rounded-[4px] placeholder:text-[#B6BFC9] focus:outline-none focus:bg-white focus:border-[#2196F3] focus:ring-2 focus:ring-[#2196F3]/15 transition-all";

const errorRing =
  "!bg-white !border-[#E53935] focus:!border-[#E53935] focus:!ring-[#E53935]/15";

/* ============================================================
   DATE PICKER
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

const pad = (n: number) =>
  String(n).padStart(2, "0");

const toDDMMYYYY = (d: Date) =>
  `${pad(d.getDate())}-${pad(
    d.getMonth() + 1
  )}-${d.getFullYear()}`;

const parseDDMMYYYY = (
  value: string
): Date | null => {
  const match =
    /^(\d{2})-(\d{2})-(\d{4})$/.exec(
      (value || "").trim()
    );

  if (!match) return null;

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);

  const date = new Date(
    year,
    month - 1,
    day
  );

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
};

const sameDay = (
  a: Date,
  b: Date
) =>
  a.getDate() === b.getDate() &&
  a.getMonth() === b.getMonth() &&
  a.getFullYear() === b.getFullYear();

interface DatePickerProps {
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  variant: "panel" | "modal";
}

const DatePicker: React.FC<
  DatePickerProps
> = ({
  value,
  onChange,
  invalid,
  variant,
}) => {
  const [open, setOpen] =
    useState(false);

  const wrapRef =
    useRef<HTMLDivElement>(null);

  const today = new Date();

  const selected =
    parseDDMMYYYY(value);

  const [cursor, setCursor] =
    useState<Date>(
      selected ?? today
    );

  /* ==========================================================
     OPEN CALENDAR
  ========================================================== */

  useEffect(() => {
    if (open) {
      setCursor(
        parseDDMMYYYY(value) ??
          new Date()
      );
    }
  }, [open]);

  /* ==========================================================
     OUTSIDE CLICK + ESCAPE
  ========================================================== */

  useEffect(() => {
    if (!open) return;

    const handleMouseDown = (
      event: MouseEvent
    ) => {
      if (
        wrapRef.current &&
        !wrapRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleMouseDown
    );

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [open]);

  /* ==========================================================
     CALENDAR CELLS
  ========================================================== */

  const cells = useMemo(() => {
    const year =
      cursor.getFullYear();

    const month =
      cursor.getMonth();

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

    const daysInPrev =
      new Date(
        year,
        month,
        0
      ).getDate();

    const output: {
      date: Date;
      outside: boolean;
    }[] = [];

    for (
      let i = firstDay - 1;
      i >= 0;
      i--
    ) {
      output.push({
        date: new Date(
          year,
          month - 1,
          daysInPrev - i
        ),
        outside: true,
      });
    }

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      output.push({
        date: new Date(
          year,
          month,
          day
        ),
        outside: false,
      });
    }

    let nextDay = 1;

    while (
      output.length % 7 !== 0
    ) {
      output.push({
        date: new Date(
          year,
          month + 1,
          nextDay++
        ),
        outside: true,
      });
    }

    return output;
  }, [cursor]);

  const base =
    variant === "panel"
      ? panelInput
      : modalInput;

  const inputClass = `${base} pr-9 ${
    invalid ? errorRing : ""
  }`;

  /* ==========================================================
     SELECT DATE
  ========================================================== */

  const pickDate = (
    date: Date
  ) => {
    onChange(
      toDDMMYYYY(date)
    );

    setOpen(false);
  };

  return (
    <div
      className="relative"
      ref={wrapRef}
    >
      {/* ====================================================
          DATE INPUT
      ==================================================== */}

      <input
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        onFocus={() =>
          setOpen(true)
        }
        placeholder="DD-MM-YYYY"
        className={inputClass}
      />

      {/* ====================================================
          CALENDAR ICON
      ==================================================== */}

      <button
        type="button"
        aria-label="Open calendar"
        onMouseDown={(event) =>
          event.preventDefault()
        }
        onClick={() =>
          setOpen(true)
        }
        className="absolute right-1.5 top-1/2 -translate-y-1/2 grid place-items-center w-[24px] h-[24px] rounded hover:bg-[#E8F4FC] text-[#8A95A1] hover:text-[#2196F3] transition-colors"
      >
        <Calendar size={14} />
      </button>

      {/* ====================================================
          CALENDAR
      ==================================================== */}

      {open && (
        <div className="absolute z-[70] mt-1.5 w-[248px] bg-white rounded-[8px] border border-[#E3E7EC] shadow-[0_8px_28px_rgba(16,42,67,0.18)] p-2.5">

          {/* HEADER */}

          <div className="flex items-center justify-between mb-2">

            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(
                    cursor.getFullYear(),
                    cursor.getMonth() - 1,
                    1
                  )
                )
              }
              className="grid place-items-center w-[24px] h-[24px] rounded hover:bg-[#F1F5F9] text-[#5B6672]"
            >
              <ChevronLeft
                size={15}
              />
            </button>

            <span className="text-[12.5px] font-semibold text-[#3F4A56]">
              {
                MONTHS[
                  cursor.getMonth()
                ]
              }{" "}
              {cursor.getFullYear()}
            </span>

            <button
              type="button"
              onClick={() =>
                setCursor(
                  new Date(
                    cursor.getFullYear(),
                    cursor.getMonth() + 1,
                    1
                  )
                )
              }
              className="grid place-items-center w-[24px] h-[24px] rounded hover:bg-[#F1F5F9] text-[#5B6672]"
            >
              <ChevronRight
                size={15}
              />
            </button>

          </div>

          {/* WEEKDAYS */}

          <div className="grid grid-cols-7 mb-1">

            {WEEKDAYS.map(
              (weekday) => (
                <span
                  key={weekday}
                  className="text-center text-[10.5px] font-medium text-[#98A3AD] py-1"
                >
                  {weekday}
                </span>
              )
            )}

          </div>

          {/* DAYS */}

          <div className="grid grid-cols-7 gap-y-0.5">

            {cells.map(
              (
                {
                  date,
                  outside,
                },
                index
              ) => {
                const isSelected =
                  selected &&
                  sameDay(
                    date,
                    selected
                  );

                const isToday =
                  sameDay(
                    date,
                    today
                  );

                return (
                  <button
                    key={`${date.toISOString()}-${index}`}
                    type="button"
                    onClick={() =>
                      pickDate(date)
                    }
                    className={`h-[28px] mx-auto w-[28px] rounded-full text-[12px] transition-colors ${
                      isSelected
                        ? "bg-[#2196F3] text-white font-medium"
                        : outside
                        ? "text-[#C4CCD4] hover:bg-[#F5F8FB]"
                        : isToday
                        ? "text-[#2196F3] font-semibold ring-1 ring-inset ring-[#2196F3]/40 hover:bg-[#E8F4FC]"
                        : "text-[#3F4A56] hover:bg-[#E8F4FC]"
                    }`}
                  >
                    {date.getDate()}
                  </button>
                );
              }
            )}

          </div>

          {/* FOOTER */}

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#EEF1F4]">

            <button
              type="button"
              onClick={() =>
                pickDate(new Date())
              }
              className="text-[11.5px] font-medium text-[#2196F3] hover:underline"
            >
              Today
            </button>

            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="text-[11.5px] font-medium text-[#8A95A1] hover:text-[#5B6672]"
            >
              Clear
            </button>

          </div>

        </div>
      )}
    </div>
  );
};

/* ============================================================
   REQUIRED MARK
============================================================ */

const RequiredMark = () => (
  <span className="text-[#E53935] ml-[1px]">
    *
  </span>
);

/* ============================================================
   FIELD
============================================================ */

interface FieldProps {
  def: FieldDef;
  value: string;
  onChange: (value: string) => void;
  invalid?: boolean;
  variant: "panel" | "modal";
}

const Field: React.FC<FieldProps> = ({
  def,
  value,
  onChange,
  invalid,
  variant,
}) => {
  const base =
    variant === "panel"
      ? panelInput
      : modalInput;

  const className = `${base} ${
    invalid ? errorRing : ""
  }`;

  return (
    <div>

      <label className={labelCls}>
        {def.label}

        {def.required && (
          <RequiredMark />
        )}
      </label>

      {/* SELECT */}

      {def.type === "select" ? (
        <div className="relative">

          <select
            value={value}
            onChange={(event) =>
              onChange(
                event.target.value
              )
            }
            className={`${className} appearance-none pr-8 ${
              value
                ? ""
                : "text-[#8A95A1]"
            }`}
          >

            <option value="">
              {def.placeholder ||
                `Select ${def.label}`}
            </option>

            {def.options?.map(
              (option) => (
                <option
                  key={option}
                  value={option}
                >
                  {option}
                </option>
              )
            )}

          </select>

          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8A95A1]"
          />

        </div>
      ) : def.type === "date" ? (

        /* ====================================================
           EVERY DATE FIELD USES DATE PICKER
        ==================================================== */

        <DatePicker
          value={value}
          onChange={onChange}
          invalid={invalid}
          variant={variant}
        />

      ) : (

        <input
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className={className}
        />

      )}

      {invalid && (
        <p className="mt-1 text-[11.5px] text-[#E53935]">
          Field Required
        </p>
      )}

    </div>
  );
};

/* ============================================================
   EMPTY STATE
============================================================ */

const EmptyState: React.FC<{
  message?: string;
}> = ({
  message =
    "Did Not Find Any Employee",
}) => (
  <div className="flex flex-col items-center justify-center py-20">

    <svg
      width="260"
      height="170"
      viewBox="0 0 260 170"
      fill="none"
      aria-hidden="true"
    >

      <path
        d="M56 108c-14 0-25-10-25-23s11-23 25-23c2-16 16-28 33-28 13 0 25 7 31 18 5-3 11-5 17-5 17 0 31 13 33 30 13 2 23 12 23 25 0 14-12 26-27 26H56z"
        fill="#F3F8FD"
      />

      <circle
        cx="196"
        cy="52"
        r="9"
        fill="#EDF4FB"
      />

      <circle
        cx="212"
        cy="66"
        r="6"
        fill="#EDF4FB"
      />

      <circle
        cx="44"
        cy="44"
        r="7"
        fill="#EDF4FB"
      />

      <ellipse
        cx="130"
        cy="146"
        rx="82"
        ry="8"
        fill="#EEF3F8"
      />

      <rect
        x="92"
        y="46"
        width="76"
        height="86"
        rx="6"
        fill="#FFFFFF"
        stroke="#DCE8F3"
        strokeWidth="1.5"
      />

      <rect
        x="92"
        y="46"
        width="76"
        height="13"
        rx="6"
        fill="#E6F0FA"
      />

      <circle
        cx="100"
        cy="52.5"
        r="1.8"
        fill="#C2D6EA"
      />

      <circle
        cx="106"
        cy="52.5"
        r="1.8"
        fill="#C2D6EA"
      />

      <circle
        cx="112"
        cy="52.5"
        r="1.8"
        fill="#C2D6EA"
      />

      <rect
        x="110"
        y="70"
        width="40"
        height="34"
        rx="5"
        fill="#DCEBFA"
      />

      <circle
        cx="123"
        cy="83"
        r="2.8"
        fill="#8FB8DE"
      />

      <circle
        cx="137"
        cy="83"
        r="2.8"
        fill="#8FB8DE"
      />

      <path
        d="M122 93c5-3.5 11-3.5 16 0"
        stroke="#8FB8DE"
        strokeWidth="2"
        strokeLinecap="round"
      />

      <text
        x="130"
        y="118"
        textAnchor="middle"
        fontSize="7"
        fill="#A9BCCE"
        fontFamily="sans-serif"
      >
        NO DATA
      </text>

      <circle
        cx="176"
        cy="102"
        r="10"
        fill="#2E4A66"
      />

      <path
        d="M158 132c0-10 8-18 18-18s18 8 18 18h-36z"
        fill="#4E7196"
      />

      <rect
        x="152"
        y="128"
        width="50"
        height="8"
        rx="4"
        fill="#2E4A66"
      />

      <rect
        x="160"
        y="118"
        width="20"
        height="12"
        rx="2"
        fill="#DCE8F3"
      />

    </svg>

    <p className="mt-4 text-[13px] text-[#5B6672]">
      {message}
    </p>

  </div>
);

/* ============================================================
   EXCEL ICON
============================================================ */

const ExcelIcon = () => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >

    <rect
      x="2"
      y="3"
      width="20"
      height="18"
      rx="2.5"
      fill="#1E7145"
    />

    <rect
      x="12.5"
      y="3"
      width="9.5"
      height="18"
      rx="2.5"
      fill="#FFFFFF"
      fillOpacity="0.92"
    />

    <rect
      x="13.8"
      y="6.2"
      width="6.9"
      height="2.1"
      rx="0.5"
      fill="#1E7145"
      fillOpacity="0.55"
    />

    <rect
      x="13.8"
      y="10.1"
      width="6.9"
      height="2.1"
      rx="0.5"
      fill="#1E7145"
      fillOpacity="0.45"
    />

    <rect
      x="13.8"
      y="14"
      width="6.9"
      height="2.1"
      rx="0.5"
      fill="#1E7145"
      fillOpacity="0.35"
    />

    <path
      d="M5.4 8.2l2.3 3.8-2.4 3.9h1.9l1.4-2.6 1.4 2.6h2l-2.5-3.9 2.3-3.8h-1.9l-1.3 2.4-1.3-2.4H5.4z"
      fill="#FFFFFF"
    />

  </svg>
);

/* ============================================================
   MAIN COMPONENT
============================================================ */

interface HRCategoryTabProps {
  form: any;
  set?: (
    key: string,
    value: any
  ) => void;
}

const HRCategoryTab: React.FC<
  HRCategoryTabProps
> = ({ form }) => {

  const [activeId, setActiveId] =
    useState("personal");

  const [
    singleData,
    setSingleData,
  ] = useState<
    Record<
      string,
      Record<string, string>
    >
  >({});

  const [
    multiData,
    setMultiData,
  ] = useState<
    Record<
      string,
      Record<string, string>[]
    >
  >({});

  const [
    panelErrors,
    setPanelErrors,
  ] = useState<
    Record<string, boolean>
  >({});

  const [
    modalOpen,
    setModalOpen,
  ] = useState(false);

  const [
    draft,
    setDraft,
  ] = useState<
    Record<string, string>
  >({});

  const [
    draftErrors,
    setDraftErrors,
  ] = useState<
    Record<string, boolean>
  >({});

  const [
    editIndex,
    setEditIndex,
  ] = useState<number | null>(
    null
  );

  const [
    discardOpen,
    setDiscardOpen,
  ] = useState(false);

  /* ==========================================================
     PORTAL SLOTS
  ========================================================== */

  const [
    slot,
    setSlot,
  ] = useState<HTMLElement | null>(
    null
  );

  const [
    exportSlot,
    setExportSlot,
  ] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    setSlot(
      document.getElementById(
        HR_ACTIONS_SLOT_ID
      )
    );

    setExportSlot(
      document.getElementById(
        HR_EXPORT_SLOT_ID
      )
    );
  }, []);

  /* ==========================================================
     CATEGORY SCROLL
  ========================================================== */

  const listRef =
    useRef<HTMLDivElement>(null);

  const [
    atTop,
    setAtTop,
  ] = useState(true);

  const [
    atBottom,
    setAtBottom,
  ] = useState(false);

  const syncScroll = () => {
    const element =
      listRef.current;

    if (!element) return;

    setAtTop(
      element.scrollTop <= 1
    );

    setAtBottom(
      element.scrollTop +
        element.clientHeight >=
        element.scrollHeight - 1
    );
  };

  useEffect(() => {
    syncScroll();
  }, []);

  const scrollList = (
    direction: -1 | 1
  ) => {
    listRef.current?.scrollBy({
      top: direction * 132,
      behavior: "smooth",
    });
  };

  /* ==========================================================
     ACTIVE CATEGORY
  ========================================================== */

  const active = useMemo(
    () =>
      CATEGORIES.find(
        (category) =>
          category.id ===
          activeId
      ) ??
      CATEGORIES[0],
    [activeId]
  );

  const isMultiple =
    active.mode === "Multiple";

  const rows =
    multiData[active.id] ?? [];

  /* ==========================================================
     SINGLE PANEL
  ========================================================== */

  const panelValue = (
    key: string
  ) =>
    singleData[
      active.id
    ]?.[key] ?? "";

  const setPanelValue = (
    key: string,
    value: string
  ) => {
    setSingleData(
      (previous) => ({
        ...previous,
        [active.id]: {
          ...(previous[
            active.id
          ] ?? {}),
          [key]: value,
        },
      })
    );

    if (value.trim()) {
      setPanelErrors(
        (previous) => ({
          ...previous,
          [key]: false,
        })
      );
    }
  };

  const validatePanel = () => {
    const next: Record<
      string,
      boolean
    > = {};

    active.fields.forEach(
      (field) => {
        if (
          field.required &&
          !panelValue(
            field.key
          ).trim()
        ) {
          next[field.key] =
            true;
        }
      }
    );

    setPanelErrors(next);

    return (
      Object.keys(next)
        .length === 0
    );
  };

  /* ==========================================================
     ADD
  ========================================================== */

  const openAdd = () => {
    setDraft({});
    setDraftErrors({});
    setEditIndex(null);
    setModalOpen(true);
  };

  /* ==========================================================
     EDIT
  ========================================================== */

  const openEdit = (
    index: number
  ) => {
    setDraft({
      ...rows[index],
    });

    setDraftErrors({});
    setEditIndex(index);
    setModalOpen(true);
  };

  /* ==========================================================
     DIRTY
  ========================================================== */

  const draftDirty =
    Object.values(
      draft
    ).some(
      (value) =>
        (value ?? "").trim() !== ""
    );

  /* ==========================================================
     CLOSE
  ========================================================== */

  const requestClose = () => {
    if (draftDirty) {
      setDiscardOpen(true);
    } else {
      setModalOpen(false);
    }
  };

  /* ==========================================================
     DISCARD
  ========================================================== */

  const confirmDiscard = () => {
    setDiscardOpen(false);
    setModalOpen(false);
    setDraft({});
    setDraftErrors({});
  };

  /* ==========================================================
     SAVE DRAFT
  ========================================================== */

  const saveDraft = () => {
    const next: Record<
      string,
      boolean
    > = {};

    active.fields.forEach(
      (field) => {
        if (
          field.required &&
          !(
            draft[field.key] ??
            ""
          ).trim()
        ) {
          next[field.key] =
            true;
        }
      }
    );

    setDraftErrors(next);

    if (
      Object.keys(next)
        .length
    ) {  
      return;
    }

    setMultiData(
      (previous) => {
        const list = [
          ...(previous[
            active.id
          ] ?? []),
        ];

        if (
          editIndex === null
        ) {
          list.push(draft);
        } else {
          list[editIndex] =
            draft;
        }

        return {
          ...previous,
          [active.id]: list,
        };
      }
    );

    setModalOpen(false);
    setDraft({});
    setEditIndex(null);
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const removeRow = (
    index: number
  ) => {
    setMultiData(
      (previous) => ({
        ...previous,
        [active.id]: (
          previous[
            active.id
          ] ?? []
        ).filter(
          (_, rowIndex) =>
            rowIndex !== index
        ),
      })
    );
  };

  /* ==========================================================
     EXCEL / CSV EXPORT
  ========================================================== */

  const escapeCell = (
    value: string
  ) =>
    `"${String(
      value ?? ""
    ).replace(
      /"/g,
      '""'
    )}"`;

  const handleExport = () => {
    const empId =
      form?.empId ||
      "employee";

    let csv = "";

    if (isMultiple) {

      const header =
        active.fields
          .map(
            (field) =>
              escapeCell(
                field.label
              )
          )
          .join(",");

      const body =
        rows
          .map((row) =>
            active.fields
              .map(
                (field) =>
                  escapeCell(
                    row[
                      field.key
                    ] ?? ""
                  )
              )
              .join(",")
          )
          .join("\n");

      csv = rows.length
        ? `${header}\n${body}`
        : header;

    } else {

      csv = [
        escapeCell(
          "Field"
        ),
        escapeCell(
          "Value"
        ),
      ].join(",");

      csv +=
        "\n" +
        active.fields
          .map(
            (field) =>
              [
                escapeCell(
                  field.label
                ),
                escapeCell(
                  panelValue(
                    field.key
                  )
                ),
              ].join(",")
          )
          .join("\n");
    }

    const blob =
      new Blob(
        ["\uFEFF" + csv],
        {
          type: "text/csv;charset=utf-8;",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      `${empId}_${active.label.replace(
        /\s+/g,
        "_"
      )}.csv`;

    document.body.appendChild(
      link
    );

    link.click();

    document.body.removeChild(
      link
    );

    URL.revokeObjectURL(
      url
    );
  };

  return (
    <div className="flex gap-5 min-h-[480px]">

      {/* ======================================================
          LEFT PROFILE
      ====================================================== */}

      <div className="w-[210px] shrink-0">

        <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

          <div className="pt-4 px-4 flex justify-center">

            <div className="w-[158px] h-[188px] rounded-md overflow-hidden border border-gray-200 bg-gray-50">

              <img
                src={
                  form?.photoUrl ||
                  "https://i.pravatar.cc/300?u=294640"
                }
                alt={
                  form?.fullName ||
                  "Employee"
                }
                className="w-full h-full object-cover"
              />

            </div>

          </div>

          <div className="px-4 pt-3 pb-4 text-center">

            <h3 className="text-[13.5px] font-semibold text-[#5B7C99] leading-tight tracking-tight uppercase">
              {form?.fullName ||
                "BHAGYARAJA AVURAPALLI"}
            </h3>

            <div className="mt-1.5 inline-flex items-center px-2.5 py-[2px] rounded-full bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-medium">
              {form?.empId ||
                "294640"}
            </div>

            <p className="mt-2 text-[11px] text-gray-500 leading-[1.35]">
              {form?.designation ||
                "Senior Software Engineer"}{" "}
              |{" "}
              {form?.branch ||
                "Koundinyasa Technology Services Pvt. Ltd."}
            </p>

            <p className="mt-1 text-[11px] text-gray-400">
              DOJ{" "}
              {form?.dateOfJoining ||
                "31/Mar/2026"}
            </p>

            <div className="mt-3 space-y-1.5 text-left pl-1">

              <div className="flex items-center gap-2 text-[12px] text-gray-600">
                <Phone
                  size={12}
                  className="text-gray-400 shrink-0"
                />

                <span>
                  {form?.mobile ||
                    "9491964186"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-[12px] text-gray-600">

                <Mail
                  size={12}
                  className="text-gray-400 shrink-0"
                />

                <span className="truncate">
                  {form?.email ||
                    "bhagyaraja.a@koundinyasatech.com"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ======================================================
          MIDDLE CATEGORY LIST
      ====================================================== */}

      <div className="w-[205px] shrink-0">

        <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] overflow-hidden">

          {/* UP */}

          <button
            type="button"
            onClick={() =>
              scrollList(-1)
            }
            disabled={atTop}
            className="w-full flex justify-center py-2 bg-[#F7F9FB] border-b border-[#EEF1F4] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-default transition-colors"
          >
            <ChevronUp
              size={15}
              className="text-[#8A95A1]"
            />
          </button>

          {/* LIST */}

          <div
            ref={listRef}
            onScroll={syncScroll}
            className="max-h-[356px] overflow-y-auto [&::-webkit-scrollbar]:w-[5px] [&::-webkit-scrollbar-thumb]:bg-[#D5DCE4] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
          >

            {CATEGORIES.map(
              (category) => {

                const isActive =
                  category.id ===
                  active.id;

                return (
                  <button
                    key={
                      category.id
                    }
                    type="button"
                    onClick={() =>
                      setActiveId(
                        category.id
                      )
                    }
                    className={`relative w-full flex items-center gap-2.5 px-3 py-[9px] text-left border-b border-[#EEF1F4] transition-colors ${
                      isActive
                        ? "bg-[#DCEEFB]"
                        : "bg-white hover:bg-[#F7FAFD]"
                    }`}
                  >

                    <span
                      className={`grid place-items-center w-[26px] h-[26px] shrink-0 rounded-[4px] text-[12px] font-medium ${
                        isActive
                          ? "bg-[#C7E4F8] text-[#1B7FC4]"
                          : "bg-[#F1F3F6] text-[#94A2B0]"
                      }`}
                    >
                      {category.label.charAt(
                        0
                      )}
                    </span>

                    <span className="min-w-0">

                      <span
                        className={`block truncate text-[12.5px] leading-tight ${
                          isActive
                            ? "text-[#2196F3] font-medium"
                            : "text-[#3F4A56]"
                        }`}
                      >
                        {category.label}
                      </span>

                      <span className="mt-[3px] inline-block px-1.5 py-[1px] rounded-[3px] bg-[#EEF1F5] text-[#8A95A1] text-[10px] leading-[14px]">
                        {category.mode}
                      </span>

                    </span>

                    {isActive && (
                      <span className="absolute right-0 inset-y-0 w-[4px] bg-[#2196F3]" />
                    )}

                  </button>
                );
              }
            )}

          </div>

          {/* DOWN */}

          <button
            type="button"
            onClick={() =>
              scrollList(1)
            }
            disabled={atBottom}
            className="w-full flex justify-center py-2 bg-[#F7F9FB] border-t border-[#EEF1F4] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:cursor-default transition-colors"
          >
            <ChevronDown
              size={15}
              className="text-[#8A95A1]"
            />
          </button>

        </div>

      </div>

      {/* ======================================================
          RIGHT CONTENT
      ====================================================== */}

      <div className="flex-1 min-w-0">

        <div className="bg-white rounded-lg border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06)] min-h-[320px]">

          {/* ==================================================
              SINGLE
          ================================================== */}

          {!isMultiple ? (

            <div className="p-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 max-w-[820px]">

                {active.fields.map(
                  (field) => (
                    <div
                      key={
                        field.key
                      }
                      className={
                        field.full
                          ? "md:col-span-2"
                          : ""
                      }
                    >

                      <Field
                        def={field}
                        variant="panel"
                        value={panelValue(
                          field.key
                        )}
                        invalid={
                          panelErrors[
                            field.key
                          ]
                        }
                        onChange={(
                          value
                        ) =>
                          setPanelValue(
                            field.key,
                            value
                          )
                        }
                      />

                    </div>
                  )
                )}

              </div>

              {active.fields.some(
                (field) =>
                  field.required
              ) && (

                <button
                  type="button"
                  onClick={
                    validatePanel
                  }
                  className="mt-6 h-[32px] px-3.5 text-[12.5px] font-medium text-white bg-[#2196F3] rounded-[6px] shadow-[0_2px_4px_rgba(33,150,243,0.25)] hover:bg-[#1E88E5] inline-flex items-center gap-1.5"
                >

                  <Save size={13} />

                  Save

                </button>

              )}

            </div>

          ) : rows.length === 0 ? (

            <EmptyState />

          ) : (

            /* ==================================================
               TABLE
            ================================================== */

            <div className="overflow-x-auto">

              <table className="w-full border-collapse">

                <thead>

                  <tr>

                    {active.fields.map(
                      (field) => (
                        <th
                          key={
                            field.key
                          }
                          className="bg-[#C9E7F6] text-[#24333F] text-[12.5px] font-semibold text-left px-[18px] py-[13px] whitespace-nowrap"
                        >
                          {field.label}
                        </th>
                      )
                    )}

                    <th className="bg-[#C9E7F6] text-[#24333F] text-[12.5px] font-semibold text-center px-[18px] py-[13px] w-[100px]">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {rows.map(
                    (row, index) => (
                      <tr
                        key={index}
                        className={`transition-colors hover:bg-[#F1F8FD] ${
                          index %
                            2 ===
                          1
                            ? "bg-[#F8FBFD]"
                            : "bg-white"
                        }`}
                      >

                        {active.fields.map(
                          (field) => (
                            <td
                              key={
                                field.key
                              }
                              className="px-[18px] py-[13px] text-[12.5px] text-[#5B6672] border-b border-[#E6ECF1]"
                            >
                              {row[
                                field.key
                              ] || "—"}
                            </td>
                          )
                        )}

                        <td className="px-[18px] py-[13px] text-center border-b border-[#E6ECF1]">

                          <span className="inline-flex items-center gap-3">

                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                openEdit(
                                  index
                                )
                              }
                              className="p-1 rounded text-[#2196F3] hover:bg-[#E8F4FC]"
                            >
                              <Pencil
                                size={14}
                              />
                            </button>

                            <button
                              type="button"
                              title="Delete"
                              onClick={() =>
                                removeRow(
                                  index
                                )
                              }
                              className="p-1 rounded text-[#E53935] hover:bg-[#FDECEC]"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>

                          </span>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

      {/* ======================================================
          ADD BUTTON PORTAL
      ====================================================== */}

      {slot &&
        createPortal(
          <button
            type="button"
            disabled={
              !isMultiple ||
              modalOpen
            }
            onClick={openAdd}
            className="h-[30px] px-3.5 text-[12.5px] font-medium rounded-[6px] inline-flex items-center gap-1.5 transition-colors bg-[#2196F3] text-white shadow-[0_2px_4px_rgba(33,150,243,0.25)] hover:bg-[#1E88E5] disabled:cursor-not-allowed disabled:bg-[#E6E9ED] disabled:text-[#A8B0B9] disabled:shadow-none"
          >

            <Plus size={13} />

            Add

          </button>,
          slot
        )}

      {/* ======================================================
          EXCEL PORTAL
      ====================================================== */}

      {exportSlot &&
        createPortal(
          <button
            type="button"
            onClick={
              handleExport
            }
            title={`Export ${active.label} to Excel`}
            aria-label={`Export ${active.label} to Excel`}
            className="grid place-items-center w-[30px] h-[30px] rounded-[6px] hover:bg-[#EAF6EE] active:bg-[#DFF0E6] transition-colors"
          >
            <ExcelIcon />
          </button>,
          exportSlot
        )}

      {/* ======================================================
          ADD / EDIT MODAL
      ====================================================== */}

      {modalOpen && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

          <div className="bg-white rounded-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.2)] w-[490px] max-w-[92vw]">

            <div className="px-6 pt-6 pb-5">

              <div className="grid grid-cols-2 gap-x-6 gap-y-4">

                {active.fields.map(
                  (field) => (
                    <div
                      key={
                        field.key
                      }
                      className={
                        field.full
                          ? "col-span-2"
                          : ""
                      }
                    >

                      <Field
                        def={field}
                        variant="modal"
                        value={
                          draft[
                            field.key
                          ] ?? ""
                        }
                        invalid={
                          draftErrors[
                            field.key
                          ]
                        }
                        onChange={(
                          value
                        ) => {

                          setDraft(
                            (previous) => ({
                              ...previous,
                              [field.key]:
                                value,
                            })
                          );

                          if (
                            value.trim()
                          ) {
                            setDraftErrors(
                              (
                                previous
                              ) => ({
                                ...previous,
                                [field.key]:
                                  false,
                              })
                            );
                          }

                        }}
                      />

                    </div>
                  )
                )}

              </div>

            </div>

            {/* FOOTER */}

            <div className="flex items-center justify-end gap-2.5 px-6 py-3.5 border-t border-[#EEF1F4] bg-[#F7F9FB] rounded-b-[6px]">

              <button
                type="button"
                onClick={
                  requestClose
                }
                className="h-[32px] px-4 text-[12.5px] font-medium text-[#5B6672] border border-[#D8DEE5] rounded-[6px] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 inline-flex items-center gap-1.5"
              >

                <X size={13} />

                Close

              </button>

              <button
                type="button"
                onClick={
                  saveDraft
                }
                className="h-[32px] px-4 text-[12.5px] font-medium text-white bg-[#2196F3] rounded-[6px] shadow-[0_2px_4px_rgba(33,150,243,0.25)] hover:bg-[#1E88E5] inline-flex items-center gap-1.5"
              >

                <Save size={13} />

                Save

              </button>

            </div>

          </div>

        </div>

      )}

      {/* ======================================================
          DISCARD DIALOG
      ====================================================== */}

      {discardOpen && (

        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-[1px]">

          <div className="w-[308px] bg-[#FDF9E9] rounded-[6px] shadow-[0_10px_40px_rgba(0,0,0,0.18)] overflow-hidden">

            <div className="px-5 pt-5 pb-4 text-center">

              <p className="text-[13px] text-[#E8A33D]">
                Are you sure
              </p>

              <p className="mt-0.5 text-[14.5px] font-semibold text-[#E8A33D]">
                You want to Discard your Changes!
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 rounded-[4px] bg-[#FEFCF3] px-3 py-2 text-[12px] text-[#6B7280]">

                <Info
                  size={15}
                  className="text-[#2196F3] shrink-0"
                />

                <span>
                  If not, please save your changes.
                </span>

              </div>

            </div>

            <div className="flex items-center justify-center gap-2.5 px-5 pb-5">

              <button
                type="button"
                onClick={
                  confirmDiscard
                }
                className="h-[32px] px-6 text-[12.5px] font-semibold text-white bg-[#2196F3] rounded-[4px] shadow-[0_2px_4px_rgba(33,150,243,0.25)] hover:bg-[#1E88E5]"
              >
                YES
              </button>

              <button
                type="button"
                onClick={() =>
                  setDiscardOpen(
                    false
                  )
                }
                className="h-[32px] px-6 text-[12.5px] font-semibold text-[#B5AD8C] bg-[#FEFCF5] rounded-[4px] hover:bg-[#FBF7E8]"
              >
                NO
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default HRCategoryTab;