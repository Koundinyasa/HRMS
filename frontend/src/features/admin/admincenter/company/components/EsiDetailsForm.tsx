import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEsiDetails } from "../hooks/useEsiDetails";
import { useToast, Toast } from "./common/Toast";
import type { EsiConfiguration } from "../types/company.types";
import { Bookmark, Loader2 } from "lucide-react";
import { EffectiveFromBar } from "./common/EffectiveFromBar";
import { FormSelect } from "./common/FormSelect";

const EMPTY_ESI: EsiConfiguration = {
  effectiveFrom: "",
  cutOffAmount: 0,
  employeeRate: 0,
  employerRate: 0,
  minimumDailyWage: 0,
  roundOff: "",
};

export default function EsiDetailsForm() {
  const {
    esi,
    roundOffOptions,
    isRoundOffLoading,
    isRoundOffError,
    isLoading,
    updateEsi,
    isSaving,
    refetch,
  } = useEsiDetails();
  const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);
  const selectedRoundOff = roundOffOptions.find(
    (option) => option.name === esiData.roundOff,
  );
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (esi) setEsiData(esi);
  }, [esi]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setEsiData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave() {
    if (!selectedRoundOff) {
      showToast("Select a valid salary round-off option before saving.", "error");
      return;
    }

    try {
      await updateEsi({
        configuration: esiData,
        roundOffTypeId: selectedRoundOff.id,
      }).unwrap();
      await refetch();
      showToast("ESI details saved successfully");
    } catch (err) {
      console.error("Failed to save ESI details", err);
      showToast("Failed to save ESI details. Please try again.", "error");
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">Loading ESI details…</div>
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
          value={esiData.effectiveFrom}
          onChange={(value) =>
            setEsiData((prev) => ({ ...prev, effectiveFrom: value }))
          }
        />

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="cutOffAmount"
              className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
            >
              Cut Off (Amount)
            </Label>
            <Input
              id="cutOffAmount"
              placeholder="21000"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.cutOffAmount}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label
              htmlFor="employeeRate"
              className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
            >
              Employee Rate (%)
            </Label>
            <Input
              id="employeeRate"
              placeholder="0.75"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.employeeRate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <Label
              htmlFor="employerRate"
              className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
            >
              Employer Rate (%)
            </Label>
            <Input
              id="employerRate"
              placeholder="3.25"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.employerRate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label
              htmlFor="minimumDailyWage"
              className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
            >
              Minimum Daily Wage (Amount)
            </Label>
            <Input
              id="minimumDailyWage"
              placeholder="137"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={esiData.minimumDailyWage}
              onChange={handleChange}
            />
          </div>
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
              value={esiData.roundOff}
              onValueChange={(value) =>
                setEsiData((prev) => ({ ...prev, roundOff: value }))
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
        <button
          type="button"
          onClick={() => setEsiData(esi ?? EMPTY_ESI)}
          className="w-full rounded-xl border border-[#EDEDED] bg-white px-5 py-2 text-sm font-medium text-[#2E2E2E] transition hover:bg-[#EDEDED] sm:w-auto"
        >
          Load Default Value
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A5BED] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5932E9] disabled:opacity-60 sm:w-auto"
          onClick={handleSave}
          disabled={isSaving || !selectedRoundOff || isRoundOffLoading || isRoundOffError}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isSaving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}