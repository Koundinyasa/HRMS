import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCompany } from "../hooks/useCompany";
import { useToast, Toast } from "./common/Toast";
import type { CompanyDetails } from "../types/company.types";
import { Switch } from "@/components/ui/switch";
 
import { CalendarDays, MapPinned, Info, Upload, Bookmark, Loader2 } from "lucide-react";
 
const CompanyInformationIcon = ({
  color = "#7C5CFC",
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
  color = "#7C5CFC",
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
 
  useEffect(() => {
    if (company) setCompanyData(company);
  }, [company]);
 
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { id, value } = e.target;
    setCompanyData((prev) => ({ ...prev, [id]: value }));
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
    try {
      await updateCompany(companyData).unwrap();
      await refetch();
      showToast("Company details saved successfully");
    } catch (err) {
      console.error("Failed to save company details", err);
      showToast("Failed to save company details. Please try again.", "error");
    }
  }
 
  if (isLoading) {
    return <div className="text-sm text-slate-500 p-6">Loading company details…</div>;
  }
 
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
      <Toast toast={toast} />
      {/* Company Information */}
      <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center">
            <CompanyInformationIcon size={20} color="#7C5CFC" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-violet-700">Company Information</h2>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <Label htmlFor="companyName">
              Company Name <span className="text-red-500">*</span>
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
            <div className="relative mt-2">
              <Input
                id="dateOfEstablishment"
                type="date"
                className="h-11 pr-10 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-2 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                value={companyData.dateOfEstablishment}
                onChange={handleChange}
              />
              <CalendarDays className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
      <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center">
            <MapPinned className="w-5 h-5 text-violet-600" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-violet-700">Address Details</h2>
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <Label htmlFor="address1">
              Address 1 <span className="text-red-500">*</span>
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
 
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contactMobile">
                Phone 1 <span className="text-red-500">*</span>
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
            <p className="text-xs text-gray-500 mb-2">
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
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        </div>
      </Card>
 
      {/* Right Column: Applicable + Company Logo stacked */}
      <div className="space-y-6">
        <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center">
              <ApplicableIcon size={18} color="#7C5CFC" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-violet-700">Applicable</h2>
            </div>
          </div>
 
          <p className="text-sm font-semibold text-gray-800 mb-3">Applicable</p>
 
          <div className="space-y-4">
            {[
              { name: "isPFApplicable", label: "PF( Provident Fund )" },
              { name: "isESIApplicable", label: "ESI ( Employee State Insurance )" },
              { name: "isPTApplicable", label: "PT ( Professional Tax )" },
              { name: "isTDSApplicable", label: "TDS ( Tax Deducted at Source )" },
              { name: "tdsFilingMarToFeb", label: "TDS efiling Mar to Feb" },
              { name: "isLWFAvailable", label: "LWF ( Labour Welfare Fund )" },
            ].map((t) => (
              <label key={t.name} className="flex items-center justify-between">
                <span className="text-sm font-medium">{t.label}</span>
                <Switch
                  className="data-[state=checked]:bg-green-600"
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
 
        <Card className="rounded-2xl border border-gray-200 shadow-sm p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl border border-gray-300 bg-white flex items-center justify-center">
                <ApplicableIcon size={18} color="#7C5CFC" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-violet-700">Company Logo</h2>
              </div>
            </div>
 
            {logo && (
              <button
                type="button"
                onClick={() => setLogo(null)}
                className="text-sm text-red-500 hover:underline"
              >
                remove
              </button>
            )}
          </div>
 
          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`min-h-[220px] w-full rounded-xl border border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors ${
              isDragging ? "border-violet-500 bg-violet-50" : "border-[#CBD5E1] bg-white"
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
                <Upload className="h-8 w-8 text-violet-600" />
                <p className="text-sm font-medium text-gray-700">Drag &amp; drop logo here</p>
                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-2 bg-violet-600 hover:bg-violet-700"
                >
                  <Upload className="h-4 w-4 mr-2" />
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
 
          {/* Bottom */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Info className="h-4 w-4" />
              <span>Max Size 1 MB</span>
            </div>
          </div>
        </Card>
      </div>
 
      {/* Footer Button */}
      <div className="lg:col-span-3 flex justify-end gap-4 pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 bg-violet-600 text-white hover:bg-violet-700"
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