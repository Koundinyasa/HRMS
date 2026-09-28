import { Clock, CheckCircle2, XCircle } from "lucide-react";

type Status = "pending" | "approved" | "rejected" | string;

const STATUS_MAP: Record<string, { label: string; bg: string; text: string; Icon: typeof Clock }> = {
  pending: { label: "Pending", bg: "bg-[#FBE1D0]", text: "text-[#B4590F]", Icon: Clock },
  approved: { label: "Approved", bg: "bg-[#D3F5E4]", text: "text-[#12805C]", Icon: CheckCircle2 },
  rejected: { label: "Rejected", bg: "bg-[#FCE0E0]", text: "text-[#C23B3B]", Icon: XCircle },
};

export default function StatusBadge({ status }: { status: Status }) {
  const key = String(status).toLowerCase();
  const cfg = STATUS_MAP[key] ?? STATUS_MAP.pending;
  const { Icon } = cfg;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}