import React, {
  useMemo,
  useState,
} from "react";

import {
  X,
  Upload,
  ChevronDown,
} from "lucide-react";

import {
  validateCircular,
  type CircularValidationErrors,
} from "../../Validations/circularValidation";

import DatePicker, {
  type DatePickerCell,
} from "../../../../../../components/ui/datepicker";

export default function Circular() {
  const [showForm, setShowForm] =
    useState(false);

  const [
    datePickerOpen,
    setDatePickerOpen,
  ] = useState(false);

  const [
    openDropdown,
    setOpenDropdown,
  ] = useState<"filter" | "acknowledgement" | null>(null);

  const [formData, setFormData] =
    useState({
      circularName: "",
      description: "",
      filter: "",
      date: "",
      acknowledgementType: "",
      file: null as File | null,
    });

  const [errors, setErrors] =
    useState<CircularValidationErrors>({});

  // =====================================================
  // CALENDAR MONTH
  // =====================================================

  const [calendarDate, setCalendarDate] =
    useState<Date>(() => {
      const today = new Date();

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
    });

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const formatDate = (date: Date) => {
    const day = String(
      date.getDate()
    ).padStart(2, "0");

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const year =
      date.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const parseDate = (
    value: string
  ): Date | null => {
    if (!value) {
      return null;
    }

    const parts =
      value.split("-");

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
      String(year).length !== 4
    ) {
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

  const formatISO = (
    date: Date
  ) => {
    const year =
      date.getFullYear();

    const month = String(
      date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =====================================================
  // DATE TEXT CHANGE
  // =====================================================

  const handleDateTextChange = (
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      date: value,
    }));

    const parsed =
      parseDate(value);

    if (parsed) {
      setCalendarDate(
        new Date(
          parsed.getFullYear(),
          parsed.getMonth(),
          1
        )
      );
    }
  };

  // =====================================================
  // DATE SELECT
  // =====================================================

  const handleDateSelect = (
    iso: string
  ) => {
    const selectedDate =
      new Date(`${iso}T00:00:00`);

    setFormData((prev) => ({
      ...prev,
      date: formatDate(
        selectedDate
      ),
    }));

    setCalendarDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        1
      )
    );

    setDatePickerOpen(false);
  };

  // =====================================================
  // PREVIOUS MONTH
  // =====================================================

  const handlePreviousMonth =
    () => {
      setCalendarDate(
        (previous) =>
          new Date(
            previous.getFullYear(),
            previous.getMonth() - 1,
            1
          )
      );
    };

  // =====================================================
  // NEXT MONTH
  // =====================================================

  const handleNextMonth = () => {
    setCalendarDate(
      (previous) =>
        new Date(
          previous.getFullYear(),
          previous.getMonth() + 1,
          1
        )
    );
  };

  // =====================================================
  // CLEAR DATE
  // =====================================================

  const handleClearDate = () => {
    setFormData((prev) => ({
      ...prev,
      date: "",
    }));

    setDatePickerOpen(false);
  };

  // =====================================================
  // TODAY
  // =====================================================

  const handleTodayDate = () => {
    const today = new Date();

    setFormData((prev) => ({
      ...prev,
      date: formatDate(today),
    }));

    setCalendarDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setDatePickerOpen(false);
  };

  // =====================================================
  // CALENDAR MONTH LABEL
  // =====================================================

  const monthLabel =
    calendarDate.toLocaleDateString(
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
  // CALENDAR CELLS
  // =====================================================

  const cells: DatePickerCell[] =
    useMemo(() => {
      const year =
        calendarDate.getFullYear();

      const month =
        calendarDate.getMonth();

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
        parseDate(
          formData.date
        );

      const result: DatePickerCell[] =
        [];

      // =================================================
      // PREVIOUS MONTH
      // =================================================

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

      // =================================================
      // CURRENT MONTH
      // =================================================

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

        const iso =
          formatISO(date);

        const selected =
          selectedDate !== null &&
          selectedDate.getFullYear() ===
            year &&
          selectedDate.getMonth() ===
            month &&
          selectedDate.getDate() ===
            day;

        result.push({
          iso,
          day,
          inMonth: true,
          disabled: false,
          selected,
        });
      }

      // =================================================
      // NEXT MONTH
      // =================================================

      let nextDay = 1;

      while (
        result.length < 42
      ) {
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
      calendarDate,
      formData.date,
    ]);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (
      name === "circularName"
    ) {
      setErrors((prev) => ({
        ...prev,
        circularName:
          undefined,
      }));
    }
  };

  // =====================================================
  // HANDLE FILE CHANGE
  // =====================================================

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] ||
      null;

    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  // =====================================================
  // HANDLE SAVE
  // =====================================================

  const handleSave = () => {
    const validationErrors =
      validateCircular(
        formData
      );

    setErrors(
      validationErrors
    );

    if (
      Object.keys(
        validationErrors
      ).length > 0
    ) {
      return;
    }

    console.log(
      "Circular Data:",
      formData
    );

    setShowForm(false);
    setDatePickerOpen(false);
    setOpenDropdown(null);
  };

  // =====================================================
  // OPEN FORM
  // =====================================================

  const handleOpenForm = () => {
    setFormData({
      circularName: "",
      description: "",
      filter: "",
      date: "",
      acknowledgementType: "",
      file: null,
    });

    setErrors({});

    const today = new Date();

    setCalendarDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      )
    );

    setDatePickerOpen(false);

    setShowForm(true);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const handleCloseForm = () => {
    setShowForm(false);
    setDatePickerOpen(false);
    setOpenDropdown(null);
    setErrors({});
  };

  // =====================================================
  // RETURN
  // =====================================================

  return (
    <div className="w-full min-w-0">

      {/* ================================================= */}
      {/* PAGE HEADER */}
      {/* ================================================= */}

      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          rounded-xl
          bg-[#F7F3FF]
          px-3
          py-3
          sm:px-4
        "
      >
        <button
          type="button"
          className="
            rounded-lg
            bg-[#7C4DFF]
            px-4
            py-2
            text-sm
            font-medium
            text-white
            sm:px-5
          "
        >
          Circular
        </button>

        <button
          type="button"
          onClick={
            handleOpenForm
          }
          className="
            flex
            items-center
            gap-2
            rounded-lg
            bg-[#7C4DFF]
            px-4
            py-2
            text-sm
            font-medium
            text-white
            hover:bg-[#6D3FE8]
            sm:px-5
          "
        >
          <span className="text-lg">
            +
          </span>

          Circular
        </button>
      </div>

      {/* ================================================= */}
      {/* CIRCULAR LIST */}
      {/* ================================================= */}

      <div
        className="
          min-h-[500px]
          rounded-xl
          bg-white
        "
      >
        {/* Circular records will come here */}
      </div>

      {/* ================================================= */}
      {/* MODAL */}
      {/* ================================================= */}

      {showForm && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            overflow-y-auto
            bg-black/20
            p-3
            sm:p-4
          "
        >

          {/* ================================================= */}
          {/* MODAL CONTAINER */}
          {/* ================================================= */}

          <div
            className="
              relative
              mx-auto
              my-auto
              flex
              w-full
              max-w-[540px]
              flex-col
              overflow-visible
              rounded-xl
              bg-white
              shadow-2xl
            "
            style={{
              maxHeight:
                "calc(100dvh - 24px)",
            }}
          >

            {/* ================================================= */}
            {/* MODAL HEADER */}
            {/* ================================================= */}

            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                px-4
                py-3
                sm:px-5
                sm:py-4
              "
            >
              <h2
                className="
                  text-base
                  font-semibold
                  text-gray-800
                "
              >
                Document Form
              </h2>

              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                className="
                  rounded-md
                  p-1
                  text-gray-500
                  hover:bg-gray-100
                  hover:text-gray-800
                "
              >
                <X size={20} />
              </button>
            </div>

            {/* ================================================= */}
            {/* FORM BODY */}
            {/* ================================================= */}

            <div
              className="
                min-h-0
                flex-1
                overflow-y-auto
                overflow-x-hidden
                p-4
                sm:p-5
              "
            >

              {/* ================================================= */}
              {/* ROW 1 */}
              {/* ================================================= */}

              <div
                className="
                  grid
                  min-w-0
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >

                {/* ================================================= */}
                {/* CIRCULAR NAME */}
                {/* ================================================= */}

                <div
                  className="
                    min-w-0
                    w-full
                  "
                >
                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Circular Name

                    <span
                      className="
                        ml-1
                        text-red-500
                      "
                    >
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="circularName"
                    value={
                      formData.circularName
                    }
                    onChange={
                      handleChange
                    }
                    className={`
                      block
                      h-9
                      w-full
                      min-w-0
                      rounded-md
                      border
                      px-3
                      text-sm
                      outline-none
                      focus:border-purple-500
                      ${
                        errors.circularName
                          ? "border-red-500 bg-red-50"
                          : "border-gray-200"
                      }
                    `}
                  />

                  {errors.circularName && (
                    <p
                      className="
                        mt-1
                        text-xs
                        text-red-500
                      "
                    >
                      {
                        errors.circularName
                      }
                    </p>
                  )}
                </div>

                {/* ================================================= */}
                {/* DESCRIPTION */}
                {/* ================================================= */}

                <div
                  className="
                    min-w-0
                    w-full
                  "
                >
                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Description
                  </label>

                  <textarea
                    name="description"
                    value={
                      formData.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="Document file briefing"
                    className="
                      block
                      h-16
                      w-full
                      min-w-0
                      resize-none
                      rounded-md
                      border
                      border-gray-200
                      px-3
                      py-2
                      text-sm
                      outline-none
                      focus:border-purple-500
                    "
                  />
                </div>

              </div>

              {/* ================================================= */}
              {/* ROW 2 */}
              {/* ================================================= */}

              <div
                className="
                  mt-4
                  grid
                  min-w-0
                  grid-cols-1
                  gap-4
                  sm:grid-cols-2
                "
              >

                {/* ================================================= */}
                {/* SELECT FILTER */}
                {/* ================================================= */}

                <div
                  className="
                    min-w-0
                    w-full
                  "
                >
                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Select Filter
                  </label>

                  <div
                    className="
                      relative
                      w-full
                    "
                  >
                    <div className="relative w-full">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenDropdown(
                            openDropdown === "filter"
                              ? null
                              : "filter"
                          )
                        }
                        className="
                          flex
                          h-9
                          w-full
                          min-w-0
                          items-center
                          justify-between
                          rounded-md
                          border
                          border-gray-200
                          bg-white
                          px-2
                          text-left
                          text-xs
                          text-gray-500
                          outline-none
                          focus:border-purple-500
                        "
                      >
                        <span className="min-w-0 truncate">
                          {formData.filter === "all"
                            ? "All Employees"
                            : formData.filter === "department"
                            ? "Department"
                            : formData.filter === "designation"
                            ? "Designation"
                            : "Select Select Filter"}
                        </span>

                        <ChevronDown
                          size={14}
                          className="ml-2 shrink-0 text-gray-500"
                        />
                      </button>

                      {openDropdown === "filter" && (
                        <div
                          className="
                            absolute
                            left-0
                            right-0
                            top-full
                            z-[70]
                            mt-1
                            max-h-40
                            w-full
                            min-w-0
                            overflow-y-auto
                            overflow-x-hidden
                            rounded-md
                            border
                            border-gray-200
                            bg-white
                            text-xs
                            shadow-lg
                          "
                        >
                          {[
                            ["", "Select Select Filter"],
                            ["all", "All Employees"],
                            ["department", "Department"],
                            ["designation", "Designation"],
                          ].map(([value, label]) => (
                            <button
                              key={value || "empty-filter"}
                              type="button"
                              onClick={() => {
                                handleChange({
                                  target: {
                                    name: "filter",
                                    value,
                                  },
                                } as React.ChangeEvent<HTMLSelectElement>);
                                setOpenDropdown(null);
                              }}
                              className="
                                block
                                w-full
                                max-w-full
                                truncate
                                px-2
                                py-2
                                text-left
                                text-xs
                                text-gray-600
                                hover:bg-purple-50
                              "
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* ================================================= */}
                {/* DATE PICKER */}
                {/* ================================================= */}

                <div
                  className="
                    min-w-0
                    w-full
                  "
                >
                  <label
                    className="
                      mb-1
                      block
                      text-xs
                      font-medium
                      text-gray-700
                    "
                  >
                    Date
                  </label>

                  <DatePicker
                    id="circular-date"
                    text={
                      formData.date
                    }
                    onTextChange={
                      handleDateTextChange
                    }
                    onBlur={() => {}}
                    isInvalid={false}
                    placeholder="dd-mm-yyyy"
                    open={
                      datePickerOpen
                    }
                    onOpenChange={
                      setDatePickerOpen
                    }
                    monthLabel={
                      monthLabel
                    }
                    weekdayLabels={
                      weekdayLabels
                    }
                    cells={cells}
                    onSelectDay={
                      handleDateSelect
                    }
                    onPrevMonth={
                      handlePreviousMonth
                    }
                    onNextMonth={
                      handleNextMonth
                    }
                    onClear={
                      handleClearDate
                    }
                    onToday={
                      handleTodayDate
                    }
                  />
                </div>

              </div>

              {/* ================================================= */}
              {/* ACKNOWLEDGEMENT TYPE */}
              {/* ================================================= */}

              <div
                className="
                  mt-4
                  min-w-0
                  w-full
                "
              >
                <label
                  className="
                    mb-1
                    block
                    text-xs
                    font-medium
                    text-gray-700
                  "
                >
                  Acknowledgement Type
                </label>

                <div
                  className="
                    relative
                    w-full
                  "
                >
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() =>
                        setOpenDropdown(
                          openDropdown === "acknowledgement"
                            ? null
                            : "acknowledgement"
                        )
                      }
                      className="
                        flex
                        h-9
                        w-full
                        min-w-0
                        items-center
                        justify-between
                        rounded-md
                        border
                        border-gray-200
                        bg-white
                        px-2
                        text-left
                        text-xs
                        text-gray-500
                        outline-none
                        focus:border-purple-500
                      "
                    >
                      <span className="min-w-0 truncate">
                        {formData.acknowledgementType === "not-required"
                          ? "Not Required"
                          : formData.acknowledgementType === "read-only"
                          ? "Read Only"
                          : formData.acknowledgementType === "read-and-acknowledge"
                          ? "Read and Acknowledge"
                          : formData.acknowledgementType === "accept-and-reject"
                          ? "Accept and Reject"
                          : "Select Acknowledgement Type"}
                      </span>

                      <ChevronDown
                        size={14}
                        className="ml-2 shrink-0 text-gray-500"
                      />
                    </button>

                    {openDropdown === "acknowledgement" && (
                      <div
                        className="
                          absolute
                          left-0
                          right-0
                          top-full
                          z-[70]
                          mt-1
                          max-h-40
                          w-full
                          min-w-0
                          overflow-y-auto
                          overflow-x-hidden
                          rounded-md
                          border
                          border-gray-200
                          bg-white
                          text-xs
                          shadow-lg
                        "
                      >
                        {[
                          ["", "Select Acknowledgement Type"],
                          ["not-required", "Not Required"],
                          ["read-only", "Read Only"],
                          ["read-and-acknowledge", "Read and Acknowledge"],
                          ["accept-and-reject", "Accept and Reject"],
                        ].map(([value, label]) => (
                          <button
                            key={value || "empty-acknowledgement"}
                            type="button"
                            onClick={() => {
                              handleChange({
                                target: {
                                  name: "acknowledgementType",
                                  value,
                                },
                              } as React.ChangeEvent<HTMLSelectElement>);
                              setOpenDropdown(null);
                            }}
                            className="
                              block
                              w-full
                              max-w-full
                              truncate
                              px-2
                              py-2
                              text-left
                              text-xs
                              text-gray-600
                              hover:bg-purple-50
                            "
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* ================================================= */}
              {/* FILE UPLOAD */}
              {/* ================================================= */}

              <div
                className="
                  mt-5
                  min-w-0
                "
              >
                <label
                  htmlFor="circular-file"
                  className="
                    flex
                    h-24
                    w-full
                    cursor-pointer
                    flex-col
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-dashed
                    border-gray-300
                    px-3
                    text-center
                    hover:bg-purple-50
                  "
                >
                  <Upload
                    size={24}
                    className="
                      mb-2
                      text-purple-500
                    "
                  />

                  <span
                    className="
                      text-xs
                      text-gray-600
                    "
                  >
                    Drag and drop - or -

                    <span
                      className="
                        ml-1
                        font-medium
                        text-purple-600
                      "
                    >
                      Browse
                    </span>
                  </span>

                  {formData.file && (
                    <span
                      className="
                        mt-1
                        max-w-full
                        truncate
                        text-xs
                        text-green-600
                      "
                    >
                      {
                        formData.file.name
                      }
                    </span>
                  )}
                </label>

                <input
                  id="circular-file"
                  type="file"
                  className="hidden"
                  onChange={
                    handleFileChange
                  }
                />
              </div>

            </div>

            {/* ================================================= */}
            {/* FOOTER */}
            {/* ================================================= */}

            <div
              className="
                flex
                shrink-0
                flex-col-reverse
                gap-2
                border-t
                px-4
                py-3
                sm:flex-row
                sm:justify-end
                sm:px-5
                sm:py-4
              "
            >

              <button
                type="button"
                onClick={
                  handleCloseForm
                }
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-200
                  px-5
                  py-2
                  text-sm
                  text-gray-700
                  hover:bg-gray-50
                  sm:w-auto
                "
              >
                <span className="mr-2">
                  ×
                </span>

                Close
              </button>

              <button
                type="button"
                onClick={
                  handleSave
                }
                className="
                  w-full
                  rounded-md
                  bg-[#7C4DFF]
                  px-5
                  py-2
                  text-sm
                  text-white
                  hover:bg-[#6D3FE8]
                  sm:w-auto
                "
              >
                ✓ Save
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}