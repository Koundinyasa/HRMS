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
import type { TicketReplyDialogProps, } from "../types/helpDesk.types";


export default function TicketReplyDialog({
  open,
  onClose,
  ticketId,
  ticketNumber,
  remarks,
  onSubmit,
  isSubmitting,
}: TicketReplyDialogProps) {
  // ==================================================
  // EMPLOYEE REPLY
  // ==================================================

  const [replyText, setReplyText] = useState("");

  // ==================================================
  // ATTACHMENT
  // ==================================================

  const [document, setDocument] =
    useState<File | undefined>();

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async () => {
    if (!replyText.trim()) {
      return;
    }

    const success = await onSubmit(
      ticketId,
      replyText.trim(),
      document
    );

    if (success) {
      setReplyText("");
      setDocument(undefined);
      onClose();
    }
  };

  // ==================================================
  // CLOSE
  // ==================================================

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setReplyText("");
    setDocument(undefined);

    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={handleClose}
    >
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">

        {/* ==================================================
            HEADER
        ================================================== */}

        <DialogHeader>

          <DialogTitle>
            Reply to Ticket
          </DialogTitle>

          <DialogDescription>
            Provide the requested information for ticket{" "}
            <span className="font-semibold">
              {ticketNumber}
            </span>
            .
          </DialogDescription>

        </DialogHeader>

        <div className="space-y-5">

          {/* ==================================================
              REQUEST FROM SUPPORT TEAM
          ================================================== */}

          <div className="space-y-2">

            <Label>
              Information Requested
            </Label>

            <div className="rounded-lg border bg-slate-50 p-4">

              <p className="text-sm leading-6 text-slate-700">
                {remarks}
              </p>

            </div>

          </div>

          {/* ==================================================
              EMPLOYEE REPLY
          ================================================== */}

          <div className="space-y-2">

            <Label>
              Your Reply{" "}
              <span className="text-red-600">
                *
              </span>
            </Label>

            <Textarea
              value={replyText}
              onChange={(event) =>
                setReplyText(
                  event.target.value
                )
              }
              placeholder="Enter your response..."
              rows={6}
              className="resize-none"
              disabled={isSubmitting}
            />

          </div>

          {/* ==================================================
              SUPPORTING DOCUMENT
          ================================================== */}

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
            />

            {document && (
              <p className="text-sm text-slate-500">
                Selected: {document.name}
              </p>
            )}

          </div>

        </div>

        {/* ==================================================
            FOOTER
        ================================================== */}

        <DialogFooter>

          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              !replyText.trim()
            }
          >
            {isSubmitting
              ? "Sending..."
              : "Send Reply"}
          </Button>

        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}