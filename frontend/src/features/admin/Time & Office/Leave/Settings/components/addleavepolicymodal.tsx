import { useEffect, useState } from "react";
import { X, Save, Loader2 } from "lucide-react";

import {
  useCreateLeavePolicyMutation,
  useUpdateLeavePolicyMutation,
} from "../api/settingsApi";

import type { LeavePolicyFormValues } from "../types/leavesettings.types";

interface AddLeavePolicyModalProps {
  policyId: number | null;
  onClose: () => void;
  initialValues?: Partial<LeavePolicyFormValues>;
}

const defaultForm: LeavePolicyFormValues = {
  policyId: undefined,
  policyName: "",
  maxLeavesAllowedInNoticePeriod: undefined,
  allowedLeavesDuringNoticePeriod: "",
  maxDaysAllowedToApplyFutureMonth: 60,
  emergencyContact: false,
  notifyTo: false,
  standInEmployee: false,
};

export default function AddLeavePolicyModal({
  policyId,
  onClose,
  initialValues,
}: AddLeavePolicyModalProps) {
  const [createPolicy, { isLoading: isCreating }] =
    useCreateLeavePolicyMutation();

  const [updatePolicy, { isLoading: isUpdating }] =
    useUpdateLeavePolicyMutation();

  const [form, setForm] = useState<LeavePolicyFormValues>({
    ...defaultForm,
    policyId: policyId ?? undefined,
    ...initialValues,
  });

  const [error, setError] = useState<string | null>(null);

  const isEditMode = policyId !== null;
  const isSaving = isCreating || isUpdating;

  useEffect(() => {
    setForm({
      ...defaultForm,
      policyId: policyId ?? undefined,
      ...initialValues,
    });

    setError(null);
  }, [policyId, initialValues]);

  const setField = <K extends keyof LeavePolicyFormValues>(
    field: K,
    value: LeavePolicyFormValues[K],
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const trimmedPolicyName = form.policyName.trim();

    if (!trimmedPolicyName) {
      setError("Policy Name is required.");
      return;
    }

    setError(null);

    const payload: LeavePolicyFormValues = {
      ...form,
      policyName: trimmedPolicyName,
      policyId: policyId ?? undefined,
    };

    try {
      if (isEditMode) {
        await updatePolicy(payload).unwrap();
      } else {
        await createPolicy(payload).unwrap();
      }

      onClose();
    } catch (err) {
      console.error("Failed to save leave policy:", err);

      setError(
        "Could not save the leave policy. Please check the details and try again.",
      );
    }
  };

  const handleOverlayClick = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (event.target === event.currentTarget && !isSaving) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/40 px-3 py-4 sm:px-5"
      onMouseDown={handleOverlayClick}
    >
      <div
        className="my-auto flex max-h-[calc(100vh-32px)] w-full max-w-[560px] flex-col overflow-hidden rounded-[12px] border border-[#DCE7E1] bg-white shadow-[0_18px_55px_rgba(0,0,0,0.16)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-leave-policy-title"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#E6EBE8] px-4 py-3.5 sm:px-5">
          <div className="min-w-0">
            <h2
              id="add-leave-policy-title"
              className="font-serif text-[19px] font-semibold text-[#303532] sm:text-[20px]"
            >
              {isEditMode
                ? "Edit Leave Policy"
                : "Add Leave Policy"}
            </h2>

            <div className="mt-1.5 h-[2px] w-[42px] rounded-full bg-[#009B57]" />
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            aria-label="Close"
            className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[7px] text-[#66716C] transition hover:bg-[#F2F5F3] hover:text-[#303532] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} strokeWidth={1.8} />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Policy Name */}
            <div className="sm:col-span-2">
              <label
                htmlFor="policy-name"
                className="mb-1.5 block font-[Urbanist] text-[12px] font-medium text-[#4D5752]"
              >
                Policy Name
                <span className="ml-1 text-[#D92D20]">*</span>
              </label>

              <input
                id="policy-name"
                type="text"
                value={form.policyName}
                onChange={(event) =>
                  setField("policyName", event.target.value)
                }
                placeholder="Enter policy name"
                disabled={isSaving}
                className="h-[38px] w-full rounded-[7px] border border-[#D5DED9] bg-white px-3 font-[Urbanist] text-[13px] text-[#303532] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#009B57] focus:ring-2 focus:ring-[#009B57]/10 disabled:bg-[#F5F7F6]"
              />
            </div>

            {/* Max Leaves */}
            <div>
              <label
                htmlFor="max-leaves-notice"
                className="mb-1.5 block font-[Urbanist] text-[12px] font-medium leading-4 text-[#4D5752]"
              >
                Max Leaves Allowed in Notice Period
              </label>

              <input
                id="max-leaves-notice"
                type="number"
                min={0}
                value={
                  form.maxLeavesAllowedInNoticePeriod ?? ""
                }
                onChange={(event) => {
                  const value = event.target.value;

                  setField(
                    "maxLeavesAllowedInNoticePeriod",
                    value === ""
                      ? undefined
                      : Number(value),
                  );
                }}
                disabled={isSaving}
                placeholder="Enter days"
                className="h-[38px] w-full rounded-[7px] border border-[#D5DED9] bg-white px-3 font-[Urbanist] text-[13px] text-[#303532] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#009B57] focus:ring-2 focus:ring-[#009B57]/10 disabled:bg-[#F5F7F6]"
              />
            </div>

            {/* Allowed Leaves */}
            <div>
              <label
                htmlFor="allowed-leaves-notice"
                className="mb-1.5 block font-[Urbanist] text-[12px] font-medium leading-4 text-[#4D5752]"
              >
                Allowed Leaves During Notice Period
              </label>

              <select
                id="allowed-leaves-notice"
                value={form.allowedLeavesDuringNoticePeriod}
                onChange={(event) =>
                  setField(
                    "allowedLeavesDuringNoticePeriod",
                    event.target.value,
                  )
                }
                disabled={isSaving}
                className="h-[38px] w-full appearance-none rounded-[7px] border border-[#D5DED9] bg-white px-3 font-[Urbanist] text-[13px] text-[#303532] outline-none transition focus:border-[#009B57] focus:ring-2 focus:ring-[#009B57]/10 disabled:bg-[#F5F7F6]"
              >
                <option value="">Select</option>
                <option value="All">All</option>
                <option value="CL">Casual Leave</option>
                <option value="SL">Sick Leave</option>
                <option value="None">None</option>
              </select>
            </div>

            {/* Future Month */}
            <div>
              <label
                htmlFor="future-month-days"
                className="mb-1.5 block font-[Urbanist] text-[12px] font-medium leading-4 text-[#4D5752]"
              >
                Max Days Allowed to Apply Future Month
              </label>

              <input
                id="future-month-days"
                type="number"
                min={0}
                value={
                  form.maxDaysAllowedToApplyFutureMonth ?? ""
                }
                onChange={(event) => {
                  const value = event.target.value;

                  setField(
                    "maxDaysAllowedToApplyFutureMonth",
                    value === ""
                      ? undefined
                      : Number(value),
                  );
                }}
                disabled={isSaving}
                placeholder="60"
                className="h-[38px] w-full rounded-[7px] border border-[#D5DED9] bg-white px-3 font-[Urbanist] text-[13px] text-[#303532] outline-none transition placeholder:text-[#A0A8A4] focus:border-[#009B57] focus:ring-2 focus:ring-[#009B57]/10 disabled:bg-[#F5F7F6]"
              />
            </div>

            {/* Settings */}
            <div className="rounded-[8px] border border-[#E0E8E3] bg-[#F9FCFA] p-3 sm:col-span-2">
              <p className="mb-3 font-serif text-[14px] font-semibold text-[#39413D]">
                Policy Options
              </p>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                {/* Emergency Contact */}
                <label className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-[7px] border border-[#E0E7E3] bg-white px-3">
                  <input
                    type="checkbox"
                    checked={Boolean(form.emergencyContact)}
                    onChange={(event) =>
                      setField(
                        "emergencyContact",
                        event.target.checked,
                      )
                    }
                    disabled={isSaving}
                    className="h-3.5 w-3.5 accent-[#009B57]"
                  />

                  <span className="font-[Urbanist] text-[12px] text-[#4D5752]">
                    Emergency Contact
                  </span>
                </label>

                {/* Notify To */}
                <label className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-[7px] border border-[#E0E7E3] bg-white px-3">
                  <input
                    type="checkbox"
                    checked={Boolean(form.notifyTo)}
                    onChange={(event) =>
                      setField(
                        "notifyTo",
                        event.target.checked,
                      )
                    }
                    disabled={isSaving}
                    className="h-3.5 w-3.5 accent-[#009B57]"
                  />

                  <span className="font-[Urbanist] text-[12px] text-[#4D5752]">
                    Notify To
                  </span>
                </label>

                {/* Stand-in Employee */}
                <label className="flex min-h-[40px] cursor-pointer items-center gap-2 rounded-[7px] border border-[#E0E7E3] bg-white px-3">
                  <input
                    type="checkbox"
                    checked={Boolean(form.standInEmployee)}
                    onChange={(event) =>
                      setField(
                        "standInEmployee",
                        event.target.checked,
                      )
                    }
                    disabled={isSaving}
                    className="h-3.5 w-3.5 accent-[#009B57]"
                  />

                  <span className="font-[Urbanist] text-[12px] text-[#4D5752]">
                    Stand-in Employee
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 rounded-[7px] border border-[#F3C5C1] bg-[#FFF6F5] px-3 py-2.5">
              <p className="font-[Urbanist] text-[12px] leading-5 text-[#B42318]">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-[#E6EBE8] bg-[#FCFDFC] px-4 py-3 sm:flex-row sm:items-center sm:justify-end sm:px-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="h-[38px] w-full rounded-[7px] border border-[#D5DED9] bg-white px-4 font-[Urbanist] text-[13px] font-medium text-[#4D5752] transition hover:bg-[#F5F7F6] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex h-[38px] w-full items-center justify-center gap-2 rounded-[7px] bg-[#009B57] px-5 font-[Urbanist] text-[13px] font-medium text-white transition hover:bg-[#00854A] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSaving ? (
              <>
                <Loader2
                  size={15}
                  className="animate-spin"
                />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={15} strokeWidth={1.9} />
                <span>{isEditMode ? "Update" : "Save"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}