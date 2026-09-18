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
    <div className="mb-4 flex items-center justify-between rounded-md border border-[#F3D9C9] bg-white px-3 py-2.5 shadow-sm">
      <div className="inline-flex items-center gap-2 rounded-md border border-[#F3D9C9] bg-[#FDF1E9] px-4 py-2">
        <FileText size={16} className="text-[#D97B3F]" />
        <span className="text-[13px] font-semibold text-[#3F3F46]">
          Craft Report
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onDownloadTemplate}
          className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[#F3D9C9] bg-white px-3.5 text-xs font-medium text-[#D97B3F] hover:bg-[#FDF1E9]"
        >
          Download Template From Store
        </button>

        <button
          type="button"
          title="Add"
          onClick={onAddFile}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          title="Permissions"
          onClick={onOpenPermissions}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <ShieldCheck size={16} />
        </button>
        <button
          type="button"
          title="History"
          onClick={onOpenHistory}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        >
          <Clock3 size={16} />
        </button>
      </div>
    </div>
  );
}