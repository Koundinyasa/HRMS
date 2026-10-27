import {
  CheckCircle2,
  ChevronDown,
  ClockFading,
  CloudUpload,
  Filter,
  MoreVertical,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import LeaveQueryFilter from "../../components/LeaveQueryFilter";

const LeaveDailyImportPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [query, setQuery] = useState("");

  const handleFileSelect = (file?: File) => {
    if (!file) return;
    setSelectedFile(file);
  };

  return (
    <div className="flex w-full min-w-0 flex-col gap-3 bg-[#f6f8fb] font-[Urbanist] text-[#101828]">
      <div className="flex min-h-[74px] min-w-0 flex-nowrap items-center justify-between gap-3 overflow-x-auto rounded-[10px] border border-[#df8d7c] bg-[#fff7f5] px-3 py-3 shadow-[0_1px_3px_rgba(15,23,42,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible sm:px-5">
        <nav className="flex shrink-0 items-center gap-3 sm:gap-12">
          <NavLink to="../apply-leave" className="text-[18px] font-semibold text-[#9a5547] hover:text-[#7f4234]">Apply Leave</NavLink>
          <NavLink to="../import" className="inline-flex h-[46px] items-center rounded-[9px] border border-[#df8d7c] bg-white px-4 text-[20px] font-bold text-[#9a5547] shadow-sm">Import</NavLink>
        </nav>
        <div className="flex shrink-0 items-center gap-5 text-[#7e91ad]">
          <button type="button" aria-label="Filter" className="hover:text-[#168dcc]"><Filter size={24} /></button>
          <button type="button" aria-label="History" className="hover:text-[#168dcc]"><ClockFading size={23} /></button>
        </div>
      </div>

      <div className="min-w-0 overflow-x-auto rounded-[7px] border border-[#e3e7ee] bg-white px-3 py-2 shadow-[0_2px_7px_rgba(16,24,40,0.04)] [scrollbar-color:#c58b7f_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#c58b7f] xl:overflow-x-visible sm:px-5">
        <div className="flex min-h-[40px] w-max min-w-full flex-nowrap items-center justify-start gap-x-4 sm:gap-5 xl:w-full xl:flex-wrap xl:justify-end">
        <button type="button" className="flex items-center gap-2 text-[16px] font-semibold text-[#626874]"><span className="text-[23px] font-normal">+</span> Add Filter</button>
        <LeaveQueryFilter value={query} onChange={setQuery} />
        {["Branch", "Salary Structure", "Leave", "Attendance", "Designation", "Emp Status"].map((label) => (
          <button type="button" key={label} className="flex items-center gap-2 whitespace-nowrap text-[15px] font-semibold text-[#626874] hover:text-[#168dcc]">{label}<ChevronDown size={15} /></button>
        ))}
        <button type="button" aria-label="More filters" className="text-[#8795ab]"><MoreVertical size={21} /></button>
        <button type="button" aria-label="Clear filters" className="text-[#e33c4b]"><X size={22} /></button>
        </div>
      </div>

      <section className="overflow-hidden rounded-[7px] border border-[#e3e7ee] bg-white shadow-[0_2px_7px_rgba(16,24,40,0.04)]">
        <div className="flex h-[45px] items-center justify-center bg-[#fff1ed] text-[17px] font-semibold text-[#9a5547]">Daily Attendance</div>

        <div className="p-4 sm:p-7">
          <div className="flex flex-wrap gap-8">
            {[
              { label: "Template Type", value: "Daily Attendance", required: true },
              { label: "Leave Policy", value: "Employee Leave Policy", required: true },
              { label: "Pay Month", value: "Sep/2026", required: true },
            ].map(({ label, value, required }) => (
              <label key={label} className="flex w-full max-w-[280px] flex-1 flex-col gap-1 text-[16px] font-semibold text-[#182237] sm:min-w-[205px] sm:flex-none sm:w-[205px]">
                <span>{label}{required && <b className="ml-1 font-semibold text-[#e34b61]">*</b>}</span>
                <span className="relative">
                  <select defaultValue={value} className="h-[46px] w-full appearance-none rounded-[6px] border border-[#e5e8ed] bg-white px-4 text-[16px] font-medium text-[#263246] outline-none focus:border-[#9a5547] focus:ring-2 focus:ring-[#f8e4df]">
                    <option>{value}</option>
                  </select>
                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#717985]" />
                </span>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-6 lg:mt-8 lg:flex-row lg:gap-12">
            <div className="flex min-w-0 flex-1 flex-col">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFileSelect(event.dataTransfer.files[0]); }}
                className={`flex h-[228px] flex-col items-center justify-center rounded-[7px] border-2 border-dashed text-center transition ${isDragging ? "border-[#9a5547] bg-[#fff7f5]" : "border-[#b7b7b7] bg-white"}`}
              >
                <CloudUpload size={27} className="text-[#c6c9cc]" />
                <span className="mt-2 text-[17px] font-semibold text-[#b6b8bc]">{selectedFile ? selectedFile.name : "Drag and drop"}</span>
                {!selectedFile && <><span className="text-[17px] font-semibold text-[#b6b8bc]">- or -</span><span className="text-[17px] font-bold text-[#9a5547]">Browse</span></>}
              </button>
              <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" onChange={(event) => handleFileSelect(event.target.files?.[0])} className="hidden" />
              <div className="mt-5 flex justify-end gap-3">
                <button type="button" disabled={!selectedFile} className="h-12 rounded-[7px] bg-[#aab1bd] px-5 text-[17px] font-semibold text-white disabled:opacity-80">Template</button>
                <button type="button" disabled={!selectedFile} className="h-12 rounded-[7px] bg-[#914f3f] px-5 text-[17px] font-semibold text-white transition hover:bg-[#7f4234] disabled:cursor-not-allowed disabled:opacity-100">Upload File</button>
              </div>
            </div>

            <aside className="w-full min-w-0 overflow-hidden rounded-[16px] border border-[#e1e4e9] shadow-[0_3px_8px_rgba(16,24,40,0.06)] lg:w-[36%] lg:min-w-[320px]">
              <div className="flex items-center gap-3 bg-[#fff1ed] px-6 py-4 text-[17px] font-bold text-[#9a5547]"><CheckCircle2 size={24} className="text-[#9a5547]" /> File Requirement</div>
              <div className="flex flex-col gap-2 p-4">
                {["Selected file should be valid", "Leave Policy Name is Mismatch", "Month Should Match"].map((message) => (
                  <div key={message} className="flex items-center gap-3 rounded-[12px] border border-[#c6d4cc] bg-[#f1f8f3] px-4 py-3 text-[16px] font-medium text-[#25946e]"><CheckCircle2 size={21} /> {message}</div>
                ))}
              </div>
            </aside>
          </div>
        </div>
    </section>
  </div>
  );
};

export default LeaveDailyImportPage;
