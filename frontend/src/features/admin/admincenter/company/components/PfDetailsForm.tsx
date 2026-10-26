import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePfDetails } from "../hooks/usePfDetails";
import { useToast, Toast } from "./common/Toast";
import type { PfConfiguration } from "../types/company.types";
import { Bookmark, Loader2 } from "lucide-react";
import { EffectiveFromBar } from "./common/EffectiveFromBar";
import { FormSelect } from "./common/FormSelect";

const EMPTY_PF: PfConfiguration = {
  effectiveFrom: "",
  epfPercentage: 12,
  cutoff: 15000,
  pfOnPayDays: false,
  pensionFundPercentage: 8.33,
  employerEPFPercentage: 3.67,
  roundOff: "Nearest Amount",
  accountNo02Rate: 0.5,
  accountNo21Rate: 0.5,
  minimumChargesAccNo02: 0,
  restrictEmployerShare: false,
  restrictEmployerEmployeeWise: false,
};

export default function PtDetailsForm() {
  const { ptSlabs, isLoading, updatePt, isSaving, refetch } = usePtDetails();
  const [effectiveFrom, setEffectiveFrom] = useState("");
  const [period, setPeriod] = useState("Monthly");
  const [slabs, setSlabs] = useState<LocalSlab[]>([
    { fromSalary: "0", toSalary: "15000", ptAmount: "0" },
    { fromSalary: "15001", toSalary: "20000", ptAmount: "150" },
    { fromSalary: "20001", toSalary: "999999999", ptAmount: "200" },
  ]);
  const [previousSlabs, setPreviousSlabs] = useState<typeof ptSlabs>();

  if (ptSlabs && ptSlabs.length > 0 && ptSlabs !== previousSlabs) {
      setPreviousSlabs(ptSlabs);
      setEffectiveFrom(ptSlabs[0].effectiveFrom);
      setPeriod(ptSlabs[0].period);
      setSlabs(
        ptSlabs.map((item) => ({
          fromSalary: String(item.fromSalary),
          toSalary: String(item.toSalary),
          ptAmount: String(item.ptAmount),
        }))
      );
  }

  function handleSlabChange(index: number, field: keyof LocalSlab, value: string) {
    setSlabs((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  }

  function addRow() {
    setSlabs((prev) => [...prev, { fromSalary: "", toSalary: "", ptAmount: "" }]);
  }

export default function PfDetailsForm() {
  const { pf, isLoading, updatePf, isSaving, refetch } = usePfDetails();
  const [pfData, setPfData] = useState<PfConfiguration>(EMPTY_PF);
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (pf) setPfData(pf);
  }, [pf]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value, type, checked } = e.target;
    setPfData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  }

  function handleNumberChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setPfData((prev) => ({
      ...prev,
      [id]: value === "" ? 0 : Number(value),
    }));
  }

  async function handleSave() {
    try {
      await updatePf(pfData).unwrap();
      await refetch();
      showToast("PF details saved successfully");
    } catch (err) {
      console.error("Failed to save PF details", err);
      showToast("Failed to save PF details. Please try again.", "error");
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">Loading PF details…</div>
    );
  }

  return (
    <div className="w-full min-w-0 font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      <Card data-company-module-card className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white shadow-sm">
        <CardContent className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          <div className="rounded-2xl bg-[#ECE7FF] px-3 sm:px-4 py-3">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-white shrink-0">
                <CalendarDays className="h-5 w-5 text-[#7A5BED]" />
              </div>
              <Label className="text-sm font-semibold whitespace-nowrap">Effective From</Label>
              <div className="w-full max-w-[160px] sm:w-36">
                <MonthPicker
                  value={effectiveFrom}
                  onChange={(value) => setEffectiveFrom(value)}
                  className="h-9"
                />
              </div>
              <Clock3 className="h-5 w-5 text-[#2E2E2E] hidden sm:block shrink-0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">
              Period <span className="text-[#DD3232]">*</span>
            </Label>
            <div className="w-full sm:w-72 max-w-full">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  alignItemWithTrigger={false}
                >
                  <SelectItem value="Monthly">Monthly</SelectItem>
                  <SelectItem value="Quarterly">Quarterly</SelectItem>
                  <SelectItem value="Half Yearly">Half Yearly</SelectItem>
                  <SelectItem value="Yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="epfPercentage" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              EPF (A) (%)
            </Label>
            <Input
              id="epfPercentage"
              type="number"
              step="0.01"
              placeholder="12"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.epfPercentage}
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <Label htmlFor="cutoff" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Cutoff (Amount)
            </Label>
            <Input
              id="cutoff"
              type="number"
              placeholder="15000"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.cutoff}
              onChange={handleNumberChange}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="pensionFundPercentage" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Pension Fund (B) (%)
            </Label>
            <Input
              id="pensionFundPercentage"
              type="number"
              step="0.01"
              placeholder="8.33"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.pensionFundPercentage}
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <Label htmlFor="employerEPFPercentage" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Employer EPF (A-B) (%)
            </Label>
            <Input
              id="employerEPFPercentage"
              type="number"
              step="0.01"
              placeholder="3.67"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.employerEPFPercentage}
              onChange={handleNumberChange}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="accountNo02Rate" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Account No. 02 (%)
            </Label>
            <Input
              id="accountNo02Rate"
              type="number"
              step="0.01"
              placeholder="0.5"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.accountNo02Rate}
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <Label htmlFor="accountNo21Rate" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Account No. 21 (%)
            </Label>
            <Input
              id="accountNo21Rate"
              type="number"
              step="0.01"
              placeholder="0.5"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.accountNo21Rate}
              onChange={handleNumberChange}
            />
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="minimumChargesAccNo02" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Minimum Charges For Acc. No. 2
            </Label>
            <Input
              id="minimumChargesAccNo02"
              type="number"
              placeholder="0"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={pfData.minimumChargesAccNo02}
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <Label htmlFor="roundOff" className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Round Off
            </Label>
            <div className="mt-2 w-full max-w-full">
              <FormSelect
                id="roundOff"
                value={pfData.roundOff}
                onValueChange={(value) =>
                  setPfData((prev) => ({ ...prev, roundOff: value }))
                }
                options={ROUND_OFF_OPTIONS}
                placeholder="Select"
              />
            </div>
          </div>
        </div>

        <div className="mb-2 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="flex cursor-pointer items-center gap-3">
            <input
              id="pfOnPayDays"
              type="checkbox"
              checked={pfData.pfOnPayDays}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#EDEDED] text-[#7A5BED] focus:ring-[#7A5BED]"
            />
            <span className="text-[13px] font-medium text-[#2E2E2E]">PF On Pay Days</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              id="restrictEmployerShare"
              type="checkbox"
              checked={pfData.restrictEmployerShare}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#EDEDED] text-[#7A5BED] focus:ring-[#7A5BED]"
            />
            <span className="text-[13px] font-medium text-[#2E2E2E]">Restrict Employer Share</span>
          </label>

          <label className="flex cursor-pointer items-center gap-3">
            <input
              id="restrictEmployerEmployeeWise"
              type="checkbox"
              checked={pfData.restrictEmployerEmployeeWise}
              onChange={handleChange}
              className="h-4 w-4 rounded border-[#EDEDED] text-[#7A5BED] focus:ring-[#7A5BED]"
            />
            <span className="text-[13px] font-medium text-[#2E2E2E]">
              Restrict Employer Share Employee-Wise
            </span>
          </label>
        </div>
      </Card>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:mt-6 sm:flex-row sm:gap-4">
        <button
          type="button"
          className="w-full rounded-xl border border-[#EDEDED] bg-white px-5 py-2 text-sm font-medium text-[#2E2E2E] transition hover:bg-[#EDEDED] sm:w-auto"
          onClick={() => setPfData(EMPTY_PF)}
        >
          Load Default Value
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A5BED] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5932E9] disabled:opacity-60 sm:w-auto"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
          {isSaving ? "Saving" : "Save"}
        </button>
      </div>
    </div>
  );
}