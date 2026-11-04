import { useState } from "react";
import { CheckCircle2, MoreVertical, Plus, UploadCloud, X } from "lucide-react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import DropdownSelect from "../../../components/DropdownSelect";
import type { ImportPanelProps } from "../types/timeoffice.types";

const IMPORT_FILTERS = ["Query", "Branch", "Salary Structure", "Leave", "Attendance", "Designation", "Emp Status"];

/** Drag-and-drop import shell shared by Masters > Import and Assign > Import. */
export default function ImportPanel({ title, onUpload, templateHeaders = [], templateTypeOptions = [] }: ImportPanelProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [templateType, setTemplateType] = useState(templateTypeOptions[0] ?? "");

  const downloadTemplate = () => {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.aoa_to_sheet(templateHeaders.length ? [templateHeaders] : []);
    XLSX.utils.book_append_sheet(workbook, sheet, "Template");
    XLSX.writeFile(workbook, `${title.replace(/[^a-z0-9]+/gi, "_")}_Template.xlsx`);
  };

  const uploadSelectedFile = async () => {
    if (!file || !onUpload || uploading) return;
    setUploading(true);
    setMessage("");
    try {
      const result = await onUpload(file);
      setMessage(result || "File uploaded successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to upload this file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2">
        <div className="punch-horizontal-scroll flex min-w-0 flex-1 flex-nowrap items-center gap-2 overflow-x-auto [touch-action:pan-x] 2xl:justify-end">
          <button type="button" className="flex shrink-0 items-center gap-1 whitespace-nowrap px-2 text-sm font-medium text-slate-600 hover:text-sky-500">
            <Plus size={15} /> Add Filter
          </button>
          {IMPORT_FILTERS.map((label) => (
            <DropdownSelect
              key={label}
              value={filterValues[label] ?? ""}
              onChange={(value) => setFilterValues((previous) => ({ ...previous, [label]: value }))}
              options={[{ label, value: "" }]}
              menuClassName="w-44"
              align={label === "Leave" ? "right" : "left"}
              portalMenu
              className="h-8 shrink-0 rounded-lg border border-slate-200 px-2 text-sm text-slate-600"
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1 border-l border-slate-100 pl-2">
          <button type="button" aria-label="More filters" className="flex h-8 w-8 items-center justify-center text-slate-500">
            <MoreVertical size={17} />
          </button>
          <button type="button" aria-label="Clear filters" onClick={() => setFilterValues({})} className="flex h-8 w-8 items-center justify-center text-red-500">
            <X size={19} />
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[#E7EAF2] px-4 py-3 text-center text-base font-semibold text-slate-900">{title}</div>

        {templateTypeOptions.length > 0 && (
          <div className="px-8 pt-5">
            <label className="flex flex-col items-start gap-1.5 text-sm font-medium text-slate-800">
              <span>Template Type<span className="text-red-500">*</span></span>
              <DropdownSelect
                value={templateType}
                onChange={setTemplateType}
                options={templateTypeOptions.map((option) => ({ label: option, value: option }))}
                className="h-10 min-w-[230px] justify-between rounded-lg border border-slate-200 px-3 text-sm text-slate-800"
              />
            </label>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-[minmax(0,2fr)_minmax(340px,1fr)]">
          <div className="flex flex-col">
            <label className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#B8B8B8] bg-white">
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(event) => { setFile(event.target.files?.[0] ?? null); setMessage(""); }} />
              <UploadCloud className="text-[#B8B8B8]" size={34} />
              {file ? (
                <p className="max-w-full truncate px-4 text-sm text-slate-700">{file.name}</p>
              ) : (
                <p className="text-center text-sm leading-6 text-[#B8B8B8]">
                  Drag and drop <br />- or -<br />
                  <span className="font-medium text-sky-500">Browse</span>
                </p>
              )}
            </label>
            <div className="mt-4 flex justify-end gap-3">
              <Button type="button" onClick={downloadTemplate} className="h-12 rounded-lg bg-slate-500 px-5 text-sm font-semibold text-white hover:bg-slate-600">
                Template
              </Button>
              <Button type="button" onClick={uploadSelectedFile} disabled={!file || !onUpload || uploading} className="h-12 rounded-lg bg-[#2196F3] px-5 text-sm font-semibold text-white hover:bg-[#1686D4] disabled:cursor-not-allowed disabled:opacity-60">
                {uploading ? "Uploading..." : "Upload File"}
              </Button>
            </div>
            {message && <p role="status" className="mt-2 text-right text-sm text-slate-600">{message}</p>}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <h3 className="bg-[#E7EAF2] px-5 py-4 text-base font-bold text-slate-900">
              <CheckCircle2 className="mr-3 inline-block align-middle text-slate-500" size={22} />
              File Requirement
            </h3>
            <div className="p-4">
              <div className="flex items-center gap-3 rounded-xl border border-[#C8DEC9] bg-[#F1F7F1] px-4 py-3 text-sm text-emerald-700">
                <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
                Selected file should be valid
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
