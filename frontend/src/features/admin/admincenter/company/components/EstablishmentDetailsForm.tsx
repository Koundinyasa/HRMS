import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
import type { EstablishmentDetails } from "../types/company.types";
import { Bookmark, Loader2 } from "lucide-react";
import { useToast, Toast } from "./common/Toast";

const EMPTY_ESTABLISHMENT: EstablishmentDetails = {
  nameAndAddressOfEstablishment: "",
  nameAndAddressOfEmployer: "",
  nameAndAddressOfPrincipalEmployer: "",
  nameAndAddressOfContractor: "",
  nameAndAddressOfManager: "",
  natureOfBusiness: "",
};

function LetterIcon() {
  return (
    <div
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white"
      style={{ borderColor: "#ECE7FF" }}
    >
      <span className="text-sm font-semibold text-[#7A5BED]">D</span>
    </div>
  );
}

function FieldLabel({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <LetterIcon />
      <Label className="text-[13px] font-medium leading-5 tracking-[0.01em] text-[#2E2E2E]">
        {title}
      </Label>
    </div>
  );
}

/* =======================================================
   TEXTAREA STYLE
   Normal border  : #ECE7FF
   Focus border   : #00C0FF
   Thin focus ring
======================================================= */

const textareaClass =
  "w-full resize-none rounded-xl border border-[#EDEDED] bg-white p-3 text-sm text-[#2E2E2E] outline-none transition-colors duration-150 placeholder:text-[#626262] focus:border-[#7A5BED] focus:outline-none focus:ring-1 focus:ring-violet-500/20";

export default function EstablishmentDetailsForm() {
  const {
    establishment,
    isLoading,
    updateEstablishment,
    isSaving,
    refetch,
  } = useEstablishmentDetails();

  const { toast, showToast } = useToast();

  const [formData, setFormData] =
    useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);

  const [previousEstablishment, setPreviousEstablishment] =
    useState<typeof establishment>();
  if (establishment && establishment !== previousEstablishment) {
    setPreviousEstablishment(establishment);
    setFormData(establishment);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  async function handleSave() {
    if (!formData.nameAndAddressOfEstablishment.trim()) {
      showToast("Name and Address of Establishment is required.", "error");
      return;
    }
    try {
      await updateEstablishment(formData).unwrap();
      await refetch();
      showToast("Establishment details saved successfully");
    } catch (err: any) {
      console.error("Failed to save establishment details", err);
      const msg = err?.data?.message;
      showToast(
        Array.isArray(msg)
          ? msg.join(", ")
          : msg ?? "Failed to save establishment details. Please try again.",
        "error"
      );
    }
  }

  function handleLoadSaved() {
    setFormData(establishment ?? EMPTY_ESTABLISHMENT);
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-[#626262] sm:p-6">
        Loading establishment details…
      </div>
    );
  }

  return (
    <div className="w-full font-['Urbanist'] text-[#131313]">
      <Toast toast={toast} />
      {/* =================================================
          MAIN CARD
      ================================================= */}

      <Card data-company-module-card className="rounded-2xl border border-[#EDEDED] bg-white shadow-[0_1px_0_rgba(15,23,42,0.02)]">
        <CardContent className="space-y-6 p-4 sm:p-6">

          {/* =================================================
              FORM GRID
          ================================================= */}

          <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">

            {/* ================= ESTABLISHMENT ================= */}

            <div>
              <FieldLabel title="Name and Address of Establishment" />

              <textarea
                id="nameAndAddressOfEstablishment"
                rows={5}
                value={
                  formData.nameAndAddressOfEstablishment
                }
                onChange={handleChange}
                placeholder="Enter name and address of establishment"
                className={textareaClass}
              />
            </div>

            {/* ================= EMPLOYER ================= */}

            <div>
              <FieldLabel title="Name and Address of Employer" />

              <textarea
                id="nameAndAddressOfEmployer"
                rows={5}
                value={
                  formData.nameAndAddressOfEmployer
                }
                onChange={handleChange}
                placeholder="Enter name and address of employer"
                className={textareaClass}
              />
            </div>

            {/* ================= PRINCIPAL EMPLOYER ================= */}

            <div>
              <FieldLabel
                title="Name and Address of Principal Employer"
              />

              <textarea
                id="nameAndAddressOfPrincipalEmployer"
                rows={5}
                value={
                  formData.nameAndAddressOfPrincipalEmployer
                }
                onChange={handleChange}
                placeholder="Enter name and address of principal employer"
                className={textareaClass}
              />
            </div>

            {/* ================= CONTRACTOR ================= */}

            <div>
              <FieldLabel title="Name and Address of Contractor" />

              <textarea
                id="nameAndAddressOfContractor"
                rows={5}
                value={
                  formData.nameAndAddressOfContractor
                }
                onChange={handleChange}
                placeholder="Enter contractor name and details if applicable..."
                className={textareaClass}
              />
            </div>

            {/* ================= MANAGER ================= */}

            <div>
              <FieldLabel title="Name and Address of Manager" />

              <textarea
                id="nameAndAddressOfManager"
                rows={5}
                value={
                  formData.nameAndAddressOfManager
                }
                onChange={handleChange}
                placeholder="Manager details and office location address..."
                className={textareaClass}
              />
            </div>

            {/* ================= NATURE OF BUSINESS ================= */}

            <div>
              <FieldLabel title="Nature of Business" />

              <textarea
                id="natureOfBusiness"
                rows={5}
                value={
                  formData.natureOfBusiness ?? ""
                }
                onChange={handleChange}
                placeholder="Information Technology, Software Development and Consultancy services..."
                className={textareaClass}
              />
            </div>

          </div>
        </CardContent>
      </Card>

      {/* =================================================
          FOOTER BUTTONS
      ================================================= */}

      <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">

        {/* Load Default */}

        <Button
          variant="outline"
          type="button"
          onClick={handleLoadSaved}
          disabled={isSaving}
          className="
            w-full
            border-[#EDEDED]
            bg-white
            text-[#2E2E2E]
            hover:bg-[#EDEDED]
            sm:w-auto
          "
        >
          Load Default Value
        </Button>

        {/* Save */}

        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            bg-[#7A5BED]
            text-white
            hover:bg-[#5932E9]
            sm:w-auto
          "
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