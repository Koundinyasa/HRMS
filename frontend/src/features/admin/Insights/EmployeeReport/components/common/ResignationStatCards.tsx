import { Users, Clock, UserCheck, CircleDot, type LucideIcon } from "lucide-react";

interface StatCard {
  label: string;
  value: number | string;
  sub: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

interface ResignationStatCardsProps {
  totalResignations: number;
  pendingInReview: number;
  approved: number;
  thisMonth: number;
  thisMonthLabel: string;
}

export default function ResignationStatCards({
  totalResignations,
  pendingInReview,
  approved,
  thisMonth,
  thisMonthLabel,
}: ResignationStatCardsProps) {
  const cards: StatCard[] = [
    { label: "Total Resignations", value: totalResignations, sub: "All time", icon: Users, iconBg: "bg-[#CBDFFD]", iconColor: "text-[#2563EB]" },
    { label: "Pending / In Review", value: pendingInReview, sub: "Need action", icon: Clock, iconBg: "bg-[#FAE5B3]", iconColor: "text-[#B4590F]" },
    { label: "Approved", value: approved, sub: `${totalResignations ? Math.round((approved / totalResignations) * 100) : 0}% acceptance rate`, icon: UserCheck, iconBg: "bg-[#C1F2D7]", iconColor: "text-[#12805C]" },
    { label: "This Month", value: thisMonth, sub: thisMonthLabel, icon: CircleDot, iconBg: "bg-[#E0D4FC]", iconColor: "text-[#7C3AED]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {cards.map((c) => (
        <div key={c.label} className="bg-white rounded-lg border border-gray-200 shadow-sm px-5 py-4 flex items-start gap-3">
          <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.iconBg}`}>
            <c.icon size={18} className={c.iconColor} />
          </span>
          <div className="min-w-0">
            <div className="text-xs font-medium text-gray-500 truncate">{c.label}</div>
            <div className="text-2xl font-bold text-gray-800 leading-tight">{c.value}</div>
            <div className="text-xs text-gray-400 truncate">{c.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}