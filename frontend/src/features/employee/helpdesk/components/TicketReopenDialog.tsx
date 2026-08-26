import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { TicketReopenDialogProps, } from "../types/helpDesk.types";


export default function TicketReopenDialog({
  open,
  onClose,
  ticketId,
  ticketNumber,
  onSubmit,
  isSubmitting,
}: TicketReopenDialogProps) {
  const [remarks, setRemarks] = useState("");
  const [document, setDocument] = useState<File | undefined>();

  const handleSubmit = async () => {
    if (!remarks.trim()) {
      return;
    }

    const success = await onSubmit(
      ticketId,
      remarks,
      document
    );

    if (success) {
      setRemarks("");
      setDocument(undefined);
      onClose();
    }
  };

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setRemarks("");
    setDocument(undefined);
    onClose();
  };

 return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}
    >
      <DialogContent
        className="
          w-[calc(100%-1rem)]
          max-w-lg
          max-h-[90vh]
          overflow-y-auto
          rounded-xl
          p-4
 
          sm:w-[calc(100%-2rem)]
          sm:rounded-2xl
          sm:p-6
        "
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Reopen Ticket
          </DialogTitle>
 
          <DialogDescription className="text-sm leading-5">
            Reopen ticket{" "}
            <span className="font-semibold">
              {ticketNumber}
            </span>{" "}
            if the issue is still not resolved.
          </DialogDescription>
        </DialogHeader>
 
        <div className="space-y-5">
          {/* Reason */}
 
          <div className="space-y-2">
            <Label>
              Reason for reopening{" "}
              <span className="text-red-600">
                *
              </span>
            </Label>
 
            <Textarea
              value={remarks}
              onChange={(event) =>
                setRemarks(
                  event.target.value
                )
              }
              placeholder="Explain why the ticket needs to be reopened..."
              rows={6}
              className="
                min-h-[140px]
                resize-none
                text-sm
                sm:min-h-[160px]
              "
              disabled={isSubmitting}
            />
          </div>
 
          {/* Document */}
 
          <div className="space-y-2">
            <Label>
              Supporting Document
            </Label>
 
            <Input
              type="file"
              onChange={(event) =>
                setDocument(
                  event.target.files?.[0]
                )
              }
              disabled={isSubmitting}
              className="
                h-auto
                cursor-pointer
                py-2
                text-xs
                sm:text-sm
              "
            />
 
            {document && (
              <p className="break-all text-xs text-slate-500 sm:text-sm">
                Selected: {document.name}
              </p>
            )}
          </div>
        </div>
 
        <DialogFooter
          className="
            flex
            flex-col-reverse
            gap-2
            sm:flex-row
            sm:justify-end
          "
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
 
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !remarks.trim()
            }
            className="w-full sm:w-auto"
          >
            {isSubmitting
              ? "Reopening..."
              : "Reopen Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
 
