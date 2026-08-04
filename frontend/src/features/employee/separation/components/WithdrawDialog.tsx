import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import type { WithdrawDialogProps } from "../types/separation.types";

export default function WithdrawDialog({
  open,
  loading = false,
  onOpenChange,
  onConfirm,
}: WithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-bold">
            Withdraw Resignation
          </DialogTitle>

          <DialogDescription className="mt-2 text-base text-slate-600">
            Are you sure you want to withdraw your resignation request?

            <br />

            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="px-6 py-5 flex justify-end gap-3">
          <Button
            variant="outline"
            className="w-32"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="w-40 bg-blue-600 hover:bg-blue-700"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading
              ? "Submitting..."
              : "Withdraw Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}