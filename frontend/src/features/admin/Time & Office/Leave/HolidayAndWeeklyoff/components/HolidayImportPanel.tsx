import { useRef, useState } from "react";
import { UploadCloud, Check, X as XIcon, FileDown, UploadCloud as UploadIcon } from "lucide-react";
import { useGetHolidayMastersQuery, useImportHolidaysMutation } from "../api/holidaySettingsApi";

type RequirementStatus = "pending" | "pass" | "fail";

interface RequirementState {
  validFile: RequirementStatus;
  calendarYearMatch: RequirementStatus;
  holidayListNameMatch: RequirementStatus;
}

const INITIAL_REQUIREMENTS: RequirementState = {
  validFile: "pending",
  calendarYearMatch: "pending",
  holidayListNameMatch: "pending",
};

function RequirementRow({ label, status }: { label: string; status: RequirementStatus }) {
  const styles =
    status === "pass"
      ? "bg-emerald-50 text-emerald-700"
      : status === "fail"
      ? "bg-red-50 text-red-700"
      : "bg-slate-50 text-slate-500";

  const Icon = status === "fail" ? XIcon : Check;

  return (
    <div className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm ${styles}`}>
      <Icon size={14} className={status === "pass" ? "text-emerald-500" : status === "fail" ? "text-red-500" : "text-slate-400"} />
      {label}
    </div>
  );
}

export default function HolidayImportPanel() {
  const { data: masters } = useGetHolidayMastersQuery();
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const activeMasterId = selectedMasterId ?? masters?.[0]?.id ?? 0;

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [requirements, setRequirements] = useState<RequirementState>(INITIAL_REQUIREMENTS);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [importHolidays, { isLoading: isUploading }] = useImportHolidaysMutation();

  const resetRequirements = () => {
    setRequirements(INITIAL_REQUIREMENTS);
    setErrorMessage(null);
  };

  const handleFileSelect = (selected: File | null) => {
    setFile(selected);
    resetRequirements();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0] ?? null;
    handleFileSelect(dropped);
  };

  const handleBrowseClick = () => fileInputRef.current?.click();

  const handleTemplateDownload = () => {
    // ⚠️ ASSUMED static asset — swap for a blob download if a backend
    // template endpoint exists (e.g. GET .../holidaysettings/template).
    const link = document.createElement("a");
    link.href = "/templates/holiday-import-template.xlsx";
    link.download = "holiday-import-template.xlsx";
    link.click();
  };

  const handleUpload = async () => {
    if (!file || !activeMasterId) return;
    setErrorMessage(null);

    // Optimistic client-side check for "Selected file should be valid"
    const isExcel = /\.(xlsx|xls|csv)$/i.test(file.name);
    if (!isExcel) {
      setRequirements((r) => ({ ...r, validFile: "fail" }));
      return;
    }
    setRequirements((r) => ({ ...r, validFile: "pass" }));

    try {
      await importHolidays({ masterId: activeMasterId, file }).unwrap();
      setRequirements({
        validFile: "pass",
        calendarYearMatch: "pass",
        holidayListNameMatch: "pass",
      });
      setFile(null);
    } catch (err: any) {
      // ⚠️ ASSUMED error shape — adjust field names to match the real
      // backend error payload for /holidaysettings/import once known.
      const code: string | undefined = err?.data?.code;
      setRequirements((r) => ({
        ...r,
        calendarYearMatch: code === "CALENDAR_YEAR_MISMATCH" ? "fail" : r.calendarYearMatch,
        holidayListNameMatch: code === "HOLIDAY_LIST_NAME_MISMATCH" ? "fail" : r.holidayListNameMatch,
      }));
      setErrorMessage(err?.data?.message ?? "Import failed. Please check the file and try again.");
    }
  };

  return (
    <div className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3 text-center text-sm font-semibold text-slate-700">
        Holiday List
      </div>

      <div className="p-5">
        <div className="mb-4 w-56">
          <label className="mb-1 block text-xs font-medium text-slate-600">Select</label>
          <select
            value={activeMasterId}
            onChange={(e) => setSelectedMasterId(Number(e.target.value))}
            className="h-9 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-700"
          >
            {(masters ?? []).map((m) => (
              <option key={m.id} value={m.id}>{m.label}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Drop zone */}
          <div className="flex-1">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`flex h-56 flex-col items-center justify-center rounded-xl border-2 border-dashed text-sm ${
                isDragging ? "border-blue-300 bg-blue-50" : "border-slate-200 bg-white"
              }`}
            >
              <UploadCloud size={28} className="mb-2 text-slate-300" />
              {file ? (
                <p className="font-medium text-slate-700">{file.name}</p>
              ) : (
                <>
                  <p className="text-slate-400">Drag and drop</p>
                  <p className="my-1 text-slate-300">- or -</p>
                  <button onClick={handleBrowseClick} className="font-medium text-blue-500 hover:underline">
                    Browse
                  </button>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
            </div>

            {errorMessage && (
              <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
            )}

            <div className="mt-4 flex justify-end gap-3">
              <button
                onClick={handleTemplateDownload}
                className="flex items-center gap-1.5 rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
              >
                <FileDown size={14} /> Template
              </button>
              <button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="flex items-center gap-1.5 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-60"
              >
                <UploadIcon size={14} /> {isUploading ? "Uploading…" : "Upload File"}
              </button>
            </div>
          </div>

          {/* Requirements panel */}
          <div className="w-full shrink-0 rounded-xl border border-slate-100 lg:w-72">
            <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              File Requirement
            </div>
            <div className="space-y-2 p-3">
              <RequirementRow label="Selected file should be valid" status={requirements.validFile} />
              <RequirementRow label="Calendar Year is Mismatch" status={requirements.calendarYearMatch} />
              <RequirementRow label="Holiday List Name Mismatch" status={requirements.holidayListNameMatch} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}