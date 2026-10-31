import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
import { useToast, Toast } from "./common/Toast";
import { Bookmark, Loader2 } from "lucide-react";
import { EffectiveFromBar } from "./common/EffectiveFromBar";

const ALL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function LwfDetailsForm() {
  const { lwf, isLoading, updateLwf, isSaving, refetch } = useLwfDetails();

  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [cutoffAmount, setCutoffAmount] = useState(0);
  const [employeeContribution, setEmployeeContribution] = useState(0);
  const [employerContribution, setEmployerContribution] = useState(0);
  const [deductionMonths, setDeductionMonths] = useState<string[]>([]);

  const { toast, showToast } = useToast();

  useEffect(() => {
    if (lwf) {
      setEffectiveFrom(lwf.effectiveFrom);
      setCutoffAmount(lwf.cutoffAmount);
      setEmployeeContribution(lwf.employeeContribution);
      setEmployerContribution(lwf.employerContribution);
      setDeductionMonths(monthsToArray(lwf));
    }
  }, [lwf]);

  function handleMonthChange(month: string) {
    setDeductionMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  }

  async function handleSave() {
    if (!lwf) {
      showToast("LWF configuration is not loaded yet. Please wait and try again.", "error");
      return;
    }
    if (!lwf.id || lwf.id <= 0) {
      showToast(
        "Cannot update: LWF configuration ID is missing from the server response. Open browser console (F12) and check the [LWF] log for available keys.",
        "error",
      );
      return;
    }
    if (!lwf.groupId || lwf.groupId <= 0) {
      showToast(
        "Cannot update: LWF group ID is missing. Refresh the page or contact support.",
        "error",
      );
      return;
    }

    const payload = {
      ...lwf,
      id: lwf.id,
      groupId: lwf.groupId,
      stateId: lwf.stateId,
      stateName: lwf.stateName,
      ...arrayToMonths(
        {
          effectiveFrom,
          cutoffAmount,
          employeeContribution,
          employerContribution,
        },
        deductionMonths,
      ),
    };
    try {
      await updateLwf(payload).unwrap();
      await refetch();
      showToast("LWF details saved successfully");
    } catch (err) {
      console.error("Failed to save LWF details", err);
      const data = (err as {
        data?: string | { message?: string | string[]; error?: string };
      })?.data;
      const apiMessage =
        typeof data === "string"
          ? data
          : Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message ?? data?.error;
      showToast(
        apiMessage ?? "Failed to save LWF details. Please try again.",
        "error",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">
        Loading LWF details…
      </div>
    );
  }

  const firstColumnMonths = ALL_MONTHS.slice(0, 6);
  const secondColumnMonths = ALL_MONTHS.slice(6);

  return (
    <div className="w-full min-w-0 max-w-full font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      <Card
        data-company-module-card
        className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-sm sm:p-6"
      >
        <EffectiveFromBar value={effectiveFrom} onChange={setEffectiveFrom} />

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
          <div className="min-w-0 space-y-4 sm:space-y-5">
            <div>
              <Label
                htmlFor="cutoffAmount"
                className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
              >
                Cut Off (Amount)
              </Label>
              <Input
                id="cutoffAmount"
                type="number"
                value={cutoffAmount}
                onChange={(e) => setCutoffAmount(Number(e.target.value))}
                className="mt-2 h-10 w-full rounded-xl border border-[#EDEDED] sm:h-11"
                placeholder="0"
              />
            </div>
            <div>
              <Label
                htmlFor="employeeContribution"
                className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
              >
                Employee Contribution (Amount)
              </Label>
              <Input
                id="employeeContribution"
                type="number"
                value={employeeContribution}
                onChange={(e) =>
                  setEmployeeContribution(Number(e.target.value))
                }
                className="mt-2 h-10 w-full rounded-xl border border-[#EDEDED] sm:h-11"
                placeholder="0"
              />
            </div>
            <div>
              <Label
                htmlFor="employerContribution"
                className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
              >
                Employer Contribution (Amount)
              </Label>
              <Input
                id="employerContribution"
                type="number"
                value={employerContribution}
                onChange={(e) =>
                  setEmployerContribution(Number(e.target.value))
                }
                className="mt-2 h-10 w-full rounded-xl border border-[#EDEDED] sm:h-11"
                placeholder="0"
              />
            </div>
          </div>

          <div className="min-w-0 rounded-xl border border-[#EDEDED] p-3 sm:p-4">
            <h3 className="mb-3 text-sm font-semibold text-[#2E2E2E] sm:mb-4 sm:text-base">
              Deduction Months
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:gap-x-8">
              <div className="space-y-2 sm:space-y-3">
                {firstColumnMonths.map((month) => (
                  <label
                    key={month}
                    className="flex cursor-pointer items-center gap-2 text-sm text-[#2E2E2E]"
                  >
                    <input
                      type="checkbox"
                      checked={deductionMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                      className="h-4 w-4 shrink-0 rounded border-[#EDEDED] text-[#7A5BED] focus:ring-[#7A5BED]"
                    />
                    <span className="truncate">{month}</span>
                  </label>
                ))}
              </div>
              <div className="space-y-2 sm:space-y-3">
                {secondColumnMonths.map((month) => (
                  <label
                    key={month}
                    className="flex cursor-pointer items-center gap-2 text-sm text-[#2E2E2E]"
                  >
                    <input
                      type="checkbox"
                      checked={deductionMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                      className="h-4 w-4 shrink-0 rounded border-[#EDEDED] text-[#7A5BED] focus:ring-[#7A5BED]"
                    />
                    <span className="truncate">{month}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:mt-6 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={() => {
            if (lwf) {
              setEffectiveFrom(lwf.effectiveFrom);
              setCutoffAmount(lwf.cutoffAmount);
              setEmployeeContribution(lwf.employeeContribution);
              setEmployerContribution(lwf.employerContribution);
              setDeductionMonths(monthsToArray(lwf));
            }
          }}
          className="w-full rounded-xl border border-[#EDEDED] bg-white px-5 py-2 text-sm font-medium text-[#2E2E2E] transition hover:bg-[#EDEDED] sm:w-auto"
        >
          Load Default Value
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A5BED] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5932E9] disabled:opacity-60 sm:w-auto"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}