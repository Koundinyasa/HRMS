import type { FormEvent } from "react";
import { X } from "lucide-react";
import { formInputClass } from "../constants/recruitment.constants";
import { FormField } from "./RecruitmentShared";

interface NewJobOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  jobFormError: string;
}

export function NewJobOpeningModal({
  isOpen,
  onClose,
  onSubmit,
  jobFormError,
}: NewJobOpeningModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-opening-title"
        className="my-auto max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-7"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 id="new-opening-title" className="text-xl font-bold">
              New job requisition
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-[#78867e]">
              Submit a hiring request. The company is taken from your signed-in
              account; use the branch and designation IDs from your HR setup.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close new job opening form"
            className="rounded-lg p-2 text-[#78867e] hover:bg-[#f1f4f1]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField label="Job title">
            <input
              name="title"
              required
              autoFocus
              placeholder="e.g. Data Analyst"
              className={formInputClass}
            />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Branch ID">
              <input
                name="branchId"
                type="number"
                min="1"
                step="1"
                required
                placeholder="e.g. 1"
                className={formInputClass}
              />
            </FormField>
            <FormField label="Designation ID">
              <input
                name="designationId"
                type="number"
                min="1"
                step="1"
                required
                placeholder="e.g. 1"
                className={formInputClass}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Vacancies">
              <input
                name="vacancies"
                type="number"
                min="1"
                step="1"
                required
                defaultValue="1"
                className={formInputClass}
              />
            </FormField>
            <FormField label="Experience required">
              <input
                name="experienceRequired"
                maxLength={50}
                placeholder="e.g. 3-5 years"
                className={formInputClass}
              />
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Salary band from (₹ LPA)">
              <input
                name="salaryFrom"
                type="number"
                min="0"
                step="0.5"
                placeholder="12"
                className={formInputClass}
              />
            </FormField>
            <FormField label="Salary band to (₹ LPA)">
              <input
                name="salaryTo"
                type="number"
                min="0"
                step="0.5"
                placeholder="18"
                className={formInputClass}
              />
            </FormField>
          </div>
          <FormField label="Priority (optional)">
            <input
              name="priority"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              className={formInputClass}
            />
          </FormField>
          {jobFormError && (
            <p role="alert" className="text-sm font-medium text-[#bd4b3d]">
              {jobFormError}
            </p>
          )}
          <div className="flex flex-wrap justify-end gap-2 border-t border-[#edf0ed] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="h-10 rounded-lg border border-[#dce4de] px-4 text-sm font-semibold text-[#344139] hover:bg-[#f7f9f7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              name="action"
              value="submit"
              className="h-10 rounded-lg bg-[#e5a538] px-4 text-sm font-semibold text-[#342712] hover:bg-[#d99a2b]"
            >
              Submit requisition
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
