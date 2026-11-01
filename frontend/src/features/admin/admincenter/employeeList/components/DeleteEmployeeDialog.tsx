import { useState } from "react";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useDeleteEmployeeMutation, type Employee } from "../api/employeeListApi";

/** The server's message when it refused (for example "last Admin"). */
function errorMessage(error: unknown): string {
  const message = (error as { data?: { message?: unknown } })?.data?.message;
  if (typeof message === "string") return message;
  if (Array.isArray(message) && typeof message[0] === "string") return message[0];
  return "Could not remove the employee. Please try again.";
}

interface DeleteEmployeeDialogProps {
  /** The employee to remove; null keeps the dialog closed. */
  employee: Employee | null;
  onClose: () => void;
  onRemoved: (employee: Employee) => void;
}

/** Asks for confirmation, then removes the employee (history is kept). */
export default function DeleteEmployeeDialog({ employee, onClose, onRemoved }: DeleteEmployeeDialogProps) {
  const [deleteEmployee, { isLoading }] = useDeleteEmployeeMutation();
  const [error, setError] = useState<string | null>(null);

  const close = () => {
    if (isLoading) return;
    setError(null);
    onClose();
  };

  const confirm = async () => {
    if (!employee) return;

    try {
      await deleteEmployee(employee.EmployeeID).unwrap();
      setError(null);
      onRemoved(employee);
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <Dialog open={employee !== null} onOpenChange={(open) => !open && close()}>
      <DialogContent showCloseButton={false} className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex h-11 w-11 items-center justify-center rounded-full bg-[#FEECEC] text-[#DD3232]">
            <Trash2 size={20} />
          </div>
          <DialogTitle className="text-[18px] font-bold text-[#131313]">Remove employee?</DialogTitle>
          <DialogDescription className="text-[14px] leading-relaxed text-[#626262]">
            <strong className="font-semibold text-[#131313]">{employee?.EmployeeName}</strong> (ID{" "}
            {employee?.EmployeeID}) will be removed from the employee list and can no longer sign in. Their
            attendance, leave and payroll history is kept.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <p role="alert" className="rounded-lg bg-[#FEECEC] px-3 py-2 text-[13.5px] text-[#DD3232]">
            {error}
          </p>
        )}

        <DialogFooter className="mt-2 gap-2 sm:justify-end">
          <button
            type="button"
            onClick={close}
            disabled={isLoading}
            className="h-10 rounded-lg border border-[#E2E2E2] bg-white px-4 text-[13.5px] font-semibold text-[#131313] hover:bg-[#F7F7F7] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => void confirm()}
            disabled={isLoading}
            className="h-10 rounded-lg bg-[#DD3232] px-4 text-[13.5px] font-semibold text-white hover:bg-[#C42A2A] disabled:opacity-60"
          >
            {isLoading ? "Removing…" : "Remove employee"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
