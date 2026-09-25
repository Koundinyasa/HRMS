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
      <DialogContent
        className="w-[calc(100%-24px)]
          max-w-lg
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-0
          overflow-hidden"
        style={{ fontFamily: "Urbanist Variable, Urbanist, sans-serif" }}
      >
        <DialogHeader className="px-6
            pt-6
            pb-4
            border-b
            border-slate-200
            text-left">
          <DialogTitle className="text-2xl font-bold text-slate-900">
            Withdraw Resignation
          </DialogTitle>

          <DialogDescription className="mt-2 text-base text-slate-600">
            Are you sure you want to withdraw your resignation request?

            <br />

            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex
            w-full
            flex-row
            items-center
            justify-end
            gap-3
            px-6
            py-5">
          <Button
            variant="outline"
            className="h-10
              w-32
              rounded-lg
              border
              border-slate-200
              bg-white
              text-slate-900
              hover:bg-slate-50"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            className="h-10
              w-40
              rounded-lg
              !bg-[#ff6600]
              !text-white
              font-semibold
              hover:!bg-[#e65c00]
              active:!bg-[#cc5200]
              disabled:!bg-orange-300"
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