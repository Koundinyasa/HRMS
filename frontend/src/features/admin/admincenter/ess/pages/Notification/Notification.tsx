import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  X,
  ChevronDown,
  Sparkles,
  Clock3,
  Plus,
  Save,
  Upload,
} from "lucide-react";

// 

import DatePicker from "@/components/ui/datepicker";
import feedsEmptyState from "../../../../../../../src/assets/images/feeds-empty-state(1).png";

const tabs = [
  "Current Notification",
  "Previous Notification",
  "Notification Login Banner",
  "Daily Thoughts",
  "Daily Thought Import",
];

const filterOptions = [
  "Select Select Filter",
  "All Employees",
  "Department",
  "Designation",
  "Location",
];

type DatePickerType = "from" | "to" | null;

interface CalendarCell {
  iso: string;
  day: number;
  inMonth: boolean;
  disabled: boolean;
  selected: boolean;
}

export default function Notification() {
  const [activeTab, setActiveTab] = useState("Current Notification");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [notificationText, setNotificationText] = useState("");
  const [eventName, setEventName] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [filter, setFilter] = useState("Select Select Filter");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  const [errors, setErrors] = useState({
    notification: "",
    eventName: "",
    fromDate: "",
  });

  // ============================================================
  // DATE PICKER STATE
  // ============================================================

  const [openDatePicker, setOpenDatePicker] =
    useState<DatePickerType>(null);

  const [fromCalendarDate, setFromCalendarDate] = useState(
    new Date()
  );

  const [toCalendarDate, setToCalendarDate] = useState(
    new Date()
  );

  // ============================================================
  // REFS
  // ============================================================

  const modalBodyRef = useRef<HTMLDivElement>(null);

  const fromDateRef = useRef<HTMLDivElement>(null);

  const toDateRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // NOTIFICATION
  // ============================================================

  const handleNotificationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;

    setNotificationText(value);

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        notification: "",
      }));
    }
  };

  // ============================================================
  // EVENT NAME
  // ============================================================

  const handleEventNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;

    setEventName(value);

    if (value.trim()) {
      setErrors((prev) => ({
        ...prev,
        eventName: "",
      }));
    }
  };

  // ============================================================
  // ATTACHMENT
  // ============================================================

  const handleAttachmentChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0] ?? null;

    setAttachment(file);
  };

  // ============================================================
  // DATE HELPERS
  // ============================================================

  const pad = (value: number) =>
    String(value).padStart(2, "0");

  const formatDate = (date: Date) => {
    return `${pad(date.getDate())}-${pad(
      date.getMonth() + 1
    )}-${date.getFullYear()}`;
  };

  const formatIsoDate = (date: Date) => {
    return `${date.getFullYear()}-${pad(
      date.getMonth() + 1
    )}-${pad(date.getDate())}`;
  };

  const parseDate = (value: string): Date | null => {
    if (!value) return null;

    const parts = value.split("-");

    if (parts.length !== 3) return null;

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

    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    return date;
  };

  // ============================================================
  // CREATE CALENDAR CELLS
  // ============================================================

  const createCalendarCells = (
    calendarDate: Date,
    selectedDate: string
  ): CalendarCell[] => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);

    const startDay = firstDay.getDay();

    const firstCellDate = new Date(
      year,
      month,
      1 - startDay
    );

    const selected = parseDate(selectedDate);

    return Array.from({ length: 42 }, (_, index) => {
      const cellDate = new Date(firstCellDate);

      cellDate.setDate(
        firstCellDate.getDate() + index
      );

      const iso = formatIsoDate(cellDate);

      const isSelected =
        selected &&
        selected.getFullYear() ===
          cellDate.getFullYear() &&
        selected.getMonth() ===
          cellDate.getMonth() &&
        selected.getDate() ===
          cellDate.getDate();

      return {
        iso,
        day: cellDate.getDate(),
        inMonth: cellDate.getMonth() === month,
        disabled: false,
        selected: Boolean(isSelected),
      };
    });
  };

  // ============================================================
  // WEEKDAY LABELS
  // ============================================================

  const weekdayLabels = [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
  ];

  // ============================================================
  // FROM DATE CALENDAR
  // ============================================================

  const fromCells = useMemo(() => {
    return createCalendarCells(
      fromCalendarDate,
      fromDate
    );
  }, [fromCalendarDate, fromDate]);

  // ============================================================
  // TO DATE CALENDAR
  // ============================================================

  const toCells = useMemo(() => {
    return createCalendarCells(
      toCalendarDate,
      toDate
    );
  }, [toCalendarDate, toDate]);

  // ============================================================
  // MONTH LABEL
  // ============================================================

  const getMonthLabel = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // ============================================================
  // SCROLL MODAL TO DATE PICKER
  // ============================================================

  useEffect(() => {
    if (!openDatePicker) return;

    const timer = window.setTimeout(() => {
      const target =
        openDatePicker === "from"
          ? fromDateRef.current
          : toDateRef.current;

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);

    return () => {
      window.clearTimeout(timer);
    };
  }, [openDatePicker]);

  // ============================================================
  // OPEN DATE PICKER
  // ============================================================

  const handleOpenDatePicker = (
    type: "from" | "to"
  ) => {
    if (type === "from") {
      const existingDate = parseDate(fromDate);

      if (existingDate) {
        setFromCalendarDate(existingDate);
      }
    }

    if (type === "to") {
      const existingDate = parseDate(toDate);

      if (existingDate) {
        setToCalendarDate(existingDate);
      }
    }

    setOpenDatePicker(type);
  };

  // ============================================================
  // FROM DATE SELECT
  // ============================================================

  const handleFromDateSelect = (iso: string) => {
    const date = new Date(`${iso}T00:00:00`);

    const formatted = formatDate(date);

    setFromDate(formatted);

    setErrors((prev) => ({
      ...prev,
      fromDate: "",
    }));

    setOpenDatePicker(null);
  };

  // ============================================================
  // TO DATE SELECT
  // ============================================================

  const handleToDateSelect = (iso: string) => {
    const date = new Date(`${iso}T00:00:00`);

    const formatted = formatDate(date);

    setToDate(formatted);

    setOpenDatePicker(null);
  };

  // ============================================================
  // FROM DATE TEXT CHANGE
  // ============================================================

  const handleFromDateTextChange = (value: string) => {
    setFromDate(value);

    if (value) {
      setErrors((prev) => ({
        ...prev,
        fromDate: "",
      }));
    }

    const parsed = parseDate(value);

    if (parsed) {
      setFromCalendarDate(parsed);
    }
  };

  // ============================================================
  // TO DATE TEXT CHANGE
  // ============================================================

  const handleToDateTextChange = (value: string) => {
    setToDate(value);

    const parsed = parseDate(value);

    if (parsed) {
      setToCalendarDate(parsed);
    }
  };

  // ============================================================
  // FROM DATE PREVIOUS MONTH
  // ============================================================

  const handleFromPrevMonth = () => {
    setFromCalendarDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() - 1,
          1
        )
    );
  };

  // ============================================================
  // FROM DATE NEXT MONTH
  // ============================================================

  const handleFromNextMonth = () => {
    setFromCalendarDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + 1,
          1
        )
    );
  };

  // ============================================================
  // TO DATE PREVIOUS MONTH
  // ============================================================

  const handleToPrevMonth = () => {
    setToCalendarDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() - 1,
          1
        )
    );
  };

  // ============================================================
  // TO DATE NEXT MONTH
  // ============================================================

  const handleToNextMonth = () => {
    setToCalendarDate(
      (prev) =>
        new Date(
          prev.getFullYear(),
          prev.getMonth() + 1,
          1
        )
    );
  };

  // ============================================================
  // CLEAR FROM DATE
  // ============================================================

  const handleClearFromDate = () => {
    setFromDate("");
    setOpenDatePicker(null);
  };

  // ============================================================
  // CLEAR TO DATE
  // ============================================================

  const handleClearToDate = () => {
    setToDate("");
    setOpenDatePicker(null);
  };

  // ============================================================
  // TODAY - FROM
  // ============================================================

  const handleTodayFrom = () => {
    const today = new Date();

    setFromDate(formatDate(today));
    setFromCalendarDate(today);

    setErrors((prev) => ({
      ...prev,
      fromDate: "",
    }));

    setOpenDatePicker(null);
  };

  // ============================================================
  // TODAY - TO
  // ============================================================

  const handleTodayTo = () => {
    const today = new Date();

    setToDate(formatDate(today));
    setToCalendarDate(today);

    setOpenDatePicker(null);
  };

  // ============================================================
  // SAVE
  // ============================================================

  const handleSave = () => {
    const newErrors = {
      notification: "",
      eventName: "",
      fromDate: "",
    };

    let hasError = false;

    if (!notificationText.trim()) {
      newErrors.notification = "Field Required";
      hasError = true;
    }

    if (!eventName.trim()) {
      newErrors.eventName = "Field Required";
      hasError = true;
    }

    if (!fromDate) {
      newErrors.fromDate = "Field Required";
      hasError = true;
    }

    setErrors(newErrors);

    if (hasError) {
      return;
    }

    console.log("Notification saved:", {
      notificationText,
      attachment,
      eventName,
      fromDate,
      toDate,
      filter,
    });

    handleCloseModal();
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const handleCloseModal = () => {
    setIsModalOpen(false);

    setOpenDatePicker(null);

    setNotificationText("");
    setEventName("");
    setAttachment(null);
    setFromDate("");
    setToDate("");
    setFilter("Select Select Filter");
    setFilterDropdownOpen(false);

    setErrors({
      notification: "",
      eventName: "",
      fromDate: "",
    });
  };

  // ============================================================
  // RETURN
  // ============================================================

  return (
    <div className="w-full min-h-full bg-white">

      {/* ======================================================
          TOP TABS
      ====================================================== */}

      <div
        className="
          mx-5
          mt-5
          bg-[#f7f2ff]
          rounded-xl
          px-4
          py-2
          flex
          items-center
          justify-between
          max-[639px]:overflow-x-auto
          max-[639px]:overflow-y-hidden
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-2
            min-w-max
            w-full
          "
        >

          {/* TABS */}

          <div
            className="
              flex
              items-center
              gap-2
              shrink-0
              whitespace-nowrap
            "
          >
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`
                  shrink-0
                  whitespace-nowrap
                  px-4
                  py-2
                  rounded-lg
                  text-xs
                  transition-all
                  ${
                    activeTab === tab
                      ? "bg-[#7650e9] text-white shadow-sm"
                      : "text-gray-700 hover:bg-white"
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* ADD NOTIFICATION */}

          <div
            className="
              flex
              items-center
              shrink-0
            "
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="
                flex
                items-center
                gap-1.5
                bg-[#7650e9]
                hover:bg-[#6842dc]
                text-white
                px-4
                py-2
                rounded-md
                text-xs
                font-medium
                whitespace-nowrap
                shrink-0
              "
            >
              <Plus size={14} />
              Add Notification
            </button>

            <Clock3
              size={18}
              className="ml-4 text-gray-600 shrink-0"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          EMPTY STATE
      ====================================================== */}

      <div className="mx-5 mt-5 min-h-[500px]">

        {activeTab === "Current Notification" ? (
          <div className="flex justify-center items-center min-h-[450px]">

            <div className="text-center">

              <img
                src={feedsEmptyState}
                alt="No Notifications"
                className="
                  w-[180px]
                  h-[135px]
                  object-contain
                  mx-auto
                  mb-4
                "
              />

              <p className="text-sm text-gray-500">
                No Current Notifications
              </p>

            </div>

          </div>
        ) : (

          <div className="flex justify-center items-center min-h-[450px]">

            <p className="text-sm text-gray-400">
              No {activeTab} available
            </p>

          </div>

        )}

      </div>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {isModalOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/20
            backdrop-blur-[1px]
            flex
            items-start
            sm:items-center
            justify-center
            p-3
            sm:p-4
            overflow-y-auto
          "
        >

          {/* ==================================================
              MODAL CONTAINER
          ================================================== */}

          <div
            className="
              w-full
              max-w-[500px]
              bg-white
              rounded-xl
              shadow-2xl
              flex
              flex-col
              max-h-[calc(100vh-1.5rem)]
              sm:max-h-[calc(100vh-2rem)]
              overflow-hidden
            "
          >

            {/* =================================================
                MODAL HEADER
            ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-5
                py-4
                border-b
                border-gray-200
                shrink-0
                bg-white
              "
            >

              <h2 className="text-base font-semibold text-gray-800">
                Notification
              </h2>

              <button
                type="button"
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-800"
              >
                <X size={20} />
              </button>

            </div>

            {/* =================================================
                SCROLLABLE MODAL BODY
            ================================================= */}

            <div
              ref={modalBodyRef}
              className="
                px-5
                py-4
                overflow-y-auto
                overflow-x-visible
                flex-1
                min-h-0
                scroll-smooth
              "
            >

              {/* =================================================
                  NOTIFICATION
              ================================================= */}

              <div>

                <div className="flex items-center justify-between mb-2">

                  <label className="text-xs font-medium text-gray-700">

                    Notification

                    <span className="text-red-500 ml-1">
                      *
                    </span>

                  </label>

                  <button
                    type="button"
                    className="
                      flex
                      items-center
                      gap-1
                      px-3
                      py-1
                      rounded-full
                      border
                      border-green-400
                      text-green-600
                      text-[10px]
                      font-medium
                    "
                  >
                    <Sparkles size={11} />
                    Generate
                  </button>

                </div>

                {/* EDITOR */}

                <div
                  className={`
                    border
                    rounded-lg
                    overflow-hidden
                    ${
                      errors.notification
                        ? "border-red-400"
                        : "border-gray-200"
                    }
                  `}
                >

                  {/* TOOLBAR */}

                  <div
                    className="
                      h-8
                      flex
                      items-center
                      gap-2
                      px-3
                      bg-gray-50
                      border-b
                      border-gray-200
                    "
                  >

                    <select
                      className="
                        bg-transparent
                        text-[10px]
                        text-gray-600
                        outline-none
                      "
                      defaultValue="Arial"
                    >
                      <option>Arial</option>
                      <option>Calibri</option>
                      <option>Times New Roman</option>
                    </select>

                    <select
                      className="
                        bg-transparent
                        text-[10px]
                        text-gray-600
                        outline-none
                      "
                      defaultValue="Size 3"
                    >
                      <option>Size 3</option>
                      <option>Size 2</option>
                      <option>Size 4</option>
                    </select>

                    <select
                      className="
                        bg-transparent
                        text-[10px]
                        text-gray-600
                        outline-none
                      "
                      defaultValue="Normal"
                    >
                      <option>Normal</option>
                      <option>Heading</option>
                    </select>

                    <span className="font-bold text-xs">
                      B
                    </span>

                    <span className="italic text-xs">
                      I
                    </span>

                    <span className="underline text-xs">
                      U
                    </span>

                    <span className="line-through text-xs">
                      S
                    </span>

                  </div>

                  {/* SECOND TOOLBAR */}

                  <div
                    className="
                      h-8
                      flex
                      items-center
                      gap-3
                      px-3
                      bg-white
                      border-b
                      border-gray-200
                      text-gray-600
                    "
                  >

                    <span className="text-xs">☷</span>
                    <span className="text-xs">☰</span>
                    <span className="text-xs">≡</span>
                    <span className="text-xs">☷</span>
                    <span className="text-xs">X²</span>
                    <span className="text-xs">X₂</span>
                    <span className="text-xs">❞</span>
                    <span className="text-xs">T</span>
                    <span className="text-xs">◉</span>
                    <span className="text-xs">🔗</span>
                    <span className="text-xs">◇</span>
                    <span className="text-xs">⊗</span>
                    <span className="text-xs">↶</span>
                    <span className="text-xs">↷</span>

                  </div>

                  <textarea
                    value={notificationText}
                    onChange={handleNotificationChange}
                    placeholder="Write something awesome..."
                    className="
                      w-full
                      h-[125px]
                      px-3
                      py-3
                      resize-none
                      outline-none
                      text-xs
                      text-gray-700
                    "
                  />

                </div>

                {errors.notification && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.notification}
                  </p>
                )}

              </div>

              {/* =================================================
                  ATTACHMENT
              ================================================= */}

              <div className="mt-4">

                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Attachment
                </label>

                <label
                  className="
                    block
                    w-full
                    h-[105px]
                    border
                    border-dashed
                    border-[#8b63ff]
                    rounded-lg
                    cursor-pointer
                    hover:bg-purple-50/30
                  "
                >

                  <input
                    type="file"
                    className="hidden"
                    onChange={handleAttachmentChange}
                  />

                  <div className="h-full flex flex-col items-center justify-center">

                    <Upload
                      size={24}
                      className="text-[#7650e9] mb-2"
                    />

                    <p className="text-xs text-gray-700">
                      Drag and drop
                    </p>

                    <p className="text-[11px] text-gray-400">
                      or
                    </p>

                    <span className="text-xs text-[#7650e9] font-medium">
                      Browse
                    </span>

                    {attachment && (
                      <p className="mt-1 text-[10px] text-green-600">
                        {attachment.name}
                      </p>
                    )}

                  </div>

                </label>

              </div>

              {/* =================================================
                  EVENT NAME
              ================================================= */}

              <div className="mt-4">

                <label className="block text-xs font-medium text-gray-700 mb-1">

                  Event Name

                  <span className="text-red-500 ml-1">
                    *
                  </span>

                </label>

                <input
                  type="text"
                  value={eventName}
                  onChange={handleEventNameChange}
                  placeholder="Enter event name"
                  className={`
                    w-full
                    h-10
                    px-3
                    rounded-md
                    border
                    text-xs
                    outline-none
                    focus:border-purple-500
                    ${
                      errors.eventName
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200"
                    }
                  `}
                />

                {errors.eventName && (
                  <p className="mt-1 text-[10px] text-red-500">
                    {errors.eventName}
                  </p>
                )}

              </div>

              {/* =================================================
                  FROM / TO DATE
              ================================================= */}

              <div className="grid grid-cols-2 gap-3 mt-4">

                {/* FROM DATE */}

                <div
                  ref={fromDateRef}
                  className="relative"
                >

                  <label className="block text-xs font-medium text-gray-700 mb-1">

                    From Date

                    <span className="text-red-500 ml-1">
                      *
                    </span>

                  </label>

                  <DatePicker
                    text={fromDate}
                    onTextChange={handleFromDateTextChange}
                    onBlur={() => {}}
                    isInvalid={Boolean(errors.fromDate)}
                    placeholder="dd-mm-yyyy"
                    open={openDatePicker === "from"}
                    onOpenChange={(open) => {
                      if (open) {
                        handleOpenDatePicker("from");
                      } else {
                        setOpenDatePicker(null);
                      }
                    }}
                    monthLabel={getMonthLabel(
                      fromCalendarDate
                    )}
                    weekdayLabels={weekdayLabels}
                    cells={fromCells}
                    onSelectDay={handleFromDateSelect}
                    onPrevMonth={handleFromPrevMonth}
                    onNextMonth={handleFromNextMonth}
                    onClear={handleClearFromDate}
                    onToday={handleTodayFrom}
                  />

                  {errors.fromDate && (
                    <p className="mt-1 text-[10px] text-red-500">
                      {errors.fromDate}
                    </p>
                  )}

                </div>

                {/* TO DATE */}

                <div
                  ref={toDateRef}
                  className="relative"
                >

                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    To Date
                  </label>

                  <DatePicker
                    text={toDate}
                    onTextChange={handleToDateTextChange}
                    onBlur={() => {}}
                    placeholder="dd-mm-yyyy"
                    open={openDatePicker === "to"}
                    onOpenChange={(open) => {
                      if (open) {
                        handleOpenDatePicker("to");
                      } else {
                        setOpenDatePicker(null);
                      }
                    }}
                    monthLabel={getMonthLabel(
                      toCalendarDate
                    )}
                    weekdayLabels={weekdayLabels}
                    cells={toCells}
                    onSelectDay={handleToDateSelect}
                    onPrevMonth={handleToPrevMonth}
                    onNextMonth={handleToNextMonth}
                    onClear={handleClearToDate}
                    onToday={handleTodayTo}
                  />

                </div>

              </div>

              {/* =================================================
                  SELECT FILTER
              ================================================= */}

              <div className="mt-4">

                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Select Filter
                </label>

                <div className="relative">

                  <button
                    type="button"
                    onClick={() =>
                      setFilterDropdownOpen((prev) => !prev)
                    }
                    className="
                      flex
                      items-center
                      justify-between
                      w-full
                      h-10
                      min-w-0
                      px-3
                      pr-8
                      rounded-md
                      border
                      border-gray-200
                      text-[10px]
                      sm:text-xs
                      text-gray-600
                      outline-none
                      focus:border-purple-500
                      bg-white
                      text-left
                    "
                  >
                    <span className="truncate min-w-0">
                      {filter}
                    </span>

                    <ChevronDown
                      size={13}
                      className={`
                        absolute
                        right-2.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-500
                        pointer-events-none
                        transition-transform
                        ${filterDropdownOpen ? "rotate-180" : ""}
                      `}
                    />
                  </button>

                  {filterDropdownOpen && (
                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        bottom-full
                        mb-1
                        z-50
                        w-full
                        max-w-full
                        max-h-36
                        overflow-y-auto
                        overflow-x-hidden
                        rounded-md
                        border
                        border-gray-200
                        bg-white
                        shadow-lg
                      "
                    >
                      {filterOptions.map((option) => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setFilter(option);
                            setFilterDropdownOpen(false);
                          }}
                          className={`
                            block
                            w-full
                            min-w-0
                            px-2.5
                            py-2
                            text-left
                            text-[10px]
                            sm:text-xs
                            leading-tight
                            truncate
                            hover:bg-purple-50
                            ${
                              filter === option
                                ? "bg-purple-50 text-purple-600"
                                : "text-gray-600"
                            }
                          `}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}

                </div>

              </div>

              {/* Extra bottom space so calendar has room */}

              <div className="h-4 shrink-0" />

            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div
              className="
                flex
                justify-end
                gap-2
                px-5
                py-3
                border-t
                border-gray-200
                bg-gray-50
                shrink-0
              "
            >

              <button
                type="button"
                onClick={handleCloseModal}
                className="
                  flex
                  items-center
                  gap-1
                  px-4
                  py-2
                  rounded-md
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  text-xs
                  hover:bg-gray-100
                "
              >
                <X size={13} />
                Close
              </button>

              <button
                type="button"
                onClick={handleSave}
                className="
                  flex
                  items-center
                  gap-1
                  px-4
                  py-2
                  rounded-md
                  bg-[#7650e9]
                  hover:bg-[#6842dc]
                  text-white
                  text-xs
                  font-medium
                "
              >
                <Save size={13} />
                Save
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}