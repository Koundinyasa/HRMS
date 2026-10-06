import { useState } from "react";
import { CheckCircle2, Plus, UploadCloud, X } from "lucide-react";

const IMPORT_FILTERS = ["Query", "Branch", "Salary Structure", "Leave", "Attendance", "Designation", "Emp Status"];

/** Drag-and-drop import shell shared by Masters > Import and Assign > Import. */
export default function ImportPanel({ title }: { title: string }) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap rounded-xl border border-slate-100 bg-white px-3 py-2">
        <button type="button" className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-emerald-600">
          <Plus size={14} /> Add Filter
        </button>
        {IMPORT_FILTERS.map((label) => (
          <button key={label} type="button" className="h-8 rounded-lg border border-slate-200 px-3 text-sm text-slate-600 flex items-center gap-1">
            {label}
          </button>
        ))}
        <X size={16} className="text-red-500 ml-auto" />
      </div>

      <div className="text-center text-sm font-semibold text-slate-700 pt-2">{title}</div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-4">
        <label className="flex flex-col items-center justify-center gap-2 min-h-[220px] rounded-xl border-2 border-dashed border-slate-200 bg-white cursor-pointer">
          <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          <UploadCloud className="text-slate-300" size={36} />
          {file ? (
            <p className="text-sm text-slate-700">{file.name}</p>
          ) : (
            <p className="text-sm text-slate-400">
              Drag and drop <br />- or -<br />
              <span className="text-emerald-600 font-medium">Browse</span>
            </p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="h-9 px-4 rounded-lg border border-slate-200 text-sm text-slate-400 flex items-center">Template</span>
            <span className="h-9 px-4 rounded-lg bg-emerald-300 text-white text-sm flex items-center">Upload File</span>
          </div>
        </label>

        <div className="bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-semibold text-slate-800 bg-[#EAF1FE] px-4 py-3 rounded-t-xl">File Requirement</h3>
          <div className="p-4 flex items-center gap-2 text-sm text-emerald-600">
            <CheckCircle2 size={16} /> The Selected File Should be Valid
          </div>
        </div>
      </div>
    </>
  );
}
