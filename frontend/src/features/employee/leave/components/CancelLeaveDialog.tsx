import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { useCancelLeave } from "../hooks/useCancelLeave";

import type { LeaveApplication } from "../types/leave.types";

interface CancelLeaveDialogProps {

    open: boolean;
    onClose: () => void;
    leave: LeaveApplication;
}

export default function CancelLeaveDialog({
    open,
    onClose,
    leave,
}: CancelLeaveDialogProps) {

    console.log("CancelLeaveDialog rendered");
    console.log("open =", open);
    console.log("leave =", leave);
    const { cancelLeave, isCancelling } = useCancelLeave();

    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (open) {
            setRemarks("");
        }
    }, [open]);

    const formatDate = (date: string) => {
  if (!date) return "-";

  const parsed = new Date(date);

  if (isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-GB");
};

    const handleCancel = async () => {
        if (!remarks.trim()) {
            return;
        }

        try {
            await cancelLeave({
                leaveApplicationId: leave.Id,
                actionId: 13,
                reason: remarks,
            }).unwrap();

            onClose();
        } catch {
            // Error handled in hook
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl rounded-xl">
                <DialogHeader>
                    <DialogTitle>Cancel Leave</DialogTitle>

                    <DialogDescription>
                        Please review the leave details before cancelling this leave.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-2 gap-5">

                    <div>
                        <Label>Leave Type</Label>

                        <div className="mt-2 flex h-11 items-center rounded-md border bg-slate-50 px-3 text-sm">
                            {leave.LeaveName}
                        </div>
                    </div>

                    <div>
                        <Label>Leave ID</Label>

                        <div className="mt-2 flex h-11 items-center rounded-md border bg-slate-50 px-3 text-sm">
                            {leave.Id}
                        </div>
                    </div>

                    <div>
                        <Label>From Date</Label>

                        <div className="mt-2 flex h-11 items-center rounded-md border bg-slate-50 px-3 text-sm">
                            {formatDate(leave.FromDate)}
                        </div>
                    </div>

                    <div>
                        <Label>To Date</Label>

                        <div className="mt-2 flex h-11 items-center rounded-md border bg-slate-50 px-3 text-sm">
                            {formatDate(leave.ToDate)}
                        </div>
                    </div>

                </div>

                <div className="mt-5">
                    <Label htmlFor="remarks">
                        Remarks
                    </Label>

                    <Textarea
                        id="remarks"
                        rows={4}
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        placeholder="Enter cancellation remarks..."
                        className="mt-2"
                    />
                </div>

                <DialogFooter className="mt-6">

                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isCancelling}
                    >
                        Close
                    </Button>

                    <Button
                        onClick={handleCancel}
                        disabled={
                            isCancelling ||
                            !remarks.trim()
                        }
                        style={{
                            background: "var(--primary-color)",
                        }}
                    >
                        {isCancelling
                            ? "Cancelling..."
                            : "Cancel Leave"}
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}


