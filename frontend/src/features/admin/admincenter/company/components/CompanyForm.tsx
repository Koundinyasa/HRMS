

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCompany } from "../hooks/useCompany";
import { useToast, Toast } from "./common/Toast";
import type { CompanyDetails } from "../types/company.types";
import { Switch } from "@/components/ui/switch";
import { DatePicker, type DatePickerCell } from "@/components/ui/datepicker";

import { MapPinned, Info, Upload, Bookmark, Loader2 } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function isoToDisplay(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return "";
  return `${d}-${m}-${y}`;
}

function displayToIso(display: string): string | null {
  const match = display.trim().match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const daysInMonth = new Date(Number(yyyy), month, 0).getDate();
  if (month < 1 || month > 12 || day < 1 || day > daysInMonth) return null;
  return `${yyyy}-${pad2(month)}-${pad2(day)}`;
}

function getDateCells(year: number, month: number, selectedIso: string): DatePickerCell[] {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells: DatePickerCell[] = [];

  for (let i = startWeekday - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const d = new Date(year, month - 1, day);
    const iso = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    cells.push({ iso, day, inMonth: false, disabled: false, selected: false });
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const iso = `${year}-${pad2(month + 1)}-${pad2(day)}`;
    cells.push({ iso, day, inMonth: true, disabled: false, selected: iso === selectedIso });
  }
  const remaining = 42 - cells.length;
  for (let day = 1; day <= remaining; day++) {
    const d = new Date(year, month + 1, day);
    const iso = `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
    cells.push({ iso, day, inMonth: false, disabled: false, selected: false });
  }
  return cells;
}

const CompanyInformationIcon = ({
  color = "#7A5BED",
  size = 20,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="10" y="3" width="8" height="18" rx="0.5" />
    <rect x="3" y="9" width="7" height="12" rx="0.5" />
    <rect x="12.5" y="6" width="1.5" height="1.5" />
    <rect x="16" y="6" width="1.5" height="1.5" />
    <rect x="12.5" y="10" width="1.5" height="1.5" />
    <rect x="16" y="10" width="1.5" height="1.5" />
    <rect x="12.5" y="14" width="1.5" height="1.5" />
    <rect x="16" y="14" width="1.5" height="1.5" />
    <rect x="5.5" y="13" width="1.8" height="1.8" />
  </svg>
);

const ApplicableIcon = ({
  color = "#7A5BED",
  size = 18,
}: {
  color?: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="5" width="16" height="9" rx="1" />
    <line x1="4" y1="16" x2="20" y2="16" />
    <line x1="4" y1="19" x2="15" y2="19" />
  </svg>
);

const EMPTY_COMPANY: CompanyDetails = {
  companyName: "",
  dateOfEstablishment: "",
  cin_LPIN: "",
  tan: "",
  website: "",
  address1: "",
  address2: "",
  address3: "",
  contactMobile: "",
  contactMobile2: "",
  companyCode: "",
  isPFApplicable: true,
  isESIApplicable: true,
  isPTApplicable: true,
  isTDSApplicable: true,
  tdsFilingMarToFeb: false,
  isLWFAvailable: true,
  companyLogoPath: "",
};

export default function CompanyForm() {
  const { company, isLoading, updateCompany, isSaving, refetch } = useCompany();
  const [companyData, setCompanyData] = useState<CompanyDetails>(EMPTY_COMPANY);
  const [logo, setLogo] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const today = new Date();
  const [dateText, setDateText] = useState("");
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  useEffect(() => {
    if (company) setCompanyData(company);
  }, [company]);

  useEffect(() => {
    setDateText(isoToDisplay(companyData.dateOfEstablishment));
    if (companyData.dateOfEstablishment) {
      const [y, m] = companyData.dateOfEstablishment.split("-");
      if (y && m) {
        setViewYear(Number(y));
        setViewMonth(Number(m) - 1);
      }
    }
  }, [companyData.dateOfEstablishment]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [id]: value }));
  }

  function handleDateTextChange(raw: string) {
    setDateText(raw);
  }

  function handleDateBlur() {
    if (dateText.trim() === "") {
      setCompanyData((prev) => ({ ...prev, dateOfEstablishment: "" }));
      return;
    }
    const iso = displayToIso(dateText);
    if (iso) {
      setCompanyData((prev) => ({ ...prev, dateOfEstablishment: iso }));
    } else {
      setDateText(isoToDisplay(companyData.dateOfEstablishment));
    }
  }

  function handleSelectDay(iso: string) {
    setCompanyData((prev) => ({ ...prev, dateOfEstablishment: iso }));
    setDateCalendarOpen(false);
  }

  function handlePrevMonth() {
    setViewMonth((m) => {
      if (m === 0) {
        setViewYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function handleNextMonth() {
    setViewMonth((m) => {
      if (m === 11) {
        setViewYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function handleDateClear() {
    setCompanyData((prev) => ({ ...prev, dateOfEstablishment: "" }));
    setDateCalendarOpen(false);
  }

  function handleDateToday() {
    const now = new Date();
    const iso = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;
    setCompanyData((prev) => ({ ...prev, dateOfEstablishment: iso }));
    setDateCalendarOpen(false);
  }

  function handleLogoSelect(file: File | null) {
    if (!file) return;
    if (!["image/png", "image/jpeg"].includes(file.type)) {
      alert("Please upload a PNG or JPG file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5 MB.");
      return;
    }
    setLogo(file);
  }

  function handleFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleLogoSelect(e.target.files?.[0] ?? null);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    handleLogoSelect(e.dataTransfer.files?.[0] ?? null);
  }

  const { toast, showToast } = useToast();

  async function handleSave() {
    if (!companyData.companyName?.trim()) {
      showToast("Company Name is required.", "error");
      return;
    }
    if (!companyData.address1?.trim()) {
      showToast("Address 1 is required.", "error");
      return;
    }
    if (!companyData.contactMobile?.trim()) {
      showToast("Phone 1 is required.", "error");
      return;
    }

    try {
      await updateCompany(companyData).unwrap();
      await refetch();
      showToast("Company details saved successfully");
    } catch (err: unknown) {
      console.error("Failed to save company details", err);
      const e = err as {
        status?: number | string;
        data?: { message?: string; error?: string; title?: string } | string;
        error?: string;
      };
      let msg = "Failed to save company details. Please try again.";
      if (e?.status === "FETCH_ERROR") {
        msg = "Cannot reach the server. Check that the backend is running.";
      } else if (e?.status === 401 || e?.status === 403) {
        msg = "You are not authorised. Please log in again.";
      } else if (e?.status === 404) {
        msg = "Save endpoint not found (404). Check API route /admin/configuration/company.";
      } else if (typeof e?.data === "string" && e.data.trim()) {
        msg = e.data;
      } else if (e?.data && typeof e.data === "object") {
        msg =
          e.data.message ||
          e.data.error ||
          e.data.title ||
          msg;
      } else if (e?.error) {
        msg = e.error;
      }
      showToast(msg, "error");
    }
  }

  if (isLoading) {
    return <div className="text-sm text-[#626262] p-6">Loading company details…</div>;
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-3">
      <Toast toast={toast} />

      {/* Company Information */}
      <Card data-company-module-card className="min-w-0 rounded-2xl border border-[#EDEDED] p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDDDDD] bg-white">
            <CompanyInformationIcon size={20} color="#7A5BED" />
          </div>
          <div>
            <h2 className="text-[16px] leading-6 font-semibold text-[#5932E9]">Company Information</h2>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <Label htmlFor="companyName">
              Company Name <span className="text-[#DD3232]">*</span>
            </Label>
            <Input
              id="companyName"
              placeholder="Company Name"
              className="mt-2 h-11"
              value={companyData.companyName}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="dateOfEstablishment">Date of Establishment</Label>
            <div className="mt-2">
              <DatePicker
                id="dateOfEstablishment"
                text={dateText}
                onTextChange={handleDateTextChange}
                onBlur={handleDateBlur}
                open={dateCalendarOpen}
                onOpenChange={setDateCalendarOpen}
                monthLabel={`${MONTH_NAMES[viewMonth]} ${viewYear}`}
                weekdayLabels={WEEKDAY_LABELS}
                cells={getDateCells(viewYear, viewMonth, companyData.dateOfEstablishment)}
                onSelectDay={handleSelectDay}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onClear={handleDateClear}
                onToday={handleDateToday}
                inputClassName="h-11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cin_LPIN">CIN / LLPIN</Label>
            <div className="relative mt-2">
              <Input
                id="cin_LPIN"
                placeholder="Enter CIN / LLPIN"
                className="h-11 pr-10"
                value={companyData.cin_LPIN}
                onChange={handleChange}
              />
              <Info
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626262]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="tan">TAN</Label>
            <div className="relative mt-2">
              <Input
                id="tan"
                placeholder="Enter TAN"
                className="h-11 pr-10"
                value={companyData.tan}
                onChange={handleChange}
              />
              <Info
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626262]"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              placeholder="https://example.com"
              className="mt-2 h-11"
              value={companyData.website}
              onChange={handleChange}
            />
          </div>
        </div>
      </Card>

      {/* Address Details */}
      <Card data-company-module-card className="min-w-0 rounded-2xl border border-[#EDEDED] p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDDDDD] bg-white">
            <MapPinned className="h-5 w-5 text-[#7A5BED]" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[16px] leading-6 font-semibold text-[#5932E9]">Address Details</h2>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <Label htmlFor="address1">
              Address 1 <span className="text-[#DD3232]">*</span>
            </Label>
            <Input
              id="address1"
              placeholder="Enter Address Line 1"
              className="mt-2 h-11"
              value={companyData.address1}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address2">Address 2</Label>
            <Input
              id="address2"
              placeholder="Enter Address Line 2"
              className="mt-2 h-11"
              value={companyData.address2}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="address3">Address 3</Label>
            <Input
              id="address3"
              placeholder="Enter Address Line 3"
              className="mt-2 h-11"
              value={companyData.address3}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactMobile">
                Phone 1 <span className="text-[#DD3232]">*</span>
              </Label>
              <Input
                id="contactMobile"
                placeholder="9876543210"
                className="mt-2 h-11"
                value={companyData.contactMobile}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="contactMobile2">Phone 2</Label>
              <Input
                id="contactMobile2"
                placeholder="9876543210"
                className="mt-2 h-11"
                value={companyData.contactMobile2}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs text-[#626262]">
              Note: This ShortName will be used as ESS Login URL.
            </p>
            <Label htmlFor="companyCode">Company Short Name</Label>
            <div className="relative mt-2">
              <Input
                id="companyCode"
                placeholder="Enter Short Name"
                className="h-11 pr-10"
                value={companyData.companyCode}
                onChange={handleChange}
              />
              <Info
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#626262]"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Right Column: Applicable + Company Logo */}
      <div className="min-w-0 space-y-6">
        <Card data-company-module-card className="min-w-0 rounded-2xl border border-[#EDEDED] p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDDDDD] bg-white">
              <ApplicableIcon size={18} color="#7A5BED" />
            </div>
            <div>
              <h2 className="text-[16px] leading-6 font-semibold text-[#5932E9]">Applicable</h2>
            </div>
          </div>

          <p className="mb-3 text-sm font-semibold text-[#131313]">Applicable</p>

          <div className="space-y-4">
            {[
              { name: "isPFApplicable", label: "PF ( Provident Fund )" },
              { name: "isESIApplicable", label: "ESI ( Employee State Insurance )" },
              { name: "isPTApplicable", label: "PT ( Professional Tax )" },
              { name: "isTDSApplicable", label: "TDS ( Tax Deducted at Source )" },
              { name: "tdsFilingMarToFeb", label: "TDS efiling Mar to Feb" },
              { name: "isLWFAvailable", label: "LWF ( Labour Welfare Fund )" },
            ].map((t) => (
              <label key={t.name} className="flex items-center justify-between gap-3">
                <span className="min-w-0 text-sm font-medium">{t.label}</span>
                <Switch
                  className="
                    h-6 w-11 shrink-0 border-transparent
                    data-[state=checked]:bg-[#10B981]
                    data-[state=unchecked]:bg-[#DDDDDD]
                  "
                  checked={companyData[t.name as keyof CompanyDetails] as boolean}
                  onCheckedChange={(checked) =>
                    setCompanyData((prev) => ({
                      ...prev,
                      [t.name]: checked,
                    }))
                  }
                />
              </label>
            ))}
          </div>
        </Card>

        <Card data-company-module-card className="min-w-0 rounded-2xl border border-[#EDEDED] p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#DDDDDD] bg-white">
                <ApplicableIcon size={18} color="#7A5BED" />
              </div>
              <div>
                <h2 className="text-[16px] leading-6 font-semibold text-[#5932E9]">Company Logo</h2>
              </div>
            </div>

            {logo && (
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="text-sm text-[#DD3232] hover:underline"
              >
                remove
              </button>
            )}
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`flex min-h-[220px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed transition-colors ${
              isDragging ? "border-[#7A5BED] bg-[#F6F3FF]" : "border-[#DDDDDD] bg-white"
            }`}
          >
            {logo ? (
              <img
                src={URL.createObjectURL(logo)}
                alt="Company Logo"
                className="max-h-32 object-contain p-2"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <Upload className="h-8 w-8 text-[#7A5BED]" />
                <p className="text-sm font-medium text-[#2E2E2E]">Drag &amp; drop logo here</p>
                <p className="text-xs text-[#626262]">PNG, JPG up to 5MB</p>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-2 bg-[#7A5BED] hover:bg-[#5932E9]"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload File
                </Button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-[#626262]">
              <Info className="h-4 w-4" />
              <span>Max Size 1 MB</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Button */}
      <div className="flex justify-end gap-4 pt-2 lg:col-span-3">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-[#7A5BED] text-white hover:bg-[#5932E9]"
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}