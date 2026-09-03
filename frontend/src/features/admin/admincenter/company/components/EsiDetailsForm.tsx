import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEsiDetails } from "../hooks/useEsiDetails";
import type { EsiConfiguration } from "../types/company.types";
import { CalendarDays, Clock, Bookmark } from "lucide-react";

const EMPTY_ESI: EsiConfiguration = {
  effectiveFrom: "Feb/2026",
  cutOffAmount: 0,
  employeeRate: 0,
  employerRate: 0,
  minimumDailyWage: 0,
  roundOff: "Higher Amount",
};

// Generates month/year options, e.g. last 12 months through next 12 months
function generateMonthOptions(): string[] {
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date();
  const options: string[] = [];
  for (let i = -12; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push(`${months[d.getMonth()]}/${d.getFullYear()}`);
  }
  return options;
}

const MONTH_OPTIONS = generateMonthOptions();

export default function EsiDetailsForm() {
  const { esi, isLoading, updateEsi, isSaving } = useEsiDetails();
  const [esiData, setEsiData] = useState<EsiConfiguration>(EMPTY_ESI);

  useEffect(() => {
    if (esi) setEsiData(esi);
  }, [esi]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setEsiData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave() {
    try {
      await updateEsi(esiData).unwrap();
    } catch (err) {
      console.error("Failed to save ESI details", err);
    }
  }

  if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading ESI details…</div>;

  return (
    <div>
      <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Effective From */}
        <div className="grid grid-cols-3 items-center bg-violet-100 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-violet-600" />
            </div>
            <Label htmlFor="effectiveFrom" className="font-medium">
              Effective From
            </Label>
          </div>

          <div className="flex justify-center">
            <select
              id="effectiveFrom"
              value={esiData.effectiveFrom}
              onChange={handleChange}
              className="h-9 w-40 bg-white border rounded-md px-3 text-sm"
            >
              {MONTH_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <Clock className="w-5 h-5 text-gray-500" />
          </div>
        </div>

        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="cutOffAmount">Cut Off(Amount)</Label>
            <Input
              id="cutOffAmount"
              placeholder="21000"
              className="mt-2 h-11"
              value={esiData.cutOffAmount}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="employeeRate">Employee Rate(%)</Label>
            <Input
              id="employeeRate"
              placeholder="0.75"
              className="mt-2 h-11"
              value={esiData.employeeRate}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label htmlFor="employerRate">Employer Rate(%)</Label>
            <Input
              id="employerRate"
              placeholder="3.25"
              className="mt-2 h-11"
              value={esiData.employerRate}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="minimumDailyWage">Minimum Daily Wage (Amount)</Label>
            <Input
              id="minimumDailyWage"
              placeholder="137"
              className="mt-2 h-11"
              value={esiData.minimumDailyWage}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Round Off */}
        <div className="inline-block">
          <Label htmlFor="roundOff">Round Off</Label>
          <select
            id="roundOff"
            value={esiData.roundOff}
            onChange={handleChange}
            className="mt-2 h-11 w-44 border rounded-md px-3"
          >
            <option value="Higher Amount">Higher Amount</option>
            <option value="Lower Amount">Lower Amount</option>
            <option value="Nearest Amount">Nearest Amount</option>
          </select>
        </div>
      </Card>

      {/* Buttons — outside the card, on the page background */}
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-100">
          Load Default Value
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Bookmark className="w-4 h-4" />
          {isSaving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}