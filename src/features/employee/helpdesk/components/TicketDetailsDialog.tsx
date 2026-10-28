import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import type {
  TicketDetailsDialogProps,
} from "../types/helpDesk.types";

export default function TicketDetailsDialog({
  open,
  onClose,
  ticket,
}: TicketDetailsDialogProps) {

  const formatDateTime = (
    value: string | null
  ) => {

    if (!value) {
      return "—";
    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return value;
    }

    return date.toLocaleString(
      "en-IN"
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {

        if (!isOpen) {
          onClose();
        }

      }}
    >

      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-y-auto">

        <DialogHeader>

          <DialogTitle>
            Ticket Details
          </DialogTitle>

        </DialogHeader>

        <div className="space-y-6">

          {/* Ticket Number / Status */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <p className="text-sm text-slaste-500">
                Ticket Number
              </p>

              <p className="mt-1 font-semibold">
                {ticket.TicketNumber}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Status
              </p>

              <p className="mt-1 font-medium">
                {ticket.Status}
              </p>

            </div>

          </div>

          {/* Subject */}

          <div>

            <p className="text-sm text-slate-500">
              Subject
            </p>

            <p className="mt-1 font-medium">
              {ticket.Subject}
            </p>

          </div>

          {/* Description */}

          <div>

            <p className="text-sm text-slate-500">
              Description
            </p>

            <div className="mt-1 rounded-lg bg-slate-50 p-4 text-sm">
              {ticket.Description}
            </div>

          </div>

          {/* Classification */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div>

              <p className="text-sm text-slate-500">
                Department
              </p>

              <p className="mt-1 font-medium">
                {ticket.Department}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Category
              </p>

              <p className="mt-1 font-medium">
                {ticket.Category}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Sub Category
              </p>

              <p className="mt-1 font-medium">
                {ticket.SubCategory}
              </p>

            </div>

          </div>

          {/* Priority / Assignment */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

            <div>

              <p className="text-sm text-slate-500">
                Priority
              </p>

              <p className="mt-1 font-medium">
                {ticket.Priority}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Assigned Employee ID
              </p>

              <p className="mt-1 font-medium">
                {ticket.AssignedToEmployeeID || "—"}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Assigned To
              </p>

              <p className="mt-1 font-medium">
                {ticket.AssignedTo || "Not Assigned"}
              </p>

            </div>

          </div>

          {/* Dates */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>

              <p className="text-sm text-slate-500">
                Created
              </p>

              <p className="mt-1 font-medium">
                {formatDateTime(
                  ticket.CreatedDateTime
                )}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Modified
              </p>

              <p className="mt-1 font-medium">
                {formatDateTime(
                  ticket.ModifiedDateTime
                )}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Resolved
              </p>

              <p className="mt-1 font-medium">
                {formatDateTime(
                  ticket.ResolvedDateTime
                )}
              </p>

            </div>

            <div>

              <p className="text-sm text-slate-500">
                Closed
              </p>

              <p className="mt-1 font-medium">
                {formatDateTime(
                  ticket.ClosedDateTime
                )}
              </p>

            </div>

          </div>

          {/* Closure Remarks */}

          {ticket.ClosureRemarks && (
            <div>

              <p className="text-sm text-slate-500">
                Closure Remarks
              </p>

              <div className="mt-1 rounded-lg bg-slate-50 p-4 text-sm">
                {ticket.ClosureRemarks}
              </div>

            </div>
          )}

        </div>

      </DialogContent>

    </Dialog>
  );
}