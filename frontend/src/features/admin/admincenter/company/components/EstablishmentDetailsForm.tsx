import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
import { useToast, Toast } from "./common/Toast";
import type { EstablishmentDetails } from "../types/company.types";
import { Bookmark, Loader2 } from "lucide-react";

const EMPTY_ESTABLISHMENT: EstablishmentDetails = {
  nameAndAddressOfEstablishment: "",
  nameAndAddressOfEmployer: "",
  nameAndAddressOfPrincipalEmployer: "",
  nameAndAddressOfContractor: "",
  nameAndAddressOfManager: "",
  natureOfBusiness: "",
};

type TextField = Exclude<keyof EstablishmentDetails, "natureOfBusiness">;

const TEXT_FIELDS: { id: TextField; label: string; required: boolean }[] = [
  {
    id: "nameAndAddressOfEstablishment",
    label: "Name and Address of Establishment",
    required: true,
  },
  {
    id: "nameAndAddressOfEmployer",
    label: "Name and Address of Employer",
    required: true,
  },
  {
    id: "nameAndAddressOfPrincipalEmployer",
    label: "Name and Address of Principal Employer",
    required: true,
  },
  {
    id: "nameAndAddressOfContractor",
    label: "Name and Address of Contractor",
    required: false,
  },
  {
    id: "nameAndAddressOfManager",
    label: "Name and Address of Manager",
    required: false,
  },
];

const FIELD_CLASS =
  "mt-2 w-full rounded-xl border border-[#EDEDED] bg-white px-3 py-2.5 text-sm text-[#2E2E2E] placeholder:text-[#626262] focus:outline-none focus:ring-1 focus:ring-[#7A5BED]";

export default function EstablishmentDetailsForm() {
  const { establishment, isLoading, updateEstablishment, isSaving, refetch } =
    useEstablishmentDetails();
  const [data, setData] = useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);
  const { toast, showToast } = useToast();

  useEffect(() => {
    if (establishment) setData(establishment);
  }, [establishment]);

  function handleTextChange(id: TextField, value: string) {
    setData((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSave() {
    const missing = TEXT_FIELDS.find(
      (field) => field.required && !data[field.id].trim(),
    );
    if (missing) {
      showToast(`${missing.label} is required.`, "error");
      return;
    }

    try {
      await updateEstablishment(data).unwrap();
      await refetch();
      showToast("Establishment details saved successfully");
    } catch (err) {
      console.error("Failed to save establishment details", err);
      showToast(
        "Failed to save establishment details. Please try again.",
        "error",
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">
        Loading establishment details…
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      <Card
        data-company-module-card
        className="w-full min-w-0 rounded-2xl border border-[#EDEDED] bg-white p-4 shadow-[0_1px_0_rgba(15,23,42,0.02)] sm:p-6"
      >
        <p className="mb-4 text-xs text-[#626262]">
          Enter the name on the first line and the address on the following
          lines.
        </p>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
          {TEXT_FIELDS.map((field) => (
            <div key={field.id}>
              <Label
                htmlFor={field.id}
                className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
              >
                {field.label}
                {field.required && <span className="text-red-500"> *</span>}
              </Label>
              <textarea
                id={field.id}
                rows={4}
                className={FIELD_CLASS}
                value={data[field.id]}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
              />
            </div>
          ))}

          <div>
            <Label
              htmlFor="natureOfBusiness"
              className="text-[13px] font-medium leading-5 text-[#2E2E2E]"
            >
              Nature of Business
            </Label>
            <Input
              id="natureOfBusiness"
              className="mt-2 h-11 rounded-xl border border-[#EDEDED] bg-white px-3 text-sm text-[#2E2E2E] placeholder:text-[#626262]"
              value={data.natureOfBusiness ?? ""}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  natureOfBusiness: e.target.value,
                }))
              }
            />
          </div>
        </div>
      </Card>

      <div className="mt-4 flex flex-col-reverse justify-end gap-3 sm:mt-6 sm:flex-row sm:gap-4">
        <button
          type="button"
          onClick={() => setData(establishment ?? EMPTY_ESTABLISHMENT)}
          className="w-full rounded-xl border border-[#EDEDED] bg-white px-5 py-2 text-sm font-medium text-[#2E2E2E] transition hover:bg-[#EDEDED] sm:w-auto"
        >
          Reset
        </button>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#7A5BED] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#5932E9] disabled:opacity-60 sm:w-auto"
          onClick={handleSave}
          disabled={isSaving}
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