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
            <DialogContent className="w-[calc(100%-24px)]
          max-w-[520px]
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          p-0
          shadow-xl
          sm:w-full">
                <DialogHeader className="px-5
            pb-4
            pt-5
            text-left
            sm:px-6
            sm:pb-5
            sm:pt-6">
                    <DialogTitle className="text-lg
              font-semibold
              text-slate-900
              sm:text-xl">
                        Submit Resignation
                    </DialogTitle>

                    <DialogDescription className="  pt-2
              text-sm
              leading-relaxed
              text-slate-500
              sm:text-base">
                        Are you sure you want to submit your resignation request?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className="flex
            w-full
            flex-row
            items-center
            justify-end
            gap-3
            border-t
            border-slate-200
            bg-white
            px-5
            py-4
            sm:px-6">
                    <Button
                        variant="outline"
                        className="h-10
              min-w-[100px]
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              text-sm
              font-medium
              text-slate-900
              hover:bg-slate-50"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>

                    <Button
                        className="h-10
              min-w-[125px]
              rounded-lg
              bg-[#ff6600]
              px-4
              text-sm
              font-semibold
              text-white
              shadow-none
              hover:bg-[#e65c00]
              active:bg-[#cc5200]
              disabled:cursor-not-allowed
              disabled:bg-orange-300"
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