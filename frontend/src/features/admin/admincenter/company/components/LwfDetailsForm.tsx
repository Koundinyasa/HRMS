import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLwfDetails, monthsToArray, arrayToMonths } from "../hooks/useLwfDetails";
import { Clock, Bookmark } from "lucide-react";

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Generates month/year options, e.g. last 12 months through next 12 months
function generateMonthYearOptions(): string[] {
  const shortMonths = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const now = new Date();
  const options: string[] = [];
  for (let i = -12; i <= 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    options.push(`${shortMonths[d.getMonth()]}/${d.getFullYear()}`);
  }
  return options;
}

const MONTH_YEAR_OPTIONS = generateMonthYearOptions();

export default function LwfDetailsForm() {
  const { lwf, isLoading, updateLwf, isSaving } = useLwfDetails();

  const [effectiveFrom, setEffectiveFrom] = useState("Jun/2026");
  const [cutoffAmount, setCutoffAmount] = useState(0);
  const [employeeContribution, setEmployeeContribution] = useState(0);
  const [employerContribution, setEmployerContribution] = useState(0);
  const [deductionMonths, setDeductionMonths] = useState<string[]>([]);

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
    if (!lwf) return;

    const payload = {
      ...lwf,
      ...arrayToMonths(
        { effectiveFrom, cutoffAmount, employeeContribution, employerContribution },
        deductionMonths
      ),
    };

    try {
      await updateLwf(payload).unwrap();
    } catch (err) {
      console.error("Failed to save LWF details", err);
    }
  }

  if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading LWF details…</div>;

  const firstColumnMonths = ALL_MONTHS.slice(0, 6); // January - June
  const secondColumnMonths = ALL_MONTHS.slice(6);   // July - December

  return (
    <div>
      <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
        {/* Effective From */}
        <div className="flex items-center gap-4 bg-violet-100 rounded-xl px-4 py-3 mb-6">
          <Label htmlFor="effectiveFrom" className="text-base font-medium">
            Effective From
          </Label>
          <select
            id="effectiveFrom"
            value={effectiveFrom}
            onChange={(e) => setEffectiveFrom(e.target.value)}
            className="h-9 w-32 bg-white border rounded-md px-3 text-sm"
          >
            {MONTH_YEAR_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <Clock className="h-5 w-5 text-gray-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side */}
          <div className="space-y-5">
            <div>
              <Label htmlFor="cutoffAmount">Cut Off (Amount)</Label>
              <Input
                id="cutoffAmount"
                value={cutoffAmount}
                onChange={(e) => setCutoffAmount(Number(e.target.value))}
                className="mt-2 h-11"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="employeeContribution">Employee Contribution (Amount)</Label>
              <Input
                id="employeeContribution"
                value={employeeContribution}
                onChange={(e) => setEmployeeContribution(Number(e.target.value))}
                className="mt-2 h-11"
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="employerContribution">Employer Contribution (Amount)</Label>
              <Input
                id="employerContribution"
                value={employerContribution}
                onChange={(e) => setEmployerContribution(Number(e.target.value))}
                className="mt-2 h-11"
                placeholder="0"
              />
            </div>
          </div>

          {/* Right Side — Deduction Months, ordered Jan-Jun / Jul-Dec */}
          <div className="border rounded-xl p-4">
            <h3 className="font-semibold mb-4">Deduction Months</h3>
            <div className="grid grid-cols-2 gap-x-8">
              <div className="space-y-4">
                {firstColumnMonths.map((month) => (
                  <label key={month} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={deductionMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                    />
                    {month}
                  </label>
                ))}
              </div>
              <div className="space-y-4">
                {secondColumnMonths.map((month) => (
                  <label key={month} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={deductionMonths.includes(month)}
                      onChange={() => handleMonthChange(month)}
                    />
                    {month}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Buttons — outside the card */}
      <div className="flex justify-end gap-4 mt-6">
        <button type="button" className="px-5 py-2 border rounded-lg bg-white hover:bg-gray-100">
          Load Default Value
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-60"
          onClick={handleSave}
          disabled={isSaving}
        >
          <Bookmark className="h-4 w-4" />
          {isSaving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}