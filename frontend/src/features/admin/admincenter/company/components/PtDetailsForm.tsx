import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { usePtDetails } from "../hooks/usePtDetails";
import { useToast, Toast } from "./common/Toast";
import { Loader2 } from "lucide-react";
import { FormSelect } from "./common/FormSelect";
import { EffectiveFromBar } from "./common/EffectiveFromBar";

type LocalSlab = {
  slabId?: number;
  groupId?: number;
  isActive?: boolean;
  fromSalary: string;
  toSalary: string;
  ptAmount: string;
};

/** Effective dates arrive as "DD-MM-YYYY"; newest first. */
function toSortableDate(value: string): number {
  const [day, month, year] = value.split("-");
  return Number(year) * 10000 + Number(month) * 100 + Number(day);
}

function compareEffectiveFromDescending(a: string, b: string): number {
  return toSortableDate(b) - toSortableDate(a);
}

/** "DD-MM-YYYY" → "YYYY-MM-DD" for EffectiveFromBar */
function displayToIso(display: string): string {
  if (!display) return "";
  // Already ISO
  if (/^\d{4}-\d{2}-\d{2}$/.test(display.trim())) return display.trim();
  const m = /^(\d{2})-(\d{2})-(\d{4})$/.exec(display.trim());
  if (!m) return "";
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/** "YYYY-MM-DD" → "DD-MM-YYYY" (PT internal / display format) */
function isoToDisplay(iso: string): string {
  if (!iso) return "";
  // Already DD-MM-YYYY
  if (/^\d{2}-\d{2}-\d{4}$/.test(iso.trim())) return iso.trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return "";
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function toLocalSlab(
  item: NonNullable<ReturnType<typeof usePtDetails>["ptSlabs"]>[number],
): LocalSlab {
  return {
    slabId: item.slabId,
    groupId: item.groupId,
    isActive: item.isActive,
    fromSalary: String(item.fromSalary),
    toSalary: String(item.toSalary),
    ptAmount: String(item.ptAmount),
  };
}

export default function PtDetailsForm() {
  const {
    ptSlabs,
    isLoading,
    updatePt,
    isSaving,
    refetch,
    periodTypeOptions,
  } = usePtDetails();
  const [effectiveFromSelection, setEffectiveFromSelection] = useState<
    string | null
  >(null);
  const [periodSelection, setPeriodSelection] = useState<string | null>(null);
  const [slabDraft, setSlabDraft] = useState<LocalSlab[] | null>(null);
  const { toast, showToast } = useToast();

  const effectiveFromOptions = [
    ...new Set((ptSlabs ?? []).map((item) => item.effectiveFrom)),
  ].sort(compareEffectiveFromDescending);
  const effectiveFrom =
    effectiveFromSelection ?? effectiveFromOptions[0] ?? "";
  const selectedDateSlabs = (ptSlabs ?? []).filter(
    (slab) => slab.effectiveFrom === effectiveFrom,
  );
  const period = periodSelection ?? selectedDateSlabs[0]?.period ?? "";
  const defaultSlabs = selectedDateSlabs
    .filter((item) => item.period === period)
    .map(toLocalSlab);
  const slabs = slabDraft ?? defaultSlabs;

  // Period dropdown: prefer master list from salary-round-off API (periodType),
  // always include periods that exist on current slabs so selection stays valid.
  const periodNamesFromApi = periodTypeOptions.map((o) => o.name.trim()).filter(Boolean);
  const periodNamesFromSlabs = [
    ...new Set(
      selectedDateSlabs
        .map((slab) => slab.period.trim())
        .filter((value) => value !== ""),
    ),
  ];
  const selectedPeriodOptions = [
    ...new Set([...periodNamesFromApi, ...periodNamesFromSlabs]),
  ];

  const canSafelyUpdate =
    slabs.length > 0 &&
    slabs.every(
      (slab) => Number.isInteger(slab.slabId) && (slab.slabId ?? 0) > 0,
    );

  function handleEffectiveFromChange(value: string) {
    // value is DD-MM-YYYY from isoToDisplay
    setEffectiveFromSelection(value);
    setPeriodSelection(null);
    setSlabDraft(null);
  }

  function handlePeriodChange(value: string) {
    setPeriodSelection(value);
    setSlabDraft(null);
  }

  function handleLoadDefault() {
    setSlabDraft(null);
  }

  function handleSlabChange(
    index: number,
    field: keyof LocalSlab,
    value: string,
  ) {
    setSlabDraft((previous) =>
      (previous ?? defaultSlabs).map((row, i) =>
        i === index ? { ...row, [field]: value } : row,
      ),
    );
  }

  async function handleSave() {
    if (!effectiveFrom.trim()) {
      showToast("Effective From is required.", "error");
      return;
    }
    if (!period.trim()) {
      showToast("Select a period.", "error");
      return;
    }
    if (!canSafelyUpdate) {
      showToast(
        "Cannot save PT slabs: each slab must have a unique ID from the server.",
        "error",
      );
      return;
    }
    if (
      slabs.some((slab) =>
        [slab.fromSalary, slab.toSalary, slab.ptAmount].some(
          (value) => value.trim() === "" || !Number.isFinite(Number(value)),
        ),
      )
    ) {
      showToast("Enter valid values for every PT slab.", "error");
      return;
    }

    const ids = slabs.map((s) => s.slabId).filter((id) => id != null) as number[];
    if (ids.length > 1 && new Set(ids).size < ids.length) {
      showToast(
        "Slabs share the same ID from the server. Only one row can be updated.",
        "error",
      );
      return;
    }

    const payload = {
      slabs: slabs.map((item) => ({
        slabId: item.slabId,
        groupId: item.groupId,
        isActive: item.isActive ?? true,
        effectiveFrom,
        period,
        fromSalary: Number(item.fromSalary),
        toSalary: Number(item.toSalary),
        ptAmount: Number(item.ptAmount),
      })),
    };

    try {
      await updatePt(payload).unwrap();
      setSlabDraft(null);
      setEffectiveFromSelection(null);
      setPeriodSelection(null);
      await refetch();
      showToast("PT details saved successfully");
    } catch (error) {
      console.error("Failed to save PT Details", error);
      const data = (error as {
        data?: string | { message?: string | string[]; error?: string };
      })?.data;
      const apiMessage =
        typeof data === "string"
          ? data
          : Array.isArray(data?.message)
            ? data.message.join(", ")
            : data?.message ?? data?.error;
      showToast(
        apiMessage ?? "Failed to save PT details. Please try again.",
        "error",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">
        Loading PT Details...
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      <Card
        data-company-module-card
        className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white shadow-sm"
      >
        <CardContent className="space-y-6 p-4 sm:space-y-8 sm:p-6">
          <EffectiveFromBar
            id="pt-effective-from"
            value={displayToIso(effectiveFrom)}
            onChange={(iso) => handleEffectiveFromChange(isoToDisplay(iso))}
          />

          <div className="space-y-2">
            <Label className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Period <span className="text-[#DD3232]">*</span>
            </Label>
            <div className="w-full max-w-full sm:w-72">
              <FormSelect
                id="pt-period"
                value={period}
                onValueChange={handlePeriodChange}
                options={selectedPeriodOptions}
                placeholder="Select period"
              />
            </div>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-4 sm:mb-5">
              <h3 className="whitespace-nowrap text-base font-semibold text-black">
                Slab Rates
              </h3>
              <div className="h-px flex-1 bg-[#DDDDDD]" />
            </div>

            <div className="-mx-1 overflow-x-auto sm:mx-0">
              <div className="min-w-[480px] sm:min-w-0">
                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#DDDDDD] px-3 py-3 text-xs font-semibold text-[#2E2E2E] sm:gap-4 sm:px-4 sm:text-sm">
                  <div>From Salary</div>
                  <div>To Salary</div>
                  <div>PT Amount</div>
                </div>

                <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                  {slabs.map((slab, index) => (
                    <div
                      key={`pt-slab-${slab.slabId ?? index}-${index}`}
                      className="grid grid-cols-3 items-center gap-2 sm:gap-4"
                    >
                      <Input
                        value={slab.fromSalary}
                        onChange={(e) =>
                          handleSlabChange(index, "fromSalary", e.target.value)
                        }
                        placeholder="0"
                        className="h-10 w-full rounded-xl border-[#DDDDDD] text-sm sm:h-11"
                      />
                      <Input
                        value={slab.toSalary}
                        onChange={(e) =>
                          handleSlabChange(index, "toSalary", e.target.value)
                        }
                        placeholder="0"
                        className="h-10 w-full rounded-xl border-[#DDDDDD] text-sm sm:h-11"
                      />
                      <Input
                        value={slab.ptAmount}
                        onChange={(e) =>
                          handleSlabChange(index, "ptAmount", e.target.value)
                        }
                        placeholder="0"
                        className="h-10 w-full rounded-xl border-[#DDDDDD] text-sm sm:h-11"
                      />
                    </div>
                  ))}
                  {slabs.length === 0 && (
                    <p className="py-4 text-sm text-[#626262]">
                      No PT slabs were returned for this date and period.
                    </p>
                  )}
                </div>
              </div>
            </div>
            {slabs.length > 0 && !canSafelyUpdate && (
              <p className="mt-4 text-sm text-[#B42318]" role="alert">
                Saving requires a unique ID for every slab from the server.
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse items-stretch justify-end gap-3 border-t border-[#EDEDED] pt-4 sm:flex-row sm:items-center sm:gap-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleLoadDefault}
              disabled={selectedDateSlabs.length === 0}
              className="h-10 w-full rounded-xl border border-[#DDDDDD] px-6 font-medium text-[#2E2E2E] hover:bg-[#F6F3FF] sm:h-11 sm:w-auto"
            >
              Load Default Value
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !canSafelyUpdate}
              className="h-10 w-full rounded-xl bg-[#7A5BED] px-8 font-medium text-white hover:bg-[#5932E9] disabled:opacity-50 sm:h-11 sm:w-auto"
            >
              {isSaving && (
                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
              )}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}