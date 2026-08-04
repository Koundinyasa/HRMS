import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { SubmitDialogProps } from "../types/separation.types";

export default function SubmitDialog({
    open,
    loading = false,
    onOpenChange,
    onConfirm,
}: SubmitDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
                <DialogHeader className="px-6 py-5">
                    <DialogTitle className="text-xl font-semibold">
                        Submit Resignation
                    </DialogTitle>

                    <DialogDescription className="mt-2 text-sm leading-6 text-muted-foreground">
                        Are you sure you want to submit your resignation request?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="px-6 py-5 sm:justify-end gap-3">
                    <Button
                        variant="outline"
                        className="min-w-[110px] h-10"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="min-w-[150px] h-10 bg-blue-600 hover:bg-blue-700"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Submitting..." : "Submit Request"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}