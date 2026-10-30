import { CalendarDays, Clock } from "lucide-react";
import { Label } from "@/components/ui/label";
import { MonthPicker } from "@/components/ui/monthpicker";

type EffectiveFromBarProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
};

export function EffectiveFromBar({
  value,
  onChange,
  id = "effectiveFrom",
}: EffectiveFromBarProps) {
  return (
    <div className="mb-6 rounded-xl bg-[#ECE7FF] p-3 sm:mb-8 sm:p-4">
      {/* Desktop: 3 equal columns → picker truly CENTER */}
      <div className="hidden items-center sm:grid sm:grid-cols-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#ECE7FF] bg-white">
            <CalendarDays className="h-5 w-5 text-[#7A5BED]" />
          </div>
          <Label htmlFor={id} className="text-[13px] font-medium leading-5 text-[#2E2E2E]">
            Effective From
          </Label>
        </div>

        <div className="flex justify-center">
          <div className="w-full max-w-[10rem]">
            <MonthPicker
              value={value}
              onChange={onChange}
              className="h-10 rounded-xl border-[#EDEDED]"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Clock className="h-5 w-5 text-[#626262]" />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-3 sm:hidden">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#ECE7FF] bg-white">
              <CalendarDays className="h-5 w-5 text-[#7A5BED]" />
            </div>
            <Label htmlFor={id} className="truncate text-[13px] font-medium leading-5 text-[#2E2E2E]">
              Effective From
            </Label>
          </div>
          <Clock className="h-5 w-5 shrink-0 text-[#626262]" />
        </div>
        <MonthPicker
          value={value}
          onChange={onChange}
          className="h-10 w-full rounded-xl border-[#EDEDED]"
        />
      </div>
    </div>
  );
}

export default EffectiveFromBar;