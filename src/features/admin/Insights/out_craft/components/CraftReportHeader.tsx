import { FileText, Plus, ShieldCheck, Clock3 } from "lucide-react";

interface CraftReportHeaderProps {
  onDownloadTemplate: () => void;
  onAddFile: () => void;
  onOpenPermissions: () => void;
  onOpenHistory: () => void;
}

export default function CraftReportHeader({
  onDownloadTemplate,
  onAddFile,
  onOpenPermissions,
  onOpenHistory,
}: CraftReportHeaderProps) {
  return (
    <div className="font-[Urbanist] mb-4 flex items-center justify-between rounded-md border border-[#c9a79d] bg-white px-3 py-2.5 shadow-sm flex-wrap min-w-0">
      <div className="font-[Urbanist] inline-flex items-center gap-2 rounded-md border border-[#c9a79d] bg-[#FDF1E9] px-4 py-2 flex-wrap min-w-0">
        <FileText size={16} className="font-[Urbanist] text-[#D97B3F]" />
        <span className="font-[Urbanist] text-[13px] font-semibold text-[#3F3F46]">
          Craft Report
        </span>
      </div>

      <div className="font-[Urbanist] flex items-center gap-2 flex-wrap min-w-0">
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="font-[Urbanist] inline-flex h-9 items-center gap-1.5 rounded-md border border-[#c9a79d] bg-white px-3.5 text-xs font-medium text-[#D97B3F] hover:bg-[#FDF1E9] flex-wrap min-w-0"
        >
          Download Template From Store
        </button>

        <button
          type="button"
          title="Add"
          onClick={onAddFile}
          className="font-[Urbanist] flex h-9 w-9 items-center justify-center rounded-md border border-[#c9a79d] bg-white text-slate-500 hover:bg-slate-50 flex-wrap min-w-0"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          title="Permissions"
          onClick={onOpenPermissions}
          className="font-[Urbanist] flex h-9 w-9 items-center justify-center rounded-md border border-[#c9a79d] bg-white text-slate-500 hover:bg-slate-50 flex-wrap min-w-0"
        >
          <ShieldCheck size={16} />
        </button>
        <button
          type="button"
          title="History"
          onClick={onOpenHistory}
          className="font-[Urbanist] flex h-9 w-9 items-center justify-center rounded-md border border-[#c9a79d] bg-white text-slate-500 hover:bg-slate-50 flex-wrap min-w-0"
        >
          <Clock3 size={16} />
        </button>
      </div>
    </div>
  );
}