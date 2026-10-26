import { CheckCircle2, ChevronDown, CloudUpload, MoreVertical, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getLeaveDailyErrorMessage,
  useImportDailyLeaveMutation,
} from "../api";
import LeaveDailyTabs from "../components/LeaveDailyTabs";
import { useDailyMonths, useDailyPolicies } from "../hooks/useLeaveDaily";
import { useLeaveDailyToast } from "../components/LeaveDailyToast";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const getCurrentMonthValue = () => {
  const now = new Date();
  return `${MONTH_LABELS[now.getMonth()]}/${now.getFullYear()}`;
};

/** EDIT THIS LIST to match the template types your backend accepts */
const IMPORT_TEMPLATE_TYPES = [{ label: "Daily Attendance", value: "DailyAttendance" }];

const ACCEPTED_EXTENSIONS = [".xlsx", ".xls", ".csv"];

const isAcceptedFile = (file: File) =>
  ACCEPTED_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext));

const FILTER_LABELS = ["Branch", "Salary Structure", "Leave", "Attendance", "Designation", "Emp Status"];

const scrollbar =
  "[scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f]";

const selectClass =
  "h-[46px] w-full appearance-none rounded-[6px] border border-[#e5e8ed] bg-white px-4 pr-10 text-[16px] font-medium text-[#263246] outline-none focus:border-[#9a5547] focus:ring-2 focus:ring-[#f8e4df] disabled:opacity-60";

const fieldClass =
  "flex w-full max-w-[280px] flex-1 flex-col gap-1 text-[16px] font-semibold text-[#182237] sm:w-[205px] sm:min-w-[205px] sm:flex-none";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const LeaveDailyImportPage = () => {
  // /…/leave/daily/import  →  /…/leave/daily

  const { showToast, toastNode } = useLeaveDailyToast();
  const { policies, loading: policiesLoading } = useDailyPolicies();
  const [importLeave, { isLoading: uploading }] = useImportDailyLeaveMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [templateType, setTemplateType] = useState(IMPORT_TEMPLATE_TYPES[0].value);
  const [policyId, setPolicyId] = useState("");
  const [month, setMonth] = useState(getCurrentMonthValue);

  // Pay Month dropdown: months from the backend (same list as the Daily page)
  const { months: apiMonths } = useDailyMonths();
  const monthOptions = useMemo(
    () => (apiMonths.length > 0 ? apiMonths : [{ label: month, value: month }]),
    [apiMonths, month],
  );
  useEffect(() => {
    if (apiMonths.length === 0 || apiMonths.some((option) => option.value === month)) return;
    const current = getCurrentMonthValue();
    setMonth(
      apiMonths.some((option) => option.value === current)
        ? current
        : apiMonths[apiMonths.length - 1].value,
    );
  }, [apiMonths, month]);

  // Pick the first policy once the list arrives
  useEffect(() => {
    if (!policyId && policies.length > 0) setPolicyId(policies[0].value);
  }, [policies, policyId]);

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    if (!isAcceptedFile(file)) {
      showToast("Please choose an .xlsx, .xls or .csv file", "error");
      return;
    }
    setSelectedFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showToast("Please choose a file to upload", "error");
      return;
    }
    const numericPolicyId = Number(policyId);
    if (!policyId || !Number.isFinite(numericPolicyId)) {
      showToast("Please select a Leave Policy", "error");
      return;
    }
    try {
      await importLeave({
        file: selectedFile,
        templateType,
        policyId: numericPolicyId,
        month,
      }).unwrap();
      showToast("File uploaded successfully");
      clearFile();
    } catch (err) {
      showToast(getLeaveDailyErrorMessage(err), "error");
    }
  };

  const requirements = [
    { text: "Selected file should be valid", ok: selectedFile !== null },
    { text: "Leave Policy Name should match", ok: true },
    { text: "Month should match", ok: true },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 bg-[#f6f8fb] font-[Urbanist] text-[#101828]">
      {/* Top bar: same tabs + same bar style as the Apply Leave page (no jump when switching) */}
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-xl border border-[#f0cbc1] bg-gradient-to-r from-[#fff3ef] to-[#fffaf8] px-3 py-3 shadow-[0_1px_2px_rgba(145,79,63,0.08)] sm:px-5">
        <LeaveDailyTabs />
      </div>

      {/* Filter row */}
      <div className={`min-w-0 overflow-x-auto rounded-[7px] border border-[#e3e7ee] bg-white px-3 py-2 shadow-[0_2px_7px_rgba(16,24,40,0.04)] xl:overflow-x-visible sm:px-5 ${scrollbar}`}>
        <div className="flex min-h-[40px] w-max min-w-full flex-nowrap items-center justify-start gap-x-4 sm:gap-5 xl:w-full xl:flex-wrap xl:justify-end">
          {FILTER_LABELS.map((label) => (
            <button
              type="button"
              key={label}
              className="flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[#626874] hover:text-[#914f3f]"
            >
              {label}
              <ChevronDown size={15} />
            </button>
          ))}
          <button type="button" aria-label="More filters" className="text-[#8795ab] hover:text-[#914f3f]">
            <MoreVertical size={21} />
          </button>
          <button type="button" aria-label="Clear filters" className="text-[#e33c4b]">
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Import card */}
      <section className="overflow-hidden rounded-[7px] border border-[#e3e7ee] bg-white shadow-[0_2px_7px_rgba(16,24,40,0.04)]">
        <div className="flex h-[45px] items-center justify-center bg-[#fff1ed] text-[17px] font-semibold text-[#9a5547]">
          Daily Attendance
        </div>

        <div className="p-4 sm:p-7">
          {/* Selectors */}
          <div className="flex flex-wrap gap-8">
            <label className={fieldClass}>
              <span>Template Type<b className="ml-1 font-semibold text-[#e34b61]">*</b></span>
              <span className="relative">
                <select value={templateType} onChange={(event) => setTemplateType(event.target.value)} className={selectClass}>
                  {IMPORT_TEMPLATE_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#717985]" />
              </span>
            </label>

            <label className={fieldClass}>
              <span>Leave Policy<b className="ml-1 font-semibold text-[#e34b61]">*</b></span>
              <span className="relative">
                <select
                  value={policyId}
                  onChange={(event) => setPolicyId(event.target.value)}
                  disabled={policiesLoading}
                  className={selectClass}
                >
                  {policies.length === 0 && (
                    <option value="">{policiesLoading ? "Loading…" : "No policies found"}</option>
                  )}
                  {policies.map((policy) => (
                    <option key={policy.value} value={policy.value}>{policy.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#717985]" />
              </span>
            </label>

            <label className={fieldClass}>
              <span>Pay Month<b className="ml-1 font-semibold text-[#e34b61]">*</b></span>
              <span className="relative">
                <select value={month} onChange={(event) => setMonth(event.target.value)} className={selectClass}>
                  {monthOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#717985]" />
              </span>
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-12">
            {/* Drop zone + buttons */}
            <div className="flex min-w-0 flex-1 flex-col">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  handleFileSelect(event.dataTransfer.files[0]);
                }}
                className={`flex h-[228px] flex-col items-center justify-center rounded-[7px] border-2 border-dashed text-center transition ${
                  isDragging ? "border-[#9a5547] bg-[#fff7f5]" : "border-[#b7b7b7] bg-white"
                }`}
              >
                <CloudUpload size={27} className="text-[#c6c9cc]" />
                <span className="mt-2 max-w-full truncate px-4 text-[17px] font-semibold text-[#b6b8bc]">
                  {selectedFile ? selectedFile.name : "Drag and drop"}
                </span>
                {!selectedFile && (
                  <>
                    <span className="text-[17px] font-semibold text-[#b6b8bc]">- or -</span>
                    <span className="text-[17px] font-bold text-[#9a5547]">Browse</span>
                  </>
                )}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_EXTENSIONS.join(",")}
                onChange={(event) => handleFileSelect(event.target.files?.[0])}
                className="hidden"
              />
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  disabled
                  title="Template download is not available yet"
                  className="h-12 cursor-not-allowed rounded-[7px] bg-[#aab1bd] px-5 text-[17px] font-semibold text-white"
                >
                  Template
                </button>
                <button
                  type="button"
                  onClick={() => void handleUpload()}
                  disabled={!selectedFile || uploading}
                  className="h-12 rounded-[7px] bg-[#914f3f] px-5 text-[17px] font-semibold text-white transition hover:bg-[#7f4234] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading ? "Uploading…" : "Upload File"}
                </button>
              </div>
            </div>

            {/* File requirement */}
            <aside className="w-full min-w-0 overflow-hidden rounded-[16px] border border-[#e1e4e9] shadow-[0_3px_8px_rgba(16,24,40,0.06)] lg:w-[36%] lg:min-w-[320px]">
              <div className="flex items-center gap-3 bg-[#fff1ed] px-6 py-4 text-[17px] font-bold text-[#9a5547]">
                <CheckCircle2 size={24} className="text-[#9a5547]" /> File Requirement
              </div>
              <div className="flex flex-col gap-2 p-4">
                {requirements.map(({ text, ok }) => (
                  <div
                    key={text}
                    className={`flex items-center gap-3 rounded-[12px] border px-4 py-3 text-[16px] font-medium ${
                      ok
                        ? "border-[#c6d4cc] bg-[#f1f8f3] text-[#25946e]"
                        : "border-[#e1e4e9] bg-[#f6f8fb] text-[#8a94ad]"
                    }`}
                  >
                    <CheckCircle2 size={21} /> {text}
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {toastNode}
    </div>
  );
};

export default LeaveDailyImportPage;