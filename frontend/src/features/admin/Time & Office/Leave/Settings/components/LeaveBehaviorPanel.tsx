import {
  Check,
  RefreshCcw,
  Save,
} from "lucide-react";

export interface LeaveBehaviorValues {
  allowLeaveDuringProbation: boolean;
  allowLeaveDuringNoticePeriod: boolean;
  allowLeaveWithoutBalance: boolean;
  allowLeaveForFutureDate: boolean;
  allowLeaveForPastDate: boolean;
  allowBackdatedLeave: boolean;
  backdatedLeaveDays: number | "";
  futureLeaveDays: number | "";
  requireReason: boolean;
  reasonMandatory: boolean;
  requireDocument: boolean;
  documentMandatoryAfterDays: number | "";
  allowHalfDay: boolean;
  allowMultipleLeaveTypes: boolean;
  sandwichRule: boolean;
  includeWeekOff: boolean;
  includeHoliday: boolean;
}

interface LeaveBehaviorPanelProps {
  values: LeaveBehaviorValues;

  onChange: (
    field: keyof LeaveBehaviorValues,
    value: LeaveBehaviorValues[keyof LeaveBehaviorValues],
  ) => void;

  onSave?: () => void;
  onReset?: () => void;
  onRefresh?: () => void;

  loading?: boolean;
  saving?: boolean;
}

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

const ToggleField = ({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleFieldProps) => (
  <div
    className="
      flex items-center justify-between
      gap-4 rounded-[8px]
      border border-[#E1E8E4]
      bg-white
      px-3.5 py-3
      transition
      hover:border-[#C8DED2]
    "
  >
    <div className="min-w-0">
      <p className="font-[Urbanist] text-[12px] font-medium text-[#39413D]">
        {label}
      </p>

      {description && (
        <p className="mt-0.5 font-[Urbanist] text-[10px] leading-4 text-[#89948F]">
          {description}
        </p>
      )}
    </div>

    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`
        relative
        h-[22px] w-[40px]
        shrink-0
        rounded-full
        transition
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${
          checked
            ? "bg-[#009B57]"
            : "bg-[#CDD5D1]"
        }
      `}
    >
      <span
        className={`
          absolute top-[3px]
          h-[16px] w-[16px]
          rounded-full bg-white
          shadow-sm
          transition
          ${
            checked
              ? "left-[21px]"
              : "left-[3px]"
          }
        `}
      />
    </button>
  </div>
);

export default function LeaveBehaviorPanel({
  values,
  onChange,
  onSave,
  onReset,
  onRefresh,
  loading = false,
  saving = false,
}: LeaveBehaviorPanelProps) {
  const disabled =
    loading || saving;

  return (
    <section className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-[10px] border border-[#D9E6DF] bg-white">
      {/* HEADER */}
      <div
        className="
          flex flex-col gap-3
          border-b border-[#E4EAE7]
          px-4 py-3.5
          sm:px-5
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <div>
          <h2 className="font-serif text-[20px] font-semibold text-[#303532]">
            Leave Behavior
          </h2>

          <div className="mt-1.5 h-[2px] w-[48px] rounded-full bg-[#009B57]" />

          <p className="mt-1.5 font-[Urbanist] text-[11px] text-[#7B8781]">
            Configure how leave applications
            behave across the system.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={disabled}
              className="
                flex h-[36px]
                items-center justify-center
                gap-1.5
                rounded-[7px]
                border border-[#D5DED9]
                bg-white
                px-3
                font-[Urbanist]
                text-[12px]
                font-medium
                text-[#59645F]
                transition
                hover:border-[#009B57]
                hover:text-[#009B57]
                disabled:opacity-50
              "
            >
              <RefreshCcw
                size={14}
                strokeWidth={1.8}
              />

              Refresh
            </button>
          )}

          {onReset && (
            <button
              type="button"
              onClick={onReset}
              disabled={disabled}
              className="
                flex h-[36px]
                items-center justify-center
                rounded-[7px]
                border border-[#D5DED9]
                bg-white
                px-3
                font-[Urbanist]
                text-[12px]
                font-medium
                text-[#59645F]
                transition
                hover:border-[#009B57]
                hover:text-[#009B57]
                disabled:opacity-50
              "
            >
              Reset
            </button>
          )}

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={disabled}
              className="
                flex h-[36px]
                items-center justify-center
                gap-1.5
                rounded-[7px]
                bg-[#009B57]
                px-3.5
                font-[Urbanist]
                text-[12px]
                font-medium
                text-white
                transition
                hover:bg-[#00854A]
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <Save
                size={14}
                strokeWidth={1.8}
              />

              {saving
                ? "Saving..."
                : "Save"}
            </button>
          )}
        </div>
      </div>

      {/* CONTENT */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="space-y-5 p-4 sm:p-5">
          {/* APPLICATION RULES */}
          <section>
            <div className="mb-3">
              <h3 className="font-serif text-[16px] font-semibold text-[#39413D]">
                Application Rules
              </h3>

              <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#89948F]">
                Control when employees can submit
                leave applications.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <ToggleField
                label="Allow Leave During Probation"
                description="Employees can apply for leave while they are on probation."
                checked={
                  values.allowLeaveDuringProbation
                }
                onChange={(value) =>
                  onChange(
                    "allowLeaveDuringProbation",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Allow Leave During Notice Period"
                description="Employees can apply for leave during their notice period."
                checked={
                  values.allowLeaveDuringNoticePeriod
                }
                onChange={(value) =>
                  onChange(
                    "allowLeaveDuringNoticePeriod",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Allow Leave Without Balance"
                description="Allow an application even when sufficient leave balance is unavailable."
                checked={
                  values.allowLeaveWithoutBalance
                }
                onChange={(value) =>
                  onChange(
                    "allowLeaveWithoutBalance",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Allow Leave for Future Date"
                description="Employees can apply for leave for upcoming dates."
                checked={
                  values.allowLeaveForFutureDate
                }
                onChange={(value) =>
                  onChange(
                    "allowLeaveForFutureDate",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Allow Leave for Past Date"
                description="Employees can submit leave applications for previous dates."
                checked={
                  values.allowLeaveForPastDate
                }
                onChange={(value) =>
                  onChange(
                    "allowLeaveForPastDate",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Allow Backdated Leave"
                description="Allow leave applications to be submitted after the leave date."
                checked={
                  values.allowBackdatedLeave
                }
                onChange={(value) =>
                  onChange(
                    "allowBackdatedLeave",
                    value,
                  )
                }
                disabled={disabled}
              />
            </div>
          </section>

          {/* DATE LIMITS */}
          <section
            className="
              rounded-[9px]
              border border-[#E0E8E3]
              bg-[#F9FCFA]
              p-4
            "
          >
            <div className="mb-3">
              <h3 className="font-serif text-[15px] font-semibold text-[#39413D]">
                Date Limits
              </h3>

              <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#89948F]">
                Define how far back or forward an
                employee can apply.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block font-[Urbanist] text-[11px] font-medium text-[#4D5752]">
                  Backdated Leave Days
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    values.backdatedLeaveDays
                  }
                  onChange={(event) =>
                    onChange(
                      "backdatedLeaveDays",
                      event.target.value === ""
                        ? ""
                        : Number(
                            event.target.value,
                          ),
                    )
                  }
                  disabled={
                    disabled ||
                    !values.allowBackdatedLeave
                  }
                  className="
                    h-[38px] w-full
                    rounded-[7px]
                    border border-[#D5DED9]
                    bg-white px-3
                    font-[Urbanist]
                    text-[12px]
                    outline-none
                    focus:border-[#009B57]
                    focus:ring-2
                    focus:ring-[#009B57]/10
                    disabled:bg-[#F0F3F1]
                  "
                />
              </div>

              <div>
                <label className="mb-1.5 block font-[Urbanist] text-[11px] font-medium text-[#4D5752]">
                  Future Leave Days
                </label>

                <input
                  type="number"
                  min={0}
                  value={
                    values.futureLeaveDays
                  }
                  onChange={(event) =>
                    onChange(
                      "futureLeaveDays",
                      event.target.value === ""
                        ? ""
                        : Number(
                            event.target.value,
                          ),
                    )
                  }
                  disabled={
                    disabled ||
                    !values.allowLeaveForFutureDate
                  }
                  className="
                    h-[38px] w-full
                    rounded-[7px]
                    border border-[#D5DED9]
                    bg-white px-3
                    font-[Urbanist]
                    text-[12px]
                    outline-none
                    focus:border-[#009B57]
                    focus:ring-2
                    focus:ring-[#009B57]/10
                    disabled:bg-[#F0F3F1]
                  "
                />
              </div>
            </div>
          </section>

          {/* VALIDATION & DOCUMENTATION */}
          <section>
            <div className="mb-3">
              <h3 className="font-serif text-[16px] font-semibold text-[#39413D]">
                Validation & Documentation
              </h3>

              <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#89948F]">
                Configure reason and document
                requirements for leave applications.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <ToggleField
                label="Require Reason"
                description="Ask employees to provide a reason when applying for leave."
                checked={values.requireReason}
                onChange={(value) =>
                  onChange(
                    "requireReason",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Reason Mandatory"
                description="Make the leave reason mandatory before submission."
                checked={
                  values.reasonMandatory
                }
                onChange={(value) =>
                  onChange(
                    "reasonMandatory",
                    value,
                  )
                }
                disabled={
                  disabled ||
                  !values.requireReason
                }
              />

              <ToggleField
                label="Require Document"
                description="Allow the application to request supporting documents."
                checked={
                  values.requireDocument
                }
                onChange={(value) =>
                  onChange(
                    "requireDocument",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Allow Half Day"
                description="Allow employees to apply for half-day leave."
                checked={values.allowHalfDay}
                onChange={(value) =>
                  onChange(
                    "allowHalfDay",
                    value,
                  )
                }
                disabled={disabled}
              />

              <div
                className="
                  rounded-[8px]
                  border border-[#E1E8E4]
                  bg-white
                  p-3
                "
              >
                <ToggleField
                  label="Document Mandatory After Days"
                  description="Make supporting documentation mandatory after the configured duration."
                  checked={
                    values.requireDocument
                  }
                  onChange={(value) =>
                    onChange(
                      "requireDocument",
                      value,
                    )
                  }
                  disabled={disabled}
                />

                <div className="mt-3">
                  <input
                    type="number"
                    min={0}
                    value={
                      values.documentMandatoryAfterDays
                    }
                    onChange={(event) =>
                      onChange(
                        "documentMandatoryAfterDays",
                        event.target.value ===
                          ""
                          ? ""
                          : Number(
                              event.target.value,
                            ),
                      )
                    }
                    disabled={
                      disabled ||
                      !values.requireDocument
                    }
                    placeholder="Number of days"
                    className="
                      h-[36px] w-full
                      rounded-[7px]
                      border border-[#D5DED9]
                      bg-white px-3
                      font-[Urbanist]
                      text-[12px]
                      outline-none
                      focus:border-[#009B57]
                      disabled:bg-[#F0F3F1]
                    "
                  />
                </div>
              </div>
            </div>
          </section>

          {/* LEAVE CALCULATION */}
          <section>
            <div className="mb-3">
              <h3 className="font-serif text-[16px] font-semibold text-[#39413D]">
                Leave Calculation
              </h3>

              <p className="mt-0.5 font-[Urbanist] text-[10px] text-[#89948F]">
                Configure how holidays and weekly
                offs are treated during leave.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              <ToggleField
                label="Allow Multiple Leave Types"
                description="Allow more than one leave type in the same application."
                checked={
                  values.allowMultipleLeaveTypes
                }
                onChange={(value) =>
                  onChange(
                    "allowMultipleLeaveTypes",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Sandwich Rule"
                description="Include intervening holidays or weekly offs according to the sandwich rule."
                checked={
                  values.sandwichRule
                }
                onChange={(value) =>
                  onChange(
                    "sandwichRule",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Include Week Off"
                description="Count weekly offs when calculating leave duration."
                checked={
                  values.includeWeekOff
                }
                onChange={(value) =>
                  onChange(
                    "includeWeekOff",
                    value,
                  )
                }
                disabled={disabled}
              />

              <ToggleField
                label="Include Holiday"
                description="Count holidays when calculating leave duration."
                checked={
                  values.includeHoliday
                }
                onChange={(value) =>
                  onChange(
                    "includeHoliday",
                    value,
                  )
                }
                disabled={disabled}
              />
            </div>
          </section>

          {/* BOTTOM ACTIONS */}
          <div
            className="
              flex flex-col gap-2
              border-t border-[#E7ECE9]
              pt-4
              sm:flex-row
              sm:items-center
              sm:justify-end
            "
          >
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                disabled={disabled}
                className="
                  h-[38px]
                  rounded-[7px]
                  border border-[#D5DED9]
                  bg-white
                  px-4
                  font-[Urbanist]
                  text-[12px]
                  font-medium
                  text-[#59645F]
                  hover:border-[#009B57]
                  hover:text-[#009B57]
                  disabled:opacity-50
                "
              >
                Reset
              </button>
            )}

            {onSave && (
              <button
                type="button"
                onClick={onSave}
                disabled={disabled}
                className="
                  flex h-[38px]
                  items-center justify-center
                  gap-1.5
                  rounded-[7px]
                  bg-[#009B57]
                  px-5
                  font-[Urbanist]
                  text-[12px]
                  font-medium
                  text-white
                  hover:bg-[#00854A]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <Check
                  size={14}
                  strokeWidth={1.8}
                />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}