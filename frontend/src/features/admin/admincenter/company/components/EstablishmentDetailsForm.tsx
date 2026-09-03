import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
import type { EstablishmentDetails } from "../types/company.types";

const EMPTY_ESTABLISHMENT: EstablishmentDetails = {
  nameAndAddressOfEstablishment: "",
  nameAndAddressOfEmployer: "",
  nameAndAddressOfPrincipalEmployer: "",
  nameAndAddressOfContractor: "",
  nameAndAddressOfManager: "",
  natureOfBusiness: "",
};

// "D" letter icon in a circle, matching the Figma
function LetterIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300 bg-white">
      <span className="text-sm font-semibold text-violet-600">D</span>
    </div>
  );
}

function FieldLabel({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <LetterIcon />
      <Label className="text-sm font-medium text-black">{title}</Label>
    </div>
  );
}

export default function EstablishmentDetailsForm() {
  const { establishment, isLoading, updateEstablishment, isSaving } = useEstablishmentDetails();
  const [formData, setFormData] = useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);

  useEffect(() => {
    if (establishment) setFormData(establishment);
  }, [establishment]);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  }

  if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading establishment details…</div>;

  return (
    <Card className="rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <FieldLabel title="Name and Address of Establishment" />
          <textarea
            id="nameAndAddressOfEstablishment"
            rows={6}
            value={formData.nameAndAddressOfEstablishment}
            onChange={handleChange}
            placeholder="Enter name and address of establishment"
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <FieldLabel title="Name and Address of Employer" />
          <textarea
            id="nameAndAddressOfEmployer"
            rows={6}
            value={formData.nameAndAddressOfEmployer}
            onChange={handleChange}
            placeholder="Enter name and address of employer"
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <FieldLabel title="Name and Address of Principal Employer" />
          <textarea
            id="nameAndAddressOfPrincipalEmployer"
            rows={6}
            value={formData.nameAndAddressOfPrincipalEmployer}
            onChange={handleChange}
            placeholder="Enter name and address of principal employer"
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <FieldLabel title="Name and Address of Contractor" />
          <textarea
            id="nameAndAddressOfContractor"
            rows={6}
            value={formData.nameAndAddressOfContractor}
            onChange={handleChange}
            placeholder="Enter contractor name and details if applicable..."
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <FieldLabel title="Name and Address of Manager" />
          <textarea
            id="nameAndAddressOfManager"
            rows={6}
            value={formData.nameAndAddressOfManager}
            onChange={handleChange}
            placeholder="Manager details and office location address..."
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
          />
        </div>

        <div>
          <FieldLabel title="Nature of Business" />
          <textarea
            id="natureOfBusiness"
            rows={6}
            value={formData.natureOfBusiness ?? ""}
            onChange={handleChange}
            placeholder="Information Technology, Software Development and Consultancy services..."
            className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
          />
        </div>
      </div>
    </Card>
  );
}