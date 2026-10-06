import { ArrowLeft } from "lucide-react";

interface LeaveDailyHeaderProps {
  onBack?: () => void;
}

const LeaveDailyHeader = ({ onBack }: LeaveDailyHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-600 transition hover:bg-slate-100"
            aria-label="Go back"
          >
            <ArrowLeft size={18} strokeWidth={1.8} />
          </button>
        )}

        <div>
          <h1 className="font-[Urbanist] text-[20px] font-bold leading-[24px] text-slate-800">
            Daily
          </h1>

          <div className="mt-1 h-[2px] w-8 rounded-full bg-[#2563EB]" />
        </div>
      </div>
    </div>
  );
};

export default LeaveDailyHeader;
