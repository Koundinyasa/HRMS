import { useRef } from "react";

import { Button } from "@/components/ui/button";
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

import { UploadCloud, CheckCircle2 } from "lucide-react";

import ClassificationNavbar from "../components/ClassificationNavbar";
import { useImport } from "../hooks/useImport";

export default function ImportPage() {
  const {
    templateType,
    setTemplateType,
    templateTypes,
    file,
    setFile,
    downloadTemplate,
    isDownloading,
    upload,
    isUploading,
  } = useImport();

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full min-h-screen">
      <ClassificationNavbar />

      {/* Main Content */}
      <div className="mt-4 sm:mt-8 px-3 sm:px-8">
        <Card
          className="
            mx-auto
            w-full
            max-w-4xl
            rounded-2xl
            border
            shadow-sm
            overflow-visible
          "
        >
          {/* Header */}
          <CardHeader className="px-6 sm:px-10 pt-7 sm:pt-10">
            <CardTitle className="text-2xl sm:text-3xl font-bold">
              Import
            </CardTitle>

            <CardDescription className="text-sm sm:text-base">
              Bulk import Branch, Designation, or Bank details.
            </CardDescription>
          </CardHeader>

          {/* Content */}
          <CardContent
            className="
              px-6
              sm:px-10
              pb-7
              sm:pb-10
              space-y-7
            "
          >
            {/* =========================
                TEMPLATE TYPE
            ========================== */}
            <div className="space-y-2">
              <Label
                htmlFor="template-type"
                className="text-sm sm:text-base font-medium"
              >
                Template Type
              </Label>

              <Select
                value={templateType}
                onValueChange={(value) =>
                  setTemplateType(value as typeof templateType)
                }
              >
                {/* Select Box */}
                <SelectTrigger
                  id="template-type"
                  className="
                    h-12
                    w-full
                    sm:w-80
                    rounded-lg
                    px-4
                    text-base
                  "
                >
                  <SelectValue placeholder="Select template type" />
                </SelectTrigger>

                {/* Dropdown */}
                <SelectContent
                  className="
                    z-50
                    min-w-[320px]
                    rounded-xl
                    p-2
                  "
                  position="popper"
                  sideOffset={6}
                >
                  {templateTypes.map((t) => (
                    <SelectItem
                      key={t}
                      value={t}
                      className="
                        min-h-[52px]
                        px-4
                        py-3
                        text-base
                        rounded-lg
                        cursor-pointer
                      "
                    >
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* =========================
                UPLOAD SECTION
            ========================== */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Upload Box */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();

                  const droppedFile = e.dataTransfer.files?.[0];

                  if (droppedFile) {
                    setFile(droppedFile);
                  }
                }}
                className="
                  flex-1
                  min-h-[260px]
                  border-2
                  border-dashed
                  border-blue-200
                  rounded-xl
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-12
                  sm:py-16
                  px-5
                  text-center
                  bg-blue-50/40
                  transition-colors
                  hover:bg-blue-50/70
                "
              >
                <UploadCloud size={44} className="text-blue-600 mb-4" />

                <p className="text-sm sm:text-base text-muted-foreground">
                  Drag & drop
                  <br />
                  Or{" "}
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="
                      text-blue-600
                      font-medium
                      underline
                      hover:text-blue-700
                    "
                  >
                    Browse
                  </button>
                </p>

                <input
                  ref={inputRef}
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => {
                    setFile(e.target.files?.[0] ?? null);
                  }}
                />

                {file && (
                  <p className="mt-4 text-xs sm:text-sm text-muted-foreground break-all">
                    {file.name}
                  </p>
                )}
              </div>

              {/* =========================
                  FILE REQUIREMENT
              ========================== */}
              <div
                className="
                  w-full
                  lg:w-80
                  bg-muted
                  rounded-xl
                  p-6
                  flex
                  flex-col
                  justify-center
                  min-h-[160px]
                "
              >
                <h4 className="text-base font-semibold mb-4">
                  File Requirement
                </h4>

                <p className="flex items-center gap-2 text-xs sm:text-sm text-emerald-600">
                  <CheckCircle2 size={16} />

                  <span>The Selected File Should Be Valid</span>
                </p>
              </div>
            </div>

            {/* =========================
                BUTTONS
            ========================== */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Template Button */}
              <Button
                type="button"
                onClick={downloadTemplate}
                disabled={isDownloading}
                className="
                  h-12
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  sm:text-base
                "
              >
                {isDownloading ? "Downloading..." : "Template"}
              </Button>

              {/* Upload Button */}
              <Button
                type="button"
                onClick={upload}
                disabled={!file || isUploading}
                className="
                  h-12
                  flex-1
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  text-sm
                  sm:text-base
                "
              >
                <UploadCloud size={17} className="mr-2" />

                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
