import { X } from "lucide-react";

interface NotificationPanelProps {
  onClose: () => void;
}

export default function NotificationPanel({ onClose }: NotificationPanelProps) {
  return (
    <div className="absolute right-0 top-12 w-[340px] bg-white rounded-2xl border border-slate-100 shadow-xl z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800">
            Notifications
          </h3>
        </div>
        <button
          onClick={onClose}
          aria-label="Close notifications"
          className="text-slate-400 hover:text-slate-600"
        >
          <X size={15} />
        </button>
      </div>

      {/* No notification feed exists yet, so say so instead of showing made-up items. */}
      <p className="px-4 py-8 text-center text-sm text-slate-400">
        No new notifications
      </p>
    </div>
  );
}