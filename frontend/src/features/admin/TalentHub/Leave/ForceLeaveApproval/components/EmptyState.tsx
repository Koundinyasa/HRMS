import { HelpCircle, Monitor } from "lucide-react";

interface EmptyStateProps {
  message: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20">
      <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-50">
        <Monitor size={40} className="text-slate-300" />
        <HelpCircle size={18} className="absolute -left-2 top-2 text-pink-300" />
      </div>
      <p className="text-sm font-medium text-rose-400">{message}</p>
    </div>
  );
}