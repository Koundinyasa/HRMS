import { useState } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePfDetails } from "../hooks/usePfDetails";
import type { PfConfiguration } from "../types/company.types";
import { useToast, Toast } from "./common/Toast";
import { EffectiveFromBar } from "./common/EffectiveFromBar";
import { FormSelect } from "./common/FormSelect";

const EMPTY_PF: PfConfiguration = {
  effectiveFrom: "",
  epfPercentage: 0,
  cutoff: 0,
  pfOnPayDays: false,
  pensionFundPercentage: 0,
  employerEPFPercentage: 0,
  roundOff: "",
  accountNo02Rate: 0,
  accountNo21Rate: 0,
  minimumChargesAccNo02: 0,
  restrictEmployerShare: false,
  restrictEmployerEmployeeWise: false,
};

const NUMBER_FIELDS = [
  { field: "epfPercentage", label: "EPF (A) (%)" },
  { field: "cutoff", label: "Cutoff (Amount)" },
  { field: "pensionFundPercentage", label: "Pension Fund (B) (%)" },
  { field: "employerEPFPercentage", label: "Employer EPF (A-B) (%)" },
  { field: "accountNo02Rate", label: "Account No. 02 (%)" },
  { field: "accountNo21Rate", label: "Account No. 21 (%)" },
  { field: "minimumChargesAccNo02", label: "Minimum Charges for Account No. 2" },
] as const satisfies ReadonlyArray<{
  field: keyof PfConfiguration;
  label: string;
}>;

const BOOLEAN_FIELDS = [
  { field: "pfOnPayDays", label: "PF on Pay Days" },
  { field: "restrictEmployerShare", label: "Restrict Employer Share" },
  {
    field: "restrictEmployerEmployeeWise",
    label: "Restrict Employer Share Employee-wise",
  },
] as const satisfies ReadonlyArray<{
  field: keyof PfConfiguration;
  label: string;
}>;

type NumberField = (typeof NUMBER_FIELDS)[number]["field"];
type BooleanField = (typeof BOOLEAN_FIELDS)[number]["field"];

export default function PfDetailsForm() {
  const {
    pf,
    pfGroups,
    roundOffOptions,
    isRoundOffLoading,
    isRoundOffError,
    isLoading,
    isError,
    updatePf,
    isSaving,
  } = usePfDetails();
  const [pfDraft, setPfDraft] = useState<PfConfiguration | null>(null);
  const pfData = pfDraft ?? pf ?? EMPTY_PF;
  const pfGroupId = pfGroups?.[0]?.id;
  const selectedRoundOff = roundOffOptions.find(
    (option) => option.name === pfData.roundOff,
  );
  const { toast, showToast } = useToast();

  function updatePfData(
    update: (configuration: PfConfiguration) => PfConfiguration,
  ) {
    setPfDraft((previous) => update(previous ?? pf ?? EMPTY_PF));
  }

  function handleNumberChange(field: NumberField, value: string) {
    updatePfData((prev) => ({ ...prev, [field]: Number(value) }));
  }

  function handleBooleanChange(field: BooleanField, checked: boolean) {
    updatePfData((prev) => ({ ...prev, [field]: checked }));
  }

  async function handleSave() {
    if (!pfData.effectiveFrom.trim()) {
      showToast("Effective From is required.", "error");
      return;
    }
    if (!pfGroupId || !Number.isInteger(pfGroupId)) {
      showToast("Cannot save PF details because no PF group was returned.", "error");
      return;
    }
    if (!selectedRoundOff) {
      showToast("Select a valid salary round-off option before saving.", "error");
      return;
    }

    try {
      await updatePf({
        configuration: pfData,
        pfGroupId,
        roundOffTypeId: selectedRoundOff.id,
      }).unwrap();
      showToast("PF details saved successfully");
    } catch (error) {
      console.error("Failed to save PF details", error);
      showToast("Failed to save PF details. Please try again.", "error");
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">
        Loading PF details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-[#B42318] sm:p-6" role="alert">
        Could not load PF details. Please refresh and try again.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      <Card
        data-company-module-card
        className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-6"
      >
        <EffectiveFromBar
          value={pfData.effectiveFrom}
          onChange={(value) =>
            updatePfData((prev) => ({ ...prev, effectiveFrom: value }))
          }
        />

        {!pfGroupId && (
          <p className="mb-6 text-sm text-[#B42318]" role="alert">
            PF details cannot be saved because the API did not return a PF group.
          </p>
        )}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {NUMBER_FIELDS.map(({ field, label }) => (
            <div key={field}>
              <Label
                htmlFor={field}
                className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
              >
                {label}
              </Label>
              <Input
                id={field}
                type="number"
                min="0"
                step="any"
                className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E]"
                value={pfData[field]}
                onChange={(event) =>
                  handleNumberChange(field, event.target.value)
                }
              />
            </div>
          ))}
        </div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {BOOLEAN_FIELDS.map(({ field, label }) => (
            <label
              key={field}
              htmlFor={field}
              className="flex items-center gap-3 text-sm text-[#2E2E2E]"
            >
              <input
                id={field}
                type="checkbox"
                checked={pfData[field]}
                onChange={(event) =>
                  handleBooleanChange(field, event.target.checked)
                }
                className="h-4 w-4 accent-[#7A5BED]"
              />
              {label}
            </label>
          ))}
        </div>

        <div className="w-full max-w-[12rem]">
          <Label
            htmlFor="roundOff"
            className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
          >
            Round Off
          </Label>
          <div className="mt-2">
            <FormSelect
              id="roundOff"
              value={pfData.roundOff}
              onValueChange={(value) =>
                updatePfData((prev) => ({ ...prev, roundOff: value }))
              }
              options={roundOffOptions.map((option) => option.name)}
              placeholder="Select"
              disabled={isRoundOffLoading || isRoundOffError || roundOffOptions.length === 0}
            />
          </div>
          {isRoundOffError && (
            <p className="mt-2 text-sm text-[#B42318]" role="alert">
              Could not load salary round-off options. Please refresh and try again.
            </p>
          )}
          {!isRoundOffLoading && !isRoundOffError && roundOffOptions.length === 0 && (
            <p className="mt-2 text-sm text-[#B42318]" role="alert">
              No salary round-off options were returned.
            </p>
          )}
        </div>
      </Card>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:mt-6 sm:flex-row sm:gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => setPfDraft(pf ?? EMPTY_PF)}
          className="w-full rounded-xl border-[#EDEDED] px-5 py-2 text-sm font-medium text-[#2E2E2E] transition hover:bg-[#EDEDED] sm:w-auto"
        >
          Load Default Value
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !pfGroupId || !selectedRoundOff || isRoundOffLoading || isRoundOffError}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A5BED] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5932E9] disabled:opacity-60 sm:w-auto"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isSaving ? "Saving" : "Save"}
        </Button>
      </div>
    </div>
  );
}
