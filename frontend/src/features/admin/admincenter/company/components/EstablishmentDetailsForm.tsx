// import { useEffect, useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
// import type { EstablishmentDetails } from "../types/company.types";

// const EMPTY_ESTABLISHMENT: EstablishmentDetails = {
//   nameAndAddressOfEstablishment: "",
//   nameAndAddressOfEmployer: "",
//   nameAndAddressOfPrincipalEmployer: "",
//   nameAndAddressOfContractor: "",
//   nameAndAddressOfManager: "",
//   natureOfBusiness: "",
// };

// // "D" letter icon in a circle, matching the Figma
// function LetterIcon() {
//   return (
//     <div className="flex h-9 w-9 items-center justify-center rounded-full border border-violet-300 bg-white">
//       <span className="text-sm font-semibold text-violet-600">D</span>
//     </div>
//   );
// }

// function FieldLabel({ title }: { title: string }) {
//   return (
//     <div className="mb-2 flex items-center gap-3">
//       <LetterIcon />
//       <Label className="text-sm font-medium text-black">{title}</Label>
//     </div>
//   );
// }

// export default function EstablishmentDetailsForm() {
//   const { establishment, isLoading, updateEstablishment, isSaving } = useEstablishmentDetails();
//   const [formData, setFormData] = useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);

//   useEffect(() => {
//     if (establishment) setFormData(establishment);
//   }, [establishment]);

//   function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   }

//   if (isLoading) return <div className="text-sm text-slate-500 p-6">Loading establishment details…</div>;

//   return (
//     <Card className="rounded-2xl border border-gray-200 p-6 shadow-sm">
//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
//         <div>
//           <FieldLabel title="Name and Address of Establishment" />
//           <textarea
//             id="nameAndAddressOfEstablishment"
//             rows={6}
//             value={formData.nameAndAddressOfEstablishment}
//             onChange={handleChange}
//             placeholder="Enter name and address of establishment"
//             className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//           />
//         </div>

//         <div>
//           <FieldLabel title="Name and Address of Employer" />
//           <textarea
//             id="nameAndAddressOfEmployer"
//             rows={6}
//             value={formData.nameAndAddressOfEmployer}
//             onChange={handleChange}
//             placeholder="Enter name and address of employer"
//             className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//           />
//         </div>

//         <div>
//           <FieldLabel title="Name and Address of Principal Employer" />
//           <textarea
//             id="nameAndAddressOfPrincipalEmployer"
//             rows={6}
//             value={formData.nameAndAddressOfPrincipalEmployer}
//             onChange={handleChange}
//             placeholder="Enter name and address of principal employer"
//             className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//           />
//         </div>

//         <div>
//           <FieldLabel title="Name and Address of Contractor" />
//           <textarea
//             id="nameAndAddressOfContractor"
//             rows={6}
//             value={formData.nameAndAddressOfContractor}
//             onChange={handleChange}
//             placeholder="Enter contractor name and details if applicable..."
//             className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//           />
//         </div>

//         <div>
//           <FieldLabel title="Name and Address of Manager" />
//           <textarea
//             id="nameAndAddressOfManager"
//             rows={6}
//             value={formData.nameAndAddressOfManager}
//             onChange={handleChange}
//             placeholder="Manager details and office location address..."
//             className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//           />
//         </div>

//         <div>
//           <FieldLabel title="Nature of Business" />
//           <textarea
//             id="natureOfBusiness"
//             rows={6}
//             value={formData.natureOfBusiness ?? ""}
//             onChange={handleChange}
//             placeholder="Information Technology, Software Development and Consultancy services..."
//             className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//           />
//         </div>
//       </div>
//     </Card>
//   );
// }














// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
// import type { EstablishmentDetails } from "../types/company.types";
// import { Bookmark } from "lucide-react";

// const EMPTY_ESTABLISHMENT: EstablishmentDetails = {
//   nameAndAddressOfEstablishment: "",
//   nameAndAddressOfEmployer: "",
//   nameAndAddressOfPrincipalEmployer: "",
//   nameAndAddressOfContractor: "",
//   nameAndAddressOfManager: "",
//   natureOfBusiness: "",
// };

// function LetterIcon() {
//   return (
//     <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-violet-300 bg-white">
//       <span className="text-sm font-semibold text-violet-600">D</span>
//     </div>
//   );
// }

// function FieldLabel({ title }: { title: string }) {
//   return (
//     <div className="mb-2 flex items-center gap-3">
//       <LetterIcon />
//       <Label className="text-sm font-medium text-black">{title}</Label>
//     </div>
//   );
// }

// export default function EstablishmentDetailsForm() {
//   const { establishment, isLoading, updateEstablishment, isSaving } =
//     useEstablishmentDetails();
//   const [formData, setFormData] =
//     useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);

//   useEffect(() => {
//     if (establishment) setFormData(establishment);
//   }, [establishment]);

//   function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updateEstablishment(formData).unwrap();
//     } catch (err) {
//       console.error("Failed to save establishment details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading establishment details…
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card>
//         <CardContent className="space-y-6 p-4 sm:p-6">
//           <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
//             <div>
//               <FieldLabel title="Name and Address of Establishment" />
//               <textarea
//                 id="nameAndAddressOfEstablishment"
//                 rows={5}
//                 value={formData.nameAndAddressOfEstablishment}
//                 onChange={handleChange}
//                 placeholder="Enter name and address of establishment"
//                 className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Employer" />
//               <textarea
//                 id="nameAndAddressOfEmployer"
//                 rows={5}
//                 value={formData.nameAndAddressOfEmployer}
//                 onChange={handleChange}
//                 placeholder="Enter name and address of employer"
//                 className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Principal Employer" />
//               <textarea
//                 id="nameAndAddressOfPrincipalEmployer"
//                 rows={5}
//                 value={formData.nameAndAddressOfPrincipalEmployer}
//                 onChange={handleChange}
//                 placeholder="Enter name and address of principal employer"
//                 className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Contractor" />
//               <textarea
//                 id="nameAndAddressOfContractor"
//                 rows={5}
//                 value={formData.nameAndAddressOfContractor}
//                 onChange={handleChange}
//                 placeholder="Enter contractor name and details if applicable..."
//                 className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Manager" />
//               <textarea
//                 id="nameAndAddressOfManager"
//                 rows={5}
//                 value={formData.nameAndAddressOfManager}
//                 onChange={handleChange}
//                 placeholder="Manager details and office location address..."
//                 className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//               />
//             </div>

//             <div>
//               <FieldLabel title="Nature of Business" />
//               <textarea
//                 id="natureOfBusiness"
//                 rows={5}
//                 value={formData.natureOfBusiness ?? ""}
//                 onChange={handleChange}
//                 placeholder="Information Technology, Software Development and Consultancy services..."
//                 className="w-full resize-none rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-violet-500"
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer Buttons — responsive */}
//       <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">''''
//         <Button variant="outline" type="button" className="w-full sm:w-auto">/
//           Load Default Value
//         </Button>
//         <Button
//           type="button"
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex w-full items-center justify-center gap-2 bg-violet-600 text-white hover:bg-violet-700 sm:w-auto"        
//         >
//           <Bookmark className="h-4 w-4" />
//           {isSaving ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </div>
//   );
// }










// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Button } from "@/components/ui/button";
// import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
// import type { EstablishmentDetails } from "../types/company.types";
// import { Bookmark } from "lucide-react";

// const EMPTY_ESTABLISHMENT: EstablishmentDetails = {
//   nameAndAddressOfEstablishment: "",
//   nameAndAddressOfEmployer: "",
//   nameAndAddressOfPrincipalEmployer: "",
//   nameAndAddressOfContractor: "",
//   nameAndAddressOfManager: "",
//   natureOfBusiness: "",
// };

// function LetterIcon() {
//   return (
//     <div
//       className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border bg-white"
//       style={{ borderColor: "#E9D5FF" }}
//     >
//       <span className="text-sm font-semibold text-[#7C3AED]">D</span>
//     </div>
//   );
// }

// function FieldLabel({ title }: { title: string }) {
//   return (
//     <div className="mb-2 flex items-center gap-3">
//       <LetterIcon />
//       <Label className="text-sm font-medium text-gray-800">{title}</Label>
//     </div>
//   );
// }

// const textareaClass =
//   "w-full resize-none rounded-lg border border-[#E4DFFB] p-3 text-sm outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-[#EDE9FE]";

// export default function EstablishmentDetailsForm() {
//   const { establishment, isLoading, updateEstablishment, isSaving } =
//     useEstablishmentDetails();
//   const [formData, setFormData] =
//     useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);

//   useEffect(() => {
//     if (establishment) setFormData(establishment);
//   }, [establishment]);

//   function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     const { id, value } = e.target;
//     setFormData((prev) => ({ ...prev, [id]: value }));
//   }

//   async function handleSave() {
//     try {
//       await updateEstablishment(formData).unwrap();
//     } catch (err) {
//       console.error("Failed to save establishment details", err);
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="p-4 text-sm text-slate-500 sm:p-6">
//         Loading establishment details…
//       </div>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card className="rounded-2xl border border-[#E9D5FF] shadow-sm">
//         <CardContent className="space-y-6 p-4 sm:p-6">
//           <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:grid-cols-2">
//             <div>
//               <FieldLabel title="Name and Address of Establishment" />
//               <textarea
//                 id="nameAndAddressOfEstablishment"
//                 rows={5}
//                 value={formData.nameAndAddressOfEstablishment}
//                 onChange={handleChange}
//                 placeholder="Enter name and address of establishment"
//                 className={textareaClass}
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Employer" />
//               <textarea
//                 id="nameAndAddressOfEmployer"
//                 rows={5}
//                 value={formData.nameAndAddressOfEmployer}
//                 onChange={handleChange}
//                 placeholder="Enter name and address of employer"
//                 className={textareaClass}
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Principal Employer" />
//               <textarea
//                 id="nameAndAddressOfPrincipalEmployer"
//                 rows={5}
//                 value={formData.nameAndAddressOfPrincipalEmployer}
//                 onChange={handleChange}
//                 placeholder="Enter name and address of principal employer"
//                 className={textareaClass}
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Contractor" />
//               <textarea
//                 id="nameAndAddressOfContractor"
//                 rows={5}
//                 value={formData.nameAndAddressOfContractor}
//                 onChange={handleChange}
//                 placeholder="Enter contractor name and details if applicable..."
//                 className={textareaClass}
//               />
//             </div>

//             <div>
//               <FieldLabel title="Name and Address of Manager" />
//               <textarea
//                 id="nameAndAddressOfManager"
//                 rows={5}
//                 value={formData.nameAndAddressOfManager}
//                 onChange={handleChange}
//                 placeholder="Manager details and office location address..."
//                 className={textareaClass}
//               />
//             </div>

//             <div>
//               <FieldLabel title="Nature of Business" />
//               <textarea
//                 id="natureOfBusiness"
//                 rows={5}
//                 value={formData.natureOfBusiness ?? ""}
//                 onChange={handleChange}
//                 placeholder="Information Technology, Software Development and Consultancy services..."
//                 className={textareaClass}
//               />
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Footer Buttons */}
//       <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:justify-end sm:gap-4">
//         <Button variant="outline" type="button" className="w-full border-[#E4DFFB] sm:w-auto">
//           Load Default Value
//         </Button>
//         <Button
//           type="button"
//           onClick={handleSave}
//           disabled={isSaving}
//           className="flex w-full items-center justify-center gap-2 bg-[#7C3AED] text-white hover:bg-[#6D28D9] sm:w-auto"
//         >
//           <Bookmark className="h-4 w-4" />
//           {isSaving ? "Saving..." : "Save"}
//         </Button>
//       </div>
//     </div>
//   );
// }








import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEstablishmentDetails } from "../hooks/useEstablishmentDetails";
import type { EstablishmentDetails } from "../types/company.types";
import { Bookmark } from "lucide-react";

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
      style={{ borderColor: "#E9D5FF" }}
    >
      <span className="text-sm font-semibold text-[#7C3AED]">D</span>
    </div>
  );
}

function FieldLabel({ title }: { title: string }) {
  return (
    <div className="mb-2 flex items-center gap-3">
      <LetterIcon />
      <Label className="text-sm font-medium text-gray-800">
        {title}
      </Label>
    </div>
  );
}

/* =======================================================
   TEXTAREA STYLE
   Normal border  : #E4DFFB
   Focus border   : #4DD2FF
   Thin focus ring
======================================================= */

const textareaClass =
  "w-full resize-none rounded-lg border border-[#E4DFFB] bg-white p-3 text-sm text-gray-900 outline-none transition-colors duration-150 placeholder:text-gray-400 focus:border-[#4DD2FF] focus:outline-none focus:ring-1 focus:ring-[#4DD2FF]/20";

export default function EstablishmentDetailsForm() {
  const {
    establishment,
    isLoading,
    updateEstablishment,
    isSaving,
  } = useEstablishmentDetails();

  const [formData, setFormData] =
    useState<EstablishmentDetails>(EMPTY_ESTABLISHMENT);

  useEffect(() => {
    if (establishment) {
      setFormData(establishment);
    }
  }, [establishment]);

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
    try {
      await updateEstablishment(formData).unwrap();
    } catch (err) {
      console.error(
        "Failed to save establishment details",
        err
      );
    }
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-slate-500 sm:p-6">
        Loading establishment details…
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* =================================================
          MAIN CARD
      ================================================= */}

      <Card className="rounded-2xl border border-[#E9D5FF] bg-white shadow-sm">
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
          className="
            w-full
            border-[#E4DFFB]
            bg-white
            text-gray-700
            hover:bg-gray-50
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
            bg-[#7C3AED]
            text-white
            hover:bg-[#6D28D9]
            sm:w-auto
          "
        >
          <Bookmark className="h-4 w-4" />

          {isSaving ? "Saving..." : "Save"}
        </Button>

      </div>
    </div>
  );
}