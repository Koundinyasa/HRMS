
import { Button } from "@/components/ui/button";
import { useState } from "react";
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
} from "@/components/ui/select";

import {
  Package,
  FileText,
} from "lucide-react";

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
  const [assetSelectOpen, setAssetSelectOpen] = useState(false);

  return (
    <div className="w-full min-w-0">
      <AssetNavbar />

      <div className="mt-6 px-4 sm:mt-8 sm:px-6 lg:px-8">
        <Card className="mx-auto
            w-full
            max-w-6xl
            rounded-2xl
            border
            border-slate-300
            bg-white
            shadow-sm">
          <CardHeader className="px-5 pt-6 sm:px-8 sm:pt-8">
            <CardTitle className="text-xl font-bold sm:text-2xl">
              Raise Asset Request
            </CardTitle>

            <CardDescription className="text-sm text-slate-600 sm:text-base">
              Provide the asset details needed for your work.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-7 px-5 pb-6 sm:space-y-8 sm:px-8 sm:pb-8">
            {/* Employee ID & Asset Type */}
            <div className="space-y-2">
              <Label htmlFor="asset-type"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-900"
              >
                <Package
                  size={15}
                  strokeWidth={1.8}
                  className="shrink-0 text-slate-500"
                />
                <span>Asset Type</span>
              </Label>

              <Select
                value={assetId ? String(assetId) : ""}
                onValueChange={(value) => {
                  setAssetType(Number(value));
                }}
                open={assetSelectOpen}
                onOpenChange={setAssetSelectOpen}
              >
                <SelectTrigger
                  id="asset-type"
                  className="h-11
                    w-full
                    rounded-lg
                    border
                    border-slate-200
                    bg-white
                    text-sm
                    text-slate-700
                    shadow-none
                    focus:ring-0
                    focus:ring-offset-0"
                >
                  <span className="truncate">
                    {assetId
                      ? assetTypes.find(
                        (type) => type.AssetID === assetId
                      )?.AssetName ?? "Select"
                      : "Select"}
                  </span>
                </SelectTrigger>

                <SelectContent
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  alignItemWithTrigger={false}
                  className="max-h-[90px]
                    overflow-y-auto
                    bg-white
                    text-slate-900
                    shadow-lg"
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


            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="asset-reason"
                className="flex items-center gap-1.5 text-sm font-medium text-slate-900"
              >
                <FileText
                  size={15}
                  strokeWidth={1.8}
                  className="shrink-0 text-slate-500"
                />
                <span>
                  Reason <span className="text-red-600">*</span>
                </span>
              </Label>

              <textarea
                id="asset-reason"
                rows={6}
                value={reason}
                onChange={(e) => setAssetReason(e.target.value)}
                placeholder="Describe why this asset is required"
                className="w-full
                  resize-none
                  rounded-lg
                  border
                  border-slate-200
                  bg-white
                  px-4
                  py-3
                  text-sm
                  text-slate-900
                  outline-none
                  placeholder:text-slate-500
                  focus:border-slate-300
                  focus:ring-0
                  sm:rows-6"
              />
            </div>

            {/* Submit Button */}
            <Button
              className="h-12
                w-full
                rounded-lg
                bg-blue-600
                text-sm
                font-semibold
                text-white
                hover:bg-blue-700"
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
