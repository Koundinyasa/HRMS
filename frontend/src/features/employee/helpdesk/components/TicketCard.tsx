import { useState } from "react";

import {
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import TicketDetailsDialog from "./TicketDetailsDialog";
import TicketTimeline from "./TicketTimeline";
import TicketReplyDialog from "./TicketReplyDialog";
import TicketReopenDialog from "./TicketReopenDialog";

import { useHelpDesk } from "../hooks/useHelpDesk";

import type {
  TicketCardProps,
} from "../types/helpDesk.types";

export default function TicketCard({
  ticket,
}: TicketCardProps) {

  // ==================================================
  // LOCAL UI STATE
  // ==================================================

  const [
    expanded,
    setExpanded,
  ] = useState(false);

  const [
    detailsOpen,
    setDetailsOpen,
  ] = useState(false);

  const [
    replyOpen,
    setReplyOpen,
  ] = useState(false);

  const [
    reopenOpen,
    setReopenOpen,
  ] = useState(false);


  // ==================================================
  // HELP DESK ACTIONS
  // ==================================================

  const {
    submitReply,
    submitReopen,
    isReplying,
    isReopening,
  } = useHelpDesk();


  // ==================================================
  // DATE FORMAT
  // ==================================================

  const formatDate = (
    value: string
  ) => {

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleDateString(
      "en-IN"
    );
  };


  // ==================================================
  // STATUS CLASS
  // ==================================================

  const getStatusClass = (
    status: string
  ) => {

    switch (
    status.toLowerCase()
    ) {

      case "resolved":
        return "bg-green-100 text-green-700";

      case "closed":
        return "bg-slate-100 text-slate-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      case "on hold":
        return "bg-orange-100 text-orange-700";

      case "re-open":
        return "bg-purple-100 text-purple-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };


  // ==================================================
  // STATUS
  // ==================================================

  const isClosed =
  ticket.Status?.trim().toLowerCase() === "closed";

  const hasRemarks =
    Boolean(ticket.Remarks?.trim());


  return (
    <>
      <Card className="overflow-hidden rounded-xl border shadow-sm">

        <CardContent className="p-0">

          {/* =========================================
              TICKET SUMMARY
          ========================================= */}

          <div className="p-3 sm:p-4">

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

              {/* Ticket Number */}

              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">
                  Ticket No
                </p>

                <p className="mt-1 font-semibold">
                  {ticket.TicketNumber}
                </p>
              </div>


              {/* Subject */}

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Subject
                </p>

                <p className="mt-1 font-medium">
                  {ticket.Subject}
                </p>
              </div>


              {/* Department */}

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Department
                </p>

                <p className="mt-1">
                  {ticket.Department}
                </p>
              </div>


              {/* Created Date */}

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Created
                </p>

                <p className="mt-1">
                  {formatDate(
                    ticket.CreatedDateTime
                  )}
                </p>
              </div>


              {/* Status */}

              <div>
                <p className="text-xs uppercase text-slate-500">
                  Status
                </p>

                <span
                  className={`
                    mt-2
                    inline-flex
                    rounded-full
                    px-3
                    py-1
                    text-xs
                    font-semibold
                    ${getStatusClass(
                    ticket.Status
                  )}
                  `}
                >
                  {ticket.Status}
                </span>
              </div>

            </div>


            {/* =======================================
                ACTION BUTTONS
            ======================================= */}

            <div className="mt-4 flex justify-end gap-3">

              {/* View Details */}

              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  setDetailsOpen(true)
                }
              >
                View Details
              </Button>


              {/* Reply */}

              {hasRemarks && !isClosed && (

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setReplyOpen(true)
                  }
                >
                  Reply
                </Button>

              )}


              {/* Reopen */}

              {isClosed && (
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setReopenOpen(true)
                  }
                >
                  Reopen
                </Button>
              )}


              {/* Activity */}

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() =>
                  setExpanded(
                    (previous) =>
                      !previous
                  )
                }
              >
                {expanded ? (
                  <>
                    Hide

                    <ChevronUp
                      className="ml-1.5 h-4 w-4"
                    />
                  </>
                ) : (
                  <>
                    Activity

                    <ChevronDown
                      className="ml-1.5x h-4 w-4"
                    />
                  </>
                )}
              </Button>

            </div>

          </div>


          {/* =========================================
              ACTIVITY
          ========================================= */}

          {expanded && (
            <div className="border-t">

              <TicketTimeline
                ticket={ticket}
              />

            </div>
          )}

        </CardContent>

      </Card>


      {/* ===========================================
          VIEW DETAILS DIALOG
      =========================================== */}

      <TicketDetailsDialog
        open={detailsOpen}
        onClose={() =>
          setDetailsOpen(false)
        }
        ticket={ticket}
      />


      {/* ===========================================
          REPLY DIALOG
      =========================================== */}

      <TicketReplyDialog
        open={replyOpen}
        onClose={() =>
          setReplyOpen(false)
        }
        ticketId={ticket.ID}
        ticketNumber={ticket.TicketNumber}
        remarks={ticket.Remarks ?? ""}
        onSubmit={submitReply}
        isSubmitting={isReplying}
      />


      {/* ===========================================
          REOPEN DIALOG
      =========================================== */}

      <TicketReopenDialog
        open={reopenOpen}
        onClose={() =>
          setReopenOpen(false)
        }
        ticketId={ticket.ID}
        ticketNumber={
          ticket.TicketNumber
        }
        onSubmit={submitReopen}
        isSubmitting={isReopening}
      />

    </>
  );
}