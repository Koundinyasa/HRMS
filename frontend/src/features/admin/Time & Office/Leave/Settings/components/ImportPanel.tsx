import {
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  FileSpreadsheet,
  MoreVertical,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

export interface ImportResult {
  fileName?: string;
  totalRecords?: number;
  successRecords?: number;
  failedRecords?: number;
}

interface ImportPanelProps {
  acceptedFileTypes?: string;
  maxFileSizeMb?: number;

  onFileSelect?: (file: File | null) => void;
  onImport?: (file: File) => void;
  onDownloadTemplate?: () => void;

  importing?: boolean;
  loading?: boolean;

  result?: ImportResult | null;
}

export default function ImportPanel({
  acceptedFileTypes = ".xlsx,.xls,.csv",
  maxFileSizeMb = 10,
  onFileSelect,
  onImport,
  onDownloadTemplate,
  importing = false,
  loading = false,
  result = null,
}: ImportPanelProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [error, setError] =
    useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState("");

  const disabled = loading || importing;

  const handleFile = (file: File | null) => {
    setError("");

    if (!file) {
      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    const maxSize =
      maxFileSizeMb * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        `File size should not exceed ${maxFileSizeMb} MB.`,
      );

      setSelectedFile(null);
      onFileSelect?.(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleDrop = (event: React.DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0] ?? null);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file =
      event.target.files?.[0] ?? null;

    handleFile(file);
  };

  const handleImport = () => {
    if (!selectedFile || disabled) return;

    onImport?.(selectedFile);
  };

  const handleBrowse = () => {
    if (disabled) return;

    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    if (disabled) return;

    setSelectedFile(null);
    setError("");

    onFileSelect?.(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-3 bg-[#F4F6FA] font-[Urbanist] text-[#182237]">
      <div id="leave-import-filters" className="min-w-0 overflow-x-auto rounded-[8px] border border-[#E3E7EE] bg-white px-4 py-2 shadow-[0_2px_7px_rgba(16,24,40,0.04)]">
        <div className="flex min-h-[32px] w-max min-w-full items-center justify-end gap-5">
          <button type="button" className="flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[#626874]">
            <span className="text-[23px] font-normal">+</span> Add Filter
          </button>
          <LeaveQueryFilter value={query} onChange={setQuery} />
          {["Branch", "Salary Structure", "Leave", "Attendance", "Designation", "Emp Status"].map((label) => (
            <button key={label} type="button" className="flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[#626874] hover:text-[#168DCC]">
              {label}<ChevronDown size={15} />
            </button>
          ))}
          <button type="button" aria-label="More filters" className="text-[#8795AB]"><MoreVertical size={21} /></button>
          <button type="button" aria-label="Clear query" onClick={() => setQuery("")} className="text-[#E33C4B]"><X size={22} /></button>
        </div>
      </div>

      <section className="min-w-0 overflow-hidden rounded-[8px] border border-[#E3E7EE] bg-white shadow-[0_2px_7px_rgba(16,24,40,0.04)]">
        <div className="flex min-h-[45px] items-center justify-center bg-[#E5E9F1] px-3 text-center text-[16px] font-semibold text-[#182237]">
          Leave Opening Balance
        </div>

        <div className="p-4 sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
            <div className="flex min-w-0 flex-1 flex-col">
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedFileTypes}
                onChange={handleInputChange}
                className="hidden"
                disabled={disabled}
              />

              <button
                type="button"
                onClick={handleBrowse}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                disabled={disabled}
                className={`flex h-[228px] w-full flex-col items-center justify-center rounded-[7px] border-2 border-dashed px-4 text-center transition disabled:cursor-not-allowed ${isDragging ? "border-[#269BD7] bg-[#F2F9FD]" : "border-[#B7B7B7] bg-white hover:bg-[#FAFBFD]"}`}
              >
                <CloudUpload size={27} className="text-[#B7BBC1]" />
                <span className="mt-2 max-w-full truncate text-[16px] font-semibold text-[#A7AAB0]">
                  {selectedFile?.name ?? "Drag and drop"}
                </span>
                {!selectedFile && <>
                  <span className="text-[16px] font-semibold text-[#A7AAB0]">- or -</span>
                  <span className="text-[16px] font-bold text-[#269BD7]">Browse</span>
                </>}
                {selectedFile && <span className="mt-1 text-[13px] text-[#7B8492]">Click to change file</span>}
              </button>

              {error && <p role="alert" className="mt-2 text-[13px] text-[#C94A4A]">{error}</p>}

              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={onDownloadTemplate}
                  disabled={!onDownloadTemplate || disabled}
                  className="h-[47px] rounded-[7px] bg-[#707C8E] px-6 text-[16px] font-semibold text-white transition hover:bg-[#626E80] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Template
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!selectedFile || !onImport || disabled}
                  className="flex h-[47px] items-center gap-2 rounded-[7px] bg-[#269BD7] px-6 text-[16px] font-semibold text-white transition hover:bg-[#208BC3] disabled:cursor-not-allowed"
                >
                  {importing && <Upload size={18} />}
                  {importing ? "Uploading..." : "Upload File"}
                </button>
              </div>
            </div>

            <aside className="w-full min-w-0 overflow-hidden rounded-[14px] border border-[#E1E4E9] bg-white shadow-[0_3px_8px_rgba(16,24,40,0.06)] lg:w-[36%] lg:min-w-[320px]">
              <div className="flex min-h-[57px] items-center gap-3 border-b border-[#E1E4E9] bg-[#E5E9F1] px-6 py-3 text-[17px] font-bold text-[#182237]">
                <CheckCircle2 size={24} className="text-[#8B929D]" />
                File Requirement
              </div>
              <div className="p-4">
                <div className={`flex min-h-[46px] items-center gap-3 rounded-[12px] border px-4 py-2 text-[15px] font-medium ${error ? "border-[#E7C6C6] bg-[#FFF5F5] text-[#C94A4A]" : "border-[#C9D8D1] bg-[#F2F8F4] text-[#269A7B]"}`}>
                  <CheckCircle2 size={20} className={error ? "text-[#C94A4A]" : "text-[#38C69A]"} />
                  {error || "Selected file should be valid"}
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center gap-2 text-[13px] text-[#667085]">
                    <FileSpreadsheet size={16} />
                    <span className="truncate">{selectedFile.name}</span>
                    <button type="button" onClick={handleRemove} disabled={disabled} className="ml-auto shrink-0 font-semibold text-[#C94A4A] hover:underline disabled:opacity-50">Remove</button>
                  </div>
                )}
              </div>
              {result && (
                <div className="grid grid-cols-2 gap-3 px-4 pb-4 text-[13px]">
                  <span>Total: {result.totalRecords ?? 0}</span>
                  <span>Uploaded: {result.successRecords ?? 0}</span>
                  <span>Failed: {result.failedRecords ?? 0}</span>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}