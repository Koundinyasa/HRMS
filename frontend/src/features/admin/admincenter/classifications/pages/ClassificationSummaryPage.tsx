import { NavLink, useParams } from "react-router-dom";
import {
  Building2,
  Building,
  BadgeCheck,
  Landmark,
  Wallet,
  CalendarDays,
  Clock,
  CircleDollarSign,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import ClassificationNavbar from "../components/ClassificationNavbar";
import { useGetClassificationSummaryQuery } from "../api/classificationApi";

export default function ClassificationSummaryPage() {
  const { domain } = useParams();
  const base = `/${domain}/admin/admin-center/classifications`;

  const { data: summaryResponse, isLoading } = useGetClassificationSummaryQuery();
  const summary = Array.isArray(summaryResponse?.data) ? summaryResponse.data : [];
  const countFor = (name: string) => {
    const item = summary.find((entry) =>
      String(entry.ClassificationName ?? entry.classificationName ?? "")
        .toLowerCase()
        .includes(name.toLowerCase()),
    );
    return Number(item?.Count ?? item?.count ?? 0);
  };

  const leftColumn = [
    {
      title: "Branch",
      to: `${base}/branch`,
      icon: Building2,
      count: countFor("branch"),
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Salary Structure",
      to: `${base}/salary-structure`,
      icon: Wallet,
      count: countFor("salary"),
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Leave Policy",
      to: `${base}/leave-policy/employee/settings/behavior`,
      icon: CalendarDays,
      count: countFor("leave"),
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Attendance",
      to: `${base}/attendance`,
      icon: Clock,
      count: countFor("attendance"),
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Banks",
      to: `${base}/banks`,
      icon: Landmark,
      count: countFor("bank"),
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Designation",
      to: `${base}/designation`,
      icon: BadgeCheck,
      count: countFor("designation"),
      iconBg: "bg-fuchsia-50",
      iconColor: "text-fuchsia-600",
    },
    {
      title: "Cost Center",
      to: `${base}/cost-center`,
      icon: CircleDollarSign,
      count: countFor("cost center"),
      iconBg: "bg-rose-50",
      iconColor: "text-rose-600",
    },
  ];

  const rightColumn = [
    {
      title: "Department",
      to: `${base}/department`,
      icon: Building,
      count: countFor("department"),
      iconBg: "bg-sky-50",
      iconColor: "text-sky-600",
    },
    {
      title: "Team",
      to: `${base}/team`,
      icon: Users,
      count: countFor("team"),
      iconBg: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  const Row = ({
    title,
    to,
    icon: Icon,
    count,
    iconBg,
    iconColor,
  }: {
    title: string;
    to: string;
    icon: typeof Building2;
    count: number;
    iconBg: string;
    iconColor: string;
  }) => (
    <NavLink
      to={to}
      className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 hover:shadow-md hover:border-violet-200 transition-all"
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        <span className="text-[15px] font-medium text-gray-800">{title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[15px] font-semibold text-gray-800">{count}</span>
        <ArrowUpRight size={16} className="text-violet-500" />
      </div>
    </NavLink>
  );

  return (
    <div className="w-full">
      <ClassificationNavbar />

      <div className="mt-6 px-4 sm:px-6 pb-8">
        {isLoading && <p className="mb-4 text-sm text-gray-500">Loading classifications...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl">
          <div className="flex flex-col gap-4">
            {leftColumn.map((row) => (
              <Row key={row.title} {...row} />
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {rightColumn.map((row) => (
              <Row key={row.title} {...row} />
            ))}

            <button
              type="button"
              className="flex-1 min-h-[180px] flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-violet-300 hover:text-violet-500 transition-colors"
            >
              <span className="w-9 h-9 rounded-full bg-violet-100 text-violet-500 flex items-center justify-center">
                <Plus size={18} />
              </span>
              <span className="text-sm">Add custom classification mapping</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
