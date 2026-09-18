








import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { DatePicker } from "@/components/ui/datepicker";

import { useCompany } from "../hooks/useCompany";
import type { CompanyDetails } from "../types/company.types";
import {
  MapPinned,
  Info,
  Upload,
} from "lucide-react";

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
    <rect
      x="10"
      y="3"
      width="8"
      height="18"
      rx="0.5"
    />
    <rect
      x="3"
      y="9"
      width="7"
      height="12"
      rx="0.5"
    />
    <rect
      x="12.5"
      y="6"
      width="1.5"
      height="1.5"
    />
    <rect
      x="16"
      y="6"
      width="1.5"
      height="1.5"
    />
    <rect
      x="12.5"
      y="10"
      width="1.5"
      height="1.5"
    />
    <rect
      x="16"
      y="10"
      width="1.5"
      height="1.5"
    />
    <rect
      x="12.5"
      y="14"
      width="1.5"
      height="1.5"
    />
    <rect
      x="16"
      y="14"
      width="1.5"
      height="1.5"
    />
    <rect
      x="5.5"
      y="13"
      width="1.8"
      height="1.8"
    />
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
    <rect
      x="4"
      y="5"
      width="16"
      height="9"
      rx="1"
    />
    <line
      x1="4"
      y1="16"
      x2="20"
      y2="16"
    />
    <line
      x1="4"
      y1="19"
      x2="15"
      y2="19"
    />
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

/* =======================================================
   SHARED STYLE CONSTANTS
======================================================= */

const cardClass =
  "rounded-2xl border border-[#E9D5FF] shadow-sm bg-white p-4 sm:p-6";

const iconBoxClass =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E9D5FF] bg-white";

const inputClass =
  "mt-2 h-11 w-full min-w-0 border-[#DDD6FE] focus-visible:border-[#4dd2ff] focus-visible:ring-1 focus-visible:ring-[#4dd2ff]/20";

const inputClassNoMargin =
  "h-11 w-full min-w-0 border-[#DDD6FE] pr-10 focus-visible:border-[#4dd2ff] focus-visible:ring-1 focus-visible:ring-[#4dd2ff]/20";

export default function CompanyForm() {
  const {
    company,
    isLoading,
    updateCompany,
    isSaving,
  } = useCompany();

  const [companyData, setCompanyData] =
    useState<CompanyDetails>(
      EMPTY_COMPANY
    );

  const [logo, setLogo] =
    useState<File | null>(null);

  const [isDragging, setIsDragging] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (company) {
      setCompanyData(company);
    }
  }, [company]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const {
      id,
      value,
    } = e.target;

    setCompanyData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleLogoSelect(
    file: File | null
  ) {
    if (!file) return;

    if (
      ![
        "image/png",
        "image/jpeg",
      ].includes(file.type)
    ) {
      alert(
        "Please upload a PNG or JPG file."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "File size must be under 5 MB."
      );
      return;
    }

    setLogo(file);
  }

  function handleFileInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    handleLogoSelect(
      e.target.files?.[0] ?? null
    );
  }

  function handleDrop(
    e: React.DragEvent<HTMLDivElement>
  ) {
    e.preventDefault();
    setIsDragging(false);

    handleLogoSelect(
      e.dataTransfer.files?.[0] ?? null
    );
  }

  async function handleSave() {
    try {
      await updateCompany(
        companyData
      ).unwrap();
    } catch (err) {
      console.error(
        "Failed to save company details",
        err
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading company details…
      </div>
    );
  }

  return (
    <div className="grid w-full min-w-0 grid-cols-1 items-start gap-4 sm:gap-6 lg:grid-cols-3">
      {/* ===================== COMPANY INFORMATION ===================== */}

      <Card className={cardClass}>
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className={iconBoxClass}>
            <CompanyInformationIcon
              size={20}
              color="#7C5CFC"
            />
          </div>

          <h2 className="text-base font-semibold text-violet-700 sm:text-lg">
            Company Information
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Company Name */}

          <div className="min-w-0">
            <Label htmlFor="companyName">
              Company Name{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <Input
              id="companyName"
              placeholder="Company Name"
              className={inputClass}
              value={
                companyData.companyName
              }
              onChange={
                handleChange
              }
            />
          </div>

          {/* =================================================
              DATE OF ESTABLISHMENT
              DATE PICKER
          ================================================= */}

          <div className="min-w-0">
            <Label htmlFor="dateOfEstablishment">
              Date of Establishment
            </Label>

            <div className="mt-2">
              <DatePicker
                id="dateOfEstablishment"
                value={
                  companyData.dateOfEstablishment
                }
                onChange={(iso) =>
                  setCompanyData(
                    (prev) => ({
                      ...prev,
                      dateOfEstablishment:
                        iso,
                    })
                  )
                }
                placeholder="dd-mm-yyyy"
              />
            </div>
          </div>

          {/* CIN / LLPIN */}

          <div className="min-w-0">
            <Label htmlFor="cin_LPIN">
              CIN / LLPIN
            </Label>

            <div className="relative mt-2">
              <Input
                id="cin_LPIN"
                placeholder="Enter CIN / LLPIN"
                className={
                  inputClassNoMargin
                }
                value={
                  companyData.cin_LPIN
                }
                onChange={
                  handleChange
                }
              />

              <Info
                size={16}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />
            </div>
          </div>

          {/* TAN */}

          <div className="min-w-0">
            <Label htmlFor="tan">
              TAN
            </Label>

            <div className="relative mt-2">
              <Input
                id="tan"
                placeholder="Enter TAN"
                className={
                  inputClassNoMargin
                }
                value={
                  companyData.tan
                }
                onChange={
                  handleChange
                }
              />

              <Info
                size={16}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />
            </div>
          </div>

          {/* Website */}

          <div className="min-w-0">
            <Label htmlFor="website">
              Website
            </Label>

            <Input
              id="website"
              placeholder="https://example.com"
              className={
                inputClass
              }
              value={
                companyData.website
              }
              onChange={
                handleChange
              }
            />
          </div>
        </div>
      </Card>

      {/* ===================== ADDRESS DETAILS ===================== */}

      <Card className={cardClass}>
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className={iconBoxClass}>
            <MapPinned
              className="h-5 w-5 text-violet-600"
              strokeWidth={2}
            />
          </div>

          <h2 className="text-base font-semibold text-violet-700 sm:text-lg">
            Address Details
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {/* Address 1 */}

          <div className="min-w-0">
            <Label htmlFor="address1">
              Address 1{" "}
              <span className="text-red-500">
                *
              </span>
            </Label>

            <Input
              id="address1"
              placeholder="Enter Address Line 1"
              className={
                inputClass
              }
              value={
                companyData.address1
              }
              onChange={
                handleChange
              }
            />
          </div>

          {/* Address 2 */}

          <div className="min-w-0">
            <Label htmlFor="address2">
              Address 2
            </Label>

            <Input
              id="address2"
              placeholder="Enter Address Line 2"
              className={
                inputClass
              }
              value={
                companyData.address2
              }
              onChange={
                handleChange
              }
            />
          </div>

          {/* Address 3 */}

          <div className="min-w-0">
            <Label htmlFor="address3">
              Address 3
            </Label>

            <Input
              id="address3"
              placeholder="Enter Address Line 3"
              className={
                inputClass
              }
              value={
                companyData.address3
              }
              onChange={
                handleChange
              }
            />
          </div>

          {/* Phones */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <Label htmlFor="contactMobile">
                Phone 1{" "}
                <span className="text-red-500">
                  *
                </span>
              </Label>

              <Input
                id="contactMobile"
                placeholder="9876543210"
                className={
                  inputClass
                }
                value={
                  companyData.contactMobile
                }
                onChange={
                  handleChange
                }
              />
            </div>

            <div className="min-w-0">
              <Label htmlFor="contactMobile2">
                Phone 2
              </Label>

              <Input
                id="contactMobile2"
                placeholder="9876543210"
                className={
                  inputClass
                }
                value={
                  companyData.contactMobile2
                }
                onChange={
                  handleChange
                }
              />
            </div>
          </div>

          {/* Company Short Name */}

          <div className="min-w-0">
            <p className="mb-2 text-xs text-gray-500">
              Note: This ShortName will be used as ESS Login URL.
            </p>

            <Label htmlFor="companyCode">
              Company Short Name
            </Label>

            <div className="relative mt-2">
              <Input
                id="companyCode"
                placeholder="Enter Short Name"
                className={
                  inputClassNoMargin
                }
                value={
                  companyData.companyCode
                }
                onChange={
                  handleChange
                }
              />

              <Info
                size={16}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-400
                "
              />
            </div>
          </div>
        </div>
      </Card>

      {/* ===================== RIGHT COLUMN ===================== */}

      <div className="space-y-4 sm:space-y-6">
        {/* Applicable */}

        <Card className={cardClass}>
          <div className="mb-4 flex items-center gap-3">
            <div className={iconBoxClass}>
              <ApplicableIcon
                size={18}
                color="#7C5CFC"
              />
            </div>

            <h2 className="text-base font-semibold text-violet-700 sm:text-lg">
              Applicable
            </h2>
          </div>

          <p className="mb-3 text-sm font-semibold text-gray-800">
            Applicable
          </p>

          <div className="space-y-4">
            {(
              [
                {
                  name: "isPFApplicable",
                  label:
                    "PF( Provident Fund )",
                },
                {
                  name: "isESIApplicable",
                  label:
                    "ESI ( Employee State Insurance )",
                },
                {
                  name: "isPTApplicable",
                  label:
                    "PT ( Professional Tax )",
                },
                {
                  name: "isTDSApplicable",
                  label:
                    "TDS ( Tax Deducted at Source )",
                },
                {
                  name:
                    "tdsFilingMarToFeb",
                  label:
                    "TDS efiling Mar to Feb",
                },
                {
                  name: "isLWFAvailable",
                  label:
                    "LWF ( Labour Welfare Fund )",
                },
              ] as const
            ).map((t) => (
              <label
                key={t.name}
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                "
              >
                <span className="min-w-0 text-sm font-medium">
                  {t.label}
                </span>

                <Switch
                  className="
                    shrink-0
                    data-[state=checked]:bg-green-600
                  "
                  checked={
                    companyData[
                      t.name as keyof CompanyDetails
                    ] as boolean
                  }
                  onCheckedChange={(
                    checked
                  ) =>
                    setCompanyData(
                      (prev) => ({
                        ...prev,
                        [t.name]:
                          checked,
                      })
                    )
                  }
                />
              </label>
            ))}
          </div>
        </Card>

        {/* Company Logo */}

        <Card className={cardClass}>
          <div className="mb-4 flex items-center justify-between gap-2 sm:mb-5">
            <div className="flex min-w-0 items-center gap-3">
              <div className={iconBoxClass}>
                <ApplicableIcon
                  size={18}
                  color="#7C5CFC"
                />
              </div>

              <h2 className="text-base font-semibold text-violet-700 sm:text-lg">
                Company Logo
              </h2>
            </div>

            {logo && (
              <button
                type="button"
                onClick={() =>
                  setLogo(null)
                }
                className="
                  shrink-0
                  text-sm
                  text-red-500
                  hover:underline
                "
              >
                remove
              </button>
            )}
          </div>

          {/* Upload Box */}

          <div
            onClick={() =>
              fileInputRef.current?.click()
            }
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() =>
              setIsDragging(false)
            }
            onDrop={handleDrop}
            className={`
              flex
              min-h-[180px]
              w-full
              cursor-pointer
              flex-col
              items-center
              justify-center
              rounded-xl
              border
              border-dashed
              transition-colors
              sm:min-h-[220px]

              ${
                isDragging
                  ? "border-violet-500 bg-violet-50"
                  : "border-[#DDD6FE] bg-white"
              }
            `}
          >
            {logo ? (
              <img
                src={URL.createObjectURL(
                  logo
                )}
                alt="Company Logo"
                className="
                  max-h-32
                  object-contain
                  p-2
                "
              />
            ) : (
              <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
                <Upload className="h-8 w-8 text-violet-600" />

                <p className="text-sm font-medium text-gray-700">
                  Drag &amp; drop logo here
                </p>

                <p className="text-xs text-gray-400">
                  PNG, JPG up to 5MB
                </p>

                <Button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="
                    mt-2
                    bg-violet-600
                    hover:bg-violet-700
                  "
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
              onChange={
                handleFileInputChange
              }
            />
          </div>

          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
            <Info className="h-4 w-4 shrink-0" />
            <span>
              Max Size 1 MB
            </span>
          </div>
        </Card>

        {/* Optional Save */}

        {/*
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full bg-violet-600 hover:bg-violet-700 sm:w-auto"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        */}
      </div>
    </div>
  );
}