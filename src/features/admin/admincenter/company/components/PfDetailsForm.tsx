import { useState } from "react";
import { CalendarDays, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MonthPicker } from "@/components/ui/monthpicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toast, useToast } from "./common/Toast";
import { usePfDetails } from "../hooks/usePfDetails";
import type { PfConfiguration } from "../types/company.types";

const DEFAULT_CONFIGURATION: PfConfiguration = {
  effectiveFrom: "",
  epfPercentage: 12,
  cutoff: 15000,
  pfOnPayDays: false,
  pensionFundPercentage: 8.33,
  employerEPFPercentage: 3.67,
  roundOff: "Nearest Amount",
  accountNo02Rate: 0.5,
  accountNo21Rate: 0.5,
  minimumChargesAccNo02: 75,
  restrictEmployerShare: false,
  restrictEmployerEmployeeWise: false,
};

const NUMBER_FIELDS: {
  key: keyof PfConfiguration;
  label: string;
  step?: string;
}[] = [
  { key: "epfPercentage", label: "EPF (A) (%)", step: "0.01" },
  { key: "cutoff", label: "Wage Ceiling / Cutoff", step: "1" },
  {
    key: "pensionFundPercentage",
    label: "Pension Fund (B) (%)",
    step: "0.01",
  },
  {
    key: "employerEPFPercentage",
    label: "Employer EPF (A-B) (%)",
    step: "0.01",
  },
  { key: "accountNo02Rate", label: "Account No. 02 (%)", step: "0.01" },
  { key: "accountNo21Rate", label: "Account No. 21 (%)", step: "0.01" },
  {
    key: "minimumChargesAccNo02",
    label: "Minimum Charges for Account No. 02",
    step: "1",
  },
];

export default function PfDetailsForm() {
  const { pf, isLoading, isError, updatePf, isSaving, refetch } =
    usePfDetails();
  const { toast, showToast } = useToast();
  const [editedConfiguration, setEditedConfiguration] =
    useState<PfConfiguration | null>(null);
  const configuration =
    editedConfiguration ?? pf ?? DEFAULT_CONFIGURATION;

  const updateField = <K extends keyof PfConfiguration>(
    field: K,
    value: PfConfiguration[K],
  ) => {
    setEditedConfiguration((previous) => ({
      ...(previous ?? pf ?? DEFAULT_CONFIGURATION),
      [field]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await updatePf(configuration).unwrap();
      await refetch();
      showToast("PF details saved successfully");
    } catch (error) {
      console.error("Failed to save PF details", error);
      showToast("Failed to save PF details. Please try again.", "error");
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading PF details...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-sm text-red-600 sm:p-6">
        Could not load PF details. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
      <Toast toast={toast} />
      <Card
        data-company-module-card
        className="w-full min-w-0 rounded-2xl border border-gray-200 bg-white shadow-sm"
      >
        <CardContent className="space-y-6 p-4 sm:p-6">
          <div className="rounded-2xl bg-violet-100 px-3 py-3 sm:px-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white">
                <CalendarDays className="h-5 w-5 text-violet-600" />
              </span>
              <Label htmlFor="pf-effective-from" className="font-semibold">
                Effective From
              </Label>
              <div id="pf-effective-from" className="w-full max-w-[160px]">
                <MonthPicker
                  value={configuration.effectiveFrom}
                  onChange={(value) => updateField("effectiveFrom", value)}
                  className="h-9"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NUMBER_FIELDS.map(({ key, label, step }) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={`pf-${key}`}>{label}</Label>
                <Input
                  id={`pf-${key}`}
                  type="number"
                  min="0"
                  step={step}
                  value={configuration[key] as number}
                  onChange={(event) =>
                    updateField(key, Number(event.target.value))
                  }
                  className="h-11 rounded-xl"
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Round Off</Label>
              <Select
                value={configuration.roundOff}
                onValueChange={(value) =>
                  updateField("roundOff", value ?? "Nearest Amount")
                }
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue placeholder="Select rounding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nearest Amount">Nearest Amount</SelectItem>
                  <SelectItem value="Higher Amount">Higher Amount</SelectItem>
                  <SelectItem value="Lower Amount">Lower Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-5 sm:grid-cols-2">
            {(
              [
                ["pfOnPayDays", "Calculate PF on pay days"],
                ["restrictEmployerShare", "Restrict employer share"],
                [
                  "restrictEmployerEmployeeWise",
                  "Restrict employer share employee-wise",
                ],
              ] as const
            ).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center gap-3 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={configuration[key]}
                  onChange={(event) => updateField(key, event.target.checked)}
                  className="h-4 w-4 accent-violet-600"
                />
                {label}
              </label>
            ))}
          </div>

          <div className="flex justify-end border-t border-gray-200 pt-5">
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="h-11 w-full rounded-xl bg-violet-600 px-8 text-white hover:bg-violet-700 disabled:opacity-50 sm:w-auto"
            >
              {isSaving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSaving ? "Saving..." : "Save PF Details"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}