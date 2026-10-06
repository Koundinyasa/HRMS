// import { useRef, useState } from "react";
// import { FileUp, Upload, X } from "lucide-react";

// interface AdjustmentImportProps {
//   onFileSelect?: (file: File) => void;
//   onUpload?: (file: File) => void;
// }

// const AdjustmentImport = ({
//   onFileSelect,
//   onUpload,
// }: AdjustmentImportProps) => {
//   const inputRef = useRef<HTMLInputElement>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const handleFile = (file?: File) => {
//     if (!file) return;

//     setSelectedFile(file);
//     onFileSelect?.(file);
//   };

//   const handleInputChange = (
//     event: React.ChangeEvent<HTMLInputElement>,
//   ) => {
//     handleFile(event.target.files?.[0]);
//   };

//   const handleRemove = () => {
//     setSelectedFile(null);

//     if (inputRef.current) {
//       inputRef.current.value = "";
//     }
//   };

//   const handleUpload = () => {
//     if (!selectedFile) return;

//     onUpload?.(selectedFile);
//   };

//   return (
//     <div className="w-full font-[Urbanist]">
//       {/* Upload area */}
//       <div
//         onClick={() => inputRef.current?.click()}
//         onDragOver={(event) => event.preventDefault()}
//         onDrop={(event) => {
//           event.preventDefault();
//           handleFile(event.dataTransfer.files?.[0]);
//         }}
//         className="flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-6 py-8 text-center transition hover:border-[#9a5547] hover:bg-slate-50"
//       >
//         <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
//           <Upload size={20} strokeWidth={1.8} className="text-slate-500" />
//         </div>

//         <p className="text-[13px] font-semibold text-slate-700">
//           Drag and drop your file here
//         </p>

//         <p className="mt-1 text-[12px] text-slate-400">
//           or
//         </p>

//         <span className="mt-2 text-[13px] font-semibold text-[#9a5547]">
//           Browse
//         </span>

//         <input
//           ref={inputRef}
//           type="file"
//           accept=".xlsx,.xls,.csv"
//           onChange={handleInputChange}
//           className="hidden"
//         />
//       </div>

//       {/* Selected file */}
//       {selectedFile && (
//         <div className="mt-4 flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3">
//           <div className="flex min-w-0 items-center gap-3">
//             <FileUp
//               size={18}
//               strokeWidth={1.8}
//               className="shrink-0 text-slate-500"
//             />

//             <div className="min-w-0">
//               <p className="truncate text-[13px] font-medium text-slate-700">
//                 {selectedFile.name}
//               </p>

//               <p className="text-[11px] text-slate-400">
//                 {(selectedFile.size / 1024).toFixed(1)} KB
//               </p>
//             </div>
//           </div>

//           <button
//             type="button"
//             onClick={handleRemove}
//             className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
//             aria-label="Remove file"
//           >
//             <X size={15} />
//           </button>
//         </div>
//       )}

//       {/* Actions */}
//       <div className="mt-4 flex items-center justify-end gap-2">
//         <button
//           type="button"
//           className="h-9 rounded-md border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 transition hover:bg-slate-50"
//         >
//           Template
//         </button>

//         <button
//           type="button"
//           onClick={handleUpload}
//           disabled={!selectedFile}
//           className="h-9 rounded-md bg-[#9a5547] px-4 text-[13px] font-semibold text-white transition hover:bg-[#7f4234] disabled:cursor-not-allowed disabled:opacity-50"
//         >
//           Upload File
//         </button>
//       </div>
//     </div>
//   );
// };

// export default AdjustmentImport;

import { useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  CloudUpload,
  MoreVertical,
  Plus,
  X,
} from "lucide-react";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

interface AdjustmentImportProps {
  onFileSelect?: (file: File) => void;
  onUpload?: (file: File) => void;
  showFilters?: boolean;
  onHideFilters?: () => void;
}

const AdjustmentImport = ({
  onFileSelect,
  onUpload,
  showFilters = true,
  onHideFilters,
}: AdjustmentImportProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [templateType, setTemplateType] = useState(
    "Leave Adjustment Configuration",
  );
  const [payMonth, setPayMonth] = useState("2026-09");
  const [query, setQuery] = useState("");

  const handleFile = (file: File) => {
    setSelectedFile(file);
    onFileSelect?.(file);
  };

  const handleBrowse = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];

    if (file) {
      handleFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload?.(selectedFile);
    }
  };

  return (
    <div className="w-full min-w-0 font-[Urbanist]">
      {/* =========================================================
          FILTER BAR
      ========================================================= */}
      {showFilters && <div className="mb-3 flex min-h-[48px] w-full min-w-0 flex-nowrap items-center overflow-x-auto rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm [scrollbar-color:#a45a4a_#f3e5e1] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-[#f3e5e1] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#a45a4a] xl:flex-wrap xl:overflow-x-visible xl:[scrollbar-width:none] xl:[&::-webkit-scrollbar]:hidden">
        {/* Filters */}
        <div className="flex w-max min-w-max shrink-0 flex-nowrap items-center gap-x-4 whitespace-nowrap xl:w-full xl:min-w-0 xl:flex-1 xl:flex-wrap">
          {/* Add Filter */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            <Plus size={19} strokeWidth={1.8} />
            Add Filter
          </button>

          {/* Query */}
          <LeaveQueryFilter value={query} onChange={setQuery} />

          {/* Branch */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            Branch
            <ChevronDown size={15} strokeWidth={1.8} />
          </button>

          {/* Salary Structure */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            Salary Structure
            <ChevronDown size={15} strokeWidth={1.8} />
          </button>

          {/* Leave */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            Leave
            <ChevronDown size={15} strokeWidth={1.8} />
          </button>

          {/* Attendance */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            Attendance
            <ChevronDown size={15} strokeWidth={1.8} />
          </button>

          {/* Designation */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            Designation
            <ChevronDown size={15} strokeWidth={1.8} />
          </button>

          {/* Employment Status */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1 text-[12px] font-medium text-slate-600"
          >
            Emp Status
            <ChevronDown size={15} strokeWidth={1.8} />
          </button>
        </div>

        {/* Right actions */}
        <div className="ml-3 flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label="More"
            className="text-[#929DBB]"
          >
            <MoreVertical size={21} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Close filters"
            onClick={() => {
              setQuery("");
              onHideFilters?.();
            }}
            className="text-red-500"
          >
            <X size={21} strokeWidth={1.8} />
          </button>
        </div>
      </div>}

      {/* =========================================================
          IMPORT CARD
      ========================================================= */}
      <div className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex h-[44px] items-center justify-center border-b border-[#ead2cc] bg-[#fff1ed]">
          <h2 className="text-[16px] font-semibold text-[#9a5547]">
            Leave Adjustment Configuration
          </h2>
        </div>

        {/* Main Content */}
          <div className="px-4 py-4 sm:px-7 sm:py-6">
          {/* Top Fields */}
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
            {/* Template Type */}
            <div className="w-full min-w-0 md:w-[332px] md:shrink-0">
              <label className="mb-1.5 block text-[16px] font-medium text-slate-800">
                Template Type<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={templateType}
                  onChange={(event) =>
                    setTemplateType(event.target.value)
                  }
                  className="h-[45px] w-full appearance-none rounded-md border border-slate-200 bg-white px-4 pr-10 text-[15px] font-medium text-slate-700 outline-none focus:border-[#9a5547]"
                >
                  <option value="Leave Adjustment Configuration">
                    Leave Adjustment Configuration
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            {/* Pay Month */}
            <div className="w-full min-w-0 md:w-[250px] md:shrink-0">
              <label className="mb-1.5 block text-[16px] font-medium text-slate-800">
                Pay Month<span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <select
                  value={payMonth}
                  onChange={(event) =>
                    setPayMonth(event.target.value)
                  }
                  className="h-[45px] w-full appearance-none rounded-md border border-slate-200 bg-white px-4 pr-10 text-[15px] font-medium text-slate-700 outline-none focus:border-[#9a5547]"
                >
                  <option value="2026-09">Sep/2026</option>
                </select>

                <ChevronDown
                  size={16}
                  strokeWidth={1.8}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Upload + Requirements */}
          <div className="mt-6 flex flex-col items-stretch gap-6 lg:mt-8 lg:flex-row lg:items-start lg:gap-12">
            {/* Upload Area */}
            <div className="flex min-w-0 flex-1 flex-col">
              <div
                onDragOver={(event) => event.preventDefault()}
                onDrop={handleDrop}
                onClick={handleBrowse}
                className="flex h-[225px] cursor-pointer items-center justify-center rounded-md border border-dashed border-slate-400 bg-white transition hover:bg-slate-50"
              >
                <div className="flex flex-col items-center justify-center">
                  <CloudUpload
                    size={30}
                    strokeWidth={1.6}
                    className="mb-2 text-slate-400"
                  />

                  {selectedFile ? (
                    <>
                      <p className="text-[15px] font-medium text-slate-700">
                        {selectedFile.name}
                      </p>

                      <p className="mt-1 text-[14px] text-slate-400">
                        Click to change file
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[16px] font-medium text-slate-400">
                        Drag and drop
                      </p>

                      <p className="my-1 text-[15px] text-slate-400">
                        - or -
                      </p>

                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleBrowse();
                        }}
                        className="text-[16px] font-semibold text-[#9a5547]"
                      >
                        Browse
                      </button>
                    </>
                  )}
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Bottom Actions */}
              <div className="mt-5 flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  className="h-[47px] rounded-md bg-[#707C8E] px-6 text-[16px] font-semibold text-white transition hover:bg-[#626E80]"
                >
                  Template
                </button>

                <button
                  type="button"
                  onClick={handleUpload}
                  disabled={!selectedFile}
                  className="h-[47px] rounded-md bg-[#9b503c] px-6 text-[16px] font-semibold text-white transition hover:bg-[#854331] disabled:cursor-not-allowed"
                >
                  Upload File
                </button>
              </div>
            </div>

            {/* File Requirement */}
            <div className="w-full min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:w-[38%] lg:min-w-[320px] lg:shrink-0">
              {/* Requirement Header */}
              <div className="flex h-[56px] items-center gap-3 border-b border-[#ead2cc] bg-[#fff1ed] px-6">
                <CheckCircle2
                  size={23}
                  strokeWidth={1.7}
                  className="text-[#9a5547]"
                />

                <h3 className="text-[17px] font-semibold text-[#9a5547]">
                  File Requirement
                </h3>
              </div>

              {/* Requirement Items */}
              <div className="space-y-2 px-4 py-3">
                <div className="flex h-[46px] items-center gap-3 rounded-xl border border-[#C9D8D1] bg-[#F2F8F4] px-4">
                  <CheckCircle2
                    size={19}
                    strokeWidth={1.8}
                    className="text-[#38C69A]"
                  />

                  <span className="text-[15px] font-medium text-[#269A7B]">
                    Selected file should be valid
                  </span>
                </div>

                <div className="flex h-[46px] items-center gap-3 rounded-xl border border-[#C9D8D1] bg-[#F2F8F4] px-4">
                  <CheckCircle2
                    size={19}
                    strokeWidth={1.8}
                    className="text-[#38C69A]"
                  />

                  <span className="text-[15px] font-medium text-[#269A7B]">
                    Month Should Match
                  </span>
                </div>
              </div>

              <div className="h-[110px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdjustmentImport;
