import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Clock3,
  Download,
} from "lucide-react";
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

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[99999]
        bg-slate-900/10
        backdrop-blur-[4px]
      "
      onClick={onClose}
    >

      <div
        className="
          absolute
          inset-0
          flex
          items-center
          justify-center
          p-3
          sm:p-5
          md:left-[380px]
        "
      >

        {/* ===================================================
            AUDIT LOG CARD
        =================================================== */}

        <div
          className="
            flex
            max-h-[calc(100dvh-24px)]
            w-full
            max-w-[755px]
            flex-col
            overflow-hidden
            rounded-[14px]
            border
            border-slate-300
            bg-white
            shadow-[0_12px_30px_rgba(15,23,42,0.22)]
            sm:max-h-[calc(100dvh-40px)]
            md:max-w-[calc(100vw-420px)]
          "
          onClick={(event) =>
            event.stopPropagation()
          }
        >

          {/* =================================================
              HEADER
          ================================================= */}

          <div
            className="
              flex
              min-h-[74px]
              items-center
              justify-between
              border-b
              border-slate-200
              bg-white
              gap-3
              px-4
              sm:px-[20px]
            "
          >

            <div>

              <h2
                className="
                  text-[16px]
                  font-semibold
                  leading-[20px]
                  text-slate-800
                "
              >
                Audit Log
              </h2>

              <p
                className="
                  mt-[3px]
                  text-[10px]
                  leading-[15px]
                  text-slate-500
                "
              >
                Email Verification &amp; Onboarding
                Event History for Sai Chandu
              </p>

            </div>

            {/* CLOSE */}

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
                items-center
                justify-center
                rounded-full
                bg-slate-100
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

          <div className="min-h-0 w-full flex-1 overflow-y-auto">

            {auditEvents.map((event) => (

              <div
                key={event.id}
                className="
                  flex
                  min-h-[55px]
                  items-center
                  border-b
                  border-slate-200
                  bg-slate-50/70
                  py-2
                  px-4
                  sm:px-[20px]
                "
              >

                {/* ORANGE DOT */}

                <div
                  className="
                    flex
                    w-[30px]
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
                  "
                >

                  <p
                    className="
                      truncate
                      text-[11px]
                      font-semibold
                      leading-[16px]
                      text-slate-700
                    "
                  >
                    {event.title}
                  </p>

                  <p
                    className="
                      truncate
                      text-[9px]
                      leading-[14px]
                      text-slate-500
                    "
                  >
                    Actor: {event.actor}
                  </p>

                </div>


                {/* DATE */}

                <div
                  className="
                    ml-2
                    sm:ml-4
                    flex
                    shrink-0
                    items-center
                    gap-[6px]
                    text-[9px]
                    font-medium
                    text-slate-600
                  "
                >

                  <Clock3
                    size={13}
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
              min-h-[67px]
              flex-col
              items-stretch
              justify-center
              gap-3
              bg-slate-50
              px-4
              py-3
              sm:flex-row
              sm:items-center
              sm:justify-between
              sm:px-[20px]
            "
          >

            {/* ROWS PER PAGE */}

            <div
              className="
                flex
                items-center
                gap-[4px]
                text-[9px]
                text-slate-500
              "
            >

              <span>
                Rows per page:
              </span>

              <span
                className="
                  font-medium
                  text-slate-600
                "
              >
                10
              </span>

              <span
                className="
                  text-[8px]
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
                gap-[9px]
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
                  text-[9px]
                  font-medium
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
                className="
                  flex
                  h-[30px]
                  items-center
                  justify-center
                  gap-[6px]
                  rounded-[8px]
                  bg-orange-500
                  px-[16px]
                  text-[9px]
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-orange-600
                "
              >

                <Download
                  size={12}
                  strokeWidth={2.5}
                />

                Export Log

              </Button>

            </div>

          </div>

        </div>

      </div>

    </div>,
    document.body
  );
}
