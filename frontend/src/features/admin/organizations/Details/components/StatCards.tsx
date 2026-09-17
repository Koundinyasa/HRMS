import {
  Users,
  Hourglass,
  UserPlus,
  LogOut,
  UsersRound,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import type { OrganizationStat } from "../types/details.types";

type Trend = {
  direction: "up" | "down" | "flat";
  label: string;
};

type CardConfig = {
  key: string;
  label: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  getValue: (s: OrganizationStat) => string;
  getTrend: (s: OrganizationStat) => Trend;
};

const CARDS: CardConfig[] = [
  {
    key: "totalEmployees",
    label: "Total Employees",
    icon: <Users size={20} strokeWidth={2} />,
    iconBg: "#EAF5FE",
    iconColor: "#2563EB",
    getValue: (s) => String(s.totalEmployees),
    getTrend: () => ({ direction: "flat", label: "0%" }),
  },
  {
    key: "confirmationPending",
    label: "Confirmation Pending",
    icon: <Hourglass size={20} strokeWidth={2} />,
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
    getValue: (s) => String(s.confirmationPending),
    getTrend: (s) =>
      s.confirmationPending > 0
        ? { direction: "up", label: `+${s.confirmationPending}` }
        : { direction: "flat", label: "0%" },
  },
  {
    key: "joinedEmployees",
    label: "Joined Employees",
    icon: <UserPlus size={20} strokeWidth={2} />,
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
    getValue: (s) => String(s.joinedEmployees),
    getTrend: (s) =>
      s.joinedEmployees > 0
        ? { direction: "up", label: `+${s.joinedEmployees}` }
        : { direction: "flat", label: "0%" },
  },
  {
    key: "leftEmployees",
    label: "Left Employees",
    icon: <LogOut size={20} strokeWidth={2} />,
    iconBg: "#FEE2E2",
    iconColor: "#DC2626",
    getValue: (s) => String(s.leftEmployees),
    getTrend: (s) =>
      s.leftEmployees > 0
        ? { direction: "down", label: `-${s.leftEmployees}` }
        : { direction: "flat", label: "0%" },
  },
  {
    key: "genderRatio",
    label: "Gender Ratio",
    icon: <UsersRound size={20} strokeWidth={2} />,
    iconBg: "#EDE9FE",
    iconColor: "#7C3AED",
    getValue: (s) => `M: ${s.maleCount} | F: ${s.femaleCount}`,
    getTrend: () => ({ direction: "flat", label: "0%" }),
  },
  {
    key: "averageService",
    label: "Average Service (yrs)",
    icon: <Briefcase size={20} strokeWidth={2} />,
    iconBg: "#D1FAE5",
    iconColor: "#059669",
    getValue: (s) => s.averageService,
    getTrend: () => ({ direction: "flat", label: "0%" }),
  },
];

function TrendBadge({ trend }: { trend: Trend }) {
  const styles = {
    up: "bg-emerald-50 text-emerald-600",
    down: "bg-red-50 text-red-500",
    flat: "bg-slate-100 text-slate-400",
  }[trend.direction];

  const Icon = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    flat: Minus,
  }[trend.direction];

  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${styles}`}
    >
      <Icon size={11} strokeWidth={2.5} />
      {trend.label}
    </span>
  );
}

export default function StatCards({ stats }: { stats: OrganizationStat }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {CARDS.map((card) => (
        <div
          key={card.key}
          className="
            flex flex-col justify-between rounded-2xl border border-slate-100
            bg-white p-4 shadow-[0_1px_3px_rgba(15,23,42,0.04)]
          "
        >
          <div className="mb-4 flex items-center justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ backgroundColor: card.iconBg, color: card.iconColor }}
            >
              {card.icon}
            </div>
            <TrendBadge trend={card.getTrend(stats)} />
          </div>

          <p className="text-2xl font-bold leading-none text-slate-800">
            {card.getValue(stats)}
          </p>
          <p className="mt-1.5 text-[13px] font-medium text-slate-500">
            {card.label}
          </p>
        </div>
      ))}
    </div>
  );
}