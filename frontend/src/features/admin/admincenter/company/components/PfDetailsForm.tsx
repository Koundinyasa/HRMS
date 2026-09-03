import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePfDetails } from "../hooks/usePfDetails";
import type { PfConfiguration } from "../types/company.types";
import { CalendarDays, Clock, Bookmark } from "lucide-react";

const EMPTY_PF: PfConfiguration = {
  effectiveFrom: "Feb/2026",
  epfPercentage: 0,
  cutoff: 0,
  pfOnPayDays: false,
  pensionFundPercentage: 0,
  employerEPFPercentage: 0,
  roundOff: "Nearest Amount",
  accountNo02Rate: 0,
  accountNo21Rate: 0,
  minimumChargesAccNo02: 0,
  restrictEmployerShare: true,
  restrictEmployerEmployeeWise: false,
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

export default function PfDetailsForm() {
  const { pf, isLoading, updatePf, isSaving } = usePfDetails();
  const [pfData, setPfData] = useState<PfConfiguration>(EMPTY_PF);

  useEffect(() => {
    if (pf) setPfData(pf);
  }, [pf]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { id, value } = e.target;
    setPfData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave() {
    try {
      await updatePf(pfData).unwrap();
    } catch (err) {
      console.error("Failed to save PF details", err);
    }
  }

  if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading PF details…</div>;

  return (
    <div>
      <Card>
        <CardContent className="space-y-8">
          {/* Effective From */}
          <div className="grid grid-cols-3 items-center rounded-xl bg-violet-100 px-5 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-white">
                <CalendarDays className="h-5 w-5 text-violet-600" />
              </div>
              <Label htmlFor="effectiveFrom" className="font-semibold">
                Effective From
              </Label>
            </div>

            <div className="flex justify-center">
              <select
                id="effectiveFrom"
                value={pfData.effectiveFrom}
                onChange={handleChange}
                className="h-9 w-40 rounded-md border bg-white px-3 text-sm"
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end">
              <Clock className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          {/* For Employee */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="font-semibold">For Employee</h3>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <Label htmlFor="epfPercentage">
                  EPF(A)-(%) <span className="text-red-500">*</span>
                </Label>
                <Input id="epfPercentage" value={pfData.epfPercentage} onChange={handleChange} placeholder="12" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="cutoff">
                  Cutoff <span className="text-red-500">*</span>
                </Label>
                <Input id="cutoff" value={pfData.cutoff} onChange={handleChange} placeholder="15000" className="mt-2" />
              </div>
              <div className="flex flex-col h-full">
               <Label className="text-sm text-gray-700 font-medium">
  Placeholder alignment
</Label>
                <div className="flex h-11 items-center gap-3 mt-2">
                  <Checkbox
                    checked={pfData.pfOnPayDays}
                    onCheckedChange={(checked) => setPfData((prev) => ({ ...prev, pfOnPayDays: checked === true }))}
                  />
                  <span>PF On Pay Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* For Employer */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <h3 className="font-semibold">For Employer</h3>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div>
                <Label htmlFor="pensionFundPercentage">
                  Pension Fund(B)-(%) <span className="text-red-500">*</span>
                </Label>
                <Input id="pensionFundPercentage" value={pfData.pensionFundPercentage} onChange={handleChange} placeholder="8.33" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="employerEPFPercentage">
                  EPF(A-B)-(%) <span className="text-red-500">*</span>
                </Label>
                <Input id="employerEPFPercentage" value={pfData.employerEPFPercentage} onChange={handleChange} placeholder="3.67" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="roundOff">
                  Round Off <span className="text-red-500">*</span>
                </Label>
                <select id="roundOff" value={pfData.roundOff} onChange={handleChange} className="mt-2 h-8 w-full rounded-md border px-3">
                  <option value="Nearest Amount">Nearest Amount</option>
                  <option value="Higher Amount">Higher Amount</option>
                  <option value="Lower Amount">Lower Amount</option>
                </select>
              </div>
              <div>
                <Label htmlFor="accountNo02Rate">
                  Account No. 02(%) <span className="text-red-500">*</span>
                </Label>
                <Input id="accountNo02Rate" value={pfData.accountNo02Rate} onChange={handleChange} placeholder="0.50" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="accountNo21Rate">
                  Account No. 21(%) <span className="text-red-500">*</span>
                </Label>
                <Input id="accountNo21Rate" value={pfData.accountNo21Rate} onChange={handleChange} placeholder="0.50" className="mt-2" />
              </div>
              <div>
                <Label htmlFor="minimumChargesAccNo02">
                  Minimum Charges For ACC.No.2 <span className="text-red-500">*</span>
                </Label>
                <Input id="minimumChargesAccNo02" value={pfData.minimumChargesAccNo02} onChange={handleChange} placeholder="500" className="mt-2" />
              </div>
            </div>
          </div>

          {/* Restrict Employer Share — mutually exclusive, side by side */}
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="restrictEmployerShareMode"
                checked={pfData.restrictEmployerShare}
                onChange={() =>
                  setPfData((prev) => ({
                    ...prev,
                    restrictEmployerShare: true,
                    restrictEmployerEmployeeWise: false,
                  }))
                }
                className="h-4 w-4 text-violet-600 focus:ring-violet-500"
              />
              <span>Restrict Employer Share</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="restrictEmployerShareMode"
                checked={pfData.restrictEmployerEmployeeWise}
                onChange={() =>
                  setPfData((prev) => ({
                    ...prev,
                    restrictEmployerShare: false,
                    restrictEmployerEmployeeWise: true,
                  }))
                }
                className="h-4 w-4 text-violet-600 focus:ring-violet-500"
              />
              <span>Restrict Employer Share Employee Wise</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Footer Buttons — outside the card */}
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" type="button">
          Load Default Value
        </Button>
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Bookmark className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}