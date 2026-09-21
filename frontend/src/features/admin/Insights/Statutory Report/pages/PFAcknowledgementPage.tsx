import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowLeft,
  CalendarDays,
  ChevronDown,
  CloudUpload,
  FileText,
  IndianRupee,
  Receipt,
  Users,
  XCircle,
  Check,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Building2,
  Hash,
  Plus,
} from "lucide-react";

export default function PFAcknowledgementPage() {
  const navigate = useNavigate();

  /* ======================================================
     REFS
  ====================================================== */

  const reportDateRef = useRef<HTMLInputElement | null>(null);

  const paidDateRef = useRef<HTMLInputElement | null>(null);

  const ackPaidDateRef = useRef<HTMLInputElement | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /* ======================================================
     FORM STATES
  ====================================================== */

  const [paidAmount, setPaidAmount] = useState("");

  const [paymentMode, setPaymentMode] = useState("");

  const [bank, setBank] = useState("");

  const [referenceNo, setReferenceNo] = useState("");

  const [paidDate, setPaidDate] = useState("");

  const [trrnNo, setTrrnNo] = useState("");

  const [crnNo, setCrnNo] = useState("");

  const [acknowledgementNo, setAcknowledgementNo] =
    useState("");

  const [ackPaidDate, setAckPaidDate] =
    useState("");

  const [reportDate, setReportDate] =
    useState("2026-09-02");

  const [pfGroup, setPfGroup] = useState("");

  const [attachment, setAttachment] =
    useState<File | null>(null);

  /* ======================================================
     OPEN DATE PICKER
  ====================================================== */

  const openDatePicker = (
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    const input = ref.current;

    if (!input) {
      return;
    }

    try {
      const pickerInput =
        input as HTMLInputElement & {
          showPicker?: () => void;
        };

      if (
        typeof pickerInput.showPicker ===
        "function"
      ) {
        pickerInput.showPicker();
      } else {
        input.focus();
      }
    } catch {
      input.focus();
    }
  };

  /* ======================================================
     FILE CHANGE
  ====================================================== */

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Maximum file size is 1 MB");

      event.target.value = "";

      return;
    }

    setAttachment(file);
  };

  /* ======================================================
     DRAG AND DROP
  ====================================================== */

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024) {
      alert("Maximum file size is 1 MB");

      return;
    }

    setAttachment(file);
  };

  /* ======================================================
     BROWSE
  ====================================================== */

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  /* ======================================================
     SAVE
  ====================================================== */

  const handleSave = () => {
    if (!referenceNo.trim()) {
      alert("Reference No. is required");

      return;
    }

    const formData = {
      paidAmount,
      paymentMode,
      bank,
      referenceNo,
      paidDate,
      trrnNo,
      crnNo,
      acknowledgementNo,
      ackPaidDate,
      attachment,
      reportDate,
      pfGroup,
    };

    console.log(
      "PF Acknowledgement Data:",
      formData
    );

    alert("Details saved successfully");
  };

  /* ======================================================
     CANCEL
  ====================================================== */

  const handleCancel = () => {
    setPaidAmount("");

    setPaymentMode("");

    setBank("");

    setReferenceNo("");

    setPaidDate("");

    setTrrnNo("");

    setCrnNo("");

    setAcknowledgementNo("");

    setAckPaidDate("");

    setAttachment(null);

    setPfGroup("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ======================================================
     COMMON STYLES
  ====================================================== */

  const inputClass =
    "h-[36px] w-full rounded-md border border-[#d5dce1] bg-[#f8fafb] px-3 text-[12px] text-[#222] outline-none transition focus:border-[#9a5747] focus:bg-white placeholder:text-[#aeb8c0]";

  const labelClass =
    "mb-[7px] flex items-center gap-[4px] text-[11px] font-medium text-[#333]";

  /* ======================================================
     JSX
  ====================================================== */

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-3 py-3 sm:px-4 md:px-5 lg:px-7">

      {/* ==================================================
          TOP REPORT NAVIGATION
      ================================================== */}

      <div className="mb-4 w-full rounded-[9px] border border-[#d9a99b] bg-[#fff7f4] px-3 py-2">

        <div className="flex flex-wrap items-center gap-3">

          {/* PF REPORT */}

          <button
            type="button"
            className="
              flex
              h-[31px]
              items-center
              gap-1.5
              rounded-md
              border
              border-[#a96554]
              bg-white
              px-4
              text-[11px]
              font-medium
              text-[#7e4638]
              shadow-sm
            "
          >
            <ShieldCheck size={14} />

            <span>PF Report</span>
          </button>

          {/* ESI REPORT */}

          <button
            type="button"
            className="
              flex
              h-[31px]
              items-center
              gap-1.5
              rounded-md
              border
              border-[#d3d9de]
              bg-white
              px-4
              text-[11px]
              font-medium
              text-[#333]
              hover:bg-gray-50
            "
          >
            <Plus size={14} />

            <span>ESI Report</span>
          </button>

          {/* LWF REPORT */}

          <button
            type="button"
            className="
              flex
              h-[31px]
              items-center
              gap-1.5
              rounded-md
              border
              border-[#d3d9de]
              bg-white
              px-4
              text-[11px]
              font-medium
              text-[#333]
              hover:bg-gray-50
            "
          >
            <Users size={14} />

            <span>LWF Report</span>
          </button>

          {/* PT REPORT */}

          <button
            type="button"
            className="
              flex
              h-[31px]
              items-center
              gap-1.5
              rounded-md
              border
              border-[#d3d9de]
              bg-white
              px-4
              text-[11px]
              font-medium
              text-[#333]
              hover:bg-gray-50
            "
          >
            <FileText size={14} />

            <span>PT Report</span>
          </button>

        </div>
      </div>

      {/* ==================================================
          PAGE TOOLBAR
      ================================================== */}

      <div
        className="
          mb-5
          flex
          flex-col
          gap-3
          rounded-[9px]
          border
          border-[#d8d8d8]
          bg-white
          px-3
          py-2
          shadow-sm
          md:flex-row
          md:items-center
          md:justify-between
        "
      >

        {/* PF ACKNOWLEDGEMENT */}

        <button
          type="button"
          className="
            flex
            h-[31px]
            w-fit
            items-center
            gap-1.5
            rounded-md
            border
            border-[#a96554]
            bg-white
            px-4
            text-[11px]
            font-medium
            text-[#824838]
          "
        >
          <Receipt size={13} />

          PF Acknowledgement
        </button>

        {/* RIGHT CONTROLS */}

        <div
          className="
            flex
            w-full
            flex-col
            gap-2
            sm:flex-row
            sm:flex-wrap
            md:w-auto
            md:items-center
          "
        >

          {/* ==================================================
              REPORT DATE
          ================================================== */}

          <div className="relative w-full sm:w-[90px]">

            <input
              ref={reportDateRef}
              type="date"
              value={reportDate}
              onChange={(e) =>
                setReportDate(e.target.value)
              }
              className="
                h-[31px]
                w-full
                cursor-pointer
                rounded-md
                border
                border-[#d8dde1]
                bg-white
                px-2
                pr-8
                text-[10px]
                text-[#555]
                outline-none
                focus:border-[#9a5747]
              "
            />

            <button
              type="button"
              onClick={() =>
                openDatePicker(reportDateRef)
              }
              aria-label="Open report date picker"
              className="
                absolute
                right-1
                top-1/2
                flex
                h-6
                w-6
                -translate-y-1/2
                items-center
                justify-center
                rounded
                text-[#777]
                hover:bg-gray-100
              "
            >
              <CalendarDays size={13} />
            </button>

          </div>

          {/* ==================================================
              PF GROUP
          ================================================== */}

          <div className="relative w-full sm:w-[105px]">

            <select
              value={pfGroup}
              onChange={(e) =>
                setPfGroup(e.target.value)
              }
              className="
                h-[31px]
                w-full
                appearance-none
                rounded-md
                border
                border-[#d8dde1]
                bg-white
                px-3
                pr-7
                text-[10px]
                text-[#555]
                outline-none
                focus:border-[#9a5747]
              "
            >
              <option value="">
                Select PF Group
              </option>

              <option value="Group A">
                Group A
              </option>

              <option value="Group B">
                Group B
              </option>

              <option value="Group C">
                Group C
              </option>
            </select>

            <ChevronDown
              size={13}
              className="
                pointer-events-none
                absolute
                right-2
                top-1/2
                -translate-y-1/2
                text-[#555]
              "
            />

          </div>

          {/* ==================================================
              BACK
          ================================================== */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              flex
              h-[31px]
              w-full
              items-center
              justify-center
              gap-1.5
              rounded-md
              bg-[#8d4e3e]
              px-5
              text-[11px]
              font-medium
              text-white
              transition
              hover:bg-[#783f32]
              sm:w-auto
            "
          >
            <ArrowLeft size={13} />

            Back
          </button>

        </div>
      </div>

      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">

        {/* ==================================================
            PAYMENT DETAILS
        ================================================== */}

        <div
          className="
            rounded-[13px]
            border
            border-[#cecece]
            bg-white
            p-5
            shadow-[0_3px_9px_rgba(0,0,0,0.12)]
          "
        >

          <h2 className="mb-5 text-[14px] font-semibold text-[#202020]">
            Payment Details
          </h2>

          <div className="space-y-[13px]">

            {/* PAID AMOUNT */}

            <div>

              <label className={labelClass}>
                <IndianRupee size={12} />

                Paid Amount
              </label>

              <input
                type="number"
                value={paidAmount}
                onChange={(e) =>
                  setPaidAmount(e.target.value)
                }
                placeholder="0.00"
                className={inputClass}
              />

            </div>

            {/* MODE OF PAYMENT */}

            <div>

              <label className={labelClass}>
                <CreditCard size={12} />

                Mode of Payment
              </label>

              <div className="relative">

                <select
                  value={paymentMode}
                  onChange={(e) =>
                    setPaymentMode(e.target.value)
                  }
                  className={`${inputClass} appearance-none pr-9`}
                >
                  <option value="">
                    Select payment method
                  </option>

                  <option value="NEFT">
                    NEFT
                  </option>

                  <option value="RTGS">
                    RTGS
                  </option>

                  <option value="IMPS">
                    IMPS
                  </option>

                  <option value="Cheque">
                    Cheque
                  </option>

                  <option value="Online">
                    Online
                  </option>
                </select>

                <ChevronDown
                  size={14}
                  className="
                    pointer-events-none
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    text-[#444]
                  "
                />

              </div>
            </div>

            {/* BANK */}

            <div>

              <label className={labelClass}>
                <Building2 size={12} />

                Bank
              </label>

              <input
                type="text"
                value={bank}
                onChange={(e) =>
                  setBank(e.target.value)
                }
                placeholder="Enter bank name"
                className={inputClass}
              />

            </div>

            {/* REFERENCE NO */}

            <div>

              <label className={labelClass}>
                <Hash size={12} />

                Reference No.

                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={referenceNo}
                onChange={(e) =>
                  setReferenceNo(e.target.value)
                }
                placeholder="Enter reference number"
                className={inputClass}
              />

            </div>

            {/* PAID DATE */}

            <div>

              <label className={labelClass}>
                <CalendarDays size={12} />

                Paid Date
              </label>

              <div className="relative">

                <input
                  ref={paidDateRef}
                  type="date"
                  value={paidDate}
                  onChange={(e) =>
                    setPaidDate(e.target.value)
                  }
                  className="
                    h-[36px]
                    w-full
                    cursor-pointer
                    rounded-md
                    border
                    border-[#d5dce1]
                    bg-[#f8fafb]
                    px-3
                    pr-10
                    text-[12px]
                    text-[#555]
                    outline-none
                    focus:border-[#9a5747]
                    focus:bg-white
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    openDatePicker(paidDateRef)
                  }
                  aria-label="Open paid date picker"
                  className="
                    absolute
                    right-1
                    top-1/2
                    flex
                    h-7
                    w-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded
                    text-[#777]
                    hover:bg-gray-100
                  "
                >
                  <CalendarDays size={14} />
                </button>

              </div>
            </div>

            {/* TRRN */}

            <div>

              <label className={labelClass}>

                <span
                  className="
                    inline-flex
                    h-[12px]
                    w-[12px]
                    items-center
                    justify-center
                  "
                >
                  <span
                    className="
                      block
                      h-[9px]
                      w-[9px]
                      rotate-45
                      rounded-[2px]
                      border
                      border-[#555]
                    "
                  />
                </span>

                TRRN No.
              </label>

              <input
                type="text"
                value={trrnNo}
                onChange={(e) =>
                  setTrrnNo(e.target.value)
                }
                placeholder="Enter TRRN number"
                className={inputClass}
              />

            </div>

            {/* CRN */}

            <div>

              <label className={labelClass}>
                <Receipt size={12} />

                CRN No.
              </label>

              <input
                type="text"
                value={crnNo}
                onChange={(e) =>
                  setCrnNo(e.target.value)
                }
                placeholder="Enter CRN number"
                className={inputClass}
              />

            </div>

          </div>
        </div>

        {/* ==================================================
            ACKNOWLEDGEMENT DETAILS
        ================================================== */}

        <div
          className="
            rounded-[13px]
            border
            border-[#cecece]
            bg-white
            p-5
            shadow-[0_3px_9px_rgba(0,0,0,0.12)]
          "
        >

          <h2 className="mb-5 text-[14px] font-semibold text-[#202020]">
            Acknowledgement Details
          </h2>

          <div className="space-y-4">

            {/* ACKNOWLEDGEMENT NUMBER */}

            <div>

              <label className={labelClass}>
                <ShieldCheck size={13} />

                Acknowledgement Number
              </label>

              <input
                type="text"
                value={acknowledgementNo}
                onChange={(e) =>
                  setAcknowledgementNo(e.target.value)
                }
                placeholder="Enter acknowledgement number"
                className={inputClass}
              />

            </div>

            {/* ACK PAID DATE */}

            <div>

              <label className={labelClass}>
                <CalendarDays size={13} />

                Ack Paid Date
              </label>

              <div className="relative">

                <input
                  ref={ackPaidDateRef}
                  type="date"
                  value={ackPaidDate}
                  onChange={(e) =>
                    setAckPaidDate(e.target.value)
                  }
                  className="
                    h-[36px]
                    w-full
                    cursor-pointer
                    rounded-md
                    border
                    border-[#d5dce1]
                    bg-[#f8fafb]
                    px-3
                    pr-10
                    text-[12px]
                    text-[#555]
                    outline-none
                    focus:border-[#9a5747]
                    focus:bg-white
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    openDatePicker(ackPaidDateRef)
                  }
                  aria-label="Open acknowledgement paid date picker"
                  className="
                    absolute
                    right-1
                    top-1/2
                    flex
                    h-7
                    w-7
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded
                    text-[#777]
                    hover:bg-gray-100
                  "
                >
                  <CalendarDays size={14} />
                </button>

              </div>
            </div>

            {/* ATTACHMENT */}

            <div>

              <label className="mb-2 block text-[11px] font-medium text-[#333]">
                Attachment
              </label>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={handleDrop}
                onClick={handleBrowse}
                className="
                  flex
                  h-[134px]
                  cursor-pointer
                  flex-col
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-dashed
                  border-[#858585]
                  bg-white
                  px-4
                  text-center
                  transition
                  hover:bg-[#fafafa]
                "
              >

                <CloudUpload
                  size={25}
                  strokeWidth={1.5}
                  className="mb-2 text-[#4d4d4d]"
                />

                {attachment ? (
                  <>
                    <p className="max-w-[90%] truncate text-[11px] font-medium text-[#333]">
                      {attachment.name}
                    </p>

                    <p className="mt-1 text-[10px] text-[#777]">
                      {(
                        attachment.size / 1024
                      ).toFixed(1)}{" "}
                      KB
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-[11px] font-medium text-[#444]">
                      Drag or drop
                    </p>

                    <p className="text-[11px] text-[#555]">
                      - or -
                    </p>

                    <p className="text-[11px] font-medium text-[#333] underline">
                      Browse
                    </p>
                  </>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />

              </div>

              {/* FILE SIZE */}

              <div
                className="
                  mt-4
                  flex
                  h-[38px]
                  items-center
                  gap-2
                  rounded-md
                  bg-[#fff8dc]
                  px-3
                  text-[10px]
                  text-[#d99a00]
                "
              >
                <AlertTriangle size={14} />

                Max.Size 1 MB
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ==================================================
          FOOTER
      ================================================== */}

      <div
        className="
          mt-6
          flex
          flex-col-reverse
          gap-2
          pb-3
          sm:flex-row
          sm:justify-end
        "
      >

        {/* CANCEL */}

        <button
          type="button"
          onClick={handleCancel}
          className="
            flex
            h-[32px]
            items-center
            justify-center
            gap-1.5
            rounded-md
            border
            border-[#d4d4d4]
            bg-white
            px-5
            text-[11px]
            font-medium
            text-[#333]
            hover:bg-gray-50
          "
        >
          <XCircle size={13} />

          Cancel
        </button>

        {/* SAVE */}

        <button
          type="button"
          onClick={handleSave}
          className="
            flex
            h-[32px]
            items-center
            justify-center
            gap-1.5
            rounded-md
            bg-[#8d4e3e]
            px-5
            text-[11px]
            font-medium
            text-white
            hover:bg-[#783f32]
          "
        >
          <Check size={13} />

          Save Details
        </button>

      </div>

    </div>
  );
}