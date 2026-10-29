import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Clock3, Download } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";

interface AuditEvent {
  id: number;
  title: string;
  actor: string;
  dateTime: string;
}

interface AuditLogModalProps {
  onClose: () => void;
}

/*
 * MOCK DATA
 * Backend integration is still in progress.
 * Keep this data until the real audit-log API is available.
 */
const auditEvents: AuditEvent[] = [
  {
    id: 1,
    title: "Sanitization Candidate Created",
    actor: "rakshitha.g@kovind.com",
    dateTime: "27/May/2026, 04:35 PM",
  },
  {
    id: 2,
    title: "Verification Email Sent Automatically",
    actor: "rakshitha.g@kovind.com",
    dateTime: "27/May/2026, 04:34 PM",
  },
  {
    id: 3,
    title: "Chandu Candidate Profile Initiated",
    actor: "rakshitha.g@kovind.com",
    dateTime: "27/May/2026, 04:32 PM",
  },
  {
    id: 4,
    title: "Document Upload Alert Triggered",
    actor: "rakshitha.g@kovind.com",
    dateTime: "27/May/2026, 04:30 PM",
  },
  {
    id: 5,
    title: "Background Check Stage 1 Cleared",
    actor: "rakshitha.g@kovind.com",
    dateTime: "27/May/2026, 03:56 PM",
  },
  {
    id: 6,
    title: "Asset Allocation Policy Mapped",
    actor: "rakshitha.g@kovind.com",
    dateTime: "27/May/2026, 03:45 PM",
  },
];

export default function AuditLogModal({
  onClose,
}: AuditLogModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  /* =========================================================
     EXPORT AUDIT LOG TO EXCEL
  ========================================================= */

  const handleExportLog = () => {
    const exportData = auditEvents.map((event, index) => ({
      "S.No": index + 1,
      "Event": event.title,
      "Actor": event.actor,
      "Date & Time": event.dateTime,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Audit Log",
    );

    // Set column widths
    worksheet["!cols"] = [
      { wch: 8 },
      { wch: 45 },
      { wch: 32 },
      { wch: 28 },
    ];

    // Download Excel file
    XLSX.writeFile(
      workbook,
      "Audit_Log.xlsx",
    );
  };

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        translate-x-[226px]
        translate-y-[65px]
        bg-slate-900/10
        font-urbanist
        backdrop-blur-[4px]
        p-3
        sm:p-5
      "
      onClick={onClose}
    >
      {/* =====================================================
          AUDIT LOG MODAL
      ===================================================== */}

      <div
        className="
          flex
          h-[550px]
          w-[790px]
          max-h-[calc(100dvh-24px)]
          max-w-[calc(100vw-24px)]
          flex-col
          overflow-hidden
          rounded-[14px]
          border
          border-slate-455
          bg-white
          font-urbanist
          shadow-[0_12px_30px_rgba(15,23,42,0.22)]
          sm:max-h-[calc(100dvh-40px)]
          sm:max-w-[calc(100vw-40px)]
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* =================================================
            HEADER
        ================================================= */}

        <div
          className="
            flex
            min-h-[86px]
            shrink-0
            items-center
            justify-between
            gap-4
            border-b
            border-slate-200
            bg-white
            px-[22px]
            font-urbanist
          "
        >
          <div className="min-w-0">
            <h2
              className="
                font-urbanist
                text-[18px]
                font-bold
                leading-[22px]
                text-slate-800
              "
            >
              Audit Log
            </h2>

            <p
              className="
                mt-[3px]
                font-urbanist
                text-[12px]
                font-normal
                leading-[16px]
                text-slate-500
              "
            >
              Email Verification &amp; Onboarding Event
              History for Sai Chandu
            </p>
          </div>

          <Button
            type="button"
            onClick={onClose}
            aria-label="Close Audit Log"
            variant="ghost"
            size="sm"
            className="
              flex
              h-[32px]
              w-[32px]
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-slate-100
              p-0
              font-urbanist
              text-slate-700
              transition
              hover:bg-slate-200
            "
          >
            <X
              size={16}
              strokeWidth={2.5}
            />
          </Button>
        </div>

        {/* =================================================
            AUDIT EVENTS
        ================================================= */}

        <div
          className="
            min-h-0
            w-full
            flex-1
            overflow-y-auto
            font-urbanist
          "
        >
          {auditEvents.map((event) => (
            <div
              key={event.id}
              className="
                flex
                min-h-[63px]
                items-center
                border-b
                border-slate-200
                bg-slate-50/70
                px-[22px]
                font-urbanist
              "
            >
              {/* ORANGE DOT */}

              <div
                className="
                  flex
                  w-[32px]
                  shrink-0
                  items-center
                "
              >
                <span
                  className="
                    h-[8px]
                    w-[8px]
                    rounded-full
                    bg-orange-500
                  "
                />
              </div>

              {/* EVENT INFORMATION */}

              <div
                className="
                  min-w-0
                  flex-1
                  pr-4
                  font-urbanist
                "
              >
                <p
                  className="
                    truncate
                    font-urbanist
                    text-[13px]
                    font-semibold
                    leading-[18px]
                    text-slate-800
                  "
                >
                  {event.title}
                </p>

                <p
                  className="
                    truncate
                    font-urbanist
                    text-[11px]
                    font-normal
                    leading-[15px]
                    text-slate-500
                  "
                >
                  Actor: {event.actor}
                </p>
              </div>

              {/* DATE / TIME */}

              <div
                className="
                  ml-4
                  flex
                  shrink-0
                  items-center
                  gap-[6px]
                  font-urbanist
                  text-[11px]
                  font-medium
                  leading-[15px]
                  text-slate-600
                "
              >
                <Clock3
                  size={14}
                  strokeWidth={2}
                />

                <span className="hidden sm:inline">
                  {event.dateTime}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div
          className="
            flex
            min-h-[75px]
            shrink-0
            flex-col
            items-stretch
            justify-center
            gap-3
            border-t
            border-slate-200
            bg-slate-50
            px-[22px]
            py-3
            font-urbanist
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          {/* ROWS PER PAGE */}

          <div
            className="
              flex
              items-center
              gap-[4px]
              font-urbanist
              text-[12px]
              font-medium
              leading-[16px]
              text-slate-500
            "
          >
            <span
              className="
                font-urbanist
                text-[12px]
                font-normal
                leading-[16px]
                text-slate-500
              "
            >
              Rows per page:
            </span>

            <span
              className="
                font-urbanist
                text-[12px]
                font-medium
                leading-[16px]
                text-slate-600
              "
            >
              10
            </span>

            <span
              className="
                ml-[1px]
                font-urbanist
                text-[10px]
                font-medium
                leading-[14px]
                text-slate-600
              "
            >
              ▼
            </span>
          </div>

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-[10px]
              font-urbanist
            "
          >
            {/* CLOSE */}

            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="sm"
              className="
                flex
                h-[30px]
                items-center
                justify-center
                rounded-[8px]
                border
                border-slate-200
                bg-white
                px-[16px]
                font-urbanist
                text-[12px]
                font-medium
                leading-[16px]
                text-slate-600
                shadow-sm
                transition
                hover:bg-slate-50
              "
            >
              Close
            </Button>

            {/* EXPORT LOG */}

            <Button
              type="button"
              size="sm"
              onClick={handleExportLog}
              className="
                flex
                h-[30px]
                items-center
                justify-center
                gap-[6px]
                rounded-[8px]
                bg-orange-500
                px-[16px]
                font-urbanist
                text-[12px]
                font-semibold
                leading-[16px]
                text-white
                shadow-sm
                transition
                hover:bg-orange-600
              "
            >
              <Download
                size={13}
                strokeWidth={2.5}
              />

              Export Log
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}