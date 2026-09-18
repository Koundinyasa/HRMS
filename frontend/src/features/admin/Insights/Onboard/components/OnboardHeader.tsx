









import { FileText, ArrowLeft, FileStack } from "lucide-react";

interface OnboardHeaderProps {
  title?: string;
  onBack: () => void;
}

export default function OnboardHeader({
  title = "Confirmation Letter",
  onBack,
}: OnboardHeaderProps) {
  return (
    <>
      <div className="rounded-lg border border-[#CBA79E] bg-[#FFF3F0] p-2.5">
        <div className="inline-flex items-center gap-2 rounded-md border border-[#CBA79E] bg-white px-4 py-2">
          <FileStack size={15} className="text-[#814A3C]" />
          <span className="text-sm font-medium text-[#814A3C]">Onboard Report</span>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded border border-[#814A3C]">
            <FileText size={13} className="text-[#814A3C]" />
          </div>
          <span className="text-sm font-medium text-[#353F4F]">{title}</span>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft size={13} />
          Back
        </button>
      </div>
    </>
  );
}