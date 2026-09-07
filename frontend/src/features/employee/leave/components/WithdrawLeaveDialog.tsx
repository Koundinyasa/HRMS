import { useEffect, useMemo, useState } from "react";

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

import { useWithdrawLeave } from "../hooks/useWithdrawLeave";

interface LeaveField {
    label: string;
    value: string | number | null;
}

interface LeaveHistoryRecord {
    fields: LeaveField[];
}

interface WithdrawLeaveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    record: LeaveHistoryRecord | null;
    onSuccess: () => void;
}

export default function WithdrawLeaveDialog({
    open,
    onOpenChange,
    record,
    onSuccess,
}: WithdrawLeaveDialogProps) {
    const { withdrawLeave, isWithdrawing } =
        useWithdrawLeave();

    const [remarks, setRemarks] =
        useState("");

    useEffect(() => {
        if (open) {
            setRemarks("");
        }
    }, [open]);

    const values = useMemo(() => {
        if (!record) return {};

        return Object.fromEntries(
            record.fields.map((field) => [
                field.label,
                field.value,
            ])
        );
    }, [record]);

    if (!record) {
        return null;
    }

    const leaveApplicationId =
        Number(values["Action"]);
    const handleWithdraw = async () => {
        if (!remarks.trim()) {
            return;
        }

        try {
            await withdrawLeave({
                leaveApplicationId,
                actionId: 38,
                reason: remarks.trim(),
            });

            onSuccess();
            onOpenChange(false);
        } catch {
            // Error toast is handled in the hook
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent className="sm:max-w-3xl rounded-xl">

                <DialogHeader>

                    <DialogTitle>
                        Withdraw Leave
                    </DialogTitle>

                    <DialogDescription>
                        Please review the leave details before submitting your request.
                    </DialogDescription>

                </DialogHeader>

                <div className="grid grid-cols-1 gap-5 py-2 sm:grid-cols-2">

                    <div>
                        <Label>
                            Leave Type
                        </Label>

                        <div className="mt-2 rounded-md border bg-slate-50 px-3 py-2 text-sm">
                            {values["Leave Type"]}
                        </div>
                    </div>

                    <div>
                        <Label>
                            Days
                        </Label>

                        <div className="mt-2 rounded-md border bg-slate-50 px-3 py-2 text-sm">
                            {values["Days"]}
                        </div>
                    </div>

                    <div>
                        <Label>
                            From Date
                        </Label>

                        <div className="mt-2 rounded-md border bg-slate-50 px-3 py-2 text-sm">
                            {values["From Date"]}
                        </div>
                    </div>

                    <div>
                        <Label>
                            To Date
                        </Label>

                        <div className="mt-2 rounded-md border bg-slate-50 px-3 py-2 text-sm">
                            {values["To Date"]}
                        </div>
                    </div>

                </div>

                <div className="mt-2">

                    <Label>
                        Reason
                    </Label>

                    <div className="mt-2 min-h-[30px] rounded-md border bg-slate-50 px-3 py-3 text-sm whitespace-pre-wrap">
                        {values["Reason"]}
                    </div>

                </div>

                <div className="mt-5">

                    <Label htmlFor="remarks">
                        Remarks
                    </Label>

                    <Textarea
                        id="remarks"
                        rows={3}
                        value={remarks}
                        onChange={(e) =>
                            setRemarks(e.target.value)
                        }
                        placeholder="Enter withdrawal remarks..."
                        className="mt-2"
                    />

                </div>
                <DialogFooter className="mt-6">

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isWithdrawing}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        disabled={
                            isWithdrawing ||
                            !remarks.trim()
                        }
                        onClick={handleWithdraw}
                        style={{
                            background: "purple",
                        }}
                    >
                        {isWithdrawing
                            ? "Withdrawing..."
                            : "Withdraw"}
                    </Button>

                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}

