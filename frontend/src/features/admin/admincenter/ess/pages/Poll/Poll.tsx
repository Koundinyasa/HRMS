import { useMemo, useState } from "react";

import {
  X,
  Plus,
  Clock3,
  CalendarDays,
  Filter,
  ListFilter,
  BarChart3,
} from "lucide-react";

import DatePicker, {
  type DatePickerCell,
} from "@/components/ui/datepicker";

export default function Poll() {
  const [showModal, setShowModal] = useState(false);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetFilter, setTargetFilter] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState("");

  // =====================================================
  // DATE PICKER STATES
  // =====================================================

  const [startDatePickerOpen, setStartDatePickerOpen] =
    useState(false);

  const [endDatePickerOpen, setEndDatePickerOpen] =
    useState(false);

  const [startCalendarDate, setStartCalendarDate] =
    useState(new Date());

  const [endCalendarDate, setEndCalendarDate] =
    useState(new Date());

  // =====================================================
  // DROPDOWN OPEN STATES
  // =====================================================

  const [targetDropdownOpen, setTargetDropdownOpen] =
    useState(false);

  const [questionDropdownOpen, setQuestionDropdownOpen] =
    useState(false);

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const pad = (value: number) =>
    String(value).padStart(2, "0");

  const formatDate = (date: Date) => {
    return `${pad(date.getDate())}-${pad(
      date.getMonth() + 1
    )}-${date.getFullYear()}`;
  };

  const formatISO = (date: Date) => {
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

    if (!day || !month || !year) {
      return null;
    }

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

  // =====================================================
  // START DATE TEXT CHANGE
  // =====================================================

  const handleStartDateTextChange = (
    value: string
  ) => {
    setStartDate(value);

    const parsed = parseDate(value);

    if (parsed) {
      setStartCalendarDate(
        new Date(
          parsed.getFullYear(),
          parsed.getMonth(),
          1
        )
      );
    }
  };

  // =====================================================
  // END DATE TEXT CHANGE
  // =====================================================

  const handleEndDateTextChange = (
    value: string
  ) => {
    setEndDate(value);

    const parsed = parseDate(value);

    if (parsed) {
      setEndCalendarDate(
        new Date(
          parsed.getFullYear(),
          parsed.getMonth(),
          1
        )
      );
    }
  };

  // =====================================================
  // START DATE SELECT
  // =====================================================

  const handleStartDateSelect = (
    iso: string
  ) => {
    const selectedDate =
      new Date(`${iso}T00:00:00`);

    setStartDate(formatDate(selectedDate));

    setStartCalendarDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    );

    setStartDatePickerOpen(false);
  };

  // =====================================================
  // END DATE SELECT
  // =====================================================

  const handleEndDateSelect = (
    iso: string
  ) => {
    const selectedDate =
      new Date(`${iso}T00:00:00`);

    setEndDate(formatDate(selectedDate));

    setEndCalendarDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    );

    setEndDatePickerOpen(false);
  };

  // =====================================================
  // START PREVIOUS MONTH
  // =====================================================

  const handleStartPreviousMonth = () => {
    setStartCalendarDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  // =====================================================
  // START NEXT MONTH
  // =====================================================

  const handleStartNextMonth = () => {
    setStartCalendarDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  // =====================================================
  // END PREVIOUS MONTH
  // =====================================================

  const handleEndPreviousMonth = () => {
    setEndCalendarDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() - 1,
          1
        )
    );
  };

  // =====================================================
  // END NEXT MONTH
  // =====================================================

  const handleEndNextMonth = () => {
    setEndCalendarDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  // =====================================================
  // CLEAR START DATE
  // =====================================================

  const handleClearStartDate = () => {
    setStartDate("");
    setStartDatePickerOpen(false);
  };

  // =====================================================
  // CLEAR END DATE
  // =====================================================

  const handleClearEndDate = () => {
    setEndDate("");
    setEndDatePickerOpen(false);
  };

  // =====================================================
  // TODAY START DATE
  // =====================================================

  const handleTodayStartDate = () => {
    const today = new Date();

    setStartDate(formatDate(today));

    setStartCalendarDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setStartDatePickerOpen(false);
  };

  // =====================================================
  // TODAY END DATE
  // =====================================================

  const handleTodayEndDate = () => {
    const today = new Date();

    setEndDate(formatDate(today));

    setEndCalendarDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setEndDatePickerOpen(false);
  };

  // =====================================================
  // START CALENDAR CELLS
  // =====================================================

  const startCells: DatePickerCell[] =
    useMemo(() => {
      const year =
        startCalendarDate.getFullYear();

      const month =
        startCalendarDate.getMonth();

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

      const selectedDate =
        parseDate(startDate);

      const result: DatePickerCell[] = [];

      // PREVIOUS MONTH

      for (
        let i = firstDay - 1;
        i >= 0;
        i--
      ) {
        const day =
          previousMonthDays - i;

        const date =
          new Date(
            year,
            month - 1,
            day
          );

        result.push({
          iso: formatISO(date),
          day,
          inMonth: false,
          disabled: false,
          selected: false,
        });
      }

      // CURRENT MONTH

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        const date =
          new Date(
            year,
            month,
            day
          );

        const selected =
          selectedDate !== null &&
          selectedDate.getFullYear() === year &&
          selectedDate.getMonth() === month &&
          selectedDate.getDate() === day;

        result.push({
          iso: formatISO(date),
          day,
          inMonth: true,
          disabled: false,
          selected,
        });
      }

      // NEXT MONTH

      let nextDay = 1;

      while (result.length < 42) {
        const date =
          new Date(
            year,
            month + 1,
            nextDay
          );

        result.push({
          iso: formatISO(date),
          day: nextDay,
          inMonth: false,
          disabled: false,
          selected: false,
        });

        nextDay++;
      }

      return result;
    }, [
      startCalendarDate,
      startDate,
    ]);

  // =====================================================
  // END CALENDAR CELLS
  // =====================================================

  const endCells: DatePickerCell[] =
    useMemo(() => {
      const year =
        endCalendarDate.getFullYear();

      const month =
        endCalendarDate.getMonth();

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

      const selectedDate =
        parseDate(endDate);

      const result: DatePickerCell[] = [];

      // PREVIOUS MONTH

      for (
        let i = firstDay - 1;
        i >= 0;
        i--
      ) {
        const day =
          previousMonthDays - i;

        const date =
          new Date(
            year,
            month - 1,
            day
          );

        result.push({
          iso: formatISO(date),
          day,
          inMonth: false,
          disabled: false,
          selected: false,
        });
      }

      // CURRENT MONTH

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        const date =
          new Date(
            year,
            month,
            day
          );

        const selected =
          selectedDate !== null &&
          selectedDate.getFullYear() === year &&
          selectedDate.getMonth() === month &&
          selectedDate.getDate() === day;

        result.push({
          iso: formatISO(date),
          day,
          inMonth: true,
          disabled: false,
          selected,
        });
      }

      // NEXT MONTH

      let nextDay = 1;

      while (result.length < 42) {
        const date =
          new Date(
            year,
            month + 1,
            nextDay
          );

        result.push({
          iso: formatISO(date),
          day: nextDay,
          inMonth: false,
          disabled: false,
          selected: false,
        });

        nextDay++;
      }

      return result;
    }, [
      endCalendarDate,
      endDate,
    ]);

  // =====================================================
  // MONTH LABELS
  // =====================================================

  const startMonthLabel =
    startCalendarDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  const endMonthLabel =
    endCalendarDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );

  // =====================================================
  // WEEK DAYS
  // =====================================================

  const weekdayLabels = [
    "Su",
    "Mo",
    "Tu",
    "We",
    "Th",
    "Fr",
    "Sa",
  ];

  // =====================================================
  // OPEN MODAL
  // =====================================================

  const handleAddPoll = () => {
    setShowModal(true);

    setStartDatePickerOpen(false);
    setEndDatePickerOpen(false);
    setTargetDropdownOpen(false);
    setQuestionDropdownOpen(false);
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================

  const handleClose = () => {
    setShowModal(false);

    setStartDate("");
    setEndDate("");
    setTargetFilter("");
    setQuestionType("");
    setQuestion("");

    setStartDatePickerOpen(false);
    setEndDatePickerOpen(false);
    setTargetDropdownOpen(false);
    setQuestionDropdownOpen(false);
  };

  // =====================================================
  // SAVE POLL
  // =====================================================

  const handleSave = () => {
    if (!startDate) {
      alert("Please select start date");
      return;
    }

    if (!endDate) {
      alert("Please select end date");
      return;
    }

    if (!targetFilter) {
      alert(
        "Please select target audience filter"
      );
      return;
    }

    if (!questionType) {
      alert("Please select question type");
      return;
    }

    if (!question.trim()) {
      alert("Please enter poll question");
      return;
    }

    console.log({
      startDate,
      endDate,
      targetFilter,
      questionType,
      question,
    });

    handleClose();
  };

  // =====================================================
  // TARGET FILTER OPTIONS
  // =====================================================

  const targetFilterOptions = [
    {
      value: "",
      label: "Select target filter",
    },
    {
      value: "all-employees",
      label: "All Employees",
    },
    {
      value: "department",
      label: "Department",
    },
    {
      value: "designation",
      label: "Designation",
    },
    {
      value: "location",
      label: "Location",
    },
  ];

  // =====================================================
  // QUESTION TYPE OPTIONS
  // =====================================================

  const questionTypeOptions = [
    {
      value: "",
      label: "Select option type",
    },
    {
      value: "yes-no",
      label: "Yes / No",
    },
    {
      value: "single-choice",
      label: "Single Choice",
    },
    {
      value: "multiple-choice",
      label: "Multiple Choice",
    },
  ];

  const selectedTargetLabel =
    targetFilterOptions.find(
      (option) =>
        option.value === targetFilter
    )?.label ||
    "Select target filter";

  const selectedQuestionLabel =
    questionTypeOptions.find(
      (option) =>
        option.value === questionType
    )?.label ||
    "Select option type";

  return (
    <div
      className="
        w-full
        min-w-0
        min-h-[calc(100vh-100px)]
        overflow-x-hidden
      "
    >

      {/* ================================================= */}
      {/* TOP HEADER */}
      {/* ================================================= */}

      <div
        className="
          flex
          items-center
          justify-between
          bg-[#F7F3FF]
          rounded-xl
          px-4
          py-2.5
          mb-4
          w-full
          min-w-0
          box-border
        "
      >

        <div
          className="
            px-5
            py-2
            rounded-lg
            text-xs
            font-medium
            text-gray-700
            min-w-0
          "
        >
          Polls
        </div>

        <div
          className="
            flex
            items-center
            gap-4
            shrink-0
          "
        >

          <button
            type="button"
            onClick={handleAddPoll}
            className="
              flex
              items-center
              gap-1.5
              bg-[#7C4DFF]
              hover:bg-[#6D3FE8]
              text-white
              px-4
              py-2
              rounded-lg
              text-xs
              font-medium
            "
          >
            <Plus size={14} />
            Add Polls
          </button>

          <button
            type="button"
            title="History"
            className="
              text-gray-500
              hover:text-[#7C4DFF]
            "
          >
            <Clock3 size={17} />
          </button>

        </div>

      </div>

      {/* ================================================= */}
      {/* EMPTY PAGE CONTENT */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          rounded-xl
          min-h-[600px]
          w-full
          min-w-0
        "
      />

      {/* ================================================= */}
      {/* CREATE NEW POLL MODAL */}
      {/* ================================================= */}

      {showModal && (

        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/20
            p-2
            sm:p-4
            overflow-hidden
            box-border
          "
        >

          {/* ================================================= */}
          {/* MODAL */}
          {/* ================================================= */}

          <div
            className="
              w-[400px]
              max-w-[calc(100vw-16px)]
              sm:max-w-[92vw]
              max-h-[calc(100dvh-16px)]
              bg-white
              rounded-xl
              shadow-2xl
              overflow-hidden
              flex
              flex-col
              min-w-0
              box-border
            "
          >

            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                px-4
                py-3
                border-b
                border-gray-200
                shrink-0
                min-w-0
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-2
                  min-w-0
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    w-7
                    h-7
                    rounded-md
                    bg-[#F0EBFF]
                    text-[#7C4DFF]
                    shrink-0
                  "
                >
                  <BarChart3 size={15} />
                </div>

                <h2
                  className="
                    text-sm
                    font-semibold
                    text-gray-800
                    truncate
                  "
                >
                  Create New Poll
                </h2>

              </div>

              <button
                type="button"
                onClick={handleClose}
                className="
                  text-gray-500
                  hover:text-gray-800
                  shrink-0
                "
              >
                <X size={16} />
              </button>

            </div>

            {/* ================================================= */}
            {/* SCROLLABLE MODAL BODY */}
            {/* ================================================= */}

            <div
              className="
                px-4
                py-4
                overflow-y-auto
                overflow-x-hidden
                flex-1
                min-h-0
                min-w-0
                box-border
              "
            >

              {/* ================================================= */}
              {/* START DATE */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  w-full
                  min-w-0
                  mb-4
                "
              >

                <div className="relative w-full min-w-0">

                  <label
                    className="
                      flex
                      items-center
                      gap-1
                      text-[11px]
                      font-medium
                      text-gray-700
                      mb-1.5
                    "
                  >
                    <CalendarDays size={12} />
                    Start Date
                  </label>

                  <div
                    className="
                      relative
                      w-full
                      min-w-0
                      max-w-full
                    "
                  >

                    <DatePicker
                      id="poll-start-date"
                      text={startDate}
                      onTextChange={
                        handleStartDateTextChange
                      }
                      onBlur={() => {}}
                      isInvalid={false}
                      placeholder="dd-mm-yyyy"
                      open={
                        startDatePickerOpen
                      }
                      onOpenChange={(open) => {
                        setStartDatePickerOpen(
                          open
                        );

                        if (open) {
                          setEndDatePickerOpen(
                            false
                          );

                          setTargetDropdownOpen(
                            false
                          );

                          setQuestionDropdownOpen(
                            false
                          );
                        }
                      }}
                      monthLabel={
                        startMonthLabel
                      }
                      weekdayLabels={
                        weekdayLabels
                      }
                      cells={startCells}
                      onSelectDay={
                        handleStartDateSelect
                      }
                      onPrevMonth={
                        handleStartPreviousMonth
                      }
                      onNextMonth={
                        handleStartNextMonth
                      }
                      onClear={
                        handleClearStartDate
                      }
                      onToday={
                        handleTodayStartDate
                      }
                    />

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* END DATE */}
              {/* ================================================= */}

              <div
                className="
                  flex
                  flex-col
                  w-full
                  min-w-0
                  mb-4
                "
              >

                <div className="relative w-full min-w-0">

                  <label
                    className="
                      flex
                      items-center
                      gap-1
                      text-[11px]
                      font-medium
                      text-gray-700
                      mb-1.5
                    "
                  >
                    <CalendarDays size={12} />
                    End Date
                  </label>

                  <div
                    className="
                      relative
                      w-full
                      min-w-0
                      max-w-full
                    "
                  >

                    <DatePicker
                      id="poll-end-date"
                      text={endDate}
                      onTextChange={
                        handleEndDateTextChange
                      }
                      onBlur={() => {}}
                      isInvalid={false}
                      placeholder="dd-mm-yyyy"
                      open={
                        endDatePickerOpen
                      }
                      onOpenChange={(open) => {
                        setEndDatePickerOpen(
                          open
                        );

                        if (open) {
                          setStartDatePickerOpen(
                            false
                          );

                          setTargetDropdownOpen(
                            false
                          );

                          setQuestionDropdownOpen(
                            false
                          );
                        }
                      }}
                      monthLabel={
                        endMonthLabel
                      }
                      weekdayLabels={
                        weekdayLabels
                      }
                      cells={endCells}
                      onSelectDay={
                        handleEndDateSelect
                      }
                      onPrevMonth={
                        handleEndPreviousMonth
                      }
                      onNextMonth={
                        handleEndNextMonth
                      }
                      onClear={
                        handleClearEndDate
                      }
                      onToday={
                        handleTodayEndDate
                      }
                    />

                  </div>

                </div>

              </div>

              {/* ================================================= */}
              {/* TARGET FILTER */}
              {/* ================================================= */}

              <div
                className="
                  w-full
                  min-w-0
                  mb-4
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >
                  <Filter size={12} />
                  Target Audience Filter
                </label>

                <div
                  className="
                    relative
                    w-full
                    min-w-0
                    max-w-full
                  "
                >

                  <button
                    type="button"
                    onClick={() => {
                      setTargetDropdownOpen(
                        !targetDropdownOpen
                      );

                      setQuestionDropdownOpen(
                        false
                      );

                      setStartDatePickerOpen(
                        false
                      );

                      setEndDatePickerOpen(
                        false
                      );
                    }}
                    className="
                      flex
                      items-center
                      justify-between
                      w-full
                      max-w-full
                      min-w-0
                      h-8
                      px-2
                      border
                      border-gray-200
                      rounded-md
                      text-[11px]
                      text-gray-500
                      outline-none
                      focus:border-[#7C4DFF]
                      bg-white
                      box-border
                      overflow-hidden
                    "
                  >

                    <span
                      className="
                        min-w-0
                        truncate
                        text-left
                      "
                    >
                      {selectedTargetLabel}
                    </span>

                    <span
                      className="
                        ml-1
                        shrink-0
                        text-gray-400
                      "
                    >
                      ▾
                    </span>

                  </button>

                  {targetDropdownOpen && (

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-[100]
                        mt-1
                        w-full
                        max-w-full
                        min-w-0
                        overflow-hidden
                        rounded-md
                        border
                        border-gray-200
                        bg-white
                        shadow-lg
                        box-border
                      "
                    >

                      {targetFilterOptions.map(
                        (option) => (

                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() => {
                              setTargetFilter(
                                option.value
                              );

                              setTargetDropdownOpen(
                                false
                              );
                            }}
                            className="
                              block
                              w-full
                              max-w-full
                              min-w-0
                              truncate
                              px-2
                              py-2
                              text-left
                              text-[11px]
                              text-gray-600
                              hover:bg-purple-50
                              hover:text-[#7C4DFF]
                              box-border
                            "
                          >
                            {option.label}
                          </button>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

              {/* ================================================= */}
              {/* QUESTION TYPE */}
              {/* ================================================= */}

              <div
                className="
                  w-full
                  min-w-0
                  mb-4
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >
                  <ListFilter size={12} />
                  Question Type
                </label>

                <div
                  className="
                    relative
                    w-full
                    min-w-0
                    max-w-full
                  "
                >

                  <button
                    type="button"
                    onClick={() => {
                      setQuestionDropdownOpen(
                        !questionDropdownOpen
                      );

                      setTargetDropdownOpen(
                        false
                      );

                      setStartDatePickerOpen(
                        false
                      );

                      setEndDatePickerOpen(
                        false
                      );
                    }}
                    className="
                      flex
                      items-center
                      justify-between
                      w-full
                      max-w-full
                      min-w-0
                      h-8
                      px-2
                      border
                      border-gray-200
                      rounded-md
                      text-[11px]
                      text-gray-500
                      outline-none
                      focus:border-[#7C4DFF]
                      bg-white
                      box-border
                      overflow-hidden
                    "
                  >

                    <span
                      className="
                        min-w-0
                        truncate
                        text-left
                      "
                    >
                      {selectedQuestionLabel}
                    </span>

                    <span
                      className="
                        ml-1
                        shrink-0
                        text-gray-400
                      "
                    >
                      ▾
                    </span>

                  </button>

                  {questionDropdownOpen && (

                    <div
                      className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-[100]
                        mt-1
                        w-full
                        max-w-full
                        min-w-0
                        overflow-hidden
                        rounded-md
                        border
                        border-gray-200
                        bg-white
                        shadow-lg
                        box-border
                      "
                    >

                      {questionTypeOptions.map(
                        (option) => (

                          <button
                            key={
                              option.value
                            }
                            type="button"
                            onClick={() => {
                              setQuestionType(
                                option.value
                              );

                              setQuestionDropdownOpen(
                                false
                              );
                            }}
                            className="
                              block
                              w-full
                              max-w-full
                              min-w-0
                              truncate
                              px-2
                              py-2
                              text-left
                              text-[11px]
                              text-gray-600
                              hover:bg-purple-50
                              hover:text-[#7C4DFF]
                              box-border
                            "
                          >
                            {option.label}
                          </button>

                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

              {/* ================================================= */}
              {/* POLL QUESTION */}
              {/* ================================================= */}

              <div
                className="
                  w-full
                  min-w-0
                "
              >

                <label
                  className="
                    flex
                    items-center
                    gap-1
                    text-[11px]
                    font-medium
                    text-gray-700
                    mb-1.5
                  "
                >

                  <span className="text-sm">
                    □
                  </span>

                  Poll Question

                </label>

                <textarea
                  value={question}
                  onChange={(e) =>
                    setQuestion(
                      e.target.value
                    )
                  }
                  maxLength={250}
                  placeholder="What would you like to ask your employees? (e.g. How satisfied are you with our new hybrid work policy?)"
                  className="
                    block
                    w-full
                    max-w-full
                    min-w-0
                    h-[82px]
                    resize-none
                    px-2.5
                    py-2
                    border
                    border-gray-200
                    rounded-md
                    text-[11px]
                    text-gray-700
                    outline-none
                    placeholder:text-gray-300
                    focus:border-[#7C4DFF]
                    box-border
                  "
                />

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-2
                    mt-1
                    text-[9px]
                    text-gray-400
                    min-w-0
                  "
                >

                  <span className="min-w-0">
                    Keep questions clear and neutral
                    for best engagement.
                  </span>

                  <span className="shrink-0">
                    {question.length} / 250 characters
                  </span>

                </div>

              </div>

            </div>

            {/* ================================================= */}
            {/* MODAL FOOTER */}
            {/* ================================================= */}

            <div
              className="
                flex
                items-center
                justify-between
                gap-2
                px-4
                py-3
                border-t
                border-gray-200
                bg-white
                shrink-0
                min-w-0
                box-border
              "
            >

              <div
                className="
                  flex
                  items-center
                  gap-1.5
                  text-[10px]
                  text-gray-600
                  min-w-0
                "
              >

                <span
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-[#7C4DFF]
                    shrink-0
                  "
                />

                <span className="truncate">
                  Ready to publish
                </span>

              </div>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  shrink-0
                "
              >

                <button
                  type="button"
                  onClick={handleClose}
                  className="
                    px-4
                    py-1.5
                    border
                    border-gray-200
                    bg-white
                    rounded-md
                    text-[11px]
                    text-gray-600
                    hover:bg-gray-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="
                    flex
                    items-center
                    gap-1
                    px-4
                    py-1.5
                    bg-[#7C4DFF]
                    hover:bg-[#6D3FE8]
                    text-white
                    rounded-md
                    text-[11px]
                    font-medium
                  "
                >

                  <span>✓</span>

                  Save Poll

                </button>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}