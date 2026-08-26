// import { Button } from "@/components/ui/button";
// import { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import AssetNavbar from "../components/AssetNavbar";
// import { useAssetManagement } from "../hooks/useAssetManagement";

// export default function AssetRequest() {
//   const {

//     assetTypes,
//     assetId,
//     reason,
//     isCreating,
//     setAssetReason,
//     setAssetType,
//     submitRequest,
//   } = useAssetManagement();

//   const navigate = useNavigate();
//   const { domain } = useParams();
//   const [assetSelectOpen, setAssetSelectOpen] = useState(false);

//   return (
//     <div className="w-full">
//       <AssetNavbar />

//       <div className="mt-8 px-8">
//         <Card className="mx-auto max-w-6xl rounded-2xl border shadow-sm">
//           <CardHeader className="px-8 pt-8">
//             <CardTitle className="text-2xl font-bold">
//               Raise Asset Request
//             </CardTitle>

//             <CardDescription className="text-base">
//               Provide the asset details needed for your work.
//             </CardDescription>
//           </CardHeader>

//           <CardContent className="space-y-8 px-8 pb-8">
//             {/* Employee ID & Asset Type */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

//               <div className="space-y-2">
//                 <Label htmlFor="asset-type">Asset Type</Label>

//                 <Select
//                   value={assetId ? String(assetId) : ""}
//                   onValueChange={(value) => {
//                     setAssetType(Number(value));
//                   }}
//                   open={assetSelectOpen}
//                   onOpenChange={setAssetSelectOpen}
//                 >
//                   <SelectTrigger
//                     id="asset-type"
//                     className="h-11 w-full"
//                   >
//                     <span className="truncate">
//                       {assetId
//                         ? assetTypes.find(
//                           (type) => type.AssetID === assetId
//                         )?.AssetName ?? "Select"
//                         : "Select"}
//                     </span>
//                   </SelectTrigger>

//                   <SelectContent
//                     side="bottom"
//                     align="start"
//                     sideOffset={4}
//                     alignItemWithTrigger={false}
//                     className="max-h-[90px] overflow-y-auto bg-white text-slate-900 shadow-lg"
//                   >
//                     {assetTypes.map((type) => (
//                       <SelectItem
//                         key={type.AssetID}
//                         value={String(type.AssetID)}
//                       >
//                         {type.AssetName}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Reason */}
//             <div className="space-y-2">
//               <Label htmlFor="asset-reason">
//                 Reason <span className="text-red-600">*</span>
//               </Label>

//               <textarea
//                 id="asset-reason"
//                 rows={6}
//                 value={reason}
//                 onChange={(e) => setAssetReason(e.target.value)}
//                 placeholder="Describe why this asset is required"
//                 className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             {/* Submit Button */}
//             <Button
//               className="h-12 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
//               onClick={async () => {
//                 const success = await submitRequest();

//                 if (success) {
//                   navigate(`/${domain}/employee/assets/return`);
//                 }
//               }}
//               disabled={isCreating}
//             >
//               {isCreating ? "Submitting..." : "Submit Request"}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import AssetNavbar from "../components/AssetNavbar";
import { useAssetManagement } from "../hooks/useAssetManagement";

export default function AssetRequest() {
  const {
    assetTypes,
    assetId,
    reason,
    isCreating,
    setAssetReason,
    setAssetType,
    submitRequest,
  } = useAssetManagement();

  const navigate = useNavigate();
  const { domain } = useParams();

  return (
    <div className="w-full">
      <AssetNavbar />

      <div className="mt-8 px-8">
        <Card className="mx-auto max-w-6xl rounded-2xl border shadow-sm">
          <CardHeader className="px-8 pt-8">
            <CardTitle className="text-2xl font-bold">
              Raise Asset Request
            </CardTitle>

            <CardDescription className="text-base">
              Provide the asset details needed for your work.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8">
            {/* Asset Type */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="asset-type">Asset Type</Label>

                <Select
                  value={assetId !== null ? String(assetId) : undefined}
                  onValueChange={(value) => {
                    const selectedAssetId = Number(value);

                    console.log("Selected value:", value);
                    console.log("Selected Asset ID:", selectedAssetId);

                    setAssetType(selectedAssetId);
                  }}
                >
                  <SelectTrigger id="asset-type" className="h-11 w-full">
                    <SelectValue placeholder="Select Asset Type" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    className="max-h-60 overflow-y-auto"
                  >
                    {assetTypes.map((type) => (
                      <SelectItem
                        key={type.AssetID}
                        value={String(type.AssetID)}
                      >
                        {type.AssetName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="asset-reason">
                Reason <span className="text-red-600">*</span>
              </Label>

              <textarea
                id="asset-reason"
                rows={6}
                value={reason}
                onChange={(e) => setAssetReason(e.target.value)}
                placeholder="Describe why this asset is required"
                className="w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="button"
              className="h-12 w-full rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              onClick={async () => {
                const success = await submitRequest();

                if (success) {
                  navigate(`/${domain}/employee/assets/return`);
                }
              }}
              disabled={isCreating}
            >
              {isCreating ? "Submitting..." : "Submit Request"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
